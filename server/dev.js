import { spawn } from "child_process";
import { watch } from "fs";

// List of files to watch
const watchFiles = new Set([
  "../pnpm-lock.json",
  "../drizzle.config.ts",
  "../src/*",
  "../tsconfig.json"
]);

let appProcess;

// Function to start or restart the app
const startApp = () => {
  if (appProcess) {
    appProcess.kill();
  }
  appProcess = spawn("pnpm", ["tsm", "./src/server.ts"], { stdio: "inherit" });

  appProcess.on("exit", (code) => {
    if (code !== 0) {
      console.log(`Process exited with code ${code}`);
    }
  });
};

// Watch the directory for changes
watch("./", { recursive: true }, (eventType, filename) => {
  if (filename && watchFiles.has(filename)) {
    console.log(`${filename} changed, restarting app...`);
    startApp();
  }
});

// Initial start
startApp();
