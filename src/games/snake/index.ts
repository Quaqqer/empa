import { GameState } from "./gamestate";
import { TILES_H, TILES_V, Renderer } from "./renderer";

export function run(canvas: HTMLCanvasElement): () => void {
  const game = new Game(canvas);

  const stopper = (): void => {
    game.stop();
  };

  game.run();

  return stopper;
}

class Game {
  private running = true;

  public constructor(private canvas: HTMLCanvasElement) {}

  public async run(): Promise<void> {
    const window = document.defaultView;

    const width = TILES_H;
    const height = TILES_V;

    const gs = new GameState(width, height);
    const renderer = new Renderer(gs, this.canvas);

    let timeout: NodeJS.Timeout;
    let handler: ((v?: unknown) => void) | null = null;

    if (window) {
      window.addEventListener(
        "keydown",
        (e) => {
          gs.updateInput(e);

          // End timeout early
          if (handler != null) {
            clearTimeout(timeout);
            handler();
          }
        },
        false
      );

      while (this.running) {
        gs.update();
        renderer.render();

        await new Promise((r) => {
          handler = r;
          timeout = setTimeout(r, gs.updateTime());
          return timeout;
        });
      }
    }
  }

  public stop(): void {
    this.running = false;
  }
}
