const { default: mongoose } = require("mongoose");

const main = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongoose connection successfull`);
    } catch (error) {
        console.log(`mongoose connection failed:`, error);
    }
}

module.exports = main;