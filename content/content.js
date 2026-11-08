(() => {
  if (window.__thirtyAccContentV1) return;
  window.__thirtyAccContentV1 = true;
  const PREFIX = '30ACC_LEETHUB_V1';
  let armed = null;
  let lastAttemptAt = 0;
  const state = {lastDiagnostic:null};
  const say = (message) => {
    let el = document.getElementById('__30acc_leethub_toast');
    if (!el) { el=document.createElement('div'); el.id='__30acc_leethub_toast'; Object.assign(el.style,{position:'fixed',right:'18px',bottom:'18px',zIndex:2147483647,background:'#111827',color:'#fff',padding:'12px 16px',borderRadius:'10px',font:'13px system-ui',boxShadow:'0 8px 30px #0005',maxWidth:'360px'}); document.documentElement.append(el); }
    el.textContent=message; clearTimeout(el._timer); el._timer=setTimeout(()=>el.remove(),6500);
  };
  function askBridge() {
    return new Promise(resolve => {
      const requestId = crypto.randomUUID();
      const timer = setTimeout(()=>resolve(null),1500);
      const handler = e => {
        if (e.source!==window || e.origin!==location.origin || e.data?.prefix!==PREFIX || e.data?.direction!=='page-to-content' || e.data?.type!=='INSPECT_RESULT' || e.data?.requestId!==requestId) return;
        clearTimeout(timer); window.removeEventListener('message',handler); resolve(e.data.result);
      };
      window.addEventListener('message',handler);
      window.postMessage({prefix:PREFIX,direction:'content-to-page',type:'INSPECT',requestId},location.origin);
    });
  }
  const clean = s => String(s||'').replace(/\s+/g,' ').trim();
  function metadata() {
    const path=location.pathname;
    const slug=(path.match(/dsa-day-\d{1,2}-[a-z0-9-]+/i)||[])[0] || null;
    const dayMatch=path.match(/dsa-day-(\d{1,2})-/i) || clean(document.body.innerText).match(/\bDay\s*0?(\d{1,2})\b/i);
    const day=dayMatch ? Number(dayMatch[1]) : null;
    const headings=[...document.querySelectorAll('h1,h2')].map(x=>clean(x.innerText)).filter(Boolean);
    const title=headings.find(x=>!/dashboard|daily challenge|submissions|my profile/i.test(x)) || document.title || null;
    const text=clean(document.body.innerText).toLowerCase();
    const difficulty=['easy','medium','hard'].find(x=>new RegExp(`\\b${x}\\b`).test(text)) || null;
    const submitButton=[...document.querySelectorAll('button,[role="button"],input[type="submit"]')].find(el=>/^(update solution|submit solution|submit)$/i.test(clean(el.innerText || el.getAttribute('aria-label') || el.value)));
    return {url:location.href,slug,day,title,difficulty,submitButtonDetected:!!submitButton, pageTitle:document.title};
  }
  function buttonFromEvent(event) {
    return event.composedPath().find(el=>el instanceof HTMLElement && (el.matches('button,[role="button"],input[type="submit"]')));
  }
  document.addEventListener('click', async event => {
    const btn=buttonFromEvent(event); if(!btn) return;
    const label=clean(btn.innerText || btn.getAttribute('aria-label') || btn.value);
    if(!/^(update solution|submit solution|submit)$/i.test(label)) return;
    const now=Date.now(); if(now-lastAttemptAt<1500) return; lastAttemptAt=now;
    const [editor,settings]=await Promise.all([askBridge(),chrome.runtime.sendMessage({type:'GET_PUBLIC_SETTINGS'})]);
    const meta=metadata();
    if(!editor?.code?.trim()) { armed=null; say('Editor code read nahi hua. GitHub par kuch upload nahi hoga.'); return; }
    if(editor.confidence==='fallback' && !settings?.adapter?.allowDomFallback) { armed=null; say('Editor sirf DOM fallback se mila. Settings mein explicitly allow kiye bina upload nahi hoga.'); return; }
    armed={id:crypto.randomUUID(),startedAt:Date.now(),editor,meta,settings:settings?.adapter||{}};
    say('Submission attempt detected. ACCEPTED result ka wait ho raha hai…');
    const attemptId=armed.id; setTimeout(()=>{if(armed?.id===attemptId && Date.now()-armed.startedAt>120000) armed=null;},120500);
  },true);
  function visible(el){const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;}
  function findAccepted(root) {
    const selectors=armed?.settings?.successSelector;
    if(selectors) { try { const el=document.querySelector(selectors); if(el&&visible(el)&&new RegExp(armed.settings.successRegex||'ACCEPTED','i').test(el.innerText||'')) return el; } catch(_){} }
    const candidates=[root,...(root.querySelectorAll?root.querySelectorAll('[role="dialog"],[aria-modal="true"],div,section'):[])].filter(el=>el instanceof HTMLElement&&visible(el));
    return candidates.find(el=>{const t=clean(el.innerText);return /solution updated successfully/i.test(t)&&/\baccepted\s*\(\s*\d+\s*\/\s*\d+\s*passed\s*\)/i.test(t);})||null;
  }
  async function accepted(el) {
    if(!armed) return;
    const attempt=armed; armed=null;
    const text=clean(el.innerText);
    const m=text.match(/accepted\s*\(\s*(\d+)\s*\/\s*(\d+)\s*passed\s*\)/i);
    const data={...attempt.meta,language:attempt.editor.language||null,editorType:attempt.editor.editorType,editorConfidence:attempt.editor.confidence,code:attempt.editor.code,status:'ACCEPTED',passedTestCases:m?Number(m[1]):null,totalTestCases:m?Number(m[2]):null,passPercentage:m&&Number(m[2])?Math.round(Number(m[1])/Number(m[2])*10000)/100:null,submittedAt:new Date().toISOString(),elapsedTime:null,runtime:null,memory:null,submissionId:attempt.id,successEvidence:'fresh post-click success dialog text'};
    chrome.runtime.sendMessage({type:'UPLOAD_ACCEPTED_SUBMISSION',submission:data},response=>{
      if(chrome.runtime.lastError||!response?.ok) say('Accepted mila, lekin GitHub upload fail hua: '+(response?.error||chrome.runtime.lastError?.message||'unknown error'));
      else say('ACCEPTED submission GitHub par save ho gaya!');
    });
  }
  const observer=new MutationObserver(records=>{
    if(!armed) return;
    for(const r of records){
      const roots=[...r.addedNodes].filter(n=>n.nodeType===1);
      if(r.type==='characterData' && r.target?.parentElement) roots.push(r.target.parentElement);
      for(const root of roots){const match=findAccepted(root);if(match){accepted(match);return;}}
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  chrome.runtime.onMessage.addListener((msg,_sender,sendResponse)=>{
    if(msg?.type==='GET_DIAGNOSTIC') {
      askBridge().then(editor=>{const report={...metadata(),editorDetected:!!editor?.editorDetected,editorType:editor?.editorType||null,editorCount:editor?.editorCount||0,language:editor?.language||null,codeLength:editor?.code?.length||0,codeConfidence:editor?.confidence||'none',timestamp:new Date().toISOString()};state.lastDiagnostic=report;sendResponse({ok:true,report});});return true;
    }
    if(msg?.type==='GET_PAGE_STATE') sendResponse({ok:true,report:state.lastDiagnostic});
  });
})();
