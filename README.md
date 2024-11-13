# MTKruto Parse

A 1:1 clone of [grammyjs/parse-mode](https://github.com/grammyjs/parse-mode)
modified to work with MTKruto.

## Installation

> Note: Not published yet.

### Deno

```shell
deno add @mtkruto/parse
```

### pnpm

```shell
pnpm add @mtkruto/parse
```

### Yarn

```shell
yarn add @mtkruto/parse
```

### npm

```shell
npm install @mtkruto/parse
```

### Bun

```shell
bun add @mtkruto/parse
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
