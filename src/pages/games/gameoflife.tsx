import { Box, Button, Center, HStack, useColorMode } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { darkTheme, Game, lightTheme } from "../../games/gol";

export default function GameOfLife(): JSX.Element {
  const { colorMode } = useColorMode();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [game] = useState(() => new Game(20, 20));

  useEffect(() => {
    const c2 = canvasRef.current?.getContext("2d");

    if (c2) {
      game.setRenderCtx(c2);
    }
  }, [canvasRef, game]);

  useEffect(() => {
    game.setTheme(colorMode === "light" ? lightTheme : darkTheme);
    game.render();
  }, [colorMode, game]);

  return (
    <Center my={5}>
      <Box>
        <canvas
          width="480px"
          height="480px"
          ref={canvasRef}
          style={{ marginBottom: "10px" }}
        />

        <HStack>
          <Button
            onClick={() => {
              game.tick();
              game.render();
            }}
          >
            Tick
          </Button>
          <Button
            onClick={() => {
              game.randomize();
              game.render()
            }}
          >
            Randomize
          </Button>
        </HStack>
      </Box>
    </Center>
  );
}
