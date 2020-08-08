import spawn from 'cross-spawn';

export const install = (root: string) => {
  return new Promise((resolve, reject) => {
    const command = 'yarnpkg';
    const args = ['install', '--cwd', root];

    const child = spawn(command, args, {
      stdio: 'inherit'
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject();
        return;
      }
      resolve();
    })
  });
}