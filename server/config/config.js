process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = `mongodb+srv://GerryX3:1jj77AFbWGIS5fvG@cluster0-sgxvt.mongodb.net/Cafe`
}

process.env.URLDB = urlDB;