const $ = id => document.getElementById(id);
const input = $('message-input'), messages = $('messages');
let busy = false, epoch = 0, activeScene = 'rain', saved = [];
const scenes = {
  rain: {name:'A cabin in the rain', detail:'Soft light, nowhere to rush', welcome:'I put the kettle on. The rain is doing its thing outside.\n\nHow’s your world feeling tonight?'},
  sea: {name:'The coast at dawn', detail:'Salt air, a fresh beginning', welcome:'We made it before the rest of the world woke up. The sea is silver, and there’s nobody on the sand.\n\nWant to walk for a while, or just sit here?'},
  city: {name:'A late-night bookstore', detail:'One more chapter, one more hour', welcome:'The little bookshop is still open. There’s a lamp in the window and a cat pretending not to notice us.\n\nWhich shelf should we get lost in first?'}
};
function showView(view){
  for(const v of ['conversation','scenes','moments']) $(v+'-panel').hidden = v !== view;
  document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-current',b.dataset.view===view?'page':'false');});
  $('view-label').textContent={conversation:'A conversation with Ella',scenes:'Little escapes',moments:'Saved moments'}[view];
  if(view==='moments') renderSaved();
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
function addMessage(text,role='assistant'){
  const article=document.createElement('article'); article.className='message '+role;
  const avatar=document.createElement('span'); avatar.className='message-avatar'; avatar.textContent=role==='user'?'J':'e.';
  const body=document.createElement('div');
  if(role==='assistant') {const label=document.createElement('small');label.textContent='Ella';const time=document.createElement('span');time.textContent=new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false});label.append(time);body.append(label);}
  const p=document.createElement('p'); p.textContent=text; body.append(p);article.append(avatar,body);messages.append(article);messages.scrollTop=messages.scrollHeight;return article;
}
function reply(text){
  if(/long|tired|exhaust|work|day/i.test(text)) return 'Then we can make this a small evening. No need to turn it into a productive one.\n\nWas there one part of the day you wish had gone differently?';
  if(/escape|imagin|somewhere|travel/i.test(text)) return activeScene==='sea'?'Let’s follow the shoreline until the town is just a row of rooftops behind us. I’ll carry the shoes.\n\nWhat should we bring for breakfast?':'There’s a path behind the cabin that ends at a tiny lake. Let’s take the long way, with absolutely no sensible reason.\n\nWould you rather find a hidden garden or an empty beach?';
  if(/small|lovely|tell|story/i.test(text)) return 'A little thing: somewhere, someone is halfway through a book that will become their favorite. They don’t know it yet.\n\nI like thinking there are still things like that ahead of us.';
  return 'We can stay with that thought for a moment.\n\nIn this concept, my replies are scripted. In the finished product, this is where a real conversation would continue — with room for your words, and no rush to fill the silence.';
}
async function send(text){
  text=text.trim();if(!text||busy)return;
  busy=true;$('send-button').disabled=true;input.disabled=true;
  $('feedback').textContent='';addMessage(text,'user');input.value='';input.style.height='auto';$('suggestions').hidden=true;
  const token=epoch, typing=addMessage('· · ·');typing.classList.add('typing');typing.setAttribute('aria-label','Ella is composing a scripted reply');
  await new Promise(r=>setTimeout(r,650));
  if(token!==epoch)return;
  typing.remove();addMessage(reply(text));busy=false;$('send-button').disabled=false;input.disabled=false;input.focus();
}
$('chat-form').addEventListener('submit',e=>{e.preventDefault();send(input.value);});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(input.value);}});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,140)+'px';});
document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.prompt)));
function reset(){epoch++;busy=false;messages.replaceChildren();addMessage(scenes[activeScene].welcome);$('send-button').disabled=false;input.disabled=false;input.value='';input.style.height='auto';$('suggestions').hidden=false;$('feedback').textContent='A fresh conversation. Saved moments are still here.';}
$('reset-button').addEventListener('click',reset);
function toggleTheme(){const enabled=document.body.classList.toggle('bright');for(const id of ['theme-toggle','mobile-theme']) $(id).setAttribute('aria-pressed',String(enabled));}
$('theme-toggle').addEventListener('click',toggleTheme);
$('mobile-theme').addEventListener('click',toggleTheme);
$('scene-button').addEventListener('click',()=>showView('scenes'));
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{activeScene=b.dataset.scene;const name=$('scene-name');name.replaceChildren(document.createTextNode(scenes[activeScene].name));const detail=document.createElement('small');detail.textContent=scenes[activeScene].detail;name.append(detail);reset();showView('conversation');}));
$('about-button').addEventListener('click',()=>$('about-dialog').showModal());
for(const id of ['close-dialog','back-to-chat']) $(id).addEventListener('click',()=>$('about-dialog').close());
$('save-button').addEventListener('click',()=>{const last=[...messages.querySelectorAll('.assistant:not(.typing) p')].at(-1);if(!last)return;if(saved.some(m=>m.text===last.textContent)){$('feedback').textContent='This moment is already saved.';return;}saved.push({text:last.textContent,scene:scenes[activeScene].name});$('feedback').textContent='Saved. Find it in “Saved moments”.';});
function renderSaved(){const list=$('saved-list');list.replaceChildren();if(!saved.length){const empty=document.createElement('div');empty.className='empty-moments';const icon=document.createElement('span');icon.textContent='♡';const p=document.createElement('p');p.textContent='Nothing saved just yet.\nUse “Save this moment” in a conversation.';empty.append(icon,p);list.append(empty);return;}for(const moment of saved){const card=document.createElement('article');card.className='saved-card';const small=document.createElement('small');small.textContent=moment.scene.toUpperCase();const p=document.createElement('p');p.textContent=moment.text;card.append(small,p);list.append(card);}}
