// On page load, display all saved articles
function displaySavedArticles() {
    $.ajax({
        method: "GET",
        url: "/savedarticles"
    }).then(function (data) {
      $("#display-saved-articles").empty()
        console.log(`Unsaved Articles`)
        console.log(data)
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                
                let newDiv = $(`<div class="saved-article-container" data="${data[i]._id}" id="article">`)
                newDiv.append($(`<h3>${data[i].title}</h3>`))
                newDiv.append($(`<h5>${data[i].description}</h4>`))
                newDiv.append($(`<h5><a target="_blank" href="${data[i].link}">Click Here</a></h4>`))
                newDiv.append($(`<h5><button class="btn btn-danger unsave-article" data="${data[i]._id}">Unsave Article </button></h5>`))
                newDiv.append($(`<h5><button class="btn btn-success view-notes" data="${data[i]._id}">View Notes </button></h5>`))
                newDiv.append($(`<h5><button class="btn btn-primary close-notes">Close Notes</button></h5>`))
                $("#display-saved-articles").append(newDiv)
            }
        }
        else {
            let newDiv = $(`<div id="empty-article-display" class="">`)
            newDiv.append($(`<h2 id="instructions">Please Save Articles On The Homepage!</h2>`))
            $("#display-saved-articles").css("grid-template-columns","1fr")
            $("#display-saved-articles").append(newDiv)
        }

    })
}

// Unsave article
function unsaveArticle(){
    let buttonId = $(this).attr("data")
    $("#notes-container").empty()
    $("#notes-container").append("<h2>Notes Will Be Displayed Here!")
    $.ajax({
        method: "PUT",
        url: `/newlyunsaved/${buttonId}`

    }).then(function(data){
        console.log(data)
        displaySavedArticles()

    })
}

function displayNotes(){

    let notesId= $(this).attr("data")
    $("#notes-container").empty();
    $(window).scrollTop(0);

    $.ajax({
        method: "GET",
        url: `/displaynotes/${notesId}`
    }).then(function(data){
        
        let notesDiv = $(`<div>`)
        notesDiv.append("<h3>Notes For This Article</h3>")
        if(data.note.length){
            for(let i = 0; i < data.note.length;i++){
            notesDiv.append(`<h5 id="specific-note">Note ${i+1}. ${data.note[i].noteText}</h5>`)
        }
    }
        else  {
            notesDiv.html(`<h4>Use The Form To Insert A Note!</h4>`)
        }
        let notesForm = $(`<form data="${data._id}" id="submit-form">`)
        notesForm.append(`<textarea placeholder="Insert Note Here" id="note" name="note" type="text">`)
        notesForm.append(`<div><button class="btn btn-primary formbtn" type="submit">Submit Note </button></div>`)
        notesDiv.append(notesForm)
        $("#notes-container").append(notesDiv)
       

    })
}

function submitNote(){
event.preventDefault();

    let noteId = ($(this).attr("data"))

    let createdNote = {
        note : $("#note").val().trim()
    }

    $.ajax({
        method: "POST",
        url: `/postnotes/${noteId}`,
        data : createdNote
    }).then(function(){
        
        $("#notes-container").empty()
        $("#notes-container").append("<h2>Your Note Has Been Submitted</h2>")
    
    })
    
 

}

function closeNotes(){
    $("#notes-container").empty()
    $("#notes-container").append("<h2>Notes Will Be Displayed Here!")
}

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



// Display Saved Articles On Page Load
displaySavedArticles()
$(document).on("click",".unsave-article",unsaveArticle)
$(document).on("click",".view-notes",displayNotes)
$(document).on("submit","#submit-form", submitNote)
$(document).on("click",".close-notes",closeNotes)