// create variables that allow both global and local access
var names = [];
var metadata = [];
var samples = []

// pull in the JSON data file, load data into variables, 
d3.json("samples.json").then((data) => {
    // load data variable, used globally
    names = data.names;
    metadata = data.metadata;
    samples = data.samples;
    var selOption = d3.select("#selDataset");  // capture input for change and value changed to

    // add the ids (names data) to the drop down to allow user to change person in test
    Object.entries(names).forEach(([index, name])=> {
        var cell = selOption.append("option");    // create option element
        cell.text(name);                        // update text of the option element
    });  
    optionChanged(940);
});

// functions to create the 4 data visualization on index.html, reference   https://plot.ly/javascript/
function optionChanged(selected) {
    setDemographic(selected);
    barPlot(selected);
    bubbleChart(selected);
    guageChart(selected);
};  

// create the drop down and populate the demographics list on index.html
function setDemographic(selectedId){
    var personalData = metadata.filter(function(person){  // parse the data
        return person.id == selectedId;
    });
    var id = personalData[0].id;
    var ethnicity = personalData[0].ethnicity;
    var gender = personalData[0].gender;
    var age = personalData[0].age;
    var location = personalData[0].location;
    var bbtype = personalData[0].bbtype;
    var wfreq = personalData[0].wfreq;

    // Select the unordered list element by class name
    var list = d3.select("#sample-metadata");

    // remove any children from the list
    list.html("");

    // append stats to the list 'Demographic Info' of index.html
    list.append("h5").text(`id: ${id}`);
    list.append("h5").text(`ethnicity: ${ethnicity}`);
    list.append("h5").text(`gender: ${gender}`);
    list.append("h5").text(`age: ${age}`);
    list.append("h5").text(`location: ${location}`);
    list.append("h5").text(`bbtype: ${bbtype}`);
    list.append("h5").text(`wfreq: ${wfreq}`);
}

// // create horizontal bar chart and place it in index.html
function barPlot(selectedId){
    var sampleData = samples.filter(function(sample){  // parse the data
        return sample.id == selectedId;
    });
    
    otu = sampleData[0].otu_ids.slice(0,10);    // getting the top 10 bacteria
    otu = otu.map(id => `OTU  ${id}`);          // creating text string
    otu = otu.reverse();                        // reverse order, largest value on top
    samp_values = sampleData[0].sample_values.slice(0,10);  // same steps as otu variable
    samp_values = samp_values.reverse();

    var trace = {
        x: samp_values,
        y: otu,
        type: 'bar',  
        orientation: 'h',
          };

    var layout = {
        title: 'Top 10 OTUs',
        };

    Plotly.newPlot("bar", [trace], layout);
};

// create bubble chart and place it in index.html
//https://images.plot.ly/plotly-documentation/images/plotly_js_cheat_sheet.pdf?_ga=2.115454466.525573211.1607557400-742152575.1603234155
function bubbleChart(selectedId){
    var sampleData = samples.filter(function(sample){  // parse the data for correct id
        return sample.id == selectedId;
    });
    otu = sampleData[0].otu_ids;                        // should be only one value in list
    samp_values = sampleData[0].sample_values;
    textBar = otu.map(id => `OTU  ${id}`);              // OTU text to display on hover

    var trace1 = {
        x: otu,
        y:samp_values,
        mode:'markers',
        text: textBar,
        marker: {
            color: otu,
            colorscale: 'Jet',
            type: 'heatmap',
            size: samp_values
        },
    };

    var layout = {
        title: '',
        showlegend: false,
        height: 600,
        width: 1250
      };

    Plotly.newPlot('bubble', [trace1], layout);
};

// create the gauge chart and place in index.html
function guageChart(selectedId) {
    var personalData = metadata.filter(function(person){    // parse the data
        return person.id == selectedId;                     // checking a string number with and integer (also a number)
    });
    var wfreq = personalData[0].wfreq;
    
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0, 9]},
                bar: { color: "blue" },
            steps: [
                {range:[0,1], color:"#000000"},
                {range:[1,2], color:"#2F4F4F"},
                {range:[2,3], color:"#708090"},
                {range:[3,4], color:"#696969"},
                {range:[4,5], color:"#808080"},
                {range:[5,6], color:"#A9A9A9"},
                {range:[6,7], color:"#C0C0C0"},
                {range:[7,8], color:"#D3D3D3"},
                {range:[8,9], color:"#DCDCDC"}
            ],
            }
        }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } }; 
    
    Plotly.newPlot('gauge', data, layout);
}