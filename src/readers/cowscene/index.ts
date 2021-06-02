import { IImageReader } from "../../types/reader";
import { Image } from "../../types/image";
import { IConverter } from "../../types/converter";

import { SceneFormatIO } from '@computer-graphics-course/scene-format';
import { TypeMapper } from "./typeMapper";
import { IRendererFactory } from "../../types/iRendererFactory";

export class cowsceneReader implements IImageReader {

  constructor(private readonly rendererFactory: IRendererFactory, private readonly converter: IConverter) {
  }


  public async read(buffer: Buffer): Promise<Image>{
    const data = buffer.toString('utf-8');
    const scene = SceneFormatIO.decode(data);
    const typeMapper = new TypeMapper();
    const { shapes, lights, options } = await typeMapper.map(scene)
    const renderer = this.rendererFactory.getRenderer(lights, options)
    const result = renderer.render(shapes)
    return this.converter.convert(result).reverse();
  }
}
