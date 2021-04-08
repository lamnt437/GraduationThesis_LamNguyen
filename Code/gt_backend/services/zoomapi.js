const jwt = require("jsonwebtoken");
const config = require("config");

async function generateToken() {
  let payload = {
    iss: config.get("zoomApiKey"),
  };

  try {
    const AccessToken = await jwt.sign(payload, config.get("zoomApiSecret"), {
      expiresIn: 3600000,
    });
    return AccessToken;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports.generateToken = generateToken;
