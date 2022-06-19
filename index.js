const fs = require('fs')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'orderBy', alias: 'o', type: String, multiple: true, defaultOption: true },
  { name: 'json', alias: 'j', type: String }
]
const options = commandLineArgs(optionDefinitions)

const debug = (text) => {
  if(options.verbose) console.debug(text)
}

const startsWithOneOf = (fullPath, arrayOfDirs) => {
  length = arrayOfDirs.length;
  for(let index = 0; index < length; index ++) {
    if (fullPath.startsWith(arrayOfDirs[index])) return index;
  }
  return -1;
}

const removeFiles = (arrayOfFiles) => {
  debug(`removing ${arrayOfFiles.length} files:`)
  arrayOfFiles.forEach(file => {
    debug(`removing ${file}`);
  })
};

const main = () => {
  debug("I can run", options);
  const orderByPaths = options.orderBy;

  const json = require(`./${options.json}`);
  json.forEach(file => {
    const paths = file.paths;
    debug(`--------------------------------------------------`);
    debug(`${paths.length} files as duplicates:`)
    paths.forEach( path => debug(path));

    let index = -1;
    for (let fileIndex = 0; fileIndex<paths.length; fileIndex ++) {
      const foundInIndex = startsWithOneOf(paths[fileIndex], orderByPaths)
      if ( foundInIndex !== -1) {
        index = fileIndex;
        break;
      }
    }
    const filesToRemove = [...paths];
    if ( index !== -1) {
      // found, keep the one with index
      debug(`found in ${orderByPaths[index]}, index: ${index}`);
      filesToRemove.splice(index, 1)
    } else {
      // not found, keep the first one and delete the rest;
      filesToRemove.splice(0, 1)
      debug(`not found any of ${orderByPaths}`);
    }
    removeFiles(filesToRemove);
  })
}

main();
