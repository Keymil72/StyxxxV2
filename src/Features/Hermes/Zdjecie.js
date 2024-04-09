const Link = require('./Link.js');

// sprawdza czy string jest linkiem do zdjęcia
function sprawdz(string) {
    if (string == null) return null;
    // sprawdza czy link jest poprawny
    if (Link.sprawdz(string) != null) {
        // sprawdza czy link jest zdjęciem
        let url = (string.match(/\.(jpeg|jpg|gif|png)$/) != null) ? string : null;
        return url;
    }
    // zwraca null jeśli link nie jest zdjęciem
    return null;
}

// eksportuje funkcje
module.exports = { sprawdz };