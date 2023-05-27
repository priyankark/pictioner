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
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [userInput, setUserinput] = useState<string>('start round 1');
  const [showNextRoundButton, setNextRoundButton] = useState(false);
  const currentRoundAnswerRef = useRef('');

  const previousRoundsDrawings = useRef<string[]>([]);

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
            if (text.includes('~')) {
              if (currentRoundAnswerRef.current) currentRoundAnswerRef.current = '';
              else currentRoundAnswerRef.current = text;
            }
            if (currentRoundAnswerRef.current) {
              currentRoundAnswerRef.current += text;
            } else {
              setData(prev => prev + text)
            }
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
          chatHistory.current.map((ele, idx) => {
            /** Remove evrything starting from ctx.beginStroke() and only display the rest */
            if (ele.role === 'assistant') {

              /** Using Regex remove '~ Answer ~' pattern from sanitizedText */
              const sanitizedTextWithoutAnswer = ele.content.replace(/~[^~]*~/g, '');
              const ctxIndex = sanitizedTextWithoutAnswer.indexOf('ctx');
              if (ctxIndex !== -1) {
                const sanitizeText = sanitizedTextWithoutAnswer.slice(0, ctxIndex);
                return <div key={idx}>
                  <p>{ele.role}</p>
                  <p>{sanitizeText}</p>
                </div>
              }
              return <div key={idx}>
                <p>{ele.role}</p>
                <p>{sanitizedTextWithoutAnswer}</p>
              </div>
            }
            if (ele.role === 'user') {
              /** Remove Previous drawings history */
              if (ele.content.includes('Previous round drawings')) {
                return <div key={idx}>
                  <p>{ele.role}</p>
                  <p>{ele.content.slice(0, ele.content.indexOf('Previous round drawings'))}</p>
                </div>
              }
            }
            return <div key={idx}>
              <p>{ele.role}</p>
              <p>{ele.content}</p>
            </div>
          }
          )
        }
        {
          currentTurn === 'user' && chatHistory.current.length > 0 && !chatHistory.current[chatHistory.current.length - 1]?.content.includes("YOU WIN") && <div>
            <input type='text' onChange={(ev) => setUserinput(ev.target.value)} />
            <button onClick={() => setCurrentTurn('assistant')}>
              {'Submit'}
            </button>
          </div>
        }
        {
          chatHistory.current[chatHistory.current.length - 1]?.content?.includes("YOU WIN") && <button onClick={() => {
            setCurrentRoundNumber(n => n + 1);
            previousRoundsDrawings.current.push(chatHistory.current[chatHistory.current.length - 2]?.content);
            console.log(`previousRoundDrawings`, previousRoundsDrawings.current);
            setUserinput(`start round ${currentRoundNumber + 1}. Previous round drawings were: ${previousRoundsDrawings.current.join(', ')} Please AVOID drawing these again this round and future rounds.`);
            setCurrentTurn('assistant');
            canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            /** Remove everything from chat history except the last element */
            chatHistory.current = [];
            setNextRoundButton(false);
          }}>{'Start next round'}</button>
        }
      </div>
    </div>
  )
}