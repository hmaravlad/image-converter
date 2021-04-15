import { IImageReader } from 'src/types/reader';
import { jpegReader } from './jpeg';
import { ppmReader } from './ppm';
import { objReader } from './obj';
import RayTraceRender from '../renders/rayTraceRender';
import Light from '../models/light';
import Vector3D from '../models/vector3D';
import { Options } from '../models/options';
import { Converter } from '../util/converter';

interface IReaderFactory {
  readers: { [key: string]: IImageReader },

  getReader(source: string): IImageReader
}

const options = new Options(
  200,
  200,
  0.2,
  150,
  new Vector3D(255, 255, 255),
  new Vector3D(108, 34, 25),
  new Vector3D(0, 2, 0),
);

const light = new Light(new Vector3D(0, 2, 0), 2);

export const readerFactory: IReaderFactory = {
  readers: {
    ppm: new ppmReader(),
    jpg: new jpegReader(),
    jpeg: new jpegReader(),
    obj: new objReader(new RayTraceRender([light], options), new Converter()),
  },
  getReader(source: string): IImageReader {
    const sourceFormat = source.split('.').pop();
    if(!sourceFormat) throw new Error('Unknown source Format');
    const reader = this.readers[sourceFormat];
    if(!reader) throw new Error(`Source format: ${ sourceFormat } is not supported`);
    return reader;
  },
};
