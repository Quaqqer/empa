import { useColorMode } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Game } from "../../games/snake";
import { darkTheme, lightTheme } from "../../games/snake/colors";

export default function Snake(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();
  const [game] = useState(() => new Game());

  useEffect(() => {
    const canvas2d = canvasRef.current?.getContext("2d");

    if (canvas2d) {
      const stopper = game.run(canvas2d);

      return stopper;
    }
  }, [game, canvasRef]);

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
