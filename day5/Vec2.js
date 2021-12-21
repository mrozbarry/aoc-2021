export class Vec2 {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
  }

  sub(b) {
    return new Vec2(
      b.x - this.x,
      b.y - this.y,
    );
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  pointsTo(b) {
    const diff = this.sub(b);
    const xMul = Math.sign(diff.x);
    const yMul = Math.sign(diff.y);

    const isVertical = diff.x === 0;
    const isHorizontal = diff.y === 0;

    const length = Math.max(Math.abs(diff.y), Math.abs(diff.x)) + 1;

    if (isVertical) {
      return Array.from({ length }, (_, y) => new Vec2(this.x, this.y + (y * yMul)));
    }
    if (isHorizontal) {
      return Array.from({ length }, (_, x) => new Vec2(this.x + (x * xMul), this.y));
    }

    return Array.from({ length }, (_, i) => new Vec2(this.x + (i * xMul), this.y + (i * yMul)));
  }
}

Vec2.fromString = (xy) => {
  const [x, y] = xy.trim().split(',').map(Number);
  return new Vec2(x, y);
};
