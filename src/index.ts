import "reflect-metadata";
import { Server } from "jayson";

import { createConnection } from "typeorm";

import * as methods from "methods";

const server = new Server({
  ...methods,
});

createConnection().then(() => {
  server.http().listen(3002);
});
