import React, { Component } from 'react'
import '../stylesheet/App.scss'
import io from 'socket.io-client'

let socket = io();

class App extends Component {
  componentWillMount() {
    this.setState({ status: false, data: {} });

    socket.on(`connect`, data => {
      this.setState({ status: true });
    });

    socket.on(`disconnect`, data => {
      this.setState({ status: false });
      this.context.router.push("/app/loading");
    });

    socket.on(`status`, data => {
      this.setState({ data });
      if (data.available) {
        this.context.router.push("/app/realtime");
      } else {
        this.context.router.push("/app/loading");
      }
    });
  }

  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, {
          status: this.state.status,
          data: this.state.data
        })}
      </div>
    )
  }
}

App.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};

export default App
