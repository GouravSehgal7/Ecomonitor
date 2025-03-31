import admin from "firebase-admin";
import fs from "fs";

// Load the secret file from the specified path
const serviceAccountPath = "pollution-messaging-web-firebase-adminsdk-fbsvc-f3a6175052.json";
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();
export { messaging };
