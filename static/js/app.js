// Function to pull names from json file and add them in the filter

var drawChart = function(x_data, y_data, hoverText, metadata) {


  var metadata_panel = d3.select("#sample-metadata");
  metadata_panel.html("");
  Object.entries(metadata).forEach(([key, value]) => {
      metadata_panel.append("p").text(`${key}: ${value}`);
  });

  var trace = {
      x: x_data,
      y: y_data,
      text: hoverText,
      type: 'bar',
      orientation: 'h'
  };

  var data = [trace];

  Plotly.newPlot('bar', data);

  var trace2 = {
      x: x_data,
      y: y_data,
      text: hoverText,
      mode: 'markers',
      marker: {
          size: y_data,
          color: x_data
      }
  };

  var data2 = [trace2];

  Plotly.newPlot('bubble', data2);


};

var populateDropdown = function(names) {

  var selectTag = d3.select("#selDataset");
  var options = selectTag.selectAll('option').data(names);

  options.enter()
      .append('option')
      .attr('value', function(d) {
          return d;
      })
      .text(function(d) {
          return d;
      });

};

var optionChanged = function(newValue) {

  d3.json("data/samples.json").then(function(data){
        console.log(data);
     })

  sample_new = data["samples"].filter(function(sample) {

      return sample.id == newValue;

  });
  
  metadata_new = data["metadata"].filter(function(metadata) {

      return metadata.id == newValue;

  });
  
  
  x_data = sample_new[0]["otu_ids"];
  y_data = sample_new[0]["sample_values"];
  hoverText = sample_new[0]["otu_labels"];
  
  console.log(x_data);
  console.log(y_data);
  console.log(hoverText);
  
  drawChart(x_data, y_data, hoverText, metadata_new[0]);
  });
};

d3.json("data/samples.json").then(function(data) {

  //Populate dropdown with names
  populateDropdown(data["names"]);

  //Populate the page with the first value
  x_data = data["samples"][0]["otu_ids"];
  y_data = data["samples"][0]["sample_values"];
  hoverText = data["samples"][0]["otu_labels"];
  metadata = data["metadata"][0];

  //Draw the chart on load
  drawChart(x_data, y_data, hoverText, metadata);


});
