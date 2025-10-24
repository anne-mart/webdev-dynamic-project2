

let names = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
};

let data = window.birth_data;

let xValue = [];
let yValue = [];

for (let day = 1; day <= 7; day++){
    let total_days = 0;
    for (let i = 0; i < data.length; i++){
        let week_day = Number(data[i].day);
        let sum = Number(data[i].total);
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