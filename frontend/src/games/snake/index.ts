import { Theme } from "./colors";
import { GameState } from "./gamestate";
import { TILES_H, TILES_V, Renderer } from "./renderer";

export class Game {
  private renderer: Renderer;
  private gs: GameState;
  private width: number;
  private height: number;

  public constructor(private endGame: (score: number) => void) {
    this.width = TILES_H;
    this.height = TILES_V;

    this.gs = new GameState(this.width, this.height);
    this.renderer = new Renderer(this.gs);
  }

  public run(renderCtx: CanvasRenderingContext2D): () => void {
    let running = true;

    const runner = async (): Promise<void> => {
      const window = document.defaultView;

      let timeout: NodeJS.Timeout;
      let handler: ((v?: unknown) => void) | null = null;

      if (window) {
        window.addEventListener(
          "keydown",
          (e) => {
            this.gs.updateInput(e);

            // End timeout early
            if (handler) {
              clearTimeout(timeout);
              handler();
            }
          },
          false
        );

        while (running) {
          this.gs.update();

          if (this.gs.snake.isDead) {
            this.endGame(this.gs.score);
            this.gs = new GameState(this.width, this.height);
            this.renderer = new Renderer(this.gs);
          }

          this.renderer.render(renderCtx);

          await new Promise((r) => {
            handler = r;
            timeout = setTimeout(r, this.gs.updateTime());
            return timeout;
          });
        }
      }
    };

    const stopper = (): void => {
      running = false;
    };

    runner();

    return stopper;
  }

  public setTheme(theme: Theme): void {
    this.renderer.setTheme(theme);
  }
}
