import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<string>('')
  const currentInstructionRef = useRef<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/openai')

    eventSource.onmessage = (event) => {
      console.log('initiate');
      console.log(event);
      const sanitized = event.data.replace("data: ", "").trim();
      if (sanitized === "[DONE]") {
        eventSource.close()
      } else {
        const { choices } = JSON.parse(sanitized)
        const text = choices[0].delta?.content ?? ''
        console.log(text);
        //var c = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = canvasRef.current?.getContext("2d");
        if (text.includes('ctx')) {
          currentInstructionRef.current = text;
        } else if (currentInstructionRef.current) {
          console.log(`Current Instruction`, currentInstructionRef.current);
          if (text.includes(';')) {
            eval(currentInstructionRef.current + text);
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
  }, [])

  return (
    <div>
      <p>{data}</p>
      <canvas id="canvas" width="500" height="500" ref={canvasRef}></canvas>
    </div>
  )
}