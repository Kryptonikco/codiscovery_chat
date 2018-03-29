import React from "react";
import io from "socket.io-client";

import Api from "../utils/Api";

const CHAT_HEIGHT = 300;

class Scene extends React.Component {
    state = {
        messages: []
    };

    constructor(props) {
        super(props);

        const roomId = props.match.params.id;
        const userId = props.match.params.userId;

        this.state = {
            message: "",
            hasFetched: false,
            roomId,
            userId,
            messages: []
        };

        this.socket = io('http://localhost:3001');

        this.socket.on('connect', () => {
            this.socket.emit("room", roomId);
            // this.socket.join(roomId);
            this.socket.on("message", (message) => {
                console.log("received from server message", message);
                // const {
                //     messages
                // } = this.state;
                // messages.push(message);
                // this.setState({
                //     messages
                // });
                this.renderMessage(message);
            });
        });


        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount() {
        const {
            roomId
        } = this.state;
        
        const messages = await Api.getMessages({
            roomId
        });

        this.setState({
            hasFetched: true,
            messages
        });
    }

    onChange(e) {
        if (e.key === "Enter") {
            this.onSubmit();
            return;
        }
        this.setState({
            message: e.target.value
        });
    }

    getScrollHeight() {
        const el = document.querySelectorAll('ul.list-group')[0];
        if (!el) {
            return CHAT_HEIGHT;
        }
        return el.scrollHeight;
    }

    getMessageObj({
        message,
        userId,
        roomId
    }) {
        return {
            roomId,
            text: message,
            userId,
            date: (new Date()).getTime()
        };
    }

    renderMessage(message) {
        const {
            messages
        } = this.state;

        messages.push(message);

        this.setState({
            messages
        });
    }

    onSubmit() {
        const {
            message,
            roomId,
            userId
        } = this.state;

        if (message.length === 0) {
            return;
        }

        // console.log("sending message", message);

        const messageObj = this.getMessageObj({
            message,
            roomId,
            userId
        });

        // this.renderMessage(messageObj);

        this.socket.emit('message', messageObj);

        this.setState({
            message: ""
        });
    }

    renderInput() {
        const {
            message
        } = this.state;

        return (
            <div className="input-group">
                <input
                    value={message}
                    type="text"
                    className="form-control"
                    onKeyUp={this.onChange}
                    onChange={this.onChange} />
                <div className="input-group-append">
                    <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={this.onSubmit}>
                        Send
                    </button>
                </div>
            </div>
        );
    }

    scrollElement() { // https://stackoverflow.com/a/28748160
        window.requestAnimationFrame(() => {
            var node = document.querySelectorAll('ul.list-group')[0];
            if (node !== undefined) {
                node.scrollTop = node.scrollHeight;
            }
        });
    }

    render() {
        const {
            userId,
            hasFetched,
            messages,
            // message
        } = this.state;

        if (messages.length === 0) {
            if (hasFetched === true) {
                return (
                    <div className="col-6 offset-3">
                        Aucun message sur ce groupe pour le moment
                        {this.renderInput()}
                    </div>
                );
            }
            return (
                <div className="col-6 offset-3">
                    Loading...
                </div>
            );
        }

        // const scrollHeight = this.getScrollHeight();
        this.scrollElement();

        // console.log('#render scrollHeight', scrollHeight);

        return (
            <div className="col-6 offset-3">
                <ul
                    className="list-group"
                    style={{
                        height: CHAT_HEIGHT,
                        overflow: 'scroll',
                        // scrollTop: scrollHeight
                    }}>
                    {messages.map((m, index) => {
                        const isMe = m.userId === userId;
                        const itemClass = isMe ? "list-group-item-primary" : "list-group-item-secondary";
                        return (
                            <li
                                key={index}
                                className={`list-group-item ${itemClass}`}
                                style={{
                                    textAlign: isMe ? "right" : "left"
                                }}>
                                {m.text}
                            </li>
                        );                     
                    })}
                </ul>
                {this.renderInput()}
            </div>
        );
    }
}

export default Scene;