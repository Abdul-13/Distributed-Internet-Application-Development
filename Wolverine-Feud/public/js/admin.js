$(document).ready(function() {

  let selectedId = ""
  let questions = []
  let updateQ = null
  let page = 0
  // Load the questions
  $.get('/questions', function(data) {
    questions = data
    updateTable()
    configurePagination()
  });

  function updateTable(data = questions) {
    $('#questionTableBody').empty()
    let pageLimit = page + 15 < data.length ? page + 15 : data.length

    for (i = page; i < pageLimit; i++) {
      let question = data[i]
      $('#questionTableBody').append(`<tr id="questionRow" data-toggle="modal" data-id=${question._id} data-target="#updateQuestionModal" >
                                        <td>${question._id}</td>
                                        <td>${question.question}
                                      </td></tr>`)
    }
    configurePagination()
  }

  $(document).on('click', '#questionRow', function() {
    selectedId = $(this).data('id')
  })

  $('#createSaveQuestionBtn').click(function() {
    let question = $('#createQuestionText').val()
    let answers = []
    for (i = 1; i < 8; i++) {
      let answerText = $(`#createAnswer${i}`).val()
      let answerValue = $(`#createValue${i}`).val()
      if (answerText !== "" && answerValue !== "") {
        answers.push({ "text": answerText, "value": answerValue })
      }
    }
    let object = { "question": question, "answers": answers }
    $.post('/questions', object, function(result) {
      $('#questionTableBody').empty()
      updateTable()
    })
  })

  $('#updateQuestionModal').on('shown.bs.modal', function() { 
    $.getJSON(`/questions/${selectedId}`, function(data) {
      updateQ = JSON.parse(JSON.stringify(data))
      updateQ = updateQ[0]
      $('#questionText').val(updateQ.question)
      let answers = updateQ.answers
      answers.forEach(function (answer, index) {
        let position = index + 1
        $(`#answer${position}`).val(answer.text)
        $(`#value${position}`).val(answer.value)
      })
    })
  })
  
  $('#updateSaveQuestionBtn').click(function() {
    let updateJSON = updateQuestion()
    $.ajax({
      url: `/questions/${selectedId}`,
      type: 'PUT',
      data: updateJSON,
      dataType: 'json',
      contentType: 'application/json',
      success: function(result, status) {
        console.log(`${status}`)
        $('#questionTableBody').empty()
        updateTable()
      }
    })
  })

  $('#deleteBtn').click(function() {
    $.ajax({
      url: `/questions/${selectedId}`,
      type: 'DELETE',
      success: function(result, status) {
        console.log(status)
        $('#questionTableBody').empty()
        updateTable()
      }
    })
  })

  function updateQuestion() {
    updateQ.question = $('#questionText').val()
    updateQ.answers.forEach( function(answer, index) {
      let position = index + 1
      answer.text = $(`#answer${position}`).val()
      answer.value = $(`#value${position}`).val()
    })
    let retVal = { 'question': updateQ.question, 'answers': updateQ.answers }
    return JSON.stringify(retVal)
  }

  function configurePagination() {
    $('.pagination').empty()
    if (page === 0) {
      $('.pagination').html('<li class="page-item disabled" id="previousPage"><a class="page-link" href="#" tabindex="-1">Previous</a></li>')
    }else {
      $('.pagination').html('<li class="page-item" id="previousPage"><a class="page-link" id="previousLink" href="#">Previous</a></li>')
    }

    if (page === questions.length / 15) {
      $('.pagination').append('<li class="page-item disabled" id="nextPage"><a class="page-link" href="#" tabindex="-1">Next</a></li>')
    } else {
      $('.pagination').append('<li class="page-item" id="nextPage"><a class="page-link" id="nextLink" href="#">Next</a></li>')
    }
  }

  $(document).on('click', '#previousLink', function() {
    page -= 15
    updateTable()
  })

  $(document).on('click', '#nextLink', function() {
    page += 15
    updateTable()
  })

  $('#searchButton').click(function() {
    page = 0
    let searchString = $('#searchText').val()
    let tempQuestions = []
    questions.forEach(function(element) {
      if (element.question !== undefined) {
        if (element.question.includes(searchString) || element._id.includes(searchString)) {
          tempQuestions.push(element)
        }
      }
    })
    updateTable(tempQuestions)
    configurePagination()
  }) 
  
  $('#resetTable').click(function() {
    page = 0
    $('#searchText').val('')
    updateTable()
  })

})