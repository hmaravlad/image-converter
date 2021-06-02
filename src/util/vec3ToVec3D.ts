import { Vector3 } from "@computer-graphics-course/scene-format";
import Vector3D from "../models/vector3D";

export function vec3ToVec3D(vec3: Vector3): Vector3D {
  return new Vector3D(vec3.x, vec3.y, vec3.z)
}