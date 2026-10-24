/**
 * Les routes de l'app sont sous /api/athlete (index.js du serveur) : le préfixe est ajouté
 * s'il manque, pour qu'une URL saisie sans lui (http://IP:3000) fonctionne quand même.
 */
export function normaliserApiUrl(brute: string | undefined): string {
  const url = (brute ?? '').trim().replace(/\/+$/, '');
  if (!url || url.endsWith('/api/athlete')) return url;
  return url.endsWith('/api') ? `${url}/athlete` : `${url}/api/athlete`;
}

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

/** Adresse du réseau local (ou de la machine elle-même) : 192.168.x.x, 10.x.x.x, 172.16-31.x.x, localhost. */
function estAdresseLocale(hote: string): boolean {
  if (hote === 'localhost' || hote.startsWith('127.')) return true;
  if (!IPV4.test(hote)) return false;
  const [a, b] = hote.split('.').map(Number);
  return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

/**
 * En développement, le serveur tourne sur le même PC que Metro. Si l'URL du .env pointe vers
 * une adresse locale, on la remplace par l'adresse du PC vue par Expo (`hostUri`, ex. « 192.168.1.115:8081 ») :
 * l'app suit le PC quand son IP change. Une URL publique (https://…) ou un tunnel Expo ne sont pas touchés.
 */
export function adapterAuPc(url: string, hostUri: string | undefined): string {
  const hotePc = hostUri?.split(':')[0];
  if (!url || !hotePc || !IPV4.test(hotePc)) return url;
  // Pas de `new URL` : la version de React Native est partielle.
  const morceaux = url.match(/^(https?:\/\/)([^:/?#]+)(.*)$/);
  if (!morceaux) return url;
  const [, protocole, hote, suite] = morceaux;
  if (!estAdresseLocale(hote) || hote === hotePc) return url;
  return `${protocole}${hotePc}${suite}`;
}
