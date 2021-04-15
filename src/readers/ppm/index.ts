import { Image } from 'src/types/image';
import { IImageReader } from 'src/types/reader';
import { IRGB } from 'src/types/rgb';

export class ppmReader implements IImageReader {
  private colorTo255(maxColor: number): (color: number) => number {
    return color => Math.floor(color / maxColor * 255);
  }

  private parseImage(imageStr: string): Image {
    const imgArr = imageStr
      .split(/\s+/g)
      .filter(el => el !== '')
      .map(str => parseInt(str, 10));

    const width = imgArr[1];
    const length = imgArr[2];
    const maxColor = imgArr[3];
    const fixColor = this.colorTo255(maxColor);

    const image: Image = [];
    const numWidth = width * 3;

    for (let i = 0; i < length; i++) {
      const row = [];
      for (let j = 0; j < numWidth; j += 3) {
        const index = i * (numWidth) + j + 4;

        const color: IRGB = {
          red: fixColor(imgArr[index]),
          green: fixColor(imgArr[index + 1]),
          blue: fixColor(imgArr[index + 2]),
        };

        row.push(color);
      }
      image.push(row);
    }

    return image;
  }

  private filterComments(imageStr: string): string {
    return imageStr
      .split('\n')
      .filter(str => !str.match(/^\s*#.*$/))
      .join('\n');
  }

  read(buffer: Buffer): Image {
    try {
      const imageStr = buffer.toString('ascii');
      const imageStrFiltered = this.filterComments(imageStr);
      return this.parseImage(imageStrFiltered);
    } catch (error) {
      throw new Error('Invalid ppm file');
    }
  }
}

