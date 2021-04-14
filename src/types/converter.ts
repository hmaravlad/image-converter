import Vector3D from "../models/vector3D";
import { IRGB } from "./rgb";

export interface IConverter {
  convert(framebuffer: Vector3D[][]): IRGB[][]
}