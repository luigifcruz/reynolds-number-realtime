import React, { Component } from 'react'
import '../stylesheet/Loading.scss'

class Loading extends Component {
  render() {
    return (
      <div className="Loading">
        <center>
          <img src="http://image000.flaticon.com/icons/svg/124/124588.svg"></img>
          <div>Waiting Satellite</div>
          {this.props.status ?
            <p>CONNECTED WITH KIERA</p> :
            <p className="neg">DISCONNECTED WITH KIERA</p>
          }
        </center>
      </div>
    )
  }
}

export default Loading
