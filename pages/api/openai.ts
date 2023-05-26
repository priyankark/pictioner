import type { NextApiRequest, NextApiResponse } from 'next'
import SSE from 'ssestream'
import { EventSourceMessage, fetchEventSource } from '@ai-zen/node-fetch-event-source'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Connection', 'keep-alive');
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

    // if (stream) {
    //     stream.on('data', (chunk: Buffer) => {
    //         const data = chunk.toString().replace('data: ', '').trim();
    //         console.log(data);
    //         if(data==="data: [DONE]") {
    //                         res.write(data);
    //             res.end();
    //         }
    //         res.write(data);
    //     });

    //     stream.on('end', () => {
    //         res.status(200);
    //         res.end();
    //     })
    // } else {
    //     res.end();
    // }
}