import PointLight from "../lights/pointTight";

export interface ILightProvider {
  getLight: () => PointLight[]
}