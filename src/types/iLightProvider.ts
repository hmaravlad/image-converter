import Light from "../models/light";

export interface ILightProvider {
  getLight: () => Light[]
}