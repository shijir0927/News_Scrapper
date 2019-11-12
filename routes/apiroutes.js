let axios = require('axios')
let cheerio = require('cheerio')
let db = require('../models');

module.exports = function(app){

    // Route to Scrape from NPR NEWS
    app.get("/scrape",(req,res) =>{

    axios.get("https://www.npr.org/sections/news/").then(function(response){
        let $ = cheerio.load(response.data)

        $(".item-info").each(function(i,element){

        
            let result = {}

            result.title = $(this).children("h2").text()
            result.description = $(this).children("p").children("a").text()
            result.link = $(this).children("h2").find("a").attr("href")
            result.saved = false
            
            console.log(result)


            if(result.title && result.description && result.link){

            
            db.Article.create(result).then(function(dbArticle){
                console.log(dbArticle)

            }).catch(function(err){
                console.log(err)
            })
        }

           
        });
        res.send(true);
        
    })

});

// Gets all of the unsaved articles
app.get("/unsavedarticles",(req,res)=>{

db.Article.find({saved:false}).then(function(dbArticle){


res.json(dbArticle)

}).catch(function(err){

res.json(err)

})
});

// Gets all of the saved articles
app.get("/savedarticles",(req,res)=>{
    db.Article.find({saved:true}).then(function(dbArticle){
    console.log(dbArticle)
    
    res.json(dbArticle)
    
    }).catch(function(err){
    
    res.json(err)
    
    })
    
})

// Deletes articles
app.delete("/articles",(req,res)=>{

    db.Article.deleteMany({}).then(function(dbArticle){

        console.log(dbArticle)
        res.json(dbArticle)
    }).catch(function(err){
        res.json(err)
        console.log(err)
    })
})

// Newly saved article
app.put("/newlysaved/:id",(req,res)=>{

    let articleId = req.params.id

    db.Article.findOneAndUpdate({_id:articleId},{$set: {saved:true}},function(err,dbArticle){
        if(err) console.log(err)
        res.json(dbArticle)
    })

})

// Newly unsaved article
app.put("/newlyunsaved/:id",(req,res)=>{

    let articleId = req.params.id

    db.Article.findOneAndUpdate({_id:articleId},{$set: {saved:false}},function(err,dbArticle){
        if(err) console.log(err)
        res.json(dbArticle)
    })

})

app.get("/displaynotes/:id",(req,res)=>{

let noteId = req.params.id

db.Article.findOne({_id:noteId})
.populate("note")
.then(function(dbArticle){
    console.log(dbArticle.note)
    res.json(dbArticle)
}).catch(function(err){
    res.json(err)
})

})

app.post("/postnotes/:id",(req,res)=>{
    console.log(req.body)
    let noteId = req.params.id
    db.Note.create({noteText : req.body.note}).then(function(dbNote){
        return db.Article.findOneAndUpdate({_id:noteId},
            { $push: {note: dbNote._id}},
            {new: true})
    }).then(function(dbArticle){
        console.log(dbArticle)
        res.json(dbArticle)
    }).catch(function(err){
        res.json(err)
    })

})

}
