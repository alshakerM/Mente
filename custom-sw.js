self.addEventListener('push', () => {
  self.registration.sendNotification('test samara app', {});
});
