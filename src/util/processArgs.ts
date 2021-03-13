import { IConvertImageArgs, IConvertImageArgsRaw } from "src/types/commandLineArgs";

export function processArgs(args: IConvertImageArgsRaw): IConvertImageArgs {
  return {
    source: args.source,
    output: args.output,
    goalFormat: args.goalFormat,
  }
}
