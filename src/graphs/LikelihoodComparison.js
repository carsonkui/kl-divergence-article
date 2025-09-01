import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LikelihoodComparison({ logScale = false }) {
  const [data, setData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [numSamples, setNumSamples] = useState(0);

  // Distribution probabilities
  const pTrue = [0.05, 0.10, 0.15, 0.25, 0.20, 0.15, 0.08, 0.02];
  const pGuess1 = [0.15, 0.08, 0.12, 0.20, 0.15, 0.18, 0.10, 0.02]; // Poor guess
  const pGuess2 = [0.06, 0.11, 0.14, 0.23, 0.19, 0.16, 0.09, 0.02]; // Better guess
  const pGuess3 = [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]; // Uniform guess

  // Sample from true distribution
  const sampleFromTrue = () => {
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < pTrue.length; i++) {
      cumulative += pTrue[i];
      if (random < cumulative) {
        return i;
      }
    }
    return pTrue.length - 1;
  };

  // Calculate likelihood
  const calculateLikelihood = (samples, distribution) => {
    let likelihood = 1;
    for (const sample of samples) {
      likelihood *= distribution[sample];
    }
    return likelihood;
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setNumSamples(prev => {
          const newNum = prev + 1;
          const sample = sampleFromTrue();
          
          // Generate samples up to this point
          const samples = [];
          for (let i = 0; i < newNum; i++) {
            samples.push(sampleFromTrue());
          }
          
          // Calculate likelihoods
          const likelihoodTrue = calculateLikelihood(samples, pTrue);
          const likelihoodGuess1 = calculateLikelihood(samples, pGuess1);
          const likelihoodGuess2 = calculateLikelihood(samples, pGuess2);
          const likelihoodGuess3 = calculateLikelihood(samples, pGuess3);
          
          setData(prevData => {
            const newPoint = {
              n: newNum,
              true: logScale ? Math.log(likelihoodTrue) : likelihoodTrue,
              guess1: logScale ? Math.log(likelihoodGuess1) : likelihoodGuess1,
              guess2: logScale ? Math.log(likelihoodGuess2) : likelihoodGuess2,
              guess3: logScale ? Math.log(likelihoodGuess3) : likelihoodGuess3,
            };
            return [...prevData, newPoint].slice(-50); // Keep last 50 points
          });
          
          if (newNum >= 50) {
            setIsAnimating(false);
          }
          
          return newNum;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isAnimating, logScale]);

  const handleStart = () => {
    setIsAnimating(true);
  };

  const handleStop = () => {
    setIsAnimating(false);
  };

  const handleReset = () => {
    setData([]);
    setNumSamples(0);
    setIsAnimating(false);
  };

  return (
    <div className="graph-container">
      <div className="controls" style={{ marginBottom: '20px' }}>
        <button onClick={handleStart} disabled={isAnimating || numSamples >= 50}>Start</button>
        <button onClick={handleStop} disabled={!isAnimating} style={{ marginLeft: '10px' }}>Stop</button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
        <span style={{ marginLeft: '20px' }}>Samples: {numSamples}</span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="n" 
            label={{ value: 'Number of samples', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            label={{ 
              value: logScale ? 'Log Likelihood' : 'Likelihood', 
              angle: -90, 
              position: 'insideLeft' 
            }}
            tickFormatter={(value) => logScale ? value.toFixed(1) : value.toExponential(1)}
          />
          <Tooltip formatter={(value) => logScale ? value.toFixed(2) : value.toExponential(2)} />
          <Legend />
          <Line type="monotone" dataKey="true" stroke="#8884d8" name="P_true" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="guess1" stroke="#ff7c7c" name="P_guess (poor)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="guess2" stroke="#82ca9d" name="P_guess (better)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="guess3" stroke="#ffc658" name="P_guess (uniform)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        {logScale ? 
          'Log scale: Lines with steeper negative slopes indicate worse fits' :
          'Linear scale: Likelihoods decrease rapidly as more samples are added'
        }
      </div>
    </div>
  );
}

export default LikelihoodComparison;