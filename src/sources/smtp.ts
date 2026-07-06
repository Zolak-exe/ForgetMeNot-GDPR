import nodemailer from 'nodemailer';
import type { CuratedService } from '../types.js';
import { config } from '../config.js';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  tls: boolean;
}

export async function sendGdprRequest(service: CuratedService, user_email: string, smtpConfig: SMTPConfig): Promise<{ ok: boolean; error?: string; sentTo?: string }> {
  const transport = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.tls,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const subject = `Demande de suppression de données personnelles – RGPD`;
  const body = `
Bonjour,

Je soussigné(e), utilisateur·trice de votre service, demande la suppression définitive de mes données personnelles conformément à l’article 17 du RGPD.

Adresse email associée : ${user_email}
Service concerné : ${service.name} (${service.id})

Je demande que :
- Toutes mes données personnelles soient effacées sans délai
- Aucune copie ne soit conservée, y compris dans les backups
- La suppression soit confirmée par écrit

Je me tiens à disposition pour fournir toute pièce justificative nécessaire.

Cordialement,

[Signature de l'utilisateur]

Cette demande a été générée automatiquement via un outil privé de gestion de l'empreinte numérique.
`; // Avoid triggering spam filters

  try {
    const info = await transport.sendMail({
      from: smtpConfig.user,
      to: service.privacyContact,
      subject,
      text: body,
    });

    transport.close();
    return { ok: true, sentTo: service.privacyContact };
  } catch (err) {
    transport.close();
    return { ok: false, error: (err as Error).message };
  }
}