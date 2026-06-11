import { useEffect, useRef } from "react"

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "01アウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const charArray = chars.split("")
    const fontSize = 16
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#ef4444"
      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  )
}

export function WaterRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drops: Array<{ x: number; y: number; speed: number; length: number }> = []

    for (let i = 0; i < 100; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        length: Math.random() * 20 + 10,
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(200, 220, 255, 0.3)"
      ctx.lineWidth = 1

      drops.forEach((drop) => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })
    }

    const interval = setInterval(draw, 30)
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 z-5"
    />
  )
}

export function DigitalInsects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const insects: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
    }> = []

    for (let i = 0; i < 20; i++) {
      insects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? "#ef4444" : "#22c55e",
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      insects.forEach((insect) => {
        ctx.fillStyle = insect.color
        ctx.beginPath()
        ctx.arc(insect.x, insect.y, insect.size, 0, Math.PI * 2)
        ctx.fill()

        insect.x += insect.vx
        insect.y += insect.vy

        if (insect.x < 0 || insect.x > canvas.width) insect.vx *= -1
        if (insect.y < 0 || insect.y > canvas.height) insect.vy *= -1
      })
    }

    const interval = setInterval(draw, 30)
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 z-10"
    />
  )
}

export function NeonRings() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full" viewBox="0 0 1000 1000">
        <circle
          cx="500"
          cy="500"
          r="300"
          fill="none"
          stroke="rgba(239, 68, 68, 0.1)"
          strokeWidth="2"
          className="animate-pulse"
        />
        <circle
          cx="500"
          cy="500"
          r="400"
          fill="none"
          stroke="rgba(239, 68, 68, 0.05)"
          strokeWidth="1"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          cx="500"
          cy="500"
          r="200"
          fill="none"
          stroke="rgba(239, 68, 68, 0.15)"
          strokeWidth="2"
          className="animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </svg>
    </div>
  )
}

export function GlitchEffect() {
  return (
    <style>{`
      @keyframes glitch {
        0% { clip-path: inset(40% 0 61% 0); transform: translate(0); }
        20% { clip-path: inset(92% 0 1% 0); transform: translate(-2px, 2px); }
        40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, -2px); }
        60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
        80% { clip-path: inset(54% 0 7% 0); transform: translate(2px, 2px); }
        100% { clip-path: inset(58% 0 43% 0); transform: translate(0); }
      }
      .glitch {
        animation: glitch 0.3s infinite;
      }
    `}</style>
  )
}
