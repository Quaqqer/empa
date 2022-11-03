import * as I from "immutable";
import { Heap } from "mnemonist";

import { Direction, GameState } from "./gamestate";
import { Point, Vector2 } from "./vector";

export class AstarBot {
  private path?: Point[];

  public tick(gs: GameState): void {
    if (this.path === undefined) {
      const iPath = this.astar(gs);

      if (iPath !== null) {
        const path = iPath.toJS() as { x: number; y: number }[];
        const points: Point[] = path.map(({ x, y }) => new Vector2(x, y));
        this.path = points.splice(1);
      }
    }

    if (this.path !== undefined) {
      const curr = gs.snake.head;
      const [next, ...tail] = this.path;
      this.path = tail.length > 0 ? tail : undefined;

      const delta = next.minus(curr);

      let dir: Direction | undefined = undefined;
      if (delta.equals(new Vector2(1, 0))) dir = Direction.Right;
      if (delta.equals(new Vector2(-1, 0))) dir = Direction.Left;
      if (delta.equals(new Vector2(0, -1))) dir = Direction.Up;
      if (delta.equals(new Vector2(0, 1))) dir = Direction.Down;

      if (dir !== undefined) {
        gs.snake.dir = dir;
      }
    }
  }

  private astar(
    gs: GameState
  ): I.List<I.RecordOf<{ x: number; y: number }>> | null {
    type PointRT = I.RecordOf<{ x: number; y: number }>;
    const PointR = I.Record({ x: 0, y: 0 });
    type Path = I.List<PointRT>;
    type Blocked = I.Set<PointRT>;

    const target = PointR(gs.fruit[0]);

    let blocked: Blocked = I.Set();

    // Map of blocked until time.
    // In other words, if time == 5 it will be unblocked by time 6
    const head = gs.snake.head;
    blocked = blocked.add(PointR({ x: head.x, y: head.y }));

    gs.snake.segments.forEach((point) => {
      blocked = blocked.add(PointR(point));
    });

    // Min heap             score   time    path
    const queue = new Heap<[number, number, Path]>(([sa], [sb]) => {
      if (sa < sb) return -1;
      if (sa > sb) return 1;
      return 0;
    });

    // Shouldn't be 0, but it does not matter
    queue.push([0, 0, I.List([PointR(gs.snake.head)])]);

    while (queue.size > 0) {
      // They are both non-empty guaranteed
      // eslint-disable-next-line
      const [_score, t, path] = queue.pop()!;
      // eslint-disable-next-line
      const p = path.last()!;

      if (p.equals(target)) {
        return path;
      }

      const nt = t + 1;

      for (const [dx, dy] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]) {
        const neighbour = PointR({ x: p.get("x") + dx, y: p.get("y") + dy });

        const x = neighbour.get("x");
        const y = neighbour.get("y");

        if (
          !blocked.has(neighbour) &&
          0 <= x &&
          x < gs.width &&
          0 <= y &&
          y < gs.height
        ) {
          blocked = blocked.add(neighbour);

          queue.push([
            nt +
              Math.abs(target.x - p.get("x")) +
              Math.abs(target.y - p.get("y")),
            nt,
            path.concat([neighbour]),
          ]);
        }
      }
    }

    return null;
  }
}
