// src/app/components/HeroSection.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import firmReports from "@/public/firm_reports.svg";
/**************************************************
 * Hydrogen‑Orbital WebGL canvas                  *
 * (identical shader logic, just moved here)      *
 *************************************************/
const HydrogenOrbital: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    /* ──── SHADERS ──── */
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() { gl_Position = a_position; }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      
      float orbital(vec3 p, float t){
        float r = length(p);
        if(r < 0.001) return 0.0;
        float angular = p.x * p.x / (r*r);
        float radial_nodes = abs(sin(3.14159 * r * 2.0));
        float breath = 1.0 + 0.075 * sin(t*0.2);
        float radial = exp(-r * (0.5 / breath));
        return angular * radial * radial_nodes * 5.0;
      }

      vec3 orbitColor(float d,float t){
        vec3 white = vec3(1.0);
        vec3 blue  = vec3(0.0,0.0,1.0);
        float k = 0.5 + 0.5 * sin(t*0.15);
        float blend = smoothstep(0.0,1.0,k*d);
        return mix(blue, white, blend);
      }

      void main(){
        vec2 uv = gl_FragCoord.xy/u_resolution.xy*2.0-1.0;
        uv.x *= u_resolution.x/u_resolution.y;
        float t = u_time*0.15;
        float camR=5.0;
        vec3 ro = vec3(camR*cos(t),0.2*sin(t*0.15),camR*sin(t));
        vec3 target = vec3(sin(t*0.1)*0.1,sin(t*0.08)*0.05,sin(t*0.12)*0.1);
        vec3 f = normalize(target-ro);
        vec3 r = normalize(cross(vec3(0.0,1.0,0.0),f));
        vec3 u = cross(f,r);
        vec3 rd = normalize(f + r*uv.x + u*uv.y);

        float s=0.0,density=0.0;
        for(int i=0;i<50;i++){
          vec3 p = ro + rd*s;
          float d = orbital(p,t);
          density += d*0.08;
          s += 0.15;
          if(density>1.0 || s>10.0) break;
        }

        if(density<0.05){ gl_FragColor=vec4(0.0,0.0,0.0,1.0); }
        else{
          float sd=smoothstep(0.05,0.8,density);
          vec3 col=orbitColor(sd,t);
          float glow=pow(sd,1.5);
          col=mix(col,col*1.2,glow*0.3);
          gl_FragColor=vec4(col*sd,1.0);
        }
      }
    `;

    const makeShader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = makeShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = makeShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }

    const aPos = gl.getAttribLocation(prog, "a_position");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
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
    );

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const render = () => {
      const elapsed = (performance.now() - start) * 0.001;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.enableVertexAttribArray(aPos);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

/**************************************************
 * Hero Section                                   *
 *************************************************/
const HeroSection: React.FC = () => (
  <section id="hero" className="relative">
    {/* ─── VISUAL BANNER ─── */}
    <div className="relative w-full h-[440px] md:h-[520px] lg:h-[680px] overflow-hidden">
      <HydrogenOrbital />

      {/* blue base-line under the banner */}
      <div className="absolute bottom-0 inset-x-0 h-[18px] bg-primary-blue" />

      {/* ─── TOP-RIGHT STYLING OPTIONS ───────────────────────────── */}
      <div className="absolute top-4 right-4 z-20 select-none">
        <div className="inline-flex items-center gap-2">
          <div className="px-2 py-[3px] rounded-[40px] flex items-center">
            <span className="text-Light-Therapy text-xs font-bold font-['Helvetica_Now_Display'] leading-[13.2px]">
              hydrogen electron orbitals probability density
            </span>
          </div>
          <div className="px-2 py-[3px] bg-[#f0f0f0] rounded-[40px] flex items-center">
            <span className="text-primary-blue text-xs font-bold font-['Helvetica_Now_Display'] leading-[13.2px]">
              1,2
            </span>
          </div>
        </div>
      </div>

      {/* centred brand token */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      bg-primary-blue p-6 flex items-center justify-center
                      text-light-therapy">
        <Image
          src="/firm_reports.svg"
          width={96}
          height={96}
          alt="Firm reports"
          className="w-24 h-24 object-contain"
          priority
          unoptimized
        />
      </div>
    </div>

    {/* ─── CONTENT GRID ─── */}
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-40" >
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-8 grid-auto-rows-min">
        {/* ─── LEFT COLUMN ─────────────────────────────────────── */}
        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* date */}
          <p className="text-grey text-body font-helvetica-now font-medium">
          June&nbsp;2025
          </p>

          {/* page title */}
          <h1 className="font-medium leading-none">
            <span className="block text-primary-blue text-h1 font-helvetica-now">
              Radionuclide
            </span>
            <span className="block text-black text-h1 font-helvetica-now">
              Ecosystem
            </span>
          </h1>

          {/* section label */}
          <h2 className="font-medium">
            <span className="text-grey text-h2 font-helvetica-now">Section&nbsp;1:&nbsp;</span>
            <span className="text-black text-h2 font-helvetica-now">The industry</span>
          </h2>

          {/* authors */}
          <p className="text-grey text-body font-helvetica-now font-medium">
            <b>Contributors:</b><br />
            <a 
              href="https://www.linkedin.com/in/jean-francois-gestin-63370037/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-blue transition-colors"
            >
              Jean-François Gestin
            </a>
            ,{" "}
            <a 
              href="https://www.linkedin.com/in/molly-mcgaughan/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-blue transition-colors"
            >
              Molly McGaughan
            </a>
            ,{" "}
            <a 
              href="https://www.linkedin.com/in/kostja-paschalidis-b8975b75/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-blue transition-colors"
            >
              Kostja Paschalidis
            </a>
            ,{" "}
            <a 
              href="https://www.linkedin.com/in/estellericoux/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-blue transition-colors"
            >
              Estelle Ricoux
            </a>
          </p>
        </motion.div>

        {/* ─── RIGHT COLUMN ────────────────────────────────────── */}
        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-6 flex flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="text-black text-h2 font-helvetica-now font-medium">
            An overview of isotope types, ligands, targets, companies in the
            space, manufacturing methods, global&nbsp;demand, and current
            access.
          </p>

          <p className="text-grey text-body font-helvetica-now font-medium">
            Our Radionuclide Ecosystem Overview offers a comprehensive
            examination of the rapidly evolving landscape of radionuclide
            therapies and the ecosystem that supports it. We designed this
            resource to help industry leaders, innovators, and investors
            understand the complexities and interdependencies that define this
            growing field.
          </p>
        </motion.div>
      </div>
    </div>
    <div className="h-px w-screen bg-light-grey"></div>
  </section>
);

export default HeroSection;
