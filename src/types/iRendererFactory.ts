import PointLight from "../lights/pointTight";
import { Options } from "../models/options";
import { ILight } from "./iLight";
import { IRenderer } from "./renderer";

export interface IRendererFactory {
  getRenderer: (lights: ILight[], options: Options) => IRenderer
}