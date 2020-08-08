import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import rimraf from 'rimraf';

import { downloadAndExtractRepo } from './helpers/repo';

const create = async ({
  appPath
}: {
  appPath: string;
}) => {
  const root = path.resolve(appPath);
  const appName = path.basename(root);
  const originalDirectory = process.cwd();

  console.log(`Creating a new blog in ${chalk.green(root)}.`);
  console.log();

  await fs.mkdirSync(root);
  process.chdir(root);

  await downloadAndExtractRepo(root, {
    username: 'maxigimenez',
    name: 'next-medium-blog-boilerplate',
    branch: 'master'
  });

  rimraf.sync('.github');
  rimraf.sync('.vscode');
}

export default create;