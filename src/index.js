const fs = require("fs");
const path = require('path');

const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "quiet", alias: "q", type: Boolean, defaultValue: false },
  { name: "delete", alias: "d", type: Boolean, defaultValue: false },
  {
    name: "orderBy",
    alias: "o",
    type: String,
    multiple: true,
    defaultOption: true,
  },
  { name: "json", alias: "j", type: String },
];
const options = commandLineArgs(optionDefinitions);

const log = (...args) => {
  if (options.quiet) return;
  console.debug(...args);
};

const startsWithOneOf = (fullPath, arrayOfDirs) => {
  length = arrayOfDirs.length;
  for (let index = 0; index < length; index++) {
    if (fullPath.startsWith(arrayOfDirs[index])) return index;
  }
  return -1;
};

const removeFiles = (arrayOfFiles) => {
  log(`removing ${arrayOfFiles.length} files:`);
  arrayOfFiles.forEach((file) => {
    log(`removing ${file}`);
    if (options.delete) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error(`Unable to delete ${file}`);
      }
    }
  });
};

const main = () => {
  log("CLI options:", options);
  const orderByPaths = options.orderBy;
  const json = require(path.join(process.cwd(), options.json));
  json.forEach((file) => {
    const paths = file.paths;
    log(`--------------------------------------------------`);
    log(`${paths.length} files as duplicates:`);
    paths.forEach((filePath) => log(filePath));

    let index = -1;
    for (let fileIndex = 0; fileIndex < paths.length; fileIndex++) {
      const foundInIndex = startsWithOneOf(paths[fileIndex], orderByPaths);
      if (foundInIndex !== -1) {
        index = fileIndex;
        break;
      }
    }
    const filesToRemove = [...paths];
    if (index !== -1) {
      // found, keep the one with index
      log(`found in ${orderByPaths[index]}, index: ${index}`);
      filesToRemove.splice(index, 1);
    } else {
      // not found, keep the first one and delete the rest;
      filesToRemove.splice(0, 1);
      log(`not found any of ${orderByPaths}`);
    }
    removeFiles(filesToRemove);
  });
};

main();
