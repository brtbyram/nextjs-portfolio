import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const simulationVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;
varying vec2 vUv;

const float delta = 1.4;

void main() {
    vec2 uv = vUv;
    if(frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y; 

    vec2 texelSize = 1.0 / resolution;
    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left = texture2D(textureA, uv - vec2(texelSize.x, 0.0)).x;
    float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down = texture2D(textureA, uv - vec2(0.0, texelSize.y)).x;

    vec2 texelBorder = texelSize * 2.0;
    if(uv.x <= texelBorder.x) p_left = p_right;
    if(uv.x >= 1.0 - texelBorder.x) p_right = p_left;
    if(uv.y <= texelBorder.y) p_down = p_up;
    if(uv.y >= 1.0 - texelBorder.y) p_up = p_down;

    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

    pressure += delta * pVel;
    pVel -= 0.005 * delta * pressure;

    pVel *= 1.0 - 0.002 * delta;
    pressure *= 0.999;

    vec2 mouseUV = mouse / resolution;
    if(mouse.x > 0.0) {
        float dist = distance(uv, mouseUV);
        if(dist < 0.02) {
            pressure += 2.0 * (1.0 - dist / 0.02);
        }
    }

    gl_FragColor = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);
}`;

const renderVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D inkTexture;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    vec4 data = texture2D(textureA, vUv);
    vec2 distortion = data.zw * 0.05;
    
    // Ink mask değerini al (0 = beyaz, 1 = siyah mürekkep)
    float ink = texture2D(inkTexture, vUv).r;
    
    // Distortion uygula
    vec2 distortedUV = vUv + distortion;
    
    // Normal gri ripple rengi
    vec3 color1 = vec3(0.85, 0.85, 0.87);
    vec3 color2 = vec3(0.75, 0.75, 0.8);
    vec3 grayColor = mix(color1, color2, distortedUV.y);
    
    // Siyah mürekkep rengi
    vec3 blackColor = vec3(0.05, 0.05, 0.08);
    
    // Ink mask'e göre renk karıştır
    vec3 finalColor = mix(grayColor, blackColor, ink);
    
    // Specular highlight
    vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 0.3;
    
    finalColor += vec3(specular);
    
    // Alpha: normal ripple için düşük, mürekkep için yüksek
    float alpha = 0.15 + abs(data.x) * 0.2;
    alpha = mix(alpha, 0.85, ink);
    
    gl_FragColor = vec4(finalColor, alpha);
}`;

export default function WaterRippleWrapper({ 
  children, 
  quality = 0.75,
  brushSize = 60,
  fadeSpeed = 0.008 // Mürekkebin kaybolma hızı (0.005 = yavaş, 0.02 = hızlı)
}) {
  const canvasRef = useRef(null);
  const inkCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseDown = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current || !inkCanvasRef.current) return;

    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    
    const pixelRatio = Math.min(window.devicePixelRatio * quality, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mouse = new THREE.Vector2(0, 0);
    let frame = 0;

    const width = Math.floor(window.innerWidth * pixelRatio);
    const height = Math.floor(window.innerHeight * pixelRatio);

    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    let rta = new THREE.WebGLRenderTarget(width, height, options);
    let rtb = new THREE.WebGLRenderTarget(width, height, options);

    // Ink canvas (mürekkep için)
    const inkCanvas = inkCanvasRef.current;
    inkCanvas.width = width;
    inkCanvas.height = height;
    const inkCtx = inkCanvas.getContext('2d');
    inkCtx.fillStyle = 'black';
    inkCtx.fillRect(0, 0, width, height);

    const inkTexture = new THREE.CanvasTexture(inkCanvas);
    inkTexture.minFilter = THREE.LinearFilter;
    inkTexture.magFilter = THREE.LinearFilter;

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        inkTexture: { value: inkTexture },
        resolution: { value: new THREE.Vector2(width, height) },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);


    // Mürekkebi yavaşça fade out et
    const fadeInk = () => {
      const imageData = inkCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Her pixel'in RGB değerini azalt (beyaza döndür)
        data[i] = Math.max(0, data[i] - fadeSpeed * 255);
        data[i + 1] = Math.max(0, data[i + 1] - fadeSpeed * 255);
        data[i + 2] = Math.max(0, data[i + 2] - fadeSpeed * 255);
      }
      
      inkCtx.putImageData(imageData, 0, 0);
      inkTexture.needsUpdate = true;
    };

    const handleResize = () => {
      const newPixelRatio = Math.min(window.devicePixelRatio * quality, 2);
      const newWidth = Math.floor(window.innerWidth * newPixelRatio);
      const newHeight = Math.floor(window.innerHeight * newPixelRatio);

      renderer.setPixelRatio(newPixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      rta.setSize(newWidth, newHeight);
      rtb.setSize(newWidth, newHeight);
      
      inkCanvas.width = newWidth;
      inkCanvas.height = newHeight;
      inkCtx.fillStyle = 'black';
      inkCtx.fillRect(0, 0, newWidth, newHeight);
      inkTexture.needsUpdate = true;
      
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);
      renderMaterial.uniforms.resolution.value.set(newWidth, newHeight);
    };

    const handleMouseMove = (e) => {
      const x = e.clientX * pixelRatio;
      const y = (window.innerHeight - e.clientY) * pixelRatio;
      mouse.set(x, y);

      // Mouse basılıysa mürekkep çiz
      if (mouseDown.current) {
        drawInk(e.clientX, e.clientY);
        
        // Smooth line drawing
        if (lastMouse.current.x && lastMouse.current.y) {
          const dx = e.clientX - lastMouse.current.x;
          const dy = e.clientY - lastMouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const steps = Math.max(Math.floor(distance / 3), 1);
          
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const ix = lastMouse.current.x + dx * t;
            const iy = lastMouse.current.y + dy * t;
            drawInk(ix, iy);
          }
        }
        
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e) => {
      mouseDown.current = true;
      drawInk(e.clientX, e.clientY);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
      lastMouse.current = { x: 0, y: 0 };
    };

    const handleMouseLeave = () => {
      mouse.set(0, 0);
      mouseDown.current = false;
      lastMouse.current = { x: 0, y: 0 };
    };

    window.addEventListener('resize', handleResize); // 
    window.addEventListener('mousemove', handleMouseMove); 
    window.addEventListener('mouseup', handleMouseUp); // 
    window.addEventListener('mouseleave', handleMouseLeave);

    let animationId;
    function animate() {
      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;

      simMaterial.uniforms.textureA.value = rta.texture;
      renderer.setRenderTarget(rtb);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtb.texture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      // Her frame'de mürekkebi yavaşça fade et
      fadeInk();

      const temp = rta;
      rta = rtb;
      rtb = temp;

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
      
      renderer.dispose();
      rta.dispose();
      rtb.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      plane.dispose();
      inkTexture.dispose();
    };
  }, [quality, brushSize, fadeSpeed]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '100vh', }}>
      <canvas ref={inkCanvasRef} style={{ display: 'none' }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 999,
          pointerEvents: 'auto',
          cursor: 'crosshair',
        }}
      />
    </div>
  );
}