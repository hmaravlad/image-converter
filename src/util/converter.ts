import { IConverter } from "../types/converter";
import Vector3D from "../models/vector3D";
import { IRGB } from "../types/rgb";
import { Image } from "../types/image";

export class Converter implements IConverter{
  private convertFrom1To255(vecValue: number): number {
    return Math.max(0, Math.min(255, vecValue))
  }

  convert(framebuffer: Vector3D[][]): Image {
    const result: Image = [];
    for (let i = 0; i < framebuffer.length; i++) {
      const row: IRGB[] = [];
      for (let j = 0; j < framebuffer[i].length; j++) {
        // let p = this.pos + y * rowBytes + x * 3;
        row.push({
          red: this.convertFrom1To255(framebuffer[i][j].x),
          green: this.convertFrom1To255(framebuffer[i][j].y),
          blue: this.convertFrom1To255(framebuffer[i][j].z),
        })
      }
      result.push(row);
    }
    return result;
  }
}