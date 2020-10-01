//reading json data file
d3.json("samples.json").then(function(data){console.log(data)});

//Building Metadata Panel
function buildMetadata(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultarray = metadata.filter(sampleobject => sampleobject.id == sample);
        var result = resultarray[0]
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
}

function buildCharts(sample) {

    // Use `d3.json` to fetch the sample data for the plots
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultarray= samples.filter(sampleobject => sampleobject.id == sample);
      var result = resultarray[0]
  
      var ids = result.otu_ids;
      var labels = result.otu_labels;
      var values = result.sample_values;

      //  Build a bar Chart
    var bar_data =[
        {
         y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
         x:values.slice(0,10).reverse(),
         text:labels.slice(0,10).reverse(),
         type:"bar",
         orientation:"h"

      }
     ];

  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);

    // Build a Bubble Chart using the sample data
    var LayoutBubble = {
        margin: { t: 0 },
        xaxis: { title: "Id's" },
        hovermode: "closest",
        };
  
        var DataBubble = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            size: values,
            }
        }
      ];
  
      Plotly.plot("bubble", DataBubble, LayoutBubble);

});
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var Names = data.names;
        Names.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = Names[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();