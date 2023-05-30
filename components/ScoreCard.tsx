import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useToast,
  Stack,
} from '@chakra-ui/react';

interface IScore {
  name: string;
  score: number;
}

interface IScoreCardProps {
  currentRound: number;
}

function ScoreCard({ currentRound }: IScoreCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scores, setScores] = useState<IScore[]>([]);
  const [name, setName] = useState('');
  const [sessionScore, setSessionScore] = useState(currentRound);
  const toast = useToast();

  // Function to display the scorecard
  const displayScoreCard = () => {
    const storedScores = JSON.parse(localStorage.getItem('scores') ?? '[]') as IScore[];
    setScores(storedScores.sort((a, b) => b.score - a.score));
    setIsOpen(true);
  };

  // Function to add the session score to the scorecard
  const addToScoreCard = () => {
    if (name) {
      const storedScores = JSON.parse(localStorage.getItem('scores') ?? '[]') as IScore[];
      storedScores.push({ name, score: sessionScore });
      localStorage.setItem('scores', JSON.stringify(storedScores));
      setScores(storedScores.sort((a, b) => b.score - a.score));
      setSessionScore(currentRound);
      setName('');
      toast({
        title: 'Score added to scorecard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to share the scorecard on Twitter
  const shareOnTwitter = () => {
    const twitterText = `My Pictioner scorecard:\n\nName: ${name}\nScore: ${sessionScore}\n\nBattle against AI and check out your scorecard at #pictioner ${window.location.href}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Box>
      <Button onClick={displayScoreCard}>View Scorecard</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Scorecard</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {scores.length === 0 ? (
              <Box textAlign="center" fontSize="lg" fontWeight="bold">
                No scores available yet. Play a game to add your score!
              </Box>
            ) : (
              <>
                <Box mb={2}>
                  <strong>Your Score:</strong> {sessionScore}
                </Box>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Rank</Th>
                      <Th>Name</Th>
                      <Th>Score</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scores.map((score, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{score.name}</Td>
                        <Td>{score.score}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} flex="1">
              <Box flex="1">
                <Box>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </Box>
              </Box>
              <Stack direction="row" spacing={4}>
                <Button
                  colorScheme="blue"
                  onClick={addToScoreCard}
                  isDisabled={!name}
                >
                  Add to Scorecard
                </Button>
                <Button
                  colorScheme="twitter"
                  onClick={shareOnTwitter}
                  isDisabled={!name}
                >
                  Share on Twitter
                </Button>
              </Stack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ScoreCard;