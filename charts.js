function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

  // 3. Create a variable that holds the samples array. 
  var samples = data.samples;
  var metadata = data.metadata;

  // 4. Create a variable that filters the samples for the object with 
  // the desired sample number.
  var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
  var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);

  //  5. Create a variable that holds the first sample in the array.
  var samplesResult = [samplesArray[0]];

  // 6. Create variables that hold the otu_ids, otu_labels, and 
  // sample_values.
  var otu_ids = samplesResult.map(person => person.otu_ids)[0];
  var otu_labels = samplesResult.map(person => person.otu_labels)[0];
  var sample_values = samplesResult.map(person => person.sample_values)[0];
  var wfreq = metaArray.map(person => parseFloat(person.wfreq))[0];

  // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
  var xvalues = sample_values.sort((a,b) => b - a).slice(0,10).reverse();
  var filteredY = otu_ids.sort((a,b) => b - a).slice(0,10);
  var yvalues = filteredY.map(x => `OTU ${x}`);
  var hoverBar = otu_labels.sort((a,b) => b - a);

  // 8. Create the trace for the bar chart. 
  var barData = {
    x: xvalues,
    y: yvalues,
    type: "bar",
    orientation: "h",
    text: hoverBar,
    marker: {
      color: 'lightsalmon'
    }
  };

  var barData = [barData];

  // 9. Create the layout for the bar chart. 
  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    paper_bgcolor: "powderblue",
  };

  // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot("bar", barData, barLayout);

  // 1. Create the trace for the bubble chart.
  var bubbleData = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      sizeref: 0.009,
      sizemode: 'area',
      color: otu_ids
      }
  };

  var bubbleData = [bubbleData]

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      paper_bgcolor: "pink",

  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


  var gaugeData = [
    {
      domain: {x: [0, 10], y: [0, 10]},
      value: wfreq,
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        range: [null, 10],
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "lightcoral"},
          {range: [2, 4], color: "lightsalmon"},
          {range: [4, 6], color: "bisque"},
          {range: [6, 8], color: "mediumaquamarine"},
          {range: [8, 10], color: "thistle"}
        ]  
      },
  }];

  var gaugeLayout = {
    paper_bgcolor: "lightsteelblue",
  };

  Plotly.newPlot("gauge", gaugeData, gaugeLayout); 

});

};
