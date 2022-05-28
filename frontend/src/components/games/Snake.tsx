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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Game } from "../../games/snake";
import { darkTheme, lightTheme } from "../../games/snake/colors";

export type SnakeProps = {
  scores: SnakeScore[];
};

export default function Snake({ scores }: SnakeProps): JSX.Element {
  /** Initialize the game */
  const [game] = useState(
    new Game((score) => {
      setScore(score);
    })
  );

  /** The current score in the dialog */
  const [score, setScore] = useState<number | undefined>();

  return (
    <>
      <SnakeGame {...{ game, running: score === undefined }} />

      {/* Scoreboard */}
      <Center>
        <SnakeScoreboard {...{ scores }} />
      </Center>

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

  /** If the game should be running */
  running: boolean;
};

/**
 * A component for the snake game to draw on
 */
export function SnakeGame({ game, running }: SnakeCanvasProps): JSX.Element {
  const { colorMode } = useColorMode();

  /** The canvas reference */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start the game on the canvas, if should be running
  useEffect(() => {
    if (running) {
      const canvas = canvasRef.current;
      const canvas2d = canvas?.getContext("2d");

      if (canvas && canvas2d) {
        const stopper = game.run(canvas2d, canvas);

        return stopper;
      }
    }
  }, [game, canvasRef, running]);

  // Reflect global theme
  useEffect(() => {
    game.setTheme(colorMode === "light" ? lightTheme : darkTheme);
  }, [game, colorMode]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={1}
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
    <TableContainer minWidth="400px">
      <Table variant="simple" size="sm">
        <TableCaption placement="top">Leaderboard</TableCaption>

        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scores.map(({ id, name, score }, index) => (
            <Tr key={id}>
              <Td isNumeric>{index + 1}</Td>
              <Td>{name}</Td>
              <Td isNumeric>{score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
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
