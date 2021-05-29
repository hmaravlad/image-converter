import { Container } from "inversify";
import { StaticLightProvider } from "./providers/staticLightProvider";
import { StaticOptionsProvider } from "./providers/staticOptionsProvider";
import { IReaderFactory, ReaderFactory } from "./readers/readerFactory";
import { RayTraceRendererFactory } from "./renderers/raytracing";
import { KdTreeFactory } from "./tree/kdtree";
import { LongestAxisBoxSplitter } from "./tree/kdtree/longestAxisBoxSplitter";
import { TYPES } from "./types";
import { IBoxSplitter } from "./types/iBoxSplitter";
import { ILightProvider } from "./types/iLightProvider";
import { IOptionsProvider } from "./types/iOptionsProvider";
import { IRendererFactory } from "./types/iRendererFactory";
import { ITreeFactory } from "./types/iTreeFactory";

const myContainer = new Container();
myContainer.bind<IReaderFactory>(TYPES.IReaderFactory).to(ReaderFactory);
myContainer.bind<IOptionsProvider>(TYPES.IOptionsProvider).to(StaticOptionsProvider);
myContainer.bind<ILightProvider>(TYPES.ILightProvider).to(StaticLightProvider);
myContainer.bind<IRendererFactory>(TYPES.IRendererFactory).to(RayTraceRendererFactory);
myContainer.bind<ITreeFactory>(TYPES.ITreeFactory).to(KdTreeFactory);
myContainer.bind<IBoxSplitter>(TYPES.IBoxSplitter).to(LongestAxisBoxSplitter);

export const readerFactory = myContainer.get<IReaderFactory>(TYPES.IReaderFactory);
