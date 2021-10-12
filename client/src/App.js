import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import USDC from "./pages/USDC";
import Staking from "./pages/Staking";
import Button from 'react-bootstrap/Button';

function App() {
  	return (
    	<div className="App">
      		<Router>
      			<div className="HeaderApp">
        			<ul className = "UpperNavApp">
						<li>
							<Link to="/">
								<Button variant="outline-primary" size="lg">
									ERC-20
								</Button>
							</Link>
						</li>
						<li>
							<Link to="/Staking">
								<Button variant="outline-secondary" size="lg">
									Staking
								</Button>
							</Link>
						</li>
					</ul>
				</div>
				<Switch>
					<div className="CanvasApp">
						<Route exact path="/">
							<USDC />
						</Route>
						
						<Route path="/Staking">
							<Staking />
						</Route>
					</div>
				</Switch>
		</Router>
    </div>
  );
}

export default App;
