// Extend the Window interface to include workbox
declare global {
  interface Window {
    workbox: any; // You can replace 'any' with the appropriate type if you know it
  }
}
