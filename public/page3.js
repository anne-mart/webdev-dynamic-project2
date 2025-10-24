

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