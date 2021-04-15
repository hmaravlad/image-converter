import { Image } from "../../types/image";
import { IImageReader } from "../../types/reader";
import { HuffmanTree } from "../../util/huffman";
import { decodeJpeg } from "./decoder";
import { applyIDCT } from "./IDCT";
import { parseJpeg } from "./parser";
import { quantizate } from "./quantization";
import { createImage } from "./toRGB";

export class jpegReader implements IImageReader {
  read(buffer: Buffer): Image {
    const { data, width, huffmanTrees, quantizationIds, quantizationTables, huffmanIds } = parseJpeg(buffer);
    const tablesRaw = decodeJpeg(data, huffmanTrees as { AC: HuffmanTree[], DC: HuffmanTree[] }, huffmanIds);
    const tables = applyIDCT(quantizate(tablesRaw, quantizationTables, quantizationIds));
    const image = createImage(tables, width);
    return image;
  }
}
