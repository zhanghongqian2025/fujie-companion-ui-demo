/* Original interactive concept. No account, model, telemetry or uploaded user data. */
'use strict';
const $ = id => document.getElementById(id);
let duration = 30, remaining = 30, state = 'idle', deadline = 0, interval = null;
let completions = 3, motion = null, animationReady = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function view(name) {
  for (const key of ['today','timer','motion']) $(`${key}-view`).hidden = key !== name;
  document.querySelectorAll('[data-view]').forEach(b => {
    if(b.dataset.view === name) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
}
function render() {
  const seconds = Math.ceil(remaining);
  $('time').textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  $('ring-progress').style.strokeDashoffset = String(728.849 * (1-remaining/duration));
  $('start-pause').textContent = state === 'running' ? '暂停计时 Ⅱ' : state === 'paused' ? '继续计时 ▶' : '开始计时 ▶';
  $('time-hint').textContent = state === 'running' ? '进行中' : state === 'paused' ? '已暂停' : '准备开始';
  $('timer-status').textContent = state === 'running' ? '保持自己的节奏。' : state === 'paused' ? '休息一下，随时继续。' : '选择时长，然后开始。';
  document.querySelectorAll('[data-seconds]').forEach(b=>b.disabled=state!=='idle');
}
function stopTick() { clearInterval(interval); interval=null; }
function reset(seconds=duration) { stopTick(); duration=seconds; remaining=seconds; state='idle'; render(); }
function playMotion() {
  if(!animationReady) return;
  if(reducedMotion.matches) { motion.goToAndStop(50,true); $('animation-status').textContent='减少动态效果已启用，显示静态徽章。'; }
  else { motion.goToAndPlay(0,true); $('animation-status').textContent='完成徽章 · 播放中'; }
}
function finish() {
  stopTick(); state='idle'; remaining=duration; completions++;
  $('completed-count').innerHTML = `${String(completions).padStart(2,'0')}<span>次</span>`;
  render(); view('motion'); playMotion();
  $('animation-status').textContent = reducedMotion.matches ? '本段计时完成 · 静态反馈' : '本段计时完成 · 轻量反馈';
}
function tick() { remaining=Math.max(0,(deadline-Date.now())/1000); render(); if(remaining===0) finish(); }
function start() { state='running'; deadline=Date.now()+remaining*1000; stopTick(); interval=setInterval(tick,100); render(); }
$('start-pause').addEventListener('click',()=>{
  if(state==='running') { remaining=Math.max(0,(deadline-Date.now())/1000); stopTick(); state='paused'; render(); }
  else start();
});
$('reset').addEventListener('click',()=>reset());
$('quick').addEventListener('click',()=>{reset(5); document.querySelectorAll('[data-seconds]').forEach(b=>b.setAttribute('aria-pressed','false')); start();});
document.querySelectorAll('[data-seconds]').forEach(b=>b.addEventListener('click',()=>{reset(Number(b.dataset.seconds)); document.querySelectorAll('[data-seconds]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
$('open-timer').addEventListener('click',()=>view('timer'));
$('info').addEventListener('click',()=>$('about').showModal());
$('close-about').addEventListener('click',()=>$('about').close());
$('replay').addEventListener('click',playMotion);
if(window.lottie) {
  motion=window.lottie.loadAnimation({container:$('animation'),renderer:'svg',loop:false,autoplay:false,path:'completion.json'});
  motion.addEventListener('DOMLoaded',()=>{animationReady=true; motion.goToAndStop(50,true); $('animation-status').textContent='原创 Lottie 已就绪，可播放或下载。';});
  motion.addEventListener('data_failed',()=>{$('animation-status').textContent='动画加载失败，仍可下载源文件检查。'; $('replay').disabled=true;});
  motion.addEventListener('complete',()=>{$('animation-status').textContent='播放完成 · 可再次播放。';});
} else { $('animation-status').textContent='播放器未加载，仍可下载 JSON。'; $('replay').disabled=true; }
reducedMotion.addEventListener('change',()=>{if(animationReady&&reducedMotion.matches) motion.goToAndStop(50,true);});
render();
