let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let PORT =  process.env.PORT || 6020;





let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleScraper";
mongoose.connect(MONGODB_URI);


require("./routes/htmlroutes.js")(app);
require("./routes/apiroutes.js")(app);


app.listen(PORT,function(){
    console.log(`Listening to http://localhost:${PORT}`)
})