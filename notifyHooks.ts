import { useEffect, useState } from 'react';

const base64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
declare global {
  interface Window {
    workbox: any;
  }
}

export const useNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            const subWithExpiration = sub as PushSubscription & {
              expirationTime?: number;
            }; // Extend the type with expirationTime

            if (
              !(
                subWithExpiration.expirationTime &&
                Date.now() > subWithExpiration.expirationTime - 5 * 60 * 1000
              )
            ) {
              setSubscription(subWithExpiration);
              setIsSubscribed(true);
            }
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const subscribeButtonOnClick = async (event) => {
    event.preventDefault();
    Notification.requestPermission();
    if (Notification.permission !== 'granted') {
      window.alert('Notifications permission denied');
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        'BJfh3HNf_v_kJntAYXPiT8CPud1aFoqFwzn3-qXrLcwl_T6VCOyF981mI5O3FHI8UIZlyTW6OMa1pByQBXPqISA'
      ),
    });
    // TODO: you should call your API to save subscription data on server in order to send web push notification from server
    setSubscription(sub);
    setIsSubscribed(true);
    console.log('web push subscribed!');
    console.log(sub);
  };

  const sendNotificationButtonOnClick = async () => {
    if (subscription == null) {
      console.error('web push not subscribed');
      return;
    }
    console.log('MARFWAN');
    await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
      }),
    });
  };
  return {
    sendNotificationButtonOnClick,
    subscribeButtonOnClick,
    isSubscribed,
  };
};
