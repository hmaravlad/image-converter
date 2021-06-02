import { ITransformable } from "../types/iTransformable";
import Vector3D from "../models/vector3D";
import { ICamera } from "../types/iCamera";
import { Transformation } from "../models/transformation";
import { Options } from "../models/options";

export class WeirdCamera implements ICamera, ITransformable {
  origin: Vector3D = new Vector3D(0, 0, 0)
  constructor(readonly options: Options, readonly transformation: Transformation, public fov: number = 150) {
    this.transform(transformation);
  }
  transform(cameraToWorld: Transformation): void {
    this.origin = cameraToWorld.applyToVector(this.origin);
    console.dir({ origin: this.origin })
  }
  getDir(k: number, j: number): { orig: Vector3D, dir: Vector3D } {
    const x =
      (((2 * (k + 0.5)) / this.options.width - 1) *
        Math.tan(this.fov / 2) *
        this.options.width) /
      this.options.height;
    const z =
      -((2 * (j + 0.5)) / this.options.height - 1) * Math.tan(this.fov / 2);
    return { dir: new Vector3D(x, -1, z), orig: this.origin };
  }
}