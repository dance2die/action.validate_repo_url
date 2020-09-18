const core = require("@actions/core");
const glob = require("@actions/glob");

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];
// const patterns = ["**"];

(async function () {
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  core.info(`files ==> ${JSON.stringify(files, null, 2)}`);
})();
