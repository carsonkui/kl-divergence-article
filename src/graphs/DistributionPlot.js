import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DistributionPlot({ showGuess = false, interactive = false }) {
  // Discrete distribution data
  const [trueData] = useState([
    { x: 1, pTrue: 0.05, pGuess: 0.15 },
    { x: 2, pTrue: 0.10, pGuess: 0.08 },
    { x: 3, pTrue: 0.15, pGuess: 0.12 },
    { x: 4, pTrue: 0.25, pGuess: 0.20 },
    { x: 5, pTrue: 0.20, pGuess: 0.15 },
    { x: 6, pTrue: 0.15, pGuess: 0.18 },
    { x: 7, pTrue: 0.08, pGuess: 0.10 },
    { x: 8, pTrue: 0.02, pGuess: 0.02 },
  ]);

  return (
    <div className="graph-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={trueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" label={{ value: 'Value', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="pTrue" fill="#8884d8" name="P_true" />
          {showGuess && <Bar dataKey="pGuess" fill="#ff7c7c" name="P_guess" opacity={0.7} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DistributionPlot;