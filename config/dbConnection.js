
const mongoose = require("mongoose");

const mongoDBUri = "mongodb+srv://gg:cccciiiaaaaoooo@cluster0.oepbskc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = () => {
    mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
    mongoose.connection.on("reconnected", () => console.log("Reconnected to MongoDB"));
    mongoose.connection.on("disconnected", () => console.log("Disconnected from MongoDB"));
    mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));


    process.on("SIGINT", () => {
    mongoose.connection.close()
        .then(() => {
        process.exit(0);
        })
        .catch(err => {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
        });
    });
};


module.exports = connectDB;