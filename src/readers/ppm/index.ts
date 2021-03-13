import { Image } from 'src/types/image';
import { IImageReader } from 'src/types/reader';
import { IRGB } from 'src/types/rgb';

export const ppmReader: IImageReader = {
  read(buffer: Buffer): Image {
    try {
      const imageStr = buffer.toString('ascii');
      const imageStrFiltered = filterComments(imageStr);
      return parseImage(imageStrFiltered);
    } catch (error) {
      throw new Error('Invalid ppm file');
    }
  },
};

function filterComments(imageStr: string): string {
  return imageStr
    .split('\n')
    .filter(str => !str.match(/^\s*#.*$/))
    .join('\n');
}

const colorTo255 = (maxColor: number) => (color: number): number => {
  return Math.floor(color / maxColor * 255);
};

function parseImage(imageStr: string): Image {
  const imgArr = imageStr
    .split(/\s/)
    .filter(el => el !== '')
    .map(str => parseInt(str, 10));

  const width = imgArr[1];
  const length = imgArr[2];
  const maxColor = imgArr[3];
  const fixColor = colorTo255(maxColor);

  const image: Image = [];

  for (let i = 0; i < length; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      const index = i + j + 3;

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

