const Link = require('./Link.js');
const isImageURL = require('image-url-validator').default;

// sprawdza czy string jest linkiem do zdjęcia
async function sprawdz(string) {
    if (string == null) return null;
    // sprawdza czy link jest poprawny
    if (Link.sprawdz(string) != null) {
        // sprawdza czy link jest zdjęciem
        let url = await isImageURL(string) ? string : null;
        return url;
    }
    // zwraca null jeśli link nie jest zdjęciem
    return null;
}

// eksportuje funkcje
module.exports = { sprawdz };