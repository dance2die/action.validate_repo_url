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

async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return /4\d\d/.test(response.status) === false;
  } catch (error) {
    return false;
  }
}

const extractUrls = (file) => {
  // read file content as a string
  // extract urls
};

// const isFile = (path) => fs.lstatSync(path).isFile();
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

(async function () {
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  const result = files.reduce(async (acc, file) => {
    if (isDirectory(file)) return acc;

    const urls = extractUrls(file) ?? [];
    if (urls.length <= 0) return acc;

    const invalidUrls = validateUrls(urls) ?? [];
    if (invalidUrls.length <= 0) return acc;

    acc.push({ file, invalidUrls });
    return acc;
  }, {});
})();
