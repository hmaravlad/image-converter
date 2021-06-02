import { ILight } from "../types/iLight";
import Vector3D from "../models/vector3D";

export class DirectionalLight implements ILight {
  constructor(readonly dir: Vector3D, readonly color: Vector3D, private readonly intensity: number = 1) {

  }
}

export function isDirectionalLight(light: unknown): light is DirectionalLight {
  return (light as DirectionalLight).dir !== undefined;
}
