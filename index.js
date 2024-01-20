import { buatId } from "./fungsi-tambahan.js";

export class Orm {
    constructor(database) {
        this.database = database;
    }

    insert(table, dataBaru) {

        if (!this.database[table]) {
            this.database[table] = [];
        }
        if (Array.isArray(dataBaru)) {
            dataBaru.forEach((d) => {
                this.database[table].push({
                    id: buatId(),
                    ...d
                });
            });
            return this;
        }
        this.database[table].push({
            id: buatId(),
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

    delete(table, id) {
        const index = this.database[table].findIndex((d) => d.id === id);
        if (index !== -1) {
            this.database[table].splice(index, 1);
        }
        return this;
    }

    cari(table, kataKunci) {
        // fitur untuk mencari data seperti LIKE %kataKunci% kalau di SQL
        const filteredData = this.database[table].filter((d) => {
            for (const key in d) {
                if (d[key].toString().toLowerCase().includes(kataKunci.toLowerCase())) {
                    return true;
                }
            }
            return false;
        });

        // Membuat instance baru dari Orm dengan database yang telah difilter
        const newOrmInstance = new Orm({ ...this.database, [table]: filteredData });

        return newOrmInstance;
    }

    where(table, data) {
        // contoh dari data adalah { id: 1 }. Jadi, dia mendapatkan record mana aja dari table, yang memiliki data {id: 1}
        const filteredData = this.database[table].filter((d) => {
            for (const key in data) {
                if (d[key] !== data[key]) {
                    return false;
                }
            }
            return true;
        });
        const newOrmInstance = new Orm({ ...this.database, [table]: filteredData });

        return newOrmInstance;
    }

    distinct(table, kolom) {
        const distinctData = this.database[table].reduce((acc, curr) => {
            if (!acc.includes(curr[kolom])) {
                acc.push(curr[kolom]);
            }
            return acc;
        }, []);
        const newOrmInstance = new Orm({ ...this.database, [table]: distinctData });
        return newOrmInstance;
    }

    with(table1, tables) {
        const joinData = this.database[table1].map((d1) => {
            const joinedTablesData = {};

            tables.forEach((table) => {
                const foreignKey = `${table}Id`;  // Menghapus .toLowerCase()
                // Mencari data di tabel terkait dengan memeriksa kesesuaian foreign key
                const relatedData = this.database[table].filter((d2) => d1.id === d2[`${table1}Id`]);

                // Menambahkan data terkait ke objek hasil join jika ada kesesuaian
                if (relatedData.length > 0) {
                    joinedTablesData[table] = relatedData;
                }
            });

            return {
                ...d1,
                ...joinedTablesData
            };
        });

        const newOrmInstance = new Orm({ ...this.database, [table1]: joinData });
        return newOrmInstance;
    }

    pivot(table1, table2) {
        const pivotData = this.database[table1].reduce((result, record1) => {
            const pivotTable = `${table1}_${table2}`; // Nama tabel pivot dihasilkan secara dinamis

            // Mencari data di tabel pivot dengan ID yang sesuai
            const pivotRecords = this.database[pivotTable].filter((pivotRecord) => pivotRecord[`${table1}Id`] === record1.id);

            // Menambahkan data ke tabel1
            if (!result[table1][record1.id]) {
                result[table1][record1.id] = {
                    ...record1,
                    [table2]: []
                };
            }

            // Menambahkan data ke tabel2
            pivotRecords.forEach((pivotRecord) => {
                const record2 = this.database[table2].find((record) => record.id === pivotRecord[`${table2}Id`]);
                if (!result[table2][pivotRecord[`${table2}Id`]]) {
                    result[table2][pivotRecord[`${table2}Id`]] = {
                        ...record2,
                        [table1]: []
                    };
                }

                // Menambahkan relasi di table2
                result[table2][pivotRecord[`${table2}Id`]][table1].push({
                    id: result[table1][record1.id].id,
                    nama: result[table1][record1.id].nama
                });
            });

            result[table1][record1.id][table2] = pivotRecords.map((pivotRecord) => {
                // Mencari data di tabel terkait dengan ID yang sesuai
                const record2 = this.database[table2].find((record) => record.id === pivotRecord[`${table2}Id`]);
                return {
                    id: record2.id,
                    [table2 === 'pangkat' ? table2 : 'nama']: record2[table2]
                };
            });

            return result;
        }, { [table1]: {}, [table2]: {} });

        const newOrmInstance = new Orm({
            ...this.database,
            [table1]: Object.values(pivotData[table1]),
            [table2]: Object.values(pivotData[table2])
        });
        return newOrmInstance;
    }

    done() {
        return this.database;
    }

}