import Vector3D from "../models/vector3D";
import { Image } from "./image";

export interface IConverter {
  convert(framebuffer: Vector3D[][]): Image
}