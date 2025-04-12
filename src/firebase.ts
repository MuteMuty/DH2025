import type { FirebaseApp } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
// import useStore from '~/src/store'

let firebaseApp: FirebaseApp

export function initFirebase() {
  // This is not a secret https://firebase.google.com/docs/web/learn-more#config-object
  firebaseApp = initializeApp({
    apiKey: 'AIzaSyAErv09DN4BA4pyRYwKBQsBvT-InW37bUM',
    authDomain: 'savingrace-fae86.firebaseapp.com',
    projectId: 'savingrace-fae86',
    storageBucket: 'savingrace-fae86.firebasestorage.app',
    messagingSenderId: '596773100910',
    appId: '1:596773100910:web:02ee892c7438a7a0bb757f',
    measurementId: 'G-YSR8Y350TX',
  })

  console.log('Firebase initialized', firebaseApp)
}

export async function initMessagingAndRequestNotificationPermission() {
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications')
    return null
  }

  // Request permission first
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.error('Notification permission not granted:', permission)
    return null
  }

  // Unregister any existing service workers first
  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      if (registration.scope.includes('/firebase-messaging-sw.js')) {
        await registration.unregister()
        console.log('Unregistered existing service worker')
      }
    }
  } catch (error) {
    console.error('Error unregistering service worker:', error)
  }

  const serviceWorkerRegistration = await navigator.serviceWorker
    .register('/firebase-messaging-sw.js', {
      scope: '/',
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error)
      throw error
    })

  console.log('serviceWorkerRegistration', serviceWorkerRegistration)

  const messaging = getMessaging(firebaseApp)
  console.log('messaging', messaging)
  // Vapid is a public key, it's not a secret
  const token = await getToken(messaging, {
    vapidKey:
      'BKr-sJTO5Y8Oyr-3Zy4qLE4KtJKiGN_VfJYQ0dUDY7LhRImXg8XHg06089I9aK6cUDps4TwnITIut18MQQY4YY0',
    serviceWorkerRegistration,
  }).catch((error) => {
    console.error('Error getting token:', error)
    return null
  })

  console.log('FCM Token:', token)

  onMessage(messaging, (payload: any) => {
    console.log('Message received: ', payload)

    const { notification } = payload

    if (notification) {
      // Display a notification using the Browser Notification API
      const notificationOptions = {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge,
        image: notification.image,
        tag: notification.tag || 'default',
        data: payload.data,
      }

      if (serviceWorkerRegistration && serviceWorkerRegistration.showNotification) {
        // Use the service worker to show the notification if available
        serviceWorkerRegistration.showNotification(notification.title, notificationOptions)
      } else {
        // Fallback to the regular Notification API
        new Notification(notification.title, notificationOptions)
      }
    }
  })
  return token
}
