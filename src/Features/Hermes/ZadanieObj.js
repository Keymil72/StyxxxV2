// eksportuje klasę Zadanie, która jest obiektem, który zawiera wszystkie informacje o zadaniu
module.exports = class Zadanie {
    constructor(id, nazwa, kolor, termin, opis, link, zdjecie, czyAktywne, fk_uzytkownikId) {
        this.id = id;
        this.nazwa = nazwa;
        this.kolor = kolor;
        this.termin = termin;
        this.opis = opis;
        this.link = link;
        this.zdjecie = zdjecie;
        this.czyAktywne = czyAktywne;
        this.fk_uzytkownikId = fk_uzytkownikId;
    }
    wyswietl(){
        return `id = "${this.id}", nazwa = "${this.nazwa}", kolor = "${this.kolor}", termin = "${this.termin}, opis = "${this.opis}, link = "${this.link}", zdjecie = "${this.zdjecie}", czyAktywne = "${this.czyAktywne}", fk_uzytkownikId = "${this.fk_uzytkownikId}"`;
    }
}