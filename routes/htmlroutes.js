let path = require ('path')
module.exports = function(app){
    // homepage route
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + "/../public/index.html"))
})

// saved articles page route
app.get("/saved",(req,res) => {
    res.sendFile(path.join(__dirname + "/../public/saved.html"))
})

}