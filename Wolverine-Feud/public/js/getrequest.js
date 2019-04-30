$( document ).ready(function() {
	
	// GET REQUEST
	$("#allQuestions").click(function(event){
		event.preventDefault();
		ajaxGet();
	});
	
	// DO GET
	function ajaxGet(){
		$.ajax({
			type : "GET",
			url : window.location + "api/questions/all",
			success: function(result){
				$('#getResultDiv ul').empty();
				$.each(result, function(i, question){
					$('#getResultDiv .list-group').append(JSON.stringify(question)  + "<br>")
				});
				console.log("Success: ", result);
			},
			error : function(e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});	
	}
})
