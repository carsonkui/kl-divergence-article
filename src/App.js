import React from 'react';
import './App.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Import graph components
import TrueDistribution from './graphs/TrueDistribution';
import TrueDistributionSampled from './graphs/TrueDistributionSampled';
import GuessDistributionWithData from './graphs/GuessDistributionWithData';
import ManyDistributions from './graphs/ManyDistributions';
import TrueTrajectory from './graphs/TrueTrajectory';
import TrueTrajectoryLog from './graphs/TrueTrajectoryLog';
import CompareTrajectory from './graphs/CompareTrajectory';
import TwoTrialTrajectory from './graphs/TwoTrialTrajectory';
import MasterGraph from './graphs/MasterGraph';

// import DistributionPlot from './graphs/DistributionPlot';
// import SamplingAnimation from './graphs/SamplingAnimation';
// import LikelihoodComparison from './graphs/LikelihoodComparison';
// import KLDivergenceChart from './graphs/KLDivergenceChart';

// Helper component for rendering math
function Math({ children, block = false }) {
  const html = katex.renderToString(children, {
    displayMode: block,
    throwOnError: false
  });


  
  return block ? (
    <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
function App() {
  return (
    <div className="App">
      <article className="kl-article">
        <h1>KL Divergence Explained Visually</h1>
        
        <div className="visual-placeholder">
        </div> 

        <h2>Likelihood</h2>
        
        <p>
          Recently, I've been growing tomatoes. Most of my tomato plants are around 3 feet tall, but every time I grow a new one, the height is slighly different. This is their probability distribution:
        </p>


        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <TrueDistribution/>
        </div>
        
        
        <p>
          Let's call this distribution <Math>{`P_{\\text{true}}`}</Math>. We can sample data points from <Math>{`P_{\\text{true}}`}</Math> by growing new tomato plants (drag the slider).
        </p>
        
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <TrueDistributionSampled/>
        </div>

        <p>
          My friend Gary thinks tomato plants are taller. He claims they are closer to 4 feet tall. We label his probability distribution <Math>{`P_{\\text{gary}}`}</Math>:
        </p>
        
        
        
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <GuessDistributionWithData/>
        </div> 


        <p>
          Obviously, Gary is wrong. I know my tomato plants. And they are ~3 feet tall.
        </p> 

        <p>
          But how can we prove to Gary, based on the tomato plants I have grown (the black dots on the graph), that my distribution <Math>{`P_{\\text{true}}`}</Math> is more realistic?
          For this, we need the 'total likelihood' of the data.
        </p>

        <p>
          If <Math>{`P_{\\text{true}}`}</Math> is the real distribution, the likelihood of tomato plant 1 being 3.3 feet tall is 0.65 (confirm this by hovering over the first graph). We write the height of tomato plant 1 as <Math>{`x_1`}</Math>, and the likelihood as <Math>{`P_{\\text{true}} (x_1) = 0.655`}</Math>. 
          Generally, for heights <Math>{`x_1, x_2, \\ldots, x_n`}</Math>, we have likelihoods <Math>{`P_{\\text{true}}(x_1), P_{\\text{true}}(x_2), \\ldots, P_{\\text{true}}(x_n)`}</Math>.

          The 'total likelihood' of our 50 data points is defined as how likely 50 <b>new</b> plants are to have the exact same heights as <Math>{`x_1, x_2, \\ldots, x_{50}`}</Math>. To calculate this, we multiply the likelihoods:
                  </p>

        <Math block>
          {`P_{\\text{true}}(x_1) \\cdot P_{\\text{true}}(x_2) \\cdot \\ldots \\cdot P_{\\text{true}}(x_{50}) = 2.16 x 10^{-16}`}
          </Math>

        <p>
          Let's look back at the graph of <Math>{`P_{\\text{guess}}`}</Math>. Notice how the data does not rest as nicely on Gary's distribution. Visually, you can tell that <Math>{`P_{\\text{true}}`}</Math> was a much better fit. 
          When we calculate the total likelihood that our plants came from Gary's distribution, we get:
        </p>

        <Math block>
          {`P_{\\text{guess}}(x_1) \\cdot P_{\\text{guess}}(x_2) \\cdot \\ldots \\cdot P_{\\text{guess}}(x_{50}) = 3.34 x 10^{-63}`}
        </Math>


        
        <p>
          This total likelihood is much lower than <Math>{`P_{\\text{true}}`}</Math>'s. We conclude that distribution <Math>{`P_{\\text{guess}}`}</Math> is not as realistic as <Math>{`P_{\\text{true}}`}</Math>. Clearly, Gary was very silly to question my tomato plant knowledge.
        </p>

        <p>
          Gary aside, this property of 'more realistic distribution = higher total likelihood' is incredibly useful — it works for all distributions.
        </p>
        
        <h3>Some other examples</h3>
        
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <ManyDistributions/>
        </div> 
        
        <p>
          The distribution <Math>{`P_{\\text{true}}`}</Math> should generally have the highest 'total likelihood'. 
          The more data points we sample, the more clearly <Math>{`P_{\\text{true}}`}</Math> stands out as the best. 
          Look up "maximum likelihood estimation" to learn more.
        </p>
        
        <p>
          For our purposes, only the intuition is important: The total likelihood measures 'how well' 
          a distribution models the data.
        </p>
        
        <div className="callout">
          If this point is not clear, spend a bit longer here. 
          (or, give me some feedback to make this section more clear! )
        </div>
        
        <h2>KL Divergence</h2>
        
        <p>
          As we sample data points one by one from <Math>{`P_{\\text{true}}`}</Math>, 
          let's plot how the total likelihood of <Math>{`P_{\\text{true}}`}</Math> evolves.
        </p>
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <TrueTrajectory/>
        </div>

        <p>
          The total likelihood gets small very fast. Let's switch to the log scale instead.
        </p>

        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <TrueTrajectoryLog/>
        </div>
        <p>
          Much better.
        </p>

        <p>
          Now let's compare it with <Math>{`P_{\\text{guess}}`}</Math>.
        </p>
        
        
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <CompareTrajectory/>
        </div>
        

        
        <p>
          We can see <Math>{`P_{\\text{true}}`}</Math> is better at explaining the data because its 
          total likelihood always remains higher than <Math>{`P_{\\text{guess}}`}</Math>'s. The rate at which 
          these two lines diverge is called the KL Divergence.
        </p>
        
        <p>
          Well, almost. The lines we plotted were a bit random. If we sampled 
          NEW data points for <Math>{`x_1, \\ldots, x_n`}</Math>, we might get different trajectories.
        </p>

        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <TwoTrialTrajectory/>
        </div>
        
        <p>
          Doing this many times over, a clear trend emerges. Plotting the averages, we have:
        </p>
        
        <div style={{ marginBottom: '20px', marginTop: '60px'}}>
          <MasterGraph/>
        </div>
        
        <p>
          The rate at which these <em>averages</em> diverge is the official KL divergence 
          of <Math>{`P_{\\text{guess}}`}</Math> with respect to <Math>{`P_{\\text{true}}`}</Math>. 
          This is denoted as <Math>{`\\text{KL}(P_{\\text{true}} \\,||\\, P_{\\text{guess}})`}</Math>. 
          You can also view the KL divergence as the difference in the averages' slopes.
        </p>
        
        <p>
          A larger KL divergence means that <Math>{`P_{\\text{guess}}`}</Math> is worse at 
          explaining <Math>{`P_{\\text{true}}`}</Math>. A smaller KL divergence means 
          that <Math>{`P_{\\text{guess}}`}</Math> models <Math>{`P_{\\text{true}}`}</Math> well. 
          The KL divergence can never be negative, because <Math>{`P_{\\text{true}}`}</Math> is 
          the best possible model of <Math>{`P_{\\text{true}}`}</Math>.
        </p>

        <h3>The Formula</h3>

        <p>
          How do we calculate the KL Divergence? To get our hands dirty, let's start by looking at the average line of <Math>{`P_{\\text{guess}}`}</Math> when <Math>{`n=4`}</Math>.
        </p>

        <div className="visual-placeholder">
        </div> 

        <p>
          We start with the likelihoods. Remember, different colors are different trials.
        </p>

        <div className="visual-placeholder">
        </div> 

        <p>
          Then, we convert each likelihood to the log domain.
        </p>

        <div className="visual-placeholder">
        </div> 

        <p>By the properties of log, this is equivalent to: </p>

        <div className="visual-placeholder">
        </div> 

        <p>Finally, we average across trials.</p>

        
        {/* should NOT average across n */}
        <div className="visual-placeholder">
        </div> 

        <p> 
          As we scale the number of trials up to infinity, each of these terms approach the true average of <Math>{`\\log(P_{\\text{guess}}(X))`}</Math>. 
          In statistics, we write this as <Math>{`E[\\log(P_{\\text{guess}}(X))]`}</Math>.
        </p>

        <div className="visual-placeholder">
        </div> 

        <p>
          This generalizes to any value of <Math>{`n`}</Math>. 
        </p>

        {/* make a slider */}
        <div className="visual-placeholder">
        </div> 

        For calculating the average line of <Math>{`P_{\\text{true}}`}</Math>, the process is exactly the same.

        {/* make a slider */}
        <div className="visual-placeholder">
        </div> 

        All that's left is to take the difference in slopes.

        

        <Math block>
          {`\\text{KL}(P_{\\text{true}} \\,||\\, P_{\\text{guess}}) = E[\\log(P_{\\text{true}}(X))] - E[\\log(P_{\\text{guess}}(X))]`}
        </Math>

        <p>
            And that's it! The KL divergence measures how different two probability distributions are. 
            Or more precisely, it measures how well distribution <Math>{`P_{\\text{guess}}`}</Math> models 
            data drawn from distribution <Math>{`P_{\\text{true}}`}</Math>.
        </p>

        <p>
            Congratulations on making it to the end :). If you are hungry for more, the second installment will explain KL divergence with greater rigour.
        </p>
        
        <div className="fun-asides">
          <h3>Fun asides:</h3>
          <ul>
            <li>
              The slope of <Math>{`P_{\\text{true}}`}</Math>'s average line is called the entropy 
              of <Math>{`P_{\\text{true}}`}</Math>, written <Math>{`H(P_{\\text{true}})`}</Math>.
            </li>
            <li>
              The slope of <Math>{`P_{\\text{guess}}`}</Math> is called the cross entropy 
              of <Math>{`P_{\\text{guess}}`}</Math> given <Math>{`P_{\\text{true}}`}</Math>, 
              written <Math>{`H(P_{\\text{true}}, P_{\\text{guess}})`}</Math>.
            </li>
          </ul>
        </div>
        
        
      </article>
    </div>
  );
}

export default App;