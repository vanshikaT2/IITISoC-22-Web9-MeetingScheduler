const mongoose = require("mongoose");

const userdata = mongoose.Schema({

    name: {

        type: String,
        require: true,
        //minLength: 2

    },
    email: {

        type: String,
        require: true,
        //minLength: 2

    },

})
const Account = new mongoose.model("Userdata", userdata);
module.exports = Account;