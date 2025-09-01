import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SamplingAnimation() {
  const [samples, setSamples] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentSample, setCurrentSample] = useState(null);

  // Distribution probabilities
  const distribution = [
    { x: 1, probability: 0.05 },
    { x: 2, probability: 0.10 },
    { x: 3, probability: 0.15 },
    { x: 4, probability: 0.25 },
    { x: 5, probability: 0.20 },
    { x: 6, probability: 0.15 },
    { x: 7, probability: 0.08 },
    { x: 8, probability: 0.02 },
  ];

  // Sample from distribution
  const sampleFromDistribution = () => {
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < distribution.length; i++) {
      cumulative += distribution[i].probability;
      if (random < cumulative) {
        return distribution[i].x;
      }
    }
    return distribution[distribution.length - 1].x;
  };

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        const newSample = sampleFromDistribution();
        setCurrentSample(newSample);
        setSamples(prev => {
          const newSamples = [...prev, { x: newSample, y: Math.random() * 0.3 + 0.1 }];
          return newSamples.slice(-20); // Keep last 20 samples
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const handleStartAnimation = () => {
    setIsAnimating(true);
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
    setCurrentSample(null);
  };

  const handleReset = () => {
    setSamples([]);
    setCurrentSample(null);
    setIsAnimating(false);
  };

  return (
    <div className="graph-container">
      <div className="controls" style={{ marginBottom: '20px' }}>
        <button onClick={handleStartAnimation} disabled={isAnimating}>Start Sampling</button>
        <button onClick={handleStopAnimation} disabled={!isAnimating} style={{ marginLeft: '10px' }}>Stop</button>
        <button onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
        {currentSample && (
          <span style={{ marginLeft: '20px' }}>Last sample: x = {currentSample}</span>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: 'Value', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="probability" fill="#8884d8" name="P_true" />
        </BarChart>
      </ResponsiveContainer>

      {samples.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Sampled Values:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {samples.map((sample, index) => (
              <span 
                key={index} 
                style={{ 
                  padding: '5px 10px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '5px',
                  animation: index === samples.length - 1 ? 'fadeIn 0.5s' : 'none'
                }}
              >
                x{index + 1} = {sample.x}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SamplingAnimation;