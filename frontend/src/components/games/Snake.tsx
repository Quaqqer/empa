import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  chakra,
  CloseButton,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Game } from "../../games/snake";
import { darkTheme, lightTheme } from "../../games/snake/colors";

export default function Snake(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();

  const [game] = useState(
    new Game((score) => {
      setScore(score);
    })
  );
  const [score, setScore] = useState<number | undefined>(2);

  const [name, setName] = useState("");
  const nameValid = useMemo(
    () => 3 <= name.length && name.length <= 10,
    [name]
  );

  const [scoreBoard, setScoreBoard] = useState<SnakeScore[]>([]);

  useEffect(() => {
    fetch("/api/snake/scores").then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          setScoreBoard(json);
        });
      }
    });
  }, []);

  // Start the game on the canvas
  useEffect(() => {
    const canvas2d = canvasRef.current?.getContext("2d");

    if (canvas2d) {
      const stopper = game.run(canvas2d);

      return stopper;
    }
  }, [game, canvasRef]);

  // Reflect global theme
  useEffect(() => {
    game.setTheme(colorMode === "light" ? lightTheme : darkTheme);
  }, [game, colorMode]);

  const toast = useToast();

  const sendScore = useCallback(
    async (name: string, score: number) => {
      setScore(undefined);

      const response = await fetch("/api/snake/scoress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score }),
      });

      if (response.ok) {
        toast({
          status: "success",
          title: "Score sent",
          isClosable: true,
          description: "Hehe",
        });
      } else {
        toast({
          duration: 30 * 1000,
          render: (props) => (
            <Alert
              status="error"
              alignItems="start"
              borderRadius="md"
              boxShadow="lg"
              paddingEnd={8}
              textAlign="start"
              width="auto"
            >
              <AlertIcon />

              <chakra.div flex="1" maxWidth="100%">
                <AlertTitle>Could not send score</AlertTitle>

                <AlertDescription>Hej</AlertDescription>
              </chakra.div>

              <Button>Try again</Button>

              <CloseButton
                onClick={props.onClose}
                size="sm"
                position="absolute"
                insetEnd={1}
                top={1}
              />
            </Alert>
          ),
        });
      }
    },
    [toast]
  );

  return (
    <>
      {/* The canvas */}
      <canvas
        ref={canvasRef}
        width="480px"
        height={`${480 + 50}px`}
        style={{ margin: "auto", display: "block" }}
      />

      {/* Scoreboard */}
      <SnakeScoreboard scores={scoreBoard} />

      {/* Dialog for when you die */}
      <Modal
        isOpen={score !== undefined}
        onClose={() => {
          setScore(undefined);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Over</ModalHeader>

          <ModalBody>
            <Text>
              You reached a score of {score}. Would you like to submit it to the
              leaderboard?
            </Text>

            <Center my={3}>
              <Box>
                <Input
                  mb={3}
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  isInvalid={!nameValid}
                />

                <Center>
                  <HStack>
                    <Button
                      isDisabled={!nameValid}
                      onClick={() => {
                        if (score) sendScore(name, score);
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        setScore(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </Center>
              </Box>
            </Center>
          </ModalBody>

          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
}

/**
 * A single snake score
 */
type SnakeScore = {
  id: number;
  name: string;
  score: number;
};

/**
 * The snake scoreboard props.
 */
type SnakeScoreboardProps = {
  scores: SnakeScore[];
};

/**
 * The scoreboard for snake.
 */
export function SnakeScoreboard({ scores }: SnakeScoreboardProps): JSX.Element {
  return (
    <Stack>
      {scores.map(({ id, name, score }) => (
        <Box key={id}>
          <Text>
            {name} - {score}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}
