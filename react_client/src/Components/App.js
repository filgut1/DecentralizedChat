import React, {useState} from 'react';
import Main from './Main'
import Login from './Login'

const App = () => {
  const[id, setId] = useState();

  if(!id) {
    return <Login onIdSubmit={setId} />
  }
  return (
    <div className="App">
      <Main userId={id}/>
    </div>
  );
}

export default App;
