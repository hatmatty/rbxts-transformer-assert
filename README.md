# rbxts-transformer-services
This is a transformer that converts all assert statements into if then error statements.

## Example
```ts
// input.ts
const a = ...;
const b = ...;
const c = ...;

assert(IsValid(a) && IsValid(b), `A and B are not valid! A: ${a} | B: ${b}`)
assert(IsValid(c))
```

```lua
-- output.lua
local a = ...
local b = ...
local c = ...

if not (IsValid(a) && IsValid(b)) then
    error(`A and B are not valid! A: ${a} | B: ${b}`)
end
assert(IsValid(c)) -- no change because there is no second argument
```

# Installation

`npm i rbxts-transform-env`, then in your tsconfig.json:

```json
    "compilerOptions": {
        ...
        "plugins": [
            {
                "transform": "rbxts-transformer-assert"
            }
        ],
    }
```
