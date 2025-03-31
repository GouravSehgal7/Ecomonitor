import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { firebaseConfig } from "./firebaseconfig";

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Messaging - Only Initialize on Supported Browsers
let messaging: any = null;

const setupMessaging = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    messaging = getMessaging(app);
  } else {
    console.warn("FCM is not supported in this browser.");
  }
};
setupMessaging();

export const Gettokendata = async () => {
  try {
    if (!messaging) {
      console.warn("Firebase Messaging is not initialized.");
      return null;
    }

    // Ensure Service Worker is registered
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker registered:", registration);

    // Get the FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log(token);
      return token;
    } else {
      console.log("No FCM token available.");
      return null;
    }
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};

// Handle Incoming Messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn("Messaging is not initialized.");
      return;
    }
    onMessage(messaging, (payload) => {
      alert(`New Notification: ${payload?.notification?.title}`);
      resolve(payload);
    });
  });
