module.exports = class Uzytkownik {
    constructor(id, nazwa, avatarUrl, watekId) {
        this.id = id;
        this.nazwa = nazwa;
        this.avatarUrl = avatarUrl;
        this.watekId = watekId;
    }
    wyswietl(){
        return `id = "${this.id}", nazwa = "${this.nazwa}", avatarUrl = "${this.avatarUrl}", watekId = "${this.watekId}"`;
    }
};