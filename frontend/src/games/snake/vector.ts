export class Vector2 {
  constructor(public readonly x: number, public readonly y: number) {}

  public added(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public minus(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public equals(other: Vector2): boolean {
    return this.x == other.x && this.y == other.y;
  }
}

export class Rect {
  constructor(public readonly tl: Vector2, public readonly wh: Vector2) {}

  public contains(point: Point): boolean {
    return (
      this.tl.x <= point.x &&
      point.x <= this.tl.x + this.wh.x &&
      this.tl.y <= point.y &&
      point.y <= this.tl.y + this.wh.y
    );
  }
}

export type Point = Vector2;
