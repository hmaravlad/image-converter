import Vector3D from "../models/vector3D";

export interface SceneIntersectResult {
  flag: boolean, 
  hit: Vector3D, 
  normal: Vector3D
}