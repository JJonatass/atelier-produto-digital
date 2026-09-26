const ODS_LIST = [
  'ODS 1 — Erradicação da Pobreza',
  'ODS 2 — Fome Zero e Agricultura Sustentável',
  'ODS 3 — Saúde e Bem-Estar',
  'ODS 4 — Educação de Qualidade',
  'ODS 5 — Igualdade de Gênero',
  'ODS 6 — Água Potável e Saneamento',
  'ODS 7 — Energia Limpa e Acessível',
  'ODS 8 — Trabalho Decente e Crescimento Econômico',
  'ODS 9 — Indústria, Inovação e Infraestrutura',
  'ODS 10 — Redução das Desigualdades',
  'ODS 11 — Cidades e Comunidades Sustentáveis',
  'ODS 12 — Consumo e Produção Responsáveis',
  'ODS 13 — Ação Contra a Mudança Global do Clima',
  'ODS 14 — Vida na Água',
  'ODS 15 — Vida Terrestre',
  'ODS 16 — Paz, Justiça e Instituições Eficazes',
  'ODS 17 — Parcerias e Meios de Implementação',
];

/* =======================================================================
   2.6 — FLUXO DE TELAS / ARQUITETURA DA INFORMAÇÃO
   ======================================================================= */
function ArtFluxo({data,setData,goHome}){
  const defaults = {produto:'',descricao:'',acoes:['',''],telas:[{id:uid(),nome:'',descricao:''},{id:uid(),nome:'',descricao:''}],conexoes:[{id:uid(),de:'',evento:'',para:''}],analise:{intuitivo:'',redundante:'',coerencia:'',arquitetura:'',melhorias:''},step:0,done:false};
  const [s,patch] = useSlice(data,setData,'fluxo',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='fluxo');
  function setTela(i,field,val){ const next=[...s.telas]; next[i]={...next[i],[field]:val}; patch({telas:next}); }
  function addTela(){ patch({telas:[...s.telas,{id:uid(),nome:'',descricao:''}]}); }
  function removeTela(i){ const next=s.telas.filter((_,idx)=>idx!==i); patch({telas:next.length?next:[{id:uid(),nome:'',descricao:''}]}); }
  function setConexao(i,field,val){ const next=[...s.conexoes]; next[i]={...next[i],[field]:val}; patch({conexoes:next}); }
  function addConexao(){ patch({conexoes:[...s.conexoes,{id:uid(),de:'',evento:'',para:''}]}); }
  function removeConexao(i){ const next=s.conexoes.filter((_,idx)=>idx!==i); patch({conexoes:next.length?next:[{id:uid(),de:'',evento:'',para:''}]}); }
  const telaOptions = s.telas.filter(t=>t.nome).map(t=>t.nome);

  const steps = [
    {label:'Escolha do produto',
     book:<p>Selecione o produto ou solução que você está desenhando e descreva-o em uma frase — igual ao fluxo do "ReUse+" (ODS 12) no livro.</p>,
     render:()=>(<div><Field label="Nome do produto/solução" value={s.produto} onChange={v=>patch({produto:v})} placeholder="Ex.: ReUse+" /><Field type="textarea" label="Contexto em 1-2 frases" value={s.descricao} onChange={v=>patch({descricao:v})} placeholder="Ex.: aplicativo para estimular o reaproveitamento de alimentos e objetos." /></div>)
    },
    {label:'Ações do usuário',
     book:<p>Anote cada passo que o usuário realiza desde o início até concluir a ação principal — essa sequência é a base do fluxo técnico.</p>,
     render:()=> <ListField label="Sequência de ações" items={s.acoes} onChange={v=>patch({acoes:v})} placeholder="Ex.: abrir app → tela inicial → escolher ação → confirmar" />
    },
    {label:'Telas',
     book:<p>Para cada etapa observada, capture ou descreva a tela correspondente: tela inicial, login/cadastro, tela de ação, mapa/lista, confirmação.</p>,
     render:()=>(
      <div>
        {s.telas.map((t,i)=>(
          <div className="grid-2" key={t.id}>
            <Field label={'Tela '+(i+1)+' — nome'} value={t.nome} onChange={v=>setTela(i,'nome',v)} placeholder="Ex.: Tela Inicial (Home)" />
            <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
              <Field label="Descrição" value={t.descricao} onChange={v=>setTela(i,'descricao',v)} placeholder="O que essa tela mostra e permite fazer" />
              <button className="icon-btn" style={{marginBottom:'16px'}} onClick={()=>removeTela(i)}>×</button>
            </div>
          </div>
        ))}
        <button className="add-row-btn" onClick={addTela}>+ adicionar tela</button>
      </div>
     )
    },
    {label:'Conexão entre telas',
     book:<p>Ligue as telas com o evento/ação que leva de uma à outra — por exemplo, "tocar em Publicar" leva da tela de Doação à tela de Confirmação.</p>,
     render:()=>(
      <div>
        {s.conexoes.map((c,i)=>(
          <div className="grid-3" key={c.id}>
            <SelectField label="De" value={c.de} onChange={v=>setConexao(i,'de',v)} options={telaOptions} />
            <Field label="Evento (ex.: tocar em Publicar)" value={c.evento} onChange={v=>setConexao(i,'evento',v)} />
            <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
              <div style={{flex:1}}><SelectField label="Para" value={c.para} onChange={v=>setConexao(i,'para',v)} options={telaOptions} /></div>
              <button className="icon-btn" style={{marginBottom:'16px'}} onClick={()=>removeConexao(i)}>×</button>
            </div>
          </div>
        ))}
        <button className="add-row-btn" onClick={addConexao}>+ adicionar conexão</button>
      </div>
     )
    },
    {label:'Análise crítica',
     book:<p>Responda: o fluxo é intuitivo? há etapas redundantes? há coerência entre botões, menus e rótulos? o fluxo reflete uma arquitetura da informação clara? que melhorias você sugeriria?</p>,
     render:()=>(
      <div>
        <Field type="textarea" rows={2} label="O fluxo é intuitivo?" value={s.analise.intuitivo} onChange={v=>patch({analise:{...s.analise,intuitivo:v}})} />
        <Field type="textarea" rows={2} label="Há etapas redundantes ou confusas?" value={s.analise.redundante} onChange={v=>patch({analise:{...s.analise,redundante:v}})} />
        <Field type="textarea" rows={2} label="Há coerência entre botões, menus e rótulos?" value={s.analise.coerencia} onChange={v=>patch({analise:{...s.analise,coerencia:v}})} />
        <Field type="textarea" rows={2} label="O fluxo reflete uma arquitetura da informação clara?" value={s.analise.arquitetura} onChange={v=>patch({analise:{...s.analise,arquitetura:v}})} />
        <Field type="textarea" rows={2} label="Que melhorias você sugeriria?" value={s.analise.melhorias} onChange={v=>patch({analise:{...s.analise,melhorias:v}})} />
      </div>
     )
    },
  ];

  if(showSummary){
    const txt = `FLUXO DE TELAS — ${s.produto||'(sem nome)'}\n${s.descricao||''}\n\nSITEMAP\n${s.telas.filter(t=>t.nome).map(t=>'- '+t.nome+': '+(t.descricao||'')).join('\n')}\n\nFLUXO DE NAVEGAÇÃO\n${s.conexoes.filter(c=>c.de&&c.para).map(c=>c.de+' —['+c.evento+']→ '+c.para).join('\n')}\n\nANÁLISE CRÍTICA\nIntuitivo? ${s.analise.intuitivo||'—'}\nRedundâncias: ${s.analise.redundante||'—'}\nCoerência: ${s.analise.coerencia||'—'}\nArquitetura: ${s.analise.arquitetura||'—'}\nMelhorias: ${s.analise.melhorias||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <p style={{color:'var(--ink)'}}><strong>{s.produto}</strong> — {s.descricao}</p>
        <div className="summary-block"><h4>Sitemap</h4>{s.telas.filter(t=>t.nome).map(t=><p key={t.id} style={{color:'var(--ink)',fontSize:'13px'}}>▸ {t.nome} — {t.descricao}</p>)}</div>
        <div className="summary-block"><h4>Fluxo de navegação</h4>{s.conexoes.filter(c=>c.de&&c.para).map(c=><p key={c.id} className="mono" style={{color:'var(--ink)',fontSize:'13px'}}>{c.de} —[{c.evento}]→ {c.para}</p>)}</div>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.2 — PALETA DE CORES
   ======================================================================= */
/* =======================================================================
   3.1 — DO PROBLEMA À LINGUAGEM VISUAL
   ======================================================================= */
function ArtLinguagemVisual({data,setData,goHome}){
  const defaults = {impressaoVisual:'',step:0,done:false};
  const [s,patch] = useSlice(data,setData,'linguagemVisual',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='linguagemVisual');

  const steps = [
    {label:'Da solução estruturada à linguagem visual',
     book:<>
       <p>Nos capítulos anteriores você entendeu o contexto dos ODS, estruturou o problema, as personas, a jornada e os fluxos principais. Agora o desafio é dar forma a essa solução: decidir como ela "fala" visualmente, como se organiza na tela e como pode ser testada e validada antes da programação.</p>
       <p>Sem uma linguagem visual consistente, cada tela fala um idioma diferente — e o usuário se perde na tradução. É aqui que entram, em sequência: <strong>cores</strong> (identidade e legibilidade), <strong>tipografia</strong> (clareza e ritmo), <strong>ícones</strong> (elementos visuais), <strong>layout e espaçamento</strong> (organização), <strong>tom de voz</strong> (personalidade do produto) — todos reunidos num <strong>Design System</strong> (regras e componentes reutilizáveis) e materializados em wireframes, mockups e protótipos navegáveis.</p>
       <p>Ao final do capítulo você será capaz de: compreender o papel do Design System na consistência e acessibilidade; construir paletas de cores e hierarquias tipográficas alinhadas aos ODS; definir iconografia, layout e tom de voz coerentes com o público-alvo; e diferenciar wireframe, mockup e protótipo navegável.</p>
     </>,
     render:()=> <Field type="textarea" label="Em poucas palavras, como você quer que a experiência visual do seu produto seja percebida?" value={s.impressaoVisual} onChange={v=>patch({impressaoVisual:v})} placeholder="Ex.: acolhedor, confiável, direto ao ponto — isso vai ajudar a escolher cores e tipografia mais à frente." rows={3} />
    },
  ];

  if(showSummary){
    const txt = `DO PROBLEMA À LINGUAGEM VISUAL\n\nImpressão visual desejada\n${s.impressaoVisual||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="summary-block"><h4>Impressão visual desejada</h4><p style={{color:'var(--ink)'}}>{s.impressaoVisual||'—'}</p></div>
        <p className="field-hint">Pronto — siga para 3.2 Paleta de Cores para começar a dar forma a essa linguagem visual.</p>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

const ESQUEMA_LABELS = {
  complementar:'Complementar (oposto)',
  analoga:'Análoga',
  monocromatica:'Monocromática',
  triangular:'Triangular',
  quadrado:'Quadrado (tetrádica)'
};
function ArtCores({data,setData,goHome}){
  const defaults = {
    ods:'', primaria:'#2E6F5E', justificativaPrimaria:'', secundaria:'#B8862E', justificativaSecundaria:'',
    neutras:['#FFFFFF','#8A8F86','#20242B'],
    estados:{success:'#2E7D4F',error:'#AE3227',warning:'#93650A',info:'#2B5F8A'},
    esquemaEscolhido:'complementar',
    contrasteTexto:'#20242B', contrasteFundo:'#FFFFFF',
    modo:'claro',
    step:0, done:false
  };
  const [s,patch] = useSlice(data,setData,'cores',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='cores');

  const complementar = shiftHue(s.primaria,180);
  const analogas = [shiftHue(s.primaria,-30), s.primaria, shiftHue(s.primaria,30)];
  const monocromatica = [shiftLight(s.primaria,-22), s.primaria, shiftLight(s.primaria,22)];
  const triangular = [s.primaria, shiftHue(s.primaria,120), shiftHue(s.primaria,240)];
  const quadrado = [s.primaria, shiftHue(s.primaria,90), shiftHue(s.primaria,180), shiftHue(s.primaria,270)];
  const ratio = contrastRatio(s.contrasteTexto,s.contrasteFundo);
  const ratioRuim = contrastRatio('#CBCBCB','#FFFFFF');

  const steps = [
    {label:'ODS e cor primária',
     book:<p>As cores não são neutras: cada tom envia uma mensagem. Escolha uma ODS e defina a cor primária — a principal cor de identidade, usada em botões e cabeçalhos — justificando pela psicologia das cores.</p>,
     render:()=>(<div><SelectField label="ODS escolhida" value={s.ods} onChange={v=>patch({ods:v})} options={ODS_LIST} /><ColorField label="Cor primária" value={s.primaria} onChange={v=>patch({primaria:v})} /><Field type="textarea" label="Justificativa (psicologia das cores)" value={s.justificativaPrimaria} onChange={v=>patch({justificativaPrimaria:v})} rows={2} /></div>)
    },
    {label:'Secundária e neutras',
     book:<p>A cor secundária apoia a primária em destaques menores. As neutras (tons de cinza, preto e branco) são usadas em fundos, bordas e textos.</p>,
     render:()=>(
       <div>
         <ColorField label="Cor secundária" value={s.secundaria} onChange={v=>patch({secundaria:v})} />
         <Field type="textarea" label="Justificativa" value={s.justificativaSecundaria} onChange={v=>patch({justificativaSecundaria:v})} rows={2} />
         <div className="grid-3">
           {s.neutras.map((n,i)=>(
             <ColorField key={i} label={'Neutra '+(i+1)} value={n} onChange={v=>{const next=[...s.neutras];next[i]=v;patch({neutras:next});}} />
           ))}
         </div>
       </div>
     )
    },
    {label:'Cores de estado',
     book:<p>Estados de interface precisam de cor própria: sucesso (success), erro (error), aviso (warning) e informação (info) — sempre combinadas com ícone e texto, nunca só a cor.</p>,
     render:()=>(
       <div className="grid-2">
         <ColorField label="Success" value={s.estados.success} onChange={v=>patch({estados:{...s.estados,success:v}})} />
         <ColorField label="Error" value={s.estados.error} onChange={v=>patch({estados:{...s.estados,error:v}})} />
         <ColorField label="Warning" value={s.estados.warning} onChange={v=>patch({estados:{...s.estados,warning:v}})} />
         <ColorField label="Info" value={s.estados.info} onChange={v=>patch({estados:{...s.estados,info:v}})} />
       </div>
     )
    },
    {label:'Círculo cromático',
     book:<p>A partir da cor primária, o círculo cromático sugere esquemas de combinação — cada um segue uma regra própria de distância angular entre matizes. Leia a explicação de cada opção abaixo e escolha a que mais combina com a sua ODS e com a mensagem que você quer passar.</p>,
     render:()=>{
       const esquemas = [
         {value:'complementar', label:'Complementar (oposto)', colors:[s.primaria, complementar], explicacao:'Combina duas cores diretamente opostas no círculo cromático (180° de distância entre elas). É o contraste mais forte que existe entre duas cores — ótimo para chamar atenção em botões e alertas, mas cansativo se usado em grandes áreas.'},
         {value:'analoga', label:'Análoga', colors:analogas, explicacao:'Combina cores vizinhas no círculo, cada uma a 30° de distância da outra. O resultado é harmonioso e suave, como tons que já convivem na natureza — boa escolha para interfaces calmas, que serão usadas por muito tempo.'},
         {value:'monocromatica', label:'Monocromática', colors:monocromatica, explicacao:'Usa uma única cor em diferentes níveis de claridade (versões mais claras e mais escuras da mesma cor). É o esquema mais coeso e elegante, com baixíssimo risco de conflito visual — mas oferece menos variedade para diferenciar elementos.'},
         {value:'triangular', label:'Triangular', colors:triangular, explicacao:'Combina três cores equidistantes no círculo, formando um triângulo (120° entre cada uma). Tem mais contraste e vibração que a análoga, e mais equilíbrio que a complementar — um meio-termo rico e ainda harmônico.'},
         {value:'quadrado', label:'Quadrado (tetrádica)', colors:quadrado, explicacao:'Combina quatro cores equidistantes no círculo, formando um quadrado (90° entre cada uma). É o esquema com maior variedade cromática — funciona melhor quando uma das cores domina a interface e as outras três aparecem como apoio pontual.'},
       ];
       return (
         <div role="radiogroup" aria-label="Esquema de cores">
           {esquemas.map(e=>(
             <button key={e.value} type="button" role="radio" aria-checked={s.esquemaEscolhido===e.value}
               onClick={()=>patch({esquemaEscolhido:e.value})}
               style={{display:'flex',width:'100%',textAlign:'left',gap:'14px',alignItems:'flex-start',cursor:'pointer',background:'var(--card-2)',border:'1px solid '+(s.esquemaEscolhido===e.value?'var(--accent)':'var(--line-soft)'),borderRadius:'10px',padding:'12px 14px',marginBottom:'10px',font:'inherit'}}>
               <div aria-hidden="true" style={{width:'18px',height:'18px',borderRadius:'50%',border:'2px solid '+(s.esquemaEscolhido===e.value?'var(--accent)':'var(--line)'),flexShrink:0,marginTop:'2px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                 {s.esquemaEscolhido===e.value && <div style={{width:'9px',height:'9px',borderRadius:'50%',background:'var(--accent)'}}></div>}
               </div>
               <div style={{flex:1,minWidth:0}}>
                 <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',marginBottom:'6px'}}>
                   <strong style={{fontSize:'14px',color:'var(--ink)'}}>{e.label}</strong>
                   <div className="swatch-row">{e.colors.map((c,i)=><div className="swatch" key={i} style={{width:'26px',height:'26px',background:c}}></div>)}</div>
                 </div>
                 <p style={{fontSize:'13px',color:'var(--ink-faint)',margin:0,lineHeight:1.5}}>{e.explicacao}</p>
               </div>
             </button>
           ))}
         </div>
       );
     }
    },
    {label:'Checando contraste (WCAG)',
     book:<p>Contraste é a diferença de luminosidade entre texto e fundo. Texto normal precisa de pelo menos 4,5:1 (nível AA); texto grande, 3:1. Compare uma versão ruim com a corrigida.</p>,
     render:()=>(
       <div>
         <div className="grid-2">
           <ColorField label="Cor do texto" value={s.contrasteTexto} onChange={v=>patch({contrasteTexto:v})} />
           <ColorField label="Cor do fundo" value={s.contrasteFundo} onChange={v=>patch({contrasteFundo:v})} />
         </div>
         <div className="contrast-demo" style={{background:s.contrasteFundo,color:s.contrasteTexto}}>Publicar doação</div>
         <div style={{marginTop:'10px'}}><ContrastBadge ratio={ratio} /></div>
         <p className="field-hint" style={{marginTop:'10px'}}>Exemplo de contraste ruim (cinza claro em branco): <ContrastBadge ratio={ratioRuim} /></p>
       </div>
     )
    },
    {label:'Modo claro e escuro',
     book:<p>Modo claro tem fundo claro e texto escuro (bom para leitura prolongada); modo escuro inverte, e é melhor à noite. Evite preto puro em grandes áreas — prefira cinzas bem escuros.</p>,
     render:()=>(
       <div>
         <div className="btn-row" style={{marginBottom:'14px'}}>
           <button className={"btn"+(s.modo==='claro'?' primary':'')} onClick={()=>patch({modo:'claro'})}>Modo claro</button>
           <button className={"btn"+(s.modo==='escuro'?' primary':'')} onClick={()=>patch({modo:'escuro'})}>Modo escuro</button>
         </div>
         <div className="contrast-demo" style={{background:s.modo==='claro'?'#FFFFFF':'#161616', color:s.modo==='claro'?'#111111':'#EDEDED', flexDirection:'column',gap:'10px'}}>
           <div style={{background:s.primaria,color:'#fff',padding:'8px 16px',borderRadius:'8px',fontSize:'14px'}}>Botão primário</div>
           <div style={{fontSize:'14px'}}>Texto de exemplo neste modo</div>
         </div>
       </div>
     )
    },
  ];

  if(showSummary){
    const txt = `PALETA DE CORES — ${s.ods||'(ODS não definida)'}\nPrimária: ${s.primaria} — ${s.justificativaPrimaria||''}\nSecundária: ${s.secundaria} — ${s.justificativaSecundaria||''}\nNeutras: ${s.neutras.join(', ')}\nEstados — success:${s.estados.success} error:${s.estados.error} warning:${s.estados.warning} info:${s.estados.info}\nEsquema escolhido: ${ESQUEMA_LABELS[s.esquemaEscolhido]||s.esquemaEscolhido}\nContraste texto/fundo: ${ratio.toFixed(2)}:1`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="swatch-row" style={{flexWrap:'wrap',marginBottom:'14px'}}>
          <div className="swatch" style={{background:s.primaria}} title="Primária"></div>
          <div className="swatch" style={{background:s.secundaria}} title="Secundária"></div>
          {s.neutras.map((n,i)=><div className="swatch" key={i} style={{background:n}} title={'Neutra '+i}></div>)}
          <div className="swatch" style={{background:s.estados.success}}></div>
          <div className="swatch" style={{background:s.estados.error}}></div>
          <div className="swatch" style={{background:s.estados.warning}}></div>
          <div className="swatch" style={{background:s.estados.info}}></div>
        </div>
        <p style={{color:'var(--ink)'}}><strong>{s.ods}</strong></p>
        <p style={{color:'var(--ink)'}}>Contraste texto/fundo escolhido: <ContrastBadge ratio={ratio} /></p>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.3 — TIPOGRAFIA
   ======================================================================= */
function GoogleFontLoader({family}){
  useEffect(()=>{
    if(!family) return;
    const id='gf-'+family.replace(/[^a-z0-9]/gi,'');
    if(document.getElementById(id)) return;
    const link=document.createElement('link');
    link.id=id; link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family).replace(/%20/g,'+')+':wght@400;600;700&display=swap';
    document.head.appendChild(link);
  },[family]);
  return null;
}
const FONTES_TITULO = ['Fraunces','Playfair Display','Merriweather','Libre Baskerville','Lora','Cormorant Garamond','DM Serif Display','Abril Fatface','Bodoni Moda','Crimson Pro','Spectral','Poppins','Montserrat','Raleway','Space Grotesk','Bricolage Grotesque','Sora','Syne','Unbounded','Archivo Black','Oswald','Caveat','Dancing Script','Pacifico'];
const FONTES_CORPO = ['Public Sans','Inter','Roboto','Open Sans','Lato','Source Sans 3','Nunito Sans','IBM Plex Sans','Work Sans','Karla','Mulish','Rubik','Manrope','Figtree','DM Sans','Noto Sans','PT Sans','Barlow','Assistant','Hind','Cabin','Jost','Urbanist','Outfit'];
function FontSelect({label,value,onChange,options}){
  const [open,setOpen] = useState(false);
  const isCustom = !!value && !options.includes(value);
  const [customMode,setCustomMode] = useState(isCustom);
  const wrapRef = useRef(null);
  const btnId = useRef('fontsel-btn-'+Math.random().toString(36).slice(2)).current;
  const listId = useRef('fontsel-list-'+Math.random().toString(36).slice(2)).current;
  useEffect(()=>{
    function onDocClick(ev){ if(wrapRef.current && !wrapRef.current.contains(ev.target)) setOpen(false); }
    function onKeyDown(ev){ if(ev.key==='Escape') setOpen(false); }
    document.addEventListener('mousedown',onDocClick);
    document.addEventListener('keydown',onKeyDown);
    return ()=>{ document.removeEventListener('mousedown',onDocClick); document.removeEventListener('keydown',onKeyDown); };
  },[]);
  const showCustomInput = customMode || isCustom;
  return (
    <div className="field" style={{position:'relative'}} ref={wrapRef}>
      <label className="field-label" id={btnId+'-label'}>{label}</label>
      {options.map(f=><GoogleFontLoader key={f} family={f} />)}
      {isCustom && <GoogleFontLoader family={value} />}
      {!showCustomInput && (
        <button type="button" id={btnId} aria-haspopup="listbox" aria-expanded={open} aria-labelledby={btnId+'-label '+btnId}
          onClick={()=>setOpen(o=>!o)}
          style={{width:'100%',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px',background:'var(--card)',border:'1px solid var(--line)',borderRadius:'6px',padding:'9px 11px',cursor:'pointer',color:'var(--ink)'}}>
          <span style={{fontFamily:"'"+value+"'",fontSize:'15px'}}>{value || 'Escolher fonte…'}</span>
          <span style={{fontSize:'11px',color:'var(--ink-faint)',flexShrink:0}} aria-hidden="true">{open?'▲':'▼'}</span>
        </button>
      )}
      {open && !showCustomInput && (
        <div role="listbox" id={listId} aria-labelledby={btnId+'-label'} tabIndex={-1}
          style={{position:'absolute',zIndex:20,top:'100%',left:0,right:0,marginTop:'4px',background:'var(--card)',border:'1px solid var(--line)',borderRadius:'8px',boxShadow:'var(--shadow-card)',maxHeight:'280px',overflowY:'auto'}}>
          {options.map(f=>(
            <button key={f} type="button" role="option" aria-selected={f===value}
              onClick={()=>{onChange(f);setOpen(false);}}
              style={{display:'block',width:'100%',textAlign:'left',border:'none',padding:'10px 12px',cursor:'pointer',fontFamily:"'"+f+"'",fontSize:'16px',color:'var(--ink)',background: f===value?'var(--card-2)':'transparent'}}>
              {f}
            </button>
          ))}
          <button type="button" onClick={()=>{setCustomMode(true);setOpen(false);}}
            style={{display:'block',width:'100%',textAlign:'left',border:'none',borderTop:'1px solid var(--line-soft)',padding:'10px 12px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'var(--accent)',background:'transparent'}}>
            + Digitar outro nome do Google Fonts…
          </button>
        </div>
      )}
      {showCustomInput && (
        <div>
          <div style={{display:'flex',gap:'8px'}}>
            <input value={isCustom?value:''} onChange={e=>onChange(e.target.value)} placeholder="Ex.: Bitter, Kalam, Zilla Slab…" style={{fontFamily: value?"'"+value+"'":undefined}} aria-label={label} />
            <button type="button" className="icon-btn" title="Voltar para a lista" onClick={()=>{setCustomMode(false);onChange(options[0]);}}>×</button>
          </div>
          <div className="field-hint">Digite o nome exatamente como aparece em fonts.google.com — a pré-visualização carrega sozinha.</div>
        </div>
      )}
    </div>
  );
}
function ArtTipografia({data,setData,goHome}){
  const defaults = {ods:'',publico:'',adjetivos:['','',''],tipoFonte:'',justificativaTipo:'',fonteTitulos:'Fraunces',fonteCorpo:'Public Sans',escala:{h1:26,h2:20,h3:17,body:16,caption:12,button:15},step:0,done:false};
  const [s,patch] = useSlice(data,setData,'tipografia',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='tipografia');
  const steps = [
    {label:'Voz tipográfica',
     book:<p>Escolha uma ODS, o público principal e três adjetivos para o tom do app (ex.: próximo, sério, inovador, acolhedor).</p>,
     render:()=>(<div><SelectField label="ODS" value={s.ods} onChange={v=>patch({ods:v})} options={ODS_LIST} /><Field label="Público principal" value={s.publico} onChange={v=>patch({publico:v})} placeholder="Ex.: idosos, agricultores, gestores públicos" /><div className="grid-3">{s.adjetivos.map((a,i)=><Field key={i} label={'Adjetivo '+(i+1)} value={a} onChange={v=>{const next=[...s.adjetivos];next[i]=v;patch({adjetivos:next});}} />)}</div></div>)
    },
    {label:'Tipo de fonte',
     book:<p>Serifadas passam tradição e formalidade; Sem serifa (o padrão para UI) passam modernidade; Manuscritas passam proximidade e afeto; Display chama atenção em títulos curtos.</p>,
     render:()=>(<div><SelectField label="Tipo de fonte" value={s.tipoFonte} onChange={v=>patch({tipoFonte:v})} options={['Serifada (Serif)','Sem serifa (Sans Serif)','Manuscrita (Script)','Display/Decorativa']} /><Field type="textarea" label="Justificativa" value={s.justificativaTipo} onChange={v=>patch({justificativaTipo:v})} rows={2} /></div>)
    },
    {label:'Par de fontes',
     book:<p>Use no máximo 2 famílias: uma mais expressiva para títulos, outra super legível para corpo. Evite combinar duas fontes muito parecidas ou duas muito exóticas. Escolha nos menus abaixo — cada opção já aparece escrita na própria fonte.</p>,
     render:()=>(
      <div>
        <div className="grid-2">
          <FontSelect label="Fonte de títulos" value={s.fonteTitulos} onChange={v=>patch({fonteTitulos:v})} options={FONTES_TITULO} />
          <FontSelect label="Fonte de corpo" value={s.fonteCorpo} onChange={v=>patch({fonteCorpo:v})} options={FONTES_CORPO} />
        </div>
        <GoogleFontLoader family={s.fonteTitulos} /><GoogleFontLoader family={s.fonteCorpo} />
        <div className="font-preview">
          <div style={{fontFamily:"'"+s.fonteTitulos+"', serif",fontSize:'28px',fontWeight:700}}>{s.fonteTitulos||'Título'}</div>
          <div style={{fontFamily:"'"+s.fonteCorpo+"', sans-serif",fontSize:'15px',marginTop:'8px'}}>{s.fonteCorpo? 'Este é um parágrafo de exemplo usando '+s.fonteCorpo+' — avalie se está confortável para leitura.' : 'Digite o nome de uma fonte de corpo.'}</div>
        </div>
      </div>
     )
    },
    {label:'Hierarquia tipográfica',
     book:<p>Defina os níveis H1, H2, H3, Body, Caption e Button. Se o leitor conseguir "pular a tela" só pelos títulos, a hierarquia está boa.</p>,
     render:()=>(
      <div>
        <div className="grid-3">
          {Object.entries({h1:'H1',h2:'H2',h3:'H3',body:'Body',caption:'Caption',button:'Button'}).map(([k,label])=>(
            <Field key={k} type="number" label={label+' (px)'} value={s.escala[k]} onChange={v=>patch({escala:{...s.escala,[k]:Number(v)}})} />
          ))}
        </div>
        <GoogleFontLoader family={s.fonteTitulos} /><GoogleFontLoader family={s.fonteCorpo} />
        <div className="font-preview">
          <div className="fp-line" style={{fontFamily:"'"+s.fonteTitulos+"', serif",fontSize:s.escala.h1+'px',fontWeight:700}}>Título principal (H1)</div>
          <div className="fp-line" style={{fontFamily:"'"+s.fonteTitulos+"', serif",fontSize:s.escala.h2+'px',fontWeight:600}}>Título de seção (H2)</div>
          <div className="fp-line" style={{fontFamily:"'"+s.fonteTitulos+"', serif",fontSize:s.escala.h3+'px',fontWeight:600}}>Subtítulo de card (H3)</div>
          <div className="fp-line" style={{fontFamily:"'"+s.fonteCorpo+"', sans-serif",fontSize:s.escala.body+'px'}}>Corpo de texto — parágrafos e descrições.</div>
          <div className="fp-line" style={{fontFamily:"'"+s.fonteCorpo+"', sans-serif",fontSize:s.escala.caption+'px',color:'var(--ink-faint)'}}>Caption — legendas e notas pequenas</div>
          <div style={{fontFamily:"'"+s.fonteCorpo+"', sans-serif",fontSize:s.escala.button+'px',fontWeight:700,display:'inline-block',background:'var(--accent)',color:'var(--accent-ink)',padding:'8px 16px',borderRadius:'8px'}}>Botão</div>
        </div>
      </div>
     )
    },
  ];
  if(showSummary){
    const txt = `TIPOGRAFIA — ${s.ods||''}\nPúblico: ${s.publico||'—'}\nTom: ${s.adjetivos.filter(Boolean).join(', ')}\nTipo de fonte: ${s.tipoFonte||'—'} — ${s.justificativaTipo||''}\nTítulos: ${s.fonteTitulos} | Corpo: ${s.fonteCorpo}\nEscala — H1:${s.escala.h1}px H2:${s.escala.h2}px H3:${s.escala.h3}px Body:${s.escala.body}px Caption:${s.escala.caption}px Button:${s.escala.button}px`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <GoogleFontLoader family={s.fonteTitulos} /><GoogleFontLoader family={s.fonteCorpo} />
        <div className="font-preview">
          <div style={{fontFamily:"'"+s.fonteTitulos+"', serif",fontSize:s.escala.h1+'px',fontWeight:700}}>{s.fonteTitulos} + {s.fonteCorpo}</div>
          <div style={{fontFamily:"'"+s.fonteCorpo+"', sans-serif",fontSize:s.escala.body+'px',marginTop:'6px'}}>Tom: {s.adjetivos.filter(Boolean).join(', ')||'—'} · Público: {s.publico||'—'}</div>
        </div>
        <div style={{marginTop:'10px'}}><CopyButton text={txt} /></div>
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.4 — ÍCONES E ICONOGRAFIA
   ======================================================================= */
function ArtIcones({data,setData,goHome}){
  const defaults = {ods:'',fraseApp:'',acoes:[{id:uid(),acao:'',icone:'',justificativa:''},{id:uid(),acao:'',icone:'',justificativa:''},{id:uid(),acao:'',icone:'',justificativa:''}],reflexao:{facil:'',ambiguo:'',ajudou:''},step:0,done:false};
  const [s,patch] = useSlice(data,setData,'icones',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='icones');
  function setAcao(i,field,val){ const next=[...s.acoes]; next[i]={...next[i],[field]:val}; patch({acoes:next}); }
  function addAcao(){ patch({acoes:[...s.acoes,{id:uid(),acao:'',icone:'',justificativa:''}]}); }
  function removeAcao(i){ const next=s.acoes.filter((_,idx)=>idx!==i); patch({acoes:next.length?next:[{id:uid(),acao:'',icone:'',justificativa:''}]}); }
  const steps = [
    {label:'Contexto',
     book:<p>Ícones são atalhos cognitivos: ajudam o usuário a entender rapidamente o que pode fazer. Escolha uma ODS e descreva seu app em uma frase.</p>,
     render:()=>(<div><SelectField label="ODS" value={s.ods} onChange={v=>patch({ods:v})} options={ODS_LIST} /><Field label="Descreva seu app em 1 frase" value={s.fraseApp} onChange={v=>patch({fraseApp:v})} placeholder="Ex.: App para alunos acompanharem aulas e tarefas" /></div>)
    },
    {label:'Ações e ícones',
     book:<><p>Liste as ações principais do app e, para cada uma, escolha (ou descreva) um ícone e justifique a metáfora visual — lembrando: sempre que possível, ícone + texto.</p></>,
     render:()=>(
      <div>
        {s.acoes.map((a,i)=>(
          <div className="grid-3" key={a.id}>
            <Field label="Ação" value={a.acao} onChange={v=>setAcao(i,'acao',v)} placeholder="Ex.: Doar alimento" />
            <Field label="Ícone (emoji ou nome)" value={a.icone} onChange={v=>setAcao(i,'icone',v)} placeholder="🍽️ prato" />
            <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
              <Field label="Justificativa" value={a.justificativa} onChange={v=>setAcao(i,'justificativa',v)} placeholder="Lembra prato de comida" />
              <button className="icon-btn" style={{marginBottom:'16px'}} onClick={()=>removeAcao(i)}>×</button>
            </div>
          </div>
        ))}
        <button className="add-row-btn" onClick={addAcao}>+ adicionar ação</button>
      </div>
     )
    },
    {label:'Preview da tela',
     book:<p>Monte uma pequena tela com ícone + texto para cada ação, mantendo o mesmo tamanho e distância entre eles.</p>,
     render:()=>(
      <div className="font-preview" style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
        {s.acoes.filter(a=>a.acao).map(a=>(
          <div key={a.id} style={{display:'flex',alignItems:'center',gap:'8px',background:'var(--card)',border:'1px solid var(--line)',borderRadius:'10px',padding:'10px 14px'}}>
            <span style={{fontSize:'20px'}}>{a.icone||'▢'}</span><span style={{fontSize:'14px'}}>{a.acao}</span>
          </div>
        ))}
        {s.acoes.filter(a=>a.acao).length===0 && <p className="mini-note">Preencha as ações no passo anterior para ver o preview.</p>}
      </div>
     )
    },
    {label:'Reflexão',
     book:<p>É fácil bater o olho e entender o que cada ícone faz? Algum ícone ficou ambíguo? O ícone está ajudando ou atrapalhando?</p>,
     render:()=>(<div><Field type="textarea" rows={2} label="É fácil entender cada ícone?" value={s.reflexao.facil} onChange={v=>patch({reflexao:{...s.reflexao,facil:v}})} /><Field type="textarea" rows={2} label="Algum ícone ficou ambíguo?" value={s.reflexao.ambiguo} onChange={v=>patch({reflexao:{...s.reflexao,ambiguo:v}})} /><Field type="textarea" rows={2} label="O ícone ajuda ou atrapalha?" value={s.reflexao.ajudou} onChange={v=>patch({reflexao:{...s.reflexao,ajudou:v}})} /></div>)
    },
  ];
  if(showSummary){
    const txt = `ÍCONES E ICONOGRAFIA — ${s.ods}\n${s.fraseApp}\n\n`+s.acoes.filter(a=>a.acao).map(a=>a.icone+' '+a.acao+' — '+a.justificativa).join('\n');
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <p style={{color:'var(--ink)'}}>{s.fraseApp}</p>
        {s.acoes.filter(a=>a.acao).map(a=><p key={a.id} style={{color:'var(--ink)'}}>{a.icone} <strong>{a.acao}</strong> — {a.justificativa}</p>)}
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.5 — LAYOUT E ESPAÇAMENTO
   ======================================================================= */
function ArtLayout({data,setData,goHome}){
  const defaults = {reflexaoLivre:'',margem:16,colunasMobile:1,colunasDesktop:3,escala:{xxs:4,xs:8,sm:12,md:16,lg:24,xl:32},alinhamento:'esquerda',comparacao:'',step:0,done:false};
  const [s,patch] = useSlice(data,setData,'layout',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='layout');
  const steps = [
    {label:'Sem grid (reflexão)',
     book:<p>Desenhe uma tela "no olho", sem grid nem escala de espaçamento. O que costuma dar errado: tudo centralizado, espaçamento inconsistente, falta de respiro.</p>,
     render:()=> <Field type="textarea" label="O que geralmente acontece quando não se usa grid?" value={s.reflexaoLivre} onChange={v=>patch({reflexaoLivre:v})} rows={3} placeholder="Ex.: os elementos ficam desalinhados e a hierarquia se perde." />
    },
    {label:'Margens e grid',
     book:<p>Um grid organiza a tela com "linhas invisíveis". Exemplo do livro: margens laterais de 16px em mobile, e grid de 2-3 colunas em desktop com gutters constantes.</p>,
     render:()=>(<div className="grid-3"><Field type="number" label="Margem lateral (px)" value={s.margem} onChange={v=>patch({margem:Number(v)})} /><Field type="number" label="Colunas — mobile" value={s.colunasMobile} onChange={v=>patch({colunasMobile:Number(v)})} /><Field type="number" label="Colunas — desktop" value={s.colunasDesktop} onChange={v=>patch({colunasDesktop:Number(v)})} /></div>)
    },
    {label:'Escala de espaçamentos',
     book:<p>Para não virar bagunça, use uma escala de espaçamentos (ex.: 4-8-12-16-24-32) em vez de valores soltos.</p>,
     render:()=>(<div className="grid-3">{Object.entries(s.escala).map(([k,v])=><Field key={k} type="number" label={'spacing-'+k} value={v} onChange={val=>patch({escala:{...s.escala,[k]:Number(val)}})} />)}</div>)
    },
    {label:'Preview ao vivo',
     book:<p>Veja como suas escolhas de margem, espaçamento e alinhamento se comportam em uma lista real de cards.</p>,
     render:()=>(
      <div>
        <SelectField label="Alinhamento do texto" value={s.alinhamento} onChange={v=>patch({alinhamento:v})} options={[{value:'esquerda',label:'Esquerda'},{value:'centro',label:'Centro'}]} />
        <div style={{padding:s.margem+'px',background:'var(--card-2)',border:'1px solid var(--line)',borderRadius:'8px'}}>
          <div style={{display:'flex',flexDirection:'column',gap:s.escala.sm+'px'}}>
            {['Doação de arroz — 2kg','Doação de feijão — 1kg','Doação de legumes — 3kg'].map((t,i)=>(
              <div key={i} style={{background:'var(--card)',border:'1px solid var(--line-soft)',borderRadius:'6px',padding:s.escala.md+'px',textAlign:s.alinhamento==='centro'?'center':'left'}}>{t}</div>
            ))}
          </div>
          <div style={{marginTop:s.escala.lg+'px',background:'var(--accent)',color:'var(--accent-ink)',borderRadius:'8px',padding:s.escala.md+'px',textAlign:'center',fontWeight:700}}>Cadastrar nova doação</div>
        </div>
      </div>
     )
    },
    {label:'Comparação final',
     book:<p>Compare as duas versões: qual é mais fácil de ler? Em qual a hierarquia fica mais clara? Em qual a tela parece mais profissional?</p>,
     render:()=> <Field type="textarea" rows={3} label="O que mudou entre a versão sem grid e a versão com grid/escala?" value={s.comparacao} onChange={v=>patch({comparacao:v})} />
    },
  ];
  if(showSummary){
    const txt = `LAYOUT E ESPAÇAMENTO\nMargem lateral: ${s.margem}px | Colunas mobile: ${s.colunasMobile} | Colunas desktop: ${s.colunasDesktop}\nEscala: xxs${s.escala.xxs} xs${s.escala.xs} sm${s.escala.sm} md${s.escala.md} lg${s.escala.lg} xl${s.escala.xl}\nAlinhamento: ${s.alinhamento}\nComparação: ${s.comparacao||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <p style={{color:'var(--ink)'}}>Margem {s.margem}px · grid {s.colunasMobile}/{s.colunasDesktop} colunas (mobile/desktop) · alinhamento {s.alinhamento}</p>
        <p style={{color:'var(--ink)'}}>{s.comparacao}</p>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}
