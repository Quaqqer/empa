import { GameOfLife } from "./logic";
import { render } from "./renderer";

export type Theme = {
  cell: string;
  background: string;
};

export const darkTheme: Theme = {
  cell: "#d8dee9",
  background: "#434c5e",
};

export const lightTheme: Theme = {
  cell: "#434c5e",
  background: "#eceff4",
};

export class Game {
  private gol: GameOfLife;
  private renderCtx?: CanvasRenderingContext2D;

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

  public setRenderCtx(ctx: CanvasRenderingContext2D) {
    this.renderCtx = ctx;
  }

  public render() {
    if (this.renderCtx) {
      render(this.renderCtx, this.gol, this.theme);
    }
  }

  public randomize() {
    this.gol.randomize()
  }

  public setTheme(theme: Theme): void {
    this.theme = theme;
  }
}
