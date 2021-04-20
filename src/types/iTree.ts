import Vector3D from "../models/vector3D";
import { TraverseResult } from "./traverseResult";

export interface ITree {
  traverse: (orig: Vector3D, dir: Vector3D) => TraverseResult | undefined
}