var data = [];

//on page load
$(document).ready(function() {
    getToDo();
    printToDo();
})


//Card Constructor
function Card(toDoTitle, toDoContent) {
    this.title = toDoTitle;
    this.body = toDoContent;
    this.quality = "swill";
    this.id = Date.now();
}


function storeToDo() {
    var stringData = JSON.stringify(data);
    localStorage.setItem("Data Item", stringData);
}


function getToDo() {
    var storedData = localStorage.getItem("Data Item") || '[]';
    var parsedData = JSON.parse(storedData);
    data = parsedData;  //Undeclared var so it's global
}


// Clears card section, then generates cards from local storage
function printToDo() {
    $("#card-section").html('');
    data.forEach(function(object) {
        $("#card-section").append(`
			<div id="${object.id}" class="card">
				<header>
					<h1 class="card-title" contenteditable='true'>${object.title}</h1>
					<button class="clear"></button>
				</header>
				<article>
					<p class='card-body' contenteditable='true'>${object.body}</p>
					<button class="upvote"></button>
					<button class="downvote"></button>
					<h3>quality:<h4 class="quality">${object.quality}</h4></h3>
				</article>
				<hr>
			</div>`);
    });
}



////////////////// Event Listener to Disable/////////////////
$("#title-input, #body-input").on("keyup", disableEnter);

function disableEnter() {
    if ($("#title-input").val().length > 0 && $("#body-input").val().length > 0) {
        $("#save-button").prop("disabled", false);
    } else {
        $("#save-button").prop("disabled", true);
    }
}


///////////////Save //////////////////////////////////////

$("#save-button").on('click', function(e) {
    e.preventDefault();
    var storeToDoTitle = $('#title-input').val();
    var storeToDoContent = $('#body-input').val();
    var card = new Card(storeToDoTitle, storeToDoContent);
    data.unshift(card);
    storeToDo();
    printToDo();
    clearInput();
    disableEnter();
})

//////////////////Upvote and Downvote////////////////////////


//Upvote
$("#card-section").on('click', '.upvote', function() {
    var qualityVar = $(this).siblings(".quality").text();
    if ($(this).siblings(".quality").text() === "swill") {
        $(this).siblings(".quality").text("plausible");
        qualityVar = "plausible";
        editQuality(this, qualityVar);
    } else if ($(this).siblings(".quality").text() === "plausible") {
        $(this).siblings(".quality").text("genius");
        qualityVar = "genius"
        editQuality(this, qualityVar);
    } else if ($(this).siblings(".quality").text() === "genius") {
        qualityVar = "genius";
    }
});


//Downvote
$("#card-section").on('click', '.downvote', function() {
    var qualityVar = $(this).siblings(".quality").text();
    if ($(this).siblings(".quality").text() === "genius") {
        $(this).siblings(".quality").text("plausible");
        qualityVar = "plausible";
        editQuality(this, qualityVar);
    } else if ($(this).siblings(".quality").text() === "plausible") {
        $(this).siblings(".quality").text("swill");
        qualityVar = "swill";
        editQuality(this, qualityVar);
    } else if ($(this).siblings(".quality").text() === "plausible") {
        qualityVar = "swill";
    }
});

//Stores the new vote quality to local storage
function editQuality(location, qualityVar) {
    var objectId = $(location).parent().parent().attr("id");
    data = JSON.parse(localStorage.getItem("Data Item"));
    data.forEach(function(object) {
        if (object.id == objectId) {
            object.quality = qualityVar;
            return object.quality;
        }
    });
    stringData = JSON.stringify(data);
    localStorage.setItem("Data Item", stringData);
}

///////////////Content Editable //////////////////////////////////////////////

//Edit Card Title
$('#card-section').on('blur', '.card-title', function(e) {
    var newTitleText = $(this).text();
    editTitleText(this, newTitleText);
});


function editTitleText(location, newText) {
    var objectId = $(location).parent().parent().attr('id');
    data = JSON.parse(localStorage.getItem('Data Item'));
    data.forEach(function(object) {
        if (object.id == objectId) {
            object.title = newText;
            return object.title;
        }
    });
    stringData = JSON.stringify(data);
    localStorage.setItem("Data Item", stringData);
}

//Edit Card Body
$('#card-section').on('blur', '.card-body', function() {
    var newBodyText = $(this).text();
    editBodyText(this, newBodyText);
});


function editBodyText(location, newText) {
    var objectId = $(location).parent().parent().attr('id');
    data = JSON.parse(localStorage.getItem('Data Item'));
    data.forEach(function(object) {
        if (object.id == objectId) {
            object.body = newText;
            return object.body;
        }
    });
    stringData = JSON.stringify(data);
    localStorage.setItem("Data Item", stringData);
}


/////////Delete Btn////////////////////////////


$("#card-section").on('click', '.clear', function() {
  var idOfRemoved = $(this).parent().parent().attr("id")
  deleteCard(this, idOfRemoved);
  $(this).closest('.card').remove();
});

/// Deletes from local storage
function deleteCard(location, idOfRemoved) {
    var objectId = $(location).parent().parent().attr("id");
    var removedId = idOfRemoved;
    data = JSON.parse(localStorage.getItem("Data Item"));
    data = data.filter(function(object) {
        return object.id != objectId;
    });
    stringData = JSON.stringify(data);
    localStorage.setItem("Data Item", stringData);
}

///////////////Search //////////////////////
$('#search').on('keyup', function() {
    var searchInput = $('#search').val();
    var re = new RegExp(searchInput, 'igm');
    $('.card').each(function() {
        var title = $(this).find(".card-title").text();
        var body = $(this).find("article p").text();
        var match = (title.match(re) || body.match(re));
        if (!match) {
            $(this).hide();
        } else {
            $(this).show();
        }
    })
});

// Clear Input
function clearInput() {
    $('#title-input').val('');
    $('#body-input').val('');
}
