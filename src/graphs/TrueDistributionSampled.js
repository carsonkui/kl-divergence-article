import React, { useState, useEffect, useRef } from 'react';
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

const TrueDistributionSampled = () => {
  const MAX_N = SAMPLE_POINTS.length;
  const [n, setN] = useState(MAX_N);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  
  
  const gaussianData = generateGaussianData(
    DISTRIBUTION_PARAMS.true.mean, 
    DISTRIBUTION_PARAMS.true.std, 
    GRAPH_SETTINGS.xRange[0], 
    GRAPH_SETTINGS.xRange[1], 
    GRAPH_SETTINGS.numPoints
  );
  
  // Animation effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setN(prevN => {
          if (prevN >= MAX_N) {
            setIsPlaying(false);
            return MAX_N;
          }
          return prevN + 1;
        });
      }, 50); // Adjust speed here (milliseconds between steps)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);
  
  const handlePlayPause = () => {
    if (n >= MAX_N) {
      setN(0);
    }
    setIsPlaying(!isPlaying);
  };
  
  // Get the first n sample points
  const visibleSamples = SAMPLE_POINTS.slice(0, n);
  
  // Calculate y-values for sample points based on Gaussian PDF
  const sampleYValues = visibleSamples.map(x => {
    const mean = DISTRIBUTION_PARAMS.true.mean;
    const std = DISTRIBUTION_PARAMS.true.std;
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });

  // multiply all probabilities together
  const totalLikelihood = sampleYValues.reduce((total, curr) => total * curr, 1);
  const totalLikelihoodString = totalLikelihood.toExponential(2).replace('e-', ' x 10<sup>-') + '</sup>';
  
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
    annotations: [
      {
        text: 'total likelihood = ' + totalLikelihoodString,
        xref: 'paper',
        yref: 'paper',
        x: 1,
        y: 0.5,
        xanchor: 'right',
        yanchor: 'top',
        showarrow: false,
        font: {
          size: 12,
          color: 'rgb(33, 140, 33)'
        }
      }
    ],
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
      <div >
        <input
            type="range"
            min="0"
            max={MAX_N}
            value={n}
            onChange={(e) => {
              setN(parseInt(e.target.value));
              setIsPlaying(false);
            }}
            style={{
              width: '100%',
              height: '5px',
              borderRadius: '5px',
              outline: 'none',
              background: '#ddd',
              cursor: 'pointer'
            }}
        />

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '10px', gap: '15px' }}>
          <button
            onClick={handlePlayPause}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              minWidth: '70px'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <label style={{ fontSize: '14px', color: '#333' }}>
            n = {n}
          </label>
        </div>

      </div>
    </div>
  );
};

export default TrueDistributionSampled;