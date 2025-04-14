// src/app/components/HeroSection.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Hydrogen Orbital Component
const HydrogenOrbital = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl', { antialias: true });
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // Store gl in a constant that TypeScript knows is not null
    const webgl = gl;
    
    // Vertex shader
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;
    
    // Modified fragment shader with white and blue (0000ff) colors
    const fragmentShaderSource = `
      precision highp float;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      
      // Smooth orbital function for n=4, l=1, m=1
      float orbital(vec3 p, float time) {
        float r = length(p);
        if (r < 0.001) return 0.0;
        
        // p-orbital shape (l=1, m=1)
        float angular = p.x * p.x / (r * r);
        
        // Subtle radial nodes for n=4
        float radial_nodes = abs(sin(3.14159 * r * 2.0));
        
        // Ultra-smooth breathing effect
        float breath = 1.0 + 0.075 * sin(time * 0.2);
        
        // Radial decay
        float radial = exp(-r * (0.5 / breath));
        
        return angular * radial * radial_nodes * 5.0;
      }
      
      // Color transition between white and blue (0000ff)
      vec3 orbitColor(float density, float time) {
        vec3 white = vec3(1.0, 1.0, 1.0);
        vec3 blue = vec3(0.0, 0.0, 1.0); // 0000ff
        
        // Very slow, ultra-smooth transition
        float t = 0.5 + 0.5 * sin(time * 0.15);
        
        // Use smoothstep for more gradual transition
        float blend = smoothstep(0.0, 1.0, t * density);
        
        return mix(blue, white, blend);
      }
      
      void main() {
        // Normalized coordinates
        vec2 uv = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;
        
        // Super smooth camera movement
        float time = u_time * 0.15; // Very slow time
        
        // Camera position with smoother orbit
        float camRadius = 5.0;
        vec3 ro = vec3(
          camRadius * cos(time),
          0.2 * sin(time * 0.15), // Much slower vertical movement
          camRadius * sin(time)
        );
        
        // Look at origin with subtle drift
        vec3 target = vec3(
          sin(time * 0.1) * 0.1, // Subtle target movement
          sin(time * 0.08) * 0.05,
          sin(time * 0.12) * 0.1
        );
        
        vec3 forward = normalize(target - ro);
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        vec3 up = cross(forward, right);
        
        // Ray direction
        vec3 rd = normalize(forward + right * uv.x + up * uv.y);
        
        // Ray marching with smoother accumulation
        float t = 0.0;
        float density = 0.0;
        
        for (int i = 0; i < 50; i++) { // More steps for smoother result
          vec3 p = ro + rd * t;
          float d = orbital(p, time);
          
          // Smoother accumulation
          density += d * 0.08;
          
          // Smaller step size for smoother result
          t += 0.15;
          
          // Early exit
          if (density > 1.0 || t > 10.0) break;
        }
        
        // Apply color with smoother transition
        if (density < 0.05) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Clean black background
        } else {
          // Smooth step for density transition
          float smoothDensity = smoothstep(0.05, 0.8, density);
          vec3 color = orbitColor(smoothDensity, time);
          
          // Soft glow effect
          float glow = pow(smoothDensity, 1.5);
          color = mix(color, color * 1.2, glow * 0.3);
          
          gl_FragColor = vec4(color * smoothDensity, 1.0);
        }
      }
    `;
    
    // Create shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }
    
    const vertexShader = createShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    // Create program
    const program = webgl.createProgram();
    if (!program) return;
    
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
      console.error('Program error:', webgl.getProgramInfoLog(program));
      return;
    }
    
    // Locations
    const positionAttributeLocation = webgl.getAttribLocation(program, 'a_position');
    const resolutionUniformLocation = webgl.getUniformLocation(program, 'u_resolution');
    const timeUniformLocation = webgl.getUniformLocation(program, 'u_time');
    
    // Create buffer
    const positionBuffer = webgl.createBuffer();
    if (!positionBuffer) return;
    
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    
    // Quad positions
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);
    
    // Set canvas size
    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      webgl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let startTime = Date.now();
    
    // Animation function
    function render() {
      if (!canvas) return;
      
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) * 0.001;
      
      // Clear canvas with transparent background
      webgl.clearColor(0.0, 0.0, 0.0, 0.0);
      webgl.clear(webgl.COLOR_BUFFER_BIT);
      
      // Use program
      webgl.useProgram(program);
      
      // Set up attribute
      webgl.enableVertexAttribArray(positionAttributeLocation);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
      webgl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        webgl.FLOAT,
        false,
        0,
        0
      );
      
      // Set uniforms
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      webgl.uniform2f(resolutionUniformLocation, canvasWidth, canvasHeight);
      webgl.uniform1f(timeUniformLocation, elapsedTime);
      
      // Draw
      webgl.drawArrays(webgl.TRIANGLES, 0, 6);
      
      // Animate
      requestAnimationFrame(render);
    }
    
    // Start animation
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (program) webgl.deleteProgram(program);
      if (vertexShader) webgl.deleteShader(vertexShader);
      if (fragmentShader) webgl.deleteShader(fragmentShader);
      if (positionBuffer) webgl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};

const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* WebGL visualization that extends completely to the right edge */}
      <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-1/2 bg-black z-0" style={{ right: "-1px", width: "calc(50% + 1px)" }}>
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <HydrogenOrbital />
        </div>
      </div>

      {/* Main content grid - Using proper grid container with padding */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 h-full px-8 md:px-16 lg:px-24 relative z-10">
        {/* Left column - Content - properly spans columns based on screen size */}
        <div className="col-span-4 sm:col-span-4 md:col-span-6 flex items-center">
          <motion.div 
            className="w-full md:w-[632px] inline-flex flex-col justify-start items-start gap-[23px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded flex flex-col justify-start items-start gap-2.5">
              <div className="inline-flex justify-start items-start gap-[26.35px]">
                <div className="w-[8.21px] h-[8.21px] bg-[#0764ff]" />
                <div className="w-[94.15px] h-[33.21px] bg-Black" />
              </div>
              <div className="justify-center"><span className="text-Black text-lg font-bold font-['Helvetica_Now_Display'] leading-tight">Reports </span><span className="text-Grey text-lg font-bold font-['Helvetica_Now_Display'] leading-tight">first chapter</span></div>
            </div>
            <div className="justify-center"><span className="text-Black text-8xl font-medium font-['Helvetica_Now_Display'] leading-[96px]">Radionuclide    </span><span className="text-[#0000ff] text-8xl font-bold font-['Helvetica_Now_Display'] leading-[96px]">Industry</span><span className="text-Black text-8xl font-bold font-['Helvetica_Now_Display'] leading-[96px]"> <br/></span><span className="text-Black text-8xl font-medium font-['Helvetica_Now_Display'] leading-[96px]">Ecosystem</span></div>
            <div className="p-2.5 bg-[#ebeef3] rounded inline-flex justify-center items-center gap-2.5">
              <div className="justify-center"><span className="text-Black text-sm font-bold font-['Helvetica_Now_Display'] leading-none">12th</span><span className="text-Black text-sm font-medium font-['Helvetica_Now_Display'] leading-none"> of </span><span className="text-Black text-sm font-bold font-['Helvetica_Now_Display'] leading-none">April </span><span className="text-Black text-sm font-medium font-['Helvetica_Now_Display'] leading-none">2025</span></div>
            </div>
            <div className="justify-center"><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] leading-tight">Contributors: </span><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] underline leading-tight">Molly McGaughan</span><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] leading-tight">, </span><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] underline leading-tight">Kostja Paschalidis</span><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] leading-tight">, </span><span className="text-Black text-lg font-medium font-['Helvetica_Now_Display'] underline leading-tight">Estelle Ricoux</span></div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch justify-center text-Black text-[26px] font-bold font-['Helvetica_Now_Display'] leading-7">An overview of isotope types, ligands, targets, companies in the space, manufacturing methods, global demand, and current access.</div>
              <div className="w-full sm:w-[572px] justify-center text-Grey text-lg font-medium font-['Helvetica_Now_Display'] leading-tight">Our Radionuclide Ecosystem Overview offers a comprehensive examination of the rapidly evolving landscape of radionuclide therapies and the ecosystem that supports it. We designed this resource to help industry leaders, innovators, and investors understand the complexities and interdependencies that define this growing field.</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 w-full h-px bg-light-grey z-10" />
    </section>
  );
};

export default HeroSection;