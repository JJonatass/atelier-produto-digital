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
     teach:{
       why:"Antes de desenhar a jornada, é preciso saber de quem ela é. A jornada do usuário é uma narrativa visual ou descritiva que mostra, passo a passo, as ações, percepções e emoções de uma pessoa ao usar um produto ou serviço. Ela ajuda a ver o sistema pelos olhos do usuário e revela frustrações ocultas e oportunidades de inovação.",
       how:["Quem é a persona?","O que ela deseja alcançar? Esse é o objetivo que a jornada vai percorrer."],
       example:<><p><strong>ODS 2:</strong> José, agricultor familiar, quer doar alimentos excedentes.</p><p><strong>ODS 11:</strong> Maria, estudante da periferia, quer chegar à faculdade de forma confiável.</p></>
     },
     render:()=>(<div><Field label="Persona" value={s.persona} onChange={v=>patch({persona:v})} placeholder="Ex.: Maria, estudante da periferia" /><Field label="Objetivo da jornada" value={s.objetivo} onChange={v=>patch({objetivo:v})} placeholder="Ex.: chegar à faculdade de forma confiável" /></div>)
    },
    {label:'Etapas, ações e pontos de contato',
     book:<p>Liste as etapas principais (início, meio, fim) e descreva o que o usuário faz e onde/como interage com o serviço (touchpoints) em cada uma.</p>,
     teach:{
       why:"A jornada facilita a transição entre a ideação (ideias soltas) e a prototipação (fluxos e telas). Dividir a experiência em etapas permite ver onde a persona age e onde encontra o serviço.",
       how:["Divida a experiência em fases claras: início, meio e fim."],
       example:<><p><strong>ODS 2 (José):</strong></p><ul><li>Etapas: abrir app, cadastrar alimento, confirmar coleta, entrega.</li><li>Ações: José abre o aplicativo, preenche formulário, recebe notificação, entrega os alimentos.</li><li>Pontos de contato: smartphone, notificação push, ponto de coleta físico.</li></ul><p><strong>ODS 11 (Maria):</strong> Planejamento (consulta transporte, no app), Espera (vai ao ponto, ponto físico), Viagem (compartilha carona, no app) e Chegada (chega à faculdade, presencial).</p></>
     },
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
     teach:{
       why:"A jornada não deve mostrar só o que a persona faz, mas como ela se sente em cada etapa. O mapa de humor é uma linha que acompanha as emoções ao longo da jornada, registrando satisfação, neutralidade ou frustração. Ele mostra a experiência de forma mais empática, evidencia os momentos críticos (vales da curva), ajuda a identificar os momentos de encantamento (picos) e gera insumos para priorizar funcionalidades na prototipação.",
       how:["Marque como a persona se sente em cada etapa (por exemplo: animada, frustrada, aliviada)."],
       example:<><p><strong>ODS 2:</strong> José fica esperançoso na abertura, inseguro na confirmação e satisfeito na entrega.</p><p><strong>ODS 11:</strong> Maria fica ansiosa no planejamento, insegura na espera, aliviada na viagem e orgulhosa na chegada.</p></>
     },
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
     teach:{
       why:"As oportunidades de melhoria vêm de reduzir frustrações ou potencializar ganhos, e a própria jornada orienta a arquitetura da informação. Se a persona precisa consultar horários, deve existir uma tela de busca simples. Se ela tem ansiedade com atrasos, deve existir notificação em tempo real.",
       example:<><p><strong>ODS 2 (José):</strong></p><ul><li>Backstage: servidor valida login, ONG organiza rota, banco de dados registra coleta.</li><li>Oportunidades: incluir tutorial inicial, permitir cadastro por foto, dar feedback em tempo real.</li></ul><p><strong>ODS 11 (Maria):</strong></p><ul><li>Planejamento: o algoritmo calcula rotas; oportunidade de uma tela simples e rápida.</li><li>Espera: localização em tempo real; oportunidade de notificação de chegada.</li><li>Viagem: motorista confirmado; oportunidade de um botão SOS para segurança.</li><li>Chegada: registro automático; oportunidade de pontos de recompensa.</li></ul></>
     },
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
     teach:{
       why:"O mapa de humor é um termômetro da experiência: se a curva desce muito em etapas críticas, a solução precisa ser repensada.",
       how:["Localize os vales (frustração) e os picos (encantamento) da curva.","Use os vales para decidir o que repensar e os picos para saber o que reforçar."],
       example:"ODS 11 (Maria): o humor fica baixo no início, sobe durante a viagem e chega a um pico de satisfação na chegada."
     },
     render:()=>(<div><MoodChart etapas={s.etapas} /></div>)
    },
  ];

  if(showSummary){
    const txt = `JORNADA DO USUÁRIO\nPersona: ${s.persona||'—'}\nObjetivo: ${s.objetivo||'—'}\n\n`+s.etapas.map((e,i)=>`Etapa ${i+1} — ${e.nome||'(sem nome)'}\n  Ação: ${e.acao||'—'}\n  Ponto de contato: ${e.contato||'—'}\n  Emoção: ${EMOTION_LABELS[e.emocao]}\n  Backstage: ${e.backstage||'—'}\n  Oportunidade: ${e.oportunidade||'—'}`).join('\n\n');
    const et=s.etapas||[]; const nomeadas=et.filter(e=>e.nome&&e.nome.trim()); const baixas=et.filter(e=>e.emocao<=1); const semOpp=baixas.filter(e=>!(e.oportunidade&&e.oportunidade.trim())); const checks=[
      {level:(s.persona&&s.objetivo)?'ok':'warn', text:(s.persona&&s.objetivo)?'Persona e objetivo definidos.':'Defina a persona e o objetivo: a jornada é sempre a de uma pessoa específica tentando alcançar algo.'},
      {level:nomeadas.length>=3?'ok':'warn', text:'Etapas nomeadas: '+nomeadas.length+'. O livro divide a experiência em início, meio e fim (mínimo de 3 fases).'},
      {level:et.every(e=>e.acao&&e.contato)?'ok':'warn', text:et.every(e=>e.acao&&e.contato)?'Toda etapa tem ação e ponto de contato.':'Há etapas sem ação ou sem ponto de contato (o que a persona faz e onde encontra o serviço).'},
      {level:baixas.length===0?'info':(semOpp.length===0?'ok':'warn'), text:baixas.length===0?'Nenhuma etapa com emoção negativa. Confira se o mapa de humor reflete a realidade: frustrações ocultas são onde estão as oportunidades de inovação.':(semOpp.length===0?'Toda etapa com frustração tem uma oportunidade registrada.':'Etapa(s) com emoção negativa sem oportunidade: '+semOpp.map(e=>e.nome||'(sem nome)').join(', ')+'. Se a curva desce em etapas críticas, a solução precisa ser repensada.')},
    ];
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} checks={checks} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
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
     teach:{
       why:"Numa equipe, certezas, palpites e dúvidas costumam se misturar. A Matriz CSD (Certezas, Suposições e Dúvidas) torna explícito o que já sabemos, o que achamos e o que ainda precisamos investigar. O livro compara a CSD a limpar a mesa antes de cozinhar: só quando sabemos o que temos, o que achamos que temos e o que falta, conseguimos preparar algo consistente.",
       how:["Defina o problema e o contexto em que ele acontece."],
       example:<><p><strong>ODS 4:</strong> evasão escolar em escolas públicas.</p><p><strong>ODS 11:</strong> trabalhadores de periferias gastam mais de 2 horas por dia em deslocamento.</p></>
     },
     render:()=> <Field type="textarea" label="Problema e contexto" value={s.contexto} onChange={v=>patch({contexto:v})} placeholder="Ex.: 40% dos alunos faltam às aulas regularmente por dificuldade de transporte." />
    },
    {label:'Certezas',
     book:<p>Informações validadas: fatos comprovados, baseados em dados ou experiência prática.</p>,
     teach:{
       why:"Certezas são fatos comprovados, baseados em dados ou experiência prática. Elas baseiam decisões de curto prazo.",
       how:["Liste só informações validadas: pesquisas confiáveis, estatísticas, dados ou experiência prática."],
       example:<><p><strong>ODS 4:</strong> “40% dos alunos faltam às aulas regularmente por dificuldade de transporte.”</p><p><strong>ODS 11:</strong> “O transporte público é irregular e pouco confiável.” e “IBGE aponta que 37% gastam mais de 1h30 em deslocamentos.”</p></>,
       mistakes:["Tratar suposições como fatos: o livro alerta que, sem separar a CSD, isso acontece com frequência."]
     },
     render:()=> <ListField label="Certezas" items={s.certezas} onChange={v=>patch({certezas:v})} placeholder="Ex.: o transporte público é irregular e pouco confiável" />
    },
    {label:'Suposições',
     book:<p>O que a equipe acredita, mas ainda sem validação — viram hipóteses a serem testadas.</p>,
     teach:{
       why:"Suposições são o que a equipe acredita, mas ainda não validou. Na matriz, elas viram hipóteses a serem testadas.",
       how:["Anote o que a equipe acredita ser verdade, mesmo sem comprovação."],
       example:<><p><strong>ODS 4:</strong> “Se oferecermos transporte gratuito, a evasão cairá.”</p><p><strong>ODS 11:</strong> “As pessoas aceitariam usar caronas comunitárias com vizinhos.” e “As empresas apoiariam financeiramente esse transporte comunitário.”</p><p><strong>ODS 6:</strong> “Se houvesse um sistema de denúncia digital, as autoridades agiriam mais rápido.”</p></>
     },
     render:()=> <ListField label="Suposições" items={s.suposicoes} onChange={v=>patch({suposicoes:v})} placeholder="Ex.: se oferecermos transporte gratuito, a evasão cairá" />
    },
    {label:'Dúvidas',
     book:<p>Perguntas abertas que não temos resposta no momento — viram perguntas de pesquisa ou entrevistas.</p>,
     teach:{
       why:"Dúvidas são perguntas abertas que precisam de investigação. Na matriz, elas viram perguntas de pesquisa ou entrevistas. Registrá-las gera clareza sobre as incertezas e ajuda a priorizar a pesquisa: testar as hipóteses e investigar as dúvidas primeiro.",
       how:["Escreva em forma de pergunta aquilo para o que a equipe ainda não tem resposta.","Use a matriz como guia de ação: suposições viram hipóteses a testar, dúvidas viram perguntas de pesquisa e certezas baseiam decisões de curto prazo."],
       example:<><p><strong>ODS 4:</strong> “Quais fatores além do transporte influenciam a evasão?”</p><p><strong>ODS 11:</strong> “Como garantir segurança nas caronas?” e “Qual seria o modelo de pagamento sustentável?”</p><p><strong>ODS 6:</strong> “Como engajar moradores que não usam smartphones?”</p></>,
       mistakes:["Deixar dúvidas sem registro: o livro cita isso como um dos problemas que a CSD resolve."]
     },
     render:()=> <ListField label="Dúvidas" items={s.duvidas} onChange={v=>patch({duvidas:v})} placeholder="Ex.: quais fatores além do transporte influenciam a evasão?" />
    },
  ];
  if(showSummary){
    const txt = `MATRIZ CSD\nContexto: ${s.contexto||'—'}\n\nCERTEZAS\n${s.certezas.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}\n\nSUPOSIÇÕES\n${s.suposicoes.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}\n\nDÚVIDAS\n${s.duvidas.filter(Boolean).map(i=>'- '+i).join('\n')||'—'}`;
    const fl=a=>(a||[]).filter(x=>x&&String(x).trim()); const duv=fl(s.duvidas); const semPergunta=duv.filter(d=>d.indexOf('?')<0); const checks=[
      {level:fl(s.certezas).length?'ok':'warn', text:fl(s.certezas).length?fl(s.certezas).length+' certeza(s). Devem ser fatos comprovados, com base em dados ou experiência prática.':'Sem certezas registradas: o que a equipe realmente sabe, com base em dados ou experiência prática?'},
      {level:fl(s.suposicoes).length?'ok':'warn', text:fl(s.suposicoes).length?fl(s.suposicoes).length+' suposição(ões) — cada uma vira uma hipótese a testar.':'Sem suposições registradas: o que a equipe acredita, mas ainda não validou?'},
      {level:duv.length?(semPergunta.length?'warn':'ok'):'warn', text:duv.length?(semPergunta.length?'Dúvidas devem ser perguntas abertas; reescreva em forma de pergunta: '+semPergunta.join(' | '):duv.length+' dúvida(s) escritas como pergunta — viram perguntas de pesquisa ou entrevistas.'):'Sem dúvidas registradas: deixar dúvidas sem registro é um dos problemas que a CSD resolve.'},
      {level:'info', text:'Próximo passo racional: teste as suposições primeiro e investigue as dúvidas; só as certezas devem sustentar decisões de curto prazo.'},
    ];
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} checks={checks} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
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
    vrio:{v:0,r:0,i:0,o:0}, vrioEv:{v:'',r:'',i:'',o:''}, experimentoCanais:'', moats:[], flywheel:['','','',''],
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
     teach:{
       why:"O Lean Canvas, criado por Ash Maurya, é uma versão adaptada do Business Model Canvas. Ele condensa numa página os elementos essenciais que transformam uma ideia em um modelo inicial de negócio ou impacto social, e ajuda a sair do achismo e estruturar hipóteses claras para serem testadas. Tudo começa por saber quem sente a dor.",
       how:["Identifique a persona principal.","Escolha um segmento prioritário no início, em vez de falar com todo mundo."],
       example:<><p><strong>ODS 2 (Fome Zero), personas afetadas:</strong></p><ul><li>Agricultores familiares que perdem alimentos por falta de escoamento.</li><li>Famílias de baixa renda que sofrem com insegurança alimentar.</li><li>ONGs e instituições sociais que distribuem alimentos, mas têm dificuldades logísticas.</li></ul></>,
       mistakes:["Todos os públicos: escolha um segmento prioritário no início (armadilha listada na Proposta de Valor)."]
     },
     render:()=> <ListField label="Segmentos de clientes" items={s.segmentos} onChange={v=>patch({segmentos:v})} placeholder="Ex.: agricultores familiares que perdem alimentos por falta de escoamento" />
    },
    {label:'2. Proposta de Valor',
     book:<><p>A PVU é a promessa central de transformação — não é missão, slogan ou lista de funcionalidades. Comece pelo JTBD (Jobs To Be Done): "Quando [situação], eu quero [motivação], para [resultado esperado]". Preencha também os detalhes complementares abaixo — cada template usa alguns deles. Depois de escolher um template, use o botão "Preencher automaticamente" para gerar a PVU já com tudo isso encaixado.</p></>,
     teach:{
       why:"A PVU é a promessa central de transformação que a solução entrega a um segmento específico, em um contexto específico, de modo preferível às alternativas. Ela não é missão ou visão, slogan criativo, lista de funcionalidades (que são meios, não fins) nem o pitch inteiro.",
       how:["Use o JTBD para achar o trabalho real do usuário: Quando [situação], eu quero [motivação], para [resultado esperado].","Rascunhe várias PVUs com os templates (o livro sugere 5 a 7) e mantenha 2 finalistas.","Verifique com sim ou não: nomeia quem se beneficia? Explicita a mudança gerada? Mostra como é melhor que as alternativas? Traz prova ou caminho de prova? Se alguma resposta for não, refaça.","Alinhe a PVU a métricas de resultado, não de vaidade (por exemplo: kg de alimento redistribuído, evasão escolar reduzida)."],
       example:<><p><strong>ODS 2 (Fome Zero):</strong> “Para feirantes com excedentes e ONGs locais, nosso sistema comunitário redistribui alimentos em bom estado em até 12h, reduzindo ≥40% do desperdício por feira, com rotas solidárias validadas por ONGs — diferente de apps genéricos, operamos 100% offline-first com WhatsApp nas áreas sem 4G.”</p><p><strong>ODS 4 (Educação):</strong> “Permite que estudantes estudem offline 100% do conteúdo base e sincronizem quando houver Wi-Fi da escola, elevando a taxa de conclusão ≥25% em 3 meses, com trilhas curtas e acompanhamento de tutores.”</p><p><strong>ODS 11 (Mobilidade):</strong> “Coordena caronas comunitárias por bairro em horários de pico, reduzindo tempo de espera em 30% e custo por trajeto em 20%, com parcerias de associações locais e mecanismos de segurança verificados.”</p></>,
       mistakes:["Vaguidão (“plataforma inovadora e escalável…”): diga o que muda.","Feature-centrismo (“tem IA, blockchain…”): pergunte qual resultado isso cria.","Todos os públicos: escolha um segmento prioritário no início.","Sem prova: inclua evidência (número, parceiro, estudo, piloto).","Jargões: teste com leigos; se tropeçarem, reescreva."]
     },
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
     teach:{
       why:"A solução é o conjunto mínimo de funcionalidades que materializa a proposta de valor e permite validar se a ideia atende às necessidades dos clientes. Ela é o mínimo testável e o ponto de partida para aprender com o usuário. Não é um plano detalhado de desenvolvimento, um protótipo completo com todas as features desejadas, nem uma promessa genérica (“um app que resolve tudo”). Construa para aprender rápido, não para escalar rápido.",
       example:<><p><strong>ODS 3 (Saúde e Bem-Estar):</strong> o problema é que idosos esquecem de tomar medicamentos. A PVU é “garantir adesão ao tratamento com lembretes simples e confiáveis”.</p><ul><li>MVP: lembrete automático de horário de remédio, botão “já tomei” para registro e relatório básico para o cuidador.</li><li>Fica para depois: integração com farmácia, gamificação, IA de recomendações.</li></ul><p><strong>Outros MVPs do livro:</strong></p><ul><li>ODS 2: app simples para cadastro de alimentos e comunicação via WhatsApp.</li><li>ODS 4: caderno digital offline com sincronização quando houver internet.</li><li>ODS 6: sensor comunitário conectado a painel de qualidade da água.</li><li>ODS 11: planilha compartilhada de caronas solidárias organizada por bairro.</li></ul></>,
       mistakes:["Overengineering: gastar meses em features que não validam nada.","Confundir MVP com “produto barato”: MVP é sobre aprendizado, não economia pura.","Ignorar feedback inicial: insistir em funcionalidades que ninguém usa.","Prometer escalabilidade antes da hora: primeiro valide se há valor."]
     },
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
     book:<><p>Canal bom = encontro + adesão + retorno. Se só gera clique bonito, não é canal, é vaidade. Avalie cada canal e use a nota para escolher os do "anel interno" (processo Bullseye).</p></>,
     teach:{
       why:"Canais são os meios pelos quais o público toma conhecimento, acessa e usa a solução, e pelos quais você mantém relacionamento contínuo. Há duas dimensões: distribuição (como o usuário obtém a solução, por exemplo app store, WhatsApp, parceria com ONG, escola, prefeitura) e comunicação (como ele sabe e lembra da solução, por exemplo rádio comunitária, cartaz, e-mail, redes sociais). Não existe canal coringa: ele precisa combinar com o problema (onde a dor acontece), o segmento (onde o público já está) e a solução (qual o menor atrito para experimentar). Regra prática: se for preciso ensinar um novo hábito de mídia para ser encontrado, o canal está errado para o MVP.",
       example:<><p><strong>ODS 2 (feiras e famílias):</strong></p><ul><li>Tração: WhatsApp (feirantes), rádio do bairro.</li><li>Apoio: cartaz com QR nas bancas e CRAS.</li><li>Retenção: grupo por bairro e lembretes nos dias de feira.</li></ul><p><strong>ODS 4 (escolas periféricas):</strong></p><ul><li>Tração: reuniões de pais, bilhetes na agenda, WhatsApp da turma.</li><li>Apoio: cartaz na escola, portal da secretaria.</li><li>Retenção: lembretes de estudo offline.</li></ul></>,
       mistakes:["“Só online” ou “só offline”: faça um mix.","Falar com “todo mundo”: comece por persona e bairro ou turma.","Mudar tudo ao mesmo tempo: faça um teste por vez.","Não registrar a origem: use UTM simples ou uma planilha por canal.","Desrespeitar o opt-out: isso mata a confiança e quebra a LGPD."]
     },
     render:()=>(
      <div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>Como escolher canais (processo Bullseye)</h4>
          <p className="mini-note" style={{marginBottom:'6px'}}>O livro sugere 5 passos — a tabela abaixo é o Passo 2 (a matriz). Faça nesta ordem:</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>1. Long list:</strong> antes de pontuar, liste todos os canais possíveis, sem censura — pense em onde seu público já está, física e digitalmente.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>2. Filtro (a tabela abaixo):</strong> pontue cada canal em 6 critérios — quanto maior a nota, melhor o canal nesse aspecto.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>3. Top 3 ("anel interno"):</strong> dos canais com melhor nota, escolha 2 canais de tração (foco principal) + 1 de apoio.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>4. Experimentos curtos (2-4 semanas):</strong> teste um canal por vez, com uma métrica de sucesso definida — mudar tudo ao mesmo tempo impede saber o que funcionou.</p>
          <p className="mini-note"><strong>5. Dobrar a aposta:</strong> escale o canal vencedor e pause o resto.</p>
        </div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>O que significa cada critério</h4>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>Custo:</strong> quanto mais barato de operar, maior a nota.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>Alcance:</strong> quantas pessoas do seu público esse canal atinge.</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>Segmentação:</strong> o quanto o canal permite falar só com quem interessa (evita "falar com todo mundo").</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>Controle:</strong> o quanto você controla mensagem, frequência e distribuição (canal próprio tende a pontuar mais que orgânico).</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>Mensurável:</strong> o quanto dá para medir se funcionou (ex.: registrar origem com UTM/planilha por canal).</p>
          <p className="mini-note"><strong>Inclusivo:</strong> o quanto o canal funciona também para quem tem menos acesso digital (ex.: rádio comunitária, cartaz, bilhete impresso).</p>
        </div>
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
        <p className="mini-note" style={{marginTop:'6px'}}>Escala de 0 a 10 por critério (o livro sugere 1-5; aqui é só mais granular) — o que importa é comparar canais entre si, não o valor absoluto. Mix online + offline com propósito: evite "só online" ou "só offline".</p>
        <button className="add-row-btn" onClick={addCanal}>+ adicionar canal</button>
        <div style={{marginTop:'16px'}}><Field type="textarea" label="Experimento curto dos canais de tração (2–4 semanas) e métrica de sucesso" value={s.experimentoCanais||''} onChange={v=>patch({experimentoCanais:v})} placeholder="Ex.: WhatsApp dos feirantes — 1 teste por canal; sucesso = 20 doadores cadastrados em 3 semanas" hint="Passo 4 do Bullseye: um teste por canal, cada um com uma métrica de sucesso definida. Sem métrica, o canal não pode ser julgado." /></div>
      </div>
     )
    },
    {label:'5. Fontes de Receita',
     book:<><p>Receita não é lucro. Em projetos de impacto, quem paga pode ser diferente de quem usa. Escolha 1-2 modelos e uma estratégia de precificação coerente.</p></>,
     teach:{
       why:"Receita são as formas pelas quais o projeto gera entradas financeiras recorrentes ou pontuais para sustentar a operação. Não é lucro (resultado após os custos) nem dinheiro eventual sem previsibilidade. Em projetos de impacto, a receita pode vir de quem usa, de quem se beneficia indiretamente ou de quem patrocina o impacto (pagador diferente de usuário). Sustentabilidade financeira é receita previsível alinhada ao impacto.",
       how:["Responda: quem paga (usuário, empresa, governo, ONG, patrocinador)? Quem captura o valor econômico? Quão frequente é o uso (repetição favorece assinatura ou cobrança por uso)? Há externalidades positivas (ODS) que patrocínio ou edital possam cobrir?","Pontue os modelos de 1 a 5 em aderência ao segmento, facilidade de cobrança, previsibilidade, escalabilidade e ética/ODS, e priorize o Top-2.","Na precificação, o livro recomenda a baseada em valor: o preço se ancora no resultado, por exemplo R$ por kg redistribuído."],
       example:<><p><strong>ODS 2:</strong> patrocínio supermercadista (cota mensal), take rate simbólico por rota logística e editais anuais. Valor-âncora: R$/kg redistribuído e redução de custo de descarte.</p><p><strong>ODS 4:</strong> licenças para redes de ensino (B2G), assinatura para escola privada e treinamento docente. Valor-âncora: redução de evasão, aumento de proficiência, horas-aula efetivas.</p><p><strong>ODS 11:</strong> comissão baixa por carona solidária, patrocínio corporativo local e seguro comunitário em grupo. Valor-âncora: tempo economizado, redução de custo por trajeto, segurança.</p></>
     },
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
     teach:{
       why:"Receita mantém a ideia viva; custos certos mantêm a ideia de pé. Custos são os gastos necessários para conceber, operar e evoluir a solução. Não são uma lista de compras aleatória nem uma estimativa solta: o livro pede um modelo coerente que conecte custos, operação, métricas e viabilidade.",
       how:["Inventário: liste os custos potenciais por categoria (pessoal, tech, operação, captação, compliance).","Classificação: marque cada custo como fixo (CF, não varia com o volume no curto prazo) ou variável (CV, cresce por unidade ou uso), e como direto ou indireto.","Driverização: vincule cada custo a um driver.","Unitarização: calcule o custo variável unitário (CVu), por exemplo R$/kg redistribuído ou R$/turma/mês.","Projeção: estime o volume (Q) por mês, para 12 meses.","Break-even: calcule o ponto de equilíbrio e as margens.","Sensibilidade: simule ±20% em preço, volume e CVu e veja o que mais pesa no resultado."],
       example:<><p><strong>Cálculo do livro:</strong> se o preço (P) é R$ 100 e o custo variável por unidade (CVu) é R$ 60, cada venda contribui com R$ 40 (MCu) para cobrir os custos fixos e gerar lucro. Com custos fixos (CF) de R$ 10.000, é preciso vender 250 unidades para empatar (Q*). Com margem de contribuição percentual de 40% e CF de R$ 10.000, a receita de equilíbrio (R*) é R$ 25.000.</p><p><strong>ODS 2:</strong> os drivers são rotas/semana, km/rota, kg/rota e doadores ativos. O CVu reúne combustível, mensagens, avarias e embalagens. O CF reúne coordenação, cloud base e aluguel do ponto de apoio.</p></>
     },
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
     teach:{
       why:"Métricas-chave são os indicadores prioritários que monitoram se a solução entrega valor ao público e à operação. Regra de ouro: se não ajuda a decidir, não é métrica-chave. Uma boa métrica não mede popularidade, mede transformação (outcomes e impacto), com traço de causalidade.",
       how:["Monte a árvore de métricas: a North Star Metric no topo, depois 2 a 4 drivers e 1 a 2 guardrails.","Escreva uma mini teoria de mudança: se fizermos X com Y, veremos Z em T meses.","Dê a cada métrica uma definição operacional: fórmula, unidade, fonte, janela e responsável.","Confira o checklist SMART+I: específica, mensurável, acionável, relevante (ligada à PVU e ao ODS), temporal e inclusiva (observa recortes como bairro, escola, gênero e acessibilidade)."],
       example:<><p><strong>ODS 2 (doação de alimentos):</strong></p><ul><li>NSM: kg de alimento redistribuídos/mês.</li><li>Drivers: doadores ativos/semana, taxa de comparecimento na rota, kg/rota.</li><li>Guardrails: % de avarias até 5%, SLA de entrega até 12h.</li><li>Estrato inclusivo: por bairro e dia de feira.</li></ul><p><strong>ODS 4 (plataforma de cursos online):</strong></p><ul><li>NSM: horas de aula assistidas/mês.</li><li>Drivers: alunos ativos/semana, taxa de conclusão de curso, média de aulas vistas por aluno.</li><li>Guardrails: taxa de reembolso até 3%, avaliação média dos cursos de pelo menos 4,2/5.</li><li>Estrato inclusivo: por faixa etária e tipo de dispositivo.</li></ul><p><strong>ODS 3 (telemedicina):</strong> NSM de consultas médicas realizadas/mês, com guardrails de tempo médio de espera até 10 min e cancelamento até 8%.</p></>,
       mistakes:["Lei de Goodhart: quando uma métrica vira meta, deixa de ser boa métrica. Use guardrails e múltiplas fontes.","Vaidade: downloads, likes e visitas sem ação relevante não são valor.","Antes-depois ingênuo: evite atribuir causalidade sem controle; prefira pilotos A/B, grupos de comparação ou diferença-em-diferenças.","Métrica confusa: nomes ambíguos; padronize um glossário.","Atraso na leitura: defina cadência e responsáveis (sem dono, a métrica morre)."]
     },
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
     teach:{
       why:"Vantagem competitiva é um mecanismo defensável que permite entregar mais valor, com mais eficiência ou maior fidelidade do que as alternativas, e sustentá-lo no tempo. O livro usa a ideia de moat: uma barreira defensiva sustentável, algo difícil de copiar ou superar pelos concorrentes no médio e longo prazo.",
       example:<><p><strong>ODS 2 (redistribuição local):</strong></p><ul><li>Moats: acordos com feiras e ONGs (acesso), SOP de triagem (qualidade), dados de previsibilidade por bairro.</li><li>Métricas: R$/kg em queda, avarias até 5%, parceiros renovados em pelo menos 80%.</li><li>Flywheel: mais parceiros, rotas mais densas, custo menor, mais parceiros.</li></ul><p><strong>ODS 4 (offline-first):</strong> moats de distribuição com secretarias, trilhas com tutoria local e dados de adesão offline. Defesa: custo marginal baixo por aluno e histórico pedagógico individual.</p></>,
       mistakes:["Confundir com uma feature temporária: qualquer um implementa.","Confundir com slogan, estética de marca isolada ou “somos os primeiros” (ser o primeiro raramente é defesa real).","Apostar somente em preço baixo: guerra de preços é frágil."]
     },
     render:()=>(
      <div>
        <div className="summary-block" style={{marginBottom:'16px'}}>
          <h4>Como pontuar cada letra (0 = não, 2 = sim, com folga)</h4>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>V — Valor:</strong> a solução reduz uma dor ou gera um ganho significativo para o usuário?</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>R — Raridade:</strong> poucos concorrentes têm isso (dados, acesso, know-how, confiança local)?</p>
          <p className="mini-note" style={{marginBottom:'4px'}}><strong>I — Imitabilidade:</strong> copiar isso custa caro ou demora (tempo, contratos, cultura)?</p>
          <p className="mini-note" style={{marginBottom:'6px'}}><strong>O — Organização:</strong> você tem processos, pessoas, métricas e governança para de fato extrair esse valor?</p>
          <p className="mini-note">Checagem rápida do livro: se a resposta a qualquer uma das 4 perguntas acima for "não", esse "diferencial" ainda não é uma vantagem defensável — é só uma característica.</p>
        </div>
        <SliderField label="Valor" value={s.vrio.v} onChange={v=>patch({vrio:{...s.vrio,v}})} />
        <Field label="Evidência da nota de Valor" value={(s.vrioEv||{}).v||''} onChange={x=>patch({vrioEv:{...(s.vrioEv||{}),v:x}})} placeholder="Ex.: 8 de 10 entrevistados relataram perder alimento por falta de rota de doação" hint="Justifique a nota com um fato, dado ou documento. Nota sem evidência é só opinião." />
        <SliderField label="Raridade" value={s.vrio.r} onChange={v=>patch({vrio:{...s.vrio,r:v}})} />
        <Field label="Evidência da nota de Raridade" value={(s.vrioEv||{}).r||''} onChange={x=>patch({vrioEv:{...(s.vrioEv||{}),r:x}})} placeholder="Ex.: acordo com 3 feiras do bairro que concorrentes ainda não têm" hint="Justifique a nota com um fato, dado ou documento. Nota sem evidência é só opinião." />
        <SliderField label="Imitabilidade (dificuldade de copiar)" value={s.vrio.i} onChange={v=>patch({vrio:{...s.vrio,i:v}})} />
        <Field label="Evidência da nota de Imitabilidade" value={(s.vrioEv||{}).i||''} onChange={x=>patch({vrioEv:{...(s.vrioEv||{}),i:x}})} placeholder="Ex.: contrato de exclusividade de 12 meses + base de dados própria" hint="Justifique a nota com um fato, dado ou documento. Nota sem evidência é só opinião." />
        <SliderField label="Organização" value={s.vrio.o} onChange={v=>patch({vrio:{...s.vrio,o:v}})} />
        <Field label="Evidência da nota de Organização" value={(s.vrioEv||{}).o||''} onChange={x=>patch({vrioEv:{...(s.vrioEv||{}),o:x}})} placeholder="Ex.: SOP de triagem de 1 página e responsável por rota definido" hint="Justifique a nota com um fato, dado ou documento. Nota sem evidência é só opinião." />
        <span className={"badge "+(vrioTravado?'warning':'success')}>{vrioSum}/8 — {vrioTravado?'ainda não é vantagem defensável':'vantagem em construção'}</span>
        <div style={{marginTop:'16px'}}>
          <p className="mini-note" style={{marginBottom:'8px'}}><strong>Moat</strong> = barreira defensiva sustentável: o que torna sua solução difícil de copiar ou superar no médio/longo prazo. Marque os que se aplicam ao seu caso.</p>
          <CheckGroup label="Tipo(s) de moat" options={MOAT_TIPOS} values={s.moats} onChange={v=>patch({moats:v})} />
          <ListField label="Flywheel (ciclo virtuoso, em 4 passos)" items={s.flywheel} onChange={v=>patch({flywheel:v})} placeholder="Ex.: mais parceiros → rotas mais densas → custo por kg ↓ → atrai novos parceiros" hint='Um flywheel encadeia 4 passos em ciclo, cada um alimentando o próximo — como no exemplo do livro: "mais parceiros → mais doações → rotas mais densas → custo por kg ↓ → atração de novos parceiros".' />
        </div>
      </div>
     )
    },
    {label:'9. Viabilidade',
     book:<><p>Viabilidade = "Podemos construir?" (técnica) + "Vale a pena financeiramente?" (econômica) + "Faz sentido para a sociedade/planeta?" (socioambiental). Só quando os três se sobrepõem há inovação viável.</p></>,
     teach:{
       why:"Viabilidade é o grau em que a solução é factível (técnica), sustentável (econômica) e desejável para a sociedade e o ambiente (socioambiental). Ela evita investir anos em algo inviável de implementar ou manter, dá credibilidade frente a parceiros, investidores e órgãos públicos e garante alinhamento com ODS e ESG. Só quando os três círculos (desejabilidade, viabilidade econômica e exequibilidade técnica) se sobrepõem temos inovação viável.",
       how:["Técnica: avalie capacidades e recursos (equipe, know-how), infraestrutura, integrações, escalabilidade (o MVP funciona em piloto? cresce sem colapsar?) e riscos técnicos.","Econômica: avalie custos, receitas, unit economics (CAC, LTV, CVu, break-even), ROI e payback, dependência de grants e sensibilidade (pessimista, base, otimista).","Socioambiental: avalie o impacto positivo direto, o impacto negativo evitado, a inclusão, o alinhamento com ODS/ESG e os riscos socioambientais."],
       example:<><p><strong>ODS 2:</strong> tecnicamente, app mobile e WhatsApp API são viáveis, mas a logística depende de uma frota mínima. Economicamente, o custo é de cerca de R$ 0,60/kg e a receita via patrocínio cobre R$ 0,70/kg. Socioambientalmente, o impacto líquido é positivo; o risco é o descarte inadequado de sobras, mitigado com compostagem comunitária.</p><p><strong>ODS 4:</strong> tablets offline-first são factíveis (risco: manutenção física). O CAPEX inicial é alto e o OPEX por aluno é baixo; o licenciamento cobre os custos. Atenção ao descarte de tablets: reciclagem formal.</p><p><strong>ODS 11:</strong> app leve com pontos fixos é viável (risco: adesão crítica mínima). Break-even com 120 viagens/dia. Risco de segurança de passageiros, mitigado com verificação comunitária.</p></>,
       mistakes:["Superestimar a viabilidade porque só olhou para a técnica.","Ignorar custos indiretos e regulatórios (LGPD, seguros, manutenção).","Subestimar a capilaridade logística (ODS 2, 11).","Prometer impacto sem medir externalidades (ODS 13).","Confundir piloto pontual com viabilidade de escala."]
     },
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
    const txt = `LEAN CANVAS\n\n1. SEGMENTO DE CLIENTES\n${s.segmentos.filter(Boolean).map(i=>'- '+i).join('\n')}\n\n2. PROPOSTA DE VALOR\n${s.pvuTexto||'—'}\nDetalhes — categoria: ${s.pvuDetalhes.categoria||'—'} · alternativa: ${s.pvuDetalhes.alternativa||'—'} · diferencial: ${s.pvuDetalhes.diferencial||'—'} · prazo/contexto: ${s.pvuDetalhes.prazoContexto||'—'} · evidência: ${s.pvuDetalhes.evidencia||'—'} · mecanismo: ${s.pvuDetalhes.mecanismo||'—'} · métrica: ${s.pvuDetalhes.metrica||'—'}\n(rubrica: ${rubricaSum}/12)\n\n3. SOLUÇÃO / MVP\n${s.funcionalidades.filter(f=>f.nome).map(f=>'- ['+f.classificacao+'] '+f.nome).join('\n')}\nRoadmap — MVP: ${s.roadmap.mvp||'—'} | V1: ${s.roadmap.v1||'—'} | V2: ${s.roadmap.v2||'—'}\n\n4. CANAIS\n${s.canais.filter(c=>c.nome).map(c=>'- '+c.nome+' (nota '+notaCanal(c)+')').join('\n')}\nExperimento e métrica: ${s.experimentoCanais||'—'}\n\n5. FONTES DE RECEITA\n${s.receitaModelos.join(', ')||'—'}\nPrecificação: ${s.precificacao||'—'}\n${s.receitaMix||''}\n\n6. ESTRUTURA DE CUSTOS\nCF: R$ ${s.custos.cf} · CVu: R$ ${s.custos.cvu} · Preço: R$ ${s.custos.preco}\nMCu: R$ ${mcu.toFixed(2)} · Q*: ${qEq!==null?Math.ceil(qEq):'—'} · R*: ${rEq!==null?'R$ '+rEq.toFixed(2):'—'}\n\n7. MÉTRICAS-CHAVE\nNSM: ${s.metricas.nsm||'—'}\nDrivers: ${s.metricas.drivers.filter(Boolean).join(', ')||'—'}\nGuardrails: ${s.metricas.guardrails.filter(Boolean).join(', ')||'—'}\n\n8. VANTAGEM COMPETITIVA\nVRIO: ${vrioSum}/8 (V: ${(s.vrioEv||{}).v||'sem evidência'} | R: ${(s.vrioEv||{}).r||'sem evidência'} | I: ${(s.vrioEv||{}).i||'sem evidência'} | O: ${(s.vrioEv||{}).o||'sem evidência'})\nMoats: ${s.moats.join(', ')||'—'}\nFlywheel: ${s.flywheel.filter(Boolean).join(' → ')||'—'}\n\n9. VIABILIDADE\nTécnica ${s.viabilidade.tecnica}/5 · Econômica ${s.viabilidade.economica}/5 · Ambiental ${s.viabilidade.ambiental}/5 · Social ${s.viabilidade.social}/5 · Escalabilidade ${s.viabilidade.escalabilidade}/5 · Risco ${s.viabilidade.risco}/5`;
    const fl=a=>(a||[]).filter(x=>x&&String(x).trim()); const mCount=(s.funcionalidades||[]).filter(f=>f.nome&&f.classificacao==='M').length; const nCanais=(s.canais||[]).filter(c=>c.nome).length; const drv=fl(s.metricas.drivers).length; const gr=fl(s.metricas.guardrails).length; const v3=s.viabilidade||{}; const v3vals=[v3.tecnicaOk,v3.economicaOk,v3.socioOk]; const opps=((data.jornada&&data.jornada.etapas)||[]).map(e=>e.oportunidade).filter(o=>o&&o.trim()); const duvs=fl(data.csd&&data.csd.duvidas); const checks=[
      {level:fl(s.segmentos).length?'ok':'warn', text:fl(s.segmentos).length?fl(s.segmentos).length+' segmento(s) de clientes definido(s).':'Defina o segmento de clientes: a PVU, os canais e as métricas dependem dele.'},
      {level:s.pvuTexto?(rubricaSum>=9?'ok':'warn'):'warn', text:!s.pvuTexto?'Proposta de Valor ainda não escrita.':('Rubrica da PVU: '+rubricaSum+'/12. '+(rubricaSum>=9?'≥ 9/12 = publicável/validar.':'≤ 8 = refine e reteste antes de seguir.'))},
      {level:mCount===0?'warn':(mCount<=3?'ok':'warn'), text:mCount===0?'Nenhuma funcionalidade marcada como Must have: o que é essencial para validar a proposta?':(mCount<=3?mCount+' funcionalidade(s) Must have.':mCount+' Must haves: o corte radical do livro deixa apenas 3 como M. Reclassifique o excedente em S, C ou W.')},
      {level:nCanais>=3?'ok':'warn', text:nCanais>=3?nCanais+' canais avaliados (o livro escolhe 3 para o anel interno: 2 de tração + 1 de apoio).':'Apenas '+nCanais+' canal(is) avaliado(s): faça uma long list e escolha o anel interno de 3 canais (2 de tração + 1 de apoio).'},
      {level:mcu>0?'ok':'warn', text:mcu>0?'Margem de contribuição unitária positiva (R$ '+mcu.toFixed(2)+').':'Margem de contribuição unitária ≤ 0: com esse preço e custo variável não há ponto de equilíbrio.'},
      {level:(s.metricas.nsm&&drv>=2&&drv<=4&&gr>=1&&gr<=2)?'ok':'warn', text:'Árvore de métricas: NSM '+(s.metricas.nsm?'definida':'vazia')+', '+drv+' driver(s) (ideal 2–4), '+gr+' guardrail(s) (ideal 1–2).'},
      {level:(['v','r','i','o'].some(k=>s.vrio[k]>0&&!((s.vrioEv||{})[k]||'').trim()))?'warn':'ok', text:(['v','r','i','o'].some(k=>s.vrio[k]>0&&!((s.vrioEv||{})[k]||'').trim()))?'Há letras do VRIO com nota acima de 0 e sem evidência: nota sem fato, dado ou documento é só opinião.':'Todas as notas do VRIO acima de 0 têm evidência registrada.'},
      {level:(s.experimentoCanais||'').trim()?'ok':'warn', text:(s.experimentoCanais||'').trim()?'Experimento de 2–4 semanas com métrica de sucesso definido para os canais de tração.':'Falta o experimento curto (2–4 semanas) com métrica de sucesso para os canais de tração (passo 4 do Bullseye).'},
      {level:vrioTravado?'warn':'ok', text:vrioTravado?'VRIO com pelo menos um "não" (nota 0): o livro diz que, nesse caso, o diferencial ainda não é vantagem.':'VRIO sem nenhum "não": vantagem em construção.'},
      {level:(s.moats.length&&fl(s.flywheel).length>=4)?'ok':'warn', text:(s.moats.length?s.moats.length+' tipo(s) de moat':'Nenhum tipo de moat marcado')+' e flywheel com '+fl(s.flywheel).length+'/4 passos.'},
      {level:v3vals.some(v=>v===false)?'warn':(v3vals.every(v=>v===true)?'ok':'info'), text:v3vals.some(v=>v===false)?'Viabilidade 3E com ao menos um "não": só quando técnica, econômica e socioambiental se sobrepõem há inovação viável.':(v3vals.every(v=>v===true)?'Checklist 3E todo positivo.':'Checklist 3E ainda não respondido por completo.')},
      {level:(data.ideacao&&data.ideacao.enunciadoSolucao)?'ok':'info', text:(data.ideacao&&data.ideacao.enunciadoSolucao)?'Enunciado da solução (Ideação): "'+data.ideacao.enunciadoSolucao+'" — a PVU e o MVP entregam exatamente isso?':'Conexão: faltou o enunciado da solução no artefato de Ideação (2.2).'},
      {level:'info', text:opps.length?'Conexão com a Jornada — oportunidades que você mapeou: '+opps.join('; ')+'. Cada uma aparece no MVP, no roadmap ou foi descartada de propósito?':'Conexão: a Jornada (2.3) ainda não tem oportunidades registradas para alimentar o MVP.'},
      {level:'info', text:duvs.length?'Conexão com a CSD — dúvidas ainda em aberto: '+duvs.join(' | ')+'. Algum experimento ou métrica do canvas responde a elas?':'Conexão: a Matriz CSD (2.4) não tem dúvidas registradas.'},
    ];
    return (
      <SummaryShell title={meta.title} n={meta.n} icon={meta.icon} id={meta.id} checks={checks} summaryText={txt} onEdit={()=>setShowSummary(false)} onHome={()=>{patch({done:true});goHome();}}>
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
