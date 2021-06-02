import { ILight } from "../types/iLight";
import PointLight from "../lights/pointTight";
import Vector3D from "../models/vector3D";
import { IMaterial } from "../types/iMaterial";

const NUM_OF_RAYS = parseInt(process.env.NUM_OF_DAYS || '4')

function generateDirection(): Vector3D {
  return new Vector3D(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
}


export function RGBtoYCbCr(color: Vector3D): Vector3D {
  const R = color.x;
  const G = color.y;
  const B = color.z;
  const Y = 0 + 0.299 * R + 0.587 * G + 0.114 * B;
  const Cb = 128 - 0.168736 * R - 0.331264 * G + 0.5 * B;
  const Cr = 128 + 0.5 * R - 0.418688 * G - 0.081312 * B;
  return new Vector3D(Y, Cb, Cr);
}

export function YCbCrToRGB(color: Vector3D): Vector3D {
  const Y = color.x;
  const Cb = color.y;
  const Cr = color.z;

  let red = Math.round(Y + 1.402 * (Cr - 128));
  let green = Math.round(Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128));
  let blue = Math.round(Y + 1.772 * (Cb - 128));

  red = Math.min(Math.max(0, red), 255);
  green = Math.min(Math.max(0, green), 255);
  blue = Math.min(Math.max(0, blue), 255);

  return new Vector3D(red, green, blue);
}


export class LambertMaterial implements IMaterial {
  constructor(public color: Vector3D) { }

  getRays(ray: Vector3D, norm: Vector3D, lights: ILight[]): { dir?: Vector3D, weight: number, light?: ILight }[] {
    const rays: { dir?: Vector3D, weight: number, light?: ILight }[] = [];
    for (let i = 0; i < lights.length; i++) {
      rays.push({ light: lights[i], weight: 1 })
    }
    for (let i = 0; i < NUM_OF_RAYS; i++) {
      let dir = generateDirection();
      while(norm.dot(dir) < 0) {
        dir = generateDirection();
      }
      rays.push({ dir, weight: 1 / NUM_OF_RAYS });
    }
    return rays;
  }
  getColor(colors: { color: Vector3D, weight: number, l: number }[]): Vector3D {
    let resColor = new Vector3D(0, 0, 0)
    let l = 0;
    let sumWeight = 0;

    for (const color of colors) {
      l += color.l * color.weight
      sumWeight += color.weight
      resColor = resColor.add(RGBtoYCbCr(color.color).multiply(color.weight))
    }
    resColor = resColor.multiply(1 / sumWeight);
    resColor = resColor.multiply(1 / 2).add(RGBtoYCbCr(this.color).multiply(1 / 2));
    return YCbCrToRGB(resColor).multiply(l / sumWeight);
  }
}