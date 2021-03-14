import { Image } from '../../types/image';
import { IRGB } from '../../types/rgb';
import { connectMatrixToBottom, connectMatrixToRight } from '../../util/matrix';

function YCbCrToRGB(Y: number, Cb: number, Cr: number): IRGB {
  const rgb: IRGB = { red: 0, blue: 0, green: 0 };
  rgb.red = Math.round(Y + 1.402 * (Cr - 128));
  rgb.green = Math.round(Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128));
  rgb.blue = Math.round(Y + 1.772 * (Cb - 128));

  rgb.red = Math.min(Math.max(0, rgb.red), 255);
  rgb.green = Math.min(Math.max(0, rgb.green), 255);
  rgb.blue = Math.min(Math.max(0, rgb.blue), 255);

  return rgb;
}


export function createImage(tables: { channel: number, table: number[][] }[], width: number): Image {
  let result: Image = [];
  let currRow: Image = [];

  for (let i = 0; i < tables.length; i += 6) {
    const Y = connectMatrixToBottom(
      connectMatrixToRight(tables[i].table, tables[i + 1].table),
      connectMatrixToRight(tables[i + 2].table, tables[i + 3].table),
    );
    const Cb = tables[i + 4].table;
    const Cr = tables[i + 5].table;

    const sector: Image = (new Array(16)).fill([]).map(() => []);

    for (let y = 0; y < 16; ++y) {
      for (let x = 0; x < 16; ++x) {
        sector[y][x] = YCbCrToRGB(Y[y][x], Cb[Math.floor(y / 2)][Math.floor(x / 2)], Cr[Math.floor(y / 2)][Math.floor(x / 2)]);
      }
    }

    if (!currRow[0] || currRow[0].length < width) {
      currRow = connectMatrixToRight(currRow, sector);
    }

    if (currRow[0]?.length >= width) {
      result = connectMatrixToBottom(result, currRow);
      currRow = [];
    }
  }

  return result;
}
