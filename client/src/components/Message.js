import React from 'react';
import bot from '../resources/w.svg'

const Message = ({chat, index, arr, active}) => {
    var spacing;
    if (index > 0)
        chat.isUser === arr[index-1].isUser ? spacing = "bunch" : spacing="break"
    else
        spacing = "break"
        
    return (
        <div className={ `group ${chat.isUser ? "user" : "bot"} ${spacing}` }>
            {active && <img src={bot} alt="bot" />}
            <div className="message">
                {chat.content}
            </div>
        </div>
    );
}

export default Message;