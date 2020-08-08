import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import rimraf from 'rimraf';

import { downloadAndExtractRepo } from './helpers/repo';
import { install } from './helpers/install';
import { Integrations } from './typings';
import { prepareContentful } from './helpers/contentful';

const create = async ({
  appPath,
  integration
}: {
  appPath: string;
  integration: Integrations;
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

  console.log('Installing packages. This might take a couple of minutes.');
  console.log();

  await install(root);
  console.log();

  if (integration === Integrations.CONTENTFUL) {
    console.log('Contentful integration detected. Preparing keys:');
    console.log();
    
    await prepareContentful(root);
    console.log();

    rimraf.sync('bin');
    rimraf.sync('schemas');
  }

  let cdpath: string
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  yarn dev`))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan(`  yarn build`))
  console.log('    Builds the app for production.')
  console.log()
  console.log(chalk.cyan(`  yarn start`))
  console.log('    Runs the built app in production mode.')
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(
    `  ${chalk.cyan(`yarn dev`)}`
  )
  console.log()
}

export default create;