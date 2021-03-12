import { HuffmanTree } from '../../util/huffman';
import { zigzagify } from '../../util/matrix';

export function decodeJpeg(
  data: Buffer,
  huffmanTrees: { AC: HuffmanTree[], DC: HuffmanTree[] },
  huffmanIds: { AC: number[], DC: number[] },
): { channel: number; table: number[][]; }[] {

  const filtered = [...data].filter((value, i) => (
    i - 1 < 0 || !(value === 0x00 && data[i - 1] === 0xFF)
  ));
  const bits = filtered.map(a => a.toString(2).padStart(8, '0')).join('');
  const read = readTable(huffmanTrees, huffmanIds, bits);

  let i = 0;
  const lastDC = { 0: 0, 1: 0, 2: 0 };

  const tables = [];

  while (i < bits.length) {
    for (const channel of getChannels()) {
      try {
        const res = read(i, channel);
        i = res.i;
        res.table[0][0] = lastDC[channel] + res.table[0][0];
        lastDC[channel] = res.table[0][0];
        tables.push({ channel, table: res.table });
      } catch (error) {
        i = bits.length;
        break;
      }
    }
  }

  return tables;
}

function* getChannels() {
  yield 0;
  yield 0;
  yield 0;
  yield 0;
  yield 1;
  yield 2;
  return;
}

const readTable = (
  huffmanTrees: { AC: HuffmanTree[], DC: HuffmanTree[] },
  huffmanIds: { AC: number[], DC: number[] },
  data: string,
) => (start: number, channel: number): { table: number[][], i: number } => {
  let i = start;
  const dcHuffmanTree = huffmanTrees.DC[huffmanIds.DC[channel]];
  const acHuffmanTree = huffmanTrees.AC[huffmanIds.AC[channel]];

  let isFindingDC = true;

  let values: number[] = [];
  let reader = dcHuffmanTree.getValue();


  while (values.length < 64) {
    const val = reader(parseInt(data[i]))?.value;
    if (val !== undefined) {
      if (isFindingDC) {
        if (val === 0) {
          values.push(0);
          i += 1;
        } else {
          values.push(getValue(data.slice(i + 1, i + 1 + val)));
          i += val + 1;
        }
      } else {
        if (val === 0) {
          values = values.concat((new Array(64 - values.length)).fill(0));
          i += 1;
        } else {
          const zeros = Math.floor(val / 16);
          const length = val % 16;
          values = values.concat((new Array(zeros)).fill(0));

          if (length === 0) {
            values.push(0);
            i += 1;
          } else {
            values.push(getValue(data.slice(i + 1, i + 1 + length)));
            i += length + 1;
          }

        }
      }
      if (isFindingDC) isFindingDC = false;
      reader = acHuffmanTree.getValue();
    } else {
      i += 1;
    }
  }

  return {
    table: zigzagify(values),
    i,
  };
};

function getValue(bits: string): number {
  const val = parseInt(bits, 2);
  if (bits[0] === '1') {
    return val;
  } else {
    return val - Math.pow(2, bits.length) + 1;
  }
}
