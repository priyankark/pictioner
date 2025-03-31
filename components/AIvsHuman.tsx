import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Input, chakra, Text, Grid } from '@chakra-ui/react';
import CanvasContainer from './CanvasContainer';
import { fetchEventSource } from '@/utils/eventsource/eventsource';

const AssistantMessage = chakra(Box, {
  baseStyle: {
    p: '4',
    borderRadius: 'lg',
    bg: 'gray.200',
    mb: '4',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
});

const UserMessage = chakra(Box, {
  baseStyle: {
    p: '4',
    borderRadius: 'lg',
    bg: 'purple.300',
    color: 'white',
    mb: '4',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
});

const StartButton = chakra(Button, {
  baseStyle: {
    fontSize: 'xl',
    px: '8',
    py: '4',
    bg: 'purple.500',
    color: 'white',
    borderRadius: 'full',
    _hover: {
      bg: 'purple.600',
    },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    color: 'gray.700',
  },
});

const AIvsHuman = () => {
  const [data, setData] = useState<string>('');
  const currentInstructionRef = useRef<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatHistory = useRef<
    {
      role: 'user' | 'assistant';
      content: string;
    }[]
  >([]);
  const [currentTurn, setCurrentTurn] = useState<'user' | 'assistant'>('user');
  const [userInput, setUserInput] = useState<string>('start round 1');
  const [hasGameStarted, setHasGameStarted] = useState(false);

  useEffect(() => {
    if (currentTurn === 'assistant') {
      chatHistory.current = [
        ...chatHistory.current,
        {
          role: 'user',
          content: userInput,
        },
      ];
      const eventSource = new EventSource(
        `/api/openaiedge?history=${encodeURIComponent(
          JSON.stringify(chatHistory.current)
        )}`
      );

      eventSource.onmessage = (event) => {
        const sanitized = event.data.replace('data: ', '').trim();
        if (sanitized === '[DONE]') {
          setData('');
          setCurrentTurn('user');
          eventSource.close();
        } else {
          const { choices } = JSON.parse(sanitized);
          const text = choices[0].delta?.content ?? '';
          if (
            chatHistory.current[chatHistory.current.length - 1]?.role !==
            'assistant'
          ) {
            chatHistory.current.push({
              role: 'assistant',
              content: text,
            });
          } else {
            chatHistory.current[chatHistory.current.length - 1].content += text;
          }
          var ctx = canvasRef.current?.getContext('2d');
          if (text.includes('ctx')) {
            currentInstructionRef.current = text;
          } else if (currentInstructionRef.current) {
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
            setData((prev) => prev + text);
          }
        }
      };

      eventSource.onerror = (error) => {
        console.log(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [currentTurn, userInput]);

  return (
    <>
      {!hasGameStarted && (
        <Box textAlign="center" gap={4}>
          <Grid
            templateRows="1fr"
            templateColumns="1fr"
            gap={1}
            alignItems="center"
            justifyContent="center"
            minWidth={'300px'}
            marginTop={5}
            maxWidth="500px"
            marginX="auto"
          >
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                AI vs Human Pictionary
              </Text>
            </Box>
            <Box alignItems={'center'} justifyContent={'center'}>
              <StartButton
                onClick={() => {
                  setHasGameStarted(true);
                  setCurrentTurn('assistant');
                }}
                size="sm"
                shadow={'lg'}
                mx="auto"
              >
                Start the game
              </StartButton>
            </Box>
          </Grid>
        </Box>
      )}
      {hasGameStarted && (
        <Box
          height="100vh"
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="center"
          flexWrap="wrap"
          alignItems="start"
          padding={4}
        >
          <Box
            maxWidth={{ base: '100%', md: '50%' }}
            flex="1"
            marginX={{ base: 'auto', md: '0' }}
            marginBottom={{ base: '4', md: '0' }}
            minHeight={'80vh'}
            height="80vh"
            overflowY="auto"
          >
            {chatHistory.current.map((ele, idx) => {
              if (ele.role === 'assistant') {
                const sanitizedTextWithoutAnswer = ele.content.replace(
                  /~[^~]*~/g,
                  ''
                );
                const ctxIndex = sanitizedTextWithoutAnswer.indexOf('ctx');
                if (ctxIndex !== -1) {
                  const sanitizeText = sanitizedTextWithoutAnswer.slice(
                    0,
                    ctxIndex
                  );
                  return (
                    <AssistantMessage
                      key={idx}
                      maxWidth="500px"
                      width="100%"
                      marginX="auto"
                    >
                      <Box>
                        <Box>
                          <strong>{ele.role}</strong>
                        </Box>
                        <Box>{sanitizeText}</Box>
                      </Box>
                    </AssistantMessage>
                  );
                }
                return (
                  <AssistantMessage
                    key={idx}
                    maxWidth="500px"
                    width="100%"
                    marginX="auto"
                  >
                    <Box>
                      <Box>
                        <strong>{ele.role}</strong>
                      </Box>
                      <Box>{sanitizedTextWithoutAnswer}</Box>
                    </Box>
                  </AssistantMessage>
                );
              }
              return (
                <UserMessage
                  key={idx}
                  maxWidth="500px"
                  width="100%"
                  marginX="auto"
                >
                  <Box>
                    <Box>
                      <strong>{ele.role}</strong>
                    </Box>
                    <Box>{ele.content}</Box>
                  </Box>
                </UserMessage>
              );
            })}
            {currentTurn === 'user' && (
              <UserMessage maxWidth="500px" width="100%" marginX="auto">
                <Box marginBottom={2}>
                  <Box>
                    <strong>user</strong>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box flex="1">
                    <UserInput
                      type="text"
                      onChange={(ev) => setUserInput(ev.target.value)}
                    />
                  </Box>
                  <Box marginLeft="2">
                    <Button
                      onClick={() => setCurrentTurn('assistant')}
                      size="sm"
                      backgroundColor={'gray.500'}
                      color={'white'}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </UserMessage>
            )}
          </Box>
          <Box
            maxWidth={{ base: '100%', md: '50%' }}
            flex="1"
            marginX={{ base: 'auto', md: '0' }}
            marginBottom={{ base: '4', md: '0' }}
            marginLeft={{ base: '4', md: '4' }}
            minHeight="50vh"
          >
            <CanvasContainer>
              <canvas
                id="canvas"
                width="500"
                height="500"
                ref={canvasRef}
                style={{ backgroundColor: 'white' }}
              ></canvas>
            </CanvasContainer>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AIvsHuman;
