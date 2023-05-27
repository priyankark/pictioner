import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<string>('')
  const currentInstructionRef = useRef<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatHistory = useRef<({
    role: 'user' | 'assistant',
    content: string
  })[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'user' | 'assistant'>('user');
  const [userInput, setUserinput] = useState<string>('start the game');

  useEffect(() => {
    if (currentTurn === 'assistant') {
      chatHistory.current = [...chatHistory.current, {
        role: 'user',
        content: userInput
      }]
      const eventSource = new EventSource(`/api/openai?history=${encodeURIComponent(JSON.stringify(chatHistory.current))}`)

      eventSource.onmessage = (event) => {
        console.log('initiate');
        console.log(event);
        const sanitized = event.data.replace("data: ", "").trim();
        if (sanitized === "[DONE]") {
          setData("");
          setCurrentTurn('user');
          eventSource.close()
        } else {
          const { choices } = JSON.parse(sanitized)
          const text = choices[0].delta?.content ?? ''
          console.log(text);
          //Update chat history
          if (chatHistory.current[chatHistory.current.length - 1]?.role !== 'assistant') {
            chatHistory.current.push({
              role: 'assistant',
              content: text
            })
          } else {
            chatHistory.current[chatHistory.current.length - 1].content += text;
          }
          var ctx = canvasRef.current?.getContext("2d");
          if (text.includes('ctx')) {
            currentInstructionRef.current = text;
          } else if (currentInstructionRef.current) {
            console.log(`Current Instruction`, currentInstructionRef.current);
            if (text.includes(';')) {
              eval(currentInstructionRef.current + text);
              ctx?.stroke();
              currentInstructionRef.current = '';
            } else {
              currentInstructionRef.current += text;
            }
          } else {
            setData(prev => prev + text)
          }
        }
      }

      eventSource.onerror = (error) => {
        console.log(error)
        eventSource.close();
      }

      return () => {
        eventSource.close()
      }
    }
  }, [currentTurn, userInput])

  return (
    <div>
      <canvas id="canvas" width="500" height="500" ref={canvasRef}></canvas>
      <div key={currentTurn}>
        {
          chatHistory.current.length === 0 && <button onClick={() => setCurrentTurn('assistant')}>
            {'Start the game'}
          </button>
        }
        {
          chatHistory.current.map(ele => {
            /** Remove evrything starting from ctx.beginStroke() and only display the rest */
            if (ele.role === 'assistant') {
              const ctxIndex = ele.content.indexOf('ctx');
              if (ctxIndex !== -1) {
                return <div>
                  <p>{ele.role}</p>
                  <p>{ele.content.slice(0, ctxIndex)}</p>
                </div>
              }
            }
            return <div>
              <p>{ele.role}</p>
              <p>{ele.content}</p>
            </div>
          }
          )
        }
        {
          currentTurn === 'user' && chatHistory.current.length > 0 && <div>
            <input type='text' onChange={(ev) => setUserinput(ev.target.value)} />
            <button onClick={() => setCurrentTurn('assistant')}>
              {'Submit'}
            </button>
          </div>
        }
      </div>
    </div>
  )
}