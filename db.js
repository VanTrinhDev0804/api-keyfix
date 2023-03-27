"user strict";
var admin = require("firebase-admin");

var serviceAccount = require("./service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://key-fix-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = { admin, db };