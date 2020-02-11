let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let PORT = process.env.PORT || 6020;

let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://shijir0927:Shijiree0927@cluster0-tndw9.mongodb.net/news_scraper",
  {
    useNewUrlParser: true
  }
);

require("./routes/htmlroutes.js")(app);
require("./routes/apiroutes.js")(app);

app.listen(PORT, function() {
  console.log(`Listening on http://localhost:${PORT}`);
});
