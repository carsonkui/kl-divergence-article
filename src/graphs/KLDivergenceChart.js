import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function KLDivergenceChart({ showMultipleTrajectories = false }) {
  const [averageData, setAverageData] = useState([]);
  const [trajectories, setTrajectories] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Distribution probabilities
  const pTrue = [0.05, 0.10, 0.15, 0.25, 0.20, 0.15, 0.08, 0.02];
  const pGuess = [0.15, 0.08, 0.12, 0.20, 0.15, 0.18, 0.10, 0.02];

  // Calculate entropy
  const entropy = (dist) => {
    return -dist.reduce((sum, p) => sum + (p > 0 ? p * Math.log(p) : 0), 0);
  };

  // Calculate cross entropy
  const crossEntropy = (pTrue, pGuess) => {
    return -pTrue.reduce((sum, p, i) => sum + (p > 0 ? p * Math.log(pGuess[i] || 0.0001) : 0), 0);
  };

  // Calculate KL divergence
  const klDivergence = crossEntropy(pTrue, pGuess) - entropy(pTrue);

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

  // Generate a single trajectory
  const generateTrajectory = (numSamples) => {
    const trajectory = [];
    let logLikelihoodTrue = 0;
    let logLikelihoodGuess = 0;

    for (let i = 1; i <= numSamples; i++) {
      const sample = sampleFromTrue();
      logLikelihoodTrue += Math.log(pTrue[sample]);
      logLikelihoodGuess += Math.log(pGuess[sample] || 0.0001);
      
      trajectory.push({
        n: i,
        true: logLikelihoodTrue,
        guess: logLikelihoodGuess,
        avgTrue: logLikelihoodTrue / i,
        avgGuess: logLikelihoodGuess / i,
      });
    }
    return trajectory;
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const numTrajectories = showMultipleTrajectories ? 10 : 1;
      const maxSamples = 100;
      
      // Generate multiple trajectories
      const allTrajectories = [];
      for (let t = 0; t < numTrajectories; t++) {
        allTrajectories.push(generateTrajectory(maxSamples));
      }
      setTrajectories(allTrajectories);

      // Calculate averages
      const avgData = [];
      for (let i = 0; i < maxSamples; i++) {
        let sumTrue = 0;
        let sumGuess = 0;
        for (let t = 0; t < numTrajectories; t++) {
          sumTrue += allTrajectories[t][i].avgTrue;
          sumGuess += allTrajectories[t][i].avgGuess;
        }
        avgData.push({
          n: i + 1,
          avgTrue: sumTrue / numTrajectories,
          avgGuess: sumGuess / numTrajectories,
          theoreticalKL: -klDivergence * (i + 1),
        });
      }
      setAverageData(avgData);

      // Animate the data points
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex >= maxSamples) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAnimating, showMultipleTrajectories]);

  const handleStart = () => {
    setIsAnimating(true);
  };

  const handleReset = () => {
    setAverageData([]);
    setTrajectories([]);
    setIsAnimating(false);
  };

  return (
    <div className="graph-container">
      <div className="controls" style={{ marginBottom: '20px' }}>
        <button onClick={handleStart} disabled={isAnimating}>
          {showMultipleTrajectories ? 'Show Multiple Runs' : 'Start Animation'}
        </button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={averageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="n" 
            label={{ value: 'Number of samples', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            label={{ 
              value: 'Average Log Likelihood / n', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip formatter={(value) => value.toFixed(3)} />
          <Legend />
          
          {/* Show individual trajectories if enabled */}
          {showMultipleTrajectories && trajectories.map((traj, idx) => (
            <Line 
              key={`traj-true-${idx}`}
              type="monotone" 
              data={traj}
              dataKey="avgTrue" 
              stroke="#8884d8" 
              strokeWidth={0.5}
              opacity={0.3}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {showMultipleTrajectories && trajectories.map((traj, idx) => (
            <Line 
              key={`traj-guess-${idx}`}
              type="monotone" 
              data={traj}
              dataKey="avgGuess" 
              stroke="#ff7c7c" 
              strokeWidth={0.5}
              opacity={0.3}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          
          {/* Average lines */}
          <Line 
            type="monotone" 
            dataKey="avgTrue" 
            stroke="#8884d8" 
            name="H(P_true) - Entropy" 
            strokeWidth={3} 
            dot={false} 
          />
          <Line 
            type="monotone" 
            dataKey="avgGuess" 
            stroke="#ff7c7c" 
            name="H(P_true, P_guess) - Cross Entropy" 
            strokeWidth={3} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <strong>KL Divergence = {klDivergence.toFixed(3)}</strong>
        <br />
        <span style={{ fontSize: '14px', color: '#666' }}>
          The vertical gap between the lines represents the KL divergence.
          <br />
          Entropy of P_true: {entropy(pTrue).toFixed(3)}
          <br />
          Cross-entropy H(P_true, P_guess): {crossEntropy(pTrue, pGuess).toFixed(3)}
        </span>
      </div>
    </div>
  );
}

export default KLDivergenceChart;