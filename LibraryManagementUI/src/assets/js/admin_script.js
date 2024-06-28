/*
const toggler = document.querySelector(".btn");

toggler.addEventListener("click", function () {
    debugger;
  document.querySelector("#sidebar").classList.toggle("collapsed");
});*/

document.addEventListener("DOMContentLoaded", function() {
    const toggler = document.querySelector(".btn");
    if (toggler) {
        toggler.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("collapsed");
        });
    }
});



//chart admin
document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('borrowedBooksChart').getContext('2d');
    var borrowedBooksChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Books Borrowed',
          data: [12, 19, 3, 5, 2, 3, 7],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });