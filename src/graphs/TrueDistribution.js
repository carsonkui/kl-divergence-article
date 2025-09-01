import React from 'react';
import Plot from 'react-plotly.js';

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

const TrueDistribution = () => {
  const data = generateGaussianData(3, 0.5, 0, 10, 100);
  
  const plotData = [
    {
      x: data.x,
      y: data.y,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      name: 'P_true',
      line: { color: '#4CAF50' },
      fillcolor: 'rgba(76, 175, 80, 0.3)'
    }
  ];
  
  const layout = {
    width: undefined,
    height: 200,
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

export default TrueDistribution;