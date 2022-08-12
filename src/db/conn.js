const mongoose = require("mongoose")        //importing mongoose

//creating database
mongoose.connect("mongodb://localhost:27017/MeetingSchedular", {
    // useCreateIndex: true,
    //useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    console.log("connection succesful");
}).catch((err) => { console.log(err); });