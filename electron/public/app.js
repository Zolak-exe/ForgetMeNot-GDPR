const $ = (id) => document.getElementById(id);
const els = {
  email: $('email'),
  mailPass: $('mail-pass'),
  remember: $('remember'),
  imapHost: $('imap-host'),
  imapPort: $('imap-port'),
  imapTls: $('imap-tls'),
  imapDays: $('imap-days'),
  smtpHost: $('smtp-host'),
  smtpPort: $('smtp-port'),
  smtpTls: $('smtp-tls'),
  scanBtn: $('scan-btn'),
  status: $('status'),
  autoconfigInfo: $('autoconfig-info'),
  results: $('results'),
  accountsList: $('accounts-list'),
  dataList: $('data-list'),
  breachesList: $('breaches-list'),
  unknownList: $('unknown-list'),
  countAccounts: $('count-accounts'),
  countData: $('count-data'),
  countBreaches: $('count-breaches'),
  countUnknown: $('count-unknown'),
  bulkSend: $('bulk-send'),
  bulkMailto: $('bulk-mailto'),
  bulkLog: $('bulk-log'),
  credsStatus: $('creds-status'),
  tuto: $('tuto'),
};

const TUTOS = {
  'protonmail-bridge': {
    title: 'ProtonMail Bridge requis',
    intro: "Proton ne supporte pas IMAP/SMTP direct. Tu dois installer ProtonMail Bridge, qui crée un pont IMAP/SMTP local.",
    steps: [
      'Télécharge Bridge : <a href="https://proton.me/mail/bridge" target="_blank">proton.me/mail/bridge</a>',
      "Installe le .deb avec <code>sudo dpkg -i protonmail-bridge_*.deb</code>",
      'Lance Bridge, connecte-toi avec ton compte Proton (le vrai)',
      'Ajoute ton adresse → Bridge affiche un <strong>username</strong> + <strong>password</strong> spécifiques',
      'Copie ce mot de passe ici (pas ton mdp Proton réel)',
    ],
    link: 'https://proton.me/mail/bridge',
    linkLabel: 'Télécharger Bridge',
  },
  'gmail': {
    title: 'App Password Gmail',
    intro: "Gmail bloque l'IMAP avec ton mot de passe normal. Il faut générer un App Password (2FA requise).",
    steps: [
      "Active la 2FA : <a href='https://myaccount.google.com/security' target='_blank'>myaccount.google.com/security</a>",
      "Va sur <a href='https://myaccount.google.com/apppasswords' target='_blank'>myaccount.google.com/apppasswords</a>",
      "Crée un App Password nommé \"Identity Scanner\"",
      "Copie les 16 caractères ici (sans espaces)",
    ],
    link: 'https://myaccount.google.com/apppasswords',
    linkLabel: 'Générer App Password',
  },
  'outlook': {
    title: 'App Password Outlook',
    intro: "Outlook/Microsoft demande un App Password si tu as la 2FA active.",
    steps: [
      "Va sur <a href='https://account.microsoft.com/security' target='_blank'>account.microsoft.com/security</a>",
      'Active la "vérification en deux étapes" si pas déjà fait',
      "Section App Passwords → Create",
      'Copie le mot de passe généré ici',
    ],
    link: 'https://account.microsoft.com/security',
    linkLabel: 'Compte Microsoft',
  },
  'yahoo': {
    title: 'App Password Yahoo',
    intro: "Yahoo exige un App Password pour IMAP tiers.",
    steps: [
      "Va sur <a href='https://login.yahoo.com/account/security' target='_blank'>login.yahoo.com/account/security</a>",
      "Génère un nouveau mot de passe d'application",
      'Copie le ici',
    ],
    link: 'https://login.yahoo.com/account/security',
    linkLabel: 'Sécurité Yahoo',
  },
  'icloud': {
    title: 'App-Specific Password iCloud',
    intro: "iCloud impose un App-Specific Password pour IMAP tiers (2FA requise).",
    steps: [
      "Va sur <a href='https://account.apple.com' target='_blank'>account.apple.com</a>",
      'Sign-In and Security → App-Specific Passwords',
      "Crée un nouveau mdp, copie-le ici",
    ],
    link: 'https://account.apple.com',
    linkLabel: 'Apple Account',
  },
  'generic': {
    title: 'Mot de passe IMAP',
    intro: "Ton mot de passe email habituel devrait fonctionner. Si ton provider exige un App Password, cherche \"App Password\" dans ses paramètres de sécurité.",
    steps: [
      "Vérifie que IMAP est activé chez ton provider (souvent désactivé par défaut)",
      "Si 2FA active : génère un App Password",
      "Saisis le mdp ci-dessus",
    ],
  },
};

function showTuto(provider, sourceTag) {
  let key = 'generic';
  if (sourceTag === 'protonmail-bridge' || /proton/i.test(provider)) key = 'protonmail-bridge';
  else if (/gmail/i.test(provider)) key = 'gmail';
  else if (/outlook|microsoft/i.test(provider)) key = 'outlook';
  else if (/yahoo/i.test(provider)) key = 'yahoo';
  else if (/icloud|apple/i.test(provider)) key = 'icloud';
  const t = TUTOS[key];
  const html = `
    <div class="tuto-head"><strong>${t.title}</strong></div>
    <p>${t.intro}</p>
    <ol>${t.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
    ${t.link ? `<a class="tuto-btn" href="${t.link}" target="_blank">${t.linkLabel} ↗</a>` : ''}
  `;
  els.tuto.innerHTML = html;
  els.tuto.classList.remove('hidden');
}

function hideTuto() {
  els.tuto.classList.add('hidden');
  els.tuto.innerHTML = '';
}

let lastCreds = null;

async function detectCredentials() {
  const email = els.email.value.trim();
  if (!email || !email.includes('@')) return;
  els.credsStatus.classList.remove('hidden');
  els.credsStatus.textContent = '⏳ Recherche du mot de passe (trousseau + Bridge)…';
  try {
    const r = await fetch(`/api/credentials-detect?email=${encodeURIComponent(email)}`).then((rs) => rs.json());
    lastCreds = r;
    renderCredsStatus(r);

    if (!els.mailPass.value) {
      const ac = lastAutoconfig;
      showTuto(ac?.provider ?? '', ac?.source);
    } else {
      hideTuto();
    }
  } catch (err) {
    els.credsStatus.textContent = '⚠ Détection impossible : ' + err.message;
  }
}

function renderCredsStatus(r) {
  const bits = [];
  if (r.passwordFound && r.password) {
    els.mailPass.value = r.password;
    bits.push(`🔐 Mot de passe trouvé via ${r.source}`);
  } else if (r.keyringAvailable) {
    bits.push('🔓 Trousseau accessible mais aucun mdp trouvé pour cet email');
  } else {
    bits.push('⚠ Trousseau inaccessible (<code>sudo apt install libsecret-tools</code>)');
  }
  if (r.bridge.running) {
    bits.push(`✓ Bridge actif (${r.bridge.imapPort ? 'IMAP ' + r.bridge.imapPort : ''}${r.bridge.smtpPort ? ' · SMTP ' + r.bridge.smtpPort : ''})`);
  } else if (r.bridge.binaryPath) {
    bits.push(`⚠ Bridge installé (<code>${r.bridge.binaryPath}</code>) mais pas lancé`);
  } else if (r.bridge.installed) {
    bits.push('⚠ Config Bridge présente mais binaire introuvable — réinstalle Bridge');
  }
  const html = bits.join(' · ');
  els.credsStatus.innerHTML = html;
  if (r.bridge.binaryPath && !r.bridge.running) {
    const btn = document.createElement('button');
    btn.id = 'launch-bridge-btn';
    btn.className = 'primary';
    btn.style.marginLeft = '8px';
    btn.textContent = '▶ Lancer Bridge';
    btn.addEventListener('click', launchBridgeAndRetry);
    els.credsStatus.appendChild(btn);
  }
}

async function launchBridgeAndRetry() {
  const btn = document.getElementById('launch-bridge-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Lancement (jusqu\'à 30s)…'; }
  try {
    const r = await fetch('/api/launch-bridge', { method: 'POST' }).then((rs) => rs.json());
    if (r.ok) {
      els.credsStatus.innerHTML = `✓ Bridge démarré (PID ${r.pid}, IMAP ${r.imapPort ?? '?'}, SMTP ${r.smtpPort ?? '?'}) — recheck credentials…`;
      await detectCredentials();
    } else {
      els.credsStatus.innerHTML = `✗ ${r.error ?? 'Échec lancement Bridge'}`;
      if (btn) { btn.disabled = false; btn.textContent = '▶ Réessayer'; }
    }
  } catch (err) {
    els.credsStatus.textContent = '✗ Erreur : ' + err.message;
  }
}

const LS_KEY = 'identity-scanner.session';

function loadRemembered() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.email) els.email.value = s.email;
    if (s.pass) els.mailPass.value = s.pass;
    if (s.remember) els.remember.checked = true;
  } catch {}
}

function saveRemembered() {
  if (!els.remember.checked) {
    localStorage.removeItem(LS_KEY);
    return;
  }
  localStorage.setItem(LS_KEY, JSON.stringify({
    email: els.email.value.trim(),
    pass: els.mailPass.value,
    remember: true,
  }));
}

function setStatus(msg, kind = '') {
  els.status.textContent = msg;
  els.status.className = 'status' + (kind ? ' ' + kind : '');
}

let lastAutoconfig = null;
let lastAutoconfigEmail = '';

async function runAutoconfig() {
  const email = els.email.value.trim();
  if (!email || !email.includes('@')) {
    els.autoconfigInfo.classList.add('hidden');
    return;
  }
  if (email === lastAutoconfigEmail) return;
  lastAutoconfigEmail = email;
  els.autoconfigInfo.classList.remove('hidden');
  els.autoconfigInfo.textContent = '⏳ Détection des serveurs IMAP/SMTP…';
  try {
    const r = await fetch(`/api/autoconfig?email=${encodeURIComponent(email)}`).then(r => r.json());
    lastAutoconfig = r;
    if (r.imap) {
      els.imapHost.value = r.imap.host;
      els.imapPort.value = r.imap.port;
      els.imapTls.checked = r.imap.tls;
    }
    if (r.smtp) {
      els.smtpHost.value = r.smtp.host;
      els.smtpPort.value = r.smtp.port;
      els.smtpTls.checked = r.smtp.tls;
    }
    const bits = [];
    bits.push(`✓ ${r.provider}`);
    if (r.imap) bits.push(`IMAP ${r.imap.host}:${r.imap.port}${r.imap.tls ? ' SSL' : ''}`);
    if (r.smtp) bits.push(`SMTP ${r.smtp.host}:${r.smtp.port}${r.smtp.tls ? ' SSL' : ''}`);
    if (r.needsBridge) bits.push(`⚠ ${r.bridgeHint}`);
    els.autoconfigInfo.innerHTML = bits.join(' · ');
  } catch (err) {
    els.autoconfigInfo.textContent = '⚠ Auto-config impossible : ' + err.message;
  }
}

async function runAutoEverything() {
  await runAutoconfig();
  await detectCredentials();
}
els.email.addEventListener('blur', runAutoEverything);
els.email.addEventListener('change', runAutoEverything);

function entryCard({ title, meta, category, subjects, actions, dataset }) {
  const wrap = document.createElement('div');
  wrap.className = 'entry';
  if (dataset) for (const [k, v] of Object.entries(dataset)) wrap.dataset[k] = v;

  const head = document.createElement('div');
  head.className = 'entry-head';
  const name = document.createElement('div');
  name.className = 'entry-name';
  name.textContent = title;
  const m = document.createElement('div');
  m.className = 'entry-meta';
  m.textContent = meta ?? '';
  head.appendChild(name);
  head.appendChild(m);
  wrap.appendChild(head);

  if (category) {
    const c = document.createElement('div');
    c.className = 'entry-cat';
    c.textContent = category;
    wrap.appendChild(c);
  }

  if (subjects?.length) {
    const s = document.createElement('div');
    s.className = 'entry-subjects';
    for (const subj of subjects) {
      const line = document.createElement('div');
      line.textContent = subj;
      s.appendChild(line);
    }
    wrap.appendChild(s);
  }

  if (actions?.length) {
    const a = document.createElement('div');
    a.className = 'entry-actions';
    for (const act of actions) {
      const b = document.createElement('button');
      b.className = act.kind ?? '';
      b.textContent = act.label;
      b.disabled = !act.handler;
      if (act.handler) b.addEventListener('click', act.handler);
      a.appendChild(b);
    }
    wrap.appendChild(a);
  }
  return wrap;
}

let currentAccounts = [];
let currentEmail = '';

function renderAccounts(accounts) {
  els.accountsList.innerHTML = '';
  els.countAccounts.textContent = accounts.length;
  if (!accounts.length) {
    els.accountsList.innerHTML = '<p class="hint">Aucun compte connu détecté.</p>';
    return;
  }
  for (const acc of accounts) {
    const s = acc.service;
    els.accountsList.appendChild(
      entryCard({
        title: s.name,
        meta: acc.hits ? `${acc.hits} mails` : '(brèche)',
        category: s.category,
        subjects: acc.sampleSubjects,
        actions: [
          {
            label: 'Supprimer le compte',
            kind: 'danger',
            handler: s.deleteAccountUrl ? () => window.open(s.deleteAccountUrl, '_blank') : null,
          },
        ],
      }),
    );
  }
}

function renderDataRequests(accounts, email) {
  els.dataList.innerHTML = '';
  const eligible = accounts.filter((a) => a.service?.privacyContact);
  els.countData.textContent = eligible.length;
  if (!eligible.length) {
    els.dataList.innerHTML = '<p class="hint">Aucun service avec DPO connu.</p>';
    return;
  }
  for (const acc of eligible) {
    const s = acc.service;
    els.dataList.appendChild(
      entryCard({
        title: s.name,
        meta: s.privacyContact,
        category: s.category,
        dataset: { serviceId: s.id },
        actions: [
          {
            label: '📩 Envoyer auto',
            kind: 'warn',
            handler: async () => sendGdpr(s.id, email),
          },
          {
            label: 'mailto',
            handler: async () => {
              const r = await fetch('/api/gdpr-mailto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: s.id, email }),
              }).then((r) => r.json());
              if (r.mailto) window.open(r.mailto, '_blank');
            },
          },
        ],
      }),
    );
  }
}

async function sendGdpr(serviceId, email) {
  const pass = els.mailPass.value;
  if (!pass) {
    appendBulkLog(`✗ ${serviceId} : mot de passe SMTP requis`, 'error');
    return false;
  }
  const payload = {
    serviceId,
    email,
    smtpHost: els.smtpHost.value.trim(),
    smtpPort: Number(els.smtpPort.value),
    smtpUser: email,
    smtpPass: pass,
    smtpTls: els.smtpTls.checked,
  };
  try {
    const r = await fetch('/api/send-gdpr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => r.json());
    if (r.ok) {
      appendBulkLog(`✓ ${serviceId} → ${r.sentTo ?? '?'}`, 'ok');
      return true;
    }
    appendBulkLog(`✗ ${serviceId} : ${r.error ?? 'erreur'}`, 'error');
    return false;
  } catch (err) {
    appendBulkLog(`✗ ${serviceId} : ${err.message}`, 'error');
    return false;
  }
}

function appendBulkLog(line, kind = '') {
  const div = document.createElement('div');
  div.className = 'bulk-line ' + kind;
  div.textContent = line;
  els.bulkLog.appendChild(div);
  els.bulkLog.scrollTop = els.bulkLog.scrollHeight;
}

function serviceById(id) {
  if (!id) return null;
  const a = currentAccounts.find((acc) => acc.service?.id === id);
  return a?.service ?? null;
}

function renderBreaches(exposures) {
  els.breachesList.innerHTML = '';
  els.countBreaches.textContent = exposures.length;
  if (!exposures.length) {
    els.breachesList.innerHTML = '<p class="hint">Aucune brèche connue.</p>';
    return;
  }
  for (const b of exposures) {
    const service = serviceById(b.serviceId);
    const actions = [];
    if (service?.deleteAccountUrl) {
      actions.push({
        label: 'Supprimer le compte',
        kind: 'danger',
        handler: () => window.open(service.deleteAccountUrl, '_blank'),
      });
    }
    if (service?.privacyContact) {
      actions.push({
        label: '📩 Effacer (RGPD)',
        kind: 'warn',
        handler: () => sendGdpr(service.id, currentEmail),
      });
    }
    if (b.domain) {
      actions.push({
        label: '🔑 Changer mdp',
        handler: () => window.open(`https://${b.domain}`, '_blank'),
      });
    }
    if (!actions.length) {
      actions.push({
        label: 'Chercher',
        handler: () => window.open(`https://www.google.com/search?q=${encodeURIComponent('supprimer compte ' + b.title)}`, '_blank'),
      });
    }
    els.breachesList.appendChild(
      entryCard({
        title: b.title,
        meta: b.breachDate,
        subjects: [`Exposé : ${b.dataClasses.slice(0, 4).join(', ')}`],
        actions,
      }),
    );
  }
}

function renderUnknown(unknown) {
  els.unknownList.innerHTML = '';
  els.countUnknown.textContent = unknown.length;
  if (!unknown.length) {
    els.unknownList.innerHTML = '<p class="hint">Aucun domaine inconnu.</p>';
    return;
  }
  for (const u of unknown) {
    els.unknownList.appendChild(
      entryCard({
        title: u.matchedDomain,
        meta: `${u.hits} mails`,
        subjects: u.sampleSubjects,
        actions: [
          {
            label: 'Chercher',
            handler: () => window.open(`https://www.google.com/search?q=${encodeURIComponent('supprimer compte ' + u.matchedDomain)}`, '_blank'),
          },
        ],
      }),
    );
  }
}

els.scanBtn.addEventListener('click', async () => {
  const email = els.email.value.trim();
  if (!email) {
    setStatus('Email requis', 'error');
    return;
  }
  currentEmail = email;
  saveRemembered();

  const pass = els.mailPass.value;
  const payload = { email };
  if (pass && els.imapHost.value.trim()) {
    payload.imap = {
      host: els.imapHost.value.trim(),
      port: Number(els.imapPort.value) || 993,
      user: email,
      pass,
      tls: els.imapTls.checked,
      daysBack: Number(els.imapDays.value) || 1825,
    };
  }

  els.scanBtn.disabled = true;
  setStatus(payload.imap ? 'Scan boîte mail + brèches…' : 'Scan brèches uniquement…');
  els.bulkLog.innerHTML = '';

  try {
    const r = await fetch('/api/expose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Erreur scan');

    currentAccounts = data.accounts;
    els.results.classList.remove('hidden');
    renderAccounts(data.accounts);
    renderDataRequests(data.accounts, email);
    renderBreaches(data.exposures);
    renderUnknown(data.unknown);

    const parts = [];
    if (data.imap.ok) parts.push(`IMAP : ${data.imap.scanned} mails`);
    else if (payload.imap) parts.push(`IMAP erreur : ${data.imap.error}`);
    if (data.exposureSource.ok) parts.push(`Brèches : ${data.exposures.length}`);
    setStatus(parts.join(' · '), 'ok');
  } catch (err) {
    setStatus('Erreur : ' + err.message, 'error');
  } finally {
    els.scanBtn.disabled = false;
  }
});

els.bulkSend.addEventListener('click', async () => {
  const eligible = currentAccounts.filter((a) => a.service?.privacyContact);
  if (!eligible.length) {
    appendBulkLog('Aucun service éligible', 'error');
    return;
  }
  if (!confirm(`Envoyer ${eligible.length} demandes RGPD depuis ${currentEmail} ?`)) return;
  els.bulkSend.disabled = true;
  appendBulkLog(`→ Envoi de ${eligible.length} demandes…`);
  let ok = 0;
  for (const acc of eligible) {
    const success = await sendGdpr(acc.service.id, currentEmail);
    if (success) ok++;
    await new Promise((r) => setTimeout(r, 500));
  }
  appendBulkLog(`✓ Terminé : ${ok}/${eligible.length} envoyés`, ok === eligible.length ? 'ok' : 'error');
  els.bulkSend.disabled = false;
});

els.bulkMailto.addEventListener('click', async () => {
  const eligible = currentAccounts.filter((a) => a.service?.privacyContact);
  if (!eligible.length) return;
  for (const acc of eligible) {
    const r = await fetch('/api/gdpr-mailto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: acc.service.id, email: currentEmail }),
    }).then((r) => r.json());
    if (r.mailto) window.open(r.mailto, '_blank');
    await new Promise((r) => setTimeout(r, 200));
  }
});

loadRemembered();
if (els.email.value) runAutoEverything();
