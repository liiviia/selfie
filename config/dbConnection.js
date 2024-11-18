const mongoose = require("mongoose");
const mongoDBUri = "mongodb://site232432:ahB4ha7j@mongo_site232432:27017/site232432"; 

const connectDB = async () => {
    let debug = [];
    try {
        debug.push(`Attempting to connect to MongoDB with URI: ${mongoDBUri}`);
        await mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
        debug.push("Successfully connected to MongoDB");

        mongoose.connection.on("connected", () => debug.push("Connected to MongoDB"));
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