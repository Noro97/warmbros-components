import { useRef, useEffect, useCallback, type CSSProperties } from 'react';
import styles from './Receipt3D.module.css';

export interface ReceiptItem {
  name: string;
  price: number;
}

export interface Receipt3DProps {
  /** Store/shop name displayed at the top */
  storeName?: string;
  /** Address line */
  address?: string;
  /** Phone number */
  phone?: string;
  /** Date string */
  date?: string;
  /** Order number */
  orderNumber?: string;
  /** List of items on the receipt */
  items?: ReceiptItem[];
  /** Tax rate as decimal (e.g. 0.08 for 8%) */
  taxRate?: number;
  /** Footer message */
  footerMessage?: string;
  /** Footer sub-text */
  footerSubText?: string;
  /** Background color */
  backgroundColor?: string;
  /** Hint text shown below the receipt */
  hintText?: string;
  /** Width of the container */
  width?: number | string;
  /** Height of the container */
  height?: number | string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
}

interface Constraint {
  p1: number;
  p2: number;
  rest: number;
}

function generateReceiptTexture(props: Receipt3DProps): HTMLCanvasElement {
  const {
    storeName = 'THE STORE',
    address = '42 Mesh Lane, WebGL City',
    phone = 'Tel: (555) 042-1337',
    date = new Date().toISOString().slice(0, 10),
    orderNumber = '#00001',
    items = [],
    taxRate = 0.08,
    footerMessage = 'Thank you for visiting!',
    footerSubText = '',
  } = props;

  const texCanvas = document.createElement('canvas');
  texCanvas.width = 1024;
  texCanvas.height = 2048;
  const ctx = texCanvas.getContext('2d')!;

  ctx.scale(2, 2);
  const W = 512;
  const H = 1024;

  // Paper background
  ctx.fillStyle = '#f8f8f4';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#1a1a1a';

  // Header
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(storeName, W / 2, 80);

  ctx.font = '22px monospace';
  ctx.fillText(address, W / 2, 125);
  ctx.fillText(phone, W / 2, 160);

  // Meta info
  ctx.textAlign = 'left';
  ctx.fillText(`Date: ${date}`, 40, 230);
  ctx.fillText(`Order: ${orderNumber}`, 40, 270);

  // Dashed divider
  ctx.textAlign = 'center';
  ctx.fillText('- - - - - - - - - - - - - - - - - -', W / 2, 320);

  // Items
  ctx.textAlign = 'left';
  const startY = 380;
  const lineH = 45;

  items.forEach((item, i) => {
    ctx.textAlign = 'left';
    ctx.fillText(item.name, 40, startY + lineH * i);
    ctx.textAlign = 'right';
    ctx.fillText(`$${item.price.toFixed(2)}`, W - 40, startY + lineH * i);
  });

  const afterItemsY = startY + lineH * items.length + 30;

  // Dashed divider
  ctx.textAlign = 'center';
  ctx.fillText('- - - - - - - - - - - - - - - - - -', W / 2, afterItemsY);

  // Subtotal & Tax
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  ctx.textAlign = 'left';
  ctx.fillText('Subtotal', 40, afterItemsY + 60);
  ctx.fillText(`Tax (${(taxRate * 100).toFixed(0)}%)`, 40, afterItemsY + 105);

  ctx.textAlign = 'right';
  ctx.fillText(`$${subtotal.toFixed(2)}`, W - 40, afterItemsY + 60);
  ctx.fillText(`$${tax.toFixed(2)}`, W - 40, afterItemsY + 105);

  // Thick line divider
  ctx.fillRect(40, afterItemsY + 145, W - 80, 5);

  // Total
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL', 40, afterItemsY + 205);
  ctx.textAlign = 'right';
  ctx.fillText(`$${total.toFixed(2)}`, W - 40, afterItemsY + 205);

  // Footer
  ctx.font = '22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(footerMessage, W / 2, afterItemsY + 310);

  if (footerSubText) {
    ctx.font = '18px monospace';
    ctx.fillStyle = '#555';
    ctx.fillText(footerSubText, W / 2, afterItemsY + 350);
  }

  return texCanvas;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function setPerspective(
  out: Float32Array,
  fovy: number,
  aspect: number,
  near: number,
  far: number,
) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
}

function setTranslation(out: Float32Array, x: number, y: number, z: number) {
  out.fill(0);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  out[12] = x;
  out[13] = y;
  out[14] = z;
}

const VS_SOURCE = `
  attribute vec3 a_pos;
  attribute vec3 a_norm;
  attribute vec2 a_uv;
  uniform mat4 u_proj;
  uniform mat4 u_view;
  varying vec3 v_norm;
  varying vec2 v_uv;
  void main() {
    v_norm = a_norm;
    v_uv = a_uv;
    gl_Position = u_proj * u_view * vec4(a_pos, 1.0);
  }
`;

const FS_SOURCE = `
  precision mediump float;
  varying vec3 v_norm;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  void main() {
    vec3 norm = normalize(v_norm);
    if (!gl_FrontFacing) norm = -norm;

    vec3 lightDir1 = normalize(vec3(0.4, 0.8, 0.6));
    vec3 lightDir2 = normalize(vec3(-0.5, -0.2, 0.8));

    float diff1 = max(dot(norm, lightDir1), 0.0);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    float ambient = 0.55;

    vec4 texColor = texture2D(u_tex, v_uv);
    vec3 finalColor = texColor.rgb * (ambient + diff1 * 0.4 + diff2 * 0.2);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

const NUM_X = 25;
const NUM_Y = 50;
const NUM_PARTICLES = NUM_X * NUM_Y;
const CLOTH_WIDTH = 3.0;
const CLOTH_HEIGHT = 6.0;
const FOV = (45 * Math.PI) / 180;
const CAM = { x: 0, y: -3.2, z: 10.5 };

export function Receipt3D({
  storeName,
  address,
  phone,
  date,
  orderNumber,
  items,
  taxRate,
  footerMessage,
  footerSubText,
  backgroundColor = '#e5e5e5',
  hintText = 'Grab and drag the receipt',
  width = '100%',
  height = 500,
  className,
  style,
}: Receipt3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<{
    particles: Particle[];
    constraints: Constraint[];
    indices: number[];
    posData: Float32Array;
    normalData: Float32Array;
    uvData: Float32Array;
    grabbedIndex: number;
    grabDepth: number;
    pointerX: number;
    pointerY: number;
    aspect: number;
    time: number;
    gl: WebGLRenderingContext | null;
    program: WebGLProgram | null;
    posBuf: WebGLBuffer | null;
    normBuf: WebGLBuffer | null;
    uvBuf: WebGLBuffer | null;
    idxBuf: WebGLBuffer | null;
    uProj: WebGLUniformLocation | null;
    uView: WebGLUniformLocation | null;
    projMatrix: Float32Array;
    viewMatrix: Float32Array;
  } | null>(null);

  const initPhysics = useCallback(() => {
    const particles: Particle[] = [];
    const uvData = new Float32Array(NUM_PARTICLES * 2);

    for (let y = 0; y < NUM_Y; y++) {
      for (let x = 0; x < NUM_X; x++) {
        const px = (x / (NUM_X - 1) - 0.5) * CLOTH_WIDTH;
        const py = -(y / (NUM_Y - 1)) * CLOTH_HEIGHT;
        const i = y * NUM_X + x;
        particles.push({ x: px, y: py, z: 0, ox: px, oy: py, oz: 0 });
        uvData[i * 2] = x / (NUM_X - 1);
        uvData[i * 2 + 1] = y / (NUM_Y - 1);
      }
    }

    const constraints: Constraint[] = [];
    function addC(i1: number, i2: number) {
      const dx = particles[i2].x - particles[i1].x;
      const dy = particles[i2].y - particles[i1].y;
      const dz = particles[i2].z - particles[i1].z;
      constraints.push({
        p1: i1,
        p2: i2,
        rest: Math.sqrt(dx * dx + dy * dy + dz * dz),
      });
    }

    for (let y = 0; y < NUM_Y; y++) {
      for (let x = 0; x < NUM_X; x++) {
        const i = y * NUM_X + x;
        if (x < NUM_X - 1) addC(i, i + 1);
        if (y < NUM_Y - 1) addC(i, i + NUM_X);
        if (x < NUM_X - 1 && y < NUM_Y - 1) {
          addC(i, i + NUM_X + 1);
          addC(i + 1, i + NUM_X);
        }
        if (x < NUM_X - 2) addC(i, i + 2);
        if (y < NUM_Y - 2) addC(i, i + NUM_X * 2);
      }
    }

    const indices: number[] = [];
    for (let y = 0; y < NUM_Y - 1; y++) {
      for (let x = 0; x < NUM_X - 1; x++) {
        const i = y * NUM_X + x;
        indices.push(i, i + 1, i + NUM_X);
        indices.push(i + 1, i + NUM_X + 1, i + NUM_X);
      }
    }

    return {
      particles,
      constraints,
      indices,
      uvData,
      posData: new Float32Array(NUM_PARTICLES * 3),
      normalData: new Float32Array(NUM_PARTICLES * 3),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Init physics
    const { particles, constraints, indices, uvData, posData, normalData } =
      initPhysics();

    // Compile shaders
    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VS_SOURCE)!);
    gl.attachShader(
      program,
      createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE)!,
    );
    gl.linkProgram(program);
    gl.useProgram(program);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    const aNorm = gl.getAttribLocation(program, 'a_norm');
    const aUv = gl.getAttribLocation(program, 'a_uv');
    const uProj = gl.getUniformLocation(program, 'u_proj');
    const uView = gl.getUniformLocation(program, 'u_view');

    // Texture
    const texCanvas = generateReceiptTexture({
      storeName,
      address,
      phone,
      date,
      orderNumber,
      items,
      taxRate,
      footerMessage,
      footerSubText,
    });
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      texCanvas,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Buffers
    const posBuf = gl.createBuffer();
    const normBuf = gl.createBuffer();
    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );

    gl.enable(gl.DEPTH_TEST);

    const projMatrix = new Float32Array(16);
    const viewMatrix = new Float32Array(16);

    stateRef.current = {
      particles,
      constraints,
      indices,
      posData,
      normalData,
      uvData,
      grabbedIndex: -1,
      grabDepth: 0,
      pointerX: 0,
      pointerY: 0,
      aspect: 1,
      time: 0,
      gl,
      program,
      posBuf,
      normBuf,
      uvBuf,
      idxBuf,
      uProj,
      uView,
      projMatrix,
      viewMatrix,
    };

    // Resize
    function resize() {
      if (!canvas || !gl || !stateRef.current) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      stateRef.current.aspect = canvas.width / canvas.height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Render loop
    function render() {
      const s = stateRef.current;
      if (!s || !s.gl) return;
      const { gl } = s;

      s.time += 0.016;

      // Physics
      const windX = Math.sin(s.time * 1.5) * 0.0015;
      const windZ = Math.cos(s.time * 1.1) * 0.0015;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        if (i < NUM_X || i === s.grabbedIndex) continue;
        const p = s.particles[i];
        const vx = (p.x - p.ox) * 0.985;
        const vy = (p.y - p.oy) * 0.985;
        const vz = (p.z - p.oz) * 0.985;
        p.ox = p.x;
        p.oy = p.y;
        p.oz = p.z;
        const windFactor = p.y / -CLOTH_HEIGHT;
        p.x += vx + windX * windFactor;
        p.y += vy - 0.007;
        p.z += vz + windZ * windFactor;
      }

      // Constraints
      for (let iter = 0; iter < 15; iter++) {
        for (let i = 0; i < s.constraints.length; i++) {
          const c = s.constraints[i];
          const p1 = s.particles[c.p1];
          const p2 = s.particles[c.p2];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const w1 = c.p1 < NUM_X || c.p1 === s.grabbedIndex ? 0 : 1;
          const w2 = c.p2 < NUM_X || c.p2 === s.grabbedIndex ? 0 : 1;
          const wSum = w1 + w2;
          if (wSum > 0) {
            const diff = (dist - c.rest) / (dist * wSum);
            const ox = dx * diff;
            const oy = dy * diff;
            const oz = dz * diff;
            if (w1) {
              p1.x += ox;
              p1.y += oy;
              p1.z += oz;
            }
            if (w2) {
              p2.x -= ox;
              p2.y -= oy;
              p2.z -= oz;
            }
          }
        }
      }

      // Update buffers
      s.normalData.fill(0);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = s.particles[i];
        s.posData[i * 3] = p.x;
        s.posData[i * 3 + 1] = p.y;
        s.posData[i * 3 + 2] = p.z;
      }

      for (let i = 0; i < s.indices.length; i += 3) {
        const i1 = s.indices[i];
        const i2 = s.indices[i + 1];
        const i3 = s.indices[i + 2];
        const v1x = s.posData[i1 * 3],
          v1y = s.posData[i1 * 3 + 1],
          v1z = s.posData[i1 * 3 + 2];
        const v2x = s.posData[i2 * 3],
          v2y = s.posData[i2 * 3 + 1],
          v2z = s.posData[i2 * 3 + 2];
        const v3x = s.posData[i3 * 3],
          v3y = s.posData[i3 * 3 + 1],
          v3z = s.posData[i3 * 3 + 2];
        const dx1 = v2x - v1x,
          dy1 = v2y - v1y,
          dz1 = v2z - v1z;
        const dx2 = v3x - v1x,
          dy2 = v3y - v1y,
          dz2 = v3z - v1z;
        const nx = dy1 * dz2 - dz1 * dy2;
        const ny = dz1 * dx2 - dx1 * dz2;
        const nz = dx1 * dy2 - dy1 * dx2;
        s.normalData[i1 * 3] += nx;
        s.normalData[i1 * 3 + 1] += ny;
        s.normalData[i1 * 3 + 2] += nz;
        s.normalData[i2 * 3] += nx;
        s.normalData[i2 * 3 + 1] += ny;
        s.normalData[i2 * 3 + 2] += nz;
        s.normalData[i3 * 3] += nx;
        s.normalData[i3 * 3 + 1] += ny;
        s.normalData[i3 * 3 + 2] += nz;
      }

      // Parse bg color
      const r = parseInt(backgroundColor.slice(1, 3), 16) / 255;
      const g = parseInt(backgroundColor.slice(3, 5), 16) / 255;
      const b = parseInt(backgroundColor.slice(5, 7), 16) / 255;
      gl.clearColor(r, g, b, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      setPerspective(s.projMatrix, FOV, s.aspect, 0.1, 100.0);
      setTranslation(s.viewMatrix, -CAM.x, -CAM.y, -CAM.z);

      gl.uniformMatrix4fv(s.uProj, false, s.projMatrix);
      gl.uniformMatrix4fv(s.uView, false, s.viewMatrix);

      gl.bindBuffer(gl.ARRAY_BUFFER, s.posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, s.posData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, s.normBuf);
      gl.bufferData(gl.ARRAY_BUFFER, s.normalData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aNorm);
      gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, s.uvBuf);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, s.idxBuf);
      gl.drawElements(gl.TRIANGLES, s.indices.length, gl.UNSIGNED_SHORT, 0);

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      stateRef.current = null;
    };
  }, [
    initPhysics,
    storeName,
    address,
    phone,
    date,
    orderNumber,
    items,
    taxRate,
    footerMessage,
    footerSubText,
    backgroundColor,
  ]);

  const getRay = useCallback(() => {
    const s = stateRef.current;
    if (!s) return null;
    const tanFov = Math.tan(FOV / 2);
    const dx = s.pointerX * s.aspect * tanFov;
    const dy = s.pointerY * tanFov;
    const dz = -1;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return {
      origin: { x: CAM.x, y: CAM.y, z: CAM.z },
      dir: { x: dx / len, y: dy / len, z: dz / len },
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!s || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      s.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      const ray = getRay();
      if (!ray) return;

      let minDist = Infinity;
      let bestIdx = -1;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = s.particles[i];
        const vx = p.x - ray.origin.x;
        const vy = p.y - ray.origin.y;
        const vz = p.z - ray.origin.z;
        const t = vx * ray.dir.x + vy * ray.dir.y + vz * ray.dir.z;
        const px = ray.origin.x + ray.dir.x * t;
        const py = ray.origin.y + ray.dir.y * t;
        const pz = ray.origin.z + ray.dir.z * t;
        const dx = p.x - px;
        const dy = p.y - py;
        const dz = p.z - pz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDist && dist < 1.0) {
          minDist = dist;
          bestIdx = i;
          s.grabDepth = t;
        }
      }

      if (bestIdx !== -1) {
        s.grabbedIndex = bestIdx;
        canvas.setPointerCapture(e.pointerId);
        const indicator = indicatorRef.current;
        if (indicator) {
          indicator.style.display = 'block';
          indicator.style.left = e.clientX + 'px';
          indicator.style.top = e.clientY + 'px';
        }
      }
    },
    [getRay],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      if (!s || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      s.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (s.grabbedIndex !== -1) {
        const ray = getRay();
        if (!ray) return;
        const p = s.particles[s.grabbedIndex];
        p.x = ray.origin.x + ray.dir.x * s.grabDepth;
        p.y = ray.origin.y + ray.dir.y * s.grabDepth;
        p.z = ray.origin.z + ray.dir.z * s.grabDepth;
        p.ox = p.x;
        p.oy = p.y;
        p.oz = p.z;

        const indicator = indicatorRef.current;
        if (indicator) {
          indicator.style.left = e.clientX + 'px';
          indicator.style.top = e.clientY + 'px';
        }
      }
    },
    [getRay],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!s) return;
    s.grabbedIndex = -1;
    if (canvas) canvas.releasePointerCapture(e.pointerId);
    const indicator = indicatorRef.current;
    if (indicator) {
      indicator.style.display = 'none';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={[styles.container, className].filter(Boolean).join(' ')}
      style={{ width, height, backgroundColor, ...style }}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {hintText && (
        <div className={styles.hint}>
          <p>{hintText}</p>
        </div>
      )}
      <div ref={indicatorRef} className={styles.indicator} />
    </div>
  );
}
