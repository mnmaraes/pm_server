// eslint-disable-next-line @typescript-eslint/no-var-requires
const createdb = require("./createdb").default;

module.exports = async function () {
  console.log(createdb);
  await createdb();
};
