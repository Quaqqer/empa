import { GameOfLife } from "./logic";

import { Theme } from ".";

export function render(
  ctx: CanvasRenderingContext2D,
  gol: GameOfLife,
  theme: Theme
): void {
  const [canvasW, canvasH] = [ctx.canvas.width, ctx.canvas.height];
  const [cW, cH] = [canvasW / gol.width, canvasH / gol.height].map(Math.floor);

  gol.gridIter().map(([alive, x, y]) => {
    drawCell(ctx, x, y, cW, cH, (alive && theme.cell) || theme.background);
  });
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cW: number,
  cH: number,
  color: string
): void {
  ctx.beginPath();
  ctx.rect(x * cW, y * cH, cW, cH);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
