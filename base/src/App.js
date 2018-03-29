import React from 'react';
import io from "socket.io-client";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: "",
      userId: 1,
      roomId: 1,
      messages: []
    };

    this.socket = io("http://localhost:3001");

    this.socket.on('connect' , () => {
      this.socket.emit('room', this.state.roomId);
      console.log("connected");
      this.socket.on("message", (message) => {
        console.log("received message from server", message);
        const messages = this.state.messages;

        messages.push(message);

        this.setState({
          messages
        });
      });
    });

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const res = await fetch("http://localhost:3001/messages?$sort[date]=1");
    const json = await res.json();

    this.setState({
      messages: json
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

    const messageObj = {
        text: message,
        roomId,
        userId,
        date: (new Date()).getTime()
    };

    // this.renderMessage(messageObj);

    this.socket.emit('message', messageObj);

    this.setState({
        message: ""
    });
  }


  render() {
    const messages = this.state.messages;
    const message = this.state.message;
    return (
      <div className="col-6 offset-3">
        <ul className="list-group">
          {messages.map((m, index) => {
            return (
              <li
                key={index}
                className="list-group-item">
                {m.text}
              </li>
            );
          })}
        </ul>
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
      </div>
    );
  }
}

export default App;
