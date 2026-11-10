// Neighbouring states (approximate adjacency; the first 4-5 are shown on state pages).
export const STATE_NEIGHBORS: Record<string, string[]> = {
  "al": [
    "fl",
    "ga",
    "ms",
    "tn"
  ],
  "ak": [
    "wa",
    "or",
    "ca",
    "hi"
  ],
  "az": [
    "ca",
    "nm",
    "nv",
    "ut"
  ],
  "ar": [
    "mo",
    "ms",
    "la",
    "tn"
  ],
  "ca": [
    "or",
    "nv",
    "az"
  ],
  "co": [
    "wy",
    "ne",
    "ks",
    "ok"
  ],
  "ct": [
    "ny",
    "ma",
    "ri"
  ],
  "de": [
    "md",
    "pa",
    "nj"
  ],
  "dc": [
    "md",
    "va"
  ],
  "fl": [
    "ga",
    "al"
  ],
  "ga": [
    "fl",
    "al",
    "tn",
    "nc"
  ],
  "hi": [
    "ca",
    "wa"
  ],
  "id": [
    "mt",
    "wy",
    "ut",
    "nv"
  ],
  "il": [
    "wi",
    "ia",
    "mo",
    "ky"
  ],
  "in": [
    "il",
    "ky",
    "oh",
    "mi"
  ],
  "ia": [
    "mn",
    "wi",
    "il",
    "mo"
  ],
  "ks": [
    "ne",
    "mo",
    "ok",
    "co"
  ],
  "ky": [
    "il",
    "in",
    "oh",
    "wv"
  ],
  "la": [
    "tx",
    "ms",
    "ar"
  ],
  "me": [
    "nh",
    "vt"
  ],
  "md": [
    "va",
    "wv",
    "pa",
    "de"
  ],
  "ma": [
    "ct",
    "ri",
    "ny",
    "nh"
  ],
  "mi": [
    "oh",
    "in",
    "wi"
  ],
  "mn": [
    "wi",
    "ia",
    "sd",
    "nd"
  ],
  "ms": [
    "la",
    "ar",
    "tn",
    "al"
  ],
  "mo": [
    "ia",
    "il",
    "ky",
    "tn"
  ],
  "mt": [
    "id",
    "wy",
    "sd",
    "nd"
  ],
  "ne": [
    "sd",
    "ia",
    "mo",
    "ks"
  ],
  "nv": [
    "ca",
    "or",
    "id",
    "ut"
  ],
  "nh": [
    "me",
    "vt",
    "ma"
  ],
  "nj": [
    "ny",
    "pa",
    "de"
  ],
  "nm": [
    "az",
    "co",
    "ok",
    "tx"
  ],
  "ny": [
    "nj",
    "pa",
    "ct",
    "ma"
  ],
  "nc": [
    "va",
    "tn",
    "ga",
    "sc"
  ],
  "nd": [
    "mt",
    "sd",
    "mn"
  ],
  "oh": [
    "mi",
    "in",
    "ky",
    "wv"
  ],
  "ok": [
    "ks",
    "mo",
    "ar",
    "tx"
  ],
  "or": [
    "wa",
    "id",
    "nv"
  ],
  "pa": [
    "ny",
    "nj",
    "de",
    "md"
  ],
  "ri": [
    "ct",
    "ma"
  ],
  "sc": [
    "nc",
    "ga"
  ],
  "sd": [
    "nd",
    "mn",
    "ia",
    "ne"
  ],
  "tn": [
    "ky",
    "va",
    "nc",
    "ga"
  ],
  "tx": [
    "nm",
    "ok",
    "ar",
    "la"
  ],
  "ut": [
    "id",
    "wy",
    "co",
    "az"
  ],
  "vt": [
    "ny",
    "nh",
    "ma"
  ],
  "va": [
    "md",
    "wv",
    "ky",
    "tn"
  ],
  "wa": [
    "id",
    "or"
  ],
  "wv": [
    "oh",
    "pa",
    "md",
    "va"
  ],
  "wi": [
    "mi",
    "mn",
    "ia",
    "il"
  ],
  "wy": [
    "mt",
    "sd",
    "ne",
    "co"
  ]
};

export function neighborStates(code: string, max = 5): string[] {
  return (STATE_NEIGHBORS[code] ?? []).slice(0, max);
}
