import React from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { DISTRIBUTION_PARAMS, GRAPH_SETTINGS, SAMPLE_POINTS } from '../data/constants';

const Plot = createPlotlyComponent(Plotly);

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





const mixedGaussianProb = (gaussian1, gaussian2, x) => {
  const gaussian1_prob = (1 / (gaussian1.std * Math.sqrt(2 * Math.PI))) * 
          Math.exp(-0.5 * Math.pow((x - gaussian1.mean) / gaussian1.std, 2));
  const gaussian2_prob = (1 / (gaussian2.std * Math.sqrt(2 * Math.PI))) * 
          Math.exp(-0.5 * Math.pow((x - gaussian2.mean) / gaussian2.std, 2));

  return gaussian1_prob * gaussian1.coef + gaussian2_prob * gaussian2.coef;
}


const generateMixedGaussianData = (gaussian1, gaussian2, xMin, xMax, numPoints) => {
  const xData = [];
  const yData = [];
  const step = (xMax - xMin) / numPoints;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    // Gaussian PDF formula
    const y = mixedGaussianProb(gaussian1, gaussian2, x);
    
    xData.push(x);
    yData.push(y);
  }
  
  return { x: xData, y: yData };
};

const gaussianLikelihoodString = (mean, std) => {
  const sampleProbabilities = SAMPLE_POINTS.map(x => {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });

  // multiply all probabilities together
  const totalLikelihood = sampleProbabilities.reduce((total, curr) => total * curr, 1);
  const totalLikelihoodString = totalLikelihood.toExponential(2).replace('e-', ' x 10<sup>-') + '</sup>';

  return totalLikelihoodString
}

const ManyDistributions = () => {
  // Define the means for each subplot
  const solid_red = 'rgb(140, 33, 33)';
  const transparent_red = 'rgba(255, 55, 55, 0.3)';
  const solid_green = '#4CAF50';
  const transparent_green = 'rgba(76, 175, 80, 0.3)';
  
  // Generate true distribution data once
  const trueGaussianData = generateGaussianData(
    DISTRIBUTION_PARAMS.true.mean,
    DISTRIBUTION_PARAMS.true.std,
    GRAPH_SETTINGS.xRange[0],
    GRAPH_SETTINGS.xRange[1],
    GRAPH_SETTINGS.numPoints
  );


  // Calculate y-values for sample points based on Gaussian PDF
  const sampleYValues = SAMPLE_POINTS.map(x => {
    const mean = DISTRIBUTION_PARAMS.true.mean;
    const std = DISTRIBUTION_PARAMS.true.std;
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });



  const totalLikelihoodString = gaussianLikelihoodString(3, 0.5);



  // plot 1 -- mixture of gaussians

  const gaussian1 = {
    coef: 0.6,
    mean: 3,
    std: 0.5
  };

  const gaussian2 = {
    coef: 0.4,
    mean: 5,
    std: 0.6
  };


  let sampleProbabilities = SAMPLE_POINTS.map(x => mixedGaussianProb(gaussian1, gaussian2, x));

  // multiply all probabilities together
  const totalLikelihood = sampleProbabilities.reduce((total, curr) => total * curr, 1);
  const likelihood1 = totalLikelihood.toExponential(2).replace('e-', ' x 10<sup>-') + '</sup>';

 

  let data = generateMixedGaussianData(
    gaussian1,
    gaussian2,
    GRAPH_SETTINGS.xRange[0],
    GRAPH_SETTINGS.xRange[1],
    GRAPH_SETTINGS.numPoints
  );

  const truePlot1 = {
    x: trueGaussianData.x,
    y: trueGaussianData.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    name: 'P_true',
    line: { color: solid_green },
    fillcolor: transparent_green,
    xaxis: 'x',
    yaxis: 'y',
    showlegend: true
  };

  const plot1 = {
    x: data.x,
    y: data.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    name: `μ=3`,
    line: { color: solid_red },
    fillcolor: transparent_red,
    xaxis: 'x',
    yaxis: 'y',
    showlegend: true
  }

  const samples1 = {
    x: SAMPLE_POINTS,
    y: sampleProbabilities,
    type: 'scatter',
    mode: 'markers',
    showlegend: false,
    marker: { 
      color: 'rgba(64, 64, 64, 0.7)',
      size: 8
    },
    text: SAMPLE_POINTS.map((x, i) => `x<sub>${i + 1}</sub>`),
    hovertemplate: '<b style="font-size: 150%">%{text}</b><br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
    xaxis: 'x',
    yaxis: 'y',
  };



  // plot 2

  let mean = 3.5;
  let std = 0.5;

  const likelihood2 = gaussianLikelihoodString(mean, std);
  

  data = generateGaussianData(
    mean,
    std,
    GRAPH_SETTINGS.xRange[0],
    GRAPH_SETTINGS.xRange[1],
    GRAPH_SETTINGS.numPoints
  );

  const truePlot2 = {
    x: trueGaussianData.x,
    y: trueGaussianData.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    name: 'P_true',
    line: { color: solid_green },
    fillcolor: transparent_green,
    xaxis: 'x2',
    yaxis: 'y',
    showlegend: true
  };

  const plot2 = {
    x: data.x, 
    y: data.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: { color: solid_red },
    fillcolor: transparent_red,
    xaxis: 'x2',
    yaxis: 'y',
    showlegend: true
  }



  sampleProbabilities = SAMPLE_POINTS.map(x => {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });
  const samples2 = {
    x: SAMPLE_POINTS,
    y: sampleProbabilities,
    type: 'scatter',
    mode: 'markers',
    showlegend: false,
    marker: { 
      color: 'rgba(64, 64, 64, 0.7)',
      size: 8
    },
    text: SAMPLE_POINTS.map((x, i) => `x<sub>${i + 1}</sub>`),
    hovertemplate: '<b style="font-size: 150%">%{text}</b><br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
    xaxis: 'x2',
    yaxis: 'y',
  };


  // plot 3

  mean = 3;
  std = 0.4;

  const likelihood3 = gaussianLikelihoodString(mean, std);

  data = generateGaussianData(
    mean,
    std,
    GRAPH_SETTINGS.xRange[0],
    GRAPH_SETTINGS.xRange[1],
    GRAPH_SETTINGS.numPoints
  );

  const truePlot3 = {
    x: trueGaussianData.x,
    y: trueGaussianData.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    name: 'P_true',
    line: { color: solid_green },
    fillcolor: transparent_green,
    xaxis: 'x',
    yaxis: 'y2',
    showlegend: true
  };

  const plot3 = {
    x: data.x,
    y: data.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: { color: solid_red},
    fillcolor: transparent_red,
    xaxis: 'x',
    yaxis: 'y2',
    showlegend: true
  }

  sampleProbabilities = SAMPLE_POINTS.map(x => {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });
  const samples3 = {
    x: SAMPLE_POINTS,
    y: sampleProbabilities,
    type: 'scatter',
    mode: 'markers',
    showlegend: false,
    marker: { 
      color: 'rgba(64, 64, 64, 0.7)',
      size: 8
    },
    text: SAMPLE_POINTS.map((x, i) => `x<sub>${i + 1}</sub>`),
    hovertemplate: '<b style="font-size: 150%">%{text}</b><br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
    xaxis: 'x',
    yaxis: 'y2',
  };


  // plot 4

  mean = 3;
  std = 0.8;

  const likelihood4 = gaussianLikelihoodString(mean, std);

  data = generateGaussianData(
    mean,
    std,
    GRAPH_SETTINGS.xRange[0],
    GRAPH_SETTINGS.xRange[1],
    GRAPH_SETTINGS.numPoints
  );

  const truePlot4 = {
    x: trueGaussianData.x,
    y: trueGaussianData.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    name: 'P_true',
    line: { color: solid_green },
    fillcolor: transparent_green,
    xaxis: 'x2',
    yaxis: 'y2',
    showlegend: true
  };

  const plot4 = {
    x: data.x,
    y: data.y,
    type: 'scatter',
    mode: 'lines',
    fill: 'tozeroy',
    line: { color: solid_red},
    fillcolor: transparent_red,
    xaxis: 'x2',
    yaxis: 'y2',
    showlegend: true
  }

  sampleProbabilities = SAMPLE_POINTS.map(x => {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  });
  const samples4 = {
    x: SAMPLE_POINTS,
    y: sampleProbabilities,
    type: 'scatter',
    mode: 'markers',
    showlegend: false,
    marker: { 
      color: 'rgba(64, 64, 64, 0.7)',
      size: 8
    },
    text: SAMPLE_POINTS.map((x, i) => `x<sub>${i + 1}</sub>`),
    hovertemplate: '<b style="font-size: 150%">%{text}</b><br>x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>',
    xaxis: 'x2',
    yaxis: 'y2',
  };



  
  // Generate data for all 4 distributions
  const plotData = [truePlot1, truePlot2, truePlot3, truePlot4, plot1, plot2, plot3, plot4, samples1, samples2, samples3, samples4];
  
  // Create a 2x2 grid layout with shared axes
  const layout = {
    width: undefined,
    height: 400,
    margin: { t: 20, r: 30, l: 50, b: 50 },
    grid: {
      rows: 2,
      columns: 2,
      subplots:[['xy','x2y'], ['xy2','x2y2']],
      xgap: 0.1,
      ygap: 0.15,
    }, 
    xaxis: {
      range: [0, 10],
      dtick: 1,
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      range: [0, 1],
      dtick: 0.2,
      showgrid: false,
      zeroline: false
    },
    xaxis2: {
      range: [0, 10],
      dtick: 1,
      showgrid: false,
      zeroline: false
    },
    yaxis2: {
      range: [0, 1],
      dtick: 0.2,
      showgrid: false,
      zeroline: false
    },
    showlegend: false,
    annotations: [
      {
        text: 'total likelihood of P_true = ' + totalLikelihoodString,
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        y: 1,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          size: 12,
          color: 'rgb(33, 140, 33)'
        }
      },
      {
        text: 'total likelihood = ' + likelihood1,
        xref: 'paper',
        yref: 'paper',
        x: 0.3,
        y: .8,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          size: 10,
          color: solid_red
        }
      },
      {
        text: 'total likelihood = ' + likelihood2,
        xref: 'paper',
        yref: 'paper',
        x: 0.9,
        y: .8,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          size: 10,
          color: solid_red
        }
      },
      {
        text: 'total likelihood = ' + likelihood3,
        xref: 'paper',
        yref: 'paper',
        x: 0.3,
        y: .25,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          size: 10,
          color: solid_red
        }
      },
      {
        text: 'total likelihood = ' + likelihood4,
        xref: 'paper',
        yref: 'paper',
        x: 0.9,
        y: .25,
        xanchor: 'center',
        yanchor: 'bottom',
        showarrow: false,
        font: {
          size: 10,
          color: solid_red
        }
      },

    ],
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

export default ManyDistributions;