function setData(top_k_predictions) {
    var labels = [];
    var probabilities = [];

    for (var i = 0; i < top_k_predictions.length; i++) {
        labels.push(top_k_predictions[i].label);
        probabilities.push(top_k_predictions[i].probability);
    }

    var data = {
        labels: labels,
        fontSize: 18,
        datasets: [{
            label: 'probability',
            data: probabilities,
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
        }]
    };
    return data;
}

function setOptions() {
    var options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            xAxes: [{
                gridLines: {
                    display: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'probability',
                    fontSize: 14
                },
                ticks: {
                    min: 0.0,
                    max: 1.0,
                    fontSize: 14
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'label',
                    fontSize: 14
                },
                ticks: {
                    autoSkip: false,
                    fontSize: 14
                }
            }]
        }
    };
    return options;
}

function drawChart(top_k_predictions) {
    console.log('drawChart start');

    var ctx = document.getElementById('barChart');
    var data = setData(top_k_predictions);
    var options = setOptions();

    // set height according to the number of data
    ctx.height = 18 * data.datasets[0]['data'].length + 60;

    var myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: options
    });

    $('#barChart').addClass('mt-4');

    console.log('drawChart end');
}
