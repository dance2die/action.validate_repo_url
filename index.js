const core = require("@actions/core");
const glob = require("@actions/glob");

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];
const globber = await glob.create(patterns.join("\n"));
const files = await globber.glob();

core.info(`files ==> ${JSON.stringify(files, null, 2)}`);

// const globby = require("globby");

// // https://repl.it/@dance2die/glob-promise-demo#index.js

// (async () => {
//     const paths = await globby(["docs/**/*", "!node_modules", "!package*.json"]);
//     core.info(`paths ==> ${JSON.stringify(paths, null, 2)}`);
// })();
