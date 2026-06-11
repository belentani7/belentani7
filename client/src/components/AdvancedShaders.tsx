import { useEffect, useRef } from "react"

/**
 * Ripple Shader - Ondas concéntricas en tonalidad rojo
 * Crea un efecto de ondas que se expanden desde el centro
 */
export function RippleShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      time += 0.02

      // Fondo oscuro
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar múltiples ondas
      for (let i = 0; i < 5; i++) {
        const radius = (time * 100 + i * 40) % 800
        const opacity = Math.max(0, 1 - radius / 800)
        const r0 = Math.max(1, radius - 20)
        const r1 = Math.max(r0 + 1, radius + 20)

        // Gradiente rojo
        const gradient = ctx.createRadialGradient(centerX, centerY, r0, centerX, centerY, r1)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${opacity * 0.6})`)
        gradient.addColorStop(0.5, `rgba(239, 68, 68, ${opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(239, 68, 68, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-40 z-0" />
}

/**
 * Distortion Shader - Efecto de vidrio distorsionado
 * Crea un efecto de refracción y distorsión
 */
export function DistortionShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0

    const animate = () => {
      time += 0.01

      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Crear líneas ondulantes
      ctx.strokeStyle = "rgba(239, 68, 68, 0.2)"
      ctx.lineWidth = 2

      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 20) {
          const wave = Math.sin((x + time * 50) * 0.01) * 15 + Math.cos((y + time * 30) * 0.01) * 15
          const yPos = y + wave
          if (x === 0) ctx.moveTo(x, yPos)
          else ctx.lineTo(x, yPos)
        }
        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 z-0" />
}

/**
 * Bloom Shader - Efecto de brillo etéreo
 * Crea un halo de luz rojo alrededor del centro
 */
export function BloomShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      time += 0.005

      ctx.fillStyle = "rgba(10, 10, 10, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Múltiples capas de bloom
      for (let layer = 0; layer < 3; layer++) {
        const intensity = Math.sin(time + layer) * 0.5 + 0.5
        const radius = Math.max(1, 300 + layer * 100)
        const opacity = intensity * 0.3

        const gradient = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${opacity})`)
        gradient.addColorStop(0.5, `rgba(239, 68, 68, ${opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(239, 68, 68, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20 z-0" />
}

/**
 * Volumetric Shader - Efecto de niebla volumétrica
 * Crea rayos de luz volumétrica en tonalidad rojo
 */
export function VolumetricShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let time = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      time += 0.01

      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Rayos volumétricos
      const rayCount = 12
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + time * 0.3
        const opacity = Math.sin(time + i) * 0.3 + 0.4

        ctx.fillStyle = `rgba(239, 68, 68, ${opacity * 0.15})`
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * canvas.width,
          centerY + Math.sin(angle) * canvas.height
        )
        ctx.lineTo(
          centerX + Math.cos(angle + 0.3) * canvas.width,
          centerY + Math.sin(angle + 0.3) * canvas.height
        )
        ctx.closePath()
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-25 z-0" />
}

/**
 * Collapse Shader - Efecto de colapso (Thiago Protocol)
 * Crea una onda expansiva de distorsión caótica
 */
export function CollapseShader({ active = false }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      if (active) {
        timeRef.current += 0.05
      } else {
        timeRef.current = Math.max(0, timeRef.current - 0.02)
      }

      ctx.fillStyle = "rgba(10, 10, 10, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (timeRef.current > 0) {
        // Onda expansiva
        const waveRadius = timeRef.current * 200
        const waveWidth = 50 + timeRef.current * 30

        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - timeRef.current / 3)})`
        ctx.lineWidth = waveWidth
        ctx.beginPath()
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Ruido caótico
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * waveRadius * 1.5
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance

          ctx.fillStyle = `rgba(239, 68, 68, ${Math.random() * 0.5 * (1 - timeRef.current / 3)})`
          ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 4 + 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [active])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-50 z-15" />
}

/**
 * Particle Bloom - Partículas brillantes que flotan
 */
export function ParticleBloom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }> = []

    // Crear partículas iniciales
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life > p.maxLife) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            life: 0,
            maxLife: 100 + Math.random() * 100,
          }
        }

        const opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 15)
        gradient.addColorStop(0, `rgba(239, 68, 68, ${opacity})`)
        gradient.addColorStop(1, `rgba(239, 68, 68, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-35 z-5" />
}
