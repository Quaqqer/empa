import * as colors from "./colors";
import { GameState } from "./gamestate";
import { Point } from "./vector";

export const TILE_SIZE = 20;
export const TILES_H = 24;
export const TILES_V = 24;

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  constructor(private readonly gs: GameState, canvas: HTMLCanvasElement) {
    const canvas2d = canvas.getContext("2d");

    if (canvas2d == null) {
      throw new Error("Could not get canvas 2d rendering context");
    }

    this.ctx = canvas2d;

    this.initalize();
  }

  private initalize(): void {
    this.ctx.font = "30px Arial";
  }

  private drawTile(pos: Point, color: string): void {
    this.ctx.beginPath();
    this.ctx.rect(pos.x * TILE_SIZE, pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawBackground(): void {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.gs.width * TILE_SIZE, this.gs.height * TILE_SIZE);
    this.ctx.fillStyle = colors.BACKGROUND;
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.rect(0, 480, 480, 50);
    this.ctx.fillStyle = colors.WALL;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawSnake(): void {
    this.drawTile(this.gs.snake.head, colors.SNAKE);

    for (const segment of this.gs.snake.segments) {
      this.drawTile(segment, colors.SNAKE);
    }
  }

  private drawFruit(): void {
    for (const fruit of this.gs.fruit) {
      this.drawTile(fruit, colors.FRUIT);
    }
  }

  private internal_render(): void {
    this.drawBackground();
    this.drawSnake();
    this.drawFruit();

    this.drawScore();
  }

  drawScore(): void {
    this.ctx.fillStyle = colors.FG;
    this.ctx.fillText(
      "Score: " + this.gs.score.toString(),
      5,
      TILES_V * TILE_SIZE + 35,
      TILES_H * TILE_SIZE - 10
    );
  }

  public render(): void {
    requestAnimationFrame(() => {
      this.internal_render();
    });
  }
}
