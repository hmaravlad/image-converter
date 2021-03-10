import { Image } from "src/types/image";
import { IImageReader } from "src/types/reader";
import { HuffmanTree } from "src/util/huffman";
import { decodeJpeg } from "./decoder";
import { applyIDCT } from "./IDCT";
import { parseJpeg } from "./parser";
import { quantizate } from "./quantization";
import { createImage } from "./toRGB";

export const jpegReader: IImageReader = {
  read(buffer: Buffer): Image {
    const { data, width, huffmanTrees, quantizationIds, quantizationTables, huffmanIds } = parseJpeg(buffer);
    const tablesRaw = decodeJpeg(data, huffmanTrees as { AC: HuffmanTree[], DC: HuffmanTree[] }, huffmanIds);
    const tables = applyIDCT(quantizate(tablesRaw, quantizationTables, quantizationIds));
    const image = createImage(tables, width);
    return image;
  }
}
