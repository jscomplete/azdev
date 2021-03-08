import crypto from 'crypto';

export const randomString = (bytesSize = 32) =>
  crypto.randomBytes(bytesSize).toString('hex');

export const pgExpand = (rowCount, columnCount, index = 1) => {
  return Array(rowCount)
    .fill(0)
    .map(
      () =>
        `(${Array(columnCount)
          .fill(0)
          .map(() => `$${index++}`)
          .join(', ')})`,
    )
    .join(', ');
};
