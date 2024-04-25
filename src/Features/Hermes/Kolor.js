const Logger = require('../Logger.js');

let dozwoloneKolory = [
    '#000000',
    '#1ABC9C',
    '#11806A',
    '#57F287',
    '#1F8B4C',
    '#3498DB',
    '#206694',
    '#9B59B6',
    '#71368A',
    '#AD1457',
    '#F1C40F',
    '#C27C0E',
    '#E74C3C',
    '#992D22',
    '#95A5A6',
    '#979C9F',
    '#7F8C8D',
    '#BCC0C0',
    '#34495E',
    '#2C3E50',
    '#F9E79F',
    '#FFFFFF',
    '#99AAB5',
    '#5865F2',
    '#EB459E'
];
let bazowyKolor = '#000000'; 

// Funkcja sprawdz sprawdza czy kolor znajduje się w tablicy dozwolonych kolorów, jeśli tak zwraca go, jeśli nie zwraca bazowy kolor
function sprawdz(kolor){
    if (dozwoloneKolory.includes(kolor))
    {
        //NOTE - Logger
        Logger.log(null, `Kolor ${kolor} znajduje się na liście obsługiwanych kolorów`, 'dev Kolor.sprawdz');
        return kolor;
    }
    //NOTE - Logger
    Logger.log(null, `Kolor ${kolor} nie znajduje się na liście obsługiwanych kolorów, zwracam kolor bazowy ${bazowyKolor}`, 'dev Kolor.sprawdz');
    return bazowyKolor;
}

// eksportuje funkcje
module.exports = { sprawdz };