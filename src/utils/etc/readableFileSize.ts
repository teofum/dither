const units = ['B', 'K', 'M', 'G', 'T', 'P']; // No file will be larger than a *petabyte*, surely...

const readableFileSize = (bytes: number): string => {
  let unit = 0;
  while (bytes >= 1000 && unit < units.length) {
    bytes = bytes / 1000;
    unit++;
  }

  const sizeStr = bytes.toString();
  return sizeStr.substring(0, sizeStr.includes('.') ? 5 : 4) + units[unit];
};

export default readableFileSize;