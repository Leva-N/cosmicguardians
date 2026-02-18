'use client'

import React, { useEffect, useRef } from 'react'

const BG_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const BG_FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_time;
uniform float u_panSpeed;

vec3 applyContrast(vec3 color, float contrast) {
  return (color - 0.5) * contrast + 0.5;
}

vec3 applySaturation(vec3 color, float saturation) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(luma), color, saturation);
}

void main() {
  vec2 uv = vec2(fract(v_uv.x + u_time * u_panSpeed), v_uv.y);
  vec3 color = texture2D(u_texture, uv).rgb;

  color *= 3.8;
  color = applyContrast(color, 1.6);
  color = applySaturation(color, 2.8);
  color *= vec3(1.65, 0.58, 1.05);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
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

function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    const bgProgram = createProgram(
      gl,
      BG_VERTEX_SHADER_SOURCE,
      BG_FRAGMENT_SHADER_SOURCE
    )
    if (!bgProgram) return

    const image = new Image()
    image.src = '/images/8k_stars_milky_way.jpg'
    image.decoding = 'async'

    let rafId = 0
    let running = true
    let bgTextureReady = false
    let startTime = performance.now()
    let lastTime = performance.now()
    const PAN_SPEED_UV = 0.0048
    const quadBuffer = gl.createBuffer()
    const bgTexture = gl.createTexture()
    if (!quadBuffer || !bgTexture) return

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    )

    gl.bindTexture(gl.TEXTURE_2D, bgTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const bgPositionLocation = gl.getAttribLocation(bgProgram, 'a_position')
    const bgTimeLocation = gl.getUniformLocation(bgProgram, 'u_time')
    const bgPanSpeedLocation = gl.getUniformLocation(bgProgram, 'u_panSpeed')
    const bgTextureLocation = gl.getUniformLocation(bgProgram, 'u_texture')

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const pixelWidth = Math.floor(width * dpr)
      const pixelHeight = Math.floor(height * dpr)

      canvas.width = pixelWidth
      canvas.height = pixelHeight
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.style.transform = 'translateZ(0)'
      canvas.style.willChange = 'transform'

      gl.viewport(0, 0, pixelWidth, pixelHeight)
    }

    const draw = (time: number) => {
      if (!running) return

      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time
      if (dt <= 0) {
        rafId = window.requestAnimationFrame(draw)
        return
      }

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (bgTextureReady && bgTimeLocation && bgPanSpeedLocation && bgTextureLocation) {
        const elapsed = (time - startTime) / 1000

        gl.useProgram(bgProgram)
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
        gl.enableVertexAttribArray(bgPositionLocation)
        gl.vertexAttribPointer(bgPositionLocation, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, bgTexture)
        gl.uniform1i(bgTextureLocation, 0)
        gl.uniform1f(bgTimeLocation, elapsed)
        gl.uniform1f(bgPanSpeedLocation, PAN_SPEED_UV)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      rafId = window.requestAnimationFrame(draw)
    }

    const onLoad = () => {
      gl.bindTexture(gl.TEXTURE_2D, bgTexture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.generateMipmap(gl.TEXTURE_2D)

      bgTextureReady = true
      startTime = performance.now()
      resize()
      if (!rafId) {
        rafId = window.requestAnimationFrame(draw)
      }
    }

    image.addEventListener('load', onLoad)
    window.addEventListener('resize', resize)
    resize()

    if (image.complete && image.naturalWidth > 0) {
      onLoad()
    } else {
      rafId = window.requestAnimationFrame(draw)
    }

    return () => {
      running = false
      window.cancelAnimationFrame(rafId)
      image.removeEventListener('load', onLoad)
      window.removeEventListener('resize', resize)
      gl.deleteTexture(bgTexture)
      gl.deleteBuffer(quadBuffer)
      gl.deleteProgram(bgProgram)
    }
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  )
}
