const globby = require("globby");

(async () => {
  const paths = await globby(["docs/**/*", "!node_modules", "!package*.json"]);
  console.log(paths);
})();
