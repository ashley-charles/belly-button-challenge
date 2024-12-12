// URL for the JSON data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Initialize the dashboard
function init() {
    // Fetch the JSON data
    d3.json(url).then(data => {
        // Get the list of sample names
        const sampleNames = data.names;

        // Select the dropdown menu
        const dropdown = d3.select("#selDataset");

        // Populate the dropdown with sample names
        sampleNames.forEach(sample => {
            dropdown.append("option").text(sample).property("value", sample);
        });

        // Display the data for the first sample in the list
        const firstSample = sampleNames[0];
        updateMetadata(firstSample); // Populate the demographic info
        buildCharts(firstSample);    // Build the charts
    }).catch(error => {
        console.error("Error initializing the dashboard:", error);
    });
}

// Function to update metadata
function updateMetadata(sample) {
    // Fetch the JSON data
    d3.json(url).then(data => {
        // Get the metadata field
        const metadata = data.metadata;

        // Filter the metadata for the object with the desired sample number
        const filteredMetadata = metadata.filter(obj => obj.id == sample)[0];

        // Use d3 to select the panel with id of `#sample-metadata`
        const metadataPanel = d3.select("#sample-metadata");

        // Use `.html("")` to clear any existing metadata
        metadataPanel.html("");

        // Inside a loop, append new tags for each key-value pair
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    }).catch(error => {
        console.error("Error fetching or processing metadata:", error);
    });
}

// Function to build charts
function buildCharts(sample) {
    // Fetch the JSON data
    d3.json(url).then(data => {
        // Get the samples field
        const samples = data.samples;

        // Filter the samples for the object with the desired sample number
        const filteredSample = samples.filter(obj => obj.id == sample)[0];

        // Get the otu_ids, otu_labels, and sample_values
        const otuIds = filteredSample.otu_ids;
        const otuLabels = filteredSample.otu_labels;
        const sampleValues = filteredSample.sample_values;

        // Build a Bubble Chart
        const bubbleTrace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth'
            }
        };

        const bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            xaxis: { title: "OTU ID" },
            hovermode: "closest"
        };

        // Render the Bubble Chart
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

        // Build a Bar Chart
        const barTrace = {
            x: sampleValues.slice(0, 10).reverse(),
            y: yticks,
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        const barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t: 30, l: 150 }
        };

        // Render the Bar Chart
        Plotly.newPlot("bar", [barTrace], barLayout);
    }).catch(error => {
        console.error("Error fetching or processing data for charts:", error);
    });
}

// Function for event listener
function optionChanged(newSample) {
    // Update metadata and charts when a new sample is selected
    updateMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
