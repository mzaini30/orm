export class Orm {
    constructor(table) {
        this.table = table;
        // init array kosong
        this._data = [];
        // ambil dari localStorage
        if (localStorage.getItem(this.table) !== null) {
            this._data = JSON.parse(localStorage.getItem(this.table));
        }
    }

    insert(data) {
        this._data.push(data);
    }

    do() {
        // simpan ke localStorage
        localStorage.setItem(this.table, JSON.stringify(this._data));
    }
}