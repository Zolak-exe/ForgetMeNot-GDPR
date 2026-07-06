import type { CuratedService } from './types.js';

export function buildGdprMailto(service: CuratedService, userEmail: string): string {
  const to = service.privacyContact ?? '';
  const subject = `Demande d'effacement de données personnelles — Article 17 RGPD`;
  const body = `Bonjour,

Conformément à l'article 17 du Règlement Général sur la Protection des Données (RGPD), je vous demande l'effacement de l'ensemble des données personnelles vous concernant me concernant.

Adresse email associée au compte : ${userEmail}
Service concerné : ${service.name}

Je vous demande également :
- la confirmation de l'effacement effectif,
- la transmission de cette demande à tout sous-traitant ou destinataire à qui vous auriez communiqué ces données,
- l'anonymisation des données conservées au titre d'obligations légales le cas échéant.

Conformément à l'article 12.3 du RGPD, vous disposez d'un délai d'un mois pour répondre à cette demande.

Cordialement,
`;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
