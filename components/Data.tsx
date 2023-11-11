import React, { useEffect, useRef, useState, Suspense } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Grid,
  Input,
  chakra,
  Text,
} from "@chakra-ui/react";
import { GameStart } from "./GameStart";
import va from "@vercel/analytics";
import CanvasContainer from "./CanvasContainer";
import MotionBox from "./MotionBox";
import ScoreCard from "./ScoreCard";
import { Varta } from "next/font/google";
import { FeedbackCapture } from "./Feedback";

const AssistantMessage = chakra(Box, {
  baseStyle: {
    p: "4",
    borderRadius: "lg",
    bg: "gray.200",
    mb: "4",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
});

const UserMessage = chakra(Box, {
  baseStyle: {
    p: "4",
    borderRadius: "lg",
    bg: "purple.300",
    color: "white",
    mb: "4",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
});

const StartButton = chakra(Button, {
  baseStyle: {
    fontSize: "xl",
    px: "8",
    py: "4",
    bg: "purple.500",
    color: "white",
    borderRadius: "full",
    _hover: {
      bg: "purple.600",
    },
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
});

const UserInput = chakra(Input, {
  baseStyle: {
    borderRadius: "md",
    bg: "white",
    border: "1px solid gray",
    p: "2",
    mr: "2",
    flex: "1",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color: "gray.700",
  },
});

export default function Home() {
  const [data, setData] = useState<string>("");
  const currentInstructionRef = useRef<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatHistory = useRef<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);
  const [currentTurn, setCurrentTurn] = useState<"user" | "assistant">("user");
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [userInput, setUserinput] = useState<string>("start round 1");
  const [showNextRoundButton, setNextRoundButton] = useState(false);
  const currentRoundAnswerRef = useRef("");
  const [hasGameStarted, setHasGameStarted] = useState(false);

  const previousRoundsDrawings = useRef<string[]>([]);

  useEffect(() => {
    if (currentTurn === "assistant") {
      chatHistory.current = [
        ...chatHistory.current,
        {
          role: "user",
          content: userInput,
        },
      ];
      const eventSource = new EventSource(
        `/api/openaiedge?history=${encodeURIComponent(
          JSON.stringify(chatHistory.current)
        )}`
      );

      eventSource.onmessage = (event) => {
        const sanitized = event.data.replace("data: ", "").trim();
        if (sanitized === "[DONE]") {
          setData("");
          setCurrentTurn("user");
          eventSource.close();
        } else {
          const { choices } = JSON.parse(sanitized);
          const text = choices[0].delta?.content ?? "";
          //Update chat history
          if (
            chatHistory.current[chatHistory.current.length - 1]?.role !==
            "assistant"
          ) {
            chatHistory.current.push({
              role: "assistant",
              content: text,
            });
          } else {
            chatHistory.current[chatHistory.current.length - 1].content += text;
          }
          var ctx = canvasRef.current?.getContext("2d");
          if (text.includes("ctx")) {
            currentInstructionRef.current = text;
          } else if (currentInstructionRef.current) {
            if (text.includes(";")) {
              try {
                eval(currentInstructionRef.current + text);
              } catch (ex) {
                console.error(ex);
              }
              ctx?.stroke();
              currentInstructionRef.current = "";
            } else {
              currentInstructionRef.current += text;
            }
          } else {
            if (text.includes("~")) {
              if (currentRoundAnswerRef.current)
                currentRoundAnswerRef.current = "";
              else currentRoundAnswerRef.current = text;
            }
            if (currentRoundAnswerRef.current) {
              currentRoundAnswerRef.current += text;
            } else {
              setData((prev) => prev + text);
            }
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

  // Variable to track if logged victory for round already or not
  const [loggedVictoryForRound, setLoggedVictoryForRound] = useState<number[]>(
    []
  );

  React.useEffect(() => {
    if (!loggedVictoryForRound.includes(currentRoundNumber)) {
      if (
        chatHistory.current[chatHistory.current.length - 1]?.content?.includes(
          "YOU LOSE"
        )
      ) {
        va.track(`game-lost-${currentRoundNumber}`, {
          content: chatHistory.current[chatHistory.current.length - 1]?.content,
        });
      }
      setLoggedVictoryForRound((prev) => [...prev, currentRoundNumber]);
    }
  }, [
    chatHistory.current[chatHistory.current.length - 1]?.content,
    currentRoundNumber,
    loggedVictoryForRound,
  ]);

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
            minWidth={"300px"}
            marginTop={5}
            maxWidth="500px"
            marginX="auto"
          >
            <Box>
              <GameStart />
            </Box>
            <Box alignItems={"center"} justifyContent={"center"}>
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                alignItems="center"
                justifyContent="center"
              >
                <StartButton
                  onClick={() => {
                    va.track("game-started");
                    setHasGameStarted(true);
                    setCurrentTurn("assistant");
                  }}
                  size="sm"
                  shadow={"lg"}
                  mx="auto"
                >
                  Start the game
                </StartButton>
              </MotionBox>
            </Box>
          </Grid>
          {
            <Alert status="warning" mb={4}>
              <AlertIcon />
              {`This game doesnot work well on mobile based browsers yet!`}
            </Alert>
          }
          {
            <Box
              display="flex"
              flexDirection="column"
              bg="gray.100"
              border="1px solid gray.300"
              borderRadius="lg"
              p={5}
              boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
              maxWidth="400px"
              mx="auto"
              my={4}
            >
              <Alert
                status="info"
                borderRadius="md"
                boxShadow="0 2px 4px 0 rgba(0,0,0,0.1)"
                className="selected-code"
                p={4}
                mb={4}
              >
                <Text mb={3} wordBreak="break-word">
                  Try the new Pictioner GPT Agent powered by ChatGPT+!
                </Text>
                <Button
                  onClick={() => {
                    window.location.href =
                      "https://chat.openai.com/g/g-4201Mfab3-pictioner";
                  }}
                  size="md"
                  shadow="md"
                  colorScheme="blue"
                  width="full"
                  ml={5}
                  borderRadius="md"
                >
                  Try Now!
                </Button>
              </Alert>
            </Box>
          }
        </Box>
      )}
      {hasGameStarted && (
        <Box
          height="100vh"
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
          flexWrap="wrap"
          alignItems="start"
          padding={4}
        >
          <Box
            maxWidth={{ base: "100%", md: "50%" }}
            flex="1"
            marginX={{ base: "auto", md: "0" }}
            marginBottom={{ base: "4", md: "0" }}
            minHeight={"80vh"}
            height="80vh"
            overflowY="auto"
          >
            {chatHistory.current.map((ele, idx) => {
              if (ele.role === "assistant") {
                const sanitizedTextWithoutAnswer = ele.content.replace(
                  /~[^~]*~/g,
                  ""
                );
                const ctxIndex = sanitizedTextWithoutAnswer.indexOf("ctx");
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
              if (ele.role === "user") {
                if (ele.content.includes("Previous round drawings")) {
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
                        <Box>
                          {ele.content.slice(
                            0,
                            ele.content.indexOf("Previous round drawings")
                          )}
                        </Box>
                      </Box>
                    </UserMessage>
                  );
                }
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
            {currentTurn === "user" &&
              chatHistory.current.length > 0 &&
              !chatHistory.current[
                chatHistory.current.length - 1
              ]?.content.includes("YOU WIN") &&
              !chatHistory.current[
                chatHistory.current.length - 1
              ]?.content.includes("YOU LOSE") && (
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
                        onChange={(ev) => setUserinput(ev.target.value)}
                      />
                    </Box>
                    <Box marginLeft="2">
                      <Button
                        onClick={() => setCurrentTurn("assistant")}
                        size="sm"
                        backgroundColor={"gray.500"}
                        color={"white"}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </UserMessage>
              )}
            {(chatHistory.current[
              chatHistory.current.length - 1
            ]?.content?.includes("YOU WIN") ||
              chatHistory.current[
                chatHistory.current.length - 1
              ]?.content?.includes("YOU LOSE")) && (
              <Grid
                templateRows="1fr"
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={4}
                alignItems="center"
                maxWidth="500px"
                width="100%"
                marginX="auto"
              >
                <Box>
                  <MotionBox
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      onClick={() => {
                        if (
                          chatHistory.current[
                            chatHistory.current.length - 1
                          ]?.content?.includes("YOU WIN")
                        ) {
                          setCurrentRoundNumber((n) => n + 1);
                          va.track("game-next-round");
                          previousRoundsDrawings.current.push(
                            chatHistory.current[chatHistory.current.length - 2]
                              ?.content
                          );
                          setUserinput(
                            `start round ${
                              currentRoundNumber + 1
                            }. Previous round drawings were: ${previousRoundsDrawings.current.join(
                              ", "
                            )}. Please AVOID drawing these again this round and in future rounds.`
                          );
                          setCurrentTurn("assistant");
                          canvasRef.current
                            ?.getContext("2d")
                            ?.clearRect(
                              0,
                              0,
                              canvasRef.current.width,
                              canvasRef.current.height
                            );
                          chatHistory.current = []; // Remove everything from chat history except the last element
                          setNextRoundButton(false);
                        } else {
                          setCurrentRoundNumber(1);
                          va.track("game-retry");
                          previousRoundsDrawings.current = [];
                          setUserinput(`start round 1`);
                          setCurrentTurn("assistant");
                          canvasRef.current
                            ?.getContext("2d")
                            ?.clearRect(
                              0,
                              0,
                              canvasRef.current.width,
                              canvasRef.current.height
                            );
                          chatHistory.current = []; // Remove everything from chat history except the last element
                          setNextRoundButton(false);
                        }
                      }}
                      backgroundColor={"purple.300"}
                      color={"white"}
                    >
                      {chatHistory.current[
                        chatHistory.current.length - 1
                      ]?.content?.includes("YOU WIN")
                        ? "Start next round"
                        : "Retry"}
                    </Button>
                  </MotionBox>
                </Box>
                <Box>
                  <ScoreCard currentRound={currentRoundNumber} />
                </Box>
              </Grid>
            )}
          </Box>
          {hasGameStarted && chatHistory.current.length > 0 && (
            <Box
              maxWidth={{ base: "100%", md: "50%" }}
              flex="1"
              marginX={{ base: "auto", md: "0" }}
              marginBottom={{ base: "4", md: "0" }}
              marginLeft={{ base: "4", md: "4" }}
              minHeight="50vh"
            >
              <CanvasContainer>
                <canvas
                  id="canvas"
                  width="500"
                  height="500"
                  ref={canvasRef}
                  style={{ backgroundColor: "white" }}
                ></canvas>
              </CanvasContainer>
            </Box>
          )}
        </Box>
      )}
      {hasGameStarted && <FeedbackCapture />}
    </>
  );
}
