import {
  IRenderImageArgs,
  IRenderImageArgsRaw
} from "src/types/commandLineArgs";

export function processArgs(args: IRenderImageArgsRaw): IRenderImageArgs {
  return {
    source: args.source,
    output: args.output,
    imageFormat: (args.output.split('.').slice(-1))[0],
  }
}
