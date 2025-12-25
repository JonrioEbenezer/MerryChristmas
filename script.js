const $ = (id) => document.getElementById(id);

function onPress(el, fn){
  el.addEventListener("click", fn);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") fn();
  });
}

function show(active){
  ["screen1","screen2","screen3","screen4"].forEach(id => $(id).classList.add("hidden"));
  active.classList.remove("hidden");
}

/* ===== Salju Canvas (banyak) ===== */
const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const flakes = [];
const FLAKE_COUNT = 220;

function rand(min, max){ return Math.random() * (max - min) + min; }
function initFlakes(){
  flakes.length = 0;
  for(let i=0;i<FLAKE_COUNT;i++){
    flakes.push({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(1.2, 3.8),
      vy: rand(0.9, 2.8),
      vx: rand(-0.45, 0.45),
      swing: rand(0.6, 2.2),
      phase: rand(0, Math.PI*2),
      a: rand(0.35, 0.95)
    });
  }
}
initFlakes();

function drawSnow(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  ctx.shadowColor = "rgba(140,200,255,0.45)";
  ctx.shadowBlur = 10;

  for(const f of flakes){
    f.phase += 0.01 * f.swing;
    f.x += f.vx + Math.sin(f.phase) * 0.45;
    f.y += f.vy;

    if(f.y > window.innerHeight + 10){
      f.y = -10;
      f.x = rand(0, window.innerWidth);
    }
    if(f.x < -10) f.x = window.innerWidth + 10;
    if(f.x > window.innerWidth + 10) f.x = -10;

    ctx.beginPath();
    ctx.fillStyle = `rgba(150,210,255,${f.a})`;
    ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(drawSnow);
}
drawSnow();

/* ===== Music ===== */
const bgMusic = $("bgMusic");
bgMusic.volume = 0.7;

/* ===== Flow ===== */
onPress($("giftTap"), () => show($("screen2")));

onPress($("openBtn"), async () => {
  try { await bgMusic.play(); } catch {}
  show($("screen3"));
});

/* Flip cards -> semua terbuka pindah screen 4 */
const cards = Array.from(document.querySelectorAll(".flipCard"));
const opened = new Set();

function checkAllOpened(){
  if(opened.size === cards.length){
    setTimeout(() => show($("screen4")), 450);
  }
}
cards.forEach(card => {
  onPress(card, () => {
    if(card.classList.contains("flipped")) return;
    card.classList.add("flipped");
    opened.add(card.dataset.id);
    checkAllOpened();
  });
});

/* Tap to read */
const santaLayer = $("santaLayer");
const letterLayer = $("letterLayer");
let alreadyRead = false;

onPress(santaLayer, () => {
  if(alreadyRead) return;
  alreadyRead = true;
  santaLayer.classList.add("slideDown");
  setTimeout(() => letterLayer.classList.add("show"), 260);
});

show($("screen1"));
