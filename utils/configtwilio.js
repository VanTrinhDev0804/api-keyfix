require('dotenv').config()

const {
   TWILIO_ACCOUNT_SID,
   TWILIO_TOKEN
} = process.env;
var client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);

module.exports = client