import { ITransformable } from "../types/iTransformable";
import Vector3D from "../models/vector3D";
import { ICamera } from "../types/iCamera";
import { Transformation } from "../models/transformation";
import { Options } from "../models/options";
import { degToRad } from "../util/degToRad";

export class PerspectiveCamera implements ICamera, ITransformable {
  origin: Vector3D = new Vector3D(0, 0, 0)
  constructor(readonly options: Options, readonly cameraToWorld: Transformation, public fov: number) {
    this.transform(cameraToWorld);
  }
  transform(cameraToWorld: Transformation): void {
    this.origin = cameraToWorld.applyToVector(this.origin);
  }
  getDir(x: number, y: number): { orig: Vector3D, dir: Vector3D } {
    /*
    const u = new Vector3D(...this.cameraToWorld.matrix.values[0])
    const v = new Vector3D(...this.cameraToWorld.matrix.values[1])
    const w = new Vector3D(...this.cameraToWorld.matrix.values[2])
    const w_p = u.multiply(-this.options.width / 2 ).add(v.multiply(this.options.height / 2)).minus(w.multiply((this.options.height / 2) / Math.tan(degToRad(this.fov) * 0.5))); 
    const dir = u.multiply(x).add(v.multiply(-1 * y)).add(w_p).normalize();
    return dir;
    */
    
    const imageAspectRatio = this.options.width / this.options.height; // assuming width > height 
    const Px = (2 * ((x + 0.5) / this.options.width) - 1) * Math.tan(this.fov / 2 * Math.PI / 180);
    const Py = (1 - 2 * ((y + 0.5) / this.options.height)) * Math.tan(this.fov / 2 * Math.PI / 180) / imageAspectRatio;
    //float y = (1 - 2 * (j + 0.5) / (float)options.height) * scale; 
    const rayPWorld = this.cameraToWorld.applyToVector(new Vector3D(Px, Py, -1));
    const rayDirection = rayPWorld.minus(this.origin);
    return { orig: this.origin, dir: rayDirection.normalize() }; // it's a direction so don't forget to normalize 
    /*
    const x =
      (((2 * (k + 0.5)) / this.options.width - 1) *
        Math.tan(this.fov / 2) *
        this.options.width) /
      this.options.height;
    const z =
      -((2 * (j + 0.5)) / this.options.height - 1) * Math.tan(this.fov / 2);
    return new Vector3D(x, -1, z);
    */
  }
}