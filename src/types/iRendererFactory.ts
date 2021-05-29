import Light from "../models/light";
import { Options } from "../models/options";
import { IRenderer } from "./renderer";

export interface IRendererFactory {
  getRenderer: (lights: Light[], options: Options) => IRenderer
}