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
     teach:{"why":"Tokens de cor guardam cores com nomes que indicam função, não só aparência. Se a identidade visual mudar, as funções permanecem: o que é “erro” continua sendo “erro”, só muda o tom.","how":["Dê a cada cor um nome de função: color-primary, color-secondary, color-success, color-error, color-warning, color-surface, color-text-primary, color-text-secondary.", "A base do livro é 1 cor primária, 1 secundária e 3 neutras (preto, cinza, branco)."],"example":"Em vez de dizer “esse botão é azul #00467F, com texto branco #FFFFFF”, diz-se: “esse botão usa color-primary de fundo e color-on-primary no texto”.","mistakes":["Nomear pela aparência (verde_escuro, azul_logo, cinza_escuro) em vez da função (color-primary, color-surface, color-error)."]},
     render:()=>(<div className="swatch-row" style={{flexWrap:'wrap'}}>{[['primary',cores.primaria],['secondary',cores.secundaria],['surface',cores.neutras[0]],['text',cores.neutras[2]],['success',cores.estados.success],['error',cores.estados.error]].map(([k,v])=>(<div key={k} style={{textAlign:'center'}}><div className="swatch" style={{background:v}}></div><div className="mini-note mono">{k}</div></div>))}</div>)
    },
    {label:'Confirme a tipografia',
     book:<p>Tokens de tipografia guardam fonte, tamanho e peso — puxados do artefato "Tipografia".</p>,
     teach:{"why":"Tokens de tipografia guardam fonte, tamanho, peso e espaçamento entre linhas. Assim a tipografia vira configuração, não chute.","how":["Corpo do texto: font-family-base, font-size-body, line-height-body.", "Título: font-family-heading, font-size-h1, font-weight-bold.", "Defina uma fonte para títulos e outra para o corpo (passo 1 do exemplo de uso do livro)."],"example":"No livro: font-family-base = Open Sans; font-family-heading = Montserrat; font-size-body = 16px; font-size-h1 = 24px; line-height-body = 1.5; font-weight-regular = 400; font-weight-bold = 700.","mistakes":["Descrever o estilo por uma medida solta (“título grande 24px”) em vez de usar o token font-size-h1, font-size-h2 ou font-size-body."]},
     render:()=>(<p style={{color:'var(--ink)'}} className="mono">font-family-heading: {tipo.fonteTitulos} · font-family-base: {tipo.fonteCorpo} · font-size-h1: {tipo.escala.h1}px · font-size-body: {tipo.escala.body}px</p>)
    },
    {label:'Confirme o espaçamento',
     book:<p>Tokens de espaçamento evitam interface "torta" — puxados do artefato "Layout e Espaçamento".</p>,
     teach:{"why":"Em vez de inventar um valor novo a cada componente, você escolhe um token da escala. Isso evita a interface “torta”.","how":["Crie uma escala de espaçamentos e se obrigue a usar só esses valores.", "Margens, paddings e gaps passam a referenciar os tokens."],"example":"Escala do livro: spacing-xxs = 4px, spacing-xs = 8px, spacing-sm = 12px, spacing-md = 16px, spacing-lg = 24px, spacing-xl = 32px. Um botão usa padding: var(--spacing-md).","mistakes":["Valores soltos como 13px num lugar, 17px em outro e 11px ali."]},
     render:()=>(<p style={{color:'var(--ink)'}} className="mono">spacing-xxs:{layout.escala.xxs}px spacing-xs:{layout.escala.xs}px spacing-sm:{layout.escala.sm}px spacing-md:{layout.escala.md}px spacing-lg:{layout.escala.lg}px spacing-xl:{layout.escala.xl}px</p>)
    },
    {label:'Raio e sombra',
     book:<p>Tokens de raio e sombra usam a mesma lógica dos tokens de espaço: radius-sm, radius-md, radius-lg… shadow-sm, shadow-md, shadow-lg.</p>,
     teach:{"why":"Raio, borda e sombra usam a mesma lógica dos tokens de espaço: poucos níveis nomeados, em vez de um valor novo a cada componente.","how":["Escolha um nível de raio: radius-none (0px), radius-sm (4px), radius-md (8px) ou radius-lg (16px).", "Escolha um nível de sombra: shadow-sm (sombra leve), shadow-md ou shadow-lg."],"example":"No CSS do livro, o botão fica com border-radius: var(--radius-md), onde --radius-md vale 8px."},
     render:()=>(<div className="grid-2"><SelectField label="Raio padrão" value={s.radius} onChange={v=>patch({radius:v})} options={[{value:'none',label:'radius-none (0px)'},{value:'sm',label:'radius-sm (4px)'},{value:'md',label:'radius-md (8px)'},{value:'lg',label:'radius-lg (16px)'}]} /><SelectField label="Sombra padrão" value={s.shadow} onChange={v=>patch({shadow:v})} options={[{value:'none',label:'shadow-none'},{value:'sm',label:'shadow-sm'},{value:'md',label:'shadow-md'},{value:'lg',label:'shadow-lg'}]} /></div>)
    },
    {label:'JSON de tokens',
     book:<p>Coloque tudo em um lugar só: design e código passam a usar os mesmos nomes.</p>,
     teach:{"why":"Com tudo em um lugar só, mudar color-primary ou color-text-secondary atualiza o resto do sistema (manutenção fácil). Sem tokens, você caça e substitui valores à mão e corre o risco de quebrar algo antigo. Também dá consistência visual (todos puxam da mesma fonte de verdade) e liga design e dev, que usam os mesmos nomes.","how":["Reúna os tokens em um arquivo .json, em um CSS com variáveis ou em um arquivo de configuração (ex.: tokens.js).", "Depois, design e dev usam esses nomes, e não mais valores soltos."],"example":"No livro, o JSON agrupa colors (primary, secondary, error, textPrimary, textSecondary, surface), spacing (xs 4px, sm 8px, md 16px, lg 24px), typography (fontFamilyBase, fontFamilyHeading, fontSizeBody, fontSizeH1) e radius (sm 4px, md 8px).","mistakes":["Deixar cores e medidas espalhadas como número/hex pelo projeto: o livro chama isso de “Ctrl+F da morte”."]},
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
     teach:{"why":"Conforme o produto cresce, cada tela parece feita por uma pessoa diferente (botões variados, cores levemente diferentes, fontes trocadas, ícones incoerentes). O Design System é o conjunto organizado das decisões de design e funciona como uma “biblioteca viva”, atualizada e versionada no Figma e no código.","how":["Os fundamentos (Foundations) são: cores, tipografia, espaçamentos, raio de borda e sombras, ícones e estilo de ilustração.", "Esses fundamentos viram variáveis nomeadas: os tokens de design."],"example":"App ODS 2 (Fome Zero): color-primary = verde (alimento, vida, sustentabilidade); color-secondary = amarelo (energia, atenção); color-success = verde mais escuro (doação concluída); color-error = vermelho (erro no cadastro).","mistakes":["Desenhar telas isoladas, sem decisões compartilhadas, o que confunde o usuário e aumenta o retrabalho da equipe."]},
     render:()=>(<div className="summary-block"><p style={{color:'var(--ink)'}} className="mono">Cor primária: {cores.primaria||'—'} · Fonte títulos: {tipo.fonteTitulos||'—'} · Fonte corpo: {tipo.fonteCorpo||'—'} · Spacing-md: {(layout.escala&&layout.escala.md)||'—'}px</p><p className="mini-note">Se algo estiver faltando, volte aos artefatos de Cores, Tipografia e Layout.</p></div>)
    },
    {label:'Componentes',
     book:<p>Descreva os componentes reutilizáveis (botões, inputs, cards, modais) com seus estados (hover, erro, desabilitado), tamanhos e exemplos de uso.</p>,
     teach:{"why":"Sem Design System, cada tela é quase um projeto do zero. Com ele, a equipe reutiliza peças prontas e só adapta o conteúdo. O sistema diz: “Este é o botão primário. Use-o sempre nesta situação.”","how":["Liste os componentes: botões, inputs, selects, cards, modais, barras de navegação, tabelas, alerts etc.", "Descreva cada um com estados (hover, erro, desabilitado), tamanhos, exemplos de uso e de não uso."],"example":"App ODS 2: ButtonPrimary → “Doar agora”, “Confirmar cadastro”; CardDonation → alimento, validade, quantidade e status; BannerWarning → alerta sobre alimentos próximos da validade.","mistakes":["Ter cinco tipos de botão “principal” diferentes.", "Inventar um novo tipo de botão quando uma tela precisa de uma ação principal: use o ButtonPrimary já definido, com os mesmos tokens."]},
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
     teach:{"why":"Padrões são conjuntos de componentes trabalhando juntos em tarefas comuns. Evitam que cada pessoa invente um fluxo diferente para a mesma tarefa.","how":["Exemplos de padrões no livro: tela de login, checkout de doação, tela de busca e filtros, lista + detalhes.", "O livro também inclui nos padrões de interação como funcionam erros, avisos, estados vazios e carregamento."],"example":"Padrão de fluxo do App ODS 2: tela de lista de doações → seleciona item → tela de detalhes → botão “Confirmar retirada”.","mistakes":["Cada pessoa criar um fluxo próprio para uma tarefa comum."]},
     render:()=> <ListField label="Padrões de tela/fluxo" items={s.padroes} onChange={v=>patch({padroes:v})} placeholder="Ex.: tela de login" />
    },
    {label:'Guia de Estilo × UI Kit × Design System',
     book:<p>Guia de Estilo é um documento estático (cores, fontes, logo). UI Kit é a biblioteca de componentes prontos. Design System une os dois com princípios, código e documentação viva.</p>,
     teach:{"why":"Na prática, esses três artefatos costumam se confundir. Vale separá-los.","how":["Guia de Estilo: documento estático com cores, fontes, logotipo e espaçamentos; muito usado como manual de marca.", "UI Kit: biblioteca prática de interface (botões, formulários, ícones, menus, cards), usada em Figma, Sketch etc. para montar telas rapidamente.", "Design System: une guia de estilo + UI Kit + princípios + boas práticas + código; é vivo e evolui com o produto."],"example":"ODS 11 (Mobilidade urbana). Guia de estilo: cor azul, fonte Montserrat, ícones de transporte. UI Kit: botões “Planejar rota” e “Solicitar carona”. Design System: tudo isso + regras de acessibilidade + componentes reutilizáveis em código.","mistakes":["Confundir os três. O livro avisa que eles se misturam na prática; o Design System é o que une guia de estilo, UI Kit, princípios, boas práticas e código."]},
     render:()=>(<div><YesNo label="Você já tem um guia de estilo (documento de marca)?" value={s.temGuia} onChange={v=>patch({temGuia:v})} /><YesNo label="Você já tem um UI Kit (componentes prontos no Figma)?" value={s.temKit} onChange={v=>patch({temKit:v})} /><YesNo label="Isso já forma um Design System vivo, versionado?" value={s.temSistema} onChange={v=>patch({temSistema:v})} /></div>)
    },
    {label:'Documentação (Do/Don\'t)',
     book:<p>Documente boas práticas e anti-exemplos — o que fazer e o que evitar para cada componente ou padrão.</p>,
     teach:{"why":"A documentação reúne explicações, exemplos, boas práticas e “anti-exemplos” (Do/Don't), para que o sistema seja usado do jeito certo por quem não o desenhou.","how":["Para cada componente ou padrão, registre o que fazer e o que evitar.", "Inclua as diretrizes de acessibilidade: contraste, foco, tamanho mínimo, rótulos de ícones.", "Inclua também o tom de voz e a escrita (microcopy das mensagens)."],"example":"Exemplo do livro (App ODS 2): se uma nova tela precisa de uma ação principal, não se inventa um novo tipo de botão; usa-se o ButtonPrimary já definido, com os mesmos tokens de cor, fonte e espaçamento."},
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
     teach:{"why":"Prototipar é ensaiar o produto antes do palco oficial: materializar hipóteses para que sejam experimentadas, criticadas e melhoradas. É muito mais barato mudar uma tela no protótipo do que refazer uma funcionalidade pronta.","how":["Volte ao fluxo de telas construído no Cap. 2.", "Confirme qual é a tarefa-chave que você quer prototipar."],"example":"Tarefas-chave do livro: “cadastrar uma doação de alimento”, “encontrar uma vaga de carona”, “concluir uma atividade de estudo”.","mistakes":["Querer prototipar todo o sistema: não é necessário."]},
     render:()=> <Field label="Tarefa-chave a prototipar" value={s.tarefaChave} onChange={v=>patch({tarefaChave:v})} placeholder="Ex.: cadastrar uma doação de alimento" />
    },
    {label:'Selecionar telas do protótipo',
     book:<p>Escolha de 4 a 8 telas do seu Fluxo de Telas que formam o caminho da tarefa-chave.</p>,
     teach:{"why":"Um protótipo focado no caminho da ação mais importante já permite visualizar o fluxo completo e testar a usabilidade.","how":["Escolha de 4 a 8 telas do Fluxo de Telas que formam o caminho da tarefa-chave (no exercício do livro, de 4 a 6).", "Sempre que possível, monte cada tela com componentes reutilizáveis (botão padrão, card de item, barra de navegação) e com os tokens de spacing e grid."],"example":"Caminho típico do livro: login → tela inicial → tela da ação → confirmação.","mistakes":["Incluir telas demais: não é preciso prototipar todo o sistema."]},
     render:()=> telasDisponiveis.length ? <CheckGroup label="Telas (do artefato Fluxo de Telas)" options={telasDisponiveis} values={s.telasSelecionadas} onChange={v=>patch({telasSelecionadas:v})} /> : <p className="mini-note">Nenhuma tela cadastrada ainda — preencha o artefato "Fluxo de Telas" primeiro.</p>
    },
    {label:'Interações de navegação',
     book:<p>Nomeie as transições de forma clara: "ao clicar em Publicar Doação vai para Tela de Confirmação".</p>,
     teach:{"why":"O wireframe responde “o quê e onde”, o mockup “como se apresenta” e o protótipo “o que acontece quando uso”. As interações ligam as telas e simulam a navegação real do fluxo principal.","how":["Conecte botões a outras telas (ex.: “Entrar” → tela inicial).", "Conecte itens de lista aos detalhes.", "Adicione ações de “voltar” à tela anterior.", "Nomeie as transições de forma clara."],"example":"“Ao clicar em ‘Publicar Doação’ vai para ‘Tela de Confirmação’.”"},
     render:()=> <ListField label="Transições" items={s.interacoes} onChange={v=>patch({interacoes:v})} placeholder='Ex.: ao clicar em "Publicar" vai para "Confirmação"' />
    },
    {label:'Estados e feedbacks',
     book:<p>Desenhe ao menos os estados: formulário com erro, carregamento e sucesso — de preferência ligado ao impacto da ODS.</p>,
     teach:{"why":"Desenhar os estados mais importantes aproxima o protótipo do comportamento real e permite testar mais cenários.","how":["Formulário com erro: campos destacados e mensagem clara.", "Carregamento: indicador ou mensagem de “aguarde”.", "Sucesso: mensagem de confirmação amigável, de preferência ligada ao impacto da ODS."],"example":"Do exemplo de microcopy do livro: “Sua doação foi publicada. Agora outras pessoas poderão vê-la e solicitar retirada.” Ou, ligando à ODS: “Você acabou de contribuir para reduzir o desperdício de alimentos na sua região.”"},
     render:()=>(<div><Field type="textarea" rows={2} label="Mensagem de erro" value={s.estados.erro} onChange={v=>patch({estados:{...s.estados,erro:v}})} /><Field type="textarea" rows={2} label="Mensagem de carregamento" value={s.estados.carregando} onChange={v=>patch({estados:{...s.estados,carregando:v}})} /><Field type="textarea" rows={2} label="Mensagem de sucesso" value={s.estados.sucesso} onChange={v=>patch({estados:{...s.estados,sucesso:v}})} /></div>)
    },
    {label:'Protótipo inclusivo',
     book:<p>Se o protótipo já nasce excludente, o produto final também será. Verifique os critérios de acessibilidade desde o desenho.</p>,
     teach:{"why":"Acessibilidade não é um acabamento de luxo, é parte da qualidade do produto. Se o protótipo já nasce excludente, é muito provável que o produto final também seja, deixando de fora justamente quem mais precisa de apoio (educação, saúde, combate à pobreza, mobilidade, participação social).","how":["Contraste de cores suficiente para leitura confortável.", "Tamanhos de fonte adequados em dispositivos móveis.", "Ícones importantes acompanhados de texto ou rótulos claros.", "Rótulos de botões e menus objetivos.", "Organização das telas que reduza a carga cognitiva."],"mistakes":["Usar “Clique aqui” genérico como rótulo.", "Colocar excesso de informação competindo pela atenção."]},
     render:()=> <CheckGroup label="Verificado" options={inclusivoOpcoes} values={s.inclusivo} onChange={v=>patch({inclusivo:v})} />
    },
    {label:'Teste de usabilidade',
     book:<p>Defina uma tarefa e peça para alguém tentar concluí-la só com o protótipo. Registre o que funcionou e o que gerou dúvida ou erro.</p>,
     teach:{"why":"Um protótipo navegável só mostra seu valor diante de pessoas reais. Mesmo um teste simples, com poucas pessoas, revela problemas que a equipe não enxergou, e permite ajustar o protótipo (e, se preciso, o Design System) antes de investir em desenvolvimento.","how":["Defina uma tarefa e peça para a pessoa concluí-la usando apenas o protótipo.", "Observe, sem ajudar, onde surgem dúvidas (“onde eu clico agora?”), travas (“não sei voltar”) e frustrações (“não entendi a mensagem de erro”).", "Registre em quais telas a pessoa se perde, quais rótulos geram confusão e se a promessa da ODS parece clara ao final.", "No exercício do livro: duas pessoas testam; anote 3 pontos que funcionaram e 3 que geraram dúvida, erro ou atrito."],"example":"Tarefa do livro: “Encontre um alimento disponível perto da sua casa e confirme o interesse em receber a doação.”"},
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
     teach:{"why":"Além de telas bonitas, a solução conversa com o usuário por palavras. O tom de voz é a forma de falar da interface, e o microcopy é a voz escrita do produto. Em projetos de ODS, o texto pode incluir ou afastar justamente os grupos que a solução pretende apoiar.","how":["Responda: com quem o produto fala (adolescentes, adultos, idosos, gestores, professores, estudantes)?", "Em que contexto é usado (sala de aula, ônibus, fila do posto de saúde, casa)?", "Quer soar próximo e acolhedor ou sério e técnico?", "Há temas sensíveis (saúde, renda, violência, aprendizagem, deficiência)?", "Depois de definido, o tom deve aparecer de forma consistente em toda a interface, como cores e tipografia."],"example":"Escolhas de linguagem que definem o tom: formal ou informal; verbos diretos (“Salvar”, “Excluir”) ou rebuscados; empatia ou culpa no usuário; tratar a pessoa como capaz ou como alguém a ser tutelado.","mistakes":["Mensagens que jogam a culpa no usuário ou o tratam como “incapaz”."]},
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
     teach:{"why":"O exercício do livro trabalha o microcopy de um fluxo importante por vez, para revisar todos os textos que a pessoa encontra nele.","how":["Escolha um fluxo importante da sua solução."],"example":"Fluxos do livro: “Registrar uma ocorrência na escola”, “Doar alimento”, “Agendar carona solidária”."},
     render:()=> <Field label="Fluxo" value={s.fluxoEscolhido} onChange={v=>patch({fluxoEscolhido:v})} />
    },
    {label:'Textos do fluxo',
     book:<p>Liste os botões, rótulos, mensagens de erro e de sucesso desse fluxo. Para cada um, pergunte: está claro o que acontece ao clicar? Se não, reescreva.</p>,
     teach:{"why":"Rótulos são decisivos para a navegação: um rótulo ruim pode travar o usuário mesmo em uma interface bonita. Os microcopies de erro, aviso e sucesso ajudam a entender o que acontece e o que fazer em seguida.","how":["Liste todos os botões, rótulos de menus, mensagens de erro e mensagens de sucesso do fluxo.", "Para cada texto, pergunte: está claro o que acontece ao clicar? A linguagem combina com público e contexto? Algum termo soa agressivo, confuso ou estigmatizante?", "Reescreva com: verbos de ação claros; texto específico; sem jargão técnico desnecessário; mesmo vocabulário em toda a interface; erro que explica o problema sem culpar; e que diz o que fazer a seguir.", "Teste do livro: imagine o botão lido fora de contexto; se fizer sentido sozinho, provavelmente está claro."],"example":"“Ver detalhes da doação” é melhor que “Ver mais”. “Publicar doação” e “Agendar atendimento” fazem sentido sozinhos. Em vez de “Erro! Dados inválidos!”, escreva “O CPF informado não é válido. Confira se digitou todos os números.”","mistakes":["Usar “OK”, “Confirmar” genérico ou “Clique aqui”.", "Mensagens que sugerem incompetência, como “Você preencheu errado de novo.”", "Chamar a mesma ação de “doação” num lugar e “entrega” em outro."]},
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
     teach:{"why":"Temas de ODS costumam ser sensíveis (pobreza, fome, desigualdade, deficiência, violência, aprendizado, saúde mental). O tom precisa ser respeitoso, não estigmatizante e centrado na pessoa, não no problema. Linguagem inclusiva também é parte da acessibilidade.","how":["Evite rotular a pessoa pelo problema.", "Cuidado com humor em contextos delicados.", "Prefira linguagem que empodera.", "Pense em quem está lendo: em apps educacionais, o texto deve ser compreensível para o nível de letramento do público.", "Use o mesmo vocabulário da interface (se a tela diz “Turma”, evite “Grupo” na mensagem).", "Celebre o sucesso sem exagerar, conectando-o à finalidade da ODS."],"example":"Em vez de “aluno deficiente”, “aluno com deficiência”. Em vez de “família carente”, “família em situação de vulnerabilidade”. Empoderando: “Você pode atualizar seus dados a qualquer momento.” Sucesso: “Sua doação foi publicada. Agora outras pessoas poderão vê-la e solicitar retirada.”","mistakes":["Rotular a pessoa pelo problema.", "Usar emojis e frases “engraçadinhas” em temas como violência, saúde e segurança alimentar."]},
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
