import React, { Component } from 'react'
import '../stylesheet/Realtime.scss'

class Realtime extends Component {
  render() {
    var style = {
      height: this.props.data.height + "%"
    }

    return (
      <div className="Realtime">
        <div className="Meter">
          <div className="Fill" style={style}/>
        </div>
        <div className="Data">
          <h1>Nº DE REYNOLDS</h1>
          <h3>{this.props.data.reynolds || "0"}</h3>
        </div>
        <div className="Data Medium">
          <h1>AGUA UTILIZADA</h1>
          <h3>{this.props.data.total || "0"}L</h3>
        </div>
        <div className="Data Medium">
          <h1>FLUXO DE AGUA</h1>
          <h3>{this.props.data.flow || "0"}L/MIN</h3>
        </div>
      </div>
    )
  }
}

export default Realtime
