$(document).ready(function () {

  // SUBMIT FORM
  $("#questionAddForm").submit(function (event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });


  function ajaxPost() {

    // PREPARE FORM DATA
    var formData = [{
      question: $("#question").val(),
      answers: [
        {
          text: $("#answer1").val(),
          pts: $("#points1").val()
        },
        {
          text: $("#answer2").val(),
          pts: $("#points2").val()
        },
        {
          text: $("#answer3").val(),
          pts: $("#points3").val()
        },
        {
          text: $("#answer4").val(),
          pts: $("#points4").val()
        },
        {
          text: $("#answer5").val(),
          pts: $("#points5").val()
        },
        {
          text: $("#answer6").val(),
          pts: $("#points6").val()
        },
        {
          text: $("#answer7").val(),
          pts: $("#points7").val()
        },
        {
          text: $("#answer8").val(),
          pts: $("#points8").val()
        }
      ]
    }]

    // DO POST
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: window.location + "api/questions/save",
      data: JSON.stringify(formData),
      dataType: 'json',
      success: function (question) {
        $("#postResultDiv").html("<p>" +
          "Post Successfully! <br>" +
          "--->" + JSON.stringify(question) + "</p>");
      },
      error: function (e) {
        alert("Error!")
        console.log("ERROR: ", e);
      }
    });

    // Reset FormData after Posting
    resetData();

  }

  function resetData() {
    $("#question").val("");
    $("#answer1").val("");
    $("#points1").val("");
    $("#answer2").val("");
    $("#points2").val("");
    $("#answer3").val("");
    $("#points3").val("");
    $("#answer4").val("");
    $("#points4").val("");
    $("#answer5").val("");
    $("#points5").val("");
    $("#answer6").val("");
    $("#points6").val("");
    $("#answer7").val("");
    $("#points7").val("");
    $("#answer8").val("");
    $("#points8").val("");
  }
})
