import { ILight } from "../types/iLight";
import Vector3D from "../models/vector3D";

class PointLight implements ILight {
  constructor(private _position: Vector3D, private _intensity: number, readonly color: Vector3D) {
  }

  get position(): Vector3D {
    return this._position;
  }

  set position(vec: Vector3D) {
    this._position = vec;
  }

  get intensity(): number {
    return this._intensity;
  }

  set intensity(newIntensity: number) {
    this._intensity = newIntensity;
  }
}

export function isPointLight(light: unknown): light is PointLight {
  return (light as PointLight).position !== undefined;
}
export default PointLight;