const Logger = require('../Logger.js');
const path = require('path');
// Sprawdzanie czy link jest poprawny jeśli tak zwraca go, jeśli nie zwraca null
function sprawdz(link){
    try {
        if (link == null){
            //NOTE - Logger done
            Logger.log(null, `Link "${link}" jest null'em `, `${path.dirname}/${path.basename}`);
            return null;
        }
        // REVIEW możliwie coś poknociłem z sprawdzeniem linku !!! (chyba new URL(link) powinien być w if'ie)!!!
        new URL(link);
        //NOTE - Logger done
        Logger.log(null, `Link "${link}" jest poprawny`, `${path.dirname}/${path.basename}`);
        return link;
    } catch (error) {
        //NOTE - Logger done
        Logger.log(null, `Error przy sprawdzaniu linku "${link}" - ${error}`, `${path.dirname}/${path.basename}`);
        return null;
    }
}

// eksportuje funkcje
module.exports = { sprawdz };