import { fetchEventSource } from '@/utils/eventsource/eventsource';
import { EventSourceMessage } from '@/utils/eventsource/parse';
import { basePrompt } from '@/utils/prompt/basePrompt';
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from 'eventsource-parser';
import { NextRequest } from 'next/server';

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
            await fetchEventSource('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    messages: [...basePrompt, ...history],
                    "model": "gpt-4-0314",
                    stream: true,
                    max_tokens: 2800,
                    temperature: 0.3
                }),
                onmessage: (event: EventSourceMessage) => {
                    console.log(event);
                    controller.enqueue(encoder.encode(`data: ${event.data}\n\n`));
                    if (event.data === "[DONE]") {
                        controller.enqueue(encoder.encode('[DONE]'));
                        return;
                    }
                },
                onerror: (error: Error) => {
                    console.log(error);
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
