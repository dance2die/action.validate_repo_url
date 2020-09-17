const globby = require("globby");

// https://repl.it/@dance2die/glob-promise-demo#index.js
(async () => {
  const paths = await globby(["docs/**/*", "!node_modules", "!package*.json"]);
  console.log(paths);
})();
