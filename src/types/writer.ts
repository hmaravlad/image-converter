import { Image } from "./image";

export interface IImageWriter {
  write(image: Image): Buffer
}