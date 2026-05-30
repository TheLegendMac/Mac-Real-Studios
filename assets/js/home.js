// ── CONSTELLATION ──
(function(){
  var c=document.getElementById('hero-canvas'),ctx=c.getContext('2d'),W,H,nodes=[],mouse={x:-999,y:-999};
  var NC=80,CD=140,MD=160;
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  function Node(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.35;this.vy=(Math.random()-.5)*.35;this.r=Math.random()*1.8+.6;this.alpha=Math.random()*.5+.2;}
  Node.prototype.update=function(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W)this.vx*=-1;if(this.y<0||this.y>H)this.vy*=-1;};
  function init(){nodes=[];for(var i=0;i<NC;i++)nodes.push(new Node());}
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<nodes.length;i++){
      var a=nodes[i],mdx=mouse.x-a.x,mdy=mouse.y-a.y,md=Math.sqrt(mdx*mdx+mdy*mdy);
      if(md<MD){ctx.beginPath();ctx.strokeStyle='rgba(34,212,244,'+(1-md/MD)*.4+')';ctx.lineWidth=.7;ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();}
      for(var j=i+1;j<nodes.length;j++){
        var b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<CD){ctx.beginPath();ctx.strokeStyle='rgba(43,114,255,'+(1-d/CD)*.16+')';ctx.lineWidth=.5;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
      }
    }
    for(var i=0;i<nodes.length;i++){var n=nodes[i];ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle='rgba(91,152,255,'+n.alpha+')';ctx.fill();}
  }
  function tick(){for(var i=0;i<nodes.length;i++)nodes[i].update();draw();requestAnimationFrame(tick);}
  window.addEventListener('resize',function(){resize();init();});
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
  window.addEventListener('mouseleave',function(){mouse.x=-999;mouse.y=-999;});
  resize();init();tick();
})();

// ── SCROLL PROGRESS ──
var pb=document.getElementById('scroll-progress');
window.addEventListener('scroll',function(){
  var st=window.scrollY,dh=document.documentElement.scrollHeight-window.innerHeight;
  pb.style.width=(dh>0?(st/dh)*100:0)+'%';
},{passive:true});

// ── ACTIVE NAV ──
var sectionIds=['about','products','ethos','contact'];
var navAs=document.querySelectorAll('.nav-links a[data-section]');
var secObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting)navAs.forEach(function(a){a.classList.toggle('active',a.dataset.section===e.target.id);});
  });
},{threshold:0.4});
sectionIds.forEach(function(id){var el=document.getElementById(id);if(el)secObs.observe(el);});

// ── REVEAL ──
var ro=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1,rootMargin:'0px 0px -48px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){ro.observe(el);});

// ── MANIFESTO RULE ──
var rr=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.5});
var rule=document.querySelector('.manifesto-rule');if(rule)rr.observe(rule);

// ── NAV SCROLL BORDER ──
var nav=document.getElementById('main-nav');
window.addEventListener('scroll',function(){nav.style.borderBottomColor=window.scrollY>60?'rgba(43,114,255,0.22)':'rgba(43,114,255,0.12)';},{passive:true});

// ── HAMBURGER MENU ──
var hb=document.getElementById('nav-hamburger'),dr=document.getElementById('nav-drawer');
function closeDrawer(){
  dr.classList.remove('open');
  hb.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
function openDrawer(){
  dr.classList.add('open');
  hb.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
if(hb&&dr){
  hb.addEventListener('click',function(){
    var isOpen=dr.classList.contains('open');
    if(isOpen)closeDrawer();else openDrawer();
  });
  dr.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){closeDrawer();});
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer();});
  document.addEventListener('click',function(e){
    if(dr.classList.contains('open')&&!nav.contains(e.target)&&!dr.contains(e.target))closeDrawer();
  });
}
// touch swipe to close
document.addEventListener('touchstart',function(e){window._tY=e.touches[0].clientY;},{passive:true});
if(dr){dr.addEventListener('touchmove',function(e){if(e.touches[0].clientY-window._tY>60)closeDrawer();},{passive:true});}
