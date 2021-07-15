# 1.0.1

Fix: TypeError: Cannot destructure property 'latestVersion' of 'object null' as it is null. (when using cache)
(now returning an empty object)

Fix: import / require mappings

# 1.0.0

Stable release 🥳

#### Add `getVersion` feature

```js
const { getVersion } = require("nanov"); //node <12 (commonjs)

import { getVersion } = from "nanov"; // node 14+ ( using in a .mjs file or setting "type":"module" inside your package.json) // or using a compatible module option in tsconfig for esm
```
