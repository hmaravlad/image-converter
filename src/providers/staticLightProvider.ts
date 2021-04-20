import { injectable } from "inversify";
import Light from "../models/light";
import Vector3D from "../models/vector3D";
import { ILightProvider } from "../types/iLightProvider";

@injectable()
export class StaticLightProvider implements ILightProvider {
  getLight(): Light[] {
    return [new Light(new Vector3D(0, 2, 0), 2)];
  }
}