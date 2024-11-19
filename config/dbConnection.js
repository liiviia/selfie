const mongoose = require("mongoose");
const mongoDBUri = "mongodb://siteUser:ohSh3EeX@mongo_site232432:27017/site232432";
const mongoCredentials = {
    user: "site232432",       // Username MongoDB
    pwd: "ohSh3EeX",          // Password MongoDB
    site: "mongo_site232432"  // Nome host MongoDB
};
const dbname = "site232432";
const mongouri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}:27017/${dbname}?authSource=admin&writeConcern=majority`;

const connectDB = async () => {
    let debug = [];
    try {
console.log("provaprovaprova");
        console.log("Inizio connessione123...");
        debug.push("Inizio connessione...");
                await mongoose.connect(mongoDBUri);
        console.log("Connesso con successo!");
await new Promise(resolve => setTimeout(resolve, 100));
        debug.push("Connesso con successo!");
    } catch (err) {
        console.log("Errore aaaaaaaa:", err);
        debug.push(`Errore durante la connessione: ${err.message}`);
        return { message: "Errore durante la connessione", debug };
    }

    mongoose.connection.on("connected", () => {
        console.log("Connesso a MongoDB");
        debug.push("Connesso a MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Disconnesso da MongoDB");
        debug.push("Disconnesso da MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.error(`Errore di connessione MongoDB: ${err}`);
        debug.push(`Errore di connessione MongoDB: ${err}`);
    });

    process.on("SIGINT", () => {
        mongoose.connection.close()
            .then(() => {
                debug.push("Connessione MongoDB chiusa");
                process.exit(0);
            })
            .catch(err => {
                debug.push(`Errore durante la chiusura della connessione: ${err}`);
                process.exit(1);
            });
    });

    return { message: "Connesso a MongoDB", debug };
};

module.exports = connectDB;
