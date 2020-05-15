import "reflect-metadata";

import { build, fake } from "@jackfranklin/test-data-bot";
import { createConnection, getConnection } from "typeorm";

import { CreateParams as NoteCreateParams } from "entity/Note";

let dbState: "never" | "loading" | "loaded" = "never";
const listeners: (() => void)[] = [];
let connCount = 0;

export const noteBuilder = build<NoteCreateParams>("Note", {
  fields: {
    body: fake(
      (f) => `
# ${f.lorem.sentence()}

${f.lorem.paragraph()}

- ${f.lorem.sentence()}
- ${f.lorem.sentence()}
- ${f.lorem.sentence()}

## ${f.lorem.sentence()}

${f.lorem.paragraphs()}
      `
    ),
  },
});

export const setupDb = async (): Promise<void> => {
  if (dbState === "never") {
    dbState = "loading";

    await createConnection();

    dbState = "loaded";
    for (const listener of listeners) {
      listener();
    }
  }

  if (dbState === "loaded") {
    connCount++;
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    listeners.push(() => {
      connCount++;
      resolve();
    });
  });
};

export const teardownDb = async (): Promise<void> => {
  connCount--;
  if (connCount === 0) {
    await getConnection().close();
    dbState = "never";
  }
};
