
    // Load data from the provided URL
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
      // Extract the relevant data
      const samples = data.samples;
      const names = data.names;
      

      // Populate the dropdown menu with sample IDs
      const dropdown = d3.select("#selDataset");
      names.forEach(name => {
        dropdown.append("option").attr("value", name).text(name);
      });

      // Define the optionChanged function
      function optionChanged(selectedValue) {
      // Add your code here to handle the selected value
      console.log("Selected value:", selectedValue);
      }

      // Attach the event listener to the dropdown
      //const dropdown = d3.select("#selDataset");
      dropdown.on("change", function () {
      const selectedValue = dropdown.property("value");
      optionChanged(selectedValue); // Call the optionChanged function with the selected value
      });


      // Create a function to update the bar chart based on the selected sample
      function updateBarChart(selectedSample) {
        const sample = samples.find(sample => sample.id === selectedSample);

        const sampleValues = sample.sample_values.slice(0, 10).reverse();
        const otuIds = sample.otu_ids.slice(0, 10).reverse();
        const otuLabels = sample.otu_labels.slice(0, 10).reverse();

        const trace = {
          type: "bar",
          x: sampleValues,
          y: otuIds.map(id => `OTU ${id}`),
          text: otuLabels,
          orientation: "h"
        };

        const layout = {
          title: `Top 10 OTUs for Sample ${selectedSample}`,
          xaxis: { title: "Sample Values" },
          yaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bar", [trace], layout);
      }

      // Initialize the chart with the first sample
      updateBarChart(names[0]);

      // Set up an event listener to update the chart when a different sample is selected
      dropdown.on("change", function() {
        const selectedSample = dropdown.property("value");
        updateBarChart(selectedSample);
      });
      // Function to update the sample metadata on the page
      function updateSampleMetadata(selectedSample) {
      // Fetch the metadata for the selected sample
      const metadata = data.metadata.find(item => item.id == selectedSample);

      // Select the metadata div element by its ID
      const metadataDiv = d3.select("#sample-metadata");

      // Clear the previous metadata content
      metadataDiv.html("");

      // Iterate through the key-value pairs in the metadata and display them
      Object.entries(metadata).forEach(([key, value]) => {
     metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

function updateBubbleChart(selectedSample) {
  const sample = samples.find(sample => sample.id === selectedSample);

  const otuIds = sample.otu_ids;
  const sampleValues = sample.sample_values;
  const markerSize = sampleValues;
  const markerColors = otuIds;
  const textValues = sample.otu_labels;

  const trace = {
    x: otuIds,
    y: sampleValues,
    text: textValues,
    mode: "markers",
    marker: {
      size: markerSize,
      color: markerColors,
      colorscale: "Jet", // Adjust the colorscale as desired
      opacity: 0.5,
    },
  };

  const layout = {
    title: `Bubble Chart for Sample ${selectedSample}`,
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    showlegend: false, // Hide the legend
  };

  Plotly.newPlot("bubble", [trace], layout);
}


// Set up an event listener to update the sample metadata when a different sample is selected
dropdown.on("change", function () {
  const selectedSample = dropdown.property("value");
  updateSampleMetadata(selectedSample);
  updateBarChart(selectedSample);
  updateBubbleChart(selectedSample);// Optionally update the chart as well
});


    });
  