import React, { Component } from 'react'
import '../stylesheet/Loading.scss'

class Loading extends Component {
  render() {
    return (
      <div className="Loading">
        <center>
          <img src="http://image000.flaticon.com/icons/svg/124/124588.svg"></img>
          <div>Waiting Connection</div>
        </center>
      </div>
    )
  }
}

export default Loading
