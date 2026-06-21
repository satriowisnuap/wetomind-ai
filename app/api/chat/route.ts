import { NextRequest } from 'next/server';
import { getWeton, getPaduanJodoh, WetonData } from '@/lib/javaCalendar';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { callGeminiStream } from '@/lib/geminiClient';
import { ChatRequestPayload } from '@/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response('Konfigurasi sistem belum lengkap. Mohon hubungi pengelola aplikasi.', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    const body: ChatRequestPayload = await req.json();

    const { feature, birthdate, birthdatePartner, userName, partnerName, userMessage, history } = body;

    // Validate inputs
    if (!userName || !birthdate) {
      return new Response('Tanggal lahir atau nama yang dimasukkan tidak valid. Mohon periksa kembali.', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    let wetonPartner: WetonData | undefined;
    let paduanJodoh: string | undefined;
    let catatanPasangan: string | undefined;

    if (feature === 'UJI_JODOH' || feature === 'SINERGI_REKAN') {
      if (!partnerName) {
        return new Response('Untuk fitur ini, data lengkap kedua pihak diperlukan. Mohon isi nama dan tanggal lahir keduanya.', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }

      if (!birthdatePartner) {
        catatanPasangan = `Nama pasangan ${partnerName} kemungkinan tokoh publik. Tanggal lahir tidak tersedia. Berikan analisis umum berdasarkan nama dengan disclaimer bahwa weton tidak dapat dihitung.`;
      } else {
        wetonPartner = getWeton(birthdatePartner);
      }
    }

    const weton = getWeton(birthdate);

    if (feature === 'UJI_JODOH' && wetonPartner) {
      paduanJodoh = getPaduanJodoh(weton.totalNeptu, wetonPartner.totalNeptu);
    }

    const firstUserMsgText = history && history.length > 0 ? history[0].text : userMessage;

    const contextPayload: any = {
      feature,
      weton,
      namaUser: userName,
      pertanyaanUser: firstUserMsgText,
    };

    if (partnerName) contextPayload.namaPasangan = partnerName;
    if (wetonPartner) contextPayload.wetonPasangan = wetonPartner;
    if (paduanJodoh) contextPayload.paduanJodoh = paduanJodoh;
    if (catatanPasangan) contextPayload.catatanPasangan = catatanPasangan;

    // Build the contents array for Gemini
    const contents: any[] = [];

    if (history && history.length > 0) {
      // First message is user, we wrap it in contextPayload JSON
      contents.push({
        role: 'user',
        parts: [{ text: JSON.stringify(contextPayload) }],
      });

      // Add remaining history
      for (let i = 1; i < history.length; i++) {
        const msg = history[i];
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }

      // Add current message as final user turn
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    } else {
      // No history, just the single current user message
      contents.push({
        role: 'user',
        parts: [{ text: JSON.stringify(contextPayload) }],
      });
    }

    const geminiResponse = await callGeminiStream(SYSTEM_PROMPT, contents, apiKey);

    if (!geminiResponse.body) {
      throw new Error('No body in Gemini response');
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = '';
        let streamDone = false;

        // Helper: extract incremental text from a parsed Gemini SSE chunk.
        // Rules:
        //  1. Do not skip candidates with finishReason. Incremental streams may contain
        //     final content in the same chunk as the finishReason.
        //  2. Skip parts that are thinking tokens (thought: true).
        function extractText(data: any): string {
          const candidate = data?.candidates?.[0];
          const parts: any[] = candidate?.content?.parts ?? [];
          // Find the first non-thinking text part
          const textPart = parts.find((p: any) => !p.thought && typeof p.text === 'string');
          return textPart?.text ?? '';
        }

        try {
          while (!streamDone) {
            const { done, value } = await reader.read();
            if (done) {
              // Process any remaining incomplete line in the buffer
              if (buffer) {
                const line = buffer.trim();
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6); // remove 'data: '
                  try {
                    const chunkStr = extractText(JSON.parse(dataStr));
                    if (chunkStr) controller.enqueue(encoder.encode(chunkStr));
                  } catch (e) { /* ignore */ }
                }
              }
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              if (!trimmed.startsWith('data: ')) continue;
              const dataStr = trimmed.slice(6); // remove 'data: '
              if (dataStr === '[DONE]') {
                streamDone = true; // signal outer while to stop
                break;
              }
              try {
                const chunkStr = extractText(JSON.parse(dataStr));
                if (chunkStr) controller.enqueue(encoder.encode(chunkStr));
              } catch (e) { /* ignore partial chunks */ }
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    const errMsg = error?.message || String(error);
    console.error('Chat API Error:', errMsg);
    return new Response(
      `Maaf, terjadi gangguan pada sistem analisis. Detail: ${errMsg}`,
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }
}
