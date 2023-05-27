import { fetchEventSource } from '@/utils/eventsource';
import { EventSourceMessage } from '@/utils/parse';
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

    fetchEventSource('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: 'Hello, World! How',
            "model": "text-davinci-003",
            stream: true,
            max_tokens: 5
        }),
        onmessage: (event: EventSourceMessage) => {
            console.log(event);
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
}