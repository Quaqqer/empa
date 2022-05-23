import { Theme, darkTheme } from "./colors";
import { GameState } from "./gamestate";
import { Point } from "./vector";

export const TILE_SIZE = 20;
export const TILES_H = 24;
export const TILES_V = 24;

export class Renderer {
  private nextTheme?: Theme;

  constructor(
    private readonly gs: GameState,
    public theme: Theme = darkTheme
  ) {}

  private initalize(ctx: CanvasRenderingContext2D): void {
    ctx.font = "30px Arial";
  }

  private drawTile(
    ctx: CanvasRenderingContext2D,
    pos: Point,
    color: string
  ): void {
    ctx.beginPath();
    ctx.rect(pos.x * TILE_SIZE, pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  private drawBackground(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(0, 0, this.gs.width * TILE_SIZE, this.gs.height * TILE_SIZE);
    ctx.fillStyle = this.theme.background;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(0, 480, 480, 50);
    ctx.fillStyle = this.theme.wall;
    ctx.fill();
    ctx.closePath();
  }

  private drawSnake(ctx: CanvasRenderingContext2D): void {
    this.drawTile(ctx, this.gs.snake.head, this.theme.snake);

    for (const segment of this.gs.snake.segments) {
      this.drawTile(ctx, segment, this.theme.snake);
    }
  }

  private drawFruit(ctx: CanvasRenderingContext2D): void {
    for (const fruit of this.gs.fruit) {
      this.drawTile(ctx, fruit, this.theme.fruit);
    }
  }

  private internal_render(ctx: CanvasRenderingContext2D): void {
    this.initalize(ctx);
    this.drawBackground(ctx);
    this.drawSnake(ctx);
    this.drawFruit(ctx);

    this.drawScore(ctx);
  }

  drawScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.theme.foreground;
    ctx.fillText(
      "Score: " + this.gs.score.toString(),
      5,
      TILES_V * TILE_SIZE + 35,
      TILES_H * TILE_SIZE - 10
    );
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.nextTheme) this.theme = this.nextTheme;

    requestAnimationFrame(() => {
      this.internal_render(ctx);
    });
  }

  public setTheme(theme: Theme): void {
    this.nextTheme = theme;
  }
}
