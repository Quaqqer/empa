import { GameOfLife } from "./logic";
import { Theme } from "./theme";

//           x       y       width   height
type Rect = [number, number, number, number];

export function render(
  ctx: CanvasRenderingContext2D,
  gol: GameOfLife,
  theme: Theme
): void {
  const [canvasW, canvasH] = [ctx.canvas.width, ctx.canvas.height];
  const [cW, cH] = [canvasW / gol.width, canvasH / gol.height].map(Math.floor);

  gol.gridIter().map(([alive, x, y]) => {
    drawCell(
      ctx,
      x,
      y,
      cW,
      cH,
      (alive && theme.cell) || theme.background,
      theme.borders
    );
  });
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cW: number,
  cH: number,
  color: string,
  borderColor?: string
): void {
  const bigRect: Rect = [x * cW, y * cH, cW, cH];

  ctx.beginPath();
  ctx.fillStyle = borderColor ?? color;
  ctx.fillRect(...bigRect);
  ctx.closePath();

  if (borderColor) {
    const smallRect: Rect = [
      bigRect[0] + 1,
      bigRect[1] + 1,
      bigRect[2] - 2,
      bigRect[3] - 2,
    ];
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(...smallRect);
    ctx.closePath();
  }
}
