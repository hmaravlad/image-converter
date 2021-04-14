import { IImageReader } from 'src/types/reader';
import { jpegReader } from './jpeg';
import { ppmReader } from './ppm';
import { objReader } from "./obj";

interface IReaderFactory {
  readers: { [key: string]: IImageReader },

  getReader(source: string): IImageReader
}

export const readerFactory: IReaderFactory = {
  readers: {
    ppm: new ppmReader(),
    jpg: new jpegReader(),
    jpeg: new jpegReader(),
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
