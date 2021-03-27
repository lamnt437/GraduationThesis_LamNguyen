import logo from '../logo.svg';
import './App.css';
import Person from '../components/Persons/Person';
import People from '../components/Persons/People';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Person name="Lam Nguyen" age="23" />
        <People number="2" />
      </header>
    </div>
  );
}

export default App;
