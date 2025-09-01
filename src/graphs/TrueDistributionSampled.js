import React, { useState } from 'react';
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

const TrueDistributionSampled = () => {
  const [n, setN] = useState(0);
  const samplePoints = [2.758, 3.289, 3.196, 2.735, 3.343, 2.933, 3.39, 3.304, 3.066, 2.75, 3.133, 2.676, 3.2, 2.884, 3.447, 2.978, 2.894, 2.145, 3.806, 3.586];
  
  const gaussianData = generateGaussianData(3, 0.5, 0, 10, 100);
  
  // Get the first n sample points
  const visibleSamples = samplePoints.slice(0, n);
  
  // Calculate y-values for sample points based on Gaussian PDF
  const sampleYValues = visibleSamples.map(x => {
    const mean = 3;
    const std = 0.5;
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });
  
  const plotData = [
    {
      x: gaussianData.x,
      y: gaussianData.y,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      name: 'P_true',
      line: { color: '#4CAF50' },
      fillcolor: 'rgba(76, 175, 80, 0.3)',
      hoverinfo: 'skip'
    },
    {
      x: visibleSamples,
      y: sampleYValues,
      type: 'scatter',
      mode: 'markers',
      showlegend: false,
      marker: { 
        color: 'rgba(64, 64, 64, 0.7)',
        size: 8
      },
      text: visibleSamples.map((x, i) => `x<sub>${i + 1}</sub>`),
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
    <div>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        style={{ width: '100%' }}
      />
      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#333' }}>
          n = {n}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '5px',
            borderRadius: '5px',
            outline: 'none',
            background: '#ddd',
            cursor: 'pointer'
          }}
        />
      </div>
    </div>
  );
};

export default TrueDistributionSampled;