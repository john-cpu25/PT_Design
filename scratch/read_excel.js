const XLSX = require('xlsx');
const path = require('path');
const file = 'c:\\\\Users\\\\Nhan\\\\OneDrive - Rincovitch\\\\00. Nhan\\\\CSharp\\\\DESIGN\\\\251009_PS Check - Rev01.xlsx';
try {
    const workbook = XLSX.readFile(file);
    const result = {};
    for (let sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        result[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    }
    console.log(JSON.stringify(result, null, 2));
} catch(e) {
    console.error(e.message);
}
