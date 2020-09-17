const globby = require("globby");
const core = require("@actions/core")(
  // https://repl.it/@dance2die/glob-promise-demo#index.js

  async () => {
    const paths = await globby([
      "docs/**/*",
      "!node_modules",
      "!package*.json",
    ]);
    core.info(`paths ==> ${JSON.stringify(paths, null, 2)}`);
  }
)();
