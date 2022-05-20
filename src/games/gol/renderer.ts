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

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color?: string
): void {
  ctx.beginPath();
  if (color) ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.closePath();
}

function squareRect(cX: number, cY: number, cW: number, cH: number): Rect {
  return [cX * cW, cY * cH, cW, cH];
}

function smallerRect(rect: Rect, x = 1): Rect {
  return [rect[0] + x, rect[1] + x, rect[2] - 2 * x, rect[3] - 2 * x];
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cX: number,
  cY: number,
  cW: number,
  cH: number,
  color: string,
  borderColor?: string
): void {
  const bigRect = squareRect(cX, cY, cW, cH);
  drawRect(ctx, ...bigRect, borderColor ?? color);

  if (borderColor) {
    const smallRect = smallerRect(bigRect);
    drawRect(ctx, ...smallRect, color);
  }
}
