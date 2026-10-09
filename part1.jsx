
const { useState, useEffect, useMemo, useRef } = React;

/* ---------- color math ---------- */
function hexToRgb(hex){
  hex = (hex||'#888888').replace('#','');
  if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  if(hex.length!==6) hex='888888';
  const num = parseInt(hex,16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function rgbToHex({r,g,b}){
  return '#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
}
function rgbToHsl({r,g,b}){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){ h=s=0; }
  else{
    const d = max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      default: h=(r-g)/d+4;
    }
    h/=6;
  }
  return {h:h*360, s:s*100, l:l*100};
}
function hslToRgb({h,s,l}){
  h/=360; s/=100; l/=100;
  let r,g,b;
  if(s===0){ r=g=b=l; }
  else{
    const hue2rgb=(p,q,t)=>{ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; };
    const q = l<0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
  }
  return {r:r*255,g:g*255,b:b*255};
}
function shiftHue(hex,deg){ const hsl=rgbToHsl(hexToRgb(hex)); hsl.h=(hsl.h+deg+360)%360; return rgbToHex(hslToRgb(hsl)); }
function shiftLight(hex,delta){ const hsl=rgbToHsl(hexToRgb(hex)); hsl.l=clamp(hsl.l+delta,4,96); return rgbToHex(hslToRgb(hsl)); }
function relLuminance(hex){
  const {r,g,b}=hexToRgb(hex);
  const chan=c=>{ c/=255; return c<=0.03928? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
  return 0.2126*chan(r)+0.7152*chan(g)+0.0722*chan(b);
}
function contrastRatio(h1,h2){
  const L1=relLuminance(h1)+0.05, L2=relLuminance(h2)+0.05;
  return L1>L2? L1/L2 : L2/L1;
}
function uid(){ return Math.random().toString(36).slice(2,9); }

/* ---------- persistence ---------- */
const STORAGE_KEY = 'atelier-ods-v1';
function loadStore(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}
function saveStore(data){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }catch(e){}
}

/* ---------- shared UI atoms ---------- */
function Field({label,value,onChange,placeholder,hint,type='text',rows}){
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {type==='textarea' ? (
        <textarea value={value||''} placeholder={placeholder} rows={rows||3} onChange={e=>onChange(e.target.value)} />
      ) : (
        <input type={type} value={value||''} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />
      )}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function SelectField({label,value,onChange,options,hint}){
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <select value={value||''} onChange={e=>onChange(e.target.value)}>
        <option value="" disabled>Escolha…</option>
        {options.map(o=> typeof o==='string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function ListField({label,items,onChange,placeholder,hint,minRows=0}){
  const list = items && items.length ? items : (minRows>0 ? Array.from({length:minRows},()=>'') : []);
  function set(i,val){ const next=[...list]; next[i]=val; onChange(next); }
  function add(){ onChange([...list,'']); }
  function remove(i){ const next=list.filter((_,idx)=>idx!==i); onChange(next.length?next:['']); }
  return (
    <div className="field list-editor">
      {label && <label className="field-label">{label}</label>}
      {list.map((val,i)=>(
        <div className="row" key={i}>
          <input value={val} placeholder={placeholder} onChange={e=>set(i,e.target.value)} />
          <button type="button" className="icon-btn" onClick={()=>remove(i)} aria-label="Remover">×</button>
        </div>
      ))}
      <button type="button" className="add-row-btn" onClick={add}>+ adicionar item</button>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function SliderField({label,value,onChange,min=0,max=2,step=1,labels}){
  const v = value===undefined||value===null ? min : value;
  return (
    <div className="field slider-field">
      {label && <label className="field-label">{label}</label>}
      <div className="row">
        <input type="range" min={min} max={max} step={step} value={v} onChange={e=>onChange(Number(e.target.value))} />
        <div className="val">{v}</div>
      </div>
      {labels && <div className="field-hint">{labels}</div>}
    </div>
  );
}

function ColorField({label,value,onChange,hint}){
  const v = value || '#888888';
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="color-input-wrap">
        <input type="color" value={v} onChange={e=>onChange(e.target.value)} />
        <input type="text" value={v} onChange={e=>onChange(e.target.value)} />
      </div>
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function CheckGroup({label,options,values,onChange}){
  const vals = values || [];
  function toggle(opt){
    if(vals.includes(opt)) onChange(vals.filter(v=>v!==opt));
    else onChange([...vals,opt]);
  }
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="check-grid">
        {options.map(opt=>(
          <label className="check-item" key={opt}>
            <input type="checkbox" checked={vals.includes(opt)} onChange={()=>toggle(opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function YesNo({label,value,onChange}){
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="btn-row">
        <button type="button" className={"btn"+(value===true?' primary':'')} onClick={()=>onChange(true)}>Sim</button>
        <button type="button" className={"btn"+(value===false?' primary':'')} onClick={()=>onChange(false)}>Não</button>
      </div>
    </div>
  );
}

function BookNote({children}){
  return (
    <div className="book-note">
      <div className="tag">📖 Como o livro explica</div>
      {children}
    </div>
  );
}

/* Bloco de ensino padrão: por quê / como fazer / exemplo do livro / erros comuns.
   Uso em um passo: teach:{why:'...', how:['passo 1','passo 2'], example:<>...</>, mistakes:['erro 1','erro 2']}
   Todos os campos são opcionais; textos devem vir do livro. */
function Teach({why,how,example,mistakes,open=true}){
  if(!why && !(how&&how.length) && !example && !(mistakes&&mistakes.length)) return null;
  return (
    <details className="teach" open={open}>
      <summary>🎓 Aprenda antes de preencher</summary>
      {why && <div className="teach-sec"><h5>Por que isso importa</h5><p>{why}</p></div>}
      {how && how.length>0 && <div className="teach-sec"><h5>Como fazer</h5><ol>{how.map((h,i)=><li key={i}>{h}</li>)}</ol></div>}
      {example && <div className="teach-sec teach-ex"><h5>Exemplo do livro</h5>{typeof example==='string'?<p>{example}</p>:example}</div>}
      {mistakes && mistakes.length>0 && <div className="teach-sec teach-err"><h5>Erros comuns</h5><ul>{mistakes.map((m,i)=><li key={i}>{m}</li>)}</ul></div>}
    </details>
  );
}

function CopyButton({text,label}){
  const [copied,setCopied]=useState(false);
  function doCopy(){
    const done=()=>{ setCopied(true); setTimeout(()=>setCopied(false),1600); };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(()=>{
        try{
          const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
          document.execCommand('copy'); document.body.removeChild(ta); done();
        }catch(e){}
      });
    } else {
      try{
        const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); done();
      }catch(e){}
    }
  }
  return <button type="button" className="copy-btn" onClick={doCopy}>{copied? '✓ Copiado' : (label||'Copiar')}</button>;
}

function ContrastBadge({ratio}){
  const aa = ratio>=4.5, aaLarge = ratio>=3, aaa = ratio>=7;
  let cls='error', txt='Reprova AA';
  if(aaa){ cls='success'; txt='Passa AAA'; }
  else if(aa){ cls='success'; txt='Passa AA'; }
  else if(aaLarge){ cls='warning'; txt='Passa AA (texto grande)'; }
  return <span className={"badge "+cls}>{txt} · {ratio.toFixed(2)}:1</span>;
}

/* ---------- prompt para infográfico gerado por IA de imagem (widescreen, para PowerPoint) ---------- */
const VISUAL_THEMES = {
  ideacao: 'uma mesa de brainstorming vista de cima, com post-its coloridos, canetas e um caderno aberto, luz natural suave, fotografia editorial',
  jornada: 'uma pessoa real usando o smartphone em um momento cotidiano (rua, transporte público ou casa), fotografia documental, luz natural',
  csd: 'um quadro de vidro em um escritório moderno com anotações organizadas em colunas e post-its, luz de escritório suave',
  leanCanvas: 'uma pequena equipe discutindo em torno de uma mesa com um canvas de modelo de negócio impresso, ambiente de coworking bem iluminado',
  fluxo: 'telas de celular e wireframes impressos organizados sobre uma mesa de designer, vista de cima, luz suave',
  cores: 'amostras de tecido ou potes de tinta em cores vibrantes organizados como um still-life fotográfico, luz de estúdio',
  tipografia: 'letras de tipos móveis (letterpress) ou revistas de design espalhadas sobre uma mesa de madeira, luz quente',
  icones: 'pequenos cartões com símbolos minimalistas organizados em grade sobre uma mesa de designer, luz neutra',
  layout: 'uma prancheta com grades e réguas de arquiteto sobre um blueprint, iluminada por luz lateral suave',
  tokens: 'close-up macro de um teclado mecânico colorido ou chips eletrônicos organizados em grade, profundidade de campo rasa',
  designSystem: 'peças de um brinquedo de montar do tipo blocos modulares organizadas por cor sobre uma superfície clara, simbolizando um sistema modular',
  prototipagem: 'mãos tocando a tela de um smartphone em um teste de usabilidade, foco no gesto, fundo desfocado',
  tomDeVoz: 'post-its com frases escritas à mão sobre uma mesa de trabalho colaborativa, luz quente de fim de tarde',
};

function buildInfographicPrompt({id,title,n,summaryText}){
  const cena = VISUAL_THEMES[id] || 'um ambiente de trabalho criativo relacionado ao tema, fotografia realista e bem iluminada';
  return [
    `Crie um infográfico em formato widescreen 16:9 (1920×1080px), pronto para um slide de PowerPoint, sobre "${title}" (${n} — livro "Do Problema ao Protótipo").`,
    ``,
    `IMAGEM DE FUNDO: fotografia realista e de alta qualidade, ocupando o slide inteiro, mostrando ${cena}. Cores harmônicas com uma paleta verde-petróleo (#2E6F5E) e dourado (#B8862E).`,
    ``,
    `LEGIBILIDADE: sobreponha um degradê semitransparente (de verde-escuro/preto para transparente, opacidade entre 55% e 75%) exatamente na área onde o texto vai ficar, garantindo alto contraste e leitura fácil dos dados sobre a foto de fundo. Nenhum texto deve ficar diretamente sobre a foto sem esse apoio.`,
    ``,
    `TIPOGRAFIA: título em fonte serifada elegante (estilo Fraunces), textos de apoio em fonte sans-serif limpa (estilo Public Sans), em branco ou creme claro sobre o degradê.`,
    ``,
    `LAYOUT: título em destaque, dados organizados em blocos/cards curtos e bem espaçados, com hierarquia clara entre o dado principal e os detalhes de apoio. Estilo editorial e profissional, como uma lâmina de apresentação de consultoria — nunca um pôster genérico de IA.`,
    ``,
    `CONTEÚDO REAL A EXIBIR (não invente dados — use exatamente o que está abaixo, resumindo apenas o necessário para caber no espaço do slide):`,
    `"""`,
    (summaryText||'').trim() || '(nenhum dado preenchido ainda — peça ao aluno para completar o artefato antes de gerar a imagem)',
    `"""`,
  ].join('\n');
}

/* ---------- artifact registry ---------- */
const ARTIFACTS = [
  {id:'problematizacao', chapter:2, n:'2.1', title:'Da Problematização à Ideação', icon:'🔗', blurb:'Como o problema do Capítulo 1 orienta e limita a ideação.'},
  {id:'ideacao', chapter:2, n:'2.2', title:'Ideação', icon:'💡', blurb:'Brainstorming, SCAMPER e Design Sprint até um enunciado de solução.'},
  {id:'jornada', chapter:2, n:'2.3', title:'Jornada do Usuário', icon:'🧭', blurb:'Etapas, ações, emoções e o mapa de humor da persona.'},
  {id:'csd', chapter:2, n:'2.4', title:'Matriz CSD', icon:'🧩', blurb:'Certezas, Suposições e Dúvidas sobre a solução.'},
  {id:'leanCanvas', chapter:2, n:'2.5', title:'Lean Canvas', icon:'📈', blurb:'Os 9 blocos, da proposta de valor à viabilidade.'},
  {id:'fluxo', chapter:2, n:'2.6', title:'Fluxo de Telas', icon:'🗂️', blurb:'Telas, conexões e arquitetura da informação.'},
  {id:'linguagemVisual', chapter:3, n:'3.1', title:'Do Problema à Linguagem Visual', icon:'🌉', blurb:'O que vem pela frente no Capítulo 3, e a impressão visual que você quer passar.'},
  {id:'cores', chapter:3, n:'3.2', title:'Paleta de Cores', icon:'🎨', blurb:'Cores de UI, esquema cromático e contraste WCAG.'},
  {id:'tipografia', chapter:3, n:'3.3', title:'Tipografia', icon:'🔤', blurb:'Voz tipográfica, par de fontes e hierarquia.'},
  {id:'icones', chapter:3, n:'3.4', title:'Ícones e Iconografia', icon:'🔘', blurb:'Ações do app traduzidas em ícones consistentes.'},
  {id:'layout', chapter:3, n:'3.5', title:'Layout e Espaçamento', icon:'📐', blurb:'Grid, margens e escala de espaçamentos.'},
  {id:'tokens', chapter:3, n:'3.6', title:'Tokens de Design', icon:'🔑', blurb:'Cores, tipografia e espaçamento como variáveis nomeadas.'},
  {id:'designSystem', chapter:3, n:'3.7', title:'Design System', icon:'🧱', blurb:'Fundamentos, componentes, padrões e documentação.'},
  {id:'prototipagem', chapter:3, n:'3.8', title:'Prototipagem', icon:'🖱️', blurb:'Do wireframe ao protótipo navegável e ao teste de usabilidade.'},
  {id:'tomDeVoz', chapter:3, n:'3.9', title:'Tom de Voz e Microcopy', icon:'💬', blurb:'Rótulos, mensagens de erro e sucesso, linguagem inclusiva.'},
];

function isArtifactStarted(slice){
  if(!slice) return false;
  return JSON.stringify(slice).length > 20;
}

/* ---------- Screen shell (stepper + book note + nav) ---------- */
function Screen({title,n,stepIndex,setStepIndex,steps,onDone,doneLabel,isDone}){
  const total = steps.length;
  const step = steps[stepIndex];
  return (
    <div>
      <div className="card">
        <div className="toolbar-top">
          <div>
            <div className="eyebrow">{n} · {title}</div>
            <h2 style={{fontSize:'22px',marginBottom:0}}>{step.label}</h2>
          </div>
          <div className="step-count">Passo {stepIndex+1} de {total}</div>
        </div>
        <div className="stepper">
          {steps.map((s,i)=>(
            <div key={i} className={"step-dot"+(i===stepIndex?' active':'')+(i<stepIndex?' done':'')} onClick={()=>setStepIndex(i)}>
              <span className="num">{i+1}</span>{s.label}
            </div>
          ))}
        </div>
        {step.book && <BookNote>{step.book}</BookNote>}
        {step.teach && <Teach key={stepIndex} {...step.teach} />}
        <div>{step.render()}</div>
        <div className="nav-row">
          <button className="btn ghost" disabled={stepIndex===0} onClick={()=>setStepIndex(stepIndex-1)}>← Voltar</button>
          {stepIndex<total-1 ? (
            <button className="btn primary" onClick={()=>setStepIndex(stepIndex+1)}>Avançar →</button>
          ) : (
            <button className="btn primary" onClick={onDone}>{doneLabel||'Ver resumo'}</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- slice helper ---------- */
function useSlice(data,setData,id,defaults){
  const slice = data[id] || defaults;
  function patch(p){
    setData(prev=>{
      const cur = prev[id] || defaults;
      const nextSlice = typeof p==='function' ? p(cur) : {...cur, ...p};
      return {...prev, [id]: nextSlice};
    });
  }
  return [slice, patch];
}

/* ---------- ODS do projeto: valor único, compartilhado entre Paleta/Tipografia/Ícones ---------- */
function useProjectOds(data,setData){
  const ods = data.projetoOds || '';
  function setOds(v){
    setData(prev=> prev.projetoOds===v ? prev : {...prev, projetoOds:v});
  }
  return [ods, setOds];
}

/* Checagem de coerência: cada item {level:'ok'|'warn'|'info', text}. Regras vêm do livro. */
function Coherence({checks}){
  if(!checks || !checks.length) return null;
  const icon={ok:'✓',warn:'!',info:'?'};
  const warns=checks.filter(c=>c.level==='warn').length;
  return (
    <div className="coh">
      <h4>Checagem de coerência <span className={"badge "+(warns?'warning':'success')}>{warns?warns+' ponto(s) para revisar':'tudo certo'}</span></h4>
      <ul>{checks.map((c,i)=><li key={i} className={'coh-'+c.level}><span className="coh-ic">{icon[c.level]}</span><span>{c.text}</span></li>)}</ul>
    </div>
  );
}

function SummaryShell({title,n,icon,id,summaryText,onEdit,onHome,children,checks}){
  const [promptOpen,setPromptOpen] = useState(false);
  const generated = useMemo(()=>buildInfographicPrompt({id,title,n,summaryText}), [id,title,n,summaryText]);
  const [edited,setEdited] = useState(null);
  const prompt = edited===null ? generated : edited;
  return (
    <div className="card">
      <div className="toolbar-top">
        <div>
          <div className="eyebrow">{n} · {title}</div>
          <h2 style={{fontSize:'22px',marginBottom:0}}>Resumo do artefato</h2>
        </div>
        <div className="top-actions">
          <button className="btn" onClick={onEdit}>✎ Editar</button>
          <button type="button" className="btn" onClick={()=>setPromptOpen(o=>!o)}>✨ {promptOpen?'Fechar prompt':'Gerar prompt de infográfico'}</button>
          <button className="btn primary" onClick={onHome}>Concluir e voltar</button>
        </div>
      </div>
      {promptOpen && (
        <div className="summary-block" style={{marginBottom:'18px'}}>
          <h4>Prompt para gerar o infográfico (IA de imagem)</h4>
          <p className="mini-note" style={{marginBottom:'10px'}}>Você pode editar o texto abaixo (ajustar cena, cores, tom ou o que deve aparecer) antes de copiar. Cole-o em um gerador de imagens por IA (ex.: ChatGPT/DALL·E, Gemini, Midjourney) para criar uma lâmina em 16:9, pronta para colar no PowerPoint.</p>
          <textarea value={prompt} rows={14} onChange={e=>setEdited(e.target.value)} style={{fontFamily:'var(--font-mono)',fontSize:'12px',lineHeight:'1.5'}} />
          <div style={{marginTop:'10px',display:'flex',gap:'10px',flexWrap:'wrap'}}><CopyButton text={prompt} label="Copiar prompt" />{edited!==null && <button type="button" className="btn" onClick={()=>setEdited(null)}>Restaurar prompt original</button>}</div>
        </div>
      )}
      <Coherence checks={checks} />
      <div>{children}</div>
    </div>
  );
}

/* =======================================================================
   2.1 — DA PROBLEMATIZAÇÃO À IDEAÇÃO
   ======================================================================= */
function ArtProblematizacao({data,setData,goHome}){
  const defaults = {mapaEmpatia:'',concorrentes:'',ancoragem:'',step:0,done:false};
  const [s,patch] = useSlice(data,setData,'problematizacao',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='problematizacao');

  const steps = [
    {label:'Como a problematização orienta a ideação',
     teach:{
       why:'Boas ideias são consequência direta de uma problematização bem feita. Sem essa conexão, você corre o risco de criar soluções criativas, tecnológicas e até bonitas, mas sem aderência, porque não respondem a uma dor real. O problema fornece os limites e os critérios de relevância; as ideias são tentativas de preencher esse espaço com soluções viáveis e inovadoras.',
       how:['Enunciado do problema: use a frase-problema como guia. Toda ideia deve respondê-la.','Mapa de empatia: observe como o usuário vive a dor (o que pensa, sente, vê e faz).','Persona: em vez de pensar no usuário em geral, pense em uma pessoa concreta, como a Maria (agricultora, 45 anos) ou o João (estudante de periferia, 16 anos).','Concorrentes: veja onde já existe algo funcionando e onde estão as lacunas.'],
       example:'ODS 4 (Educação de Qualidade): a persona é um estudante sem acesso estável à internet, e isso gera ideias de plataformas que funcionem offline ou kits de estudo distribuídos em pendrives. ODS 11 (Cidades Sustentáveis): apps de transporte já dão tempo real nas capitais, mas há lacuna em cidades médias e bairros periféricos, então a ideação foca em transporte comunitário local.'
     },
     book:<>
       <p>Ideias boas não surgem do nada — são consequência direta de uma problematização bem feita. Sem essa conexão, corremos o risco de criar soluções criativas e até bonitas, mas que não têm aderência porque não respondem a uma dor real.</p>
       <p>A ideação deve ser encarada como uma ponte natural: o problema fornece os limites e os critérios de relevância; as ideias surgem como tentativas de preencher esse espaço com soluções viáveis e inovadoras. Quatro ferramentas do Capítulo 1 seguem guiando esse trabalho: o <strong>enunciado do problema</strong> (toda ideia deve responder à frase-problema), os <strong>mapas de empatia</strong> (o que o usuário pensa, sente, vê e faz), as <strong>personas</strong> (pensar na Maria ou no João, não "no usuário") e os <strong>concorrentes</strong> (onde já existe algo funcionando e onde estão as lacunas).</p>
       <p>Exemplo (ODS 3 – Saúde e Bem-Estar): idoso que esquece medicamentos → mapa de empatia revela insegurança e vergonha → ideias de lembretes via SMS, agendas adaptadas, caixas de remédios inteligentes.</p>
     </>,
     render:()=>(
       <div>
         <Field type="textarea" label="Mapa de empatia rápido da sua persona" value={s.mapaEmpatia} onChange={v=>patch({mapaEmpatia:v})} placeholder="O que ela pensa, sente, vê e faz em relação a essa dor?" rows={3} />
         <Field type="textarea" label="Concorrentes/alternativas atuais e a lacuna que você enxerga" value={s.concorrentes} onChange={v=>patch({concorrentes:v})} placeholder="Ex.: apps de transporte já fornecem tempo real em capitais → lacuna em cidades médias." rows={3} />
       </div>
     )
    },
    {label:'O risco de idear sem problema definido',
     teach:{
       why:'Sem um problema claro, a ideação se transforma em chuva de ideias desconectadas. Elas podem soar inovadoras, mas não têm raiz na realidade do usuário e, ao final, viram soluções que ninguém adota, porque não resolvem uma dor específica.',
       example:'ODS 6 (Água Potável e Saneamento): o problema é que 40% das casas da comunidade não têm saneamento básico (dados de uma ONG local); o mapa de empatia mostra vergonha e preocupação com doenças; a persona é Ana, 15 anos, que divide um banheiro improvisado com 6 familiares. Só então surgem ideias com sentido: sistema comunitário de denúncia, app de monitoramento da qualidade da água e plataforma de crowdfunding para soluções locais.',
       mistakes:['Partir de frases como "Vamos fazer um app com inteligência artificial!", "E se criarmos um chatbot para isso?" ou "Seria legal usar blockchain aqui!": soam inovadoras, mas não têm raiz na realidade do usuário.']
     },
     book:<>
       <p>Sem um problema claro, a ideação vira uma chuva de ideias desconectadas — "vamos fazer um app com IA!", "e se criarmos um chatbot?", "seria legal usar blockchain!". Podem soar inovadoras, mas não têm raiz na realidade do usuário e, no fim, viram soluções que ninguém adota.</p>
       <p>Exemplo aplicado (ODS 6 – Água Potável e Saneamento): 40% das casas de uma comunidade não têm saneamento básico; o mapa de empatia mostra vergonha e preocupação com doenças; a persona é Ana, 15 anos, que compartilha banheiro improvisado com 6 familiares. Só a partir daí a ideação faz sentido: sistema comunitário de denúncia, monitoramento da qualidade da água, crowdfunding para soluções locais.</p>
     </>,
     render:()=> <Field type="textarea" label="Por que sua ideação está ancorada no problema (e não em modismos tecnológicos)?" value={s.ancoragem} onChange={v=>patch({ancoragem:v})} placeholder="Explique em 2-3 linhas como o enunciado do problema, o mapa de empatia e a persona vão limitar/guiar suas ideias." rows={3} />
    },
  ];

  if(showSummary){
    const txt = `DA PROBLEMATIZAÇÃO À IDEAÇÃO\n\nMapa de empatia\n${s.mapaEmpatia||'—'}\n\nConcorrentes/alternativas e lacuna\n${s.concorrentes||'—'}\n\nAncoragem no problema\n${s.ancoragem||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="summary-block"><h4>Mapa de empatia</h4><p style={{color:'var(--ink)'}}>{s.mapaEmpatia||'—'}</p></div>
        <div className="summary-block"><h4>Concorrentes/alternativas e lacuna</h4><p style={{color:'var(--ink)'}}>{s.concorrentes||'—'}</p></div>
        <div className="summary-block"><h4>Ancoragem no problema</h4><p style={{color:'var(--ink)'}}>{s.ancoragem||'—'}</p></div>
        <p className="field-hint">Pronto — siga para 2.2 Ideação para transformar isso em um enunciado de solução.</p>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   2.2 — IDEAÇÃO
   ======================================================================= */
function ArtIdeacao({data,setData,goHome}){
  const defaults = {enunciadoProblema:'',brainstorm:['','',''],scamper:{substituir:'',combinar:'',adaptar:'',modificar:'',propor:'',eliminar:'',reverter:''},sprint:{entender:'',esbocar:'',escolher:''},enunciadoSolucao:'',step:0,done:false};
  const [s,patch] = useSlice(data,setData,'ideacao',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const setStep = i=>patch({step:i});
  const meta = ARTIFACTS.find(a=>a.id==='ideacao');

  const steps = [
    {label:'Enunciado do problema',
     teach:{
       why:'A fase de ideação é um convite à criatividade, mas não à imaginação solta: as ideias precisam estar ancoradas no problema definido, nas personas e nas dores reais levantadas. O enunciado do problema é o ponto de partida dessa ancoragem.',
       example:'ODS 2 (Fome Zero): "Famílias em vulnerabilidade alimentar têm acesso limitado a alimentos frescos devido ao desperdício em feiras e mercados." Ideias possíveis a partir dele: aplicativo de redistribuição de alimentos, parcerias com motoboys locais para coleta, integração com bancos de alimentos.'
     },
     book:<><p>A ideação deve ser encarada como uma ponte natural: o problema fornece os limites e os critérios de relevância; as ideias surgem como tentativas de preencher esse espaço.</p><p>Retome o enunciado do problema (≤250 caracteres) definido no Capítulo 1 — é ele que vai guiar toda a ideação.</p></>,
     render:()=> <Field label="Enunciado do problema" type="textarea" value={s.enunciadoProblema} onChange={v=>patch({enunciadoProblema:v})} placeholder="Ex.: Famílias em vulnerabilidade alimentar têm acesso limitado a alimentos frescos devido ao desperdício em feiras e mercados." hint="Máx. 250 caracteres — mantenha curto e objetivo." />
    },
    {label:'Brainstorming',
     teach:{
       why:'É a técnica clássica para gerar o máximo de ideias possível em pouco tempo. A ideação é caótica por natureza: muitas ideias surgem, algumas absurdas, outras promissoras, e a priorização vem depois.',
       how:['Suspenda o julgamento inicial: toda ideia é bem-vinda.','No começo, quantidade importa mais do que qualidade.','Construa sobre a ideia do outro.','Garanta que todas as ideias estejam conectadas ao problema original e que sejam diversas (tecnológicas, sociais, logísticas, comunicacionais).'],
       example:'ODS 11 (Mobilidade Urbana): carona solidária entre vizinhos, app de bicicletas comunitárias, linhas de ônibus sob demanda.'
     },
     book:<><p>Técnica clássica: gerar o máximo de ideias possível em pouco tempo (5 minutos). Regras: suspenda o julgamento inicial, quantidade importa mais que qualidade no começo, e construa sobre a ideia do outro.</p></>,
     render:()=> <ListField label="Ideias em 5 minutos (quanto mais, melhor)" items={s.brainstorm} onChange={v=>patch({brainstorm:v})} placeholder="Ex.: carona solidária entre vizinhos, app de bicicletas comunitárias…" />
    },
    {label:'SCAMPER',
     teach:{
       why:'O SCAMPER é um acrônimo para estimular variações sobre soluções já existentes, com uma pergunta para cada letra.'
     },
     book:<><p>O SCAMPER não gera ideias novas do zero — ele pega <strong>uma ideia que já saiu do brainstorming</strong> (etapa anterior) e força variações sobre ela, pergunta por pergunta: Substituir, Combinar, Adaptar, Modificar, Propor novos usos, Eliminar, Reverter.</p></>,
     render:()=>(
       <div>
         <div className="summary-block" style={{marginBottom:'16px'}}>
           <h4>Como usar o SCAMPER</h4>
           <p className="mini-note" style={{marginBottom:'6px'}}>Escolha a ideia mais promissora da lista de brainstorming e responda cada pergunta pensando <em>só nela</em> — o objetivo é variar e melhorar essa ideia, não criar ideias soltas. Pode deixar em branco a letra que não fizer sentido para o seu caso.</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Substituir:</strong> o que pode ser trocado nela? <em>Ex. do livro (ODS 12): embalagens plásticas → biodegradáveis.</em></p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Combinar:</strong> o que pode ser unido a ela? <em>Ex. do livro (ODS 12): combinar coleta seletiva com programa de pontos.</em></p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Adaptar:</strong> o que pode ser ajustado — de outro contexto ou solução — para funcionar aqui?</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Modificar:</strong> o que pode ser ampliado ou reduzido (escala, frequência, formato)?</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Propor novos usos:</strong> como reutilizar algo que já existe, com outra finalidade?</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>Eliminar:</strong> o que pode ser retirado para simplificar a ideia?</p>
           <p className="mini-note"><strong>Reverter:</strong> e se fizéssemos o oposto? <em>Ex. do livro (ODS 12): reverter a lógica do consumo — de comprar para alugar.</em></p>
         </div>
         <Field label="Substituir — o que pode ser trocado?" value={s.scamper.substituir} onChange={v=>patch({scamper:{...s.scamper,substituir:v}})} />
         <Field label="Combinar — o que pode ser unido?" value={s.scamper.combinar} onChange={v=>patch({scamper:{...s.scamper,combinar:v}})} />
         <Field label="Adaptar — o que pode ser ajustado?" value={s.scamper.adaptar} onChange={v=>patch({scamper:{...s.scamper,adaptar:v}})} />
         <Field label="Modificar — o que pode ser ampliado/reduzido?" value={s.scamper.modificar} onChange={v=>patch({scamper:{...s.scamper,modificar:v}})} />
         <Field label="Propor novos usos — como reutilizar algo existente?" value={s.scamper.propor} onChange={v=>patch({scamper:{...s.scamper,propor:v}})} />
         <Field label="Eliminar — o que pode ser retirado para simplificar?" value={s.scamper.eliminar} onChange={v=>patch({scamper:{...s.scamper,eliminar:v}})} />
         <Field label="Reverter — e se fizéssemos o oposto?" value={s.scamper.reverter} onChange={v=>patch({scamper:{...s.scamper,reverter:v}})} />
       </div>
     )
    },
    {label:'Design Sprint (versão reduzida)',
     teach:{
       why:'O Design Sprint foi criado no Google Ventures para validar ideias em até 5 dias, passando por entender, esboçar, escolher, prototipar e testar.'
     },
     book:<><p>Método criado no Google Ventures para validar ideias em até 5 dias. Aqui você faz uma versão comprimida em 1 hora dos 3 primeiros dias: entender → esboçar → escolher.</p></>,
     render:()=>(
       <div>
         <div className="summary-block" style={{marginBottom:'16px'}}>
           <h4>Como usar o Design Sprint reduzido</h4>
           <p className="mini-note" style={{marginBottom:'6px'}}>O Design Sprint completo é: Dia 1 entender e mapear o problema, Dia 2 esboçar possíveis soluções, Dia 3 escolher a melhor ideia, Dia 4 prototipar rapidamente, Dia 5 testar com usuários reais. A versão reduzida do livro comprime os 3 primeiros dias em 1 hora — os dias 4 e 5 (protótipo e teste) acontecem nas próximas etapas do processo (ver artefatos de prototipação e teste).</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>1. Entender</strong> (equivale ao Dia 1): retome o problema e a persona — o que você já sabe com certeza, e o que ainda é suposição?</p>
           <p className="mini-note" style={{marginBottom:'4px'}}><strong>2. Esboçar</strong> (Dia 2): descreva 2-3 caminhos de solução possíveis, sem travar na primeira ideia que aparecer.</p>
           <p className="mini-note"><strong>3. Escolher</strong> (Dia 3): qual desses caminhos você vai levar adiante, e por quê? <em>Ex. do livro (ODS 3): sprint para criar protótipo de app que ajuda idosos a lembrar de medicação.</em></p>
         </div>
         <Field type="textarea" label="1. Entender o problema" value={s.sprint.entender} onChange={v=>patch({sprint:{...s.sprint,entender:v}})} />
         <Field type="textarea" label="2. Esboçar possíveis soluções" value={s.sprint.esbocar} onChange={v=>patch({sprint:{...s.sprint,esbocar:v}})} />
         <Field type="textarea" label="3. Escolher a melhor ideia" value={s.sprint.escolher} onChange={v=>patch({sprint:{...s.sprint,escolher:v}})} />
       </div>
     )
    },
    {label:'Enunciado da solução',
     teach:{
       why:'Assim como o problema foi reduzido a um enunciado curto e objetivo, a solução também deve começar de forma simples. O enunciado serve como norte inicial e deixa claro qual caminho será explorado.',
       how:['Escreva a solução em uma frase curta, com no máximo 250 caracteres (o mesmo limite do enunciado do problema).','Confira se ela responde ao enunciado do problema que você definiu.'],
       example:'Problema: "Famílias em vulnerabilidade alimentar têm acesso limitado a alimentos frescos devido ao desperdício em feiras e mercados." Solução curta: "Aplicativo que conecta feirantes e mercados a famílias em vulnerabilidade para redistribuição de alimentos excedentes."'
     },
     book:<><p>Assim como o problema foi reduzido a um enunciado curto e objetivo, a solução também deve começar de forma simples — um enunciado que serve como norte inicial.</p></>,
     render:()=> <Field type="textarea" label="Enunciado da solução (≤ 250 caracteres)" value={s.enunciadoSolucao} onChange={v=>patch({enunciadoSolucao:v})} placeholder="Ex.: Aplicativo que conecta feirantes e mercados a famílias em vulnerabilidade para redistribuição de alimentos excedentes." />
    },
  ];

  if(showSummary){
    const full = `ENUNCIADO DO PROBLEMA\n${s.enunciadoProblema||'—'}\n\nBRAINSTORMING\n${(s.brainstorm||[]).filter(Boolean).map(i=>'- '+i).join('\n')||'—'}\n\nSCAMPER\nSubstituir: ${s.scamper.substituir||'—'}\nCombinar: ${s.scamper.combinar||'—'}\nAdaptar: ${s.scamper.adaptar||'—'}\nModificar: ${s.scamper.modificar||'—'}\nPropor novos usos: ${s.scamper.propor||'—'}\nEliminar: ${s.scamper.eliminar||'—'}\nReverter: ${s.scamper.reverter||'—'}\n\nDESIGN SPRINT\nEntender: ${s.sprint.entender||'—'}\nEsboçar: ${s.sprint.esbocar||'—'}\nEscolher: ${s.sprint.escolher||'—'}\n\nENUNCIADO DA SOLUÇÃO\n${s.enunciadoSolucao||'—'}`;
    const filled=a=>(a||[]).filter(x=>x&&String(x).trim()).length; const sc=Object.values(s.scamper||{}).filter(Boolean).length; const sp=s.sprint||{}; const checks=[
      {level:(s.enunciadoProblema&&s.enunciadoProblema.length<=250)?'ok':'warn', text:(s.enunciadoProblema?'Enunciado do problema com '+s.enunciadoProblema.length+' caracteres':'Enunciado do problema vazio')+' — o livro pede um enunciado curto e objetivo (≤ 250 caracteres).'},
      {level:(s.enunciadoSolucao&&s.enunciadoSolucao.length<=250)?'ok':'warn', text:(s.enunciadoSolucao?'Enunciado da solução com '+s.enunciadoSolucao.length+' caracteres':'Enunciado da solução vazio')+' — também deve ser simples e ter ≤ 250 caracteres.'},
      {level:filled(s.brainstorm)>=3?'ok':'info', text:'Brainstorming: '+filled(s.brainstorm)+' ideia(s). Quantidade importa mais que qualidade no começo; o exercício do livro termina compartilhando as 3 melhores ideias.'},
      {level:sc>0?'ok':'warn', text:sc>0?'SCAMPER aplicado em '+sc+' das 7 perguntas.':'SCAMPER sem nenhuma resposta: o livro aplica o SCAMPER a uma ideia que já saiu do brainstorming.'},
      {level:(sp.entender&&sp.esbocar&&sp.escolher)?'ok':'warn', text:(sp.entender&&sp.esbocar&&sp.escolher)?'Design Sprint reduzido completo (entender → esboçar → escolher).':'Design Sprint reduzido incompleto: faltam etapas entre entender, esboçar e escolher.'},
    ];
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} checks={checks} summaryText={full} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="summary-block"><h4>Enunciado da solução</h4><p style={{color:'var(--ink)'}}>{s.enunciadoSolucao||'Ainda não definido.'}</p></div>
        <div className="summary-block"><h4>Brainstorming</h4>{(s.brainstorm||[]).filter(Boolean).map((it,i)=><p key={i} style={{color:'var(--ink)'}}>• {it}</p>)}</div>
        <div className="summary-block"><h4>SCAMPER</h4>
          {Object.entries({Substituir:s.scamper.substituir,Combinar:s.scamper.combinar,Adaptar:s.scamper.adaptar,Modificar:s.scamper.modificar,'Propor novos usos':s.scamper.propor,Eliminar:s.scamper.eliminar,Reverter:s.scamper.reverter}).filter(([,v])=>v).map(([k,v])=><p key={k} style={{color:'var(--ink)'}}><strong>{k}:</strong> {v}</p>)}
        </div>
        <CopyButton text={full} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={setStep} steps={steps} onDone={()=>setShowSummary(true)} />;
}
