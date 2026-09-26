/* =======================================================================
   3.6 — TOKENS DE DESIGN
   ======================================================================= */
function ArtTokens({data,setData,goHome}){
  const defaults = {radius:'md',shadow:'sm',step:0,done:false};
  const [s,patch] = useSlice(data,setData,'tokens',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='tokens');
  const cores = data.cores || {primaria:'#2E6F5E',secundaria:'#B8862E',neutras:['#FFFFFF','#8A8F86','#20242B'],estados:{success:'#2E7D4F',error:'#AE3227',warning:'#93650A',info:'#2B5F8A'}};
  const tipo = data.tipografia || {fonteTitulos:'Fraunces',fonteCorpo:'Public Sans',escala:{h1:26,h2:20,h3:17,body:16,caption:12,button:15}};
  const layout = data.layout || {escala:{xxs:4,xs:8,sm:12,md:16,lg:24,xl:32}};

  const tokenJson = JSON.stringify({
    color:{primary:cores.primaria,secondary:cores.secundaria,surface:cores.neutras[0],textPrimary:cores.neutras[2],textSecondary:cores.neutras[1],success:cores.estados.success,error:cores.estados.error,warning:cores.estados.warning,info:cores.estados.info},
    typography:{familyHeading:tipo.fonteTitulos,familyBase:tipo.fonteCorpo,sizeH1:tipo.escala.h1+'px',sizeH2:tipo.escala.h2+'px',sizeH3:tipo.escala.h3+'px',sizeBody:tipo.escala.body+'px',sizeCaption:tipo.escala.caption+'px'},
    spacing:{xxs:layout.escala.xxs+'px',xs:layout.escala.xs+'px',sm:layout.escala.sm+'px',md:layout.escala.md+'px',lg:layout.escala.lg+'px',xl:layout.escala.xl+'px'},
    radius:{value: s.radius==='none'?'0px':s.radius==='sm'?'4px':s.radius==='md'?'8px':'16px'},
    shadow:{value: s.shadow}
  }, null, 2);

  const steps = [
    {label:'Confirme a paleta',
     book:<p>Tokens de cor guardam cores com nomes que indicam função (color-primary, color-error…), não a aparência. Esta paleta vem do artefato "Paleta de Cores" — edite lá se quiser mudar.</p>,
     render:()=>(<div className="swatch-row" style={{flexWrap:'wrap'}}>{[['primary',cores.primaria],['secondary',cores.secundaria],['surface',cores.neutras[0]],['text',cores.neutras[2]],['success',cores.estados.success],['error',cores.estados.error]].map(([k,v])=>(<div key={k} style={{textAlign:'center'}}><div className="swatch" style={{background:v}}></div><div className="mini-note mono">{k}</div></div>))}</div>)
    },
    {label:'Confirme a tipografia',
     book:<p>Tokens de tipografia guardam fonte, tamanho e peso — puxados do artefato "Tipografia".</p>,
     render:()=>(<p style={{color:'var(--ink)'}} className="mono">font-family-heading: {tipo.fonteTitulos} · font-family-base: {tipo.fonteCorpo} · font-size-h1: {tipo.escala.h1}px · font-size-body: {tipo.escala.body}px</p>)
    },
    {label:'Confirme o espaçamento',
     book:<p>Tokens de espaçamento evitam interface "torta" — puxados do artefato "Layout e Espaçamento".</p>,
     render:()=>(<p style={{color:'var(--ink)'}} className="mono">spacing-xxs:{layout.escala.xxs}px spacing-xs:{layout.escala.xs}px spacing-sm:{layout.escala.sm}px spacing-md:{layout.escala.md}px spacing-lg:{layout.escala.lg}px spacing-xl:{layout.escala.xl}px</p>)
    },
    {label:'Raio e sombra',
     book:<p>Tokens de raio e sombra usam a mesma lógica dos tokens de espaço: radius-sm, radius-md, radius-lg… shadow-sm, shadow-md, shadow-lg.</p>,
     render:()=>(<div className="grid-2"><SelectField label="Raio padrão" value={s.radius} onChange={v=>patch({radius:v})} options={[{value:'none',label:'radius-none (0px)'},{value:'sm',label:'radius-sm (4px)'},{value:'md',label:'radius-md (8px)'},{value:'lg',label:'radius-lg (16px)'}]} /><SelectField label="Sombra padrão" value={s.shadow} onChange={v=>patch({shadow:v})} options={[{value:'none',label:'shadow-none'},{value:'sm',label:'shadow-sm'},{value:'md',label:'shadow-md'},{value:'lg',label:'shadow-lg'}]} /></div>)
    },
    {label:'JSON de tokens',
     book:<p>Coloque tudo em um lugar só: design e código passam a usar os mesmos nomes.</p>,
     render:()=>(<div><div className="code-block">{tokenJson}</div><div style={{marginTop:'10px'}}><CopyButton text={tokenJson} label="Copiar JSON" /></div></div>)
    },
  ];
  if(showSummary){
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={'TOKENS DE DESIGN\n'+tokenJson} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="code-block">{tokenJson}</div>
        <div style={{marginTop:'10px'}}><CopyButton text={tokenJson} label="Copiar JSON" /></div>
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.7 — DESIGN SYSTEM
   ======================================================================= */
function ArtDesignSystem({data,setData,goHome}){
  const defaults = {componentes:[{id:uid(),nome:'',estados:[],tamanhos:'',uso:''}],padroes:[''],temGuia:null,temKit:null,temSistema:null,doDont:[{id:uid(),do:'',dont:''}],step:0,done:false};
  const [s,patch] = useSlice(data,setData,'designSystem',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='designSystem');
  const cores = data.cores || {}; const tipo = data.tipografia || {}; const layout = data.layout || {};
  function setComp(i,field,val){ const next=[...s.componentes]; next[i]={...next[i],[field]:val}; patch({componentes:next}); }
  function addComp(){ patch({componentes:[...s.componentes,{id:uid(),nome:'',estados:[],tamanhos:'',uso:''}]}); }
  function removeComp(i){ const next=s.componentes.filter((_,idx)=>idx!==i); patch({componentes:next.length?next:[{id:uid(),nome:'',estados:[],tamanhos:'',uso:''}]}); }
  function setDD(i,field,val){ const next=[...s.doDont]; next[i]={...next[i],[field]:val}; patch({doDont:next}); }

  const steps = [
    {label:'Fundamentos',
     book:<p>Um Design System reúne cores, tipografia, ícones, espaçamentos e componentes reutilizáveis. Estes fundamentos vêm dos artefatos anteriores.</p>,
     render:()=>(<div className="summary-block"><p style={{color:'var(--ink)'}} className="mono">Cor primária: {cores.primaria||'—'} · Fonte títulos: {tipo.fonteTitulos||'—'} · Fonte corpo: {tipo.fonteCorpo||'—'} · Spacing-md: {(layout.escala&&layout.escala.md)||'—'}px</p><p className="mini-note">Se algo estiver faltando, volte aos artefatos de Cores, Tipografia e Layout.</p></div>)
    },
    {label:'Componentes',
     book:<p>Descreva os componentes reutilizáveis (botões, inputs, cards, modais) com seus estados (hover, erro, desabilitado), tamanhos e exemplos de uso.</p>,
     render:()=>(
      <div>
        {s.componentes.map((c,i)=>(
          <div className="summary-block" key={c.id}>
            <div className="toolbar-top"><Field label="Componente" value={c.nome} onChange={v=>setComp(i,'nome',v)} placeholder="Ex.: ButtonPrimary" /><button className="icon-btn" onClick={()=>removeComp(i)}>×</button></div>
            <CheckGroup label="Estados previstos" options={['default','hover','foco','pressionado','desabilitado','erro']} values={c.estados} onChange={v=>setComp(i,'estados',v)} />
            <Field label="Tamanhos" value={c.tamanhos} onChange={v=>setComp(i,'tamanhos',v)} placeholder="Ex.: sm/md/lg" />
            <Field label="Onde usar" value={c.uso} onChange={v=>setComp(i,'uso',v)} placeholder="Ex.: ação principal de cada tela" />
          </div>
        ))}
        <button className="add-row-btn" onClick={addComp}>+ adicionar componente</button>
      </div>
     )
    },
    {label:'Padrões',
     book:<p>Padrões são conjuntos de componentes trabalhando juntos para tarefas comuns (tela de login, checkout, busca e filtros) — evitam que cada pessoa invente um fluxo diferente.</p>,
     render:()=> <ListField label="Padrões de tela/fluxo" items={s.padroes} onChange={v=>patch({padroes:v})} placeholder="Ex.: tela de login" />
    },
    {label:'Guia de Estilo × UI Kit × Design System',
     book:<p>Guia de Estilo é um documento estático (cores, fontes, logo). UI Kit é a biblioteca de componentes prontos. Design System une os dois com princípios, código e documentação viva.</p>,
     render:()=>(<div><YesNo label="Você já tem um guia de estilo (documento de marca)?" value={s.temGuia} onChange={v=>patch({temGuia:v})} /><YesNo label="Você já tem um UI Kit (componentes prontos no Figma)?" value={s.temKit} onChange={v=>patch({temKit:v})} /><YesNo label="Isso já forma um Design System vivo, versionado?" value={s.temSistema} onChange={v=>patch({temSistema:v})} /></div>)
    },
    {label:'Documentação (Do/Don\'t)',
     book:<p>Documente boas práticas e anti-exemplos — o que fazer e o que evitar para cada componente ou padrão.</p>,
     render:()=>(
      <div>
        {s.doDont.map((d,i)=>(
          <div className="grid-2" key={d.id}>
            <Field label="Faça (Do)" value={d.do} onChange={v=>setDD(i,'do',v)} />
            <Field label="Evite (Don't)" value={d.dont} onChange={v=>setDD(i,'dont',v)} />
          </div>
        ))}
        <button className="add-row-btn" onClick={()=>patch({doDont:[...s.doDont,{id:uid(),do:'',dont:''}]})}>+ adicionar par Do/Don't</button>
      </div>
     )
    },
  ];
  if(showSummary){
    const txt = `DESIGN SYSTEM\n\nComponentes:\n${s.componentes.filter(c=>c.nome).map(c=>'- '+c.nome+' ('+c.estados.join(', ')+') — '+c.uso).join('\n')}\n\nPadrões:\n${s.padroes.filter(Boolean).map(p=>'- '+p).join('\n')}\n\nDo/Don\'t:\n${s.doDont.filter(d=>d.do||d.dont).map(d=>'Faça: '+d.do+' | Evite: '+d.dont).join('\n')}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="summary-block"><h4>Componentes</h4>{s.componentes.filter(c=>c.nome).map(c=><p key={c.id} style={{color:'var(--ink)'}}>{c.nome} — {c.estados.join(', ')}</p>)}</div>
        <div className="summary-block"><h4>Padrões</h4>{s.padroes.filter(Boolean).map((p,i)=><p key={i} style={{color:'var(--ink)'}}>{p}</p>)}</div>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.8 — PROTOTIPAGEM
   ======================================================================= */
function ArtPrototipagem({data,setData,goHome}){
  const defaults = {tarefaChave:'',telasSelecionadas:[],interacoes:[''],estados:{erro:'',carregando:'',sucesso:''},inclusivo:[],tarefaTeste:'',funcionou:[''],geraramDuvida:[''],step:0,done:false};
  const [s,patch] = useSlice(data,setData,'prototipagem',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='prototipagem');
  const fluxo = data.fluxo || {telas:[]};
  const telasDisponiveis = (fluxo.telas||[]).filter(t=>t.nome).map(t=>t.nome);
  const inclusivoOpcoes = ['Contraste suficiente para leitura confortável','Tamanhos de fonte adequados no mobile','Ícones importantes com texto/rótulo','Rótulos objetivos (nada de "clique aqui")','Organização reduz a carga cognitiva'];

  const steps = [
    {label:'Revisar o fluxo principal',
     book:<p>Não é necessário prototipar todo o sistema — escolha de 4 a 8 telas que formam o caminho da ação mais importante.</p>,
     render:()=> <Field label="Tarefa-chave a prototipar" value={s.tarefaChave} onChange={v=>patch({tarefaChave:v})} placeholder="Ex.: cadastrar uma doação de alimento" />
    },
    {label:'Selecionar telas do protótipo',
     book:<p>Escolha de 4 a 8 telas do seu Fluxo de Telas que formam o caminho da tarefa-chave.</p>,
     render:()=> telasDisponiveis.length ? <CheckGroup label="Telas (do artefato Fluxo de Telas)" options={telasDisponiveis} values={s.telasSelecionadas} onChange={v=>patch({telasSelecionadas:v})} /> : <p className="mini-note">Nenhuma tela cadastrada ainda — preencha o artefato "Fluxo de Telas" primeiro.</p>
    },
    {label:'Interações de navegação',
     book:<p>Nomeie as transições de forma clara: "ao clicar em Publicar Doação vai para Tela de Confirmação".</p>,
     render:()=> <ListField label="Transições" items={s.interacoes} onChange={v=>patch({interacoes:v})} placeholder='Ex.: ao clicar em "Publicar" vai para "Confirmação"' />
    },
    {label:'Estados e feedbacks',
     book:<p>Desenhe ao menos os estados: formulário com erro, carregamento e sucesso — de preferência ligado ao impacto da ODS.</p>,
     render:()=>(<div><Field type="textarea" rows={2} label="Mensagem de erro" value={s.estados.erro} onChange={v=>patch({estados:{...s.estados,erro:v}})} /><Field type="textarea" rows={2} label="Mensagem de carregamento" value={s.estados.carregando} onChange={v=>patch({estados:{...s.estados,carregando:v}})} /><Field type="textarea" rows={2} label="Mensagem de sucesso" value={s.estados.sucesso} onChange={v=>patch({estados:{...s.estados,sucesso:v}})} /></div>)
    },
    {label:'Protótipo inclusivo',
     book:<p>Se o protótipo já nasce excludente, o produto final também será. Verifique os critérios de acessibilidade desde o desenho.</p>,
     render:()=> <CheckGroup label="Verificado" options={inclusivoOpcoes} values={s.inclusivo} onChange={v=>patch({inclusivo:v})} />
    },
    {label:'Teste de usabilidade',
     book:<p>Defina uma tarefa e peça para alguém tentar concluí-la só com o protótipo. Registre o que funcionou e o que gerou dúvida ou erro.</p>,
     render:()=>(<div><Field label="Tarefa dada à pessoa testando" value={s.tarefaTeste} onChange={v=>patch({tarefaTeste:v})} /><ListField label="O que funcionou bem" items={s.funcionou} onChange={v=>patch({funcionou:v})} /><ListField label="O que gerou dúvida ou erro" items={s.geraramDuvida} onChange={v=>patch({geraramDuvida:v})} /></div>)
    },
  ];
  if(showSummary){
    const txt = `PROTOTIPAGEM\nTarefa-chave: ${s.tarefaChave}\nTelas: ${s.telasSelecionadas.join(', ')||'—'}\nTransições:\n${s.interacoes.filter(Boolean).map(i=>'- '+i).join('\n')}\nEstados — erro: ${s.estados.erro} | carregando: ${s.estados.carregando} | sucesso: ${s.estados.sucesso}\nAcessibilidade verificada: ${s.inclusivo.join(', ')||'—'}\nTeste — tarefa: ${s.tarefaTeste}\nFuncionou: ${s.funcionou.filter(Boolean).join(', ')}\nGerou dúvida: ${s.geraramDuvida.filter(Boolean).join(', ')}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <p style={{color:'var(--ink)'}}><strong>{s.tarefaChave}</strong></p>
        <p style={{color:'var(--ink)'}}>Telas: {s.telasSelecionadas.join(' → ')||'—'}</p>
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   3.9 — TOM DE VOZ, RÓTULOS E MICROCOPY
   ======================================================================= */
function ArtTomDeVoz({data,setData,goHome}){
  const defaults = {publico:'',contexto:'',tom:[],temasSensiveis:[],fluxoEscolhido:'',textos:[{id:uid(),tipo:'Botão',atual:'',claro:null,reescrita:''}],inclusiva:[],step:0,done:false};
  const [s,patch] = useSlice(data,setData,'tomDeVoz',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='tomDeVoz');
  function setTexto(i,field,val){ const next=[...s.textos]; next[i]={...next[i],[field]:val}; patch({textos:next}); }
  function addTexto(){ patch({textos:[...s.textos,{id:uid(),tipo:'Botão',atual:'',claro:null,reescrita:''}]}); }
  function removeTexto(i){ const next=s.textos.filter((_,idx)=>idx!==i); patch({textos:next.length?next:[{id:uid(),tipo:'Botão',atual:'',claro:null,reescrita:''}]}); }
  const inclusivaOpcoes = ['Evita rotular a pessoa pelo problema','Evita humor em temas sensíveis','Usa vocabulário consistente (mesmo termo em toda a interface)','Explica o erro em vez de culpar o usuário','Celebra o sucesso conectando-o à ODS'];

  const steps = [
    {label:'Definição do tom',
     book:<p>O tom de voz é o conjunto de escolhas de linguagem que fazem a interface "soar" de um certo jeito — depende de quem fala, em que contexto, e se há temas sensíveis envolvidos.</p>,
     render:()=>(
      <div>
        <Field label="Público (adolescentes, idosos, gestores…)" value={s.publico} onChange={v=>patch({publico:v})} />
        <Field label="Contexto de uso" value={s.contexto} onChange={v=>patch({contexto:v})} placeholder="Ex.: sala de aula, fila do posto de saúde, ônibus" />
        <CheckGroup label="Tom desejado" options={['Próximo e acolhedor','Sério e técnico','Motivador','Direto e objetivo','Formal']} values={s.tom} onChange={v=>patch({tom:v})} />
        <CheckGroup label="Temas sensíveis envolvidos" options={['Saúde','Renda/pobreza','Violência','Aprendizagem/deficiência','Nenhum']} values={s.temasSensiveis} onChange={v=>patch({temasSensiveis:v})} />
      </div>
     )
    },
    {label:'Fluxo escolhido',
     book:<p>Escolha um fluxo importante da sua solução (ex.: "Registrar uma ocorrência", "Doar alimento", "Agendar carona solidária").</p>,
     render:()=> <Field label="Fluxo" value={s.fluxoEscolhido} onChange={v=>patch({fluxoEscolhido:v})} />
    },
    {label:'Textos do fluxo',
     book:<p>Liste os botões, rótulos, mensagens de erro e de sucesso desse fluxo. Para cada um, pergunte: está claro o que acontece ao clicar? Se não, reescreva.</p>,
     render:()=>(
      <div>
        {s.textos.map((t,i)=>(
          <div className="summary-block" key={t.id}>
            <div className="grid-3">
              <SelectField label="Tipo" value={t.tipo} onChange={v=>setTexto(i,'tipo',v)} options={['Botão','Rótulo/Menu','Mensagem de erro','Mensagem de aviso','Mensagem de sucesso']} />
              <Field label="Texto atual" value={t.atual} onChange={v=>setTexto(i,'atual',v)} placeholder="Ex.: OK" />
              <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
                <div style={{flex:1}}><YesNo label="Está claro?" value={t.claro} onChange={v=>setTexto(i,'claro',v)} /></div>
                <button className="icon-btn" style={{marginBottom:'16px'}} onClick={()=>removeTexto(i)}>×</button>
              </div>
            </div>
            <Field label="Reescrita sugerida" value={t.reescrita} onChange={v=>setTexto(i,'reescrita',v)} placeholder="Ex.: Publicar doação" />
          </div>
        ))}
        <button className="add-row-btn" onClick={addTexto}>+ adicionar texto</button>
      </div>
     )
    },
    {label:'Linguagem inclusiva',
     book:<p>Trabalhar com ODS envolve temas sensíveis: o tom precisa ser respeitoso, não estigmatizante e centrado na pessoa, não no problema.</p>,
     render:()=> <CheckGroup label="Verificado" options={inclusivaOpcoes} values={s.inclusiva} onChange={v=>patch({inclusiva:v})} />
    },
  ];
  if(showSummary){
    const txt = `TOM DE VOZ E MICROCOPY\nPúblico: ${s.publico} · Contexto: ${s.contexto}\nTom: ${s.tom.join(', ')}\nTemas sensíveis: ${s.temasSensiveis.join(', ')}\nFluxo: ${s.fluxoEscolhido}\n\nTEXTOS\n`+s.textos.filter(t=>t.atual).map(t=>'['+t.tipo+'] "'+t.atual+'" → '+(t.reescrita||'(mantido)')).join('\n')+`\n\nLinguagem inclusiva verificada: ${s.inclusiva.join(', ')||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        {s.textos.filter(t=>t.atual).map(t=>(<p key={t.id} style={{color:'var(--ink)'}}><span className="badge neutral">{t.tipo}</span> "{t.atual}" → <strong>{t.reescrita||'(mantido)'}</strong></p>))}
        <CopyButton text={txt} />
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   APP SHELL
   ======================================================================= */
const COMPONENT_MAP = {
  problematizacao: ArtProblematizacao,
  ideacao: ArtIdeacao, jornada: ArtJornada, csd: ArtCsd, leanCanvas: ArtLeanCanvas, fluxo: ArtFluxo,
  linguagemVisual: ArtLinguagemVisual,
  cores: ArtCores, tipografia: ArtTipografia, icones: ArtIcones, layout: ArtLayout, tokens: ArtTokens,
  designSystem: ArtDesignSystem, prototipagem: ArtPrototipagem, tomDeVoz: ArtTomDeVoz,
};

function BackupPanel({data,setData}){
  const [mode,setMode] = useState(null); // null | 'export' | 'import'
  const [importText,setImportText] = useState('');
  const [importError,setImportError] = useState('');
  const [importOk,setImportOk] = useState(false);
  const [confirmReset,setConfirmReset] = useState(false);
  const fileRef = useRef(null);
  const json = useMemo(()=>JSON.stringify(data,null,2),[data]);

  useEffect(()=>{
    if(!confirmReset) return;
    const t = setTimeout(()=>setConfirmReset(false), 4000);
    return ()=>clearTimeout(t);
  },[confirmReset]);

  function applyImport(text){
    setImportError(''); setImportOk(false);
    try{
      const parsed = JSON.parse(text);
      if(!parsed || typeof parsed!=='object' || Array.isArray(parsed)) throw new Error('formato inválido');
      setData(parsed);
      setImportOk(true);
      setImportText('');
    }catch(e){
      setImportError('Não consegui ler esse arquivo/texto como um backup válido (JSON). Confira se é o arquivo exportado por aqui.');
    }
  }
  function onFilePicked(ev){
    const file = ev.target.files && ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>applyImport(String(reader.result||''));
    reader.onerror = ()=>setImportError('Não consegui ler o arquivo selecionado.');
    reader.readAsText(file);
    ev.target.value = '';
  }
  function doReset(){
    if(!confirmReset){ setConfirmReset(true); return; }
    setData({});
    setConfirmReset(false);
    setMode(null);
  }

  return (
    <div className="card" style={{marginTop:'22px'}}>
      <h4 style={{marginTop:0}}>Backup dos dados</h4>
      <p className="field-hint" style={{marginTop:'-4px'}}>Seus dados ficam salvos apenas neste navegador. Exporte um backup para guardar em outro lugar ou levar para outro computador — e importe para restaurar.</p>
      <div className="btn-row" style={{flexWrap:'wrap'}}>
        <button type="button" className={"btn"+(mode==='export'?' primary':'')} aria-pressed={mode==='export'} onClick={()=>setMode(mode==='export'?null:'export')}>Exportar backup</button>
        <button type="button" className={"btn"+(mode==='import'?' primary':'')} aria-pressed={mode==='import'} onClick={()=>{setMode(mode==='import'?null:'import'); setImportError(''); setImportOk(false);}}>Importar backup</button>
        <button type="button" className={"btn"+(confirmReset?' danger':'')} onClick={doReset}>
          {confirmReset ? 'Confirmar: apagar tudo?' : 'Reiniciar tudo'}
        </button>
      </div>
      {confirmReset && <p className="field-hint" style={{color:'var(--err, #AE3227)'}}>Clique de novo para apagar todos os artefatos preenchidos. Isso não pode ser desfeito. (cancela sozinho em alguns segundos)</p>}

      {mode==='export' && (
        <div style={{marginTop:'12px'}}>
          <p className="field-hint">Copie o texto abaixo e guarde em um arquivo de texto (.json) ou em um bloco de notas.</p>
          <textarea readOnly value={json} rows={8} style={{fontFamily:'monospace',fontSize:'12px'}} onClick={e=>e.target.select()} aria-label="Backup em JSON" />
          <div style={{marginTop:'8px'}}><CopyButton text={json} label="Copiar backup" /></div>
        </div>
      )}

      {mode==='import' && (
        <div style={{marginTop:'12px'}}>
          <p className="field-hint">Envie o arquivo exportado antes, ou cole o conteúdo do backup abaixo.</p>
          <div className="btn-row">
            <button type="button" className="btn" onClick={()=>fileRef.current&&fileRef.current.click()}>Escolher arquivo…</button>
            <input ref={fileRef} type="file" accept=".json,.txt,application/json" onChange={onFilePicked} style={{display:'none'}} />
          </div>
          <textarea value={importText} onChange={e=>setImportText(e.target.value)} rows={6} placeholder="Cole aqui o conteúdo do backup (JSON)…" style={{fontFamily:'monospace',fontSize:'12px',marginTop:'8px'}} aria-label="Colar backup" />
          <div className="btn-row" style={{marginTop:'8px'}}>
            <button type="button" className="btn primary" disabled={!importText.trim()} onClick={()=>applyImport(importText)}>Restaurar deste texto</button>
          </div>
          {importError && <p className="field-hint" style={{color:'var(--err, #AE3227)'}}>{importError}</p>}
          {importOk && <p className="field-hint" style={{color:'var(--ok, #2E7D4F)'}}>Backup restaurado com sucesso.</p>}
        </div>
      )}
    </div>
  );
}

function Home({data,onOpen,setData}){
  const cap2 = ARTIFACTS.filter(a=>a.chapter===2);
  const cap3 = ARTIFACTS.filter(a=>a.chapter===3);
  const doneCount = ARTIFACTS.filter(a=>data[a.id]&&data[a.id].done).length;
  return (
    <div>
      <div className="card welcome-hero">
        <div className="eyebrow">Livro Vol. 2 · Capítulos 2 e 3</div>
        <h1 style={{fontSize:'30px'}}>Do Problema ao Protótipo</h1>
        <p style={{maxWidth:'62ch'}}>Uma oficina guiada: cada artefato do livro vira um wizard, com a explicação do capítulo antes de cada campo e um resumo no final para você levar para a sala de aula. Seu progresso fica salvo neste navegador.</p>
        <span className="progress-pill">{doneCount} de {ARTIFACTS.length} artefatos concluídos</span>
      </div>
      <div className="chapter-label">Capítulo 2 — Construindo a Solução</div>
      <div className="home-grid">
        {cap2.map(a=>(
          <div className="art-card" key={a.id} onClick={()=>onOpen(a.id)}>
            <div className="n">{a.n}</div>
            <h4>{a.title}</h4>
            <p>{a.blurb}</p>
            {data[a.id]&&data[a.id].done && <span className="badge success" style={{marginTop:'8px'}}>Concluído</span>}
          </div>
        ))}
      </div>
      <div className="chapter-label">Capítulo 3 — Design System, Linguagem Visual e Prototipagem</div>
      <div className="home-grid">
        {cap3.map(a=>(
          <div className="art-card" key={a.id} onClick={()=>onOpen(a.id)}>
            <div className="n">{a.n}</div>
            <h4>{a.title}</h4>
            <p>{a.blurb}</p>
            {data[a.id]&&data[a.id].done && <span className="badge success" style={{marginTop:'8px'}}>Concluído</span>}
          </div>
        ))}
      </div>
      <BackupPanel data={data} setData={setData} />
    </div>
  );
}

function Sidebar({current,onOpen,onHome,data,theme,setTheme}){
  const cap2 = ARTIFACTS.filter(a=>a.chapter===2);
  const cap3 = ARTIFACTS.filter(a=>a.chapter===3);
  const doneCount = ARTIFACTS.filter(a=>data[a.id]&&data[a.id].done).length;
  function renderItem(a){
    const started = isArtifactStarted(data[a.id]);
    const done = data[a.id]&&data[a.id].done;
    return (
      <div key={a.id} className={"nav-item"+(current===a.id?' active':'')} onClick={()=>onOpen(a.id)}>
        <span className={"nav-dot"+(done?' done':(started?' progress':''))}></span>
        <span className="lbl">{a.title}</span>
      </div>
    );
  }
  return (
    <div className="sidebar">
      <div className="brand" onClick={onHome} style={{cursor:'pointer'}}>
        <div className="brand-mark">P</div>
        <div className="brand-text"><div className="k">Atelier de Produto</div><div className="t">Do Problema ao Protótipo</div></div>
      </div>
      <span className="progress-pill">{doneCount}/{ARTIFACTS.length} concluídos</span>
      <div className="chapter-label">Cap. 2 — Construindo a Solução</div>
      {cap2.map(renderItem)}
      <div className="chapter-label">Cap. 3 — Design System</div>
      {cap3.map(renderItem)}
      <div className="theme-toggle">
        <button className={theme==='light'?'on':''} onClick={()=>setTheme('light')}>Claro</button>
        <button className={theme==='dark'?'on':''} onClick={()=>setTheme('dark')}>Escuro</button>
        <button className={theme==='system'?'on':''} onClick={()=>setTheme('system')}>Sistema</button>
      </div>
    </div>
  );
}

function App(){
  const [data,setData] = useState(()=>loadStore());
  const [current,setCurrent] = useState(null);
  const [theme,setTheme] = useState(()=>{ try{ return localStorage.getItem('atelier-theme')||'system'; }catch(e){ return 'system'; } });

  useEffect(()=>{ saveStore(data); },[data]);
  useEffect(()=>{
    const root = document.documentElement;
    if(theme==='system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme',theme);
    try{ localStorage.setItem('atelier-theme',theme); }catch(e){}
  },[theme]);
  // migração: se o usuário já tinha escolhido uma ODS em Cores/Tipografia/Ícones antes dessa
  // ODS virar um valor único do projeto, aproveita a primeira que encontrar.
  useEffect(()=>{
    setData(prev=>{
      if(prev.projetoOds) return prev;
      const legacy = (prev.cores&&prev.cores.ods) || (prev.tipografia&&prev.tipografia.ods) || (prev.icones&&prev.icones.ods);
      return legacy ? {...prev, projetoOds:legacy} : prev;
    });
  }, []);

  const goHome = ()=>setCurrent(null);
  const ActiveComponent = current ? COMPONENT_MAP[current] : null;

  return (
    <div className="app">
      <Sidebar current={current} onOpen={setCurrent} onHome={goHome} data={data} theme={theme} setTheme={setTheme} />
      <div className="main">
        {ActiveComponent ? <ActiveComponent data={data} setData={setData} goHome={goHome} /> : <Home data={data} onOpen={setCurrent} setData={setData} />}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
