import React from 'react';
import './App.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Import graph components
import TrueDistribution from './graphs/TrueDistribution';
import TrueDistributionSampled from './graphs/TrueDistributionSampled';

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
          Assume we have a distribution, <Math>{`P_{\\text{true}}`}</Math>. It looks like this:
        </p>
        
        <TrueDistribution/>
        
        <p>
          We can sample from the distribution one data point at a time (drag the slider).
        </p>
        
        <TrueDistributionSampled/>
        
        <p>
          Each of these specific data points <Math>{`x_1, x_2, \\ldots, x_n`}</Math> have a certain 
          probability of being sampled. We write these probabilities as <Math>{`P_{\\text{true}}(x_1), P_{\\text{true}}(x_2), \\ldots, P_{\\text{true}}(x_n)`}</Math>. To calculate the probability of having sampled them all sequentially, we multiply the individual probabilities together:
        </p>
        
        <Math block>
          {`P_{\\text{true}}(x_1) \\cdot P_{\\text{true}}(x_2) \\cdot \\ldots \\cdot P_{\\text{true}}(x_n)`}
        </Math>
        
        <p>
          This is the "likelihood" of the data. Now assume we have a guess <Math>{`P_{\\text{guess}}`}</Math>.
        </p>
        
        <div className="visual-placeholder">
        </div> 
        
        <p>
          If <Math>{`P_{\\text{guess}}`}</Math> is not a good fit for the data, the likelihood 
          <Math>{`P_{\\text{guess}}(x_1) \\cdot P_{\\text{guess}}(x_2) \\cdot \\ldots \\cdot P_{\\text{guess}}(x_n)`}</Math>
          will be lower. In this case, data points like <Math>{`x_1`}</Math> or <Math>{`x_3`}</Math> are unexpected in the eyes of <Math>{'P_{\\text{guess}}'}</Math>, so the probabilities <Math>{`P_{\\text{guess}}(x_1)`}</Math> and <Math>{`P_{\\text{guess}}(x_3)`}</Math> drag down the likelihood.
        </p>
        
        <h3>Some more examples:</h3>
        
        <div className="visual-placeholder">
        </div> 
        
        <p>
          The distribution <Math>{`P_{\\text{true}}`}</Math> should generally have the highest likelihood. 
          The more data points we sample, the more clearly <Math>{`P_{\\text{true}}`}</Math> stands out as the best. 
          Look up "maximum likelihood estimation" for more rigor.
        </p>
        
        <p>
          For our purposes, only the intuition is important: The likelihood measures 'how well' 
          a distribution models the data, and the best distribution is the <b>true</b> distribution.
        </p>
        
        <div className="callout">
          If this point does not feel comfortable, spend a bit longer here. 
          (or, give me some feedback to make this section more clear! I'M TALKING TO YOU, PROOF READERS :0 )
        </div>
        
        <h2>KL Divergence</h2>
        
        <p>
          As we sample data points one by one from <Math>{`P_{\\text{true}}`}</Math>, 
          let's plot how the likelihood evolves.
        </p>
        
        <div className="visual-placeholder">
        </div> 
        
        <p>
          Now let's compare it with <Math>{`P_{\\text{guess}}`}</Math>.
        </p>
        
        <p>
          These likelihoods get very small very fast. Let's switch to the log scale instead.
        </p>
        
        <div className="visual-placeholder">
        </div> 
        
        <p>
          Much better.
        </p>
        
        <p>
          We can see <Math>{`P_{\\text{true}}`}</Math> is better at explaining the data because its 
          line always remains higher than <Math>{`P_{\\text{guess}}`}</Math>'s. The rate at which 
          these two lines diverge is called the KL Divergence.
        </p>
        
        <p>
          Well, with a small caveat. The lines we plotted were a bit random. If we sampled 
          NEW data points for <Math>{`x_1, \\ldots, x_n`}</Math>, we might get different trajectories.
        </p>
        
        <p>
          Doing this many times over, a clear trend emerges. Plotting the averages, we have:
        </p>
        
        <div className="visual-placeholder">
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
          How do we calculate the average lines of <Math>{`P_{\\text{true}}`}</Math> and <Math>{`P_{\\text{guess}}`}</Math>? Let's compute the average line of <Math>{`P_{\\text{guess}}`}</Math> at <Math>{`n=4`}</Math> to illustrate.
        </p>

        <div className="visual-placeholder">
        </div> 

        <p>
          We start with the likelihoods at <Math>{`n=4`}</Math>. Remember, different colors are different trials.
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

        To calculate the KL divergence, we take the difference in slopes.

        

        <Math block>
          {`\\text{KL}(P_{\\text{true}} \\,||\\, P_{\\text{guess}}) = E[\\log(P_{\\text{true}}(X))] - E[\\log(P_{\\text{guess}}(X))]`}
        </Math>

        <p>
            And that's it! The KL divergence measures how different two probability distributions are. 
            Or more precisely, it measures how well distribution <Math>{`P_{\\text{guess}}`}</Math> models 
            data drawn from distribution <Math>{`P_{\\text{true}}`}</Math>.
        </p>

        <p>
            Congratulations on making it to the end :). If you are hungry for more, the second section explains KL divergence using a complimentary algebraic approach.
        </p>
        
        <div className="fun-asides">
          <h3>Some fun asides:</h3>
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
        
        <div className="conclusion">
          <p>
            That's it! The KL divergence measures how different two probability distributions are. 
            Or more precisely, it measures how well distribution <Math>{`P_{\\text{guess}}`}</Math> models 
            data drawn from distribution <Math>{`P_{\\text{true}}`}</Math>.
          </p>
          
          <p>
            For the more adventurous reader, a rigorous analysis follows...
          </p>
        </div>
      </article>
    </div>
  );
}

export default App;