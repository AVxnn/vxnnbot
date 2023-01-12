function translit(word){
  let answer = '';
  let converter = {
    'q': 'ц',    'i': 'ш',    'd': 'в',    ';': 'ж',    'b': 'и',
    'w': 'ц',    'o': 'щ',    'f': 'а',   '\'': 'э',    'n': 'т',
    'e': 'у',    'p': 'з',    'g': 'п',    'z': 'я',    'm': 'ь',
    'r': 'к',    '[': 'х',    'h': 'р',    'x': 'ч',    ',': 'б',
    't': 'е',    ']': 'ъ',    'j': 'о',    'c': 'с',    '.': 'ю',
    'y': 'н',   'a': 'ф',  'k': 'л',     'v': 'м',    '/': '.',
    'u': 'г',    's': 'ы',   'l': 'д',
  };

  for (let i = 0; i < word.length; ++i ) {
    if (converter[word[i]] == undefined){
      answer += word[i].toLowerCase();
    } else {
      answer += converter[word[i]];
    }
  }

  return answer;
}

module.exports = translit