import { IConvertImageArgs } from '../types/commandLineArgs';

export const generateFileName: (data: IConvertImageArgs) => string = (data) => {
  const sourceNameArray = data.source.split('.');
  sourceNameArray.pop();
  return data.output ? `${data.output}.${data.goalFormat}` : `${sourceNameArray.join('.')}.${data.goalFormat}`;
};
