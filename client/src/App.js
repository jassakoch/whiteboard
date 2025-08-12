
import './App.css';
import { useState } from 'react';
import  Login from './components/Login'

function App() {

  const [ token, setToken ] = useState(null);

  if (!token) {
    return <Login onLogin={setToken} />;
  }
  return (
    <div className="App">
<h1>Scribble</h1>
    </div>
  );
}

export default App;
