const C = (x: number) => x === 0 ? 1 / Math.sqrt(2) : 1;

const IDCTtable: number[][] = [];
for (let i = 0; i < 8; i++) {
  IDCTtable.push([]);
  for (let j = 0; j < 8; j++) {
    IDCTtable[i][j] = C(j) * Math.cos((2 * i + 1) * j * Math.PI / 16)
  }
}


function IDCT(table: number[][]) {
  const result: number[][] = new Array(8).fill([]).map(() => []);

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      let sum = 0;
      for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
          sum += table[v][u] * IDCTtable[x][u] * IDCTtable[y][v];
        }
      }
      result[y][x] = Math.min(Math.max(Math.floor(sum / 4) + 128, 0), 255)
    }
  }
  return result;
}

export function applyIDCT(tables: { channel: number, table: number[][] }[]) {
  return tables.map(({ channel, table }) => {
    return { channel, table: IDCT(table) }
  })
}