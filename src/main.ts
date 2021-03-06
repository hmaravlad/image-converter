import "reflect-metadata";
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { parse } from 'ts-command-line-args';
import {
  IRenderImageArgsRaw,
  ConvertRenderImageArgsConfig
} from './types/commandLineArgs';
import { processArgs } from './util/processArgs';
import { writerFactory } from './writers/writerFactory';
import { generateFileName } from './util/generateFileName';
import { readerFactory } from './compositionRoot';

(async () => {
  const argsRaw = parse<IRenderImageArgsRaw>(ConvertRenderImageArgsConfig);
  const args = processArgs(argsRaw);

  const originalBuffer = await promisify(readFile)(args.source);
  const imageReader = readerFactory.getReader(args.source);
  const image = await imageReader.read(originalBuffer);

  const imageWriter = writerFactory.getWriter(args.imageFormat);
  const resultBuffer = imageWriter.write(image);
  const fileName = generateFileName(args.source, args.output, args.imageFormat);
  await promisify(writeFile)(fileName, resultBuffer);
})();
