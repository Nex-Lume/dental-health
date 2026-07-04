import React, { useEffect, useRef } from 'react';

export default function FluidCursorSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const prevMouse = useRef({ x: 0.5, y: 0.5 });
  
  // Three-point trailing system for organic fluid stretching
  const trail1 = useRef({ x: 0.5, y: 0.5 });
  const trail1Velocity = useRef({ x: 0, y: 0 });
  const trail2 = useRef({ x: 0.5, y: 0.5 });
  const trail2Velocity = useRef({ x: 0, y: 0 });

  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device supports touch/mobile
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    const gl = canvas.getContext('webgl', { alpha: true });
    if (!gl) return;

    // Handle resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    // Renders a solid white SDF blob (color: 1.0, 1.0, 1.0) with extremely sharp edges.
    // When combined with CSS mix-blend-mode: difference, it dynamically inverts the colors underneath it.
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_trail1;
      uniform vec2 u_trail2;
      uniform vec2 u_velocity;
      uniform float u_time;

      // Simplex 2D noise implementation
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx) ;
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 col = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Smooth minimum (metaball blending)
      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        vec2 uv = st;
        uv.x *= aspect;

        vec2 mouse = u_mouse;
        mouse.x *= aspect;

        vec2 trail1 = u_trail1;
        trail1.x *= aspect;

        vec2 trail2 = u_trail2;
        trail2.x *= aspect;

        float speed = length(u_velocity) * 12.0;

        // Radii dynamically taper to mimic stretching liquid stream
        float r1 = 0.018; 
        float r2 = mix(0.014, 0.009, clamp(speed, 0.0, 1.0));
        float r3 = mix(0.009, 0.003, clamp(speed, 0.0, 1.0));

        // SDF distance calculation
        float d1 = length(uv - mouse) - r1;
        float d2 = length(uv - trail1) - r2;
        float d3 = length(uv - trail2) - r3;

        // Smooth minimum blending (k expands with speed)
        float k = mix(0.024, 0.045, clamp(speed * 0.5, 0.0, 1.0));
        float dist = smin(d1, d2, k);
        dist = smin(dist, d3, k);

        // Turbulence noise on SDF edges
        vec2 noiseUV = uv * 6.0 + vec2(0.0, u_time * 0.8);
        float noiseVal = snoise(noiseUV) * mix(0.002, 0.0045, clamp(speed, 0.0, 1.0));
        dist += noiseVal;

        // Subpixel antialiasing threshold (extremely sharp, no soft halo)
        float alpha = 1.0 - smoothstep(-0.0012, 0.0012, dist);

        if (alpha < 0.05) {
          discard;
        }

        // Render pure white (mix-blend-mode: difference handles inversion)
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `;

    // Shader Compiler Helpers
    const loadShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup geometry (quad covering full canvas)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const trail1Loc = gl.getUniformLocation(program, 'u_trail1');
    const trail2Loc = gl.getUniformLocation(program, 'u_trail2');
    const velocityLoc = gl.getUniformLocation(program, 'u_velocity');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    // Mouse Tracking Coordinates (Normalized)
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1.0 - (e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop variables
    let animationFrameId: number;
    const startTime = performance.now();

    // Mass-Spring-Damper settings (staggered for tail flow)
    const stiffness1 = 0.16;
    const damping1 = 0.64;

    const stiffness2 = 0.10;
    const damping2 = 0.58;

    const render = () => {
      const time = (performance.now() - startTime) / 1000;

      // 1. Spring physics for trailing viscous point 1 (follows mouse)
      const dx1 = mouse.current.x - trail1.current.x;
      const dy1 = mouse.current.y - trail1.current.y;
      const fx1 = dx1 * stiffness1;
      const fy1 = dy1 * stiffness1;
      trail1Velocity.current.x += fx1;
      trail1Velocity.current.y += fy1;
      trail1Velocity.current.x *= damping1;
      trail1Velocity.current.y *= damping1;
      trail1.current.x += trail1Velocity.current.x;
      trail1.current.y += trail1Velocity.current.y;

      // 2. Spring physics for trailing viscous point 2 (follows point 1)
      const dx2 = trail1.current.x - trail2.current.x;
      const dy2 = trail1.current.y - trail2.current.y;
      const fx2 = dx2 * stiffness2;
      const fy2 = dy2 * stiffness2;
      trail2Velocity.current.x += fx2;
      trail2Velocity.current.y += fy2;
      trail2Velocity.current.x *= damping2;
      trail2Velocity.current.y *= damping2;
      trail2.current.x += trail2Velocity.current.x;
      trail2.current.y += trail2Velocity.current.y;

      // 3. Calculate mouse velocity
      const vx = mouse.current.x - prevMouse.current.x;
      const vy = mouse.current.y - prevMouse.current.y;

      velocity.current.x = velocity.current.x * 0.85 + vx * 0.15;
      velocity.current.y = velocity.current.y * 0.85 + vy * 0.15;

      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      // 4. Draw
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse.current.x, mouse.current.y);
      gl.uniform2f(trail1Loc, trail1.current.x, trail1.current.y);
      gl.uniform2f(trail2Loc, trail2.current.x, trail2.current.y);
      gl.uniform2f(velocityLoc, velocity.current.x, velocity.current.y);
      gl.uniform1f(timeLoc, time);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'difference' }}
    />
  );
}
