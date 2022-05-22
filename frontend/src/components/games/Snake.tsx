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
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { Game } from "../../games/snake";
import { darkTheme, lightTheme } from "../../games/snake/colors";

export default function Snake(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [game] = useState(
    new Game((score) => {
      setScore(score);
    })
  );
  const [score, setScore] = useState<number | undefined>();

  const [scoreBoard, setScoreBoard] = useState<SnakeScore[]>([]);

  useEffect(() => {
    fetch("/api/snake/leaderboard").then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          setScoreBoard(json);
        });
      }
    });
  }, []);

  return (
    <>
      <SnakeRenderer {...{ game, canvasRef }} />

      {/* Scoreboard */}
      <SnakeScoreboard scores={scoreBoard} />

      {/* Dialog for when you die */}
      <GameOverDialog
        {...{
          score,
          open: score !== undefined,
          onClose: () => {
            setScore(undefined);
          },
        }}
      />
    </>
  );
}

/**
 * The properties of the snake canvas.
 */
type SnakeCanvasProps = {
  /** The game that will be drawn */
  game: Game;

  /** The canvas to draw on */
  canvasRef: RefObject<HTMLCanvasElement>;
};

/**
 * A component for the snake game to draw on
 */
export function SnakeRenderer({
  game,
  canvasRef,
}: SnakeCanvasProps): JSX.Element {
  const { colorMode } = useColorMode();
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

  return (
    <canvas
      ref={canvasRef}
      width="480px"
      height={`${480 + 50}px`}
      style={{ margin: "auto", display: "block" }}
    />
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

type GameOverDialogProps = {
  open: boolean;
  score?: number;
  onClose: () => void;
};

export function GameOverDialog({
  open,
  score,
  onClose,
}: GameOverDialogProps): JSX.Element {
  const [name, setName] = useState("");
  const nameValid = 3 <= name.length && name.length <= 10;
  const toast = useToast();

  const sendScore = useCallback(
    async (name: string, score: number) => {
      onClose();

      const response = await fetch("/api/snake/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score }),
      });

      if (response.ok) {
        toast({
          status: "success",
          title: "Score sent",
          isClosable: true,
        });
      } else {
        toast({
          duration: null,
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

                <AlertDescription>
                  Would you like to try again?
                </AlertDescription>
              </chakra.div>

              <Button
                m={2}
                onClick={() => {
                  props.onClose();
                  sendScore(name, score);
                }}
              >
                Try again
              </Button>

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
    [toast, onClose]
  );

  return (
    <Modal isOpen={open} onClose={onClose}>
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
                      if (score !== undefined) sendScore(name, score);
                    }}
                  >
                    Submit
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </HStack>
              </Center>
            </Box>
          </Center>
        </ModalBody>

        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}
