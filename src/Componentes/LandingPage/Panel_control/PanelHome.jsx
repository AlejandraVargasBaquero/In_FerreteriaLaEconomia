"use client"

import { useEffect, useState } from "react"
import { FaTools } from "react-icons/fa"
import "./PanelHome.css"

function Typewriter({ text, speed = 80, startDelay = 0, className = "" }) {
  const [shown, setShown] = useState("")

  useEffect(() => {
    let i = 0
    let timer
    const start = () => {
      timer = setInterval(() => {
        i += 1
        setShown(text.slice(0, i))
        if (i >= text.length) clearInterval(timer)
      }, speed)
    }
    const delayId = setTimeout(start, startDelay)
    return () => { clearTimeout(delayId); clearInterval(timer) }
  }, [text, speed, startDelay])

  return (
    <span className={className}>{shown}</span>
  )
}

function PanelHome() {
  const title = "Bienvenido al Sistema"
  const subtitle = "Panel de control — Selecciona opciones desde el menú lateral"

  // más lento (velocidad + delays)
  const titleSpeed = 90
  const subtitleSpeed = 50
  const subtitleDelay = title.length * titleSpeed + 800

  return (
    <div className="panel-home-hero">

      <div className="welcome-card">
        <h1 className="hero-title">
          <Typewriter text={title} speed={titleSpeed} />
        </h1>
        <p className="hero-subtitle">
          <Typewriter text={subtitle} speed={subtitleSpeed} startDelay={subtitleDelay} />
        </p>
      </div>
    </div>
  )
}

export default PanelHome
