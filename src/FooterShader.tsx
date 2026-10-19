import { useEffect, useRef } from 'react'

const vertexSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const fragmentSource = `
precision mediump float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float wave = 0.045 * sin(uv.y * 5.0 - uTime * 0.48 + sin(uv.x * 4.0 + uTime * 0.24));
  float broadLight = exp(-pow((uv.x - 0.08 - wave) / 0.43, 2.0)) * 0.19;
  float ribbon = exp(-pow((uv.x - 0.15 - 0.07 * sin(uv.y * 4.0 + uTime * 0.32)) / 0.23, 2.0)) * 0.07;
  float pointerLight = exp(-distance(uv, uPointer) * 5.5) * 0.12;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  float shade = clamp(0.012 + broadLight + ribbon + pointerLight + grain * 0.006, 0.0, 0.35);
  gl_FragColor = vec4(vec3(shade), 1.0);
}`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function FooterShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertex || !fragment) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    if (!buffer) return
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'uResolution')
    const pointer = gl.getUniformLocation(program, 'uPointer')
    const time = gl.getUniformLocation(program, 'uTime')
    const mouse = { x: -10, y: -10 }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    let frameId = 0
    let visible = true

    const draw = (now: number) => {
      const bounds = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(bounds.width * dpr))
      const height = Math.max(1, Math.round(bounds.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
      gl.uniform2f(resolution, width, height)
      gl.uniform2f(pointer, mouse.x, mouse.y)
      gl.uniform1f(time, reducedMotion ? 0 : (now - started) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const tick = (now: number) => {
      if (!visible) { frameId = 0; return }
      draw(now)
      frameId = requestAnimationFrame(tick)
    }
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      mouse.x = (event.clientX - bounds.left) / bounds.width
      mouse.y = 1 - (event.clientY - bounds.top) / bounds.height
      if (reducedMotion) draw(performance.now())
    }
    const onPointerLeave = () => {
      mouse.x = -10
      mouse.y = -10
      if (reducedMotion) draw(performance.now())
    }
    const resizeObserver = new ResizeObserver(() => draw(performance.now()))
    resizeObserver.observe(host)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frameId && !reducedMotion) frameId = requestAnimationFrame(tick)
    })
    intersectionObserver.observe(host)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    draw(started)
    if (!reducedMotion) frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas className="footer-shader" ref={canvasRef} aria-hidden="true" />
}
