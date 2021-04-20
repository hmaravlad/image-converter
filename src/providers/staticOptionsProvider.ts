import { injectable } from "inversify";
import { Options } from "../models/options";
import Vector3D from "../models/vector3D";
import { IOptionsProvider } from "../types/iOptionsProvider";

@injectable()
export class StaticOptionsProvider implements IOptionsProvider {
  getOptions(): Options {
    return new Options(
      100,
      100,
      0.2,
      150,
      new Vector3D(255, 255, 255),
      new Vector3D(108, 34, 25),
      new Vector3D(0, 2, 0),
    );
  }
}