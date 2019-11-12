// Will scrape all of the articles and insert them into the database
$("#scrape-data").on("click", function () {
    
    $("#empty-article-display").empty()
    let newDiv = $(`<div id="empty-article-display">`)
    newDiv.html($(`<h2 id="processing-instructions">Give Us A Moment While We Get Your Articles!</h2>`))
    $("#article-display").html(newDiv)

    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function () {

        displayUnsavedArticles()

    })
})

// Displays newly scraped articles after clicking the scraper button
function displayUnsavedArticles() {
    $.ajax({
        method: "GET",
        url: "/unsavedarticles"
    }).then(function(data) {
      $("#article-display").empty()
        console.log(data)
        if (data.length) {
            for (let i = 0; i < data.length; i++) {

                $("#article-display").css("grid-template-columns","1fr 1fr")

                let newDiv = $(`<div class="article-container" id="article">`)
                
                newDiv.append($(`<h3>${data[i].title}</h3>`))
                newDiv.append($(`<h5>${data[i].description}</h4>`))
                newDiv.append($(`<h5><a target="_blank" href="${data[i].link}">Article Link</a></h4>`))
                newDiv.append($(`<h5><button class="save-article btn btn-primary" data="${data[i]._id}">Save Article </button></h5>`))
                $("#article-display").append(newDiv)
            }
        }
        else {
            
            let newDiv = $(`<div id="empty-article-display">`)
            newDiv.append($(`<h2 id="instructions">Please Click The Get Articles Button To Get Articles!</h2>`))
            $("#article-display").css("grid-template-columns","1fr")
            $("#article-display").html(newDiv)
        }

    })
}

function newSavedArticle(){
    let buttonId = $(this).attr("data")

    $.ajax({
        method: "PUT",
        url: `/newlysaved/${buttonId}`

    }).then(function(data){
        console.log(data)
        displayUnsavedArticles()

    })

}


// Clears article from DB on click
$("#clear-articles").on("click", function () {
    $.ajax({
        method: "DELETE",
        url: "/articles"

    }).then(function (data) {
        $("#article-display").empty()
        location.reload()
        console.log(`You have deleted your articles`)
        console.log(data)
    })
})


// Display articles from database on page load
displayUnsavedArticles()
$(document).on("click",".save-article",newSavedArticle)

