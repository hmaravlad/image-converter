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
import RayTraceRender from './renders/rayTraceRender';
import ObjParser from './util/objParser';
import { Options } from './models/options';
import Vector3D from './models/vector3D';
import { Converter } from './util/converter';
import Light from './models/light';

(async () => {
  const argsRaw = parse<IRenderImageArgsRaw>(ConvertRenderImageArgsConfig);
  const args = processArgs(argsRaw);

  const objString = (await promisify(readFile)(args.source)).toString();
  const parser = new ObjParser(objString);
  const data = parser.parse();

  const width = 100; const height = 100;

  const renderer = new RayTraceRender(
    [new Light(new Vector3D(0, 2, 0), 3)],
    new Options(
      height,
      width,
      0.2,
      150,
      new Vector3D(255, 255, 255),
      new Vector3D(108, 34, 25),
      new Vector3D(0, 2, 0),
    )
  );

  const renderResult = renderer.render(data);
  const image = (new Converter()).convert(renderResult);
  const imageWriter = writerFactory.getWriter(args.imageFormat);
  const resultBuffer = imageWriter.write(image);
  const fileName = generateFileName(args.source, args.output, args.imageFormat);
  await promisify(writeFile)(fileName, resultBuffer);
})();
