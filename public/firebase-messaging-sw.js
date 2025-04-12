// Import and initialize the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// This is not a secret https://firebase.google.com/docs/web/learn-more#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyAErv09DN4BA4pyRYwKBQsBvT-InW37bUM',
    authDomain: 'savingrace-fae86.firebaseapp.com',
    projectId: 'savingrace-fae86',
    storageBucket: 'savingrace-fae86.firebasestorage.app',
    messagingSenderId: '596773100910',
    appId: '1:596773100910:web:02ee892c7438a7a0bb757f',
    measurementId: 'G-YSR8Y350TX',
})

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)

    const notificationTitle = payload?.notification?.title
    const notificationOptions = {
        body: payload?.notification?.body,
    }
    self.registration.showNotification(notificationTitle, notificationOptions)
})
