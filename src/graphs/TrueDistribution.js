import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate Gaussian distribution data
const generateGaussianData = (mean, std, xMin, xMax, numPoints) => {
  const data = [];
  const step = (xMax - xMin) / numPoints;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    // Gaussian PDF formula
    const y = (1 / (std * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    
    data.push({
      x: parseFloat(x.toFixed(2)),
      probability: parseFloat(y.toFixed(4))
    });
  }
  
  return data;
};

const data = generateGaussianData(3, 0.5, 0, 10, 100);

const TrueDistribution = () => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis 
          dataKey="x" 
          domain={[0, 10]}
          ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        />
        <YAxis 
          domain={[0, 1]}
          ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
        />
        <Tooltip />
        <Area type="monotone" dataKey="probability" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrueDistribution;