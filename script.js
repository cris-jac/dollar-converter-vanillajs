// API url
const apiUrl = "https://dolarapi.com/v1/dolares";

// For plot
var listNames = [];
var listValues = [];

// Fetch data
const getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Retrieve data
var button = document.querySelector(".request-btn");
button.addEventListener("click", async () => {
    const data = await getData(apiUrl);
    console.log(data);

    // Convertir
    var monto = document.getElementById("monto");   
    if (monto.disabled = true) {
        monto.disabled = false;
    }
    monto.addEventListener("input", async(e) => {
        e.preventDefault();

        var montoUsd = e.target.value;
        var montoArs = e.target.value;
        var blueCompra = data[1].compra;
        var blueVenta = data[1].venta;

        let arsInput = document.querySelector("#ars-input");
        let usdResult = document.querySelector("#usd-result");
        let usdInput = document.querySelector("#usd-input");
        let arsResult = document.querySelector("#ars-result");

        var convertedToUsd = new Intl.NumberFormat(navigator.languages).format((montoArs/blueCompra).toFixed(2));
        var convertedToArs = new Intl.NumberFormat(navigator.languages).format((montoUsd*blueVenta).toFixed(2));

        arsInput.innerHTML= montoArs;
        usdResult.innerHTML = convertedToUsd!=0 ? convertedToUsd : ''; 
        usdInput.innerHTML= montoArs;
        arsResult.innerHTML = convertedToArs!=0 ? convertedToArs : '';
    })


    // Add table row
    let tableBodyCheckChildren = document.querySelector(".table-body")
    if (tableBodyCheckChildren) {
        while (tableBodyCheckChildren.firstChild) {
            tableBodyCheckChildren.removeChild(tableBodyCheckChildren.firstChild);
        }
    }
    await addDataToTable(data);

    // Add plot
    if (listValues.length>0) {
        while (listValues.length>0) {
            listNames.pop();
            listValues.pop();
        }
    }
    await generatePlot(data);
})

// Create table row
const addDataToTable = (data) => {
    let tableBody = document.querySelector(".table-body");

    for (let i = 0; i < data.length; i++) {
        if (data[i].compra != null && data[i].venta != null) {
            let tableRow = document.createElement("tr");
    
            tableRow.innerHTML = `
                <td>Dolar ${data[i].nombre}</td>
                <td>${data[i].compra}</td>
                <td>${data[i].venta}</td>
                <td>${new Date(data[i].fechaActualizacion).toLocaleString()}</td>
            `;
    
            tableBody.appendChild(tableRow);
        }
    }
}


// Generate plot
const generatePlot = (data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].compra != null && data[i].venta != null) {
            listNames.push(data[i].nombre);
            listValues.push(data[i].compra);
        }
    }
    
    var plotData = [
        {
            x: listNames,
            y: listValues,
            type: 'bar',
            marker: {
                color: 'rgb(28, 114, 147)'
            }
        }
    ];
    const layout = {
        paper_bgcolor: 'rgba(255, 255, 255, 0)',
        plot_bgcolor: 'rgba(255, 255, 255, 0)',
        font:{
            family: 'Ubuntu, sans-serif'
        }
    };
    const config = {
        responsive: true
    };
    Plotly.newPlot('plotDiv', plotData, layout, config);
}


// DarkMode
const modeBtn = document.querySelector("#changeStateBtn");
modeBtn.addEventListener("click", () => {
    const bodyElement = document.body;
    const mainSection = document.querySelector(".main");
    const infoSection = document.querySelector(".info");
    const form = document.querySelector(".form-container");

    bodyElement.classList.toggle('dark');
    mainSection.classList.toggle('dark');
    infoSection.classList.toggle('dark');
    form.classList.toggle('dark');
})



// DateTime
const checkTime = () => {
    // Date
    var date = new Date(Date.now());

    var dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    // Time
    var format = "AM";
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Add PM-AM
    if (hours > 12) {
        if (hours > 12) hours-=12;
        format = "PM";
    }
    
    // Add 0s
    hours = (hours<10) ? "0"+hours : hours;
    minutes = (minutes<10) ? "0"+minutes : minutes;

    var timeStr = `${hours}:${minutes} ${format}`

    // console.log(dateStr);
    // console.log(timeStr);

    // Add to navbar
    const dateContainer = document.querySelector(".date-container");
    dateContainer.innerHTML= `
        <p>${dateStr}</p>
        <p>${timeStr}</p>
    `
}

checkTime();
setInterval(checkTime, 1000);