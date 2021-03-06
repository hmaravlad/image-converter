import { Image } from '../../types/image';
import { IImageWriter } from '../../types/writer';

function generateBitmapFileHeader({
  fileSize = 0,
  applicationHeader = 0,
  imageDataOffset = 0,
}): Buffer {
  const buffer = Buffer.alloc(14);
  // A bitmap file starts with a "BM" in ASCII.
  buffer.write('B', 0);
  buffer.write('M', 1);
  // The entire filesize.
  buffer.writeInt32LE(fileSize, 2);
  // 4 bytes reserved for the application creating the image.
  buffer.writeInt32LE(applicationHeader, 6);
  // The byte offset to access the pixel data.
  buffer.writeInt32LE(imageDataOffset, 10);
  return buffer;
}

function generateDibHeader({
  width,
  height,
  bitsPerPixel,
  bitmapDataSize,
  numberOfColorsInPalette = 0,
}: {
  width: number,
  height: number,
  bitsPerPixel: number,
  bitmapDataSize: number,
  numberOfColorsInPalette?: number,
}) {
  const buffer = Buffer.alloc(40);
  // The size of the header.
  buffer.writeInt32LE(40, 0);
  // The width and height of the bitmap image.
  buffer.writeInt32LE(width, 4);
  buffer.writeInt32LE(height, 8);
  // The number of color planes, which in bitmap files is always 1
  buffer.writeInt16LE(1, 12);
  buffer.writeInt16LE(bitsPerPixel, 14);
  // Compression method, not supported in this package.
  buffer.writeInt32LE(0, 16);
  buffer.writeInt32LE(bitmapDataSize, 20);
  // The horizontal and vertical resolution of the image.
  // On monitors: 72 DPI × 39.3701 inches per metre yields 2834.6472
  buffer.writeInt32LE(2835, 24);
  buffer.writeInt32LE(2835, 28);
  // Number of colors in the palette.
  buffer.writeInt32LE(numberOfColorsInPalette, 32);
  // Number of important colors used.
  buffer.writeInt32LE(0, 36);
  return buffer;
}

const writeImageToBuffer: (inputData: { image: Image, width: number, height: number, padding: number }) => Buffer
  = ({ image, width, height, padding }) => {
  const buffer = Buffer.alloc(height * width * 3 + 1);
  let offset = 0;
  const reversedImage = image.reverse();
  for (let i = 0; i < reversedImage.length; i++) {
    for (let j = 0; j < reversedImage[i].length; j++) {
      buffer.writeInt16LE(reversedImage[i][j].blue, offset);
      offset++;
      buffer.writeInt16LE(reversedImage[i][j].green, offset);
      offset++;
      buffer.writeInt16LE(reversedImage[i][j].red, offset);
      offset++;

      if (padding !== 0) {
        let p = 0;
        while (p < padding) {
          buffer.writeInt16LE(0, offset);
          offset++;
          p++;
        }
      }
    }
  }
  return buffer;
};

export const bmpWriter: IImageWriter = {
  write(image: Image): Buffer {
    const padding = (image[0].length * 3 % 4) ? 4 - (image[0].length * 3) % 4 : 0;
    const width = image[0].length + padding;
    const height = image.length;
    const imageDataOffset = 54;
    const bitsPerPixel = 24;
    const fileSize = imageDataOffset + height * width * (bitsPerPixel / 8);
    const fileContent = Buffer.alloc(fileSize);

    const fileHeader = generateBitmapFileHeader({
      fileSize,
      imageDataOffset,
    });
    fileHeader.copy(fileContent);

    const dibHeader = generateDibHeader({
      width,
      height,
      bitsPerPixel,
      bitmapDataSize: fileSize,
    });
    dibHeader.copy(fileContent, 14);

    const imageBuffer = writeImageToBuffer({ image, height, width, padding });

    imageBuffer.copy(fileContent, 54);
    return fileContent;
  },
};
