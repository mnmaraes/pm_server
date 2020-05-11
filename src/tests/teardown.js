module.exports = async function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ORM = require("typeorm");

  await ORM.getConnection().close();
};
