import { GameOfLife } from "./logic";
import { render } from "./renderer";
import { lightTheme, Theme } from "./theme";

type Mouse = {
  x: number;
  y: number;
};

export class Game {
  private gol: GameOfLife;
  private renderCtx?: CanvasRenderingContext2D;
  private mouse?: Mouse;

  public constructor(
    width: number,
    height: number,
    private theme: Theme = lightTheme
  ) {
    this.gol = new GameOfLife(width, height);
  }

  public tick(): void {
    this.gol.tick();
  }

  public setRenderCtx(ctx: CanvasRenderingContext2D): void {
    this.renderCtx = ctx;
  }

  public render(): void {
    if (this.renderCtx) {
      requestAnimationFrame(() => {
        if (this.renderCtx) render(this.renderCtx, this.gol, this.theme);
      });
    }
  }

  public randomize(): void {
    this.gol.randomize();
  }

  public setTheme(theme: Theme): void {
    this.theme = theme;
  }

  public setMouse(mouse?: Mouse): void {
    this.mouse = mouse;
  }
}
