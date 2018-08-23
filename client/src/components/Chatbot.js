import React, { PureComponent } from 'react';
import '../styles/Chatbot.css';
import Send from '../resources/send.svg';
import Message from './Message';

const SAFARI = !!navigator.userAgent.match(/Version\/[\d]+.*Safari/);
const GITHUB = "https://github.com/RohanK99/watbot.io"

const INTRO = [
    "Hey <span role='img' aria-label='wave'>👋</span>",
    "Welcome to Watbot, Ask me any questions you have about the University of Waterloo Admissions or any general questions", 
    "The knowledge base for this project is completely open source, so feel free to add questions or answers simply by clicking the contribute button",
    "Stuck? Ask me for ideas"
]

const TIMEOUTERROR = [
    "Sorry! Request Timed Out, Try again <span role='img' aria-label='frown'>😕</span>"
]

class Chatbot extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            chats: [],
            activeIndexes: [],
            botIsTyping: true, 
            message: ''
        };

        this.animateMessage = this.animateMessage.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.updateActiveImages = this.updateActiveImages.bind(this);
        this.handleType = this.handleType.bind(this);
        this.delayedMessage = this.delayedMessage.bind(this);
        this.timeout = this.timeout.bind(this);
    }

    componentDidMount() {
        console.log(SAFARI)
        this.animateMessage(INTRO)
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, 600))
    }

    async delayedMessage(message){
        await this.delay();
        this.state.chats.pop()
        this.setState(prevState => ({
            chats: prevState.chats.concat([{
                isUser: false,
                content: <p dangerouslySetInnerHTML={{__html: message}}></p>
            }])
        }))
    }

    async animateMessage(messages) {
        for (var message of messages) {
            this.setState(prevState => ({
                chats: prevState.chats.concat([{
                    isUser: false,
                    content: <div className="typing-indicator"><span></span><span></span><span></span></div>
                }])
            }), () => this.updateActiveImages())
            await this.delayedMessage(message);
        }
        this.setState({
            botIsTyping: false
        })
    }

    updateActiveImages() {
        var indexes = []
        this.state.chats.forEach((element, i, arr) => {
            if (i < arr.length-1) {
                if (!element.isUser && (arr[i+1].isUser))
                    indexes.push(i)
            }
            if (i === arr.length-1)
                indexes.push(i)
        })
        this.setState({
            activeIndexes: indexes
        })
    }

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
        }, ms)
            promise.then(resolve, reject)
        })
    }

    submitMessage(e) {
        e.preventDefault();

        var message = {}
        message['question'] = this.state.message

        var length = this.state.chats.length+1;
        this.setState(prevState => ({
            chats: prevState.chats.concat([{
                isUser: true,
                content: <p>{this.state.message}</p>,
            }, {
                isUser: false,
                content: <div className="typing-indicator"><span></span><span></span><span></span></div>
            }]),
            activeIndexes: prevState.activeIndexes.concat([length]),
            botIsTyping: true,
            message: ''
        }))

        this.timeout(30 * 1000, fetch('/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(message)
        }))
        .then(resp => resp.json())
        .then(response => {
            this.state.chats.pop()
            this.animateMessage(response["answer"])
        })
        .catch(err => {
            this.state.chats.pop()
            this.animateMessage(TIMEOUTERROR)
            console.log('Request failed', err)
        })
    }

    handleType(e) {
        this.setState({message: e.target.value})
    }

    render () {
        const { chats } = this.state;
        const { activeIndexes } = this.state;
        const { botIsTyping } = this.state;
        const { message } = this.state;

        var disabled = {
            filter: 'grayscale(100%)'
        }

        return (
            <div className="mega-chat-container">
                <div className="chat-container">
                    <ul className="dialog" ref="chats">
                        {
                            chats.map((chat, i, arr) => 
                                <Message chat={chat} key={i} index={i} arr={arr} active={activeIndexes.includes(i)} />
                            )
                        }
                        <div className="group" style={{ height: '10px' }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </ul>
                </div>
                <form onSubmit={(e) => this.submitMessage(e)}>
                    <input disabled={SAFARI && botIsTyping} className="messageText" type="text" placeholder="Type here" value={this.state.message} onChange={this.handleType}></input>
                    <input disabled={botIsTyping | message === ''} className="send" src={Send} type="image" alt="send" style={(botIsTyping | message === '') ? disabled : {}}></input>
                </form>
                <div className="sign-off-center">
                    <p className="sign-off">made with <span role="img" aria-label="love">❤️</span>by <a href={GITHUB} target="_blank" rel="noopener noreferrer">Rohan</a></p>
                </div>
            </div>
        )
    }
}

export default Chatbot;