import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { SAMPLE_POINTS, DISTRIBUTION_PARAMS, GRAPH_SETTINGS } from '../data/constants';

const Plot = createPlotlyComponent(Plotly);


const CompareTrajectory = () => {
  const MAX_N = SAMPLE_POINTS.length;
  const [n, setN] = useState(Math.floor(MAX_N / 2));
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  
  

  
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


  const mean = DISTRIBUTION_PARAMS.true.mean;
  const std = DISTRIBUTION_PARAMS.true.std;
  const mean_guess = DISTRIBUTION_PARAMS.guess.mean;
  const std_guess = DISTRIBUTION_PARAMS.guess.std;



  // Calculate total likelihood for each number of data points - TRUE distribution
  const y_values = [];
  for (let i = 1; i <= n; i++) {
    let total_likelihood = 1;
    for (let j = 1; j <= i; j++) {
        total_likelihood = (total_likelihood * 
            (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((SAMPLE_POINTS[j-1] - mean) / std, 2))
        );
    }
    y_values.push(total_likelihood);
  }

  // Calculate total likelihood for each number of data points - GUESS distribution
  const y_values_guess = [];
  for (let i = 1; i <= n; i++) {
    let total_likelihood_guess = 1;
    for (let j = 1; j <= i; j++) {
        total_likelihood_guess = (total_likelihood_guess * 
            (1 / (std_guess * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((SAMPLE_POINTS[j-1] - mean_guess) / std_guess, 2))
        );
    }
    y_values_guess.push(total_likelihood_guess);
  }


  const x_values = Array.from({length: n}, (_, i) => i + 1);



  let total_likelihood = 1;
  for (let j = 1; j <= n; j++) {
      total_likelihood = (total_likelihood * 
         (1 / (std * Math.sqrt(2 * Math.PI))) * 
          Math.exp(-0.5 * Math.pow((SAMPLE_POINTS[j-1] - mean) / std, 2))
      );
    }
  // multiply all probabilities together
  const totalLikelihoodString = total_likelihood.toExponential(2).replace('e-', ' x 10<sup>-') + '</sup>';
  
  let total_likelihood_guess = 1;
  for (let j = 1; j <= n; j++) {
      total_likelihood_guess = (total_likelihood_guess * 
         (1 / (std_guess * Math.sqrt(2 * Math.PI))) * 
          Math.exp(-0.5 * Math.pow((SAMPLE_POINTS[j-1] - mean_guess) / std_guess, 2))
      );
    }
  const totalLikelihoodGuessString = total_likelihood_guess.toExponential(2).replace('e-', ' x 10<sup>-') + '</sup>';
  
  const plotData = [
    {
      x: x_values,
      y: y_values,
      type: 'scatter',
      mode: 'lines',
      name: 'P<sub>true</sub>',
      line: { color: '#4CAF50' },
    },
    {
      x: x_values,
      y: y_values_guess,
      type: 'scatter',
      mode: 'lines',
      name: 'P<sub>guess</sub>',
      line: { color: '#FF5252' },
    },
  ];
  
  const layout = {
    width: undefined,
    height: 250,
    margin: { t: 10, r: 30, l: 80, b: 40 },
    xaxis: {
      range: [0, 50],
      dtick: 10,
      showgrid: false,
      zeroline: false,
      title: {
        text: 'n'
      }
    },
    yaxis: {
      type: 'log',
      title: {
        text: 'total likelihood'
      },
      range: [-60, 0],
      ticktext: ['10<sup>0</sup>', '10<sup>-10</sup>', '10<sup>-20</sup>', '10<sup>-30</sup>', '10<sup>-40</sup>', '10<sup>-50</sup>', '10<sup>-60</sup>'],
      tickvals: [1, 1e-10, 1e-20, 1e-30, 1e-40, 1e-50, 1e-60],
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

export default CompareTrajectory;