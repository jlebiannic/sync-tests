import path from "path";
import readline from "readline";
import { SyncTestManager } from "./util/SyncTestManager";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: sync-tests <tests directory> <source directory>");
} else {
  const testsDir = path.resolve(args[0]);
  const sourcesDir = path.resolve(args[1]);
  console.log(`sync-tests ${testsDir} ${sourcesDir}`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Proceed? (Y/n) ", answer => {
    if (answer === "y" || answer === "") {
      console.log("Processing ...");
      const syncTestManager = new SyncTestManager(testsDir, sourcesDir);
      syncTestManager.run(testsDir, sourcesDir);
      console.log("End");
    }
    rl.close();
  });
}

// visitDirDeeply("src/views", (currentFileName, currentDir) => {
//   console.log(`${currentFileName} => ${currentDir}`);
// });
