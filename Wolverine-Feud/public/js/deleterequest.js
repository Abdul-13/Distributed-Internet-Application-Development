$(document).ready(function () {

	// SUBMIT FORM
	$("#questionDeleteForm").submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});


	function ajaxPost() {

		// PREPARE FORM DATA
		var formData = {
			question: $("#questionDelete").val()
        }

		// DO DELETE
		$.ajax({
			type: "DELETE",
			contentType: "application/json",
			url: window.location + "api/questions/delete",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function () {
				$("#deleteResultDiv").html("<p>" +
					"Deleted Successfully! <br>" + "</p>");
			},
			error: function (e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});

		// Reset FormData after deleting
		resetData();

	}

	function resetData() {
		$("#questionDelete").val("");
	}
})
