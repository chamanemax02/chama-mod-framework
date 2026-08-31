/**
 * JID utility helpers
 */
export function isJidGroup(jid) {
    return jid.endsWith('@g.us');
}
export function isJidUser(jid) {
    return jid.endsWith('@s.whatsapp.net') || jid.endsWith('@c.us');
}
export function isJidNewsletter(jid) {
    return jid.endsWith('@newsletter');
}
export function formatToUserJid(input) {
    if (input.includes('@')) {
        return input;
    }
    const clean = input.replace(/\D/g, '');
    return `${clean}@s.whatsapp.net`;
}
export function formatToGroupJid(input) {
    if (input.includes('@g.us'))
        return input;
    return `${input}@g.us`;
}
export function getPhoneNumberFromJid(jid) {
    return jid.split('@')[0].split(':')[0];
}
//# sourceMappingURL=jid.js.map