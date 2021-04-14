import { IImageReader } from 'src/types/reader';
import { jpegReader } from './jpeg';
import { ppmReader } from './ppm';
import { objReader } from "./obj";

interface IWriterFactory {
  readers: { [key: string]: IImageReader },

  getReader(source: string): IImageReader
}

export const readerFactory: IWriterFactory = {
  readers: {
    ppm: ppmReader,
    jpg: jpegReader,
    jpeg: jpegReader,
    obj: new objReader(),
  },
  getReader(source: string): IImageReader {
    const sourceFormat = source.split('.').pop();
    if (!sourceFormat) throw new Error('Unknown source Format');
    const reader = this.readers[sourceFormat];
    if (!reader) throw new Error(`Source format: ${sourceFormat} is not supported`);
    return reader;
  },
};
