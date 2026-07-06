import { spawn } from 'node:child_process';
import { promises as fs, constants as fsConstants } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import os from 'node:os';

export interface CredentialsDetection {
  keyringAvailable: boolean;
  passwordFound: boolean;
  password?: string;
  source?: string;
  bridge: {
    installed: boolean;
    running: boolean;
    binaryPath: string | null;
    imapPort: number | null;
    smtpPort: number | null;
    configDir?: string;
  };
  tried: string[];
}

const BRIDGE_CANDIDATES = [
  '/usr/bin/protonmail-bridge',
  '/usr/bin/proton-bridge',
  '/usr/local/bin/protonmail-bridge',
  '/opt/Proton Mail Bridge/proton-bridge',
  '/snap/bin/protonmail-bridge',
  '/var/lib/flatpak/exports/bin/me.proton.bridge',
];

async function findBridgeBinary(): Promise<string | null> {
  const home = os.homedir();
  const candidates = [
    ...BRIDGE_CANDIDATES,
    path.join(home, '.local/share/flatpak/exports/bin/me.proton.bridge'),
  ];
  for (const p of candidates) {
    try {
      await fs.access(p, fsConstants.X_OK);
      return p;
    } catch {
      /* not present */
    }
  }
  return null;
}

export async function launchBridge(timeoutMs = 30000): Promise<{ ok: boolean; binaryPath?: string; pid?: number; running: boolean; imapPort?: number; smtpPort?: number; error?: string }> {
  const binaryPath = await findBridgeBinary();
  if (!binaryPath) {
    return { ok: false, running: false, error: 'Binaire ProtonMail Bridge introuvable. Installe-le depuis proton.me/mail/bridge.' };
  }
  let pid: number | undefined;
  try {
    const child = spawn(binaryPath, ['--noninteractive'], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env },
    });
    child.unref();
    pid = child.pid;
  } catch (err) {
    return { ok: false, binaryPath, running: false, error: (err as Error).message };
  }
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 1000));
    const [imap, smtp] = await Promise.all([tcpProbe('127.0.0.1', 1143), tcpProbe('127.0.0.1', 1025)]);
    if (imap || smtp) {
      return { ok: true, binaryPath, pid, running: true, imapPort: imap ? 1143 : undefined, smtpPort: smtp ? 1025 : undefined };
    }
  }
  return { ok: false, binaryPath, pid, running: false, error: 'Bridge lancé mais ports IMAP/SMTP toujours fermés après 30s (sans doute compte non configuré)' };
}

const KEYRING_ATTRS = ['email', 'username', 'account', 'user', 'mail'];

async function tryKeyring(value: string): Promise<{ found: boolean; password?: string; source?: string; tried: string[] }> {
  const tried: string[] = [];
  for (const attr of KEYRING_ATTRS) {
    const out = await runSecretTool(['lookup', attr, value]);
    tried.push(`secret-tool lookup ${attr}=${value}`);
    if (out.ok && out.stdout.trim().length > 0) {
      return { found: true, password: out.stdout.trim(), source: `gnome-keyring (${attr})`, tried };
    }
  }
  return { found: false, tried };
}

function runSecretTool(args: string[], timeoutMs = 1500): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let proc: ReturnType<typeof spawn>;
    try {
      proc = spawn('secret-tool', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch {
      return resolve({ ok: false, stdout: '', stderr: 'secret-tool absent' });
    }
    const timer = setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch { /* ignore */ }
    }, timeoutMs);
    proc.stdout?.on('data', (d) => (stdout += d.toString()));
    proc.stderr?.on('data', (d) => (stderr += d.toString()));
    proc.on('error', () => {
      clearTimeout(timer);
      resolve({ ok: false, stdout: '', stderr: 'secret-tool absent' });
    });
    proc.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, stdout, stderr });
    });
  });
}

async function isSecretToolAvailable(): Promise<boolean> {
  const r = await runSecretTool(['lookup', '__identity_scanner_probe__', 'none']);
  return r.stderr !== 'secret-tool absent';
}

function tcpProbe(host: string, port: number, timeoutMs = 400): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      try { socket.destroy(); } catch { /* ignore */ }
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.once('timeout', () => finish(false));
    socket.connect(port, host);
  });
}

async function detectBridge(): Promise<CredentialsDetection['bridge']> {
  const configDir = path.join(os.homedir(), '.config', 'protonmail');
  let resolvedDir: string | undefined;
  try {
    const entries = await fs.readdir(configDir);
    if (entries.length > 0) resolvedDir = configDir;
  } catch {
    /* no config */
  }
  const [binaryPath, imap, smtp] = await Promise.all([
    findBridgeBinary(),
    tcpProbe('127.0.0.1', 1143),
    tcpProbe('127.0.0.1', 1025),
  ]);
  return {
    installed: Boolean(binaryPath || resolvedDir),
    running: imap || smtp,
    binaryPath,
    imapPort: imap ? 1143 : null,
    smtpPort: smtp ? 1025 : null,
    configDir: resolvedDir,
  };
}

export async function detectCredentials(email: string): Promise<CredentialsDetection> {
  const [keyringAvailable, bridge] = await Promise.all([isSecretToolAvailable(), detectBridge()]);
  if (!keyringAvailable) {
    return {
      keyringAvailable: false,
      passwordFound: false,
      bridge,
      tried: ['secret-tool indisponible (paquet libsecret-tools)'],
    };
  }
  const found = await tryKeyring(email);
  return {
    keyringAvailable: true,
    passwordFound: found.found,
    password: found.password,
    source: found.source,
    bridge,
    tried: found.tried,
  };
}
