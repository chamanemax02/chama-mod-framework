/**
 * JID utility helpers
 */

export function isJidGroup(jid: string): boolean {
  return jid.endsWith('@g.us');
}

export function isJidUser(jid: string): boolean {
  return jid.endsWith('@s.whatsapp.net') || jid.endsWith('@c.us');
}

export function isJidNewsletter(jid: string): boolean {
  return jid.endsWith('@newsletter');
}

export function formatToUserJid(input: string): string {
  if (input.includes('@')) {
    return input;
  }
  const clean = input.replace(/\D/g, '');
  return `${clean}@s.whatsapp.net`;
}

export function formatToGroupJid(input: string): string {
  if (input.includes('@g.us')) return input;
  return `${input}@g.us`;
}

export function getPhoneNumberFromJid(jid: string): string {
  return jid.split('@')[0].split(':')[0];
}
