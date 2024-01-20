# ORM

Eloquent Laravel ORM pada JSON.

## Init

```javascript
import { Orm } from "./orm/index.js";

let data = {};
```

## Insert

Insert single:

```javascript
new Orm(data).insert("users", { name: "saya" }).done();
```

Insert many records:

```javascript
new Orm(data)
  .insert("users", [
    { name: "saya" },
    { name: "saya yang lain" },
    { name: "saya juga yang lain" },
  ])
  .done();
```

## Update

```javascript
new Orm(data)
  .update("user", idPertama, {
    nama: "Zen yang lain lagi",
  })
  .done();
```

## Delete

```javascript
new Orm(data).delete("user", idTerakhir).done();
```

## Cari

```javascript
new Orm(data).cari("user", "Saya").done();
```

## Where

```javascript
new Orm(data).where("user", { nama: "saya yang lain" }).done();
```

## Distinct

```javascript
new Orm(data).distinct("user", "nama").done();
```

## With

Contoh kode:

```javascript
import { Orm } from "./orm/index.js";

// Contoh penggunaan
const database = {};

const orm = new Orm(database);

// Menambahkan data ke 'user'
orm.insert("user", { id: 1, nama: "John Doe", alamat: "Jalan ABC" });

// Menambahkan data ke 'komentar'
orm.insert("komentar", {
  komentarnya: "Bagus!",
  waktu: "2024-01-21",
  userId: 1,
});
orm.insert("komentar", {
  komentarnya: "Luar biasa!",
  waktu: "2024-01-22",
  userId: 2,
});

// Menambahkan data ke 'pelanggaran'
orm.insert("pelanggaran", { namaPelanggaran: "Pencurian", userId: 1 });
orm.insert("pelanggaran", { namaPelanggaran: "Kerusuhan", userId: 1 });

// Melakukan join dengan menggunakan metode with
const joinedData = orm.with("user", ["komentar", "pelanggaran"]).done();

console.log(JSON.stringify(joinedData, null, 2));
```

Hasil:

```json
{
  "user": [
    {
      "id": 1,
      "nama": "John Doe",
      "alamat": "Jalan ABC",
      "komentar": [
        {
          "id": 17057691681211562,
          "komentarnya": "Bagus!",
          "waktu": "2024-01-21",
          "userId": 1
        }
      ],
      "pelanggaran": [
        {
          "id": 17057691681217770,
          "namaPelanggaran": "Pencurian",
          "userId": 1
        },
        {
          "id": 17057691681213332,
          "namaPelanggaran": "Kerusuhan",
          "userId": 1
        }
      ]
    }
  ],
  "komentar": [
    {
      "id": 17057691681211562,
      "komentarnya": "Bagus!",
      "waktu": "2024-01-21",
      "userId": 1
    },
    {
      "id": 17057691681214620,
      "komentarnya": "Luar biasa!",
      "waktu": "2024-01-22",
      "userId": 2
    }
  ],
  "pelanggaran": [
    {
      "id": 17057691681217770,
      "namaPelanggaran": "Pencurian",
      "userId": 1
    },
    {
      "id": 17057691681213332,
      "namaPelanggaran": "Kerusuhan",
      "userId": 1
    }
  ]
}
```

## Pivot

Contoh kode:

```javascript
import { Orm } from "./orm/index.js";
import { writeFileSync } from "fs";

// Contoh penggunaan
const database = {};

const orm = new Orm(database);

// Menambahkan data ke 'nama'
orm.insert("nama", { id: 1, nama: "John" });
orm.insert("nama", { id: 2, nama: "Jane" });

// Menambahkan data ke 'pangkat'
orm.insert("pangkat", { id: 1, pangkat: "Sersan" });
orm.insert("pangkat", { id: 2, pangkat: "Letnan" });

// Menambahkan data ke 'nama_pangkat' (tabel pivot)
orm.insert("nama_pangkat", { namaId: 1, pangkatId: 1 });
orm.insert("nama_pangkat", { namaId: 1, pangkatId: 2 });
orm.insert("nama_pangkat", { namaId: 2, pangkatId: 2 });

// Melakukan join many-to-many dengan menggunakan metode pivot
const joinedData = orm.pivot("nama", "pangkat").done();

// console.log(JSON.stringify(joinedData, null, 2));
// console.log(joinedData.pangkat[1].nama);
writeFileSync("hasil.json", JSON.stringify(joinedData, null, 2));
```

Hasil:

```json
{
  "nama": [
    {
      "id": 1,
      "nama": "John",
      "pangkat": [
        {
          "id": 1,
          "pangkat": "Sersan"
        },
        {
          "id": 2,
          "pangkat": "Letnan"
        }
      ]
    },
    {
      "id": 2,
      "nama": "Jane",
      "pangkat": [
        {
          "id": 2,
          "pangkat": "Letnan"
        }
      ]
    }
  ],
  "pangkat": [
    {
      "id": 1,
      "pangkat": "Sersan",
      "nama": [
        {
          "id": 1,
          "nama": "John"
        }
      ]
    },
    {
      "id": 2,
      "pangkat": "Letnan",
      "nama": [
        {
          "id": 1,
          "nama": "John"
        },
        {
          "id": 2,
          "nama": "Jane"
        }
      ]
    }
  ],
  "nama_pangkat": [
    {
      "id": 17057716558023974,
      "namaId": 1,
      "pangkatId": 1
    },
    {
      "id": 17057716558026706,
      "namaId": 1,
      "pangkatId": 2
    },
    {
      "id": 17057716558023310,
      "namaId": 2,
      "pangkatId": 2
    }
  ]
}
```
