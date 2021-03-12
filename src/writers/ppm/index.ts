import { Image } from "src/types/image";
import { IImageWriter } from "src/types/writer";

export const ppmWriter: IImageWriter = {
  write(image: Image): Buffer {
    const width = image[0].length;
    const height = image.length;
    const imageStr = image
      .map(row => row.map(val => `${val.red} ${val.green} ${val.blue}`).join('\t'))
      .join('\n');
    const maxColor = 255;

    return Buffer.from(
      'P3\n' +
      `${width} ${height} ${maxColor}\n` +
      `${imageStr}`
      , 'ascii')
  }
};
