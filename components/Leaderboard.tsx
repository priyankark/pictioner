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
  VStack,
} from '@chakra-ui/react';

interface ILeaderboardProps {
  currentRound: number;
}

function Leaderboard({ currentRound }: ILeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scores, setScores] = useState<{ name: string; score: number; }[]>([]);
  const [name, setName] = useState('');
  const [sessionScore, setSessionScore] = useState(currentRound);

  // Function to display the leaderboard
  const displayLeaderboard = () => {
    const storedScores = JSON.parse(localStorage.getItem('scores') ?? "[]") || [];
    setScores(storedScores.sort((a: any, b: any) => b.score - a.score));
    setIsOpen(true);
  };

  // Function to add the session score to the leaderboard
  const addToLeaderboard = () => {
    if (name) {
      const storedScores = JSON.parse(localStorage.getItem('scores') ?? "[]") || [];
      storedScores.push({ name, score: sessionScore });
      localStorage.setItem('scores', JSON.stringify(storedScores));
      setScores(storedScores);
      setSessionScore(currentRound);
    }
  };

  // Function to share the leaderboard on Twitter
  const shareOnTwitter = () => {
    const twitterText = `Check out the leaderboard for Pictioner:\n\n${window.location.href}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Box>
      <Button onClick={displayLeaderboard}>
        Enter Leaderboard
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leaderboard</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={2}>
              {scores.map((score, index) => (
                <Box key={index}>{`${index + 1}. ${score.name}: ${score.score}`}</Box>
              ))}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Box>
              <Box mb={2}>
                Your Score: {sessionScore}
              </Box>
              <Box>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </Box>
            </Box>
            <Button mr={3} onClick={() => setIsOpen(false)}>Close</Button>
            <Button
              colorScheme="blue"
              onClick={addToLeaderboard}
              isDisabled={!name}
            >
              Add to Leaderboard
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Leaderboard;
