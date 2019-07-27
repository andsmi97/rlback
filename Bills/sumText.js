const numberToRussianString = number => {
  const arrNumbers = [
    [
      '',
      'один',
      'два',
      'три',
      'четыре',
      'пять',
      'шесть',
      'семь',
      'восемь',
      'девять',
      'десять',
      'одиннадцать',
      'двенадцать',
      'тринадцать',
      'четырнадцать',
      'пятнадцать',
      'шестнадцать',
      'семнадцать',
      'восемнадцать',
      'девятнадцать',
    ],
    [
      '',
      '',
      'двадцать',
      'тридцать',
      'сорок',
      'пятьдесят',
      'шестьдесят',
      'семьдесят',
      'восемьдесят',
      'девяносто',
    ],
    [
      '',
      'сто',
      'двести',
      'триста',
      'четыреста',
      'пятьсот',
      'шестьсот',
      'семьсот',
      'восемьсот',
      'девятьсот',
    ],
  ];

  const numberParser = (num, desc) => {
    let string = '';
    let numHundred = '';
    if (num.length === 3) {
      numHundred = num.substr(0, 1);
      num = num.substr(1, 3);
      string = arrNumbers[2][numHundred] + ' ';
    }
    if (num < 20) {
      string += arrNumbers[0][parseFloat(num)] + ' ';
    } else {
      const firstNum = num.substr(0, 1);
      const secondNum = num.substr(1, 2);
      string += arrNumbers[1][firstNum] + ' ' + arrNumbers[0][secondNum] + ' ';
    }

    const lastNum = parseFloat(num.substr(-1));
    const preLastNum =
      num.length === 1 ? 0 : parseFloat(num.substr(-2).split('')[0]);
    switch (desc) {
      //tens
      case 0:
        if (lastNum === 1 && 1 !== preLastNum) {
          //1, 21, 31, 41, 51, 61, 71, 81, 91
          string += 'рубль';
        } else if (lastNum > 1 && lastNum < 5 && 1 !== preLastNum) {
          //2-4, 22-24, 32-34, 42-44, 52-54, 62-64, 72-74, 82-84, 92-94
          string += 'рубля';
        } else {
          //0, 5-20, 25-30, 35-40, 45-50, 55-60, 65-70, 75-80, 85-90, 95-99
          string += 'рублей';
        }
        break;
      //thousands
      case 1:
        if (lastNum === 1 && 1 !== preLastNum) {
          //1, 21 , 31, 41, 51, 61, 71, 81, 91
          string += 'тысяча ';
        } else if (lastNum > 1 && lastNum < 5 && 1 !== preLastNum) {
          //2-4, 22-24, 32-34, 42-44, 52-54, 62-64, 72-74, 82-84, 92-94
          string += 'тысячи ';
        } else {
          //5-20, 25-30, 35-40, 45-50, 55-60, 65-70, 75-80, 85-90, 95-99
          string += 'тысяч ';
        }
        string = string.replace('один ', 'одна ');
        string = string.replace('два ', 'две ');
        break;
      //millions
      case 2:
        if (lastNum === 1 && 1 !== preLastNum) {
          //1, 21, 31, 41, 51, 61, 71, 81, 91
          string += 'миллион ';
        } else if (lastNum > 1 && lastNum < 5 && 1 !== preLastNum) {
          //2-4, 22-24, 32-34, 42-44, 52-54, 62-64, 72-74, 82-84, 92-94
          string += 'миллиона ';
        } else {
          //5-20, 25-30, 35-40, 45-50, 55-60, 65-70, 75-80, 85-90, 95-99
          string += 'миллионов ';
        }
        break;
      //billions
      case 3:
        if (lastNum === 1 && 1 !== preLastNum) {
          //1, 21, 31, 41, 51, 61, 71, 81, 91
          string += 'миллиард ';
        } else if (lastNum > 1 && lastNum < 5 && 1 !== preLastNum) {
          //2-4, 22-24, 32-34, 42-44, 52-54, 62-64, 72-74, 82-84, 92-94
          string += 'миллиарда ';
        } else {
          //5-20, 25-30, 35-40, 45-50, 55-60, 65-70, 75-80, 85-90, 95-99
          string += 'миллиардов ';
        }
        break;
    }
    return string;
  };

  const decimalsParser = num => {
    const firstNum = num.substr(0, 1);
    const secondNum = parseFloat(num.substr(1, 2));
    let string = ' ' + firstNum + secondNum;
    if (secondNum === 1 && 1 !== firstNum) {
      string += ' копейка';
    } else if (secondNum > 1 && secondNum < 5 && 1 !== firstNum) {
      string += ' копейки';
    } else {
      string += ' копеек';
    }
    return string;
  };

  if (!number || number === 0) {
    return 'Ноль рублей';
  }

  if (typeof number !== 'number') {
    number = number.replace(',', '.');
    number = parseFloat(number);
    if (isNaN(number)) return 'Ноль рублей';
  }

  number = number.toFixed(2);
  let numberDecimals = '';
  if (number.indexOf('.') != -1) {
    const numberArr = number.split('.');
    number = numberArr[0];
    numberDecimals = numberArr[1];
  }

  let string = '';
  let numParser = '';
  let count = 0;

  for (let p = number.length - 1; p >= 0; p--) {
    const numDigit = number.substr(p, 1);
    numParser = numDigit + numParser;
    if ((numParser.length === 3 || p === 0) && !isNaN(parseFloat(numParser))) {
      string = numberParser(numParser, count) + string;
      numParser = '';
      count++;
    }
  }
  //use case for 0.50 or 0.05...
  if (number == '0') {
    string = 'Ноль рублей ';
  }
  if (numberDecimals) {
    string += decimalsParser(numberDecimals);
  }

  string = string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
  string = string.replace(new RegExp('  ', 'g'), ' ');
  return string;
};

module.exports = {
  numberToRussianString,
};
