if ('serviceWorker' in navigator)
{
  run().catch(error => console.error(error));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function run() {
  var vapid_public_key = "BM9ffDFabDoU845z0QmaR9TEUlX_KAVyeLYRBWagDcjOGv5Ub0-bWQbnK-CoSnt5nCDOpzuiMDqEA-MYnoznWgk";
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('/javascripts/worker.js', {scope: '/javascripts/'});
  console.log('Registered service worker');

  console.log('Registering push');
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey: urlBase64ToUint8Array(vapid_public_key)
    });
  console.log('Registered push');

  console.log('Sending push');
  await fetch('/push_subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}
