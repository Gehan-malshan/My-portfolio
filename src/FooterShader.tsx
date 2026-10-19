import { useEffect, useRef } from 'react'

const vertexSource = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

// Adapted from the supplied Velaris gradient, using only shades of gray.
const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform vec3 uColors[4];
uniform vec3 uBackground;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
    dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 p = vUv - 0.5;
  p.x *= uResolution.x / uResolution.y;
  float t = uTime * 0.1;
  float n1 = snoise(p * 0.4 + vec2(t * 0.2, -t * 0.3));
  float n2 = snoise(p * 0.55 + vec2(-t * 0.15, t * 0.25) + n1 * 0.25);
  float n3 = snoise(p * 0.75 + vec2(t * 0.1, -t * 0.2) + n2 * 0.2);

  vec3 color = uBackground;
  color = mix(color, uColors[0], smoothstep(-0.2, 0.5, n1) * 0.85);
  color = mix(color, uColors[1], smoothstep(-0.1, 0.6, n2) * 0.7);
  color = mix(color, uColors[2], smoothstep(-0.3, 0.4, n3) * 0.6);
  color = mix(color, uColors[3], smoothstep(0.0, 0.7, n1 * n2) * 0.5);

  float distanceFromCenter = length(p) * 1.5;
  float vignette = 1.0 - smoothstep(0.3, 1.2, distanceFromCenter);
  color += uColors[1] * smoothstep(0.8, 0.0, distanceFromCenter) * 0.3;
  color = mix(color * 0.2, color, vignette);
  float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453 + uTime);
  color += (grain - 0.5) * uGrain * 0.1;
  gl_FragColor = vec4(color, 1.0);
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'uResolution')
    const time = gl.getUniformLocation(program, 'uTime')
    const grain = gl.getUniformLocation(program, 'uGrain')
    const colors = gl.getUniformLocation(program, 'uColors[0]')
    const background = gl.getUniformLocation(program, 'uBackground')
    gl.uniform3fv(colors, new Float32Array([
      .16, .16, .16, .32, .32, .32, .07, .07, .07, .42, .42, .42,
    ]))
    gl.uniform3f(background, .005, .005, .005)
    gl.uniform1f(grain, .12)

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
      gl.uniform1f(time, reducedMotion ? 0 : (now - started) / 1000 * 2)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const tick = (now: number) => {
      if (!visible) { frameId = 0; return }
      draw(now)
      frameId = requestAnimationFrame(tick)
    }
    const resizeObserver = new ResizeObserver(() => draw(performance.now()))
    resizeObserver.observe(host)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frameId && !reducedMotion) frameId = requestAnimationFrame(tick)
    })
    intersectionObserver.observe(host)
    draw(started)
    if (!reducedMotion) frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas className="footer-shader" ref={canvasRef} aria-hidden="true" />
}
