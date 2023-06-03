import './App.css';
import HomePage from './pages/home/home';
import ReDirectPage from './pages/redirect/redirect';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <HomePage /> } />
        <Route path='*' element={ <ReDirectPage /> } />
      </Routes>
    </div>
  );
}

export default App;
