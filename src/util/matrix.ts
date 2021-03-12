interface Coordinates {
  i: number,
  j: number,
}

interface CoordinatesDelta {
  deltaI: number,
  deltaJ: number,
}

const checkBorder = (length: number) => (coords: Coordinates) => {
  return coords.i >= 0 && coords.j >= 0 && coords.i < length && coords.j < length;
};

const move = (coords: Coordinates, delta: CoordinatesDelta) => {
  return {
    i: coords.i + delta.deltaI,
    j: coords.j + delta.deltaJ,
  };
};

const Direction = {
  left: { deltaI: 0, deltaJ: -1 },
  right: { deltaI: 0, deltaJ: 1 },
  up: { deltaI: -1, deltaJ: 0 },
  down: { deltaI: 1, deltaJ: 0 },
  upRight: { deltaI: -1, deltaJ: 1 },
  downLeft: { deltaI: 1, deltaJ: -1 },
};

function isEqual(a: CoordinatesDelta, b: CoordinatesDelta) {
  return a.deltaI === b.deltaI && a.deltaJ === b.deltaJ;
}

export function connectMatrixToRight<T>(matrix1: T[][], matrix2: T[][]): T[][] {
  if (matrix1.length === 0) return matrix2;
  if (matrix2.length === 0) return matrix1;

  return matrix1.map((row, i) => {
    return row.concat(matrix2[i]);
  });
}

export function connectMatrixToBottom<T>(matrix1: T[][], matrix2: T[][]): T[][] {
  return matrix1.concat(matrix2);
}

export function* getZigZagOrder(length: number): Generator<{ i: number; j: number; }> {
  let direction = Direction.upRight;
  let coords = { i: 0, j: 0 };
  const isInside = checkBorder(length);

  while (coords.i < length && coords.j < length) {
    yield coords;

    if (isInside(move(coords, direction))) {
      coords = move(coords, direction);
    } else {
      let delta: CoordinatesDelta = Direction.down;

      if (isEqual(direction, Direction.downLeft)) {
        direction = Direction.upRight;
        if (isInside(move(coords, Direction.down))) {
          delta = Direction.down;
        } else {
          delta = Direction.right;
        }
      } else if (isEqual(direction, Direction.upRight)) {
        direction = Direction.downLeft;
        if (isInside(move(coords, Direction.right))) {
          delta = Direction.right;
        } else {
          delta = Direction.down;
        }
      }


      coords = move(coords, delta);
    }
  }

  return;
}

export function zigzagify<T>(arr: T[]): T[][] {
  const length = Math.sqrt(arr.length);
  if (!Number.isInteger(length)) {
    throw new Error('Array should be able to be turned in square');
  }

  const res = (new Array<T[]>(length)).fill([]).map(() => (new Array<T>(length)));

  let k = 0;
  for (const coords of getZigZagOrder(length)) {
    res[coords.i][coords.j] = arr[k];
    k += 1;
  }

  return res;
}
