(() => {
  if (window.__thirtyAccBridgeV1) return;
  window.__thirtyAccBridgeV1 = true;
  const PREFIX = '30ACC_LEETHUB_V1';
  const langMap = (s) => {
    const v = String(s || '').toLowerCase();
    if (/javascript|\bjs\b/.test(v)) return 'javascript';
    if (/typescript|\bts\b/.test(v)) return 'typescript';
    if (/python|\bpy\b/.test(v)) return 'python';
    if (/c\+\+|\bcpp\b/.test(v)) return 'cpp';
    if (/c#|csharp/.test(v)) return 'csharp';
    if (/golang|\bgo\b/.test(v)) return 'go';
    if (/\bjava\b/.test(v)) return 'java';
    if (/\brust\b/.test(v)) return 'rust';
    if (/\bc\b/.test(v)) return 'c';
    return null;
  };
  function inspect() {
    const found = [];
    try {
      if (window.monaco?.editor?.getModels) {
        const models = window.monaco.editor.getModels();
        models.forEach((m, i) => found.push({type:'monaco', index:i, code:m.getValue(), language:m.getLanguageId?.() || null, uri:String(m.uri || '')}));
      }
    } catch (_) {}
    try {
      const cm = window.CodeMirror;
      document.querySelectorAll('.CodeMirror').forEach((el, i) => {
        if (el.CodeMirror?.getValue) found.push({type:'codemirror5', index:i, code:el.CodeMirror.getValue(), language:null});
      });
    } catch (_) {}
    try {
      document.querySelectorAll('.cm-content').forEach((el, i) => {
        const view = el.closest('.cm-editor')?.cmView || el.cmView;
        if (view?.state?.doc) found.push({type:'codemirror6', index:i, code:view.state.doc.toString(), language:null});
      });
    } catch (_) {}
    try {
      if (window.ace?.edit) document.querySelectorAll('.ace_editor').forEach((el,i) => {
        const editor = window.ace.edit(el); found.push({type:'ace', index:i, code:editor.getValue(), language:editor.session?.getMode?.()?.$id || null});
      });
    } catch (_) {}
    // DOM-only fallback is explicitly marked lower confidence.
    if (!found.length) {
      document.querySelectorAll('textarea, [contenteditable="true"]').forEach((el,i) => {
        const code = el.tagName === 'TEXTAREA' ? el.value : (el.innerText || el.textContent || '');
        if (code.trim().length > 10) found.push({type:el.tagName === 'TEXTAREA' ? 'textarea' : 'contenteditable', index:i, code, language:null, confidence:'fallback'});
      });
    }
    const active = found.filter(x => x.code && x.code.trim());
    active.sort((a,b) => b.code.length - a.code.length);
    const selected = active[0] || null;
    const controls = [...document.querySelectorAll('select,button,[role="combobox"],[aria-haspopup]')];
    let language = null;
    for (const el of controls) {
      const t = el.tagName === 'SELECT' ? (el.selectedOptions?.[0]?.textContent || el.value) : (el.innerText || el.getAttribute('aria-label') || '');
      language = langMap(t); if (language) break;
    }
    if (!language && selected?.language) language = langMap(selected.language);
    return {editorDetected:!!selected, editorType:selected?.type || null, editorCount:found.length, language, code:selected?.code || null, confidence:selected?.confidence || (selected ? 'api' : 'none'), models:found.map(x=>({type:x.type,index:x.index,language:x.language,uri:x.uri || null,codeLength:x.code?.length || 0}))};
  }
  window.addEventListener('message', (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    const msg = event.data;
    if (!msg || msg.prefix !== PREFIX || msg.direction !== 'content-to-page') return;
    if (msg.type === 'INSPECT') {
      const result = inspect();
      window.postMessage({prefix:PREFIX,direction:'page-to-content',type:'INSPECT_RESULT',requestId:msg.requestId,result}, location.origin);
    }
  });
})();
