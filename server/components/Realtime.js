import React, { Component } from 'react'
import '../stylesheet/Realtime.scss'

class Realtime extends Component {
  render() {
    return (
      <div className="Realtime">
        <div className="Meter">
          <div className="Fill"/>
        </div>
        <div className="Data">
          <h1>Nº DE REYNOLDS</h1>
          <h3>2.000</h3>
        </div>
        <div className="Data Medium">
          <h1>AGUA UTILIZADA</h1>
          <h3>20L</h3>
        </div>
        <div className="Data Medium">
          <h1>FLUXO DE AGUA</h1>
          <h3>20L/MIN</h3>
        </div>
      </div>
    )
  }
}

export default Realtime
