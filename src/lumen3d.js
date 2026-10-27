/* LUMEN FOLD / FABRIC 003 — responsive full-bleed 3D cloth installation.
   Curved fabric strips with neighbor-coupled damped spring physics, proximity
   interaction, dragging, propagating waves and adaptive desktop/mobile rendering. */
export async function createLumenScene(canvas, hooks = {}) {
  const unavailable = {setMode(){},updatePointer(){},pointer(){},pointerLeave(){},release(){},ripple(){},dispose(){},pickProject(){return -1},isNearAperture(){return false}};
  if (!canvas || hooks.reducedMotion) { hooks.onFailure?.(); return unavailable; }
  let THREE;
  try { THREE = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js'); }
  catch(err) { console.warn('LUMEN FOLD Three.js load:',err); hooks.onFailure?.(); return unavailable; }
  if (hooks.isCancelled?.()) return unavailable;
  const low = matchMedia('(pointer:coarse)').matches || (navigator.deviceMemory||8)<=4 || (navigator.hardwareConcurrency||8)<=4;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t, ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
  const damp=(a,b,k,dt)=>mix(a,b,1-Math.exp(-k*dt));
  const noise=i=>{const v=Math.sin(i*127.1+17.4)*43758.5453;return v-Math.floor(v)};
  let scene,cam,renderer,rig,art,showcase,raycaster,plane,gestureLight,glowGroup,glowMaterial;
  let pieces=[],drops=[],frames=[],targetMeshes=[],materials=[],geometries=[],textures=[],waves=[],gapMeshes=[];
  let playing=true,disposed=false,frame=0,last=0,t=0,frameNo=0,qualityLow=false,slowFrames=0,qualityCooldown=0,resizeOnWindow=false,onScreen=true,screenObserver;
  let panel='home',open=0,openVelocity=0,pressure=0,energy=0,observer;
  const hand={x:.7,y:.49,active:false,down:false,speed:0,vx:0,vy:0},soft={x:.7,y:.49,speed:0,vx:0,vy:0};
  const mousePoint=new THREE.Vector3(99,99,0),worldPoint=new THREE.Vector3(),testPoint=new THREE.Vector3();
  const ndc=new THREE.Vector2();
  const len=low?76:116,stepsAcross=low?6:12,total=low?10:14;
  // Adaptive high-DPI scene: cap total pixels, not every phone at blurry 1x.
  const targetDpr=(w=Math.max(1,canvas.parentElement?.clientWidth||390),
                   h=Math.max(1,canvas.parentElement?.clientHeight||844))=>{
    const native=window.devicePixelRatio||1;
    const budget=low?1480000:2600000;
    return Math.max(1,Math.min(native,low?1.85:2,Math.sqrt(budget/Math.max(1,w*h))));
  };
  const applyDpr=(w,h)=>{
    if(!renderer)return;
    const full=targetDpr(w,h);
    renderer.setPixelRatio(qualityLow?Math.max(1.13,full*.8):full);
  };
  const keepG=g=>{geometries.push(g);return g},keepM=m=>{materials.push(m);return m},keepT=q=>{textures.push(q);return q};
  function envMap(){
    const imgs=[];
    for(let i=0;i<6;i++){
      const c=document.createElement('canvas');c.width=c.height=256;
      const ctx=c.getContext('2d'),gradient=ctx.createLinearGradient(0,0,256,256);
      gradient.addColorStop(0,i%2?'#818da4':'#e7ded5');
      gradient.addColorStop(.6,'#e7edf7');gradient.addColorStop(1,'#9fa8b8');
      ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);
      ctx.fillStyle='rgba(255,255,255,.95)';ctx.fillRect(39,0,28,256);
      ctx.fillStyle='rgba(255,255,255,.83)';ctx.fillRect(170,0,27,220);
      imgs.push(c);
    }
    const c=keepT(new THREE.CubeTexture(imgs));c.colorSpace=THREE.SRGBColorSpace;c.mapping=THREE.CubeReflectionMapping;c.needsUpdate=true;return c;
  }
  // Procedural woven texture: tiny interlaced warp/weft micro-threads.
  function weaveTexture(){
    const canvas=document.createElement('canvas');
    canvas.width=canvas.height=256;
    const ctx=canvas.getContext('2d'),image=ctx.createImageData(256,256);
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      const warp=Math.cos(x*Math.PI/3.3),weft=Math.cos(y*Math.PI/3.3);
      const cross=((Math.floor(x/3)%2)===(Math.floor(y/3)%2)?1:-1)*4;
      const v=Math.max(0,Math.min(255,Math.round(128+warp*14+weft*13+warp*weft*7+Math.sin((x+y)*.41)*2+cross)));
      const k=(y*256+x)*4;image.data[k]=image.data[k+1]=image.data[k+2]=v;image.data[k+3]=255;
    }
    ctx.putImageData(image,0,0);
    const map=keepT(new THREE.CanvasTexture(canvas));
    map.wrapS=map.wrapT=THREE.RepeatWrapping;
    map.repeat.set(20,2.0);
    map.anisotropy=low?1:4;
    map.colorSpace=THREE.NoColorSpace;
    map.needsUpdate=true;
    return map;
  }
  const weave=weaveTexture();
  const fabricColors=[0xfafafb,0xf2f5f7,0xfdfcfb,0xf5f8fa,0xf8f9fb];
  const paperMaterial=i=>keepM(new THREE.MeshPhysicalMaterial({
    color:fabricColors[i%fabricColors.length],
    side:THREE.DoubleSide,
    metalness:0,
    roughness:.89,
    clearcoat:.015,
    clearcoatRoughness:.95,
    sheen:.30,
    sheenColor:new THREE.Color(0xe8f1f5),
    sheenRoughness:.92,
    bumpMap:weave,
    bumpScale:low?.009:.018
  }));
  // White cloth bands stretch beyond both viewport edges.
  // Curated crossing/sweeping arcs, no looping knots or closed torus-like shapes.
  const ribbonBlueprints=Array.from({length:total},(_,i)=>{
    const base=((total-1)*.5-i)*(low?1.04:.86);
    const xx=[-15,-12.2,-9.1,-6.1,-3.0,-.25,2.5,5.6,8.6,11.8,15];
    return xx.map((x,j)=>{
      const wave=Math.sin(x*.34+i*.79)*(.31+.11*(i%3));
      const fold=Math.sin(x*.71+i*1.43)*(.16+.035*(i%4));
      const accent=(i===2?.77:i===5?-.68:i===7?.55:0)
        *Math.exp(-Math.pow((x+.8)/5.3,2));
      const y=base+wave+fold+accent+Math.sin(j*.43+i*.61)*.11;
      const z=-1.12+(i%3)*.62+Math.sin(x*.39+i*.95)*.30;
      return new THREE.Vector3(x,y,z);
    });
  });
  const spatialCurves=ribbonBlueprints.map(points=>
    new THREE.CatmullRomCurve3(points,false,'catmullrom',.28)
  );
  function curl(i,u){return spatialCurves[i].getPoint(u);}
  function makeRibbon(i) {
    const cells=(len+1)*(stepsAcross+1);
    const coordinates=new Float32Array(cells*3),uvs=new Float32Array(cells*2),faces=[];
    const mids=[],cross=[],motion=[],sizes=[];
    const width=.24+(i%4)*.053;
    for(let j=0;j<=len;j++){
      const u=j/len,center=curl(i,u);
      const tangent=curl(i,clamp(u+.003,0,1)).sub(curl(i,clamp(u-.003,0,1))).normalize();
      const sideways=new THREE.Vector3(0,0,1).cross(tangent).normalize();
      if(sideways.lengthSq()<.0001)sideways.set(0,1,0).cross(tangent).normalize();
      const normal=new THREE.Vector3().crossVectors(tangent,sideways).normalize();
      const twist=Math.sin(u*6.7+i*.93)*.24+Math.sin(u*13.6+i*1.37)*.13;
      sideways.multiplyScalar(Math.cos(twist)).addScaledVector(normal,Math.sin(twist)).normalize();
      mids.push(center);cross.push(sideways);motion.push({x:0,y:0,z:0,vx:0,vy:0,vz:0});
      const size=width*(.85+.15*Math.sin(u*Math.PI*2.3+i*.49));
      sizes.push(size);
      for(let w=0;w<=stepsAcross;w++){
        const spread=w/stepsAcross*2-1;
        const k=(j*(stepsAcross+1)+w)*3;
        const uv=(j*(stepsAcross+1)+w)*2;
        uvs[uv]=u;uvs[uv+1]=w/stepsAcross;
        coordinates[k]=center.x+sideways.x*size*spread;
        coordinates[k+1]=center.y+sideways.y*size*spread;
        coordinates[k+2]=center.z+sideways.z*size*spread
          +Math.sin((w/stepsAcross)*Math.PI)*(.17+.025*Math.sin(u*11+i))
          +Math.sin(u*21+i*1.3+spread*2.6)*.046*Math.sin((w/stepsAcross)*Math.PI);
      }
    }
    for(let j=0;j<len;j++)for(let w=0;w<stepsAcross;w++){
      const a=j*(stepsAcross+1)+w,b=a+stepsAcross+1;
      faces.push(a,b,a+1,b,b+1,a+1);
    }
    const rest=coordinates.slice();
    const geometry=keepG(new THREE.BufferGeometry());
    geometry.setAttribute('position',new THREE.BufferAttribute(coordinates,3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
    geometry.setIndex(faces);geometry.computeVertexNormals();
    const surface=paperMaterial(i);
    const mesh=new THREE.Mesh(geometry,surface);mesh.frustumCulled=false;art.add(mesh);
    const lines=new Float32Array(len*12),edge=keepG(new THREE.BufferGeometry());
    edge.setAttribute('position',new THREE.BufferAttribute(lines,3).setUsage(THREE.DynamicDrawUsage));
    const tracer=new THREE.LineSegments(edge,keepM(new THREE.LineBasicMaterial({
      color:0xd1dce1,opacity:.17,transparent:true,depthWrite:false
    })));tracer.frustumCulled=false;art.add(tracer);
    pieces.push({geometry,coordinates,rest,mids,cross,motion,sizes,width,lines,edge,i,
      snapshots:new Float32Array((len+1)*3)});
  }
  // Light-leak strips live behind the opaque fabric so actual Z depth
  // hides glow wherever ribbons overlap the scene.
  function buildGapGlow(){
    glowGroup=new THREE.Group();art.add(glowGroup);
    const uniforms={
      uTime:{value:0},
      uTouch:{value:new THREE.Vector2(-99,-99)},
      uStrength:{value:0},
      uHue:{value:new THREE.Color(0xc5e8f5)}
    };
    glowMaterial=keepM(new THREE.ShaderMaterial({
      uniforms,transparent:true,depthTest:true,depthWrite:false,
      blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
      vertexShader:[
        'varying vec2 vUv;',
        'varying vec3 vPosition;',
        'void main(){',
        'vUv=uv;',
        'vPosition=position;',
        'gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);',
        '}'
      ].join('\n'),
      fragmentShader:[
        'uniform float uTime;',
        'uniform vec2 uTouch;',
        'uniform float uStrength;',
        'uniform vec3 uHue;',
        'varying vec2 vUv;',
        'varying vec3 vPosition;',
        'void main(){',
        'float distFromMiddle=abs(vUv.y*2.0-1.0);',
        'float core=pow(max(0.0,1.0-distFromMiddle),2.4);',
        'float halo=pow(max(0.0,1.0-distFromMiddle),.72);',
        'float ends=smoothstep(0.0,.08,vUv.x)*(1.0-smoothstep(.92,1.0,vUv.x));',
        'float near=1.0-smoothstep(0.0,3.5,distance(vPosition.xy,uTouch));',
        'near*=uStrength;',
        'float shimmer=.90+.10*sin(uTime*.62+vUv.x*10.0);',
        'float alpha=(.09*halo+.17*core+near*(.14*halo+.22*core))*ends*shimmer;',
        'gl_FragColor=vec4(uHue*(.7+.4*near),alpha);',
        '}'
      ].join('\n')
    }));
    for(let i=0;i<total-1;i++){
      const positions=new Float32Array((len+1)*3*3);
      const uvs=new Float32Array((len+1)*3*2),faces=[];
      for(let j=0;j<=len;j++){
        const u=j/len,a=pieces[i].mids[j],b=pieces[i+1].mids[j];
        for(let k=0;k<3;k++){
          const n=(j*3+k)*3,q=(j*3+k)*2;
          positions[n]=(a.x+b.x)*.5;
          positions[n+1]=(a.y+b.y)*.5+(k-1)*.45;
          positions[n+2]=-2.72;
          uvs[q]=u;uvs[q+1]=k*.5;
        }
        if(j<len)for(let k=0;k<2;k++){
          const n=j*3+k,m=n+3;
          faces.push(n,m,n+1,m,m+1,n+1);
        }
      }
      const geo=keepG(new THREE.BufferGeometry());
      geo.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
      geo.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
      geo.setIndex(faces);
      const mesh=new THREE.Mesh(geo,glowMaterial);
      mesh.frustumCulled=false;glowGroup.add(mesh);
      gapMeshes.push({geo,positions,i});
    }
  }
  function moveGapGlow(dt){
    for(const gap of gapMeshes){
      const a=pieces[gap.i],b=pieces[gap.i+1],pos=gap.positions;
      for(let j=0;j<=len;j++){
        const ca=a.mids[j],cb=b.mids[j],ma=a.motion[j],mb=b.motion[j];
        const u=j/len,roll=Math.sin(u*12.4+gap.i*.75+t*.36)*.065;
        const y=(ca.y+ma.y+cb.y+mb.y)*.5;
        const x=(ca.x+ma.x+cb.x+mb.x)*.5;
        for(let k=0;k<3;k++){
          const n=(j*3+k)*3;
          pos[n]=x;
          pos[n+1]=y+(k-1)*(.38+roll);
          pos[n+2]=-2.65+(ma.z+mb.z)*.13;
        }
      }
      gap.geo.attributes.position.needsUpdate=true;
    }
    glowMaterial.uniforms.uTime.value=t;
    glowMaterial.uniforms.uTouch.value.set(mousePoint.x,mousePoint.y);
    glowMaterial.uniforms.uStrength.value=damp(
      glowMaterial.uniforms.uStrength.value,
      hand.active?Math.min(1,energy*.90+pressure*.42):0,
      5.8,dt
    );
  }
  function floorGradient(){
    const c=document.createElement('canvas');c.width=c.height=256;
    const ctx=c.getContext('2d'),g=ctx.createRadialGradient(128,128,0,128,128,128);
    g.addColorStop(0,'rgba(83,88,97,.21)');g.addColorStop(.53,'rgba(83,88,97,.04)');
    g.addColorStop(1,'rgba(83,88,97,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
    const texture=keepT(new THREE.CanvasTexture(c));texture.colorSpace=THREE.SRGBColorSpace;return texture;
  }
  function makePoster(i){
    const canvas=document.createElement('canvas');canvas.width=480;canvas.height=600;
    const ctx=canvas.getContext('2d'),grad=ctx.createLinearGradient(0,0,480,600);
    grad.addColorStop(0,'#f9f9f7');grad.addColorStop(.54,['#dce7f3','#f0e8ed','#e5e0f5','#ebe7df'][i]);
    grad.addColorStop(1,'#b9c5d0');ctx.fillStyle=grad;ctx.fillRect(0,0,480,600);
    ctx.save();ctx.translate(235,280);
    for(let k=0;k<8;k++){ctx.save();ctx.rotate(k*Math.PI/4);
      ctx.strokeStyle=k%2?'rgba(255,255,255,.90)':'rgba(101,120,147,.32)';
      ctx.lineWidth=13;ctx.beginPath();ctx.ellipse(0,-60,52,122,k*.25,0,Math.PI*2);ctx.stroke();ctx.restore();}
    ctx.restore();ctx.strokeStyle='rgba(40,50,59,.24)';ctx.strokeRect(18,18,444,565);
    ctx.fillStyle='#4c5a63';ctx.font='16px monospace';ctx.fillText('GEN5ROM / 0'+(i+1),34,50);
    ctx.fillStyle='#1f303b';ctx.font='bold 30px Arial';ctx.fillText(i<2?'MOTION STUDY':'SHORT FORM',30,504);
    ctx.fillStyle='#6e7b85';ctx.font='16px monospace';ctx.fillText('WATCH VIDEO  ↗',32,547);
    const tex=keepT(new THREE.CanvasTexture(canvas));tex.colorSpace=THREE.SRGBColorSpace;return tex;
  }
  function buildGallery(){
    showcase=new THREE.Group();showcase.visible=false;rig.add(showcase);
    const locs=[[-3.36,.11],[-1.12,-.12],[1.12,.13],[3.36,-.1]];
    const slab=keepM(new THREE.MeshStandardMaterial({color:0xffffff,metalness:0,roughness:.8}));
    for(let i=0;i<4;i++){
      const root=new THREE.Group();
      const bg=new THREE.Mesh(keepG(new THREE.BoxGeometry(1.82,2.37,.14)),slab);
      bg.position.z=-.07;root.add(bg);
      const card=new THREE.Mesh(keepG(new THREE.PlaneGeometry(1.70,2.24)),
        keepM(new THREE.MeshBasicMaterial({map:makePoster(i),toneMapped:false,side:THREE.DoubleSide})));
      card.userData.project=i;card.position.z=.016;root.add(card);
      const x=locs[i][0],y=locs[i][1];
      root.position.set(x,y,2.1);root.rotation.y=-x*.035;showcase.add(root);
      frames.push({root,card,x,y,hover:0});targetMeshes.push(card);
    }
  }
  function createWorld(){
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:low?'low-power':'high-performance'});
    renderer.setClearColor(0x11191d,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
    applyDpr(Math.max(1,canvas.parentElement.clientWidth),Math.max(1,canvas.parentElement.clientHeight));
    scene=new THREE.Scene();
    cam=new THREE.PerspectiveCamera(43,1,.1,110);cam.position.set(0,0,17.2);cam.lookAt(0,0,0);
    scene.add(new THREE.AmbientLight(0xffffff,.63));
    scene.add(new THREE.HemisphereLight(0xfafcff,0x8d9ca5,.83));
    const key=new THREE.DirectionalLight(0xfffcf7,2.38);
    key.position.set(-5,8,10);scene.add(key);
    const fill=new THREE.DirectionalLight(0xdcebf4,1.0);
    fill.position.set(7,-2,7);scene.add(fill);
    const rim=new THREE.DirectionalLight(0xf5fbff,.67);
    rim.position.set(3,3,-6);scene.add(rim);
    gestureLight=new THREE.PointLight(0xdceef7,0,10,1.3);
    gestureLight.position.set(0,0,3);scene.add(gestureLight);
    rig=new THREE.Group();scene.add(rig);art=new THREE.Group();rig.add(art);
    for(let i=0;i<total;i++)makeRibbon(i);
    buildGapGlow();
    // Minimal editorial installation: the fabric itself is the entire environment.
    // No floating balls, torus decorations or floor slab.
    buildGallery();
    raycaster=new THREE.Raycaster();plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  }
  function resize(){
    if(!renderer||!cam||disposed)return;
    const w=Math.max(1,canvas.parentElement.clientWidth),h=Math.max(1,canvas.parentElement.clientHeight);
    applyDpr(w,h);
    renderer.setSize(w,h,false);
    cam.aspect=w/h;cam.fov=w<680?55:w<930?47:43;cam.updateProjectionMatrix();
    if(w<680){rig.position.set(0,-.08,0);rig.scale.setScalar(1.05);}
    else if(w<930){rig.position.set(0,0,0);rig.scale.setScalar(1.0);}
    else{rig.position.set(0,0,0);rig.scale.setScalar(1.0);}
    const coords=w<680?[[-.96,.92],[.96,.92],[-.96,-.92],[.96,-.92]]:
      [[-3.36,.11],[-1.12,-.12],[1.12,.13],[3.36,-.1]];
    frames.forEach((v,i)=>{v.x=coords[i][0];v.y=coords[i][1];});
  }
  function locate(){
    ndc.set(soft.x*2-1,1-soft.y*2);raycaster.setFromCamera(ndc,cam);
    if(!raycaster.ray.intersectPlane(plane,worldPoint)){mousePoint.set(99,99,0);return;}
    rig.updateMatrixWorld(true);mousePoint.copy(worldPoint);rig.worldToLocal(mousePoint);
  }
  function animate(now){
    frame=0;if(!playing||disposed||document.hidden||!onScreen)return;
    const raw=last?clamp((now-last)/1000,.001,.060):.016,dt=Math.min(raw,.032);
    last=now;t+=dt;frameNo++;
    // Sustained low FPS can reduce the pixel budget gently. Single-frame
    // browser stalls don't force an irreversible blurry 1x canvas.
    if(raw>.043)slowFrames=Math.min(80,slowFrames+1);
    else slowFrames=Math.max(0,slowFrames-2);
    qualityCooldown=Math.max(0,qualityCooldown-dt);
    if(slowFrames>=24&&!qualityLow&&qualityCooldown===0){
      qualityLow=true;qualityCooldown=8;
      const w=Math.max(1,canvas.parentElement.clientWidth),h=Math.max(1,canvas.parentElement.clientHeight);
      applyDpr(w,h);renderer.setSize(w,h,false);
    }
    if(slowFrames<=5&&qualityLow&&qualityCooldown===0){
      qualityLow=false;qualityCooldown=8;
      const w=Math.max(1,canvas.parentElement.clientWidth),h=Math.max(1,canvas.parentElement.clientHeight);
      applyDpr(w,h);renderer.setSize(w,h,false);
    }
    soft.x=damp(soft.x,hand.active?hand.x:.70,9.0,dt);
    soft.y=damp(soft.y,hand.active?hand.y:.49,9.0,dt);
    soft.speed=damp(soft.speed,hand.active?hand.speed:0,5,dt);
    soft.vx=damp(soft.vx,hand.active?hand.vx:0,7.2,dt);
    soft.vy=damp(soft.vy,hand.active?hand.vy:0,7.2,dt);
    pressure=damp(pressure,hand.down?1:0,hand.down?6.0:3.6,dt);
    const wish=panel==='work'?1:panel==='about'?.34:panel==='contact'?.58:0;
    openVelocity+=(wish-open)*18*dt;openVelocity*=Math.exp(-7.6*dt);
    open=clamp(open+openVelocity*dt,0,1);
    locate();
    const originDist=Math.hypot(mousePoint.x,mousePoint.y);
    energy=damp(energy,hand.active?clamp(1-originDist/5,0,1)+pressure*.25:0,4.3,dt);
    waves=waves.filter(w=>t-w.start<2.2);
    const cursorX=mousePoint.x,cursorY=mousePoint.y;
    // Two-pass spring update: freeze previous particle positions before solving.
    // This avoids directional bias/jitter from updating neighbors in-place.
    for(const r of pieces){
      const state=r.motion, priorStates=r.snapshots;
      for(let j=0;j<=len;j++){
        const n=j*3,p=state[j];priorStates[n]=p.x;priorStates[n+1]=p.y;priorStates[n+2]=p.z;
      }
      const drift=(.63+(r.i%4)*.08)*open;
      const angle=(r.i+1)*2.399;
      for(let j=0;j<=len;j++){
        const c=r.mids[j],s=state[j],u=j/len,n=j*3;
        const dx=c.x-cursorX,dy=c.y-cursorY,dz=(c.z-mousePoint.z)*.48;
        const dist=Math.sqrt(dx*dx+dy*dy+dz*dz),inv=1/(dist+.20);
        const anchor=Math.pow(Math.max(0,Math.sin(Math.PI*u)),.62);
        // Gaussian-like falloff reacts BEFORE contact; direct manipulation when pressed.
        const reach=3.10+pressure*.67+Math.min(.58,soft.speed*.12);
        const nearest=Math.exp(-Math.pow(dist/reach,2)*2.1);
        const proximity=hand.active?nearest*anchor:0;
        const grabbed=proximity*(.44+pressure*.82);
        const ripple=waves.reduce((v,w)=>{
          const radius=Math.hypot(c.x-w.x,c.y-w.y),age=t-w.start;
          return v+Math.sin(radius*3.9-age*10.0)
            *Math.exp(-Math.pow((radius-age*2.6)/1.30,2))
            *Math.max(0,1-age/2.2)*w.pow;
        },0);
        const tx=(dx*inv*.34*grabbed
          +soft.vx*proximity*(.40+pressure*.30)
          +Math.cos(angle)*drift)*anchor+ripple*dx*inv*.11*anchor;
        const ty=(dy*inv*.42*grabbed
          -soft.vy*proximity*(.40+pressure*.30)
          +Math.sin(angle)*drift)*anchor+ripple*dy*inv*.14*anchor;
        const tz=(grabbed*(.76+pressure*.26)+soft.speed*.085*proximity
          +Math.sin(t*.48+u*9+r.i)*.023+drift*.14+ripple*.24)*anchor;
        const left=Math.max(0,j-1)*3,right=Math.min(len,j+1)*3;
        const tens=17.2,spring=21.8,drag=Math.exp(-5.1*dt);
        const accelX=(tx-priorStates[n])*spring
          +(priorStates[left]+priorStates[right]-2*priorStates[n])*tens;
        const accelY=(ty-priorStates[n+1])*spring
          +(priorStates[left+1]+priorStates[right+1]-2*priorStates[n+1])*tens;
        const accelZ=(tz-priorStates[n+2])*spring
          +(priorStates[left+2]+priorStates[right+2]-2*priorStates[n+2])*tens*1.25;
        s.vx=(s.vx+accelX*dt)*drag;
        s.vy=(s.vy+accelY*dt)*drag;
        s.vz=(s.vz+accelZ*dt)*drag;
        s.x=priorStates[n]+s.vx*dt;
        s.y=priorStates[n+1]+s.vy*dt;
        s.z=priorStates[n+2]+s.vz*dt;
      }
      const pos=r.coordinates,rest=r.rest;
      for(let j=0;j<=len;j++){
        const s=state[j],u=j/len;
        const fold=Math.sin(u*15.5+t*.56+r.i*.63)*(.035+pressure*.012);
        for(let w=0;w<=stepsAcross;w++){
          const across=w/stepsAcross*2-1;
          const n=(j*(stepsAcross+1)+w)*3;
          const normal=r.cross[j];
          const bend=across*(pressure*.052+open*.027)*r.sizes[j];
          const curve=fold*(1-across*across)*Math.sin(Math.PI*u);
          pos[n]=rest[n]+s.x+normal.x*bend;
          pos[n+1]=rest[n+1]+s.y+normal.y*bend;
          pos[n+2]=rest[n+2]+s.z+normal.z*bend+curve;
        }
        if(j<len){
          const k=j*12,l=j*(stepsAcross+1)*3,rr=(j*(stepsAcross+1)+stepsAcross)*3,
            nl=(j+1)*(stepsAcross+1)*3,nr=((j+1)*(stepsAcross+1)+stepsAcross)*3;
          const e=r.lines;
          e[k]=pos[l];e[k+1]=pos[l+1];e[k+2]=pos[l+2];
          e[k+3]=pos[nl];e[k+4]=pos[nl+1];e[k+5]=pos[nl+2];
          e[k+6]=pos[rr];e[k+7]=pos[rr+1];e[k+8]=pos[rr+2];
          e[k+9]=pos[nr];e[k+10]=pos[nr+1];e[k+11]=pos[nr+2];
        }
      }
      r.geometry.attributes.position.needsUpdate=true;
      if(frameNo%2===0)r.geometry.computeVertexNormals();
      r.edge.attributes.position.needsUpdate=true;
    }
    // Real depth-masked light leaks follow the deforming fabric centerlines.
    moveGapGlow(dt);
    // Controlled interaction light softly reveals the deformed cloth surface.
    gestureLight.position.set(cursorX,cursorY,3.2);
    gestureLight.intensity=damp(gestureLight.intensity,hand.active?4.0+energy*8.0:0,5.5,dt);
    for(const d of drops){
      d.m.position.set(d.origin.x+Math.sin(t*.28+d.i)*.12,d.origin.y+Math.cos(t*.29+d.i)*.12,d.origin.z+Math.sin(t*.35+d.i)*.10);
    }
    cam.position.x=damp(cam.position.x,(soft.x-.5)*.24,2.3,dt);
    cam.position.y=damp(cam.position.y,(.5-soft.y)*.19,2.3,dt);
    cam.position.z=damp(cam.position.z,panel==='work'?14.2:panel==='about'?17.8:17.2,2.2,dt);
    cam.lookAt(0,0,0);
    art.rotation.y=damp(art.rotation.y,(soft.x-.5)*.014,1.8,dt);
    showcase.visible=open>.14;
    const reveal=ease(open);
    showcase.scale.setScalar(.37+.63*reveal);
    showcase.position.z=.3+reveal*1.8;
    for(const c of frames){
      const d=Math.hypot(mousePoint.x-c.x,mousePoint.y-c.y);
      c.hover=damp(c.hover,panel==='work'&&hand.active?ease(1-d/1.65):0,5,dt);
      c.root.position.x=damp(c.root.position.x,c.x,3,dt);
      c.root.position.y=damp(c.root.position.y,c.y,3,dt);
      c.root.position.z=2.1+c.hover*.50;
      c.root.rotation.y=-c.x*.035+(soft.x-.5)*.065+c.hover*.09;
      c.root.scale.setScalar(1+c.hover*.07);
    }
    renderer.render(scene,cam);
    if(frameNo%8===0){
      hooks.onEnergy?.(clamp(energy,0,1));
      hooks.onState?.(hand.down?'HOLD TO SCULPT':panel==='work'?'EXPLORE THE GALLERY':panel==='about'?'THE ARTIST':panel==='contact'?'LET’S CONNECT':energy>.55?'SCULPTING LIGHT':energy>.16?'PROXIMITY ACTIVE':'MOVE TO INTERACT');
    }
    frame=requestAnimationFrame(animate);
  }
  function start(){if(playing&&!disposed&&!frame&&!document.hidden&&onScreen){last=0;frame=requestAnimationFrame(animate);}}
  function updatePointer(x,y,speed,pressed){
    hand.vx=clamp((x-hand.x)*28,-2.4,2.4);
    hand.vy=clamp((y-hand.y)*28,-2.4,2.4);
    hand.x=clamp(x,0,1);hand.y=clamp(y,0,1);hand.speed=clamp(speed,0,4);
    hand.down=Boolean(pressed);hand.active=true;start();
  }
  function pointerLeave(){hand.active=false;hand.down=false;hand.vx=0;hand.vy=0;}
  function ripple(){locate();waves.push({x:mousePoint.x,y:mousePoint.y,start:t,pow:.84});if(waves.length>4)waves.shift();}
  function release(){if(pressure>.13)ripple();hand.down=false;}
  function setMode(v){if(['home','work','about','contact'].includes(v)){panel=v;if(v==='work')ripple();start();}}
  function isNearAperture(x,y){
    raycaster.setFromCamera(new THREE.Vector2(x*2-1,1-y*2),cam);
    if(!raycaster.ray.intersectPlane(plane,testPoint))return false;
    rig.updateMatrixWorld(true);
    const v=rig.worldToLocal(testPoint.clone());
    return Math.hypot(v.x,v.y)<1.4;
  }
  function pickProject(x,y){
    if(panel!=='work'||!showcase.visible)return -1;
    raycaster.setFromCamera(new THREE.Vector2(x*2-1,1-y*2),cam);
    const hits=raycaster.intersectObjects(targetMeshes,false);
    return hits.length?hits[0].object.userData.project:-1;
  }
  function visibility(){playing=!document.hidden;if(playing)start();else if(frame){cancelAnimationFrame(frame);frame=0;}}
  function contextLost(e){e.preventDefault();playing=false;if(frame)cancelAnimationFrame(frame);frame=0;hooks.onFailure?.();}
  function dispose(){
    disposed=true;playing=false;if(frame)cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange',visibility);
    canvas.removeEventListener('webglcontextlost',contextLost);
    observer?.disconnect();
    screenObserver?.disconnect();
    if(resizeOnWindow)window.removeEventListener('resize',resize);
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(tex=>tex.dispose());renderer?.dispose();
  }
  try{
    createWorld();resize();
    if('ResizeObserver' in window){observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);}
    else { window.addEventListener('resize',resize,{passive:true}); resizeOnWindow=true; }
    document.addEventListener('visibilitychange',visibility);
    canvas.addEventListener('webglcontextlost',contextLost,{passive:false});
    // Preserve fluid scrolling on phones by suspending GPU work below the hero.
    if('IntersectionObserver' in window){
      screenObserver=new IntersectionObserver(entries=>{
        onScreen=entries.some(entry=>entry.isIntersecting);
        if(onScreen)start();
        else if(frame){cancelAnimationFrame(frame);frame=0;last=0;}
      },{rootMargin:'80px 0px',threshold:0});
      screenObserver.observe(canvas.parentElement);
    }
    hooks.onReady?.();start();
    return {setMode,pointer:updatePointer,pointerLeave,release,ripple,isNearAperture,pickProject,dispose};
  }catch(error){
    console.warn('LUMEN FOLD scene fallback:',error);hooks.onFailure?.();
    try{dispose();}catch(e){}
    return unavailable;
  }
}