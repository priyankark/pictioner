"use client";
import { useEffect, useRef, useState, Suspense } from 'react'
import { Box, Button, Input, chakra } from '@chakra-ui/react';
import { GameStart } from './GameStart';

const AssistantMessage = chakra(Box, {
  baseStyle: {
    p: '4',
    borderRadius: 'md',
    bg: 'gray.200',
    mb: '4',
  },
});

const UserMessage = chakra(Box, {
  baseStyle: {
    p: '4',
    borderRadius: 'md',
    bg: 'teal.200',
    mb: '4',
  },
});

const StartButton = chakra(Button, {
  baseStyle: {
    fontSize: 'xl',
    px: '8',
    py: '4',
    bg: 'teal.500',
    color: 'white',
    borderRadius: 'md',
    _hover: {
      bg: 'teal.600',
    },
  },
});

const UserInput = chakra(Input, {
  baseStyle: {
    borderRadius: 'md',
    bg: 'white',
    border: '1px solid gray',
    p: '2',
    mr: '2',
    flex: '1',
  },
});


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
  const [hasGameStarted, setHasGameStarted] = useState(false);

  const previousRoundsDrawings = useRef<string[]>([]);

  useEffect(() => {
    if (currentTurn === 'assistant') {
      chatHistory.current = [...chatHistory.current, {
        role: 'user',
        content: userInput
      }]
      const eventSource = new EventSource(`/api/openaiedge?history=${encodeURIComponent(JSON.stringify(chatHistory.current))}`)

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
              try {
                eval(currentInstructionRef.current + text);
              } catch (ex) {
                console.error(ex);
              }
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
    (<Suspense fallback={<div>Loading...</div>}>
      <Box>
        <Box>
          {chatHistory.current.length === 0 && currentRoundNumber === 1 && (
            <Box verticalAlign={'space-between'} alignItems={'center'} gap={20}>
              <Box>
                <GameStart />
              </Box>
              <Box alignItems={'center'} justifyContent={'center'} style={{ paddingLeft: 50 }}>
                <StartButton onClick={() => {
                  setHasGameStarted(true);
                  setCurrentTurn('assistant')
                }} size="sm">
                  Start the game
                </StartButton>
              </Box>
            </Box>
          )}
          {hasGameStarted && <canvas id="canvas" width="500" height="500" ref={canvasRef}></canvas>}
          {chatHistory.current.map((ele, idx) => {
            if (ele.role === 'assistant') {
              const sanitizedTextWithoutAnswer = ele.content.replace(/~[^~]*~/g, '');
              const ctxIndex = sanitizedTextWithoutAnswer.indexOf('ctx');
              if (ctxIndex !== -1) {
                const sanitizeText = sanitizedTextWithoutAnswer.slice(0, ctxIndex);
                return (
                  <AssistantMessage key={idx}>
                    <p>{ele.role}</p>
                    <p>{sanitizeText}</p>
                  </AssistantMessage>
                );
              }
              return (
                <AssistantMessage key={idx}>
                  <p>{ele.role}</p>
                  <p>{sanitizedTextWithoutAnswer}</p>
                </AssistantMessage>
              );
            }
            if (ele.role === 'user') {
              if (ele.content.includes('Previous round drawings')) {
                return (
                  <UserMessage key={idx}>
                    <p>{ele.role}</p>
                    <p>{ele.content.slice(0, ele.content.indexOf('Previous round drawings'))}</p>
                  </UserMessage>
                );
              }
            }
            return (
              <UserMessage key={idx}>
                <p>{ele.role}</p>
                <p>{ele.content}</p>
              </UserMessage>
            );
          })}
          {currentTurn === 'user' && chatHistory.current.length > 0 && !chatHistory.current[chatHistory.current.length - 1]?.content.includes('YOU WIN') && !chatHistory.current[chatHistory.current.length - 1]?.content.includes('YOU LOSE') && (
            <UserMessage>
              <p>User</p>
              <UserInput type="text" onChange={(ev) => setUserinput(ev.target.value)} />
              <Button onClick={() => setCurrentTurn('assistant')} size="sm">
                Submit
              </Button>
            </UserMessage>
          )}
          {(chatHistory.current[chatHistory.current.length - 1]?.content?.includes('YOU WIN') || chatHistory.current[chatHistory.current.length - 1]?.content?.includes('YOU LOSE')) && (
            <Box alignItems={'horizontal'}>
              <Box>
                <Button
                  onClick={() => {
                    if (chatHistory.current[chatHistory.current.length - 1]?.content?.includes('YOU WIN')) {
                      setCurrentRoundNumber((n) => n + 1);
                      previousRoundsDrawings.current.push(chatHistory.current[chatHistory.current.length - 2]?.content);
                      console.log(`previousRoundDrawings`, previousRoundsDrawings.current);
                      setUserinput(
                        `start round ${currentRoundNumber + 1}. Previous round drawings were: ${previousRoundsDrawings.current.join(', ')}. Please AVOID drawing these again this round and in future rounds.`
                      );
                      setCurrentTurn('assistant');
                      canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                      chatHistory.current = []; // Remove everything from chat history except the last element
                      setNextRoundButton(false);
                    } else {
                      setCurrentRoundNumber(1);
                      previousRoundsDrawings.current = [];
                      setUserinput(`start round 1`);
                      setCurrentTurn('assistant');
                      canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                      chatHistory.current = []; // Remove everything from chat history except the last element
                      setNextRoundButton(false);
                    }
                  }}
                >
                  {chatHistory.current[chatHistory.current.length - 1]?.content?.includes('YOU WIN') ? 'Start next round' : 'Retry'}
                </Button>
              </Box>
              <Box>
                <Button>
                  {'Enter Leaderboard'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Suspense>
    )
  );
}