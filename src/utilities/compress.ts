import lzutf8 from 'lzutf8';

const compress = (data) => lzutf8.encodeBase64(lzutf8.compress(data));

const decompress = (data) => lzutf8.decompress(lzutf8.decodeBase64(data));

export { compress, decompress };
