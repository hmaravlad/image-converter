import { IImageWriter } from "src/types/writer";
import { ppmWriter } from "./ppm";
import { bmpWriter } from './bmp';

interface IWriterFactory {
  writers: { [key: string]: IImageWriter },
  getWriter(goalFormat: string): IImageWriter
}

export const writerFactory: IWriterFactory = {
  writers: {
    ppm: ppmWriter,
    bmp: bmpWriter,
  },
  getWriter(goalFormat: string): IImageWriter {
    const writer = this.writers[goalFormat];
    if (!writer) throw new Error(`Goal format: ${goalFormat} is not supported`);
    return writer;
  }
};
