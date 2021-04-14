import Vector3D from './vector3D';
import { Image } from "../types/image";
import { IRGB } from "../types/rgb";

const convertFrom1To255: (vecValue: number) => number = (vecValue) => {
  return Math.max(0, Math.min(255, vecValue))
}

const convertFromVec3dToImage: (framebuffer: Vector3D[][]) => Image = (framebuffer) => {
  const result: IRGB[][] = [];
  for (let i = 0; i < framebuffer.length; i++) {
    const row: IRGB[] = [];
    for (let j = 0; j < framebuffer[i].length; j++) {
      // let p = this.pos + y * rowBytes + x * 3;
      row.push({
        red: convertFrom1To255(framebuffer[i][j].x),
        green: convertFrom1To255(framebuffer[i][j].y),
        blue: convertFrom1To255(framebuffer[i][j].z),
      })
    }
    result.push(row);
  }
  return result;
}

export default convertFromVec3dToImage;