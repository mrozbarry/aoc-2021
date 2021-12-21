import test from 'ava';
import { Vec2 } from './Vec2.js';

test('can create a series of points of a horizontal line', (t) => {
  const a = new Vec2(0, 0);
  const b = new Vec2(3, 0);
  const points = a.pointsTo(b).map(p => p.toString());

  t.deepEqual(
    [
      '0,0',
      '1,0',
      '2,0',
      '3,0',
    ],
    points,
  );
});

test('can create a series of points of a vertical line', (t) => {
  const a = new Vec2(0, 0);
  const b = new Vec2(0, 3);
  const points = a.pointsTo(b).map(p => p.toString());

  t.deepEqual(
    [
      '0,0',
      '0,1',
      '0,2',
      '0,3',
    ],
    points,
  );
});

test('can create a series of points of a 45 degree line', (t) => {
  const a = new Vec2(0, 0);
  const b = new Vec2(3, 3);
  const points = a.pointsTo(b).map(p => p.toString());

  t.deepEqual(
    [
      '0,0',
      '1,1',
      '2,2',
      '3,3',
    ],
    points,
  );
});
