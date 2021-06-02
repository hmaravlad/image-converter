import Vector3D from "../models/vector3D";

export interface ICamera {
  origin: Vector3D
  getDir(j: number, k: number): { orig: Vector3D, dir: Vector3D }
}