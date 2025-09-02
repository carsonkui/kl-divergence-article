import React from 'react';
import Plot from 'react-plotly.js';
import { SAMPLE_POINTS, DISTRIBUTION_PARAMS, GRAPH_SETTINGS } from '../data/constants';

// Generate Gaussian distribution data
const generateGaussianData = (mean, std, xMin, xMax, numPoints) => {
  const xData = [];
  const yData = [];
  const step = (xMax - xMin) / numPoints;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    // Gaussian PDF formula
    const y = (1 / (std * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    
    xData.push(x);
    yData.push(y);
  }
  
  return { x: xData, y: yData };
};

const GuessDistributionWithData = () => {
  
  const gaussianData = generateGaussianData(
    DISTRIBUTION_PARAMS.guess.mean, 
    DISTRIBUTION_PARAMS.guess.std, 
    GRAPH_SETTINGS.xRange[0], 
    GRAPH_SETTINGS.xRange[1], 
    GRAPH_SETTINGS.numPoints
  );
  
  
  const samples = SAMPLE_POINTS;
  
  // Calculate y-values for sample points based on Gaussian PDF
  const sampleYValues = samples.map(x => {
    const mean = DISTRIBUTION_PARAMS.true.mean;
    const std = DISTRIBUTION_PARAMS.true.std;
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });

  const guessProbabilities = samples.map(x => {
    const mean = DISTRIBUTION_PARAMS.guess.mean;
    const std = DISTRIBUTION_PARAMS.guess.std;
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });

  // multiply all probabilities together
  const totalGuessProbability = guessProbabilities.reduce((total, curr) => total * curr, 1);
  
  const plotData = [
    {
      x: gaussianData.x,
      y: gaussianData.y,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      name: 'P_guess',
      line: { color: 'rgb(140, 33, 33)' },
      fillcolor: 'rgba(255, 55, 55, 0.3)',
      hoverinfo: 'skip'
    },
    {
      x: samples,
      y: sampleYValues,
      type: 'scatter',
      mode: 'markers',
      showlegend: false,
      marker: { 
        color: 'rgba(64, 64, 64, 0.7)',
        size: 8
      },
      text: samples.map((x, i) => `x<sub>${i + 1}</sub>`),
      hovertemplate: '<b style="font-size: 150%">%{text}</b><br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>'
    }
  ];
  
  const layout = {
    width: undefined,
    height: 250,
    margin: { t: 10, r: 30, l: 40, b: 40 },
    xaxis: {
      range: [0, 10],
      dtick: 1,
      title: '',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      range: [0, 1],
      dtick: 0.2,
      title: '',
      showgrid: false,
      zeroline: false
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white'
  };
  
  const config = {
    responsive: true,
    displayModeBar: false
  };
  
  return (
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%' }}
      />
  );
};

export default GuessDistributionWithData;