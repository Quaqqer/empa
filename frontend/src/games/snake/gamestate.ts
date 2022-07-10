import { Vector2, Point, Rect } from "./vector";

export enum Direction {
  Up,
  Down,
  Left,
  Right,
  None,
}

export function oppositeDir(dir: Direction): Direction {
  switch (dir) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
    default:
      return Direction.None;
  }
}

function dirToVec(dir: Direction): Vector2 {
  switch (dir) {
    case Direction.Up:
      return new Vector2(0, -1);
    case Direction.Down:
      return new Vector2(0, 1);
    case Direction.Left:
      return new Vector2(-1, 0);
    case Direction.Right:
      return new Vector2(1, 0);
    case Direction.None:
      return new Vector2(0, 0);
  }
}

export class Snake {
  public segments: Point[] = [];
  private enqueued_grows = 2;
  public dir: Direction = Direction.None;
  public isDead = false;

  constructor(public head: Point) {}

  public grow(): void {
    this.enqueued_grows++;
  }

  public move(boardRect: Rect): void {
    // Already dead, don't move
    if (this.isDead) return;

    // Will collide with wall
    if (!boardRect.contains(this.head.added(dirToVec(this.dir)))) {
      this.isDead = true;
      return;
    }

    // Move tail
    if (this.segments.length != 0) {
      this.segments.splice(0, 0, this.head);

      if (this.enqueued_grows > 0 && this.dir != Direction.None) {
        this.enqueued_grows--;
      } else {
        this.segments.pop();
      }
    } else if (this.enqueued_grows > 0 && this.dir != Direction.None) {
      this.segments.push(this.head);
      this.enqueued_grows--;
    }

    // Move head
    this.head = this.head.added(dirToVec(this.dir));

    // If collides with tail -> die
    if (this.tailContainsPoint(this.head)) this.isDead = true;
  }

  public containsPoint(point: Point): boolean {
    return this.head.equals(point) || this.tailContainsPoint(point);
  }

  private tailContainsPoint(point: Point): boolean {
    return this.segments.findIndex((seg) => seg.equals(point)) != -1;
  }
}

export class GameState {
  public readonly snake: Snake;
  public readonly fruit: Point[] = [];
  private boardRect: Rect;
  public score = 0;

  constructor(public readonly width: number, public readonly height: number) {
    this.snake = new Snake(
      new Vector2(Math.floor(width / 2), Math.floor(height / 2))
    );
    this.fruit.push(this.findEmptySpace());
    this.boardRect = new Rect(
      new Vector2(0, 0),
      new Vector2(width - 1, height - 1)
    );
  }

  private findEmptySpace(): Point {
    let p: Point;

    do {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      p = new Vector2(x, y);
    } while (this.isOccupied(p));

    return p;
  }

  private isOccupied(point: Point): boolean {
    return this.snake.containsPoint(point);
  }

  public update(): void {
    this.snake.move(this.boardRect);
    const eaten = this.eatFruit();

    if (eaten) {
      this.score += 10;
    }
  }

  private eatFruit(): boolean {
    let eaten = 0;

    for (let i = 0; i < this.fruit.length; i++) {
      if (this.snake.containsPoint(this.fruit[i])) {
        eaten++;
        this.snake.grow();
        this.fruit[i] = this.findEmptySpace();
      }
    }

    return eaten > 0;
  }

  public updateInput(e: KeyboardEvent): boolean {
    const cdir = this.snake.dir;
    const ndir: Direction = (() => {
      switch (e.key) {
        case "ArrowUp":
        case "k":
          return Direction.Up;
        case "ArrowDown":
        case "j":
          return Direction.Down;
        case "ArrowLeft":
        case "h":
          return Direction.Left;
        case "l":
        case "ArrowRight":
          return Direction.Right;
        default:
          return Direction.None;
      }
    })();

    // Don't capture if pressing opposite key
    if (ndir === oppositeDir(cdir)) return false;

    // Capture only if we change direction or if we move in the same one
    if (ndir !== Direction.None) {
      this.snake.dir = ndir;
      return true;
    }

    // If direction is None, we didn't capture
    return false;
  }

  public updateTime(): number {
    return 50 + 150 * (1 / Math.pow(1 + this.score / 70, 1 / 3));
  }
}
