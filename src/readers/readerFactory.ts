import { IImageReader } from '../types/reader';
import { jpegReader } from './jpeg';
import { ppmReader } from './ppm';
import { cowsceneReader } from './cowscene';
import { Converter } from '../util/converter';
import { TYPES } from '../types';
import { IRendererFactory } from '../types/iRendererFactory';
import { inject, injectable } from 'inversify';
import { ILightProvider } from '../types/iLightProvider';
import { IOptionsProvider } from '../types/iOptionsProvider';

export interface IReaderFactory {
  readers: { [key: string]: IImageReader },

  getReader(source: string): IImageReader
}

@injectable()
export class ReaderFactory implements IReaderFactory {
  readers: { [key: string]: IImageReader };
  constructor(
    @inject(TYPES.IRendererFactory) rendererFactory: IRendererFactory,
  ) {
    this.readers = {
      ppm: new ppmReader(),
      jpg: new jpegReader(),
      jpeg: new jpegReader(),
      cowscene: new cowsceneReader(rendererFactory, new Converter()),
    }
  }

  getReader(source: string): IImageReader {
    const sourceFormat = source.split('.').pop();
    if(!sourceFormat) throw new Error('Unknown source Format');
    const reader = this.readers[sourceFormat];
    if(!reader) throw new Error(`Source format: ${ sourceFormat } is not supported`);
    return reader;
  }
}
