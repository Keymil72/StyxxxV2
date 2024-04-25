const Logger = require('../Logger.js');
// Sprawdzanie czy link jest poprawny jeśli tak zwraca go, jeśli nie zwraca null
function sprawdz(link){
    try {
        if (link == null){
            //NOTE - Logger
            Logger.log(null, `Link "${link}" jest null'em `, 'dev Link.sprawdz');
            return null;
        }
        // REVIEW możliwie coś poknociłem z sprawdzeniem linku !!! (chyba new URL(link) powinien być w if'ie)!!!
        new URL(link);
        //NOTE - Logger
        Logger.log(null, `Link "${link}" jest poprawny`, 'dev Link.sprawdz');
        return link;
    } catch (error) {
        //NOTE - Logger
        Logger.log(null, `Error przy sprawdzaniu linku "${link}" - ${error}`, 'dev Link.sprawdz');
        return null;
    }
}

// eksportuje funkcje
module.exports = { sprawdz };