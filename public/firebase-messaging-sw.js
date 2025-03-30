
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAnQa0EEr5S9SI3o_YltoqMDLnfbp02wk0",
    authDomain: "pollution-messaging-web.firebaseapp.com",
    projectId: "pollution-messaging-web",
    storageBucket: "pollution-messaging-web.firebasestorage.app",
    messagingSenderId: "610851839309",
    appId: "1:610851839309:web:465d86e3ad074fe80f6b04",
    measurementId: "G-PQ3WJBZED4"
  })

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new message.",
      icon: "./placeholder.jpg", 
    };
    console.log(notificationOptions);
    
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });