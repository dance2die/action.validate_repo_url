const core = require("@actions/core");
const glob = require("@actions/glob");
const fs = require("fs").promises;

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];
// const patterns = ["**"];

// const isFile = (path) => {
//   const stat = fs.lstatSync(path);
//   const isFile = stat.isFile();

//   core.info(`File? ${isFile} => '${path}'`);

//   return isFile;
// };

const isFile = (path) => fs.lstatSync(path).isFile();
(async function () {
  const globber = await glob.create(patterns.join("\n"));
  // exclude directories
  const paths = await globber.glob();
  const files = paths.filter(isFile);

  core.info(`files ==> ${JSON.stringify(files, null, 2)}`);
})();
