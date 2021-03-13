function generateBitmapFileHeader({
  fileSize = 0,
  applicationHeader = 0,
  imageDataOffset = 0,
}): Buffer {
  const buffer = Buffer.alloc(14);
  // A bitmap file starts with a "BM" in ASCII.
  buffer.write('B', 0);
  buffer.write('M', 1);
  // The entire filesize.
  buffer.writeInt32LE(fileSize, 2);
  // 4 bytes reserved for the application creating the image.
  buffer.writeInt32LE(applicationHeader, 6);
  // The byte offset to access the pixel data.
  buffer.writeInt32LE(imageDataOffset, 10);
  return buffer;
}
