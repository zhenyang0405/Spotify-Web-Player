import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login'
import Interface from './components/Interface';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      console.log('GET token from server - App.js');
      setToken(json.access_token)
    }
    getToken();
  }, []);

  return (
    <>
      { (token === '') ? <Login /> : <Interface token={token} /> }
    </>
    // <div className='app-container'> 
    // {/* </div> */}
  );
}

export default App;
