import { AstarBot } from "./cheat";
import { Theme } from "./colors";
import { GameState } from "./gamestate";
import { TILES_H, TILES_V, Renderer } from "./renderer";

export class Game {
  private renderer: Renderer;
  private gs: GameState;
  private width: number;
  private height: number;

  private bot?: AstarBot;
  private tainted: boolean;

  public constructor(private endGame: (score: number) => void) {
    this.width = TILES_H;
    this.height = TILES_V;

    this.gs = new GameState(this.width, this.height);
    this.renderer = new Renderer(this.gs);

    this.tainted = false;
  }

  public run(
    renderCtx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): () => void {
    let running = true;

    let timeout: NodeJS.Timeout;
    let handler: ((v?: unknown) => void) | null = null;

    const keydownListener = (e: KeyboardEvent): void => {
      const updated = this.gs.updateInput(e);

      if (updated) {
        // End timeout early
        if (handler) {
          clearTimeout(timeout);
          handler();
        }

        e.preventDefault();
      }
    };

    const runner = async (): Promise<void> => {
      const window = document.defaultView;

      if (window) {
        canvas.addEventListener("keydown", keydownListener);

        while (running) {
          if (this.bot !== undefined) this.bot.tick(this.gs);
          this.gs.update();

          if (this.gs.snake.isDead) {
            // If score is not tainted, show end screen with submit score menu
            if (!this.tainted) {
              this.endGame(this.gs.score);
            }

            // Create new gamestate
            this.gs = new GameState(this.width, this.height);

            // Create new bot
            if (this.bot !== undefined) {
              this.bot = new AstarBot();
              this.tainted = true;
            } else {
              this.tainted = false;
            }

            // Create new renderer, persist old theme
            const oldTheme = this.renderer.theme;
            this.renderer = new Renderer(this.gs);
            this.renderer.setTheme(oldTheme);
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
      canvas.removeEventListener("keydown", keydownListener);
      running = false;
    };

    runner();

    return stopper;
  }

  public setTheme(theme: Theme): void {
    this.renderer.setTheme(theme);
  }

  public setCheat(b: boolean): void {
    if (b) {
      this.bot = new AstarBot();
      this.tainted = true;
    } else {
      this.bot = undefined;
    }
  }
}
