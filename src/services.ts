import type { CuratedService } from './types.js';

export const CURATED_SERVICES: CuratedService[] = [
  // ─── Social ──────────────────────────────────────────────────────────
  { id: 'facebook', name: 'Facebook', domains: ['facebook.com', 'facebookmail.com', 'fb.com'], category: 'social', deleteAccountUrl: 'https://www.facebook.com/help/delete_account', privacyContact: 'datarequests@fb.com' },
  { id: 'instagram', name: 'Instagram', domains: ['instagram.com', 'mail.instagram.com'], category: 'social', deleteAccountUrl: 'https://www.instagram.com/accounts/remove/request/permanent/', privacyContact: 'privacymattersig@support.facebook.com' },
  { id: 'twitter', name: 'X (Twitter)', domains: ['twitter.com', 'x.com'], category: 'social', deleteAccountUrl: 'https://twitter.com/settings/deactivate', privacyContact: 'privacy@twitter.com' },
  { id: 'linkedin', name: 'LinkedIn', domains: ['linkedin.com', 'e.linkedin.com'], category: 'social', deleteAccountUrl: 'https://www.linkedin.com/psettings/account-management/close-submit', privacyContact: 'privacy@linkedin.com' },
  { id: 'tiktok', name: 'TikTok', domains: ['tiktok.com', 'tiktokv.com'], category: 'social', deleteAccountUrl: 'https://www.tiktok.com/setting?lang=fr', privacyContact: 'privacy@tiktok.com' },
  { id: 'snapchat', name: 'Snapchat', domains: ['snapchat.com', 'snap.com'], category: 'social', deleteAccountUrl: 'https://accounts.snapchat.com/accounts/delete_account', privacyContact: 'support@snapchat.com' },
  { id: 'reddit', name: 'Reddit', domains: ['reddit.com', 'redditmail.com'], category: 'social', deleteAccountUrl: 'https://www.reddit.com/settings/account', privacyContact: 'privacy@reddit.com' },
  { id: 'discord', name: 'Discord', domains: ['discord.com', 'discordapp.com'], category: 'social', deleteAccountUrl: 'https://support.discord.com/hc/en-us/requests/new', privacyContact: 'privacy@discord.com' },
  { id: 'pinterest', name: 'Pinterest', domains: ['pinterest.com', 'pinterest.fr'], category: 'social', deleteAccountUrl: 'https://www.pinterest.com/settings/?tab=account', privacyContact: 'privacy-help@pinterest.com' },
  { id: 'mastodon', name: 'Mastodon', domains: ['mastodon.social', 'mas.to', 'piaille.fr'], category: 'social', deleteAccountUrl: 'https://mastodon.social/auth/edit', privacyContact: 'admin@mastodon.social' },
  { id: 'bluesky', name: 'Bluesky', domains: ['bsky.app', 'bsky.social'], category: 'social', deleteAccountUrl: 'https://bsky.app/settings/account', privacyContact: 'privacy@bsky.app' },
  { id: 'threads', name: 'Threads', domains: ['threads.net'], category: 'social', deleteAccountUrl: 'https://www.threads.net/settings/account', privacyContact: 'datarequests@fb.com' },

  // ─── Tech ────────────────────────────────────────────────────────────
  { id: 'google', name: 'Google', domains: ['google.com', 'accounts.google.com', 'youtube.com'], category: 'tech', deleteAccountUrl: 'https://myaccount.google.com/deleteaccount', privacyContact: 'support-fr@google.com' },
  { id: 'microsoft', name: 'Microsoft', domains: ['microsoft.com', 'outlook.com', 'live.com', 'hotmail.com', 'account.microsoft.com'], category: 'tech', deleteAccountUrl: 'https://account.microsoft.com/profile/closeaccount', privacyContact: 'msprivacy@microsoft.com' },
  { id: 'apple', name: 'Apple', domains: ['apple.com', 'icloud.com', 'me.com'], category: 'tech', deleteAccountUrl: 'https://privacy.apple.com/', privacyContact: 'privacy@apple.com' },
  { id: 'github', name: 'GitHub', domains: ['github.com', 'noreply.github.com'], category: 'tech', deleteAccountUrl: 'https://github.com/settings/admin', privacyContact: 'privacy@github.com' },
  { id: 'gitlab', name: 'GitLab', domains: ['gitlab.com'], category: 'tech', deleteAccountUrl: 'https://gitlab.com/-/profile/account', privacyContact: 'dpo@gitlab.com' },
  { id: 'cloudflare', name: 'Cloudflare', domains: ['cloudflare.com'], category: 'tech', deleteAccountUrl: 'https://dash.cloudflare.com/profile', privacyContact: 'privacyquestions@cloudflare.com' },
  { id: 'vercel', name: 'Vercel', domains: ['vercel.com'], category: 'tech', deleteAccountUrl: 'https://vercel.com/account', privacyContact: 'privacy@vercel.com' },
  { id: 'netlify', name: 'Netlify', domains: ['netlify.com'], category: 'tech', deleteAccountUrl: 'https://app.netlify.com/user/applications', privacyContact: 'privacy@netlify.com' },
  { id: 'digitalocean', name: 'DigitalOcean', domains: ['digitalocean.com'], category: 'tech', deleteAccountUrl: 'https://cloud.digitalocean.com/account/billing', privacyContact: 'privacy@digitalocean.com' },
  { id: 'ovh', name: 'OVH', domains: ['ovh.com', 'ovhcloud.com'], category: 'tech', deleteAccountUrl: 'https://www.ovhcloud.com/fr/support/', privacyContact: 'dpo@ovhcloud.com' },

  // ─── Gaming ──────────────────────────────────────────────────────────
  { id: 'steam', name: 'Steam', domains: ['steampowered.com', 'steamcommunity.com'], category: 'gaming', deleteAccountUrl: 'https://help.steampowered.com/wizard/HelpWithMyAccount?issueid=235', privacyContact: 'privacy@valvesoftware.com' },
  { id: 'epic', name: 'Epic Games', domains: ['epicgames.com', 'unrealengine.com'], category: 'gaming', deleteAccountUrl: 'https://www.epicgames.com/account/personal', privacyContact: 'privacy@epicgames.com' },
  { id: 'ea', name: 'EA', domains: ['ea.com', 'origin.com'], category: 'gaming', deleteAccountUrl: 'https://help.ea.com/fr/contact-us/', privacyContact: 'privacy@ea.com' },
  { id: 'ubisoft', name: 'Ubisoft', domains: ['ubisoft.com', 'ubi.com'], category: 'gaming', deleteAccountUrl: 'https://account.ubisoft.com/en-GB/account-information', privacyContact: 'dpo@ubisoft.com' },
  { id: 'riot', name: 'Riot Games', domains: ['riotgames.com', 'leagueoflegends.com'], category: 'gaming', deleteAccountUrl: 'https://support.riotgames.com/hc/en-us/requests/new?ticket_form_id=470076', privacyContact: 'privacy@riotgames.com' },
  { id: 'playstation', name: 'PlayStation', domains: ['playstation.com', 'sonyentertainmentnetwork.com'], category: 'gaming', deleteAccountUrl: 'https://www.playstation.com/fr-fr/support/account/close-psn-account/', privacyContact: 'PrivacyMatters@scee.net' },
  { id: 'xbox', name: 'Xbox', domains: ['xbox.com'], category: 'gaming', deleteAccountUrl: 'https://account.microsoft.com/profile/closeaccount', privacyContact: 'msprivacy@microsoft.com' },
  { id: 'nintendo', name: 'Nintendo', domains: ['nintendo.com', 'accounts.nintendo.com'], category: 'gaming', deleteAccountUrl: 'https://accounts.nintendo.com/profile', privacyContact: 'privacy@noe.nintendo.eu' },
  { id: 'twitch', name: 'Twitch', domains: ['twitch.tv'], category: 'gaming', deleteAccountUrl: 'https://www.twitch.tv/user/delete-account', privacyContact: 'privacy@twitch.tv' },

  // ─── E-commerce ──────────────────────────────────────────────────────
  { id: 'amazon', name: 'Amazon', domains: ['amazon.fr', 'amazon.com', 'amazon.co.uk', 'amazon.de'], category: 'ecommerce', deleteAccountUrl: 'https://www.amazon.fr/gp/help/customer/contact-us', privacyContact: 'eu-privacy@amazon.com' },
  { id: 'ebay', name: 'eBay', domains: ['ebay.com', 'ebay.fr'], category: 'ecommerce', deleteAccountUrl: 'https://accountsettings.ebay.com/uca/close_account', privacyContact: 'dpo@ebay.com' },
  { id: 'aliexpress', name: 'AliExpress', domains: ['aliexpress.com', 'aliexpress.fr'], category: 'ecommerce', deleteAccountUrl: 'https://www.aliexpress.com/p/customer-service/index.html', privacyContact: 'privacy@aliexpress.com' },
  { id: 'etsy', name: 'Etsy', domains: ['etsy.com'], category: 'ecommerce', deleteAccountUrl: 'https://www.etsy.com/help/article/239', privacyContact: 'legal@etsy.com' },
  { id: 'shein', name: 'SHEIN', domains: ['shein.com', 'shein.fr'], category: 'ecommerce', deleteAccountUrl: 'https://www.shein.com/Contact-Us-a-282.html', privacyContact: 'privacy@shein.com' },
  { id: 'leboncoin', name: 'Leboncoin', domains: ['leboncoin.fr'], category: 'ecommerce', deleteAccountUrl: 'https://www.leboncoin.fr/account/account_management', privacyContact: 'dpo@leboncoin.fr' },
  { id: 'vinted', name: 'Vinted', domains: ['vinted.fr', 'vinted.com'], category: 'ecommerce', deleteAccountUrl: 'https://www.vinted.fr/settings/account', privacyContact: 'dpo@vinted.com' },
  { id: 'fnac', name: 'Fnac', domains: ['fnac.com'], category: 'ecommerce', deleteAccountUrl: 'https://www.fnac.com/Help/IndexHelp.aspx', privacyContact: 'dpo@fnac.com' },
  { id: 'cdiscount', name: 'Cdiscount', domains: ['cdiscount.com'], category: 'ecommerce', deleteAccountUrl: 'https://www.cdiscount.com/aide.html', privacyContact: 'donneespersonnelles@cdiscount.com' },

  // ─── Streaming ───────────────────────────────────────────────────────
  { id: 'netflix', name: 'Netflix', domains: ['netflix.com', 'mailer.netflix.com'], category: 'streaming', deleteAccountUrl: 'https://www.netflix.com/CancelPlan', privacyContact: 'privacy@netflix.com' },
  { id: 'spotify', name: 'Spotify', domains: ['spotify.com'], category: 'streaming', deleteAccountUrl: 'https://www.spotify.com/account/close/', privacyContact: 'privacy@spotify.com' },
  { id: 'youtube', name: 'YouTube Premium', domains: ['youtube.com'], category: 'streaming', deleteAccountUrl: 'https://myaccount.google.com/deleteaccount', privacyContact: 'support-fr@google.com' },
  { id: 'disney', name: 'Disney+', domains: ['disneyplus.com', 'disney.com'], category: 'streaming', deleteAccountUrl: 'https://www.disneyplus.com/account', privacyContact: 'dataprotection@bamtech.com' },
  { id: 'deezer', name: 'Deezer', domains: ['deezer.com'], category: 'streaming', deleteAccountUrl: 'https://www.deezer.com/account/delete', privacyContact: 'dpo@deezer.com' },
  { id: 'primevideo', name: 'Prime Video', domains: ['primevideo.com'], category: 'streaming', deleteAccountUrl: 'https://www.amazon.fr/gp/help/customer/contact-us', privacyContact: 'eu-privacy@amazon.com' },

  // ─── Productivity ────────────────────────────────────────────────────
  { id: 'notion', name: 'Notion', domains: ['notion.so', 'notion.com'], category: 'productivity', deleteAccountUrl: 'https://www.notion.so/my-account', privacyContact: 'privacy@makenotion.com' },
  { id: 'slack', name: 'Slack', domains: ['slack.com'], category: 'productivity', deleteAccountUrl: 'https://slack.com/account/settings', privacyContact: 'privacy@slack.com' },
  { id: 'trello', name: 'Trello', domains: ['trello.com'], category: 'productivity', deleteAccountUrl: 'https://trello.com/your/account', privacyContact: 'privacy@atlassian.com' },
  { id: 'dropbox', name: 'Dropbox', domains: ['dropbox.com'], category: 'productivity', deleteAccountUrl: 'https://www.dropbox.com/account/delete', privacyContact: 'privacy@dropbox.com' },
  { id: 'zoom', name: 'Zoom', domains: ['zoom.us'], category: 'productivity', deleteAccountUrl: 'https://zoom.us/profile', privacyContact: 'privacy@zoom.us' },
  { id: 'figma', name: 'Figma', domains: ['figma.com'], category: 'productivity', deleteAccountUrl: 'https://www.figma.com/settings', privacyContact: 'privacy@figma.com' },
  { id: 'canva', name: 'Canva', domains: ['canva.com'], category: 'productivity', deleteAccountUrl: 'https://www.canva.com/settings/account', privacyContact: 'privacy@canva.com' },

  // ─── Finance ─────────────────────────────────────────────────────────
  { id: 'paypal', name: 'PayPal', domains: ['paypal.com', 'paypal.fr'], category: 'finance', deleteAccountUrl: 'https://www.paypal.com/myaccount/settings/', privacyContact: 'privacy@paypal.com' },
  { id: 'revolut', name: 'Revolut', domains: ['revolut.com'], category: 'finance', deleteAccountUrl: 'https://www.revolut.com/help/profile-and-plan/closing-account', privacyContact: 'dpo@revolut.com' },
  { id: 'n26', name: 'N26', domains: ['n26.com'], category: 'finance', deleteAccountUrl: 'https://n26.com/fr-fr/support', privacyContact: 'privacy@n26.com' },
  { id: 'lydia', name: 'Lydia', domains: ['lydia-app.com'], category: 'finance', deleteAccountUrl: 'https://lydia-app.com/contact', privacyContact: 'dpo@lydia-app.com' },
  { id: 'boursorama', name: 'Boursorama', domains: ['boursorama.com'], category: 'finance', deleteAccountUrl: 'https://www.boursorama.com/contact/', privacyContact: 'dpo@boursorama.fr' },

  // ─── Dating ──────────────────────────────────────────────────────────
  { id: 'tinder', name: 'Tinder', domains: ['gotinder.com', 'tinder.com'], category: 'dating', deleteAccountUrl: 'https://account.gotinder.com/delete', privacyContact: 'privacy@gotinder.com' },
  { id: 'bumble', name: 'Bumble', domains: ['bumble.com'], category: 'dating', deleteAccountUrl: 'https://bumble.com/settings', privacyContact: 'feedback@team.bumble.com' },
  { id: 'hinge', name: 'Hinge', domains: ['hinge.co'], category: 'dating', deleteAccountUrl: 'https://hinge.co/contact-us', privacyContact: 'privacy@hinge.co' },

  // ─── AI ──────────────────────────────────────────────────────────────
  { id: 'openai', name: 'OpenAI / ChatGPT', domains: ['openai.com'], category: 'ai', deleteAccountUrl: 'https://platform.openai.com/account/settings', privacyContact: 'privacy@openai.com' },
  { id: 'anthropic', name: 'Anthropic / Claude', domains: ['anthropic.com', 'claude.ai'], category: 'ai', deleteAccountUrl: 'https://claude.ai/settings/account', privacyContact: 'privacy@anthropic.com' },
  { id: 'huggingface', name: 'Hugging Face', domains: ['huggingface.co'], category: 'ai', deleteAccountUrl: 'https://huggingface.co/settings/account', privacyContact: 'privacy@huggingface.co' },
  { id: 'openrouter', name: 'OpenRouter', domains: ['openrouter.ai'], category: 'ai', deleteAccountUrl: 'https://openrouter.ai/settings/account', privacyContact: 'support@openrouter.ai' },
  { id: 'midjourney', name: 'Midjourney', domains: ['midjourney.com'], category: 'ai', deleteAccountUrl: 'https://www.midjourney.com/account/', privacyContact: 'privacy@midjourney.com' },

  // ─── News / Other ────────────────────────────────────────────────────
  { id: 'medium', name: 'Medium', domains: ['medium.com'], category: 'news', deleteAccountUrl: 'https://medium.com/me/settings', privacyContact: 'privacy@medium.com' },
  { id: 'substack', name: 'Substack', domains: ['substack.com'], category: 'news', deleteAccountUrl: 'https://substack.com/settings', privacyContact: 'privacy@substack.com' },
  { id: 'lemonde', name: 'Le Monde', domains: ['lemonde.fr'], category: 'news', deleteAccountUrl: 'https://moncompte.lemonde.fr/', privacyContact: 'dpo@lemonde.fr' },
  { id: 'mediapart', name: 'Mediapart', domains: ['mediapart.fr'], category: 'news', deleteAccountUrl: 'https://www.mediapart.fr/donnees-personnelles', privacyContact: 'dpo@mediapart.fr' },
  { id: 'le-figaro', name: 'Le Figaro', domains: ['lefigaro.fr'], category: 'news', deleteAccountUrl: 'https://www.lefigaro.fr/donnees-personnelles', privacyContact: 'dpo@lefigaro.fr' },
  { id: 'liberation', name: 'Libération', domains: ['liberation.fr'], category: 'news', deleteAccountUrl: 'https://www.liberation.fr/donnees-personnelles', privacyContact: 'dpo@liberation.fr' },

  // ─── Télécoms FR ─────────────────────────────────────────────────────
  { id: 'orange', name: 'Orange', domains: ['orange.fr', 'orange.com'], category: 'tech', deleteAccountUrl: 'https://espace-client.orange.fr/donnees-personnelles', privacyContact: 'group-dpo.donnees-personnelles@orange.com' },
  { id: 'sfr', name: 'SFR', domains: ['sfr.fr', 'sfr.com'], category: 'tech', deleteAccountUrl: 'https://www.sfr.fr/aide-et-contact/', privacyContact: 'donneespersonnelles@sfr.fr' },
  { id: 'bouygues', name: 'Bouygues Telecom', domains: ['bouyguestelecom.fr'], category: 'tech', deleteAccountUrl: 'https://www.bouyguestelecom.fr/protection-donnees-personnelles', privacyContact: 'donnees-personnelles@bouyguestelecom.fr' },
  { id: 'free', name: 'Free / Free Mobile', domains: ['free.fr', 'mobile.free.fr', 'iliad.fr'], category: 'tech', deleteAccountUrl: 'https://mobile.free.fr/account/contrat/resilier', privacyContact: 'dpo@iliad.fr' },

  // ─── Cloud / Dev ─────────────────────────────────────────────────────
  { id: 'aws', name: 'Amazon Web Services', domains: ['aws.amazon.com', 'amazonaws.com'], category: 'tech', deleteAccountUrl: 'https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-closing.html', privacyContact: 'aws-privacy@amazon.com', notes: 'Console AWS > My Account > Close Account (90j de délai avant suppression définitive)' },
  { id: 'gcp', name: 'Google Cloud', domains: ['cloud.google.com'], category: 'tech', deleteAccountUrl: 'https://console.cloud.google.com/billing', privacyContact: 'support-fr@google.com' },
  { id: 'azure', name: 'Microsoft Azure', domains: ['azure.com', 'azure.microsoft.com'], category: 'tech', deleteAccountUrl: 'https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade', privacyContact: 'msprivacy@microsoft.com' },
  { id: 'jetbrains', name: 'JetBrains', domains: ['jetbrains.com'], category: 'productivity', deleteAccountUrl: 'https://account.jetbrains.com/profile', privacyContact: 'privacy@jetbrains.com' },
  { id: 'npm', name: 'npm', domains: ['npmjs.com'], category: 'tech', deleteAccountUrl: 'https://www.npmjs.com/settings/~/profile', privacyContact: 'privacy@npmjs.com' },
  { id: 'stackoverflow', name: 'Stack Overflow', domains: ['stackoverflow.com', 'stackexchange.com'], category: 'tech', deleteAccountUrl: 'https://stackoverflow.com/users/account/delete', privacyContact: 'privacy@stackoverflow.com' },
  { id: 'sentry', name: 'Sentry', domains: ['sentry.io'], category: 'tech', deleteAccountUrl: 'https://sentry.io/settings/account/details/', privacyContact: 'privacy@sentry.io' },
  { id: 'replit', name: 'Replit', domains: ['replit.com'], category: 'tech', deleteAccountUrl: 'https://replit.com/account', privacyContact: 'privacy@replit.com' },

  // ─── SaaS / Productivity ─────────────────────────────────────────────
  { id: 'stripe', name: 'Stripe', domains: ['stripe.com'], category: 'finance', deleteAccountUrl: 'https://dashboard.stripe.com/settings/account', privacyContact: 'privacy@stripe.com' },
  { id: 'hubspot', name: 'HubSpot', domains: ['hubspot.com'], category: 'productivity', deleteAccountUrl: 'https://app.hubspot.com/account-and-billing/profile-preferences', privacyContact: 'privacy@hubspot.com' },
  { id: 'mailchimp', name: 'Mailchimp', domains: ['mailchimp.com'], category: 'productivity', deleteAccountUrl: 'https://login.mailchimp.com/settings/', privacyContact: 'privacy@mailchimp.com' },
  { id: 'brevo', name: 'Brevo (ex-Sendinblue)', domains: ['brevo.com', 'sendinblue.com'], category: 'productivity', deleteAccountUrl: 'https://app.brevo.com/settings', privacyContact: 'privacy@brevo.com', notes: 'DPO postal : Sendinblue SAS, 17 rue Salneuve, 75017 Paris' },
  { id: 'asana', name: 'Asana', domains: ['asana.com'], category: 'productivity', deleteAccountUrl: 'https://app.asana.com/-/account_settings', privacyContact: 'privacy@asana.com' },
  { id: 'atlassian', name: 'Atlassian (Jira, Confluence)', domains: ['atlassian.com', 'atlassian.net'], category: 'productivity', deleteAccountUrl: 'https://id.atlassian.com/manage-profile/profile-and-visibility', privacyContact: 'privacy@atlassian.com' },
  { id: 'airtable', name: 'Airtable', domains: ['airtable.com'], category: 'productivity', deleteAccountUrl: 'https://airtable.com/account', privacyContact: 'privacy@airtable.com' },

  // ─── Travel / Transport ──────────────────────────────────────────────
  { id: 'airbnb', name: 'Airbnb', domains: ['airbnb.com', 'airbnb.fr'], category: 'other', deleteAccountUrl: 'https://www.airbnb.fr/account-settings/data-policy', privacyContact: 'dpo@airbnb.com' },
  { id: 'booking', name: 'Booking.com', domains: ['booking.com'], category: 'other', deleteAccountUrl: 'https://account.booking.com/settings/privacy/account', privacyContact: 'dataprotection@booking.com' },
  { id: 'expedia', name: 'Expedia', domains: ['expedia.com', 'expedia.fr'], category: 'other', deleteAccountUrl: 'https://www.expedia.fr/service/', privacyContact: 'privacy@expedia.com' },
  { id: 'tripadvisor', name: 'Tripadvisor', domains: ['tripadvisor.com', 'tripadvisor.fr'], category: 'other', deleteAccountUrl: 'https://www.tripadvisor.fr/MemberProfile', privacyContact: 'privacypolicy@tripadvisor.com' },
  { id: 'sncf-connect', name: 'SNCF Connect', domains: ['sncf-connect.com', 'oui.sncf', 'sncf.com'], category: 'other', deleteAccountUrl: 'https://www.sncf-connect.com/app/account', privacyContact: 'dpo@connect.sncf' },
  { id: 'air-france', name: 'Air France', domains: ['airfrance.fr', 'airfrance.com'], category: 'other', deleteAccountUrl: 'https://www.airfrance.fr/FR/fr/common/transverse/footer/protection-donnees-personnelles.htm', privacyContact: 'mail.data.protection@airfrance.fr' },
  { id: 'uber', name: 'Uber', domains: ['uber.com'], category: 'other', deleteAccountUrl: 'https://help.uber.com/h/c34bf18a-c5e2-4f4e-a25b-69e90c43ef7f', privacyContact: 'privacy@uber.com' },
  { id: 'blablacar', name: 'BlaBlaCar', domains: ['blablacar.fr', 'blablacar.com'], category: 'other', deleteAccountUrl: 'https://www.blablacar.fr/account/profile', privacyContact: 'dpo@blablacar.com', notes: 'Profil > Compte > Fermer mon compte (irréversible, soldes à régler avant)' },
  { id: 'lyft', name: 'Lyft', domains: ['lyft.com'], category: 'other', deleteAccountUrl: 'https://account.lyft.com/privacy', privacyContact: 'privacy@lyft.com' },

  // ─── Food delivery ───────────────────────────────────────────────────
  { id: 'uber-eats', name: 'Uber Eats', domains: ['ubereats.com'], category: 'other', deleteAccountUrl: 'https://help.uber.com/ubereats/h/c34bf18a-c5e2-4f4e-a25b-69e90c43ef7f', privacyContact: 'privacy@uber.com' },
  { id: 'deliveroo', name: 'Deliveroo', domains: ['deliveroo.fr', 'deliveroo.com'], category: 'other', deleteAccountUrl: 'https://deliveroo.fr/account', privacyContact: 'dpo@deliveroo.fr' },
  { id: 'justeat', name: 'Just Eat', domains: ['just-eat.fr', 'just-eat.com'], category: 'other', deleteAccountUrl: 'https://www.just-eat.fr/account', privacyContact: 'privacy@just-eat.com' },

  // ─── Santé / Bien-être ───────────────────────────────────────────────
  { id: 'doctolib', name: 'Doctolib', domains: ['doctolib.fr', 'doctolib.com'], category: 'other', deleteAccountUrl: 'https://www.doctolib.fr/account', privacyContact: 'contact.dataprivacy@doctolib.fr', notes: 'Données médicales conservées 20 ans (obligation légale)' },
  { id: 'strava', name: 'Strava', domains: ['strava.com'], category: 'other', deleteAccountUrl: 'https://www.strava.com/account/delete_my_account', privacyContact: 'privacy@strava.com' },
  { id: 'myfitnesspal', name: 'MyFitnessPal', domains: ['myfitnesspal.com'], category: 'other', deleteAccountUrl: 'https://www.myfitnesspal.com/account/delete-account', privacyContact: 'privacy@myfitnesspal.com' },
  { id: 'duolingo', name: 'Duolingo', domains: ['duolingo.com'], category: 'other', deleteAccountUrl: 'https://www.duolingo.com/settings/account', privacyContact: 'privacy@duolingo.com' },

  // ─── Administration / Service public FR ──────────────────────────────
  { id: 'ameli', name: 'Ameli (Assurance Maladie)', domains: ['ameli.fr'], category: 'other', deleteAccountUrl: 'https://www.ameli.fr/assure/adresses-et-contacts', privacyContact: 'cnil@assurance-maladie.fr', notes: 'Compte rattaché au N° SS — suppression encadrée par la loi' },
  { id: 'france-travail', name: 'France Travail (Pôle Emploi)', domains: ['francetravail.fr', 'pole-emploi.fr'], category: 'other', deleteAccountUrl: 'https://www.francetravail.fr/candidat/vos-services-en-ligne.html', privacyContact: 'donnees-personnelles@francetravail.fr' },
  { id: 'impots', name: 'impots.gouv.fr', domains: ['impots.gouv.fr', 'dgfip.finances.gouv.fr'], category: 'other', deleteAccountUrl: 'https://www.impots.gouv.fr/contact', privacyContact: 'dpd@dgfip.finances.gouv.fr', notes: 'Compte fiscal non-supprimable tant que vous êtes contribuable français' },
  { id: 'la-poste', name: 'La Poste', domains: ['laposte.fr', 'laposte.net'], category: 'other', deleteAccountUrl: 'https://www.laposte.fr/donnees-personnelles', privacyContact: 'dpo@laposte.fr' },

  // ─── Banques FR ──────────────────────────────────────────────────────
  { id: 'credit-agricole', name: 'Crédit Agricole', domains: ['credit-agricole.fr', 'credit-agricole.com'], category: 'finance', deleteAccountUrl: 'https://www.credit-agricole.fr/particulier/informations/politique-de-confidentialite.html', privacyContact: 'donnees.personnelles@credit-agricole-sa.fr', notes: 'Contact DPO varie selon la caisse régionale' },
  { id: 'bnp-paribas', name: 'BNP Paribas', domains: ['bnpparibas.com', 'bnpparibas.fr', 'mabanque.bnpparibas'], category: 'finance', deleteAccountUrl: 'https://mabanque.bnpparibas/fr/contact', privacyContact: 'dpo@bnpparibas.com' },
  { id: 'societe-generale', name: 'Société Générale', domains: ['societegenerale.fr', 'societegenerale.com'], category: 'finance', deleteAccountUrl: 'https://particuliers.sg.fr/contact', privacyContact: 'protection-donnees@socgen.com' },
  { id: 'banque-postale', name: 'La Banque Postale', domains: ['labanquepostale.fr', 'labanquepostale.com'], category: 'finance', deleteAccountUrl: 'https://www.labanquepostale.fr/legal/donnees-personnelles.html', privacyContact: 'dpo-clients@labanquepostale.fr' },
  { id: 'hello-bank', name: 'Hello bank!', domains: ['hellobank.fr'], category: 'finance', deleteAccountUrl: 'https://www.hellobank.fr/aide', privacyContact: 'dpo@bnpparibas.com' },

  // ─── Gaming (suite) ──────────────────────────────────────────────────
  { id: 'activision', name: 'Activision', domains: ['activision.com', 'callofduty.com'], category: 'gaming', deleteAccountUrl: 'https://support.activision.com/data-request', privacyContact: 'privacy@activision.com' },
  { id: 'blizzard', name: 'Blizzard', domains: ['battle.net', 'blizzard.com'], category: 'gaming', deleteAccountUrl: 'https://us.battle.net/support/article/40117', privacyContact: 'privacy@blizzard.com' },
  { id: 'bethesda', name: 'Bethesda', domains: ['bethesda.net'], category: 'gaming', deleteAccountUrl: 'https://account.bethesda.net/en/profile', privacyContact: 'privacy@bethesda.com' },
  { id: 'roblox', name: 'Roblox', domains: ['roblox.com'], category: 'gaming', deleteAccountUrl: 'https://www.roblox.com/info/privacy', privacyContact: 'privacy@roblox.com' },

  // ─── Creator / Donation ──────────────────────────────────────────────
  { id: 'patreon', name: 'Patreon', domains: ['patreon.com'], category: 'finance', deleteAccountUrl: 'https://www.patreon.com/settings/account', privacyContact: 'privacy@patreon.com' },
  { id: 'kofi', name: 'Ko-fi', domains: ['ko-fi.com', 'kofi.com'], category: 'finance', deleteAccountUrl: 'https://ko-fi.com/manage/account', privacyContact: 'privacy@ko-fi.com' },

  // ─── Social / Connaissance ───────────────────────────────────────────
  { id: 'telegram', name: 'Telegram', domains: ['telegram.org', 'telegram.me'], category: 'social', deleteAccountUrl: 'https://my.telegram.org/auth?to=delete', privacyContact: 'dpo@telegram.org' },
  { id: 'wikimedia', name: 'Wikipédia / Wikimedia', domains: ['wikipedia.org', 'wikimedia.org'], category: 'other', deleteAccountUrl: 'https://meta.wikimedia.org/wiki/Right_to_vanish', privacyContact: 'privacy@wikimedia.org', notes: 'Pas de suppression — procédure "right to vanish" (anonymisation)' },
  { id: 'quora', name: 'Quora', domains: ['quora.com'], category: 'social', deleteAccountUrl: 'https://www.quora.com/settings/privacy', privacyContact: 'privacy@quora.com' },
  { id: 'goodreads', name: 'Goodreads', domains: ['goodreads.com'], category: 'social', deleteAccountUrl: 'https://www.goodreads.com/user/destroy', privacyContact: 'privacy@goodreads.com' },
  { id: 'letterboxd', name: 'Letterboxd', domains: ['letterboxd.com'], category: 'social', deleteAccountUrl: 'https://letterboxd.com/settings/', privacyContact: 'support@letterboxd.com' },

  // ─── Grande distribution FR ──────────────────────────────────────────
  { id: 'carrefour', name: 'Carrefour', domains: ['carrefour.fr'], category: 'ecommerce', deleteAccountUrl: 'https://www.carrefour.fr/donnees-personnelles', privacyContact: 'dpo@carrefour.com' },
  { id: 'auchan', name: 'Auchan', domains: ['auchan.fr'], category: 'ecommerce', deleteAccountUrl: 'https://www.auchan.fr/donnees-personnelles', privacyContact: 'dpo@auchan.fr' },
  { id: 'leclerc', name: 'E.Leclerc', domains: ['leclerc.fr', 'e.leclerc'], category: 'ecommerce', deleteAccountUrl: 'https://www.leclercdrive.fr/aide', privacyContact: 'dpo@e-leclerc.com' },
];

const DOMAIN_INDEX = new Map<string, CuratedService>();
for (const service of CURATED_SERVICES) {
  for (const d of service.domains) DOMAIN_INDEX.set(d.toLowerCase(), service);
}

export function findServiceByDomain(domain: string): CuratedService | null {
  const d = domain.toLowerCase();
  const direct = DOMAIN_INDEX.get(d);
  if (direct) return direct;
  for (const [key, service] of DOMAIN_INDEX) {
    if (d.endsWith('.' + key) || d === key) return service;
  }
  return null;
}
