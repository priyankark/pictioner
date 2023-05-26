import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<string>('')

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
        const text = choices[0].text
        console.log(text);
        setData(prev => prev + text)
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
    </div>
  )
}