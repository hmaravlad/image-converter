import { ILight } from "../types/iLight";
import PointLight from "../lights/pointTight";
import Vector3D from "../models/vector3D";
import { IMaterial } from "../types/iMaterial";
import { LambertMaterial, RGBtoYCbCr, YCbCrToRGB } from "./lambertMaterial";
import { SpecularMaterial } from "./specularMaterial";

export class CombinedMaterial implements IMaterial {
  constructor(readonly specularWeight: number, readonly lambertWeight: number, readonly color: Vector3D) { }
  readonly specular = new SpecularMaterial();
  readonly lambert = new LambertMaterial(this.color)

  getRays(ray: Vector3D, norm: Vector3D, lights: ILight[]): { dir?: Vector3D, weight: number, light?: ILight }[] {
    const specularRays = this.specular.getRays(ray, norm);
    const lambertRays = this.lambert.getRays(ray, norm, lights)
    return specularRays.concat(lambertRays);
  }
  getColor(colors: { color: Vector3D, weight: number, l: number }[]): Vector3D {
    const colorsForSpec = colors.shift()
    if (!colorsForSpec) throw Error();
    const specularColor = this.specular.getColor([colorsForSpec]);
    const lambertColor = this.lambert.getColor(colors)

    const resColor = RGBtoYCbCr(specularColor).multiply(this.specularWeight).add(RGBtoYCbCr(lambertColor).multiply(this.lambertWeight));
    return YCbCrToRGB(resColor);
  }
}