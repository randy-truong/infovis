
Promise.all([
    d3.csv('assets/data/20162020COANDO3.csv'),
    //d3.json('https://gist.githubusercontent.com/mheydt/29eec003a4c0af362d7a/raw/d27d143bd75626647108fc514d8697e0814bf74b/us-states.json'),
    d3.json('assets/data/us-states.json'),
]).then(ready);

// Load the data
function ready(data) {

    console.log('data');
    const co_data = data[0];
    console.log(co_data);

    console.log('map');
    const map_features = data[1];
    console.log(map_features);

    // Number of dates
    let unique_keys = [...new Set(co_data.map(d => d["Date_Keys"]))];
    let date_string = [...new Set(co_data.map(d => d["Date"]))];

    const numMonths = unique_keys.length-1;
    const startMonth = +unique_keys[0];
    const valRange = [0, 10, 40];
    const color = "Mean_AQI";


    // List of states
    const states = ["Alaska","Alabama","Arkansas","Arizona","California","Colorado","Connecticut",
        "District of Columbia","Delaware","Florida","Georgia","Hawaii","Iowa","Idaho","Illinois","Indiana",
        "Kansas","Kentucky","Louisiana","Massachusetts","Maryland","Maine","Michigan","Minnesota","Missouri",
        "Mississippi","Montana","North Carolina","North Dakota","Nebraska","New Hampshire","New Jersey",
        "New Mexico","Nevada","New York","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
        "South Dakota","Tennessee","Texas","Utah","Virginia","Vermont","Washington","Wisconsin","West Virginia","Wyoming"];

    // List of months
    // Uppercase
    /*
    const months = ["Default", "January", "February", "March", "April",
                    "May", "June", "July", "August",
                    "September", "October", "November", "December"];
    */

    // Lowercase
    const months = ["DEFAULT", "JANUARY", "FEBRUARY", "MARCH", "APRIL",
        "MAY", "JUNE", "JULY", "AUGUST",
        "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    // Set width and heights
    let w = 864;
    let h = 486;

    let disclaimer = d3.select("body")
        .append("svg")
        .attr("width", w + w/3 + 5)
        .attr("height", h/5);

    disclaimer.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    disclaimer.append("svg:foreignObject")
        .attr("width", w + w/3 + 5)
        .attr("height", 20)
        .attr("y", 15)
        .append("xhtml:span")
        .attr("id", `disclaimer`);

    disclaimer.append("svg:foreignObject")
        .attr("width", w + w/3 + 5)
        .attr("height", h/5)
        .attr("y", 15)
        .append("xhtml:div")
        .attr("style", "margin: 20px;")
        .attr("id", `disclaimer-info`);

    d3.select("#disclaimer").text("DISCLAIMER");
    d3.select("#disclaimer-info")
        .html("The following system may be potentially misleading and/or a black hat visualization. " +
            "According to <a href='https://www.airnow.gov/aqi/aqi-basics/'>AirNow.gov</a>, good air quality " +
            "with little risk concerns falls between 0 and 50 AQI values. " +
            "Missing AQI data were handled trivially by changing NaN to 0.0. The following were affected: Oregon/2017-05, Delaware/2017-06, Kansas/2018-07, Mississippi/2018-10, and Illinois/2020-09. " +
            "Finally, data wrangling methods included setting the monthly AQI mean as the mean of daily AQI means, which may not accurately represent AQI information. ")
    //.text("The following system may be potentially misleading and/or a black hat visualization. ");


    let svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    // The slider
    svg.append("svg:foreignObject")
        .attr("width", 200)
        .attr("height", 30)
        .attr("y", `${h-40}px`)
        .attr("x", `${w-200}px`)
        .append("xhtml:div")
        .attr("id", "container")
        .append("xhtml:input")
        .attr("id", "slider")
        .attr("type", "range")
        .attr("min", "0")
        .attr("step", "1")
        .attr("value", "0")

    // The date
    svg.append("svg:foreignObject")
        .attr("width", 60)
        .attr("height", 20)
        .attr("y", `${h-60}px`)
        .attr("x", `${w-75}px`)
        .append("xhtml:span")
        .attr("id", "date");

    svg.append("svg:foreignObject")
        .attr("width", 80)
        .attr("height", 20)
        .attr("y", `${h-60}px`)
        .attr("x", `${w-160}px`)
        .append("xhtml:span")
        .attr("id", "date-month");

    // The right column
    let right_column = d3.select("body")
        .append("svg")
        .attr("width", w/3)
        .attr("height", h)
        .attr("style", "margin-left: 5px;");

    // The information panel
    let information = right_column
        .append("svg")
        .attr("width", w/3)
        .attr("height", h/2 - 2.5)
        .attr("style", "margin-bottom: 2.5px;");

    information.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 15)
        .append("xhtml:span")
        .attr("id", `information`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 45)
        .append("xhtml:span")
        .attr("id", `info-date`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 65)
        .append("xhtml:span")
        .attr("id", `info-state`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 85)
        .append("xhtml:span")
        .attr("id", `info-aqi`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 105)
        .append("xhtml:span")
        .attr("id", `info-aqi-co`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 125)
        .append("xhtml:span")
        .attr("id", `info-aqi-o3`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 145)
        .append("xhtml:span")
        .attr("id", `info-co`);

    information.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 165)
        .append("xhtml:span")
        .attr("id", `info-o3`);

    d3.select("#information").text("INFORMATION");

    // The pollutants breakdown panel
    let breakdown = right_column
        .append("svg")
        .attr("width", w/3)
        .attr("height", h/2 - 2.5)
        .attr("y", h/2 + 2.5)
        .attr("style", "margin-top: 2.5px;");

    breakdown.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    breakdown.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 15)
        .append("xhtml:span")
        .attr("id", "breakdown");

    breakdown.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 210)
        .append("xhtml:span")
        .attr("id", "breakdown-title");

    d3.select("#breakdown").text("POLLUTANTS BREAKDOWN");

    // The chart in the Breakdown panel
    var barchart = breakdown.append("svg")
        .attr("width", w/3)
        .attr("height", h/2 + 2.5 - 40)
        .attr("x", 25)
        .attr("y", 40)

    var barchart_dim = barchart.node().getBoundingClientRect();

    var bd_margin = {top: 10, right: 40, bottom: 30, left: 30},
        bd_width = barchart_dim.width - bd_margin.left - bd_margin.right,
        bd_height = barchart_dim.height - bd_margin.top - bd_margin.bottom;


    // The bottom panel with History
    let bottom_panel = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h/3);

    bottom_panel.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    bottom_panel.append("svg:foreignObject")
        .attr("width", w)
        .attr("height", 20)
        .attr("y", 15)
        .append("xhtml:span")
        .attr("id", "history");

    d3.select("#history").text("HISTORY");


    // The resources panel
    let citations = d3.select("body")
        .append("svg")
        .attr("width", w/3)
        .attr("height", h/3)
        .attr("style", "margin-left: 5px;");

    citations.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f3f3f3");

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 10)
        .append("xhtml:span")
        .append("text")
        .text("Resources:")

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 30)
        .append("xhtml:span")
        .append("text")
        .text("d3.js; d3-geo lib; d3-legend lib")

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 60)
        .append("xhtml:span")
        .append("text")
        .text("Code Referenced:")

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 80)
        .append("xhtml:span")
        .html("<a href='https://stackoverflow.com/questions/64564973/creating-a-range-slider-dates-for-a-choropleth-map'>stackoverflow Q#64564973</a>")

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 110)
        .append("xhtml:span")
        .append("text")
        .text("Data Source:")

    citations.append("svg:foreignObject")
        .attr("width", w/3)
        .attr("height", 20)
        .attr("y", 130)
        .append("xhtml:span")
        .html("<a href='https://www.epa.gov/outdoor-air-quality-data/download-daily-data'>epa.gov (daily air quality data)</a>")


    // Link slider to updating key
    d3.select("#slider")
        .attr("max", numMonths)
        .on("input", function() {
            var key = +startMonth + 1*this.value;
            //console.log(key);
            update(key);
        });

    // Color scaling
    const colorMap = d3.scaleLinear()
        .domain(valRange)
        .range(["#c8e1e8", "#a7c9d2", "#111111"]);


    // Visualize the map and update the slider
    render(map_features);
    update(startMonth);


    // The legend
    var legend = d3.legendColor().scale(colorMap);

    svg.append("g")
        .attr("style", `font-size:${10}px;`)
        .attr("transform", `translate(${w-65},${(h/2)-40})`)
        .call(legend);

    // Get specific data by the state
    function getStateMetrics(stats, state_name) {
        for (var i = 0; i < stats.length; i++) {
            if (stats[i].State_Fixed == state_name) {
                return stats[i];
            }
        }
    }

    // Renders the map once
    function render(map) {
        const projection = d3.geoAlbersUsa()
            .translate([w / 2, h / 2]) // translate to center of screen
            .scale([900]);

        // Define path generator
        const path = d3.geoPath().projection(projection);

        svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(map.features.filter(d => states.includes(d.properties.name)))
            .enter().append("path")
            .attr("d", path);
    }

    // This function builds the chart in the Breakdown panel
    function buildBars(data) {

        const bd_data = [ {CO: +data.DM8CO_Concentration, O3: +data.DM8O3_Concentration} ];
        const bd_labels = ["CO", "O3"];

        var graph = barchart
            .append("g")
            .attr("transform", `translate(${bd_margin.left},${bd_margin.top})`)
            .attr("class", "bd-chart")

        var bd_x = d3.scalePoint()
            .domain(bd_labels)
            .range([0, barchart_dim.width*2/3])
            .padding((barchart_dim.width*2/3)/3);

        graph.append('g')
            .attr("transform", `translate(0,${barchart_dim.height*2/3})`)
            .call(d3.axisBottom(bd_x));

        var bd_y = d3.scaleLinear()
            .domain([0, 1])
            .range([barchart_dim.height*2/3, 0]);

        graph.append("g")
            .call(d3.axisLeft(bd_y));

        graph
            .selectAll("points")
            .data(bd_data)
            .enter()
            .append("circle")
            .attr("cx", bd_x("CO"))
            .attr("cy", bd_y(bd_data[0].CO))
            .attr("r", 7)
            .attr("fill", "#222222")

        graph
            .selectAll("points")
            .data(bd_data)
            .enter()
            .append("circle")
            .attr("cx", bd_x("O3"))
            .attr("cy", bd_y(bd_data[0].O3))
            .attr("r", 7)
            .attr("fill", "#222222")

    }


    // Function to display state history
    function buildState(state, data) {
        const passedState = state.State_Fixed;
        const passedDate = state.Date;

        const specific_data = co_data.filter(function(row) {
            return row.State_Fixed === passedState && row.Date.slice(-2) === passedDate.slice(-2)
        });

        for (var i = 0; i < specific_data.length; i++) {

            let history = bottom_panel
                .append("svg")
                .attr("y", h/6 * 1/2)
                .attr("width", w/6)
                .attr("class", "state-hist")
                .attr("x", i*w/5 +15)
                .attr("height", h/6);

            history.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "#f3f3f3");

            const projection = d3.geoAlbersUsa()
                .translate([w / 12, h / 12])
                .scale([1]);

            const path = d3.geoPath().projection(projection);

            var feature = [data];
            projection.fitSize([w/6, h/6], feature[0]);

            history.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(feature)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", function(d) {
                    const rate = specific_data[i].Mean_AQI
                    return colorMap(rate);
                });

            let caption = bottom_panel.append("svg:foreignObject")
                .attr("y", h/4 + 10)
                .attr("width", 60)
                .attr("class", "state-hist")
                .attr("x", i*w/5 + 60)
                .attr("height", 20)
                .append("xhtml:span")
                .attr("id", `date-${i}`);;

            d3.select(`#date-${i}`).text(specific_data[i].Date.slice(0,4));

        }

    }

    // Update the map with the data for the selected date
    function update(date) {
        const stats = co_data.filter(function(row) {
            return +row.Date_Keys === +date;
        });

        d3.select("#date").text(date_string[+date]);
        d3.select("#date-month").text(months[+(date_string[+date].slice(-2))]);

        svg.selectAll("path")
            .attr("fill", function(d) {
                const rate = getStateMetrics(stats, d.properties.name)[color];

                return colorMap(rate);
            })
            .on("mouseover", function(d) {
                const stateMetrics = getStateMetrics(stats, d.properties.name);

                d3.select("#info-date").text("Date: " + stateMetrics.Date);
                d3.select("#info-state").text("State: " + stateMetrics.State_Fixed);
                d3.select("#info-aqi").text("Daily CO & O3 AQI (Mean): " + (+stateMetrics.Mean_AQI).toFixed(3));
                d3.select("#info-aqi-co").text("Daily CO AQI (Mean): " + (+stateMetrics.CO_AQI).toFixed(3));
                d3.select("#info-aqi-o3").text("Daily O3 AQI (Mean): " + (+stateMetrics.O3_AQI).toFixed(3));
                d3.select("#info-co").text("Daily Max CO Conc. (Mean): " + (+stateMetrics.DM8CO_Concentration).toFixed(3) + " ppm");
                d3.select("#info-o3").text("Daily Max O3 Conc. (Mean): " + (+stateMetrics.DM8O3_Concentration).toFixed(3) + " ppm");

                d3.select("#breakdown-title").text("Mean Concentration");
                buildBars(stateMetrics);

            })
            .on("mouseout", function(d) {
                d3.select("#info-date").text("");
                d3.select("#info-state").text("");
                d3.select("#info-aqi").text("");
                d3.select("#info-aqi-co").text("");
                d3.select("#info-aqi-o3").text("");
                d3.select("#info-co").text("");
                d3.select("#info-o3").text("");

                d3.select("#breakdown-title").text("");
                d3.selectAll('.bd-chart').remove()

            })
            .on("mousedown", function(event, d) {
                d3.select(this)
                    .style("fill", "#efd06c");
                state_data = getStateMetrics(stats, this.__data__.properties.name);

                buildState(state_data, this.__data__);

            })
            .on("mouseup", function(event, d) {

                d3.select(this)
                    .style("fill", function(d) {
                        const rate = getStateMetrics(stats, d.properties.name);
                        return update(+rate.Date_Keys)

                    });

                d3.selectAll('.state-hist').remove()
            });
    }

}