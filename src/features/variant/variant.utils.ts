const pluralizeWord = (word: string) => {
  if (/s$/i.test(word)) return word;
  if (/ão$/i.test(word)) return word.replace(/ão$/i, (m) => (m === "ÃO" ? "ÕES" : "ões"));
  if (/ao$/i.test(word)) return word.replace(/ao$/i, (m) => (m === "AO" ? "OES" : "oes"));
  if (/m$/i.test(word)) return word.replace(/m$/i, (m) => (m === "M" ? "NS" : "ns"));
  if (/[aeou]l$/i.test(word)) return word.replace(/l$/i, (m) => (m === "L" ? "IS" : "is"));
  if (/[rz]$/i.test(word)) return `${word}es`;
  return `${word}s`;
};

export const pluralizeVariantName = (name: string) => {
  const trimmed = name.trim();
  const prepositionalPhrase = trimmed.match(
    /^(\S+)(\s+(?:de|da|do|das|dos|em|na|no|nas|nos|por|para|com|sem)\b.*)$/i
  );
  if (prepositionalPhrase) {
    return `${pluralizeWord(prepositionalPhrase[1])}${prepositionalPhrase[2]}`;
  }

  const match = trimmed.match(/^(.*?)(\S+)$/);
  if (!match) return trimmed;
  return `${match[1]}${pluralizeWord(match[2])}`;
};
