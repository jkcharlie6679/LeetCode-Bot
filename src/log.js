import fs from "fs"
import util from "util";

const logDirectory = process.cwd() + "/log";
let fileLog;

function logInit() {
  fs.stat(logDirectory, (err, stats) => {
    if (err && err.code == "ENOENT") {
      fs.mkdir(logDirectory, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating folder:', err);
        }
      });
    }
    fileLog = fs.createWriteStream(logDirectory + "/logs.log", { flags: "w" });
  });
}

const logOutput = (level, res) => {
  if (level === 0) {
    fileLog.write(util.format("\x1B[32m[INFO] " + res));
  } else if (level === 1) {
    fileLog.write(util.format("\x1B[31m[ERROR] " + res));
  }
}

export { logInit, logOutput }
