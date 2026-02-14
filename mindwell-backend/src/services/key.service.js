const crypto = require("crypto");

exports.generateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
