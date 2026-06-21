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

    const { feature, birthdate, birthdatePartner, userName, partnerName, userMessage } = body;

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

    const contextPayload: any = {
      feature,
      weton,
      namaUser: userName,
      pertanyaanUser: userMessage,
    };

    if (partnerName) contextPayload.namaPasangan = partnerName;
    if (wetonPartner) contextPayload.wetonPasangan = wetonPartner;
    if (paduanJodoh) contextPayload.paduanJodoh = paduanJodoh;
    if (catatanPasangan) contextPayload.catatanPasangan = catatanPasangan;

    const geminiResponse = await callGeminiStream(SYSTEM_PROMPT, contextPayload, apiKey);

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

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const lines = text.split('\n').filter((line) => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '');
                if (dataStr === '[DONE]') break;
                try {
                  const data = JSON.parse(dataStr);
                  const candidate = data.candidates?.[0];
                  // Extract chunk text if available
                  const chunkStr = candidate?.content?.parts?.[0]?.text;
                  if (chunkStr) {
                    controller.enqueue(encoder.encode(chunkStr));
                  }
                } catch (e) {
                  // Ignore parse error on partial chunks
                }
              }
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
