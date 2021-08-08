import https from "https";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { Stream } from "stream";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type Options = {
  cache?: boolean;
  cacheTime?: number;
};

export type Result = {
  isMajor: boolean;
  isMinor: boolean;
  isPatch: boolean;
  latestVersion: string;
  packageName: string;
};

export async function getVersion(
  packageName: string,
  currentVersion: string,
  options: Options
): Promise<object | boolean | Result> {
  const _options = await parseOptions(options);

  if (!useCache(_options.cache, _options.cacheTime)) {
    return {};
  }

  if (!checkVersionFormat(currentVersion)) {
    throw "unsupported format for current version, supported format: 0.0.0 (semver)";
  }

  try {
    const latestVersion = await getNpmPackageVersion(packageName);

    return await compareVersions(currentVersion, latestVersion, packageName);
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function parseOptions(options: Options) {
  return {
    cache: options.cache === false ? false : true, //true by default
    cacheTime: options.cacheTime,
  };
}

async function compareVersions(
  current: string,
  latest: string,
  packageName: string
): Promise<boolean | Result> {
  const c = current.split(".");
  const l = latest.split(".");

  return new Promise((resolve) => {
    if (current === latest) resolve(false);
    resolve({
      isMajor: +l[0] > +c[0],
      isMinor: +l[1] > +c[1],
      isPatch: +l[2] > +c[2],
      latestVersion: latest,
      packageName,
    });
  });
}

/**
 * gets the latest package version from npm registry
 * @returns {string} version
 */
async function getNpmPackageVersion(packageName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(
        `https://registry.npmjs.org/${packageName}/latest`,
        (res: Stream) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", async () => {
            resolve(JSON.parse(data).version);
          });
        }
      )
      .on("error", (err: Error) => {
        reject("Error: " + err.message);
      });
  });
}

function useCache(useCache: boolean, cacheTime: number = 24): boolean {
  if (!useCache) return true;

  const cachePath = path.resolve(__dirname, "./v.cache.json");

  let cacheLifetime = cacheTime * 3.6e6; //3.6e6 is 1 hour in ms
  let cache;

  const cacheExists = fs.existsSync(cachePath);

  if (cacheExists) {
    cache = JSON.parse(fs.readFileSync(cachePath).toString()).lastChecked;
  }

  if (Date.now() - cache > cacheLifetime || !cacheExists || !cache) {
    writeCache(cachePath);
    return true;
  } else {
    return false;
  }
}

function writeCache(cachePath: string) {
  fs.writeFileSync(
    cachePath,
    JSON.stringify({
      lastChecked: Date.now(),
    })
  );
}

export function checkVersionFormat(currentVersion: string) {
  return /^([0-9]*\.[0-9]*\.[0-9]*)/.test(currentVersion);
}
