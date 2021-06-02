import { ILight } from "../types/iLight";
import PointLight from "../lights/pointTight";
import Vector3D from "../models/vector3D";
import { IMaterial } from "../types/iMaterial";

export class SpecularMaterial implements IMaterial {
  getRays(ray: Vector3D, norm: Vector3D): { dir?: Vector3D, weight: number, light?: ILight }[] {
    const reflected = ray.minus(norm.multiply(ray.dot(norm)*2))
    return [{ dir: reflected, weight: 1 }];
  }
  getColor(colors: { color: Vector3D, weight: number, l: number }[]): Vector3D {
    return colors[0].color;
  }
}