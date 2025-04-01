export const normalizeName = (str: string) => {
  const map = {
    // Hungarian
    ö: 'o',
    ü: 'u',
    ó: 'o',
    ő: 'o',
    ú: 'u',
    ű: 'u',
    é: 'e',
    á: 'a',
    í: 'i',

    // German
    ä: 'a',
    ß: 'ss',

    // French / Portuguese / Spanish / Italian / Polish / Czech / Romanian / Nordic etc.
    à: 'a',
    â: 'a',
    ã: 'a',
    å: 'a',
    ç: 'c',
    è: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    î: 'i',
    ï: 'i',
    ñ: 'n',
    ò: 'o',
    ô: 'o',
    õ: 'o',
    ù: 'u',
    û: 'u',
    ý: 'y',
    ÿ: 'y',

    // Polish
    ł: 'l',
    ń: 'n',
    ś: 's',
    ź: 'z',
    ż: 'z',

    // Czech / Slovak
    č: 'c',
    ď: 'd',
    ě: 'e',
    ň: 'n',
    ř: 'r',
    š: 's',
    ť: 't',
    ž: 'z',

    // Scandinavian
    æ: 'ae',
    ø: 'o',
  } as Record<string, string>;

  return str
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};
