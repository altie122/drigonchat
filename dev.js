import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Calculate the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to generate a random color from Chalk
const randomColor = () => {
  const colors = [chalk.red, chalk.green, chalk.yellow, chalk.blue, chalk.magenta, chalk.cyan];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to execute the `pnpm run dev` command in a given folder
const runPnpmDev = (folder, color, prefix) => {
  return new Promise((resolve, reject) => {
    console.log(color(`${prefix}: Starting pnpm run dev`));

    const devProcess = spawn('pnpm', ['run', 'dev'], { cwd: folder });

    devProcess.stdout.on('data', (data) => {
      process.stdout.write(`${color(`${prefix}:`)} ${data}`);
    });

    devProcess.stderr.on('data', (data) => {
      process.stderr.write(`${color(`${prefix}:`)} ${data}`);
    });

    devProcess.on('error', (error) => {
      console.error(color(`${prefix}: Failed to run dev: ${error.message}`));
      reject(error);
    });

    devProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(color(`${prefix}: Successfully ran dev`));
        resolve();
      } else {
        console.error(color(`${prefix}: Dev process exited with code ${code}`));
        reject(new Error(`Dev process exited with code ${code}`));
      }
    });
  });
};

// Main function to run the dev server in sub-folders
const main = async () => {
  const args = process.argv.slice(2);
  const specificFolders = args.length > 0 ? args : null;

  const parentDir = path.resolve(__dirname);
  const subFolders = fs
    .readdirSync(parentDir, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => path.join(parentDir, dir.name));

  const foldersToProcess = specificFolders
    ? subFolders.filter((folder) =>
        specificFolders.some((specificFolder) => folder.includes(specificFolder))
      )
    : subFolders;

  const folderConfigs = foldersToProcess.map((folder) => ({
    folder,
    color: randomColor(),
    prefix: path.basename(folder).toUpperCase(),
  }));

  try {
    const results = await Promise.all(
      folderConfigs.map(({ folder, color, prefix }) => runPnpmDev(folder, color, prefix))
    );
    console.log('All servers are running:', results);
  } catch (error) {
    console.error('An error occurred while running the dev servers:', error);
  }
};

main();
