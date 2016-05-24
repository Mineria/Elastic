$(function() { //shorthand document.ready function

  var searchForm = $('.movies');
  var searchInput = $('#movies_query');
  var searchResult = $('.resultList');

  searchForm.submit(function(e) {
    e.preventDefault();
    call_api();
    return false;
  });

  searchInput.keypress(function (e) {
    var url = String(e.currentTarget.baseURI) || "http://0.0.0.0:3000/movies/search";
    var data = {
      'query': searchInput.val()
    };

    call_api(url, data);
  });

  function call_api(url, data) {

    $.ajax({
      url: url,
      type: "POST",
      data: data,
      dataType: "json",

      success: function (response) {
        var htmlTemplate = "";
        var film, highlight, title, description;

        if(response.length === 0) {
          htmlTemplate = notFoundTemplate(data.query);
          searchResult.html(htmlTemplate); // Place the result into the view
        }
        else {
          console.log(response);
          console.log(response.length);
          searchResult.html(""); // Place the result into the view

          response.forEach(function(responseEntry) {
            film = responseEntry._source;
            console.log(film);
            console.log(responseEntry);

            title = film.name || "";
            genre = film.gender || "";
            description = film.description || "";
            highlight = responseEntry.highlight.description || "";

            htmlTemplate = resultTemplate(title, genre, description, highlight);
            searchResult.append(htmlTemplate);
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  }

  function resultTemplate(title, genre, description, highlight) {
    var htmlTemplate = [
      "<li>",
      "<h2>".concat(title, "</h2>"),
      "<span><b>".concat(genre, "</b></span>"),
      "<p>".concat(description, "</p>"),
      "<p>".concat(highlight, "</p>"),
      "</li>"
    ].join('\n');

    return htmlTemplate;
  }

  function notFoundTemplate(query) {
    var htmlTemplate = [
      "<li>",
      "<p>".concat("No results matched with ", query),
      "</li>"
    ].join('\n');

    return htmlTemplate;
  }


});
