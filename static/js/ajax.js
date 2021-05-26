/*
 * This function is from Django official web site:
 *   https://docs.djangoproject.com/en/3.1/ref/csrf/
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        }
    }
});

$('form').submit(function(event) {
    event.preventDefault();
    var form = $(this);
    var formData = new FormData($('form').get(0));
    $.ajax({
        type: 'POST',
        url: form.prop('action'),
        method: form.prop('method'),
        data: formData,
        processData: false,
        contentType: false,
        timeout: 10000,
        dataType: 'text',
    }).done(function(response) {
        console.log('done');

        var parsedResponse = JSON.parse(response);

        // show image
        showImage(parsedResponse.image_url);

        // create table
        createTable(parsedResponse.top_k_predictions);

        // draw chart
        drawChart(parsedResponse.top_k_predictions);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log('fail');
        console.log(jqXHR.status);
        console.log(textStatus);
        console.log(errorThrown);
        alert(jqXHR.status + ' Error: ' + errorThrown);
    }).always(function() {
        console.log('always');
    });
});

function showImage(image_url) {
    console.log('showImage start');
    var img = $('#submittedImage');
    img.attr('src', image_url);
    img.addClass('img-fluid mx-auto d-block mt-4 mb-4')
    console.log('showImage end');
}

function createTable(top_k_predictions) {
    console.log('createTable start');
    var table = $('#rankingTable');
    table.empty();
    table.append('<caption>Prediction result</caption>');
    table.append('<thead><th>Rank</th><th>Label</th><th>Probability</th></thead>');
    table.append('<tbody></tbody>');
    for (var i = 0; i < top_k_predictions.length; i++) {
        var row = $("<tr></tr>");
        row.append($('<td align="right"></td>').text(i + 1));
        row.append($('<td></td>').text(top_k_predictions[i].label));
        row.append($('<td align="right"></td>').text(top_k_predictions[i].probability.toFixed(3)));
        table.append(row);
    }
    table.addClass('table bg-light');
    console.log('createTable end');
}
