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
     teach:{
       why:"O fluxo de telas traduz a jornada vivida pela persona em passos concretos dentro do sistema: é a representação técnica de como o usuário navega pelo produto. Sem ele, o usuário se perde, mesmo que a casa esteja bem construída (é o “mapa da casa”).",
       how:["Selecione um aplicativo ou site que tenha ao menos três seções ou funcionalidades principais."],
       example:"ReUse+ (ODS 12): aplicativo digital criado para estimular o reaproveitamento de alimentos e objetos em comunidades urbanas. O fluxo foi estruturado para refletir a jornada da persona Léo, estudante universitário que busca reduzir desperdícios e apoiar iniciativas sustentáveis.",
       mistakes:["Tratar Jornada do Usuário e Fluxo de Telas como a mesma coisa. A jornada é a narrativa ampla (emoções, dores, backstage, oportunidades); o fluxo é a visão técnica de como cada etapa vira telas, menus e interações."]
     },
     book:<p>Selecione o produto ou solução que você está desenhando e descreva-o em uma frase — igual ao fluxo do "ReUse+" (ODS 12) no livro.</p>,
     render:()=>(<div><Field label="Nome do produto/solução" value={s.produto} onChange={v=>patch({produto:v})} placeholder="Ex.: ReUse+" /><Field type="textarea" label="Contexto em 1-2 frases" value={s.descricao} onChange={v=>patch({descricao:v})} placeholder="Ex.: aplicativo para estimular o reaproveitamento de alimentos e objetos." /></div>)
    },
    {label:'Ações do usuário',
     teach:{
       why:"O fluxo é a ponte entre o design conceitual e a implementação técnica. A sequência de ações que a pessoa realiza é a base da jornada observada e do que será desenhado em telas.",
       how:["Use o produto escolhido e anote cada passo que o usuário realiza, do início até concluir uma ação.","Escreva a sequência em setas, da abertura do app até o resultado final."],
       example:"Exercício do livro (iFood): Abrir app → Tela inicial → Escolher restaurante → Adicionar pedido → Ver carrinho → Confirmar pagamento → Acompanhar entrega. No ReUse+, a jornada de Léo começa com o desejo de doar alimentos que sobraram em casa, e o fluxo foi construído para que ele faça isso com o mínimo de atrito possível."
     },
     book:<p>Anote cada passo que o usuário realiza desde o início até concluir a ação principal — essa sequência é a base do fluxo técnico.</p>,
     render:()=> <ListField label="Sequência de ações" items={s.acoes} onChange={v=>patch({acoes:v})} placeholder="Ex.: abrir app → tela inicial → escolher ação → confirmar" />
    },
    {label:'Telas',
     teach:{
       why:"Cada tela corresponde a uma etapa funcional do produto. Desenhar todas com consistência visual, seguindo o guia de estilo do projeto, facilita a compreensão e reduz a carga cognitiva durante a navegação.",
       how:["Para cada etapa observada, capture um print ou desenhe um esquema simples (wireframe) com botões, menus e rótulos.","Pense nos tipos de tela: Home, Login/Cadastro, Dashboard ou página principal, Detalhamento/Edição e Confirmação/Feedback.","Siga o guia de estilo: paleta de cores, tipografia, espaçamento, ícones e tom de voz."],
       example:<><p>Telas do ReUse+ (ODS 12):</p><ul><li>Tela Inicial: logotipo, missão do projeto e dois botões principais, “Doar” e “Receber”, com menu fixo de ícones universais (Casa, Mapa, Perfil).</li><li>Login/Cadastro: acesso por e-mail ou redes sociais, com feedback imediato (borda vermelha para erro, ícone verde para sucesso).</li><li>Doação: campos para tipo de alimento, validade e quantidade, upload de foto e botão “Publicar Doação”.</li><li>Mapa Comunitário: pontos de coleta por geolocalização.</li><li>Confirmação e Agradecimento: mensagem de impacto e botão “Compartilhar nas redes”.</li></ul></>
     },
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
     teach:{
       why:"O fluxograma de navegação mostra como o usuário se desloca entre as telas a partir de ações (cliques, botões, toques). Ele revela caminhos possíveis, identifica gargalos e ajuda a prever a experiência completa. Para quem desenvolve, mostra quais rotas criar, quais variáveis e estados gerenciar e quais eventos (sucesso, erro, carregamento, transição) ativar.",
       how:["Ligue as telas com setas indicando a direção da navegação.","Rotule cada seta com a ação que leva de uma tela à outra (ex.: “clicar em pagar”, “voltar”, “abrir perfil”).","Valide cada transição com testes de usabilidade durante o desenvolvimento do protótipo."],
       example:"Fluxograma do livro: clicar em “Cadastrar alimento” → abrir tela de formulário → enviar → tela de confirmação. O sitemap, que é a hierarquia das páginas, seria algo como Home → Cadastro → Doações → Histórico."
     },
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
     teach:{
       why:"O protótipo não representa apenas a interface, mas a lógica da experiência digital planejada. Revisar o fluxo criticamente mostra se o raciocínio de design, da jornada às telas navegáveis, se sustenta.",
       how:["Escreva um texto curto (5 a 10 linhas) respondendo: o fluxo é intuitivo?","Há etapas redundantes ou confusas?","Há coerência entre botões, menus e rótulos?","O fluxo reflete uma lógica clara de arquitetura da informação?","Que melhorias você sugeriria?"]
     },
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
     teach:{
       why:"Sem uma linguagem visual consistente, cada tela fala um idioma diferente e o usuário se perde na tradução. Depois de estruturar problema, personas, jornada e fluxos, o desafio é decidir como a solução “fala” visualmente, como se organiza na tela e como pode ser testada antes da programação.",
       how:["Cores: identidade e legibilidade.","Tipografia: clareza e ritmo.","Ícones e elementos visuais.","Layout e espaçamento: organização.","Tom de voz: personalidade do produto.","Tudo isso se consolida em um Design System (regras e componentes reutilizáveis) e se testa em wireframes, mockups e protótipos."],
       example:"Pense nas cores como o “tom de voz” visual da conversa: elas fazem o produto parecer sério, tranquilo, técnico ou acolhedor, conforme a escolha."
     },
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
  const [ods,setOds] = useProjectOds(data,setData);
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
     teach:{
       why:"Quando olhamos um app, as cores são percebidas antes do texto. Elas ajudam a entender onde clicar, indicam o que é importante ou perigoso, comunicam a identidade e podem incluir ou excluir pessoas. A psicologia das cores não é ciência exata, mas ajuda a escolher com consciência: se a cor não for escolhida por você, alguém vai escolher por acaso, e a mensagem pode não ser a desejada.",
       how:["Escolha uma ODS (o livro sugere 2, 3, 4, 10 ou 11).","Defina 1 cor primária: a principal cor de identidade, usada em botões principais, links importantes e cabeçalhos.","Justifique a escolha com a psicologia das cores e a ODS."],
       mistakes:["Tratar cor como detalhe de “design bonito”: ela faz parte da lógica de uso e da mensagem do produto."]
     },
     book:<p>As cores não são neutras: cada tom envia uma mensagem. Escolha uma ODS e defina a cor primária — a principal cor de identidade, usada em botões e cabeçalhos — justificando pela psicologia das cores.</p>,
     render:()=>(<div><SelectField label="ODS escolhida" value={ods} onChange={setOds} options={ODS_LIST} hint="Escolhida uma vez aqui, ela já vem preenchida em Tipografia e Ícones — é a mesma ODS do projeto em todo o Design System." /><ColorField label="Cor primária" value={s.primaria} onChange={v=>patch({primaria:v})} /><Field type="textarea" label="Justificativa (psicologia das cores)" value={s.justificativaPrimaria} onChange={v=>patch({justificativaPrimaria:v})} rows={2} /></div>)
    },
    {label:'Secundária e neutras',
     teach:{
       why:"Uma paleta de UI é estruturada, não um monte de cores soltas. Ela costuma ter poucas cores fortes: 1 primária, 1 secundária, mais estados e neutras, repetidas em padrões claros.",
       how:["Defina 1 cor secundária, que apoia a primária em destaques menores ou elementos complementares.","Defina as neutras (tons de cinza, preto e branco), usadas em fundos, bordas e textos.","O exercício do livro pede 1 secundária e 3 neutras (preto, cinza, branco)."],
       mistakes:["Usar na paleta de dados a mesma cor do botão principal (ex.: azul forte numa linha de gráfico secundária): o usuário não sabe se aquilo é um dado importante ou uma ação clicável. Por isso o livro separa a paleta de UI (poucas cores, ajudam a usar o sistema) da paleta de dados (mais cores, ajudam a entender os dados)."]
     },
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
     teach:{
       why:"Cores são uma forma rápida de feedback ao usuário. Os estados da interface (sucesso, erro, aviso e informação) precisam de cor própria e repetida de forma consistente.",
       how:["Defina success, error, warning e info.","Siga os padrões do livro: vermelho para erro, amarelo ou laranja para alerta, verde para sucesso (se fizer sentido).","Não dependa só da cor: combine cor, ícone e texto."],
       example:"Do livro: um formulário com erro só em vermelho pode passar despercebido por um daltônico. Errado: a borda ficou vermelha. Certo: a borda ficou vermelha, apareceu um ícone de “X” e um texto dizendo “Campo obrigatório”.",
       mistakes:["Usar verde para “Sim” e vermelho para “Não” sem rótulos de texto: vermelho e verde é a confusão mais comum no daltonismo.","Repetir no gráfico o significado de estado: se verde é sucesso e vermelho é erro no sistema, usar verde para a Turma A e vermelho para a Turma B pode levar a ler A como “boa” e B como “ruim”."]
     },
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
     teach:{
       why:"O círculo cromático é um mapa das cores. A partir dele surgem esquemas clássicos de combinação, cada um com um efeito diferente.",
       how:["Primárias: vermelho, azul, amarelo. Secundárias: laranja, verde, violeta. Terciárias: misturas entre primárias e secundárias.","Complementares (opostas): contraste forte e mais atenção.","Análogas (vizinhas): harmonia suave, pouco contraste.","Triádicas (triângulo): equilibram variedade e harmonia.","Meio-complementares: uma cor base mais as duas vizinhas da complementar.","Monocromáticas: variações de luminosidade e saturação da mesma cor; interfaces limpas e fáceis de manter.","Tetrádicas (quadrado): alta diversidade e contraste, exigem cuidado para não virar “carnaval”."],
       example:"Exemplos do livro: complementares, azul × laranja ou vermelho × verde; análogas, azul, azul-esverdeado e verde; monocromática, azul-escuro + azul-médio + azul-claro. O exercício pede, a partir da sua primária, uma complementar, uma variação monocromática de 3 tons e uma combinação análoga de 3 cores vizinhas."
     },
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
     teach:{
       why:"Não adianta ser bonito se não dá para ler. O contraste é a diferença de luminosidade entre o texto e o fundo, e a regra mais famosa de cores nas WCAG (diretrizes de acessibilidade do W3C). Cinza claro sobre branco cansa a vista e é ilegível para idosos ou pessoas com baixa visão.",
       how:["Texto normal: contraste de pelo menos 4,5:1.","Texto grande (acima de 18pt, ou 14pt em negrito): pelo menos 3:1.","Ícones e componentes funcionais (botões, bordas de formulário): pelo menos 3:1.","Nível A é o mínimo absoluto; AA (4,5:1) é o padrão de mercado e o objetivo; AAA é o nível mais alto (ex.: contraste de 7:1).","Teste em escala de cinza: se ainda dá para diferenciar links, botões e erros, o contraste provavelmente está bom."],
       example:"Exercício do livro: crie duas versões de uma mesma tela, a versão A com contraste ruim (texto claro em fundo claro) e a versão B com contraste corrigido, e compare em grupo qual é mais legível e por quê.",
       mistakes:["Colocar cinza claro sobre fundo branco.","Depender apenas da cor para comunicar informação (erros, links, botões)."]
     },
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
     teach:{
       why:"Oferecer tema claro e escuro não é moda: é conforto visual e contexto de uso.",
       how:["Modo claro: fundo claro e texto escuro; bom para ambientes bem iluminados e leitura prolongada.","Modo escuro: fundo escuro e texto claro; bom à noite ou em ambientes pouco iluminados.","Evite preto puro (#000000) em grandes áreas: use cinzas bem escuros, mais confortáveis.","Teste o contraste em modo claro e em modo escuro.","Use cores semânticas para estados e explore tons da mesma cor."],
       example:"Exercício do livro: a partir da sua paleta, monte a mesma tela em modo claro e em modo escuro e discuta se as cores estão claras e não confundem o usuário.",
       mistakes:["Usar preto puro em grandes áreas no modo escuro."]
     },
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
    const txt = `PALETA DE CORES — ${ods||'(ODS não definida)'}\nPrimária: ${s.primaria} — ${s.justificativaPrimaria||''}\nSecundária: ${s.secundaria} — ${s.justificativaSecundaria||''}\nNeutras: ${s.neutras.join(', ')}\nEstados — success:${s.estados.success} error:${s.estados.error} warning:${s.estados.warning} info:${s.estados.info}\nEsquema escolhido: ${ESQUEMA_LABELS[s.esquemaEscolhido]||s.esquemaEscolhido}\nContraste texto/fundo: ${ratio.toFixed(2)}:1`;
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
        <p style={{color:'var(--ink)'}}><strong>{ods}</strong></p>
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
  const [ods,setOds] = useProjectOds(data,setData);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='tipografia');
  const steps = [
    {label:'Voz tipográfica',
     teach:{
       why:"A tipografia ajuda o usuário a entender o que está acontecendo: tudo em um app (botões, títulos, erros, menus) é texto. Ela decide como o produto fala visualmente e passa personalidade antes mesmo de o texto ser lido (identidade e tom de voz).",
       how:["Escolha uma ODS (2, 3, 4, 10 ou 11).","Defina o público principal (ex.: estudantes do ensino médio, idosos, agricultores, gestores públicos).","Escolha 3 adjetivos para o tom do app (ex.: próximo, sério, inovador, acolhedor)."],
       example:"Do livro: uma fonte quadrada e pesada passa seriedade; uma fonte arredondada e leve parece mais amigável."
     },
     book:<p>Escolha uma ODS, o público principal e três adjetivos para o tom do app (ex.: próximo, sério, inovador, acolhedor).</p>,
     render:()=>(<div><SelectField label="ODS" value={ods} onChange={setOds} options={ODS_LIST} hint="Já veio preenchida se você escolheu em outra etapa do Design System — é a mesma ODS do projeto." /><Field label="Público principal" value={s.publico} onChange={v=>patch({publico:v})} placeholder="Ex.: idosos, agricultores, gestores públicos" /><div className="grid-3">{s.adjetivos.map((a,i)=><Field key={i} label={'Adjetivo '+(i+1)} value={a} onChange={v=>{const next=[...s.adjetivos];next[i]=v;patch({adjetivos:next});}} />)}</div></div>)
    },
    {label:'Tipo de fonte',
     teach:{
       why:"Cada grupo de fonte passa uma sensação diferente, e a escolha deve combinar com os adjetivos do app e com o público.",
       how:["Serifadas (Times New Roman, Georgia, Garamond): tradição, formalidade, estabilidade; relatórios e páginas institucionais, e em títulos de app para dar cara de relatório sério.","Sem serifas (Arial, Helvetica, Roboto, Open Sans, Montserrat): modernidade, simplicidade, objetividade; é o padrão para UI (apps, dashboards, formulários).","Manuscritas (Pacifico, Lobster, Great Vibes): proximidade, elegância, afeto; títulos especiais e campanhas, nunca em corpo de texto longo.","Display/decorativas (Bebas Neue, Impact): impacto e ousadia; chamadas curtas como “Doar Agora”, com moderação.","Monoespaçadas (Consolas, Fira Code, Source Code Pro): códigos, logs e tabelas em que o alinhamento importa."],
       mistakes:["Usar display em botões, rótulos e textos pequenos: cansa rápido.","Usar fontes decorativas ou manuscritas em corpo de texto longo."]
     },
     book:<p>Serifadas passam tradição e formalidade; Sem serifa (o padrão para UI) passam modernidade; Manuscritas passam proximidade e afeto; Display chama atenção em títulos curtos.</p>,
     render:()=>(<div><SelectField label="Tipo de fonte" value={s.tipoFonte} onChange={v=>patch({tipoFonte:v})} options={['Serifada (Serif)','Sem serifa (Sans Serif)','Manuscrita (Script)','Display/Decorativa']} /><Field type="textarea" label="Justificativa" value={s.justificativaTipo} onChange={v=>patch({justificativaTipo:v})} rows={2} /></div>)
    },
    {label:'Par de fontes',
     teach:{
       why:"Usar uma família só, com variações (Regular, Medium, Bold), é seguro e suficiente para a maioria dos apps. Combinar duas famílias, uma mais marcante para títulos e outra super legível para o corpo, também funciona. Prefira títulos mais expressivos com corpo neutro e calmo.",
       how:["Escolha 1 fonte para títulos (primária) e 1 para textos longos (secundária), por exemplo no Google Fonts.","Registre o tipo (Serif, Sans Serif, Script, Display) e as sensações que cada uma transmite.","Explique por que combinam com a ODS e o público-alvo.","Use no máximo 2 famílias."],
       mistakes:["Combinar duas fontes muito parecidas (ex.: Arial + Helvetica).","Combinar duas fontes muito exóticas na mesma tela (ex.: Display + Script)."]
     },
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
     teach:{
       why:"Hierarquia tipográfica deixa claro o que vem primeiro, o que é seção e o que é detalhe. Se o leitor consegue pular a tela só pelos títulos (H1/H2/H3), a hierarquia está boa.",
       how:["Defina os níveis: H1 (título principal da tela), H2 (seção), H3 (cards ou blocos menores), Body, Caption e Button.","Use tamanhos coerentes entre os níveis, mantendo títulos pelo menos 1,25× a 2× o tamanho do corpo.","Use no máximo 2 famílias e use negrito e itálico só onde precisa chamar atenção.","Para texto de leitura, o corpo parte de 16px em mobile (14px em textos menos críticos, evitando ir abaixo disso)."],
       example:"Escala simples para mobile do livro: H1 24–26 px, H2 20–22 px, H3 16–18 px, Body 14–16 px, Caption 12–13 px, Button 14–16 px (geralmente em negrito). Exemplos de textos: H1 “Mapa de Doações”, H2 “Doações ativas hoje”.",
       mistakes:["Usar muito itálico ou tudo em maiúsculas: cansa a leitura.","Fazer blocos enormes de texto sem parágrafos, listas ou subtítulos."]
     },
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
    const txt = `TIPOGRAFIA — ${ods||''}\nPúblico: ${s.publico||'—'}\nTom: ${s.adjetivos.filter(Boolean).join(', ')}\nTipo de fonte: ${s.tipoFonte||'—'} — ${s.justificativaTipo||''}\nTítulos: ${s.fonteTitulos} | Corpo: ${s.fonteCorpo}\nEscala — H1:${s.escala.h1}px H2:${s.escala.h2}px H3:${s.escala.h3}px Body:${s.escala.body}px Caption:${s.escala.caption}px Button:${s.escala.button}px`;
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
  const [ods,setOds] = useProjectOds(data,setData);
  const [showSummary,setShowSummary] = useState(!!s.done);
  const meta = ARTIFACTS.find(a=>a.id==='icones');
  function setAcao(i,field,val){ const next=[...s.acoes]; next[i]={...next[i],[field]:val}; patch({acoes:next}); }
  function addAcao(){ patch({acoes:[...s.acoes,{id:uid(),acao:'',icone:'',justificativa:''}]}); }
  function removeAcao(i){ const next=s.acoes.filter((_,idx)=>idx!==i); patch({acoes:next.length?next:[{id:uid(),acao:'',icone:'',justificativa:''}]}); }
  const steps = [
    {label:'Contexto',
     teach:{
       why:"Ícones são atalhos cognitivos: ajudam o usuário a entender rapidamente o que pode fazer, onde está e o que está acontecendo, sem ler muito texto. Em produtos ligados aos ODS isso pesa ainda mais, porque o público costuma ser diverso, com diferentes níveis de letramento e familiaridade com tecnologia.",
       how:["Escolha 1 ODS (2, 3, 4, 10 ou 11).","Descreva seu app em uma frase."],
       example:"Exemplo do livro (ODS 4): “App para alunos acompanharem aulas e tarefas”."
     },
     book:<p>Ícones são atalhos cognitivos: ajudam o usuário a entender rapidamente o que pode fazer. Escolha uma ODS e descreva seu app em uma frase.</p>,
     render:()=>(<div><SelectField label="ODS" value={ods} onChange={setOds} options={ODS_LIST} hint="Já veio preenchida se você escolheu em outra etapa do Design System — é a mesma ODS do projeto." /><Field label="Descreva seu app em 1 frase" value={s.fraseApp} onChange={v=>patch({fraseApp:v})} placeholder="Ex.: App para alunos acompanharem aulas e tarefas" /></div>)
    },
    {label:'Ações e ícones',
     teach:{
       why:"Ícones funcionam por metáforas visuais apoiadas em imagens do dia a dia. Sozinhos, porém, podem ser ambíguos: um coração pode significar curtir, favoritar, doar ou apoiar; um aviãozinho, enviar ou compartilhar. Por isso: sempre que possível, ícone + texto.",
       how:["Liste 5 ações importantes do app.","Para cada ação, escolha (ou descreva) um ícone que a represente.","Justifique em 1 linha por que essa metáfora faz sentido.","Atribua um significado único e fixo a cada ícone."],
       example:<><p>Do livro, ODS 2 (Fome Zero): ações como doar alimento, buscar doação, ver mapa, denunciar desperdício, ver histórico. “Doar alimento” → prato, porque lembra comida; “Ver mapa de coleta” → mapa, porque remete à localização dos pontos.</p><p>ODS 4: livros → cursos (Minhas disciplinas); capelo → certificação (Meus certificados).</p></>,
       mistakes:["Usar ícone sozinho esperando que dispense o texto.","Dar ao mesmo ícone significados diferentes: o coração não pode ser “doar alimento” numa tela e “curtir postagem” em outra.","Ignorar a cultura: evite ícones que mudam muito de significado conforme o contexto cultural (certos gestos de mão podem ser ofensivos em alguns países)."]
     },
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
     teach:{
       why:"Ícones precisam ser coerentes entre si. Tamanho, traço e alinhamento diferentes fazem os ícones parecerem de “famílias diferentes” ou tortos ao lado do texto e dos botões.",
       how:["Monte uma tela com 3 a 5 atalhos (ícone + texto).","Mantenha o mesmo tamanho de ícone e a mesma distância entre ícone e texto.","Mantenha um estilo semelhante: não misture um ícone desenhado à mão com outro super realista.","Em celular, use ícones de pelo menos 24×24 px (32×32 px para ações principais) e área de toque de pelo menos 44×44 px.","Em ícones de traço, escolha uma espessura (ex.: 2 px) e mantenha em todos.","Contraste: ícone cinza claro sobre fundo branco é difícil de ver. No código, use rótulo para leitor de tela (ex.: aria-label=“Ver doações”)."],
       mistakes:["Misturar traços de espessuras diferentes (1 px num ícone e 3 px em outro).","Depender só da cor do ícone (ex.: aviso apenas com ícone vermelho, ruim para daltonismo); combine ícone + texto, como “Erro ao salvar doação”."]
     },
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
     teach:{
       why:"Ícones são parte da compreensão da interface e precisam ser acessíveis para pessoas com baixa visão, em ambientes com reflexo na tela ou sem familiaridade com o símbolo.",
       how:["É fácil bater o olho e entender o que cada ícone faz?","Algum ícone ficou ambíguo?","O ícone está ajudando ou atrapalhando?"]
     },
     book:<p>É fácil bater o olho e entender o que cada ícone faz? Algum ícone ficou ambíguo? O ícone está ajudando ou atrapalhando?</p>,
     render:()=>(<div><Field type="textarea" rows={2} label="É fácil entender cada ícone?" value={s.reflexao.facil} onChange={v=>patch({reflexao:{...s.reflexao,facil:v}})} /><Field type="textarea" rows={2} label="Algum ícone ficou ambíguo?" value={s.reflexao.ambiguo} onChange={v=>patch({reflexao:{...s.reflexao,ambiguo:v}})} /><Field type="textarea" rows={2} label="O ícone ajuda ou atrapalha?" value={s.reflexao.ajudou} onChange={v=>patch({reflexao:{...s.reflexao,ajudou:v}})} /></div>)
    },
  ];
  if(showSummary){
    const txt = `ÍCONES E ICONOGRAFIA — ${ods}\n${s.fraseApp}\n\n`+s.acoes.filter(a=>a.acao).map(a=>a.icone+' '+a.acao+' — '+a.justificativa).join('\n');
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
     teach:{
       why:"O cérebro não lê a tela de cima a baixo: ele escaneia blocos, títulos, botões e espaços em branco. Layout (como as coisas são organizadas) e espaçamento (distâncias entre elas) mostram o que é mais importante, evitam poluição visual e guiam o olhar. Um app com cores e tipografia lindas ainda pode ser cansativo se estiver amontoado ou desalinhado.",
       how:["Cinco princípios do livro: hierarquia (nem tudo pode gritar ao mesmo tempo), proximidade (o relacionado fica junto), alinhamento, repetição (mesmo tipo de card, mesmo espaçamento) e contraste.","No exercício do livro, a primeira versão da tela é desenhada “no olho”, sem grid nem escala; depois você compara com a versão organizada."],
       mistakes:["Tudo centralizado, tudo junto, sem alinhamento à esquerda: fica difícil criar ritmo de leitura.","Espaçamento inconsistente (10px num card, 22px em outro, 5px em outro): o usuário sente que algo está estranho.","Falta de respiro: texto colado no topo do card, card colado no outro.","Colunas demais em celular: texto minúsculo e toque difícil."]
     },
     book:<p>Desenhe uma tela "no olho", sem grid nem escala de espaçamento. O que costuma dar errado: tudo centralizado, espaçamento inconsistente, falta de respiro.</p>,
     render:()=> <Field type="textarea" label="O que geralmente acontece quando não se usa grid?" value={s.reflexaoLivre} onChange={v=>patch({reflexaoLivre:v})} rows={3} placeholder="Ex.: os elementos ficam desalinhados e a hierarquia se perde." />
    },
    {label:'Margens e grid',
     teach:{
       why:"Para não desenhar no olho, usa-se grid: a tela é dividida em colunas invisíveis e cards, textos, imagens e botões se alinham a elas, com gutters (espaços entre colunas) constantes.",
       how:["Margens: espaço entre o conteúdo e a borda; padding: espaço interno de botão, card ou bloco; gutters: espaço entre colunas, cards e seções.","É comum usar grid de 12 colunas em desktop e 4 colunas em mobile.","Margens laterais adequadas importam: texto encostado na borda dificulta a leitura."],
       example:"Mobile (livro): margens laterais de 16px, conteúdo em 1 coluna, espaço vertical entre cards de 16–24px. Desktop: margens laterais de 80–120px, 2 a 3 colunas (menu lateral + conteúdo principal + painel auxiliar) e gutters iguais de 24px. No Figma, isso aparece como Layout Grid com colunas e gutters definidos."
     },
     book:<p>Um grid organiza a tela com "linhas invisíveis". Exemplo do livro: margens laterais de 16px em mobile, e grid de 2-3 colunas em desktop com gutters constantes.</p>,
     render:()=>(<div className="grid-3"><Field type="number" label="Margem lateral (px)" value={s.margem} onChange={v=>patch({margem:Number(v)})} /><Field type="number" label="Colunas — mobile" value={s.colunasMobile} onChange={v=>patch({colunasMobile:Number(v)})} /><Field type="number" label="Colunas — desktop" value={s.colunasDesktop} onChange={v=>patch({colunasDesktop:Number(v)})} /></div>)
    },
    {label:'Escala de espaçamentos',
     teach:{
       why:"Uma escala de espaçamentos evita valores soltos (10px num lugar, 13px em outro, 17px em outro). Ela pode virar tokens de design, de modo que design e código usem os mesmos valores e a interface fique mais coerente.",
       how:["Escala de exemplo do livro: spacing-xxs = 4px, xs = 8px, sm = 12px, md = 16px, lg = 24px, xl = 32px.","Padding interno de botão: 8–16px.","Espaço entre campos de formulário: 12–16px.","Espaço entre seções da tela: 24–32px."],
       mistakes:["Usar valores soltos fora da escala, gerando espaçamento inconsistente."]
     },
     book:<p>Para não virar bagunça, use uma escala de espaçamentos (ex.: 4-8-12-16-24-32) em vez de valores soltos.</p>,
     render:()=>(<div className="grid-3">{Object.entries(s.escala).map(([k,v])=><Field key={k} type="number" label={'spacing-'+k} value={v} onChange={val=>patch({escala:{...s.escala,[k]:Number(val)}})} />)}</div>)
    },
    {label:'Preview ao vivo',
     teach:{
       why:"Ver margens, espaçamento e alinhamento numa lista real de cards mostra a repetição da estrutura (card → card → card, sempre com o mesmo padrão visual). Layout e espaçamento também são acessibilidade.",
       how:["Alvos de toque: botões e ícones acionáveis em áreas de pelo menos 44×44px, com espaço entre botões para evitar toques acidentais.","Agrupe campos relacionados (ex.: Nome, Telefone, Endereço), o que ajuda usuários com dificuldades cognitivas ou de atenção.","Espaço em branco não é desperdício: separa seções, orienta o olhar e reduz sobrecarga.","Defina bem o line-height, como visto em tipografia."],
       example:"Tela de lista de doações (ODS 2) do livro: header com título “Minhas Doações” e ícone de filtro, barra de busca, lista de cards (alimento, quantidade, validade, status) e botão “Cadastrar nova doação” fixo no rodapé. Espaçamentos: margem lateral spacing-md (16px), header→busca spacing-sm (12px), padding de cada card spacing-md (16px), entre cards spacing-sm (12px), lista→botão do rodapé spacing-lg (24px)."
     },
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
     teach:{
       why:"Comparar a versão sem critério com a que usa grid e escala mostra o efeito de uma tela com bom espaçamento: ela respira, ajuda o olho a separar blocos e parece mais profissional, mesmo com elementos simples.",
       how:["Qual versão é mais fácil de ler?","Em qual a hierarquia fica mais clara?","Em qual a tela parece mais profissional?","Confira os erros comuns: tudo centralizado, espaçamento inconsistente, falta de respiro, colunas demais em celular."]
     },
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
