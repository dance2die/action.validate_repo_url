const core = require("@actions/core");
const glob = require("@actions/glob");
const fs = require("fs").promises;

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];
// const patterns = ["**"];

const isFile = async (path) => {
  const stat = await fs.lstat(path);
  const isFile = await stat.isFile();

  core.info(`File? ${isFile} => '${path}'`);

  return isFile;
};

(async function () {
  const globber = await glob.create(patterns.join("\n"));
  // exclude directories
  const files = (await globber.glob()).filter(
    async (path) => await isFile(path)
  );

  core.info(`files ==> ${JSON.stringify(files, null, 2)}`);
})();
