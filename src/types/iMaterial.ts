import PointLight from "../lights/pointTight";
import Vector3D from "../models/vector3D";
import { ILight } from "./iLight";

export interface IMaterial {
  getRays(ray: Vector3D, norm: Vector3D, lights: ILight[]): { dir?: Vector3D, weight: number, light?: ILight }[]
  getColor(colors: {color: Vector3D, weight: number, l: number}[]): Vector3D
}
