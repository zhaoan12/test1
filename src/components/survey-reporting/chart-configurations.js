const sampleBarConfig = {
  type: 'bar',
  data: {
    labels: ['1-2', '3-4', '4-5', '6-7', '7-8', '9+'],
    datasets: [{
      label: '# of Responses',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    // See https://stackoverflow.com/questions/38512001/charts-js-graph-not-scaling-to-canvas-size
    responsive: false,
    //maintainAspectRatio: false
  }
}

export { sampleBarConfig }
