import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Agenda from './Agenda';
import Planning from './Planning';
import Footer from './Footer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [view, setView] = React.useState('Agenda');

  function switchView() {
    setView(view === 'Agenda' ? 'Planning' : 'Agenda');
  }

  return (
    <React.StrictMode>
      <div>
        <button className="switch" onClick={switchView}>Mode {view === 'Agenda' ? 'Planning' : 'Agenda'}</button>
        {view === 'Agenda' ? <Agenda/> : <Planning/>}
      </div>
      <Footer/>
    </React.StrictMode>
  );
}

root.render(<App/>);


reportWebVitals(console.log);
