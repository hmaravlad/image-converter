import { Image } from "./image";

export interface IImageReader {
  read(buffer: Buffer): Image
}