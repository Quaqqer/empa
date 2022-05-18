import { Box, Button, Center, HStack, useColorMode } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Game } from "../../games/gol";
import { lightTheme, darkTheme } from "../../games/gol/theme";

export default function GameOfLife(): JSX.Element {
  const { colorMode } = useColorMode();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [animating, setAnimating] = useState(false);

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

  const animate = useCallback((game: Game) => {
    let running = true;

    const runner = async (): Promise<void> => {
      let timeout: NodeJS.Timeout;

      while (running) {
        game.tick();
        game.render();

        await new Promise((r) => {
          timeout = setTimeout(r, 200);
          return timeout;
        });
      }
    };

    runner();

    return () => {
      running = false;
    };
  }, []);

  useEffect(() => {
    if (animating) return animate(game);
  }, [animate, game, animating]);

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
              setAnimating(!animating);
            }}
          >
            Animate
          </Button>

          <Button
            isDisabled={animating}
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
              game.render();
            }}
          >
            Randomize
          </Button>
        </HStack>
      </Box>
    </Center>
  );
}
