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
        console.log('done')
        $('#result').html(response)
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log('fail')
        console.log(jqXHR.status)
        console.log(textStatus)
        console.log(errorThrown.message)
    }).always(function() {
        console.log('always')
    });
});
