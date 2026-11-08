const API='https://api.github.com';
const DEFAULT_OWNER=''; const DEFAULT_REPO='';
try { chrome.storage.local.setAccessLevel?.({accessLevel:'TRUSTED_CONTEXTS'}); } catch (_) {}
const extFor={java:'java',python:'py',cpp:'cpp',c:'c',javascript:'js',typescript:'ts',csharp:'cs',go:'go',rust:'rs'};
const enc=s=>btoa(unescape(encodeURIComponent(s)));
const safe=s=>String(s||'challenge').normalize('NFKD').replace(/[^a-zA-Z0-9-_]+/g,'-').replace(/^-+|-+$/g,'').slice(0,70)||'challenge';
async function cfg(){const x=await chrome.storage.local.get(['token','owner','repo','autoUpload']);return x;}
async function gh(path,opts={}){
 const c=await cfg(); if(!c.token||!c.owner||!c.repo) throw new Error('GitHub setup incomplete. Open extension Settings.');
 const r=await fetch(`${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`,{...opts,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${c.token}`,...opts.headers}});
 const body=await r.json().catch(()=>({})); if(!r.ok) throw new Error(body.message||`GitHub API error ${r.status}`); return body;
}
async function put(path,content,message){let sha;try{sha=(await gh(path)).sha;}catch(e){if(!['Not Found','This repository is empty'].some(message=>String(e.message).includes(message)))throw e;}
 const payload={message,content:enc(content),...(sha?{sha}:{})};return gh(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
}
async function readText(path){try{const x=await gh(path);return decodeURIComponent(escape(atob(String(x.content||'').replace(/\n/g,''))));}catch(e){if(String(e.message).includes('Not Found'))return '';throw e;}}
function mergeManaged(old,section){const start='<!-- 30ACC-LEETHUB:START -->',end='<!-- 30ACC-LEETHUB:END -->';if(old.includes(start)&&old.includes(end))return old.replace(new RegExp(`${start}[\\s\\S]*?${end}`),section);return (old.trim()?old.trim()+'\n\n':'')+section+'\n';}
async function verify(){const c=await cfg();if(!c.token||!c.owner||!c.repo)throw new Error('Enter owner, repository and token in Settings.');const r=await fetch(`${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28'}});const d=await r.json();if(!r.ok)throw new Error(d.message||`GitHub ${r.status}`);if(!d.permissions?.push)throw new Error('Token can read repository but does not have push/write access.');return {full_name:d.full_name,private:d.private,permissions:d.permissions};}
function dayReadme(s,dayDir,archivePath){return `<!-- 30ACC-LEETHUB:START -->\n# ${s.title||'Coding Challenge'}\n\n- **Day:** ${s.day??'Unknown'}\n- **Difficulty:** ${s.difficulty||'Not provided'}\n- **Language:** ${s.language||'Not provided'}\n- **Status:** ACCEPTED\n- **Passed:** ${s.passedTestCases??'Not provided'} / ${s.totalTestCases??'Not provided'}\n- **Pass rate:** ${s.passPercentage==null?'Not provided':s.passPercentage+'%'}\n- **Runtime:** ${s.runtime??'Not provided'}\n- **Memory:** ${s.memory??'Not provided'}\n- **Submitted:** ${s.submittedAt}\n- **Problem:** ${s.url}\n- **Latest solution:** [solution.${extFor[s.language]||'txt'}](./solution.${extFor[s.language]||'txt'})\n- **Archive:** [${archivePath.split('/').pop()}](./${archivePath.split('/').slice(-2).join('/')})\n<!-- 30ACC-LEETHUB:END -->\n`}
async function updateRoot(s){const old=await readText('README.md');const marker='<!-- 30ACC-LEETHUB:START -->';const end='<!-- 30ACC-LEETHUB:END -->';
 const rows=[];for(let i=1;i<=30;i++){const d=`Day-${String(i).padStart(2,'0')}`;const content=await readText(`${d}/README.md`);const current=i===s.day;const title=current?(s.title||'Challenge'):(content.match(/^#\s+(.+)$/m)?.[1]||'—');const diff=current?(s.difficulty||'—'):(content.match(/\*\*Difficulty:\*\*\s*([^\n]+)/)?.[1]||'—');const lang=current?(s.language||'—'):(content.match(/\*\*Language:\*\*\s*([^\n]+)/)?.[1]||'—');rows.push(`| ${String(i).padStart(2,'0')} | ${content||current?'[Day '+String(i).padStart(2,'0')+'](./'+d+'/README.md)':'—'} | ${title} | ${diff} | ${lang} | ${content||current?'ACCEPTED':'—'} |`);}
 const section=`${marker}\n## 30 Days of Code — Progress Dashboard\n\nLatest accepted submission: **${s.title||'Challenge'}** (Day ${s.day??'?'}) · ${s.submittedAt}\n\n| Day | Details | Challenge | Difficulty | Language | Status |\n|---|---|---|---|---|---|\n${rows.join('\n')}\n${end}`;
 let next=old.trim()?mergeManaged(old,section):'# 30 Days of Code — ACC\n\n'+section+'\n';await put('README.md',next,'Update 30ACC challenge progress');}
async function uploadAccepted(s){const c=await cfg();if(c.autoUpload===false)throw new Error('Automatic upload is disabled in Settings.');
 if(s.status!=='ACCEPTED'||!s.code?.trim())throw new Error('Refusing upload: missing accepted status or source code.');
 const day=Number.isInteger(s.day)&&s.day>=1&&s.day<=30?`Day-${String(s.day).padStart(2,'0')}`:'Unassigned-Day';const title=safe(s.title);const ext=extFor[s.language]||'txt';const base=`${day}/${title}`;
 const stamp=new Date(s.submittedAt||Date.now()).toISOString().replace(/[:.]/g,'-');const short=String(s.submissionId||crypto.randomUUID()).slice(0,8);const archive=`${day}/submissions/${stamp}-${short}.${ext}`;const jsonPath=archive.replace(/\.[^.]+$/,'.json');
 const record={submission_id:s.submissionId,day:s.day??null,challenge_id:s.slug??null,challenge_title:s.title??null,difficulty:s.difficulty??null,language:s.language??null,status:'ACCEPTED',passed_test_cases:s.passedTestCases??null,total_test_cases:s.totalTestCases??null,pass_percentage:s.passPercentage??null,runtime:s.runtime??null,memory:s.memory??null,elapsed_time:s.elapsedTime??null,submitted_at:s.submittedAt,source_url:s.url,source_file:`solution.${ext}`,editor_type:s.editorType??null,editor_confidence:s.editorConfidence??null,success_evidence:s.successEvidence??null};
 await put(archive,s.code,`Archive accepted ${day} ${title}`);
 await put(jsonPath,JSON.stringify(record,null,2)+'\n',`Add submission metadata ${day} ${title}`);
 await put(`${base.split('/')[0]}/solution.${ext}`,s.code,`Update latest accepted ${day} ${title}`);
 const existingDayReadme=await readText(`${day}/README.md`);const managed=dayReadme(s,day,archive);const dayReadmeContent=existingDayReadme.trim()?mergeManaged(existingDayReadme,managed):managed+'\n';await put(`${day}/README.md`,dayReadmeContent,`Update ${day} README`);
 await updateRoot(s);
 return {archive,jsonPath,latest:`${day}/solution.${ext}`};
}
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 (async()=>{
  if(msg?.type==='SAVE_SETTINGS'){const {owner,repo,token,autoUpload,adapter}=msg.settings||{};if(!owner||!repo)throw new Error('Owner and repository are required.');const save={owner:owner.trim(),repo:repo.trim(),autoUpload:autoUpload!==false,adapter:adapter||{}};if(token)save.token=token.trim();await chrome.storage.local.set(save);return {saved:true};}
  if(msg?.type==='GET_SETTINGS'){const c=await cfg();return {owner:c.owner||'',repo:c.repo||'',hasToken:!!c.token,autoUpload:c.autoUpload!==false,adapter:c.adapter||{}};}
  if(msg?.type==='GET_PUBLIC_SETTINGS'){const c=await cfg();return {adapter:c.adapter||{}};}
  if(msg?.type==='VERIFY_GITHUB')return {repository:await verify()};
  if(msg?.type==='DISCONNECT'){await chrome.storage.local.remove(['token']);return {disconnected:true};}
  if(msg?.type==='UPLOAD_ACCEPTED_SUBMISSION')return {uploaded:await uploadAccepted(msg.submission)};
  if(msg?.type==='OPEN_OPTIONS'){await chrome.runtime.openOptionsPage();return {opened:true};}
  throw new Error('Unknown request.');
 })().then(data=>sendResponse({ok:true,...data})).catch(error=>sendResponse({ok:false,error:error.message}));
 return true;
});
