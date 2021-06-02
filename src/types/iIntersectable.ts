import Vector3D from "../models/vector3D";
import { IntersectResult } from "./hitResult";
import { IMaterial } from "./iMaterial";

export interface IIntersectable {
  intersectWithRay(orig: Vector3D, dir: Vector3D): IntersectResult | undefined
  intersectWithRayBool(orig: Vector3D, dir: Vector3D): boolean
  material: IMaterial
}

export function isIntersectable(shape: unknown): shape is IIntersectable {
  return (shape as IIntersectable).intersectWithRay !== undefined && (shape as IIntersectable).intersectWithRayBool !== undefined;
}