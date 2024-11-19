const mongoose = require("mongoose");
const mongoDBUri = "mongodb://siteUser:pswPerMongo@127.0.0.1:27017/site232432";
const connectDB = async () => {
    let debug = [];
    try {
<<<<<<< HEAD
=======
   
           try {
    console.log("Inizio connessione...");
    await mongoose.connect(mongoDBUri);
    console.log("Connesso con successo!");
} catch (err) {
    console.error("Errore aaaaaaaa:", err.message);
}
         

        debug.push(`Attempting to connect to MongoDB with URI: ${mongoDBUri}`);
 /*       console.log("connettendosi al db");
        await mongoose.connect(mongoDBUri);
        console.log("connesso");
        debug.push("Successfully connected to MongoDB");*/

        mongoose.connection.on("connected", () =>{
      console.log("Connected to MongoDB");
 debug.push("Connected to MongoDB");});
        mongoose.connection.on("disconnected", () => debug.push("Disconnected from MongoDB"));
        mongoose.connection.on("error", (err) => debug.push(`MongoDB connection error: ${err}`));

        process.on("SIGINT", () => {
            mongoose.connection.close()
                .then(() => {
                    debug.push("MongoDB connection closed");
                    process.exit(0);
                })
                .catch(err => {
                    debug.push(`Error closing MongoDB connection: ${err}`);
                    process.exit(1);
                });
        });

        return { message: "Connected to MongoDB", debug };
    } catch (e) {
        debug.push(`Error connecting to MongoDB: ${e.message}`);
        return { error: e.message, debug };
    }
};

module.exports = connectDB;
