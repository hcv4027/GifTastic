// An array of animals used for generated buttons.
var topics = ["Bird", "Cat", "Camel", "Chicken",
              "Deer", "Dog", "Donkey", "Duck",
              "Ferret", "Frog", "Gazelle", "Goat", 
              "Hamster", "Horse", "Llama", "Ox",
              "Rabbit", "Sheep", "Skunk",  "Swan", 
              "Turkey",  "Turtle", "Water Buffalo"
              ];

//Individual pieces of information needed for ajax query
var queryURL = "https://api.giphy.com/v1/gifs/search?q=";
var apiKey = "aJ2r8kvvJRFG4mawIZyH4fOw3LgX015T";
var searchQty = 10;

// This function creates button elements that are displayed on the page.
function buttonGenerator() {
  $("#animal-buttons").empty();
  for (i = 0; i <  topics.length; i++) 
  {
    var emptyButton = $("<button>");
    // Adding bootstrap classes to organize elements in the UI.
    $(emptyButton).addClass("btn btn-info m-1 animal-button");

    // Setting a data attribute equal to the string of the current element from the array.
    $(emptyButton).attr("id", topics[i]);
    $(emptyButton).html(topics[i]);
    $("#animal-buttons").append(emptyButton);
  }
};

// This function toggles between the animated image and the still image.
function motionToggle() 
{
  // if the image clicked is currently still, toggle it to animated.
  if ($(this).attr("current-state") === "img-still") {
    $(this).attr("current-state", "img-motion");
    $(this).attr("src", $(this).attr("img-motion"));
  } 
  // if the image clicked is currently animated, toggle it to still.
  else 
  {
    $(this).attr("current-state", "img-still");
    $(this).attr("src", $(this).attr("img-still"));
  }
};

function cardMaker() {
  // Removes any elements that were generated
  $("#animals").empty();

  // Ajax query call including the parameters created and set above.
  $.ajax({
    url: queryURL + $(this).attr("id") + "&api_key=" + apiKey + "&limit=" + searchQty,
    method: "GET"
  }).then(function (response) {
    for (i= 1; i < searchQty; i++){ 
      
      var newCard = $("<div class='card mt-4 mx-2 float-left'>")
      var newImage = $("<img class='card-img-top img-thumbnail'>");

      // Creating variables for the urls for the still images and animated images.
      var stillImage = response.data[i-1].images.downsized_still.url;
      var motionImage = response.data[i-1].images.downsized.url;

      // Adding the alternate naming attribute to the results provided from GIPHY for the title.
      $(newImage).attr("alt", response.data[i-1].title);

      // Set the initial image source to the still image.
      $(newImage).attr("src", stillImage);

      // Set the still image and animated image urls as an attribute to hook in a reference to.
      $(newImage.attr("img-still", stillImage));
      $(newImage.attr("img-motion", motionImage));

      //Sets the state of each gif to still, by default.
      $(newImage).attr("current-state", "img-still");

      //Genrates the new card and appends it to the list presented to the user.
      var newCardBody = $("<div class='card-body'>");
      var newCardText = $("<p class='card-text'>");
      newCardText.html("Rating: " + response.data[i-1].rating);
      newCardBody.append(newCardText);
      newCard.append(newImage).append(newCardBody);
      $("#animals").append(newCard);
    };
  })
};

//This function adds an animal button based on submitted user input.
function addAnimal() {
  event.preventDefault();
  var newAnimal = $("#animal-input").val();
  topics.push(newAnimal);
  $("#animal-input").val("");
  buttonGenerator();
};

// These are the event listeners
$(document).on('click', '.animal-button', cardMaker); 
$(document).on('click', '.img-thumbnail', motionToggle);
$(document).on('click', '#add-animal', addAnimal);

// Calls the buttonGenerator function to populate all animal buttons on HTML page.
buttonGenerator();