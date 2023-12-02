import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";
import util from "util";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const fileLog = fs.createWriteStream(__dirname + "/../server.log", { flags: "w" });

const logOutput = (level, res) => {
  if (level === 0) {
    fileLog.write(util.format("\x1B[32m[INFO] " + res));
  } else if (level === 1) {
    fileLog.write(util.format("\x1B[31m[ERROR] " + res));
  }
}

export { logOutput }
