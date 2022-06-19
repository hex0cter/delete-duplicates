const fs = require('fs')
const commandLineArgs = require('command-line-args')

const startsWithOneOf = (fullPath, arrayOfDirs) => {
  length = arrayOfDirs.length;
  for(let index = 0; index < length; index ++) {
    if (fullPath.startsWith(arrayOfDirs[index])) return index;
  }
  return -1;
}

const removeFiles = (arrayOfFiles) => {
  console.log(`removing ${arrayOfFiles.length} files:`)
  arrayOfFiles.forEach(file => {
    console.log(`removing ${file}`);
  })
};

const main = () => {
  const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
    { name: 'orderBy', alias: 'o', type: String, multiple: true, defaultOption: true },
    { name: 'json', alias: 'j', type: String }
  ]
  const options = commandLineArgs(optionDefinitions)
  console.log("I can run", options);
  const orderByPaths = options.orderBy;

  const json = require(`./${options.json}`);
  json.forEach(file => {
    const paths = file.paths;
    console.log(`--------------------------------------------------`);
    console.log(`${paths.length} files as duplicates:`)
    paths.forEach( path => console.log(path));

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
      console.log(`found in ${orderByPaths[index]}, index: ${index}`);
      filesToRemove.splice(index, 1)
      // return index;
    } else {
      // not found, keep the first one and delete the rest;
      filesToRemove.splice(0, 1)
      console.log(`not found any of ${orderByPaths}`);
    }
    // console.log(`files to remove: ${filesToRemove}`);
    removeFiles(filesToRemove);
  })
}

main();
