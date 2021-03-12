export function quantizate(
  tables: { channel: number, table: number[][] }[],
  quantizationTables: number[][][],
  quantizationIds: number[],
): { channel: number, table: number[][] }[] {
  return tables.map(({ channel, table }) => {
    const quantizationTable = quantizationTables[quantizationIds[channel]];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        table[i][j] *= quantizationTable[i][j];
      }
    }

    return { channel, table };
  });
}
