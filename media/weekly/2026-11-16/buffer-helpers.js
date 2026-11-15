window.__sleep=ms=>new Promise(r=>setTimeout(r,ms));
window.__press=el=>{const r=el.getBoundingClientRect(),o={bubbles:true,cancelable:true,clientX:r.x+r.width/2,clientY:r.y+r.height/2,pointerType:'mouse',button:0};['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>el.dispatchEvent(t.startsWith('pointer')?new PointerEvent(t,o):new MouseEvent(t,o)))};
window.__open=async(o={})=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='New Post'&&x.offsetParent);__press(b);
 for(let i=0;i<30&&!document.querySelector('[role=dialog] [data-slate-editor]');i++)await __sleep(200);await __sleep(500);
 if(!o.here){const lu=[...document.querySelectorAll('[role=dialog] button')].find(x=>/Last used/.test(x.textContent));if(lu){__press(lu);await __sleep(800);}}
 for(const n of (o.exclude||[])){const b=[...document.querySelectorAll('[role=dialog] button')].find(x=>(x.getAttribute('aria-label')||x.textContent).trim()==='Deselect '+n);if(b){__press(b);await __sleep(700);}}
 return document.querySelector('[role=dialog]').innerText.match(/Deselect [^\n]+/g)};
window.__fill=async(it)=>{const r=await fetch(it.imgUrl,{cache:'no-store'});const b=await r.blob();
 const dt=new DataTransfer();dt.items.add(new File([b],it.img,{type:'image/png'}));
 const inp=document.querySelector('[role=dialog] input[type=file]');inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));
 for(let i=0;i<40&&!/Remove image/.test(document.querySelector('[role=dialog]').innerText);i++)await __sleep(300);
 const ed=document.querySelector('[role=dialog] [data-slate-editor]');ed.focus();
 const t=new DataTransfer();t.setData('text/plain',it.text);ed.dispatchEvent(new ClipboardEvent('paste',{clipboardData:t,bubbles:true,cancelable:true}));
 await __sleep(2500);const d=document.querySelector('[role=dialog]').innerText;
 return {img:/Remove image/.test(d),linkPreview:/Replace link preview/.test(d),len:ed.innerText.length};};
window.__setDate=async(dateStr,time)=>{const dlg=document.querySelector('[role=dialog]');
 const btn=[...dlg.querySelectorAll('button')].find(x=>/Set Date and Time|^\s*[A-Z][a-z]{2} \d+, \d/.test(x.textContent)&&x.getBoundingClientRect().y>700);__press(btn);await __sleep(900);
 const [y,m,dd]=dateStr.split('-').map(Number);const mon=['January','February','March','April','May','June','July','August','September','October','November','December'][m-1];
 const lbl=new Date(y,m-1,dd).toLocaleDateString('en-US',{weekday:'long'})+', '+mon+' '+dd;
 let cell=[...document.querySelectorAll('[aria-label]')].find(e=>e.offsetParent&&(e.getAttribute('aria-label')||'').startsWith(lbl));
 if(!cell){const next=[...document.querySelectorAll('button')].find(b=>/next/i.test(b.getAttribute('aria-label')||'')&&b.offsetParent);if(next){__press(next);await __sleep(600);cell=[...document.querySelectorAll('[aria-label]')].find(e=>e.offsetParent&&(e.getAttribute('aria-label')||'').startsWith(lbl));}}
 if(!cell)return 'no cell';__press(cell);await __sleep(600);
 const inp=[...document.querySelectorAll('input[type=text]')].find(i=>i.offsetParent&&/[AP]M/.test(i.value));
 inp.focus();inp.select();const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(inp,time);inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));await __sleep(400);
 ['keydown','keypress','keyup'].forEach(t=>inp.dispatchEvent(new KeyboardEvent(t,{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true})));await __sleep(600);
 const fb=[...dlg.querySelectorAll('button')].find(x=>/^\s*[A-Z][a-z]{2} \d+, \d/.test(x.textContent));return fb&&fb.textContent.trim();};
window.__save=async()=>{const done=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Done'&&b.offsetParent);if(done){__press(done);await __sleep(600);}
 const sd=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent.trim()==='Save Draft');__press(sd);
 for(let i=0;i<30&&document.querySelector('[role=dialog] [data-slate-editor]');i++)await __sleep(300);await __sleep(1500);
 return {closed:!document.querySelector('[role=dialog] [data-slate-editor]'),drafts:document.body.innerText.match(/Drafts\n(\d+)/)?.[1],queue:document.body.innerText.match(/Queue\n(\d+)/)?.[1]}};
window.__log=[];
window.__run=async(from,to,o={})=>{for(let i=from;i<=to;i++){const it=__plan[i];const sel=await __open(o);if(o.exclude&&sel&&sel.some(x=>o.exclude.some(n=>x.includes(n)))){__log.push(i+' STOP: could not deselect '+o.exclude);break;}if(o.expect&&(!sel||sel.length!==o.expect.length||!o.expect.every(n=>sel.some(x=>x.includes(n))))){__log.push(i+' STOP: channels are '+sel+' but expected '+o.expect);break;}const f=await __fill(it);const d=await __setDate(it.date,it.time);const s=await __save();
 __log.push(i+' '+it.date+' '+it.time+' -> '+d+' img:'+f.img+' linkPreview:'+f.linkPreview+' len:'+f.len+' saved:'+s.closed+' drafts:'+s.drafts+' queue:'+s.queue);await __sleep(1500);}__log.push('DONE')};
window.__runX=async(from,to)=>{for(let i=from;i<=to;i++){const it=__plan[i];const sel=await __open({here:true});if(!sel||sel.length!==1||!/NeoHRConsult/.test(sel[0])){__log.push(i+' STOP: X page must preselect only @NeoHRConsult, got '+sel);break;}const f=await __fill({img:it.imgX,imgUrl:it.imgXUrl,text:it.text});const d=await __setDate(it.date,it.time);const s=await __save();
 __log.push('X '+i+' '+it.date+' '+it.time+' -> '+d+' img:'+f.img+' linkPreview:'+f.linkPreview+' saved:'+s.closed+' drafts:'+s.drafts);await __sleep(2500);}__log.push('DONE X')};
window.__counts=()=>({drafts:document.body.innerText.match(/Drafts\n(\d+)/)?.[1],queue:document.body.innerText.match(/Queue\n(\d+)/)?.[1]});
window.__runCh=async(list,from,to,expect)=>{const q0=__counts().queue;for(let i=from;i<=to;i++){const it=list[i];
 if(document.querySelector('[role=dialog] [data-slate-editor]')){__log.push(i+' STOP: composer already open');break;}
 const sel=await __open({here:true});if(!sel||sel.length!==1||!sel[0].includes(expect)){__log.push(i+' STOP: channels '+sel);break;}
 const f=await __fill(it);if(!f.img||f.linkPreview){__log.push(i+' STOP fill '+JSON.stringify(f));break;}
 const d=await __setDate(it.date,it.time);const s=await __save();
 __log.push(i+' '+it.tag.slice(0,25)+' '+it.date+' '+it.time+' -> '+d+' len:'+f.len+' saved:'+s.closed+' drafts:'+s.drafts+' queue:'+s.queue);
 if(!s.closed||s.queue!==q0){__log.push('STOP: save problem or queue changed');break;}await __sleep(2000);}__log.push('DONE')};
'helpers loaded'
