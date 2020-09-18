const fs = require("fs");
const core = require("@actions/core");
const glob = require("@actions/glob");
const marked = require("marked");
const getHrefs = require("get-hrefs");
const fetch = require("isomorphic-unfetch");

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
  const markdown = await fs.readFileSync(file, "utf-8");
  //   const urls = [...getUrls(text)];
  //   const urls = [...new Set(markdownLinkExtractor(text))];
  const html = marked(markdown);
  const urls = [...new Set(getHrefs(html))];

  //   core.info(`extractUrls==> ${file}, ${JSON.stringify(urls, null, 2)}`);
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

  //   const result = files.reduce(async (promisedAcc, file) => {
  //     const acc = await promisedAcc;
  //     if (isDirectory(file)) return acc;

  //     const urls = (await extractUrls(file)) || [];
  //     if (urls.length <= 0) return acc;

  //     const invalidUrls = (await validateUrls(urls)) || [];
  //     if (invalidUrls.length <= 0) return acc;

  //     acc[file] = invalidUrls;
  //     return acc;
  //   }, {});

  const promises = files.map(async (file) => {
    const emptyResult = { file, invalidUrls: [] };
    if (isDirectory(file)) return emptyResult;

    const urls = (await extractUrls(file)) || [];
    if (urls.length <= 0) return emptyResult;

    const invalidUrls = (await validateUrls(urls)) || [];
    if (invalidUrls.length <= 0) return emptyResult;

    return { file, invalidUrls };
  });

  const result = await Promise.all(promises);

  core.info(`result ==> ${JSON.stringify(result, null, 2)}`);
})();
