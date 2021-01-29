const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  textChecker(text) {
    if (text == null) return { error: 'Required field(s) missing' };
    if (!text || text.trim() == '') return { error: 'No text to translate' };
    return true;
  };

  localeChecker(locale) {
    if (!locale) return { error: 'Required field(s) missing' };
    if (locale != 'american-to-british' && locale != 'british-to-american') return { error: 'Invalid value for locale field' };
    return true;
  };

  americanToBritish(text) {
    let translated = text;
    for (const prop in americanOnly) {
      const regex = new RegExp('\\b' + prop + '\\b','gi');
      if (translated.match(regex)) {
        const britishProp = '<span class="highlight">' + americanOnly[prop] + '</span>';
        translated = translated.replace(regex, britishProp);
      };
    };

    for (const prop in americanToBritishSpelling) {
      const regex = new RegExp('\\b' + prop + '\\b','gi');
      if (translated.match(regex)) {
        const britishSpelling = '<span class="highlight">' + americanToBritishSpelling[prop] + '</span>';
        translated = translated.replace(regex, britishSpelling);
      };
    };

    for (const prop in americanToBritishTitles) {
      const regex = new RegExp(`(?<=^|[.'"\\s])${prop}(?=[.'"\\s]|$)`, 'gi');
      if (translated.match(regex)) {
        let capTitle = americanToBritishTitles[prop].charAt(0).toUpperCase() + americanToBritishTitles[prop].slice(1);
        const britishTitles = '<span class="highlight">' + capTitle + '</span>';
        translated = translated.replace(regex, britishTitles);
      };
    };

    const clockRegex = new RegExp(`(\\d{1,2}):(\\d{1,2})`, 'g');
    translated = translated.replace(clockRegex, `<span class="highlight">$1.$2</span>`);

    return translated;
  };

  britishToAmerican(text) {
    const americanSpelling = Object.keys(americanToBritishSpelling);
    const britishSpelling = Object.values(americanToBritishSpelling);
    const americanTitles = Object.keys(americanToBritishTitles);
    const britishTitles = Object.values(americanToBritishTitles);
    let translated = text;

    for (const prop in britishOnly) {
      const regex = new RegExp(`(?<=^|[.'"\\s])${prop}(?=[.'"\\s]|$)`, 'gi');
      if (translated.match(regex)) {
        const americanProp = '<span class="highlight">' + britishOnly[prop] + '</span>';
        translated = translated.replace(regex, americanProp);
      };
    };

    for (var i = 0; i < britishSpelling.length; i++) {
      const regex = new RegExp('\\b' + britishSpelling[i] + '\\b','gi');
      if (translated.match(regex)) {
        const americanSpellChange = '<span class="highlight">' + americanSpelling[i] + '</span>';
        translated = translated.replace(regex, americanSpellChange);
      };
    };

    for (var i = 0; i < britishTitles.length; i++) {
      const regex = new RegExp('\\b' + britishTitles[i] + '\\b','gi');
      if (translated.match(regex)) {
        let capTitle = americanTitles[i].charAt(0).toUpperCase() + americanTitles[i].slice(1);
        const americanTitleChange = '<span class="highlight">' + capTitle + '</span>';
        translated = translated.replace(regex, americanTitleChange);
      };
    };

    const clockRegex = new RegExp(`(\\d{1,2}).(\\d{1,2})`, 'g');
    translated = translated.replace(clockRegex, `<span class="highlight">$1:$2</span>`);

    return translated;
  };

  translator(locale, text) {
    let translation;
    const original = text;

    if (this.textChecker(text).error) return { error: this.textChecker(text).error };
    if (this.localeChecker(locale).error) return { error: this.localeChecker(locale).error };
 
    if (locale == 'american-to-british') {
      translation = this.americanToBritish(text);
    } else if (locale == 'british-to-american') {
      translation = this.britishToAmerican(text);
    };

    if (translation === text) {
      return { translation: 'Everything looks good to me!', text: original };
    } else {
      return { translation: translation, text: original };
    };
  };

};

module.exports = Translator;