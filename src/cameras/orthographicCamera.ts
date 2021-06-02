import { ITransformable } from "../types/iTransformable";
import Vector3D from "../models/vector3D";
import { ICamera } from "../types/iCamera";
import { Transformation } from "../models/transformation";
import { Options } from "../models/options";
import { degToRad } from "../util/degToRad";

export class OrthographicCamera implements ICamera {
  origin: Vector3D = new Vector3D(0, 0, 0)
  constructor(readonly options: Options) {
  }
  getDir(k: number, j: number): { orig: Vector3D, dir: Vector3D } {
    const x =
      (((2 * (k + 0.5)) / this.options.width - 1) * this.options.width) / this.options.height;
    const y = 1 -((2 * (j + 0.5)) / this.options.height);
    return { orig: new Vector3D(x, y, -1), dir: new Vector3D };
  }
}