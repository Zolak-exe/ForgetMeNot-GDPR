// Ce fichier est chargé avant le renderer et expose des API sécurisées
window.api = {
  exposeEmail: async (email) => {
    return await window.electron.fetch('/api/expose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json());
  },
  sendGdpr: async (serviceId, email, smtp) => {
    return await window.electron.fetch('/api/send-gdpr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, email, ...smtp })
    }).then(r => r.json());
  }
};