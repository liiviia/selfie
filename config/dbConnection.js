const mongoose = require("mongoose");
require("dotenv").config(); 

const mongoURI = `mongodb://site232432:ohSh3EeX@mongo_site232432:27017/site232432?authSource=admin&retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        console.log("Inizio connessione a MongoDB...");

        await mongoose.connect(mongoURI, {
		serverSelectionTimeoutMS: 30000, 
	});

        console.log("Connessione a MongoDB riuscita!");

        mongoose.connection.on("connected", () => {
            console.log("MongoDB: Connessione stabilita.");
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB: Connessione chiusa.");
        });

        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB: Errore di connessione - ${err.message}`);
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("MongoDB: Connessione chiusa a causa di SIGINT.");
            process.exit(0);
        });

    } catch (err) {
        console.error(`Errore durante la connessione a MongoDB: ${err.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
