import { fetchEventSource } from '@/utils/eventsource/eventsource';
import { EventSourceMessage } from '@/utils/eventsource/parse';
import { basePrompt } from '@/utils/prompt/basePrompt';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none'
    });

    console.log(req.query);

    const history = JSON.parse((req.query.history as string) ?? "[]");
    try {
        fetchEventSource('https://api.openai.com/v1/chat/completions', {
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
                //console.log(event);
                res.write(`data: ${event.data}\n\n`);
                if (event.data === "[DONE]") {
                    res.end();
                }
            },
            onerror: (error: Error) => {
                console.log(error);
                res.end();
            },
            onclose: () => {
                res.end();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}