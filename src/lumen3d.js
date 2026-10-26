/* GEN5ROM / LUMEN FOLD — genuine deformable glass and ceramic ribbon art.
   14 independently curved ribbons, CPU spring mesh deformation, true 3D
   proximity projection, velocity ripples, hold to sculpt and 3D work gallery. */
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
  let scene,cam,renderer,rig,art,showcase,raycaster,plane;
  let pieces=[],drops=[],frames=[],targetMeshes=[],materials=[],geometries=[],textures=[],waves=[];
  let playing=true,disposed=false,frame=0,last=0,t=0,frameNo=0,qualityLow=false,slowFrames=0,resizeOnWindow=false;
  let panel='home',open=0,openVelocity=0,pressure=0,energy=0,observer;
  const hand={x:.7,y:.49,active:false,down:false,speed:0},soft={x:.7,y:.49,speed:0};
  const mousePoint=new THREE.Vector3(99,99,0),worldPoint=new THREE.Vector3(),testPoint=new THREE.Vector3();
  const ndc=new THREE.Vector2();
  const len=low?58:86,stepsAcross=low?4:7,total=low?10:14;
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
  // Art-directed spatial spline paths — the composition is NOT repeated torus geometry.
  // Curated open ribbons have distinct cinematic sweeps, curls and opposing depths.
  const ribbonBlueprints=[
    [[-5.8,-2.8,-1.6],[-4.3,-2.7,-.4],[-2.2,-.8,1.1],[.5,.7,1.8],[2.8,-.2,.6],[5.2,-2,-1.3]],
    [[-3.5,2.2,-1.8],[-2.7,3.7,-.7],[0,4.9,.3],[3.3,3.3,1.1],[4.7,.8,-.5],[2.8,-1.6,0]],
    [[-.9,-2.5,1.7],[1.3,-2.7,1.8],[2.7,-.7,.7],[2,1.5,-.8],[.1,2.6,0],[-1.9,1.1,1.2],[-.8,-.9,2.0],[1.2,.1,2.2]],
    [[2.0,4,-1],[.4,3.2,0],[-1,1.4,1.5],[-.3,-.7,2.4],[2.0,-1.8,1.4],[4.2,-.6,-.5],[5.4,2.2,-1.4]],
    [[-5.4,-.2,2.2],[-3,1.3,1.5],[-.7,.1,0],[1.4,-1.7,.8],[3.1,.6,1.1],[5.5,2.5,1.8]],
    [[-3.8,-3.5,-1],[-.8,-3.6,0],[1.1,-2.3,1],[2.9,.4,2],[1.9,2.9,0],[.1,3,-1],[-2,1.3,-.8]],
    [[5.3,3,-2],[4.2,1,-.5],[1.9,-1.0,1.5],[-.4,-1.5,1.7],[-1.8,.7,1.1],[.2,2.4,-.5],[3.5,2.1,-1.4],[5.7,.5,-2]],
    [[-5,-3.1,.1],[-2.8,-3.5,.7],[-1.2,-2.3,2.1],[1.1,-1.2,2.3],[2.2,-2.6,1.3],[4.2,-3.9,.0]],
    [[-2.9,1.6,2.0],[-1.4,2.8,1.5],[.8,2.9,.1],[2.1,1.3,-1.5],[1.0,-.8,-2],[-1.7,-1.4,-.9],[-2.6,.3,.9],[-1.6,2,1.6]],
    [[-4.5,3.5,-1.7],[-2.6,4.5,-.9],[.4,3.4,.8],[2.2,1.0,2],[.4,-1.7,1.3],[-2.1,-1.8,-.6],[-4.0,.7,-1.8]],
    [[4.8,-3.4,-1.0],[4.0,-1.7,.6],[2.1,.5,1.4],[1.1,3,1.9],[2.7,4.4,.3],[5.3,3.4,-1.2]],
    [[-5,1.9,-1],[-3.2,-.3,.3],[-1,-2.2,1.7],[1.6,-.5,2.6],[1.1,1.8,1.0],[-1.1,3.1,-.8],[-3.4,2.0,-1.3]]
  ];
  const spatialCurves=ribbonBlueprints.map(points=>new THREE.CatmullRomCurve3(
    points.map(p=>new THREE.Vector3(p[0],p[1],p[2])),false,'catmullrom',.35
  ));
  function curl(i,u){
    if(i<spatialCurves.length)return spatialCurves[i].getPoint(u);
    const theta=i*2.39996+u*Math.PI*2*(1.3+(i%3)*.24)+noise(i+1)*.38;
    const radius=(1.0+.18*(i%4)+1.15*Math.sin(Math.PI*u))*(.80+u*.58);
    return new THREE.Vector3(
      Math.cos(theta)*radius+Math.sin(u*5.2+i)*.48,
      Math.sin(theta)*radius*.84+Math.cos(u*7.9+i*.66)*.45,
      Math.sin(theta*.84+u*6+i*.41)*(1.2+.22*(i%3))+Math.cos(u*8+i)*.36
    );
  }
  function makeRibbon(i) {
    const cells=(len+1)*(stepsAcross+1);
    const coordinates=new Float32Array(cells*3),faces=[];
    const mids=[],cross=[],motion=[],sizes=[];
    const width=.40+(i%5)*.115;
    for(let j=0;j<=len;j++){
      const u=j/len,center=curl(i,u);
      const tangent=curl(i,clamp(u+.003,0,1)).sub(curl(i,clamp(u-.003,0,1))).normalize();
      const sideways=new THREE.Vector3(0,0,1).cross(tangent).normalize();
      if(sideways.lengthSq()<.0001)sideways.set(0,1,0).cross(tangent).normalize();
      const normal=new THREE.Vector3().crossVectors(tangent,sideways).normalize();
      const twist=i*.32+u*Math.PI*(i%2?1:-1)*.65+Math.sin(u*8.7+i)*.38;
      sideways.multiplyScalar(Math.cos(twist)).addScaledVector(normal,Math.sin(twist)).normalize();
      mids.push(center);cross.push(sideways);motion.push({x:0,y:0,z:0,vx:0,vy:0,vz:0});
      const size=width*(.18+.82*Math.pow(Math.sin(Math.PI*(u*.94+.03)),.42));
      sizes.push(size);
      for(let w=0;w<=stepsAcross;w++){
        const spread=w/stepsAcross*2-1;
        const k=(j*(stepsAcross+1)+w)*3;
        coordinates[k]=center.x+sideways.x*size*spread;
        coordinates[k+1]=center.y+sideways.y*size*spread;
        coordinates[k+2]=center.z+sideways.z*size*spread+Math.sin((w/stepsAcross)*Math.PI)*.11;
      }
    }
    for(let j=0;j<len;j++)for(let w=0;w<stepsAcross;w++){
      const a=j*(stepsAcross+1)+w,b=a+stepsAcross+1;
      faces.push(a,b,a+1,b,b+1,a+1);
    }
    const rest=coordinates.slice();
    const geometry=keepG(new THREE.BufferGeometry());
    geometry.setAttribute('position',new THREE.BufferAttribute(coordinates,3).setUsage(THREE.DynamicDrawUsage));
    geometry.setIndex(faces);geometry.computeVertexNormals();
    const glass=!low && (i%5===1 || i%7===3);
    const surface=glass?keepM(new THREE.MeshPhysicalMaterial({
      color:0xd2ddeb,roughness:.14,metalness:.04,transmission:.57,thickness:1.2,ior:1.34,
      clearcoat:1,clearcoatRoughness:.05,iridescence:.88,iridescenceIOR:1.33,
      iridescenceThicknessRange:[125,600],envMapIntensity:1.06,side:THREE.DoubleSide
    })):keepM(new THREE.MeshPhysicalMaterial({
      color:[0xaeb4c0,0xe0dad4,0xc3ceda,0xe8dfd7,0xbcc4cf][i%5],
      metalness:i%4===0?.48:.27,roughness:.15+(i%4)*.038,clearcoat:1,clearcoatRoughness:.09,
      iridescence:.84,iridescenceIOR:1.38,iridescenceThicknessRange:[135,660],
      envMapIntensity:1.06,side:THREE.DoubleSide
    }));
    const mesh=new THREE.Mesh(geometry,surface);mesh.frustumCulled=false;art.add(mesh);
    const lines=new Float32Array(len*12),edge=keepG(new THREE.BufferGeometry());
    edge.setAttribute('position',new THREE.BufferAttribute(lines,3).setUsage(THREE.DynamicDrawUsage));
    const tracer=new THREE.LineSegments(edge,keepM(new THREE.LineBasicMaterial({
      color:i%3===0?0xa7a5a4:0x8595ad,opacity:.65,transparent:true,depthWrite:false
    })));tracer.frustumCulled=false;art.add(tracer);
    pieces.push({geometry,coordinates,rest,mids,cross,motion,sizes,width,lines,edge,i});
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
    const slab=keepM(new THREE.MeshPhysicalMaterial({color:0xeef1f5,metalness:.25,roughness:.22,clearcoat:1}));
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
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!low,powerPreference:low?'low-power':'high-performance'});
    renderer.setClearColor(0xf8f7f3,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.91;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,low?1.0:1.6));
    scene=new THREE.Scene();scene.environment=envMap();
    cam=new THREE.PerspectiveCamera(43,1,.1,110);cam.position.set(0,0,14.8);cam.lookAt(0,0,0);
    scene.add(new THREE.AmbientLight(0xfdfcfe,.57));
    scene.add(new THREE.HemisphereLight(0xffffff,0x8b8590,1.05));
    const light1=new THREE.DirectionalLight(0xfff3e7,2.30);light1.position.set(-5,8,9);scene.add(light1);
    const light2=new THREE.DirectionalLight(0xb8d7ff,1.25);light2.position.set(7,-2,7);scene.add(light2);
    const warm=new THREE.PointLight(0xffe4c5,12,15,1.25);warm.position.set(1,-3,4);scene.add(warm);
    rig=new THREE.Group();scene.add(rig);art=new THREE.Group();rig.add(art);
    for(let i=0;i<total;i++)makeRibbon(i);
    const glass=keepM(new THREE.MeshPhysicalMaterial({
      color:0xe9f0fa,roughness:.09,metalness:.04,transmission:low?0:.78,thickness:1.3,
      transparent:low,opacity:low?.72:1,ior:1.39,clearcoat:1,iridescence:.74,envMapIntensity:1.4
    }));
    const dropGeo=keepG(new THREE.IcosahedronGeometry(1,2));
    for(let i=0;i<(low?4:8);i++){
      const a=i*2.43,dis=2.8+noise(i+42)*2;
      const m=new THREE.Mesh(dropGeo,glass);
      const origin={x:Math.cos(a)*dis,y:Math.sin(a)*dis*.72,z:(noise(i+7)-.5)*3.4};
      m.position.set(origin.x,origin.y,origin.z);m.scale.setScalar(.08+noise(i+17)*.24);
      art.add(m);drops.push({m,origin,i});
    }
    const shadow=new THREE.Mesh(keepG(new THREE.PlaneGeometry(11,5.2)),keepM(
      new THREE.MeshBasicMaterial({map:floorGradient(),transparent:true,opacity:.60,depthWrite:false})
    ));
    shadow.rotation.x=-Math.PI/2;shadow.position.set(2,-3.7,-.4);scene.add(shadow);
    buildGallery();
    raycaster=new THREE.Raycaster();plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  }
  function resize(){
    if(!renderer||!cam||disposed)return;
    const w=Math.max(1,canvas.parentElement.clientWidth),h=Math.max(1,canvas.parentElement.clientHeight);
    renderer.setSize(w,h,false);
    cam.aspect=w/h;cam.fov=w<680?47:w<930?44:43;cam.updateProjectionMatrix();
    if(w<680){rig.position.set(.3,-1.05,0);rig.scale.setScalar(.68);}
    else if(w<930){rig.position.set(1.35,-.17,0);rig.scale.setScalar(1.04);}
    else{rig.position.set(4.15,-.12,0);rig.scale.setScalar(1.34);}
    const coords=w<680?[[-1.26,1.35],[1.26,1.35],[-1.26,-1.35],[1.26,-1.35]]:
      [[-3.36,.11],[-1.12,-.12],[1.12,.13],[3.36,-.1]];
    frames.forEach((v,i)=>{v.x=coords[i][0];v.y=coords[i][1];});
  }
  function locate(){
    ndc.set(soft.x*2-1,1-soft.y*2);raycaster.setFromCamera(ndc,cam);
    if(!raycaster.ray.intersectPlane(plane,worldPoint)){mousePoint.set(99,99,0);return;}
    rig.updateMatrixWorld(true);mousePoint.copy(worldPoint);rig.worldToLocal(mousePoint);
  }
  function animate(now){
    frame=0;if(!playing||disposed||document.hidden)return;
    const raw=last?clamp((now-last)/1000,.001,.055):.016,dt=Math.min(raw,.035);
    last=now;t+=dt;frameNo++;
    if(raw>.044)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
    if(slowFrames>18&&!qualityLow){qualityLow=true;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1));renderer.setSize(Math.max(1,canvas.parentElement.clientWidth),Math.max(1,canvas.parentElement.clientHeight),false);}
    soft.x=damp(soft.x,hand.active?hand.x:.70,5.4,dt);
    soft.y=damp(soft.y,hand.active?hand.y:.49,5.4,dt);
    soft.speed=damp(soft.speed,hand.active?hand.speed:0,5,dt);
    pressure=damp(pressure,hand.down?1:0,hand.down?1.8:3.0,dt);
    const wish=panel==='work'?1:panel==='about'?.34:panel==='contact'?.58:0;
    openVelocity+=(wish-open)*18*dt;openVelocity*=Math.exp(-7.6*dt);
    open=clamp(open+openVelocity*dt,0,1);
    locate();
    const originDist=Math.hypot(mousePoint.x,mousePoint.y);
    energy=damp(energy,hand.active?clamp(1-originDist/5,0,1)+pressure*.25:0,4.3,dt);
    waves=waves.filter(w=>t-w.start<2.2);
    for(const r of pieces){
      const angle=(r.i+1)*2.399,drift=(1.0+(r.i%4)*.16)*open;
      const state=r.motion;
      for(let j=0;j<=len;j++){
        const c=r.mids[j],s=state[j],u=j/len;
        const dx=c.x-mousePoint.x,dy=c.y-mousePoint.y,dz=(c.z-mousePoint.z)*.56;
        const d=Math.sqrt(dx*dx+dy*dy+dz*dz),inv=1/(d+.18);
        const radius=2.15+Math.min(1,soft.speed*.14)+pressure*.76;
        const force=hand.active?ease(1-d/radius):0;
        const repel=ease(1-d/(.95+pressure*.37));
        const factor=force*(repel*.62-(1-repel)*.17-pressure*.17);
        const ripple=waves.reduce((v,w)=>{
          const dist=Math.hypot(c.x-w.x,c.y-w.y),age=t-w.start;
          return v+Math.sin(dist*4.3-age*11.7)*Math.exp(-Math.pow((dist-age*3.1)/1.35,2))*(1-age/2.2)*w.pow;
        },0);
        const blend=Math.pow(Math.sin(Math.PI*u),.42);
        const tx=dx*inv*factor+Math.cos(angle)*drift*blend-dy*inv*soft.speed*force*.06+ripple*dx*inv*.12;
        const ty=dy*inv*factor+Math.sin(angle)*drift*blend+dx*inv*soft.speed*force*.06+ripple*dy*inv*.12;
        const tz=(repel*.45+pressure*.43)*force+drift*.2+Math.sin(t*.34+u*5+r.i)*.015+ripple*.25;
        const f=Math.exp(-7.3*dt),k=20;
        s.vx=(s.vx+(tx-s.x)*k*dt)*f;
        s.vy=(s.vy+(ty-s.y)*k*dt)*f;
        s.vz=(s.vz+(tz-s.z)*k*dt)*f;
        s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;
      }
      const pos=r.coordinates,rest=r.rest;
      for(let j=0;j<=len;j++){
        const s=state[j];
        for(let w=0;w<=stepsAcross;w++){
          const n=(j*(stepsAcross+1)+w)*3,v=(w/stepsAcross*2-1)*(pressure*.055+open*.052)*r.sizes[j];
          const normal=r.cross[j];
          pos[n]=rest[n]+s.x+normal.x*v;
          pos[n+1]=rest[n+1]+s.y+normal.y*v;
          pos[n+2]=rest[n+2]+s.z+normal.z*v;
        }
        if(j<len){
          const k=j*12,l=j*(stepsAcross+1)*3,rr=(j*(stepsAcross+1)+stepsAcross)*3,nl=(j+1)*(stepsAcross+1)*3,nr=((j+1)*(stepsAcross+1)+stepsAcross)*3;
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
    for(const d of drops){
      d.m.position.set(d.origin.x+Math.sin(t*.28+d.i)*.12,d.origin.y+Math.cos(t*.29+d.i)*.12,d.origin.z+Math.sin(t*.35+d.i)*.10);
    }
    cam.position.x=damp(cam.position.x,(soft.x-.5)*.24,2.3,dt);
    cam.position.y=damp(cam.position.y,(.5-soft.y)*.19,2.3,dt);
    cam.position.z=damp(cam.position.z,panel==='work'?12:panel==='about'?15.4:14.7,2.2,dt);
    cam.lookAt(0,0,0);
    art.rotation.y=damp(art.rotation.y,(soft.x-.5)*.035,1.8,dt);
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
  function start(){if(playing&&!disposed&&!frame&&!document.hidden){last=0;frame=requestAnimationFrame(animate);}}
  function updatePointer(x,y,speed,pressed){
    hand.x=clamp(x,0,1);hand.y=clamp(y,0,1);hand.speed=clamp(speed,0,4);
    hand.down=Boolean(pressed);hand.active=true;start();
  }
  function pointerLeave(){hand.active=false;hand.down=false;}
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
    if(resizeOnWindow)window.removeEventListener('resize',resize);
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(tex=>tex.dispose());renderer?.dispose();
  }
  try{
    createWorld();resize();
    if('ResizeObserver' in window){observer=new ResizeObserver(resize);observer.observe(canvas.parentElement);}
    else { window.addEventListener('resize',resize,{passive:true}); resizeOnWindow=true; }
    document.addEventListener('visibilitychange',visibility);
    canvas.addEventListener('webglcontextlost',contextLost,{passive:false});
    hooks.onReady?.();start();
    return {setMode,pointer:updatePointer,pointerLeave,release,ripple,isNearAperture,pickProject,dispose};
  }catch(error){
    console.warn('LUMEN FOLD scene fallback:',error);hooks.onFailure?.();
    try{dispose();}catch(e){}
    return unavailable;
  }
}