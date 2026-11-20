// fonts.mjs: font pairing options for the owner's review (/lab/fonts/ and ?font=<id> on any page).
// The live site uses Futura (body text, hours), Inknut Antiqua (a heading), EB Garamond (the age check) and a logo
// set in a Western display face with Roman "PREMIUM" caps. Open stand-ins: Jost for Futura, Rye / Sancreek for the
// logo's Western letters, Cinzel for the Roman caps. All SIL Open Font License (Google Fonts).
export const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&family=Figtree:wght@300..800&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Jost:ital,wght@0,300..800;1,300..700&family=Rye&family=Sancreek&family=Cinzel:wght@400..900&family=Inknut+Antiqua:wght@400;600;700;800&display=swap';
export const FONT_OPTIONS = [
  { id: 'live', name: 'A · Live site match', fonts: 'EB Garamond + Jost', why: 'The two faces the live site already speaks: EB Garamond (the age check) for headings, Jost as the open stand-in for the Futura used in all the body text and hours.' },
  { id: 'logo', name: 'B · Logo match', fonts: 'Rye + Cinzel + Jost', why: 'Rye echoes the Western, spurred letters of HUMBOLDT’S; Cinzel echoes the Roman caps of PREMIUM for small labels and buttons; Jost (Futura) for reading.' },
  { id: 'inknut', name: 'C · Inknut headlines', fonts: 'Inknut Antiqua + EB Garamond + Jost', why: 'The heavy old-style serif from the live Arcata Home heading, with EB Garamond italic for the accent word and Jost (Futura) for body text.' },
  { id: 'caps', name: 'D · Premium caps (chosen, now the site default)', fonts: 'Cinzel + EB Garamond + Jost', why: 'Headlines in Roman capitals like the PREMIUM line of the logo, EB Garamond for reading, Jost for buttons and labels.' },
  { id: 'western', name: 'E · Western + Garamond', fonts: 'Sancreek + EB Garamond + Cinzel', why: 'A taller, narrower Western display face close to the logo wordmark, with EB Garamond for reading and Cinzel caps for labels: the most "sign on the building" option.' },
  { id: 'current', name: 'F · First build', fonts: 'Fraunces + Figtree', why: 'What the first preview used: a soft lodge serif and a clean sans. Not from the client’s own fonts.' },
];
