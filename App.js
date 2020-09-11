import React, {useEffect, useState} from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from  './Chat'
import Pusher from "pusher-js";
import axios from './axios';
import Login from './Login'
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import { useStateValue } from './StateProvider';

// import { response } from 'express';

function App() {

  const [{user}, dispatch] = useStateValue();
  const uid =  localStorage.getItem('uid')!==undefined?localStorage.getItem('uid'):null

  const [messages, setMessages] = useState([])
  // const [user, setUser] = useState(null)


    useEffect( () => {
        axios.get('/messages/sync')
        .then(response => {
          setMessages(response.data)
        })
    }, []);

    //when the app loads useEffect runs the code within it once 
    useEffect( () => {
      const pusher = new Pusher('f4d2b6d4728b5e1a1696', {
        cluster: 'ap2'
      });

      const channel = pusher.subscribe('messages');
      channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });


    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    }, [messages])

    console.log(messages)

    return (
  
    <div className="app">
    {
      !user  ? (
          <Login />
      ): (
        <div className = "app__body">
        <Router>
        <Sidebar />
          <Switch>
          <Route path = "/rooms/:roomId">
            <Chat messages = {messages} />
          </Route>

          <Route path = "/">
            <Chat />
          </Route>
          </Switch>
        </Router>
        
      </div>

      )}
          </div>
  );
}

export default App;
