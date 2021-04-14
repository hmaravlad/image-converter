export const generateFileName: (sourceName: string, output: string, goalFormat: string) => string = (sourceName, output, goalFormat) => {
  const sourceNameArray = sourceName.split('.');
  sourceNameArray.pop();
  return output ? `${output}.${goalFormat}` : `${sourceNameArray.join('.')}.${goalFormat}`;
};
