self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Depósito Parceiro', {
      body:    data.body  || '',
      icon:    data.icon  || '/logo.png',
      badge:   '/logo.png',
      tag:     data.tag   || 'dp-notification',
      data:    data.url   ? { url: data.url } : {},
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/admin'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('/admin'))
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})
