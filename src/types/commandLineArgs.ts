import { ArgumentConfig } from "ts-command-line-args";

export interface IConvertImageArgsRaw {
  source: string,
  output?: string,
  goalFormat: string,
}

export interface IConvertImageArgs {
  source: string,
  output?: string,
  goalFormat: string,
}

export interface IRenderImageArgsRaw {
  source: string,
  output: string,
}

export interface IRenderImageArgs {
  source: string,
  output: string,
  imageFormat: string,
}

export const ConvertRenderImageArgsConfig: ArgumentConfig<IRenderImageArgsRaw> = {
  source: String,
  output: String,
};

export const ConvertImageArgsConfig: ArgumentConfig<IConvertImageArgsRaw> = {
  source: String,
  output: { type: String, optional: true },
  goalFormat: String,
};
