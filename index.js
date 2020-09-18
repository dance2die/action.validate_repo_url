const fs = require("fs");
const core = require("@actions/core");
const glob = require("@actions/glob");
// const getUrls = require("get-urls");
const markdownLinkExtractor = require("markdown-link-extractor");

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];

async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return /4\d\d/.test(response.status) === false;
  } catch (error) {
    return false;
  }
}

const extractUrls = async (file) => {
  const text = await fs.readFileSync(file, "utf-8");
  //   const urls = [...getUrls(text)];
  const urls = [...new Set(markdownLinkExtractor(text))];

  core.info(`extractUrls==> ${file}, ${JSON.stringify(urls, null, 2)}`);
  return urls;
};

const validateUrls = async (urls) => {
  const promises = urls.map(
    async (url) => await urlExists(url).then((exist) => ({ exist, url }))
  );

  const validationResult = await Promise.all(promises);
  return validationResult.filter((result) => !result.exist);
};

// const isFile = (path) => fs.lstatSync(path).isFile();
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

(async function () {
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  const result = files.reduce(async (acc, file) => {
    if (isDirectory(file)) return acc;

    const urls = (await extractUrls(file)) || [];
    if (urls.length <= 0) return acc;

    const invalidUrls = (await validateUrls(urls)) || [];
    if (invalidUrls.length <= 0) return acc;

    acc[file] = invalidUrls;
    return acc;
  }, {});

  core.info(`result ==>`, JSON.stringify(result, null, 2));
})();
