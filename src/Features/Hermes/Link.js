const Logger = require('../Logger.js');
// Sprawdzanie czy link jest poprawny jeśli tak zwraca go, jeśli nie zwraca null
function sprawdz(link){
    try {
        if (link == null){
            //NOTE - Logger done
            Logger.log(null, `Link "${link}" jest null'em `, __filename);
            return null;
        }
        link = encodeURI(link);
        // REVIEW możliwie coś poknociłem z sprawdzeniem linku !!! (chyba new URL(link) powinien być w if'ie)!!!
        if (sprawdzLink(link))
        {
            //NOTE - Logger done
            Logger.log(null, `Link "${link}" jest poprawny`, __filename);
            return link;
        }
        else
        {
            //NOTE - Logger done
            Logger.log(null, `Link "${link}" jest niepoprawny`, __filename);
            console.log(`Link jest niepoprawny: ${link}`);
            return null;
        }
    } catch (error) {
        //NOTE - Logger done
        Logger.log(null, `Error przy sprawdzaniu linku "${link}" - ${error}`, __filename);
        return null;
    }
}

function sprawdzLink(link){
    var request = new XMLHttpRequest();  
    request.open('GET', link, true);
    request.onreadystatechange = function(){
    if (request.readyState === 4){
        if (request.status === 404) {  
            return false;
        }  
    }
    return true;
};
request.send();
}


// eksportuje funkcje
module.exports = { sprawdz };