import { ArgumentConfig } from "ts-command-line-args";

export interface IConvertImageArgsRaw {
  source: string,
  output?: string,
  goalFormat: string,
}

export interface IConvertImageArgs {
  source: string,
  output: string,
  goalFormat: string,
}

export const ConvertImageArgsConfig: ArgumentConfig<IConvertImageArgsRaw> = {
  source: String,
  output: { type: String, optional: true },
  goalFormat: String,
};
