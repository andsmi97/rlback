const XlsxPopulate = require('xlsx-populate');
const { numberToRussianString } = require('./sumText.js');
const format = require('date-fns/format');

const locales = { ru: require('date-fns/locale/ru') };

console.log();
const createBill = (
  billDate,
  name,
  contract,
  dayValue,
  nightValue,
  dayTarrif,
  nightTarrif,
  houseNumber,
  postIndex,
  address,
  dayCounterWithHighVoltageLoss,
  nightCounterWithHighVoltageLoss,
  totalDayPrice,
  totalNightPrice,
  totalPrice,
  comission,
  totalPriceWithComission
) => {
  // Load an existing workbook
  const billDateObject = new Date(billDate);
  const fileName = `${houseNumber}_участок_cчет_за_${billDateObject
    .toLocaleDateString('en-Gb')
    .replace(/\//g, '-')}.xlsx`;
  XlsxPopulate.fromFileAsync('./Bills/##BillTemplate.xlsx').then(workbook => {
    // Modify the workbook.
    const totalPriceString = numberToRussianString(totalPrice);
    const comissionString = numberToRussianString(comission);
    const totalPriceWithComissionString = numberToRussianString(
      totalPriceWithComission
    );
    const excelFormatDate = `${billDateObject.getDate()}.${billDateObject.getMonth() +
      1}.${billDateObject.getFullYear()}`;
    const sheet1 = workbook.sheet('Отчет комитента');
    sheet1.cell('K2').value(billDateObject.getMonth() + 1);
    sheet1.cell('O2').value(
      format(
        billDateObject,
        'DD MMMM YYYY г.',
        { locale: locales.ru } // Pass the locale as an option
      )
    );
    // .style('numberFormat', 'dddd, mmmm dd, yyyy');
    sheet1.cell('F4').value(name);
    sheet1.cell('P4').value(contract);
    sheet1.cell('AA11').value(dayCounterWithHighVoltageLoss);
    sheet1.cell('AA12').value(nightCounterWithHighVoltageLoss);
    sheet1.cell('AF11').value(dayTarrif);
    sheet1.cell('AF12').value(nightTarrif);
    sheet1.cell('AA22').value(name);
    sheet1.cell('AI11').value(totalDayPrice);
    sheet1.cell('AI12').value(totalNightPrice);
    sheet1.cell('AI13').value(totalPrice);
    sheet1.cell('B18').value(totalPriceString);
    sheet1.cell('Q19').value(comission);
    sheet1.cell('T19').value(comissionString);
    sheet1.cell('O11').value(
      format(
        billDateObject,
        'MMMM YYYY',
        { locale: locales.ru } // Pass the locale as an option
      )
    );
    sheet1.cell('O12').value(
      format(
        billDateObject,
        'MMMM YYYY',
        { locale: locales.ru } // Pass the locale as an option
      )
    );

    const sheet2 = workbook.sheet('Счет');
    sheet2.cell('M10').value(12);

    sheet2.cell('Q10').value(
      format(
        new Date(billDate),
        'DD MMMM YYYY г.',
        { locale: locales.ru } // Pass the locale as an option
      )
    );
    // .style('numberFormat', 'dddd, mmmm dd, yyyy');
    sheet2
      .cell('G17')
      .value(`Уч-${houseNumber} ${name}, ${postIndex}, ${address}`);
    sheet2.cell('G20').value(contract);
    sheet2.cell('AJ25').value(totalPriceWithComission);
    sheet2.cell('B29').value(totalPriceWithComissionString);
    sheet2.cell('M10').value(billDateObject.getMonth() + 1);
    sheet2.cell('O23').value(
      format(
        billDateObject,
        'MMMM YYYY',
        { locale: locales.ru } // Pass the locale as an option
      )
    );
    sheet2.cell('O24').value(
      format(
        billDateObject,
        'MMMM YYYY',
        { locale: locales.ru } // Pass the locale as an option
      )
    );
    console.log(fileName);
    return workbook.toFileAsync(`./Bills/${fileName}`);
  });
  return fileName;
};

module.exports = {
  createBill,
};
