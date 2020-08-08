#!/usr/bin/env node
import chalk from 'chalk';
import Commander from 'commander';
import path from 'path';
import validateNpmName from 'validate-npm-package-name';

import packageJson from './package.json';
import create from './create';
import { Integrations } from './typings';

let projectPath: string = '';

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name) => projectPath = name)
  .option(
    '-i, --integration [contentful|api]',
    `Choose data integration`,
    Integrations.CONTENTFUL
  )
  .allowUnknownOption()
  .parse(process.argv);

const run = async () => {
  if (typeof projectPath === 'string') {
    projectPath = projectPath.trim();
  }

  if (!projectPath) {
    console.log();
    console.log('Please specify the project directory:');
    console.log(
    `   ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log('For example:');
    console.log(`   ${chalk.cyan(program.name())} ${chalk.green('my-blog')}`);
    console.log();
    return;
  }

  const { integration } = program;
  if (!Object.values(Integrations).includes(integration)) {
    console.error(`Could not create a project with ${chalk.red(integration)} integration`);
    console.log();
    console.log(`Please use one of the following ${chalk.green(Object.values(Integrations))}`);

    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const validation = validateNpmName(projectName);
  if (!validation.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );

    validation.errors!.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`));
    process.exit(1);
  }

  await create({ appPath: resolvedProjectPath, integration });
}

run()
  .catch((reason) => {
    console.log();
    console.log('Aborting installation.');
    process.exit(1);
  })