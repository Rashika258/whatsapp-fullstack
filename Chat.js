import React, {useState, useEffect} from 'react'
import './Chat.css'
import { Avatar, IconButton } from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import MicOutlinedIcon from '@material-ui/icons/MicOutlined';
import axios from './axios'
import { useParams } from 'react-router-dom';
import db from './firebase';


function Chat({messages}) {
    const [input, setInput] = useState("");

    const {roomId} = useParams();

    const [roomName, setRoomName] = useState("");

    useEffect( () => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot((snapshot) => (
                setRoomName(snapshot.data().name))
            )
        }
    }, [roomId]);

    const sendMessage = async(e) => {
        e.preventDefault();

        await axios.post('/messages/new' , {
            message: input, 
            name: "Rashika",
            timestamp: "after seen",
            received: false,
        })

        setInput('');
    }

    return (
        <div className="chatbar">
            <div className = "chatbar__header">
            <Avatar src= "https://avatars.dicebear.com/api/female/120.svg" />
                <div className = "chatbar__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at...</p>
                </div>
                <div className = "chatbar__headerRight"> 
                    <IconButton />
                        <SearchOutlinedIcon />
                    <IconButton />

                    <IconButton />
                        <AttachFileOutlinedIcon />
                    <IconButton />

                    <IconButton />
                        <MoreVertOutlinedIcon />
                    <IconButton />
                </div>
            </div>

            <div className="chatbar__body">
                 {messages.map( (message) => (
                    <p className= {`chatbar__message ${message.received && "chatbar__receiver"}`} >
                    <span className= "chat__name">{message.name}</span>
                    {message.message}
                    <span className = "chat__timeStamp"> {message.timestamp}</span>
                    </p>    
                 ))}
            </div>

            <div className= "chatbar__footer">
                <EmojiEmotionsOutlinedIcon />
                <form>
                    <input value = {input} onChange = {e => setInput(e.target.value)}  placeholder="Type a message or text" type= "text">
                    </input>

                    <button onClick = {sendMessage} type= "submit">
                        Send a message
                    </button>
                </form>
                <MicOutlinedIcon />
            </div>
        </div>
    )
}

export default Chat
