const mongoose = require("mongoose");
const mongoDBUri = "mongodb://siteUser:pswPerMongo@127.0.0.1:27017/site232432";
const connectDB = async () => {
    let debug = [];
    try {
        console.log("Inizio connessione...");
        debug.push("Inizio connessione...");
        await mongoose.connect(mongoDBUri);
        console.log("Connesso con successo!");
        debug.push("Connesso con successo!");
    } catch (err) {
        console.error("Errore aaaaaaaa:", err.message);
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
