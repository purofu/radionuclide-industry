// src/app/components/HeroSection.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/* ───────── Hydrogen‑Orbital canvas ───────── */
const HydrogenOrbital = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) {
      console.error("WebGL not supported"); return;
    }

    /* ================= SHADERS ================= */
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() { gl_Position = a_position; }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      /* — orbital density — */
      float orbital(vec3 p, float t) {
        float r = length(p);
        if (r < 0.001) return 0.0;
        float angular = p.x * p.x / (r * r);           /* p‑orbital (l=1,m=1) */
        float radial_nodes = abs(sin(3.14159 * r * 2.0));
        float breath = 1.0 + 0.075 * sin(t * 0.2);     /* subtle breathing   */
        float radial = exp(-r * (0.5 / breath));
        return angular * radial * radial_nodes * 5.0;
      }

      /* — colour between blue and white — */
      vec3 orbitColor(float d, float t) {
        vec3 white = vec3(1.0);
        vec3 blue  = vec3(0.0,0.0,1.0);
        float k = 0.5 + 0.5 * sin(t * 0.15);
        float blend = smoothstep(0.0, 1.0, k * d);
        return mix(blue, white, blend);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.15;
        float camR = 5.0;
        vec3 ro = vec3(camR * cos(t), 0.2 * sin(t*0.15), camR * sin(t));
        vec3 target = vec3(
          sin(t*0.1)*0.1,
          sin(t*0.08)*0.05,
          sin(t*0.12)*0.1
        );

        vec3 f = normalize(target - ro);
        vec3 r = normalize(cross(vec3(0.0,1.0,0.0), f));
        vec3 u = cross(f,r);
        vec3 rd = normalize(f + r*uv.x + u*uv.y);

        float s=0.0, density=0.0;
        for(int i=0;i<50;i++){
          vec3 p = ro + rd*s;
          float d = orbital(p, t);
          density += d*0.08;
          s += 0.15;
          if(density>1.0||s>10.0) break;
        }

        if(density<0.05) {
          gl_FragColor = vec4(0.0,0.0,0.0,1.0);
        } else {
          float sd = smoothstep(0.05,0.8,density);
          vec3 col = orbitColor(sd,t);
          float glow = pow(sd,1.5);
          col = mix(col, col*1.2, glow*0.3);
          gl_FragColor = vec4(col*sd,1.0);
        }
      }
    `;

    const makeShader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh)); gl.deleteShader(sh); return null;
      }
      return sh;
    };

    const vs = makeShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = makeShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog)); return;
    }

    const aPos = gl.getAttribLocation(prog, "a_position");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1,-1, 1,-1, -1,1,
        -1,1, 1,-1, 1,1
      ]),
      gl.STATIC_DRAW
    );

    /* — resize & render — */
    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const render = () => {
      const elapsed = (performance.now() - start) * 0.001;

      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
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

    /* cleanup */
    return () => {
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
      gl.deleteShader(vs); gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

/* ───────── Hero‑Section ───────── */
const HeroSection: React.FC = () => (
  /* Full‑bleed shell with large vertical spacing */
  <section id="hero" className="relative w-screen left-1/2 -translate-x-1/2 py-32 overflow-hidden">
    {/* BACKGROUND LAYER (half white / half animation) */}
    <div className="absolute inset-0 flex z-0">
      <div className="w-1/2 h-full bg-white" />
      <div className="w-1/2 h-full hidden md:block">
        <HydrogenOrbital />
      </div>
    </div>

    {/* CONTENT LAYER (centred container + grid) */}
    <div className="relative container mx-auto px-4 md:px-6 lg:px-8 z-10">
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN content */}
        <div className="col-span-4 md:col-span-4 lg:col-span-5">
          <motion.div
            className="flex flex-col gap-6 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <Image src="/logo_dark.svg" alt="Firm Design LLC Logo" width={120} height={40} priority />

            {/* Title */}
            <h1 className="text-h1 font-helvetica-now">
              <span className="text-black">Radionuclide </span>
              <span className="text-primary-blue font-bold">Ecosystem</span>
            </h1>

            {/* Date badge */}
            <div className="p-4 bg-primary-blue rounded">
              <p className="text-light-therapy text-body-small font-helvetica-now">
                <span className="font-bold">12th</span> of <span className="font-bold">April 2025</span>
                <br />
                <span className="text-h3">Section 1: The industry</span>
              </p>
            </div>

            {/* Contributors */}
            <p className="text-body font-helvetica-now">
              <span className="font-medium">Contributors:</span> <br />
              <span className="underline">Molly McGaughan</span>,{" "}
              <span className="underline">Kostja Paschalidis</span>,{" "}
              <span className="underline">Estelle Ricoux</span>
            </p>

            {/* Intro paragraph */}
            <div className="text-h5 font-medium text-black">
                <span>Our first section offers a comprehensive examination of the rapidly evolving landscape of radionuclide therapies, including an overview of isotope types, ligands, targets, companies in the space, manufacturing methods, global demand, and current access.</span> <br/><br/>
                <span>We designed this resource to help industry leaders, innovators, and investors identify and track leaders and emerging newcomers, and  understand the interdependencies that define this growing field.</span>
                </div>
             
          </motion.div>
        </div>

        {/* RIGHT side remains empty to preserve grid spacing */}
        <div className="hidden md:block md:col-span-4 lg:col-span-7" />
      </div>
    </div>

    {/* Full‑width bottom divider */}
    <div className="absolute bottom-0 inset-x-0 h-px bg-light-grey z-10" />
  </section>
);

export default HeroSection;


