import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'

export const Timer = (props) => {
  const [time, setTime] = useState(0)
  const [isOn, setIsOn] = useState(false)
  const [start, setStart] = useState(0)

  const [timer, setTimer] = useState()

  const startTimer = () => {
    setIsOn(true)
    setStart(Date.now() - time)
  }

  useEffect(() => {
    if (isOn) {
      setTimer(setInterval(() => setTime(Date.now() - start), 1000))
    } else {
      // console.log("trying to turn off timer")
      // clearInterval(timer())
    }
  }, [isOn])

  const stopTimer = () => {
    setIsOn(false)
    clearInterval(timer)
  }

  const resetTimer = () => {
    setIsOn(false)
    setTime(0)
  }

  const pad = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  const convert = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 3600) % 24)

    const humanized = [
      pad(hours.toString(), 2),
      pad(minutes.toString(), 2),
      pad(seconds.toString(), 2),
    ].join(':');

    return humanized;
  }

  return (
    <div>
      <h3>timer: {convert(time)}</h3>
      {(time == 0) ?
        <Button onClick={startTimer} variant="contained"
          color="primary">start</Button> : null}
      {(time == 0 || !isOn) ? null :
        <Button onClick={stopTimer} variant="contained"
          color="primary">stop</Button>}
      {(time == 0 || isOn) ? null :
        <Button onClick={startTimer} variant="contained"
          color="primary">resume</Button>}
      {(time == 0 || isOn) ? null :
        <Button onClick={resetTimer} variant="contained"
          color="primary">reset</Button>}
    </div>
  )
}