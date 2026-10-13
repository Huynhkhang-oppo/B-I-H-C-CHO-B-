import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  // Construct a minimal uncompressed/deflated truecolor with alpha PNG
  const buffer = Buffer.alloc(width * height * 4 + height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    buffer[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      // Create a nice circular lion badge pattern
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.45;

      if (dist < radius) {
        // Inner circle
        if (dist < radius * 0.75) {
          buffer[offset++] = 254; // R
          buffer[offset++] = 230; // G
          buffer[offset++] = 138; // B
          buffer[offset++] = 255; // A
        } else {
          buffer[offset++] = r; // R
          buffer[offset++] = g; // G
          buffer[offset++] = b; // B
          buffer[offset++] = 255; // A
        }
      } else {
        buffer[offset++] = 245; // Background amber
        buffer[offset++] = 158;
        buffer[offset++] = 11;
        buffer[offset++] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(buffer);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);

  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);

  return chunk;
}

// Standard CRC32
function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (c ^ buf[n]) >>> 0;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? ((c >>> 1) ^ 0xedb88320) >>> 0 : (c >>> 1) >>> 0;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, 234, 88, 12));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, 234, 88, 12));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, 245, 158, 11));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 234, 88, 12));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(48, 48, 234, 88, 12));

console.log('Generated all PWA PNG icons successfully!');
