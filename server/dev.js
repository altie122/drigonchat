import { spawn } from "child_process";
import { watch } from "fs";

let appProcess;

// Function to start or restart the app
const startApp = () => {
  if (appProcess) {
    appProcess.kill();
  }
  appProcess = spawn("node", ["server.js"], { stdio: "inherit" });

  appProcess.on("exit", (code) => {
    if (code !== 0) {
      console.log(`Process exited with code ${code}`);
    }
  });
};

// Watch the directory for changes
watch("./", { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith(".js")) {
    console.log(`${filename} changed, restarting app...`);
    startApp();
  }
});

// Initial start
startApp();
