import Light from "../models/light";
import { Options } from "../models/options";
import { IRender } from "./render";

export interface IRendererFactory {
  getRenderer: (lights: Light[], options: Options) => IRender
}