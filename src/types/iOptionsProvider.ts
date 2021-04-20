import { Options } from "../models/options";

export interface IOptionsProvider {
  getOptions: () => Options
}