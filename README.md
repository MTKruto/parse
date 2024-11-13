# MTKruto Parse

A 1:1 clone of [grammyjs/parse-mode](https://github.com/grammyjs/parse-mode)
modified to work with MTKruto.

## Installation

> Note: Not published yet.

### Deno

```
deno add @mtkruto/parse
```

### pnpm

```
pnpm add @mtkruto/parse
```

### Yarn

```
yarn add @mtkruto/parse
```

### npm

```
npm install @mtkruto/parse
```

### Bun

```
deno add @mtkruto/parse
```

## Usage

```ts
import { bold, fmt, italic, replyFmt } from "@mtkruto/parse";

client.use(replyFmt);

client.on("message", async (ctx) => {
  if (!ctx.from) return;
  await ctx.replyFmt(fmt`Hi, ${bold(fmt`your ID is ${italic(ctx.from.id)}`)}.`);
});
```

## API Reference

<https://jsr.io/@mtkruto/parse/doc>

## License

MIT

[License File](./LICENSE)
