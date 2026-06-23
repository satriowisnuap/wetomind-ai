export async function callGeminiStream(systemInstruction: string, contents: any[], apiKey: string): Promise<Response> {
    const model = 'gemini-3.1-flash-lite';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const requestBody = {
        systemInstruction: {
            parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
            thinkingConfig: {
                thinkingBudget: 0,
            },
        },
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || 'Failed to call Gemini API');
    }

    return response;
}
