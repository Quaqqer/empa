import { useEffect, useRef } from "react";

import { run as runSnake } from "../games/snake";

export default function Snake(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      throw new Error("Could not find canvas.");
    }

    return runSnake(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="480px"
      height="480px"
      style={{ margin: "auto", display: "block" }}
    />
  );
}
