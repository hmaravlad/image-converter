import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { parse } from 'ts-command-line-args';
import { readerFactory } from './readers/readerFactory';
import {
  IConvertImageArgsRaw,
  ConvertImageArgsConfig
} from './types/commandLineArgs';
import { processArgs } from './util/processArgs';
import { writerFactory } from './writers/writerFactory';

(async () => {
  const argsRaw = parse<IConvertImageArgsRaw>(ConvertImageArgsConfig);
  const args = processArgs(argsRaw);

  const originalBuffer = await promisify(readFile)(args.source);
  const imageReader = readerFactory.getReader(args.source);
  const image = imageReader.read(originalBuffer);

  const imageWriter = writerFactory.getWriter(args.goalFormat);
  const resultBuffer = imageWriter.write(image);
  await promisify(writeFile)(`${args.output}.${args.goalFormat}`, resultBuffer)
})();
