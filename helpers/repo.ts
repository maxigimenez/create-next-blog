import got from 'got';
import tar from 'tar';
import { Stream } from 'stream';
import { promisify } from 'util';

const pipeline = promisify(Stream.pipeline);

export const downloadAndExtractRepo = (
  root: string,
  { username, name, branch, filePath }: any
): Promise<void> => {
  return pipeline(
    got.stream(
      `https://codeload.github.com/${username}/${name}/tar.gz/${branch}`
    ),
    tar.extract(
      { cwd: root, strip: filePath ? filePath.split('/').length + 1 : 1 },
      [`${name}-${branch}${filePath ? `/${filePath}` : ''}`]
    )
  )
}