const fs = require("fs");
const core = require("@actions/core");
const glob = require("@actions/glob");
const marked = require("marked");
const getHrefs = require("get-hrefs");
const fetch = require("isomorphic-unfetch");

const patterns = ["docs/**/*", "!node_modules", "!package*.json"];

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

async function urlExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    if ([UNAUTHORIZED, FORBIDDEN].includes(response.status)) return true;
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
  const result = validationResult.filter((result) => !result.exist);
  console.log({ validationResult, result });
  return result;
};

// const isFile = (path) => fs.lstatSync(path).isFile();
const isDirectory = (path) => fs.lstatSync(path).isDirectory();

(async function () {
  const globber = await glob.create(patterns.join("\n"));
  const files = await globber.glob();

  const promises = files.map(async (file) => {
    if (isDirectory(file)) return null;

    const urls = (await extractUrls(file)) || [];
    if (urls.length <= 0) return null;

    const invalidUrls = (await validateUrls(urls)) || [];
    if (invalidUrls.length <= 0) return null;

    return { file, invalidUrls };
  });

  const resolved = await Promise.all(promises);
  //   core.info(`resolved ==> ${JSON.stringify(resolved, null, 2)}`);

  const invalidResult = resolved.filter(Boolean);
  //   core.info(`invalidResult ==> ${JSON.stringify(invalidResult, null, 2)}`);
})();
