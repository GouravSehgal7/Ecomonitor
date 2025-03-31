import admin from "firebase-admin";
import  serviceAccount from "../pollution-messaging-web-firebase-adminsdk-fbsvc-f3a6175052.json"; // Get this from Firebase console

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();
export { messaging };
