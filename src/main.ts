import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { parse } from 'ts-command-line-args';
import { readerFactory } from './readers/readerFactory';
import {
  IConvertImageArgsRaw,
  ConvertImageArgsConfig,
} from './types/commandLineArgs';
import { processArgs } from './util/processArgs';
import { writerFactory } from './writers/writerFactory';
import { generateFileName } from './util/generateFileName';

(async () => {
  const argsRaw = parse<IConvertImageArgsRaw>(ConvertImageArgsConfig);
  const args = processArgs(argsRaw);

  const originalBuffer = await promisify(readFile)(args.source);
  const imageReader = readerFactory.getReader(args.source);
  const image = imageReader.read(originalBuffer);

  const imageWriter = writerFactory.getWriter(args.goalFormat);
  const resultBuffer = imageWriter.write(image);
  const fileName = generateFileName(args);
  await promisify(writeFile)(fileName, resultBuffer);
})();
