// firebase.js
const admin = require("firebase-admin");
const fs = require("fs");

// Load the service account key file
const serviceAccountPath = "pollution-messaging-web-firebase-adminsdk-fbsvc-f3a6175052.json";
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
// console.log(serviceAccount);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();
module.exports = { messaging };
