// Page 3 work
let names = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
};

fetch("/birth_day")
    .then(res => {
        return res.json();
    })
    .then(rows => {
        let xValue = [];
        let yValue = [];

        for (let day = 1; day <= 7; day++){
            let total_days = 0;
            for (let i = 0; i < rows.length; i++){
                let week_day = Number(rows[i].day);
                let sum = Number(rows[i].total);
                if(week_day === day){
                    total_days = sum;
                }
            }
            xValue.push(names[day]);
            yValue.push(total_days);
        }

        let trace1 = {
            x: xValue,
            y: yValue,
            type: "bar",
            text: yValue,
        }

        let trace = [trace1];

        let layout = {
            title: "Births per day"
        }

        Plotly.newPlot("plot", trace, layout);
    });

// homePage.html work
let months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};
let year = window.location.pathname.split('/').pop()||'2000'; // Default to 2000
fetch(`/data/year/${year}`)
  .then(res => {
    return res.json();
  })
  .then(rows => {
    // creating labels + data rows in the chart
    let labels = rows.map(row => months[row.month] || row.month);
    let data = rows.map(row => row.total_births);

    // adding actual chart ...
    let ctx = document.getElementById('birthChart').getContext('2d'); // this must be a 2d context
     // chart stuff
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `Births per Month ${year}`,
          data: data,
          backgroundColor: 'rgba(75, 192, 122, 0.2)',
          borderColor: 'rgba(75, 192, 167, 1)',
        }]
      },
      options: {
        scales: {
        // x-axis (month)
        x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Month'
            }
          },
        // y-axis (births)
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Births'
            }
          },
        },
      }
    });
  })

// getting year dynamically -- default to 2000
let currentYearFromURL = parseInt(window.location.pathname.split('/').pop()) || 2000;

// get years
fetch("/years")
  .then(res => res.json())
  .then(years => {
    // previous and next buttons
    const prevBtn = document.getElementById("prevYearBtn");
    const nextBtn = document.getElementById("nextYearBtn");
    // pdating current index
    const currentIndex = years.indexOf(currentYearFromURL);
    // update yr
    document.getElementById("yearTitle").textContent = currentYearFromURL;

    // want to check if trying to go beyond years in dataset
    // disable if true
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= years.length - 1 || currentIndex == -1;

    // event listenet for buttons...
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        const prevYear = years[currentIndex - 1];
        window.location.href = `/year/${prevYear}`;
      }
    });
    nextBtn.addEventListener("click", () => {
      if (currentIndex < years.length - 1 && currentIndex != -1) {
        const nextYear = years[currentIndex + 1];
        window.location.href = `/year/${nextYear}`;
      }
    });
  })
  .catch(err => console.error("Error fetching years:", err));

// Birth per year work
  fetch("/birth_year")
  .then(res => {
    return res.json(); 
  })
  .then(rows => {

    // X and Y labels
    let labels = rows.map(row => String(row.year));
    let data = rows.map(row => Number(row.total_births));

  
    let ctx = document.getElementById('birthPerYearChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Births per Year 2000-2014',
          data: data,
          backgroundColor: 'FF6384',
          borderColor: '#FFB1C1',
        }]
      },
      options: {
        scales: {
        // x-axis
        x: {beginAtZero: true, title: {display: true,text: 'Year'}},
        // y-axis
          y: {beginAtZero: true,title: {display: true,text: 'Total Births'}},
        },
      }
    });
  })


