import { HuffmanTree } from '../../util/huffman';
import { zigzagify } from '../../util/matrix';

interface Marker {
  type: string,

  parse(buffer: Buffer): Info
}

class GeneralInfo {
  width: number;
  height: number;
  quantizationIds: number[];

  constructor(width: number, height: number, quantizationIds: number[]) {
    this.width = width;
    this.height = height;
    this.quantizationIds = quantizationIds;
  }
}

class QuantizationTableInfo {
  id: number;
  table: number[][];

  constructor(id: number, table: number[][]) {
    this.id = id;
    this.table = table;
  }
}

class HuffmanTreeInfo {
  type: string;
  id: number;
  tree: HuffmanTree;

  constructor(type: string, id: number, tree: HuffmanTree) {
    this.type = type;
    this.id = id;
    this.tree = tree;
  }
}

class DataInfo {
  data: Buffer;
  huffmanIds: { AC: number[], DC: number[] };

  constructor(data: Buffer, huffmanIds: { AC: number[], DC: number[] }) {
    this.huffmanIds = huffmanIds;
    this.data = data;
  }
}

type Info = GeneralInfo | QuantizationTableInfo | HuffmanTreeInfo | DataInfo;

const markers: { [key: number]: Marker } = {
  0xC0: {
    type: 'SOFO',
    parse(buffer: Buffer): GeneralInfo {
      if (
        buffer[2] !== 8
        || buffer[7] !== 3
        || buffer[9] !== 0X22
        || buffer[12] !== 0X11
        || buffer[15] !== 0X11
      ) {
        throw new Error('This type of Jpeg is not supported');
      }

      const height = buffer[3] * 256 + buffer[4];
      const width = buffer[5] * 256 + buffer[6];
      const quantizationIds = [10, 13, 16].map(i => buffer[i]);
      return new GeneralInfo(width, height, quantizationIds);
    },
  },
  0xDB: {
    type: 'Quantization',
    parse(buffer: Buffer): QuantizationTableInfo {
      if (
        buffer[1] !== 0x43
        || Math.floor(buffer[2] / 16) !== 0
      ) {
        throw new Error('This type of Jpeg is not supported');
      }

      const id = buffer[2] % 16;
      const table = zigzagify([...buffer.slice(3, buffer.length)]);

      return new QuantizationTableInfo(id, table);
    },
  },
  0xC4: {
    type: 'Huffman',
    parse(buffer: Buffer): HuffmanTreeInfo {
      const type = Math.floor(buffer[2] / 16) === 0 ? 'DC' : 'AC';
      const id = buffer[2] % 16;
      const codeQuantities = [...buffer.slice(3, 3 + 16)];
      const values = [...buffer.slice(19, buffer.length)];
      const tree = HuffmanTree.from(codeQuantities, values);
      return new HuffmanTreeInfo(type, id, tree);
    },
  },
  0xDA: {
    type: 'SOS',
    parse(buffer: Buffer): DataInfo {
      const data = buffer.slice(12, buffer.length);
      const huffmanIds = {
        DC: [4, 6, 8].map(i => buffer[i] % 16),
        AC: [4, 6, 8].map(i => Math.floor(buffer[i] / 16)),
      };
      return new DataInfo(data, huffmanIds);
    },
  },
};

export function parseJpeg(buffer: Buffer): {
  quantizationTables: number[][][];
  huffmanTrees: { [key: string]: HuffmanTree[]; };
  data: Buffer;
  huffmanIds: { AC: number[]; DC: number[]; };
  width: number;
  height: number; quantizationIds: number[];
} {
  let currMarker: Marker | undefined;
  const results = [];


  for (let i = 2; i < buffer.length - 2; i++) {
    if (buffer[i] === 0xFF) {
      currMarker = markers[buffer[i + 1]];
      const sectionLength = buffer[i + 2] * 16 + buffer[i + 3];
      i += 2;

      if (currMarker) {
        if (currMarker.type !== 'SOS') {
          results.push(currMarker.parse(buffer.slice(i, i + sectionLength)));
        } else {
          results.push(currMarker.parse(buffer.slice(i, buffer.length - 2)));
        }
      }

      i += sectionLength - 1;
    }
  }

  const huffmanTrees: { [key: string]: HuffmanTree[] } = {
    DC: [],
    AC: [],
  };
  const quantizationTables = [];
  let generalInfo;
  let dataInfo;

  for (const info of results) {
    if (info instanceof HuffmanTreeInfo) {
      huffmanTrees[info.type][info.id] = info.tree;
    } else if (info instanceof QuantizationTableInfo) {
      quantizationTables[info.id] = info.table;
    } else if (info instanceof GeneralInfo) {
      generalInfo = info;
    } else if (info instanceof DataInfo) {
      dataInfo = info;
    }
  }

  if (!generalInfo || !dataInfo) throw new Error('Invalid JPEG file');

  return {
    ...generalInfo,
    ...dataInfo,
    quantizationTables,
    huffmanTrees,
  };
}
