const mongoose = require("mongoose");

// Aggiorna l'URI con i dettagli forniti da Gocker
const mongoDBUri = "mongodb://site232432:ahB4ha7j@mongo_site232432:27017/site232432"; 

const connectDB = () => {
    mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection.on("connected", () => console.log("Connesso a MongoDB"));
    mongoose.connection.on("reconnected", () => console.log("Riconnesso a MongoDB"));
    mongoose.connection.on("disconnected", () => console.log("Disconnesso da MongoDB"));
    mongoose.connection.on("error", (err) => console.error("Errore di connessione a MongoDB:", err));

    process.on("SIGINT", () => {
        mongoose.connection.close()
            .then(() => {
                console.log("Connessione MongoDB chiusa");
                process.exit(0);
            })
            .catch(err => {
                console.error("Errore durante la chiusura della connessione MongoDB:", err);
                process.exit(1);
            });
    });
};

module.exports = connectDB;
