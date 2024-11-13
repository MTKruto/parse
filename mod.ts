import type {
  Context,
  MessageEntity,
  MiddlewareFn,
  NextFunction,
} from "@mtkruto/mtkruto";

export interface Stringable {
  toString(): string;
}

class FormattedString implements Stringable {
  text: string;
  entities: MessageEntity[];

  constructor(text: string, entities: MessageEntity[]) {
    this.text = text;
    this.entities = entities;
  }

  toString(): string {
    return this.text;
  }
}

const unwrap = (stringLike: Stringable): FormattedString => {
  if (stringLike instanceof FormattedString) {
    return stringLike;
  }
  return new FormattedString(stringLike.toString(), []);
};

// deno-lint-ignore no-explicit-any
export type Formatter<T extends Array<any> = any> = (
  stringLike: Stringable,
  ...formatArgs: T
) => FormattedString;

// deno-lint-ignore no-explicit-any
const buildFormatter = <T extends Array<any> = any>(
  type: MessageEntity["type"],
  ...formatArgKeys: string[]
): Formatter<T> => {
  return (stringLike: Stringable, ...formatArgs: T) => {
    const formattedString = unwrap(stringLike);
    const formatArgObj = Object.fromEntries(
      formatArgKeys.map((formatArgKey, i) => [formatArgKey, formatArgs[i]]),
    );
    return new FormattedString(
      formattedString.text,
      [
        {
          ...formatArgObj,
          offset: 0,
          length: formattedString.text.length,
          type,
        } as unknown as MessageEntity,
        ...formattedString.entities,
      ],
    );
  };
};

// Native entity functions
const bold: Formatter = buildFormatter("bold");
const italic: Formatter = buildFormatter("italic");
const code: Formatter = buildFormatter("code");
const pre: Formatter<[string]> = buildFormatter<[string]>("pre", "language");
const link: Formatter<[string]> = buildFormatter<[string]>("textLink", "url");
const underline: Formatter = buildFormatter("underline");
const strikethrough: Formatter = buildFormatter("strikethrough");
const blockquote: Formatter<[boolean]> = (
  stringLike: Stringable,
  collapsible = false,
) =>
  buildFormatter<[boolean]>("blockquote", "collapsible")(
    stringLike,
    collapsible,
  );
const spoiler: Formatter = buildFormatter("spoiler");
const emoji: Formatter = buildFormatter("customEmoji");

// Utility functions
const mentionUser: Formatter<[number]> = (
  stringLike: Stringable,
  userId: number,
) => {
  return link(stringLike, `tg://user?id=${userId}`);
};

// Root format function
const fmt = (
  rawStringParts: TemplateStringsArray | string[],
  ...stringLikes: Stringable[]
): FormattedString => {
  let text = rawStringParts[0];
  const entities = new Array<MessageEntity>();

  for (let i = 0; i < stringLikes.length; i++) {
    const stringLike = stringLikes[i];
    if (stringLike instanceof FormattedString) {
      entities.push(
        ...stringLike.entities.map((e) => {
          e.offset += text.length;
          return e;
        }),
      );
    }
    text += stringLike.toString();
    text += rawStringParts[i + 1];
  }
  return new FormattedString(text, entities);
};

export const replyFmt: MiddlewareFn<Context & ReplyFmt> = (
  ctx: Context & ReplyFmt,
  next: NextFunction,
) => {
  ctx.replyFmt = (stringLike, params) => {
    const entities = stringLike instanceof FormattedString
      ? stringLike.entities
      : [];
    return ctx.reply(stringLike.toString(), {
      ...params,
      entities: (params?.entities ?? []).concat(entities),
    });
  };
  return next();
};

export interface ReplyFmt {
  replyFmt(
    text: Stringable,
    params?: Parameters<Context["reply"]>[1],
  ): ReturnType<Context["reply"]>;
}

export {
  blockquote,
  bold,
  code,
  emoji,
  fmt,
  FormattedString,
  italic,
  link,
  mentionUser,
  pre,
  spoiler,
  strikethrough,
  underline,
};
