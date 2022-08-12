const mongoose = require("mongoose");
//const validator = require("validator");

const userSchema = mongoose.Schema({

    eventname: {

        type: String,
        require: true,
        //minLength: 2

    },
    event_type: {

        type: String,
        require: true,
        //minLength: 2

    },

    // lastname: {
    //     type: String,
    //     required: true

    // },
    calanderdate1: {
        type: Date,
        require: true

    },
    calanderdate2: {
        type: Date,
        require: true

    },
    time1: {
        type: String,
        require: true

    },
    time2: {
        type: String,
        require: true

    },
    duration: {
        type: String,
        require: true

    },
    // email_id: {
    //     type: String,
    //     require: true,
    //     unique: true,
    // validator(value) {
    //     if (!validator.isEmail(value)) { throw new Error("invalid email id"); }
    // }

    //},
    // gender: {
    //     type: String,
    //     required: true

    // },
    // phonenumber: {
    //     type: String,
    //     required: true,
    //     unique: true

    // },
    // age: {
    //     type: String,
    //     required: true

    // },
    // password: {
    //     type: String,
    //     required: true

    // },
    // confirmpassword: {
    //     type: String,
    //     required: true

    // },

    description: {
        type: String,
        require: true

    }


});




// const userdata = mongoose.Schema({

//     name: {

//         type: String,
//         require: true,
//         //minLength: 2

//     },
//     email: {

//         type: String,
//         require: true,
//         //minLength: 2

//     },

// })
// const Account = new mongoose.model("Userdata", userdata);
// module.exports = Account;

const User = new mongoose.model("Final", userSchema);
module.exports = User;
