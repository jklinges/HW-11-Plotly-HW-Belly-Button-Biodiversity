var sampleData;

// Load in the Data
d3.json("static/data/samples.json").then(data => {
    d3.select("#selDataset").html(data.names.map((key, values) => `<option value="${values}">${key}</option>`).join(""));
    sampleData = data;
    // Default visualizations for ID 940 (indexLocation = 0)
    selectID(0);
});

// Event handler for User Selection
function selectID(indexLocation) {
  populateDemographics(indexLocation);
  populateBarChart(indexLocation);
  populateGauge(indexLocation);
  populateScatter(indexLocation);
}

// Populate Demographic Information
function populateDemographics(indexLocation) {
  let demographicSubdata = Object.entries(sampleData.metadata[indexLocation]).map((entry) =>
  `${entry[0]}:${entry[1]}`).slice(1,6);

  // https://www.d3indepth.com/enterexit/
  let userSelection = d3.select("#sample-metadata").selectAll("li").data(demographicSubdata);
  userSelection.enter()
    .append("li")
    .merge(userSelection)
    .text(function(d) {return d;});
  userSelection.exit().remove();
}

// Populate Horizontal Bar Chart
function populateBarChart(indexLocation) {
  let sampleID = sampleData.samples[indexLocation]['otu_ids'].slice(0,10).map(id => "OTU-"+String(id));
  let sampleName = sampleData.samples[indexLocation]['otu_labels'].slice(0,10);
  let sampleCount = sampleData.samples[indexLocation]['sample_values'].slice(0,10);

  while (sampleCount.length < 10) {
    sampleCount.push(0.0);
    sampleID.push(" ".repeat(sampleCount.length));
    sampleName.push("");
  }

  var trace1 = {
    type: "bar",
    orientation: "h",
    x: sampleCount.reverse(),
    y: sampleID.reverse(),
    text: sampleName.reverse()
  };

  var data = [trace1];
  var layout = {title:"Most Prominent Bacteria"};

  Plotly.newPlot("bar", data, layout)
}

// Populate Gauge Chart
function populateGauge(indexLocation) {
  let washCount = Math.round(sampleData.metadata[indexLocation].wfreq);

  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washCount,
      title: "Number of Belly Button Washes",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: {color: "rgba(0,0,0,1.0)"},
        steps: [
          // RGBA values collected from MS Paint dropper tool
          { range: [0, 1], color: "rgba(248,243,236,1.00)" },
          { range: [1, 2], color: "rgba(244,241,229,1.00)" },
          { range: [2, 3], color: "rgba(233,230,202,1.00)" },
          { range: [3, 4], color: "rgba(229,231,179,1.00)" },
          { range: [4, 5], color: "rgba(213,228,157,1.00)" },
          { range: [5, 6], color: "rgba(183,204,146,1.00)" },
          { range: [6, 7], color: "rgba(140,191,136,1.00)" },
          { range: [7, 8], color: "rgba(138,187,143,1.00)" },
          { range: [8, 9], color: "rgba(133,180,138,1.00)" }
        ],
      }
    }
  ];

  var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

  // Draw the Needle for the Gauge Chart
  // Thanks to Vincent Heningburgh (@GabrielUSMC) for
  // the offsetX1 and offsetY1 equations.
  let offsetX1 = 0.5*Math.cos(Math.PI-washCount*Math.PI/9);
  let offsetY1 = 0.5*Math.sin(Math.PI-washCount*Math.PI/9);
  layout.shapes = [{
    type: "line",
    x0: 0.50,
    y0: 0.25,
    x1: 0.50 + offsetX1,
    y1: 0.25 + offsetY1,
    line: {
      color: 'rgba(225,15,25,1.00)',
      width: 10
    }
  }]

  Plotly.newPlot('gauge', data, layout);
}

// Populate the Scatter Plot
// https://www.youtube.com/watch?v=M2s2jowLkUo
function populateScatter(indexLocation) {
  let sampleCount = sampleData.samples[indexLocation]['sample_values'];
  let sampleID = sampleData.samples[indexLocation]['otu_ids'];
  let sampleName = sampleData.samples[indexLocation]['otu_labels']

  var trace1 = {
    type: "scatter",
    mode: "markers",
    x: sampleID,
    y: sampleCount,
    text: sampleName,
    marker: {
      size: sampleCount.map(c => 0.75*c),
      // https://www.w3schools.com/cssref/func_hsla.asp
      color: sampleID.map(id => `hsla(${0.075*id},100%,50%,1.0)`)
    }
  };

  Plotly.newPlot("bubble", [trace1])
}

