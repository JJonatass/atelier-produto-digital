/* =======================================================================
   2.3 — JORNADA DO USUÁRIO (com Mapa de Humor)
   ======================================================================= */
const EMOTION_LABELS = ['😣 Muito frustrado','🙁 Frustrado','😐 Neutro','🙂 Satisfeito','🤩 Encantado'];
function MoodChart({etapas}){
  const w=640,h=180,pad=40;
  const n = etapas.length || 1;
  const stepW = n>1 ? (w-2*pad)/(n-1) : 0;
  const pts = etapas.map((e,i)=>{
    const x = pad + i*stepW;
    const emo = e.emocao===undefined||e.emocao===null ? 2 : e.emocao;
    const y = pad + (h-2*pad) * (1 - emo/4);
    return {x,y,label:e.nome||('Etapa '+(i+1)),emo};
  });
  const path = pts.map((p,i)=> (i===0?'M':'L')+p.x+' '+p.y).join(' ');
  return (
    <svg viewBox={"0 0 "+w+" "+h} style={{width:'100%',height:'auto'}}>
      <line x1={pad} y1={pad+(h-2*pad)/2} x2={w-pad} y2={pad+(h-2*pad)/2} stroke="var(--line)" strokeDasharray="3,4" />
      {pts.length>1 && <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" />}
      {pts.map((p,i)=>(
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="var(--accent)" />
          <text x={p.x} y={h-12} textAnchor="middle" fontSize="11" fill="var(--ink-soft)" fontFamily="var(--font-body)">{p.label.length>14?p.label.slice(0,13)+'…':p.label}</text>
          <text x={p.x} y={p.y-12} textAnchor="middle" fontSize="14">{EMOTION_LABELS[p.emo].split(' ')[0]}</text>
        </g>
      ))}
    </svg>
  );
}
function ArtJornada({data,setData,goHome}){
  const defaults = {persona:'',objetivo:'',etapas:[
    {id:uid(),nome:'',acao:'',contato:'',emocao:2,backstage:'',oportunidade:''},
    {id:uid(),nome:'',acao:'',contato:'',emocao:2,backstage:'',oportunidade:''},
    {id:uid(),nome:'',acao:'',contato:'',emocao:2,backstage:'',oportunidade:''},
  ],step:0,done:false};
  const [s,patch] = useSlice(data,setData,'jornada',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='jornada');
  function updateEtapa(i,field,val){
    const next=[...s.etapas]; next[i]={...next[i],[field]:val}; patch({etapas:next});
  }
  function addEtapa(){ patch({etapas:[...s.etapas,{id:uid(),nome:'',acao:'',contato:'',emocao:2,backstage:'',oportunidade:''}]}); }
  function removeEtapa(i){ const next=s.etapas.filter((_,idx)=>idx!==i); patch({etapas:next.length?next:[{id:uid(),nome:'',acao:'',contato:'',emocao:2,backstage:'',oportunidade:''}]}); }

  const steps = [
    {label:'Persona e objetivo',
     book:<p>Defina a persona e o que ela deseja alcançar. Exemplo do livro (ODS 2): José, agricultor familiar → doar alimentos excedentes.</p>,
     render:()=>(<div><Field label="Persona" value={s.persona} onChange={v=>patch({persona:v})} placeholder="Ex.: Maria, estudante da periferia" /><Field label="Objetivo da jornada" value={s.objetivo} onChange={v=>patch({objetivo:v})} placeholder="Ex.: chegar à faculdade de forma confiável" /></div>)
    },
    {label:'Etapas, ações e pontos de contato',
     book:<p>Liste as etapas principais (início, meio, fim) e descreva o que o usuário faz e onde/como interage com o serviço (touchpoints) em cada uma.</p>,
     render:()=>(
      <div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>O que preencher em cada campo</h4>
          <p className="mini-note" style={{marginBottom:'6px'}}><strong>Ação:</strong> o que a persona faz de fato nessa etapa — o comportamento concreto e observável (o verbo da etapa: "pesquisa", "liga", "espera"), não o que ela pensa ou sente.</p>
          <p className="mini-note"><strong>Ponto de contato (touchpoint):</strong> onde e como acontece essa interação — a tela, o app, a notificação, o atendente, o objeto físico ou o lugar em que a persona encontra o serviço naquele momento.</p>
        </div>
        {s.etapas.map((e,i)=>(
          <div key={e.id} className="summary-block">
            <div className="toolbar-top"><strong className="mono">Etapa {i+1}</strong><button className="icon-btn" onClick={()=>removeEtapa(i)}>×</button></div>
            <Field label="Nome da etapa" value={e.nome} onChange={v=>updateEtapa(i,'nome',v)} placeholder="Ex.: Planejamento" />
            <Field label="Ação da persona" value={e.acao} onChange={v=>updateEtapa(i,'acao',v)} placeholder="Ex.: consulta transporte no app" hint="O comportamento observável da persona nessa etapa — o que ela efetivamente faz, não o que pensa ou sente." />
            <Field label="Ponto de contato (touchpoint)" value={e.contato} onChange={v=>updateEtapa(i,'contato',v)} placeholder="Ex.: app, notificação push, ponto físico" hint="O canal, tela, objeto ou pessoa por onde a interação acontece nesse momento." />
          </div>
        ))}
        <button className="add-row-btn" onClick={addEtapa}>+ adicionar etapa</button>
      </div>
     )
    },
    {label:'Emoções (mapa de humor)',
     book:<p>Marque como o usuário se sente em cada etapa. A curva de humor mostra vales (frustração) e picos (encantamento) — termômetro da experiência.</p>,
     render:()=>(
      <div>
        {s.etapas.map((e,i)=>(
          <div key={e.id} className="field">
            <label className="field-label">{e.nome||('Etapa '+(i+1))}</label>
            <div className="slider-field row">
              <input type="range" min="0" max="4" step="1" value={e.emocao} onChange={ev=>updateEtapa(i,'emocao',Number(ev.target.value))} />
              <div style={{fontSize:'13px',width:'140px'}}>{EMOTION_LABELS[e.emocao]}</div>
            </div>
          </div>
        ))}
      </div>
     )
    },
    {label:'Backstage e oportunidades',
     book:<p>Mapeie o que o sistema/equipe fazem nos bastidores para cada etapa funcionar, e aponte oportunidades para reduzir frustrações ou potencializar ganhos.</p>,
     render:()=>(
      <div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>O que preencher em cada campo</h4>
          <p className="mini-note" style={{marginBottom:'6px'}}><strong>Backstage:</strong> o que acontece "por trás das cortinas" para essa etapa funcionar — o que a equipe, o sistema ou um parceiro fazem, mesmo sem a persona perceber diretamente. Ex.: um servidor processando o pagamento, um entregador sendo notificado, um atendente consultando o histórico.</p>
          <p className="mini-note"><strong>Oportunidade de melhoria:</strong> um ponto fraco ou um potencial que essa etapa revela — algo que, se ajustado, reduziria a frustração ou aumentaria a satisfação da persona. É a semente para a ideação no próximo capítulo.</p>
        </div>
        {s.etapas.map((e,i)=>(
          <div key={e.id} className="grid-2">
            <Field label={(e.nome||'Etapa '+(i+1))+' — backstage'} type="textarea" rows={2} value={e.backstage} onChange={v=>updateEtapa(i,'backstage',v)} hint="O que acontece nos bastidores (equipe, sistema, parceiros) para essa etapa funcionar, mesmo sem a persona ver." />
            <Field label={(e.nome||'Etapa '+(i+1))+' — oportunidade de melhoria'} type="textarea" rows={2} value={e.oportunidade} onChange={v=>updateEtapa(i,'oportunidade',v)} hint="O que poderia melhorar nessa etapa — uma dor a resolver ou um momento a potencializar." />
          </div>
        ))}
      </div>
     )
    },
    {label:'Mapa de humor',
     book:<p>Observe a curva: se ela desce muito em etapas críticas, a solução precisa ser repensada. Onde estão os vales e os picos da sua jornada?</p>,
     render:()=>(<div><MoodChart etapas={s.etapas} /></div>)
    },
  ];

  if(showSummary){
    const txt = `JORNADA DO USUÁRIO\nPersona: ${s.persona||'—'}\nObjetivo: ${s.objetivo||'—'}\n\n`+s.etapas.map((e,i)=>`Etapa ${i+1} — ${e.nome||'(sem nome)'}\n  Ação: ${e.acao||'—'}\n  Ponto de contato: ${e.contato||'—'}\n  Emoção: ${EMOTION_LABELS[e.emocao]}\n  Backstage: ${e.backstage||'—'}\n  Oportunidade: ${e.oportunidade||'—'}`).join('\n\n');
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="summary-block"><h4>Persona</h4><p style={{color:'var(--ink)'}}>{s.persona||'—'} · objetivo: {s.objetivo||'—'}</p></div>
        <div className="journey-scroll"><div className="journey-row">
          {s.etapas.map((e,i)=>(
            <div className="journey-col" key={e.id}>
              <h5>{e.nome||'Etapa '+(i+1)}</h5>
              <p style={{fontSize:'12.5px',color:'var(--ink)'}}><strong>Ação:</strong> {e.acao||'—'}</p>
              <p style={{fontSize:'12.5px',color:'var(--ink)'}}><strong>Contato:</strong> {e.contato||'—'}</p>
              <p style={{fontSize:'12.5px'}}>{EMOTION_LABELS[e.emocao]}</p>
              <p style={{fontSize:'12.5px',color:'var(--ink)'}}><strong>Backstage:</strong> {e.backstage||'—'}</p>
              <p style={{fontSize:'12.5px',color:'var(--ink)'}}><strong>Oportunidade:</strong> {e.oportunidade||'—'}</p>
            </div>
          ))}
        </div></div>
        <div style={{marginTop:'14px'}}><MoodChart etapas={s.etapas} /></div>
        <div style={{marginTop:'10px'}}><CopyButton text={txt} /></div>
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   2.4 — MATRIZ CSD
   ======================================================================= */
function ArtCsd({data,setData,goHome}){
  const defaults = {contexto:'',certezas:['',''],suposicoes:['',''],duvidas:['',''],step:0,done:false};
  const [s,patch] = useSlice(data,setData,'csd',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='csd');
  const steps = [
    {label:'Problema e contexto',
     book:<p>A Matriz CSD organiza o conhecimento da equipe: o que já sabemos (certezas), o que achamos (suposições) e o que precisamos investigar (dúvidas). Comece definindo o problema e o contexto.</p>,
     render:()=> <Field type="textarea" label="Problema e contexto" value={s.contexto} onChange={v=>patch({contexto:v})} placeholder="Ex.: 40% dos alunos faltam às aulas regularmente por dificuldade de transporte." />
    },
    {label:'Certezas',
     book:<p>Informações validadas: fatos comprovados, baseados em dados ou experiência prática.</p>,
     render:()=> <ListField label="Certezas" items={s.certezas} onChange={v=>patch({certezas:v})} placeholder="Ex.: o transporte público é irregular e pouco confiável" />
    },
    {label:'Suposições',
     book:<p>O que a equipe acredita, mas ainda sem validação — viram hipóteses a serem testadas.</p>,
     render:()=> <ListField label="Suposições" items={s.suposicoes} onChange={v=>patch({suposicoes:v})} placeholder="Ex.: se oferecermos transporte gratuito, a evasão cairá" />
    },
    {label:'Dúvidas',
     book:<p>Perguntas abertas que não temos resposta no momento — viram perguntas de pesquisa ou entrevistas.</p>,
     render:()=> <ListField label="Dúvidas" items={s.duvidas} onChange={v=>patch({duvidas:v})} placeholder="Ex.: quais fatores além do transporte influenciam a evasão?" />
    },
  ];
  if(showSummary){
    const txt = `MATRIZ CSD\nContexto: ${s.contexto||'—'}\n\nCERTEZAS\n${s.certezas.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}\n\nSUPOSIÇÕES\n${s.suposicoes.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}\n\nDÚVIDAS\n${s.duvidas.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <p style={{color:'var(--ink)',marginBottom:'14px'}}>{s.contexto}</p>
        <div className="board">
          <div className="board-col"><h4>Certezas</h4>{s.certezas.filter(Boolean).map((i,idx)=><div className="board-item" key={idx}>{i}</div>)}</div>
          <div className="board-col"><h4>Suposições</h4>{s.suposicoes.filter(Boolean).map((i,idx)=><div className="board-item" key={idx}>{i}</div>)}</div>
          <div className="board-col"><h4>Dúvidas</h4>{s.duvidas.filter(Boolean).map((i,idx)=><div className="board-item" key={idx}>{i}</div>)}</div>
        </div>
        <div style={{marginTop:'12px'}}><CopyButton text={txt} /></div>
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}

/* =======================================================================
   2.5 — LEAN CANVAS (9 blocos)
   ======================================================================= */
const RECEITA_MODELOS = ['Assinatura (SaaS/recorrente)','Transacional (venda pontual/fee)','Marketplace (take rate)','Publicidade/Patrocínio','Licenciamento/White-label','Treinamentos/Consultoria/Certificação','Dados/Relatórios (Data-as-a-Service)','Doações/Grants/Editais','Hardware + Serviço','Freemium/Cross-subsidy'];
const MOAT_TIPOS = ['Efeito de rede','Custos de troca','Economias de escala/escopo','Dados proprietários (com LGPD)','Processo/cultura (Operating Moat)','Distribuição/acesso (Go-to-market)','Marca/confiança social','IP/regulação/credenciais','Velocidade de aprendizado'];
function MoscowSelect({value,onChange}){
  const opts=[['M','Must'],['S','Should'],['C','Could'],['W',"Won't"]];
  return <select value={value} onChange={e=>onChange(e.target.value)}>{opts.map(([v,l])=><option key={v} value={v}>{v} — {l}</option>)}</select>;
}
function ArtLeanCanvas({data,setData,goHome}){
  const defaults = {
    segmentos:['',''],
    jtbd:[{situacao:'',motivacao:'',resultado:''}],
    pvuTemplate:'', pvuTexto:'',
    pvuDetalhes:{categoria:'',alternativa:'',diferencial:'',prazoContexto:'',evidencia:'',mecanismo:'',metrica:''},
    rubrica:{segmento:0,dor:0,diferencial:0,mensuravel:0,prova:0,clareza:0},
    funcionalidades:[{id:uid(),nome:'',classificacao:'M',justificativa:''}],
    roadmap:{mvp:'',v1:'',v2:''},
    canais:[{id:uid(),nome:'',custo:5,alcance:5,segmentacao:5,controle:5,mensuravel:5,inclusivo:5}],
    receitaModelos:[], precificacao:'', receitaMix:'',
    custos:{cf:10000,cvu:60,preco:100},
    metricas:{nsm:'',drivers:['',''],guardrails:[''],estrato:''},
    vrio:{v:0,r:0,i:0,o:0}, moats:[], flywheel:['','','',''],
    viabilidade:{tecnica:3,economica:3,ambiental:3,social:3,escalabilidade:3,risco:3,tecnicaOk:null,economicaOk:null,socioOk:null},
    step:0, done:false
  };
  const [s,patch] = useSlice(data,setData,'leanCanvas',defaults);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='leanCanvas');

  const rubricaSum = Object.values(s.rubrica).reduce((a,b)=>a+b,0);
  const mcu = s.custos.preco - s.custos.cvu;
  const qEq = mcu>0 ? s.custos.cf/mcu : null;
  const mcPercent = s.custos.preco>0 ? mcu/s.custos.preco : 0;
  const rEq = mcPercent>0 ? s.custos.cf/mcPercent : null;
  const vrioSum = s.vrio.v+s.vrio.r+s.vrio.i+s.vrio.o;
  const vrioTravado = s.vrio.v===0||s.vrio.r===0||s.vrio.i===0||s.vrio.o===0;

  function setCanal(i,field,val){ const next=[...s.canais]; next[i]={...next[i],[field]:val}; patch({canais:next}); }
  function addCanal(){ patch({canais:[...s.canais,{id:uid(),nome:'',custo:5,alcance:5,segmentacao:5,controle:5,mensuravel:5,inclusivo:5}]}); }
  function removeCanal(i){ const next=s.canais.filter((_,idx)=>idx!==i); patch({canais:next.length?next:[{id:uid(),nome:'',custo:5,alcance:5,segmentacao:5,controle:5,mensuravel:5,inclusivo:5}]}); }
  function notaCanal(c){ return ((c.custo+c.alcance+c.segmentacao+c.controle+c.mensuravel+c.inclusivo)/6).toFixed(1); }

  function setFunc(i,field,val){ const next=[...s.funcionalidades]; next[i]={...next[i],[field]:val}; patch({funcionalidades:next}); }
  function addFunc(){ patch({funcionalidades:[...s.funcionalidades,{id:uid(),nome:'',classificacao:'M',justificativa:''}]}); }
  function removeFunc(i){ const next=s.funcionalidades.filter((_,idx)=>idx!==i); patch({funcionalidades:next.length?next:[{id:uid(),nome:'',classificacao:'M',justificativa:''}]}); }

  const PVU_TEMPLATES = {
    A:'Para [segmento], que [necessidade], nosso [produto/serviço] é um [categoria] que [benefício principal]. Diferente de [alternativa], [diferencial único].',
    B:'Entregamos [resultado mensurável] em [prazo/contexto], comprovado por [evidência], com [mecanismo/diferencial].',
    C:'Levamos [segmento] de [estado atual doloroso] para [estado desejado], através de [mecanismo], medido por [métrica].',
    D:'Quando [situação], ajudamos [segmento] a [job], para que [resultado], melhor que [alternativa], porque [diferencial].',
  };

  function preencherPvuAutomaticamente(template){
    const segsPreenchidos = (s.segmentos||[]).filter(Boolean);
    const seg = segsPreenchidos[0] || '[segmento]';
    const jt = (s.jtbd||[])[0] || {};
    const situacao = jt.situacao || '[situação]';
    const motivacao = jt.motivacao || '[necessidade]';
    const resultado = jt.resultado || '[resultado esperado]';
    const ideacao = data.ideacao || {};
    const solucao = ideacao.enunciadoSolucao || '[produto/serviço]';
    const problema = ideacao.enunciadoProblema || '[estado atual doloroso]';
    const d = s.pvuDetalhes || {};
    const categoria = d.categoria || '[categoria]';
    const alternativa = d.alternativa || '[alternativa]';
    const diferencial = d.diferencial || '[diferencial único]';
    const prazoContexto = d.prazoContexto || '[prazo/contexto]';
    const evidencia = d.evidencia || '[evidência]';
    const mecanismo = d.mecanismo || '[mecanismo]';
    const metrica = d.metrica || '[métrica]';
    const textos = {
      A: `Para ${seg}, que ${motivacao}, nosso ${solucao} é um ${categoria} que ${resultado}. Diferente de ${alternativa}, ${diferencial}.`,
      B: `Entregamos ${resultado} em ${prazoContexto}, comprovado por ${evidencia}, com ${mecanismo}.`,
      C: `Levamos ${seg} de ${problema} para ${resultado}, através de ${mecanismo}, medido por ${metrica}.`,
      D: `Quando ${situacao}, ajudamos ${seg} a ${motivacao}, para que ${resultado}, melhor que ${alternativa}, porque ${diferencial}.`,
    };
    return textos[template] || '';
  }

  const steps = [
    {label:'1. Segmento de Clientes',
     book:<p>Quem são as personas afetadas? Liste os grupos que sentem a dor — quem usa, quem se beneficia indiretamente e quem eventualmente patrocina o impacto.</p>,
     render:()=> <ListField label="Segmentos de clientes" items={s.segmentos} onChange={v=>patch({segmentos:v})} placeholder="Ex.: agricultores familiares que perdem alimentos por falta de escoamento" />
    },
    {label:'2. Proposta de Valor',
     book:<><p>A PVU é a promessa central de transformação — não é missão, slogan ou lista de funcionalidades. Comece pelo JTBD (Jobs To Be Done): "Quando [situação], eu quero [motivação], para [resultado esperado]". Preencha também os detalhes complementares abaixo — cada template usa alguns deles. Depois de escolher um template, use o botão "Preencher automaticamente" para gerar a PVU já com tudo isso encaixado.</p></>,
     render:()=>(
       <div>
         <label className="field-label">JTBD — três variações</label>
         {s.jtbd.map((j,i)=>(
           <div className="grid-3" key={i} style={{marginBottom:'6px'}}>
             <Field label={i===0?'Quando (situação)':undefined} value={j.situacao} onChange={v=>{const next=[...s.jtbd];next[i]={...j,situacao:v};patch({jtbd:next});}} />
             <Field label={i===0?'Eu quero (motivação)':undefined} value={j.motivacao} onChange={v=>{const next=[...s.jtbd];next[i]={...j,motivacao:v};patch({jtbd:next});}} />
             <Field label={i===0?'Para (resultado esperado)':undefined} value={j.resultado} onChange={v=>{const next=[...s.jtbd];next[i]={...j,resultado:v};patch({jtbd:next});}} />
           </div>
         ))}
         {s.jtbd.length<3 && <button className="add-row-btn" onClick={()=>patch({jtbd:[...s.jtbd,{situacao:'',motivacao:'',resultado:''}]})}>+ adicionar variação de JTBD</button>}
         <div style={{marginTop:'18px'}}>
           <label className="field-label">Detalhes complementares (cada template usa alguns)</label>
           <div className="grid-3">
             <Field label="Categoria do produto/serviço" value={s.pvuDetalhes.categoria} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,categoria:v}})} placeholder="Ex.: aplicativo de doações" />
             <Field label="Principal alternativa/concorrente" value={s.pvuDetalhes.alternativa} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,alternativa:v}})} placeholder="Ex.: doações informais por WhatsApp" />
             <Field label="Diferencial único" value={s.pvuDetalhes.diferencial} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,diferencial:v}})} placeholder="Ex.: rastreamento em tempo real" />
             <Field label="Prazo ou contexto de entrega" value={s.pvuDetalhes.prazoContexto} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,prazoContexto:v}})} placeholder="Ex.: em até 24h após o cadastro" />
             <Field label="Evidência/prova" value={s.pvuDetalhes.evidencia} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,evidencia:v}})} placeholder="Ex.: piloto com 3 feiras" />
             <Field label="Mecanismo (como funciona)" value={s.pvuDetalhes.mecanismo} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,mecanismo:v}})} placeholder="Ex.: geolocalização + notificações" />
           </div>
           <Field label="Métrica de sucesso" value={s.pvuDetalhes.metrica} onChange={v=>patch({pvuDetalhes:{...s.pvuDetalhes,metrica:v}})} placeholder="Ex.: kg de alimento redistribuído/mês" />
         </div>
         <div style={{marginTop:'18px'}}>
           <SelectField label="Escolha um template de PVU" value={s.pvuTemplate} onChange={v=>patch({pvuTemplate:v})} options={[{value:'A',label:'(A) Posição clássica'},{value:'B',label:'(B) Promessa + Prova'},{value:'C',label:"(C) Transformação de-para"},{value:'D',label:'(D) JTBD em ação'}]} />
           {s.pvuTemplate && <p className="field-hint" style={{marginTop:'-10px',marginBottom:'12px'}}>Modelo: <em>{PVU_TEMPLATES[s.pvuTemplate]}</em></p>}
           {s.pvuTemplate && (
             <div style={{marginBottom:'12px'}}>
               <button type="button" className="btn" onClick={()=>patch({pvuTexto: preencherPvuAutomaticamente(s.pvuTemplate)})}>Preencher automaticamente com meus dados</button>
               <p className="field-hint" style={{marginTop:'6px'}}>Usa o segmento, o JTBD, os detalhes complementares acima e o enunciado da solução (artefato de Ideação). O que ainda estiver em branco fica marcado entre colchetes para você completar.</p>
             </div>
           )}
           <Field type="textarea" label="Proposta de Valor Única (preenchida)" value={s.pvuTexto} onChange={v=>patch({pvuTexto:v})} placeholder="Preencha o template acima com a sua solução, ou use o botão de preenchimento automático." />
         </div>
         <div style={{marginTop:'18px'}}>
           <label className="field-label">Rubrica de qualidade da PVU (0 = fraco, 2 = forte)</label>
           <SliderField label="Especificidade do segmento" value={s.rubrica.segmento} onChange={v=>patch({rubrica:{...s.rubrica,segmento:v}})} />
           <SliderField label="Dor/transformação explícita" value={s.rubrica.dor} onChange={v=>patch({rubrica:{...s.rubrica,dor:v}})} />
           <SliderField label="Diferencial defensável" value={s.rubrica.diferencial} onChange={v=>patch({rubrica:{...s.rubrica,diferencial:v}})} />
           <SliderField label="Mensurabilidade" value={s.rubrica.mensuravel} onChange={v=>patch({rubrica:{...s.rubrica,mensuravel:v}})} />
           <SliderField label="Prova/evidência" value={s.rubrica.prova} onChange={v=>patch({rubrica:{...s.rubrica,prova:v}})} />
           <SliderField label="Clareza linguística" value={s.rubrica.clareza} onChange={v=>patch({rubrica:{...s.rubrica,clareza:v}})} />
           <span className={"badge "+(rubricaSum>=9?'success':'warning')}>{rubricaSum}/12 — {rubricaSum>=9?'publicável / validar':'refine e reteste'}</span>
         </div>
       </div>
     )
    },
    {label:'3. Solução / MVP',
     book:<><p>A solução é o conjunto mínimo de funcionalidades que materializa a proposta de valor. Classifique cada funcionalidade sonhada com MoSCoW e mantenha só 2-3 essenciais no MVP.</p></>,
     render:()=>(
      <div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>Como usar o MoSCoW</h4>
          <p className="mini-note" style={{marginBottom:'6px'}}>Para cada funcionalidade que você sonhou para o produto, pergunte "o que acontece se ela ficar de fora do lançamento?" e classifique com uma das 4 letras:</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>M — Must have (deve ter):</strong> sem isso o produto não entrega valor ou nem funciona. É inegociável no MVP.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>S — Should have (deveria ter):</strong> importante e dói ficar sem, mas o produto sobrevive no lançamento sem isso — entra logo na próxima versão.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>C — Could have (poderia ter):</strong> desejável, mas de baixo impacto se ficar de fora agora — só entra se sobrar tempo/recurso.</p>
          <p className="mini-note" style={{marginBottom:'6px'}}><strong>W — Won't have (não vai ter, por enquanto):</strong> uma decisão consciente de deixar fora desta versão — evita que o escopo infle sem critério.</p>
          <p className="mini-note">Sinal de alerta: se quase tudo virar "M", o corte não está sendo feito de verdade. Num MVP saudável, a maioria cai em S/C/W.</p>
        </div>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Funcionalidade</th><th style={{width:'130px'}}>Classificação</th><th>Justificativa</th><th></th></tr></thead>
          <tbody>
            {s.funcionalidades.map((f,i)=>(
              <tr key={f.id}>
                <td><input value={f.nome} onChange={e=>setFunc(i,'nome',e.target.value)} placeholder="Ex.: lembrete de medicação" /></td>
                <td><MoscowSelect value={f.classificacao} onChange={v=>setFunc(i,'classificacao',v)} /></td>
                <td><input value={f.justificativa} onChange={e=>setFunc(i,'justificativa',e.target.value)} placeholder="Sem isso não há valor percebido" /></td>
                <td><button className="icon-btn" onClick={()=>removeFunc(i)}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p className="mini-note" style={{marginTop:'6px'}}>Na justificativa, explique <em>por que</em> essa é a classificação certa — é isso que você vai defender se alguém perguntar "por que não incluímos essa funcionalidade agora?".</p>
        <button className="add-row-btn" onClick={addFunc}>+ adicionar funcionalidade</button>
        <div className="summary-block" style={{marginTop:'14px'}}>
          <h4>Corte radical — só o "Must Have"</h4>
          <p className="mini-note" style={{marginBottom:'8px'}}>Esta lista é o seu MVP de verdade: se algo aqui embaixo não for absolutamente essencial, volte na tabela e reclassifique como S, C ou W.</p>
          {s.funcionalidades.filter(f=>f.classificacao==='M'&&f.nome).map(f=><p key={f.id} style={{color:'var(--ink)'}}>• {f.nome}</p>)}
          {s.funcionalidades.filter(f=>f.classificacao==='M'&&f.nome).length===0 && <p className="mini-note">Marque funcionalidades como "M" para vê-las aqui.</p>}
        </div>
        <div className="grid-3" style={{marginTop:'8px'}}>
          <Field label="MVP (0–3 meses)" value={s.roadmap.mvp} onChange={v=>patch({roadmap:{...s.roadmap,mvp:v}})} hint="O que entra na primeira versão — normalmente os itens 'Must have'." />
          <Field label="Versão 1 (3–6 meses)" value={s.roadmap.v1} onChange={v=>patch({roadmap:{...s.roadmap,v1:v}})} hint="Os 'Should have' que ficaram de fora do MVP." />
          <Field label="Versão 2 (6–12 meses)" value={s.roadmap.v2} onChange={v=>patch({roadmap:{...s.roadmap,v2:v}})} hint="Os 'Could have' e o que hoje é 'Won't have' mas pode voltar a fazer sentido." />
        </div>
      </div>
     )
    },
    {label:'4. Canais',
     book:<><p>Canal bom = encontro + adesão + retorno. Avalie cada canal por Custo, Alcance, Segmentação, Controle, Mensurável e Inclusivo (0–10) — a nota final ajuda a escolher os 2-3 do "anel interno" (Bullseye).</p></>,
     render:()=>(
      <div>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Canal</th><th>Custo</th><th>Alcance</th><th>Segm.</th><th>Controle</th><th>Mensur.</th><th>Inclusivo</th><th>Nota</th><th></th></tr></thead>
          <tbody>
            {s.canais.map((c,i)=>(
              <tr key={c.id}>
                <td style={{minWidth:'140px'}}><input value={c.nome} onChange={e=>setCanal(i,'nome',e.target.value)} placeholder="Ex.: WhatsApp (lista)" /></td>
                {['custo','alcance','segmentacao','controle','mensuravel','inclusivo'].map(k=>(
                  <td key={k} style={{width:'64px'}}><input type="number" min="0" max="10" value={c[k]} onChange={e=>setCanal(i,k,Number(e.target.value))} /></td>
                ))}
                <td className="mono">{notaCanal(c)}</td>
                <td><button className="icon-btn" onClick={()=>removeCanal(i)}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <button className="add-row-btn" onClick={addCanal}>+ adicionar canal</button>
      </div>
     )
    },
    {label:'5. Fontes de Receita',
     book:<><p>Receita não é lucro. Em projetos de impacto, quem paga pode ser diferente de quem usa. Escolha 1-2 modelos e uma estratégia de precificação coerente.</p></>,
     render:()=>(
      <div>
        <CheckGroup label="Modelos de receita (marque os que fazem sentido)" options={RECEITA_MODELOS} values={s.receitaModelos} onChange={v=>patch({receitaModelos:v})} />
        <SelectField label="Estratégia de precificação" value={s.precificacao} onChange={v=>patch({precificacao:v})} options={['Baseada em valor','Baseada em custo (cost-plus)','Baseada no mercado (competitiva)','Diferenciada por segmento','Dinâmica/metrada']} />
        <Field type="textarea" label="Mix de receita (como se combinam)" value={s.receitaMix} onChange={v=>patch({receitaMix:v})} placeholder="Ex.: patrocínio de supermercados + editais anuais de inovação social" />
      </div>
     )
    },
    {label:'6. Estrutura de Custos',
     book:<><p>CT = CF + CVu×Q. Margem de contribuição unitária MCu = P − CVu. Ponto de equilíbrio Q* = CF / MCu. Receita de equilíbrio R* = CF / MC%.</p></>,
     render:()=>(
      <div>
        <div className="grid-3">
          <Field type="number" label="Custos Fixos (CF, R$/mês)" value={s.custos.cf} onChange={v=>patch({custos:{...s.custos,cf:Number(v)}})} />
          <Field type="number" label="Custo Variável Unitário (CVu, R$)" value={s.custos.cvu} onChange={v=>patch({custos:{...s.custos,cvu:Number(v)}})} />
          <Field type="number" label="Preço (P, R$)" value={s.custos.preco} onChange={v=>patch({custos:{...s.custos,preco:Number(v)}})} />
        </div>
        <div className="summary-block">
          <h4>Resultado</h4>
          <p style={{color:'var(--ink)'}}>Margem de contribuição unitária (MCu): <strong className="mono">R$ {mcu.toFixed(2)}</strong></p>
          <p style={{color:'var(--ink)'}}>Ponto de equilíbrio em quantidade (Q*): <strong className="mono">{qEq!==null ? Math.ceil(qEq)+' unidades/mês' : '— (MCu ≤ 0)'}</strong></p>
          <p style={{color:'var(--ink)'}}>Receita de equilíbrio (R*): <strong className="mono">{rEq!==null ? 'R$ '+rEq.toFixed(2) : '—'}</strong></p>
          <p className="mini-note">Sensibilidade ±20%: com CF +20% o Q* sobe para {mcu>0?Math.ceil((s.custos.cf*1.2)/mcu):'—'}; com CVu +20% o MCu cai para R$ {(s.custos.preco-s.custos.cvu*1.2).toFixed(2)}.</p>
        </div>
      </div>
     )
    },
    {label:'7. Métricas-Chave',
     book:<><p>North Star Metric (NSM): uma métrica que captura o valor central entregue. Some 2-4 drivers e 1-2 guardrails (contrapesos que evitam efeitos colaterais).</p></>,
     render:()=>(
      <div>
        <Field label="North Star Metric" value={s.metricas.nsm} onChange={v=>patch({metricas:{...s.metricas,nsm:v}})} placeholder="Ex.: kg de alimento redistribuídos/mês" />
        <ListField label="Drivers (2–4)" items={s.metricas.drivers} onChange={v=>patch({metricas:{...s.metricas,drivers:v}})} placeholder="Ex.: doadores ativos/semana" />
        <ListField label="Guardrails (1–2)" items={s.metricas.guardrails} onChange={v=>patch({metricas:{...s.metricas,guardrails:v}})} placeholder="Ex.: % de avarias ≤ 5%" />
        <Field label="Estrato inclusivo (recorte de análise)" value={s.metricas.estrato} onChange={v=>patch({metricas:{...s.metricas,estrato:v}})} placeholder="Ex.: por bairro e dia de feira" />
      </div>
     )
    },
    {label:'8. Vantagem Competitiva',
     book:<><p>VRIO: sua solução cria Valor, é Rara, é difícil/custosa de Imitar, e você está Organizado para explorá-la? Se alguma resposta for "não", o diferencial ainda não é vantagem.</p></>,
     render:()=>(
      <div>
        <SliderField label="Valor" value={s.vrio.v} onChange={v=>patch({vrio:{...s.vrio,v}})} />
        <SliderField label="Raridade" value={s.vrio.r} onChange={v=>patch({vrio:{...s.vrio,r:v}})} />
        <SliderField label="Imitabilidade (dificuldade de copiar)" value={s.vrio.i} onChange={v=>patch({vrio:{...s.vrio,i:v}})} />
        <SliderField label="Organização" value={s.vrio.o} onChange={v=>patch({vrio:{...s.vrio,o:v}})} />
        <span className={"badge "+(vrioTravado?'warning':'success')}>{vrioSum}/8 — {vrioTravado?'ainda não é vantagem defensável':'vantagem em construção'}</span>
        <div style={{marginTop:'16px'}}>
          <CheckGroup label="Tipo(s) de moat" options={MOAT_TIPOS} values={s.moats} onChange={v=>patch({moats:v})} />
          <ListField label="Flywheel (ciclo virtuoso, em 4 passos)" items={s.flywheel} onChange={v=>patch({flywheel:v})} placeholder="Ex.: mais parceiros → rotas mais densas → custo por kg ↓ → atrai novos parceiros" />
        </div>
      </div>
     )
    },
    {label:'9. Viabilidade',
     book:<><p>Viabilidade = "Podemos construir?" (técnica) + "Vale a pena financeiramente?" (econômica) + "Faz sentido para a sociedade/planeta?" (socioambiental). Só quando os três se sobrepõem há inovação viável.</p></>,
     render:()=>(
      <div>
        <div className="grid-3">
          <SliderField label="Técnica" min={0} max={5} value={s.viabilidade.tecnica} onChange={v=>patch({viabilidade:{...s.viabilidade,tecnica:v}})} />
          <SliderField label="Econômica" min={0} max={5} value={s.viabilidade.economica} onChange={v=>patch({viabilidade:{...s.viabilidade,economica:v}})} />
          <SliderField label="Ambiental" min={0} max={5} value={s.viabilidade.ambiental} onChange={v=>patch({viabilidade:{...s.viabilidade,ambiental:v}})} />
          <SliderField label="Social" min={0} max={5} value={s.viabilidade.social} onChange={v=>patch({viabilidade:{...s.viabilidade,social:v}})} />
          <SliderField label="Escalabilidade" min={0} max={5} value={s.viabilidade.escalabilidade} onChange={v=>patch({viabilidade:{...s.viabilidade,escalabilidade:v}})} />
          <SliderField label="Risco (quanto maior, mais arriscado)" min={0} max={5} value={s.viabilidade.risco} onChange={v=>patch({viabilidade:{...s.viabilidade,risco:v}})} />
        </div>
        <div style={{marginTop:'8px'}}>
          <YesNo label="Checklist 3E — está tecnicamente viável?" value={s.viabilidade.tecnicaOk} onChange={v=>patch({viabilidade:{...s.viabilidade,tecnicaOk:v}})} />
          <YesNo label="Está economicamente viável?" value={s.viabilidade.economicaOk} onChange={v=>patch({viabilidade:{...s.viabilidade,economicaOk:v}})} />
          <YesNo label="É desejável do ponto de vista socioambiental?" value={s.viabilidade.socioOk} onChange={v=>patch({viabilidade:{...s.viabilidade,socioOk:v}})} />
        </div>
      </div>
     )
    },
  ];

  if(showSummary){
    const txt = `LEAN CANVAS\n\n1. SEGMENTO DE CLIENTES\n${s.segmentos.filter(Boolean).map(i=>'- '+i).join('\n')}\n\n2. PROPOSTA DE VALOR\n${s.pvuTexto||'—'}\nDetalhes — categoria: ${s.pvuDetalhes.categoria||'—'} · alternativa: ${s.pvuDetalhes.alternativa||'—'} · diferencial: ${s.pvuDetalhes.diferencial||'—'} · prazo/contexto: ${s.pvuDetalhes.prazoContexto||'—'} · evidência: ${s.pvuDetalhes.evidencia||'—'} · mecanismo: ${s.pvuDetalhes.mecanismo||'—'} · métrica: ${s.pvuDetalhes.metrica||'—'}\n(rubrica: ${rubricaSum}/12)\n\n3. SOLUÇÃO / MVP\n${s.funcionalidades.filter(f=>f.nome).map(f=>'- ['+f.classificacao+'] '+f.nome).join('\n')}\nRoadmap — MVP: ${s.roadmap.mvp||'—'} | V1: ${s.roadmap.v1||'—'} | V2: ${s.roadmap.v2||'—'}\n\n4. CANAIS\n${s.canais.filter(c=>c.nome).map(c=>'- '+c.nome+' (nota '+notaCanal(c)+')').join('\n')}\n\n5. FONTES DE RECEITA\n${s.receitaModelos.join(', ')||'—'}\nPrecificação: ${s.precificacao||'—'}\n${s.receitaMix||''}\n\n6. ESTRUTURA DE CUSTOS\nCF: R$ ${s.custos.cf} · CVu: R$ ${s.custos.cvu} · Preço: R$ ${s.custos.preco}\nMCu: R$ ${mcu.toFixed(2)} · Q*: ${qEq!==null?Math.ceil(qEq):'—'} · R*: ${rEq!==null?'R$ '+rEq.toFixed(2):'—'}\n\n7. MÉTRICAS-CHAVE\nNSM: ${s.metricas.nsm||'—'}\nDrivers: ${s.metricas.drivers.filter(Boolean).join(', ')||'—'}\nGuardrails: ${s.metricas.guardrails.filter(Boolean).join(', ')||'—'}\n\n8. VANTAGEM COMPETITIVA\nVRIO: ${vrioSum}/8\nMoats: ${s.moats.join(', ')||'—'}\nFlywheel: ${s.flywheel.filter(Boolean).join(' → ')||'—'}\n\n9. VIABILIDADE\nTécnica ${s.viabilidade.tecnica}/5 · Econômica ${s.viabilidade.economica}/5 · Ambiental ${s.viabilidade.ambiental}/5 · Social ${s.viabilidade.social}/5 · Escalabilidade ${s.viabilidade.escalabilidade}/5 · Risco ${s.viabilidade.risco}/5`;
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
        <div className="grid-3">
          <div className="summary-block"><h4>1 · Segmentos</h4>{s.segmentos.filter(Boolean).map((i,x)=><p key={x} style={{color:'var(--ink)',fontSize:'13px'}}>{i}</p>)}</div>
          <div className="summary-block"><h4>2 · Proposta de Valor</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>{s.pvuTexto||'—'}</p></div>
          <div className="summary-block"><h4>3 · Solução / MVP</h4>{s.funcionalidades.filter(f=>f.nome&&f.classificacao==='M').map(f=><p key={f.id} style={{color:'var(--ink)',fontSize:'13px'}}>{f.nome}</p>)}</div>
          <div className="summary-block"><h4>4 · Canais</h4>{s.canais.filter(c=>c.nome).map(c=><p key={c.id} style={{color:'var(--ink)',fontSize:'13px'}}>{c.nome} · {notaCanal(c)}</p>)}</div>
          <div className="summary-block"><h4>5 · Receita</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>{s.receitaModelos.join(', ')||'—'}</p></div>
          <div className="summary-block"><h4>6 · Custos</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>MCu R$ {mcu.toFixed(2)} · Q* {qEq!==null?Math.ceil(qEq):'—'}</p></div>
          <div className="summary-block"><h4>7 · Métricas</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>{s.metricas.nsm||'—'}</p></div>
          <div className="summary-block"><h4>8 · Vantagem</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>VRIO {vrioSum}/8</p></div>
          <div className="summary-block"><h4>9 · Viabilidade</h4><p style={{color:'var(--ink)',fontSize:'13px'}}>T{s.viabilidade.tecnica} E{s.viabilidade.economica} A{s.viabilidade.ambiental} S{s.viabilidade.social}</p></div>
        </div>
        <div style={{marginTop:'12px'}}><CopyButton text={txt} /></div>
      </SummaryShell>
    );
  }
  return <Screen title={meta.title} n={meta.n} stepIndex={s.step} setStepIndex={i=>patch({step:i})} steps={steps} onDone={()=>setShowSummary(true)} />;
}
