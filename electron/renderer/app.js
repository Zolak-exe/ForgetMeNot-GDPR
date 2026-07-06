const $ = (id) => document.getElementById(id);

const state = {
  email: '',
  exposures: [],
  services: [],
};

function setStatus(msg, kind = '') {
  const el = $('status');
  el.textContent = msg;
  el.className = 'status' + (kind ? ` ${kind}` : '');
}

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function entry(html) {
  const wrap = document.createElement('div');
  wrap.className = 'entry';
  wrap.innerHTML = html;
  return wrap;
}

function renderExposures(exposures) {
  const el = $('expose-list');
  el.innerHTML = '';
  $('count-expose').textContent = exposures.length;
  if (!exposures.length) {
    el.innerHTML = '<p class="hint">Aucune exposition trouvée.</p>';
    return;
  }
  for (const e of exposures) {
    el.appendChild(entry(`
      <div class="entry-head">
        <div class="entry-name">${esc(e.title)}</div>
        <div class="entry-meta">${esc(e.domain)}</div>
      </div>
      <div class="entry-cat">Leak: ${esc(e.breachDate || 'inconnue')}</div>
      <div class="entry-subjects">${esc(e.dataClasses.slice(0, 6).join(', '))}</div>
    `));
  }
}

function renderAccounts(accounts) {
  const el = $('accounts-list');
  el.innerHTML = '';
  $('count-accounts').textContent = accounts.length;
  if (!accounts.length) {
    el.innerHTML = '<p class="hint">Aucun service connu.</p>';
    return;
  }
  for (const s of accounts) {
    el.appendChild(entry(`
      <div class="entry-head">
        <div class="entry-name">${esc(s.name)}</div>
        <div class="entry-cat">${esc(s.category || '')}</div>
      </div>
      ${s.deleteAccountUrl ? `<div class="entry-actions"><button class="danger" data-href="${esc(s.deleteAccountUrl)}">Supprimer le compte</button></div>` : ''}
    `));
    const btn = el.lastElementChild?.querySelector('button[data-href]');
    if (btn) btn.addEventListener('click', () => window.open(btn.dataset.href, '_blank'));
  }
}

function renderDataRequests(accounts) {
  const el = $('data-list');
  el.innerHTML = '';
  const eligible = accounts.filter(a => a.privacyContact);
  $('count-data').textContent = eligible.length;
  if (!eligible.length) {
    el.innerHTML = '<p class="hint">Aucun service avec contact DPO connu.</p>';
    return;
  }
  for (const s of eligible) {
    el.appendChild(entry(`
      <div class="entry-head">
        <div class="entry-name">${esc(s.name)}</div>
        <div class="entry-meta">${esc(s.privacyContact)}</div>
      </div>
      <div class="entry-actions"><button class="warn" data-id="${esc(s.id)}">Demander suppression RGPD</button></div>
    `));
    const btn = el.lastElementChild?.querySelector('button[data-id]');
    if (btn) btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        const r = await fetch('/api/gdpr-mailto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceId: btn.dataset.id, email: state.email }),
        }).then(r => r.json());
        if (r.mailto) window.location.href = r.mailto;
        else setStatus(r.error || 'Erreur', 'error');
      } catch (e) {
        setStatus('Erreur réseau', 'error');
      } finally {
        btn.disabled = false;
      }
    });
  }
}

async function scan() {
  const email = $('email').value.trim();
  if (!email) {
    setStatus('Email requis', 'error');
    return;
  }
  state.email = email;
  $('scan-btn').disabled = true;
  setStatus('Scan en cours...');
  try {
    const r = await fetch('/api/expose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Erreur scan');

    state.exposures = data.exposures || [];
    renderExposures(state.exposures);

    const servicesMap = new Map();
    for (const e of state.exposures) {
      if (e.serviceId) {
        if (!servicesMap.has(e.serviceId)) servicesMap.set(e.serviceId, { id: e.serviceId, name: e.title, domain: e.domain, category: '', privacyContact: '' });
      }
    }
    const serviceIds = Array.from(servicesMap.keys());
    if (serviceIds.length) {
      const r2 = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: serviceIds }),
      }).then(r => r.json());
      if (r2.services) {
        for (const s of r2.services) servicesMap.set(s.id, s);
      }
    }
    state.services = Array.from(servicesMap.values());
    renderAccounts(state.services);
    renderDataRequests(state.services);

    $('results').classList.remove('hidden');
    setStatus(`OK — ${state.exposures.length} expositions`);
  } catch (e) {
    setStatus('Erreur : ' + e.message, 'error');
  } finally {
    $('scan-btn').disabled = false;
  }
}

$('scan-btn').addEventListener('click', scan);
$('quit').addEventListener('click', () => window.close());
