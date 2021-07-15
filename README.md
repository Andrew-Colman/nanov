# nanoV

<!-- [<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/Andrew-Colman/nanov/Node.js%20CI">](../../actions) -->

[<img alt="npm" src="https://img.shields.io/npm/dt/nanov?logo=npm">](https://npmjs.com/package/nanov)
<img alt="Maintened" src="https://img.shields.io/maintenance/yes/2022">

<br>

- 📦 Get the latest version for your **package** (from npm)

- 🌐 Great for global installation packages `-g`

- ✌️ Semantic versions

- 0️⃣ Zero dependencies

- 🚀 Small and fast (~ 1 kbytes)

<div align="center">

# Summary:

[Installation](#Installation) <span style="color:gainsboro;">-</span>
[Usage](#Usage) <span style="color:gainsboro;">-</span>
[Return Types](#Return-Types) <span style="color:gainsboro;">-</span>
[Options](#Options) <span style="color:gainsboro;">-</span>
[Examples](#Examples)

</div>

# Installation

`npm i nanov`
or
`yarn add nanov`

```js
const { getVersion } = require("nanov"); // node < 12 (commonjs)

import { getVersion } = from "nanov"; // node 14+ ( using in a .mjs file or setting "type":"module" inside your package.json) // or using a compatible module option in tsconfig for esm

```

# Usage

```cjs
//cjs (node <12)

const { getVersion } = require("nanov");

/* take your current version */
const currentVersion = require("./package.json").version;
```

```mjs
//esm (node 14+)

import { getVersion } from "nanov";

/* take your current version */
import fs from "fs";
const currentVersion = JSON.parse(fs.readFileSync("./package.json")).version;
```

> ℹ️ you must provide your current running version

> package name: optionally take your package name from package.json / or write as a string

> `const packageName = require('./package.json').name;`

### then

```js
getVersion("my-package-name", currentVersion)
.then(({isMajor, isMinor, isPatch, latestVersion})=> {
 if(isMajor || isMinor || isPatch,)
 console.log('new version available: ', latestVersion)
})
//further code ....
```

### async / await

```js
const { isMajor, isMinor, isPatch, latestVersion } = await getVersion(
  "my-package",
  currentVersion
);

if (isMajor || isMinor || isPatch)
  console.log("new version available: ", latestVersion);

//further code ....
```

## Return Types

```ts
// if the latest version is the current version: will result in:
false (boolean)

// if the latest version is greather than the current version
{
  isMajor: boolean, // 1.0.0 > 0.0.0
  isMinor: boolean, // 0.1.0 > 0.0.0
  isPatch: boolean, // 0.0.1 > 0.0.0
  latestVersion: string,
  packageName: string
}: object

// if hit the cache will skip the http request and return empty object
{} (empty object)

```

#### semantic version comparison

```js
  //               latest / current
  isMajor: true, // 2.0.0 > 1.0.0 // x - -
  //
  isMinor: true, // 2.1.0 > 1.0.0 // - x -

  isPatch: true, // 2.0.1 > 1.0.0 // - - x
```

## Options

```ts
getVersion(packageName: string , currentVersion: string , options: object)
//options
{
    cache: true, // should use caching strategy / true by default (boolean)
    cacheTime: 24, // by default 24 hours (number)
}
```

## Examples

Simple

```js
getVersion("my-package", version).then(({ latestVersion }) => {
  if (latestVersion) console.log("new version available: ", latestVersion);
});
```

Typescript

```ts
const { latestVersion } = (await getVersion('my-package', currentVersion)) as Result;

if (latestVersion) console.log('new version available'),
```

Catch

> always catch errors if you want to prevent your program from stopping (for possible errors related with getVersion)

```js
getVersion("my-package", version)
  .then(({ latestVersion }) => {
    if (latestVersion) console.log("new version available: ", latestVersion);
  })
  .catch((err) => {
    console.log(err);
  });
```

No cache (will do http request everytime)

> not recommended

```js
getVersion(packageName, currentVersion, {
  cache: false,
}).then((res, latestVersion) => {
  if (res) console.log("new version available: ", latestVersion);
});
```

Use cache for 1 hour

```js
getVersion(packageName, currentVersion, {
  cacheTime: 1,
}).then(({ latestVersion }) => {
  if (latestVersion) console.log("new version available: ", latestVersion);
});
```

Any (Async / await)

```js
const { isMajor, isMinor, isPatch, latestVersion } = await getVersion(
  "my-package",
  version
);
if (isMajor || isMinor || isPatch)
  console.log("new version available: ", latestVersion);
```

Major only

```js
getVersion("my-package", currentVersion).then(({ isMajor, latestVersion }) => {
  if (isMajor) console.log("new major version available: ", latestVersion);
});
```

Minor only

```js
getVersion("my-package", currentVersion).then(({ isMinor, latestVersion }) => {
  if (isMinor) console.log("new minor version available: ", latestVersion);
});
```

Patch only

```js
getVersion("my-package", currentVersion).then(({ isPatch, latestVersion }) => {
  if (isPatch) console.log("new patch version available: ", latestVersion);
});
```

Basically you can do anything

```js
getVersion("my-package", currentVersion).then(
  ({ isMinor, latestVersion, packageName }) => {
    if (isMinor) {
      console.log("new version available: ", latestVersion);
      console.log(`run: npm i -g ${packageName} to update`);
      //further functions
    }
  }
);
```

Automatic deprecation (when new major version)

> not recommended

```js
getVersion("my-package", currentVersion).then(
  ({ isMajor, latestVersion, packageName }) => {
    if (isMajor) {
      console.log("this version is deprecated");
      console.log("latest version is required: ", latestVersion);
      console.log(`run: npm i -g ${packageName} to update`);
      process.exit(); // quit your program from running
    }
  }
);
```
