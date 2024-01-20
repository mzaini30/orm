export class Orm {
    constructor(database) {
        this.database = database;
    }

    insert(table, dataBaru) {
        this.database[table].push({
            id: Date.now(),
            ...dataBaru
        });
        return this;
    }

    update(table, id, dataBaru) {
        const index = this.database[table].findIndex((d) => d.id === id);
        if (index !== -1) {
            this.database[table][index] = {
                ...this.database[table][index],
                ...dataBaru
            };
        }
        return this;
    }

    done() {
        return this.database;
    }

}