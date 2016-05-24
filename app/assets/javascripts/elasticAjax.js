$(function() { //shorthand document.ready function

  var searchForm = $('#searchForm');
  var searchInput = $('#movies_query');
  var searchResult = $('.resultList');

  searchForm.submit(function(e) {
    e.preventDefault();
    alert("calling the api");
    call_api();
    return false;
  });

  searchInput.keypress(function (e) {
    searchInput.change();
  });

  searchInput.change(function() {
    call_api();
  });

  function call_api() {
    var url = "http://0.0.0.0:3000/movies/search";
    var values = {
      'query': searchInput.val()
    };

    console.log(searchInput.val());

    $.ajax({
      url: url,
      type: "POST",
      data: values,
      dataType: "json",
      success: function (response) {

        console.log("API Response");
        console.log(response)

        response.forEach(function(response) {
          var entry = response._source;
          var highlight = response.highlight.description
          var title = entry.name
          var description = entry.description
          var html_template = [
            "<li>",
              "<h2>".concat(title, "</h2>"),
              "<p>".concat(description, "</p>"),
              "<p>".concat(highlight, "</p>"),
            "</li>",
          ].join('\n');
          console.log(entry);
          searchResult.html(html_template);
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

});
