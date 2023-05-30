import { fetchEventSource } from '@/utils/eventsource/eventsource';
import { EventSourceMessage } from '@/utils/eventsource/parse';
import { basePrompt } from '@/utils/prompt/basePrompt';
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from 'eventsource-parser';
import { NextRequest } from 'next/server';
import { themes } from '@/utils/prompt/themes';

export const config = {
    runtime: 'edge',
};

export default async function handler(
    req: NextRequest
) {
    const history = JSON.parse((new URL(req.url).searchParams.get('history') as string) ?? "[]");

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
        async start(controller) {
            // choose 5 random themes
            const themesForThisRound = themes.themes.sort(() => Math.random() - Math.random()).slice(0, 5);
            const systemPrompt = basePrompt[0].content + `\n\nSome themes for this round that you can consider drawing (choose one): ${themesForThisRound.join(', ')}`;
            console.log(`themes for this round: ${themesForThisRound}`)
            await fetchEventSource('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'system', content: systemPrompt }, ...history],
                    "model": "gpt-4-0314",
                    stream: true,
                    max_tokens: 2800,
                    temperature: 0
                }),
                onmessage: (event: EventSourceMessage) => {
                    controller.enqueue(encoder.encode(`data: ${event.data}\n\n`));
                    if (event.data === "[DONE]") {
                        controller.enqueue(encoder.encode('[DONE]'));
                        return;
                    }
                },
                onerror: (error: Error) => {
                    console.log(error);
                    controller.enqueue(encoder.encode('[ERROR]'));
                    controller.close();
                },
                onclose: () => {
                    controller.close();
                }
            });
        },
    });
    return new Response(readable, {
        headers: {
            'Cache-Control': 'no-cache, no-transform',
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive',
            'Content-Encoding': 'none'
        },
    });
}
