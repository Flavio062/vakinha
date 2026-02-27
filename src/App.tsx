import React, { useState, useEffect } from 'react';
import { Search, Heart, Share, ShieldCheck, Copy, Check, Menu, X, MessageCircle, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';

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
  const [totalRaised, setTotalRaised] = useState(142000);
  const [totalSupporters, setTotalSupporters] = useState(2184);
  const [totalHearts, setTotalHearts] = useState(4532);

  const GOAL_AMOUNT = 300000;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 shadow-sm">
              <img src="https://midias.em.com.br/_midias/jpg/2026/02/24/1200x720/1_juiz-de-fora-cemig-desmente-que-havera-interrupcao-geral-de-energia-64640530.jpeg?20260224185555?20260224185555" alt="Deslizamento e destruição" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            {/* Title & Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Emergências / Desastres</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Ajude as Famílias Atingidas pela Enchente em Juiz de Fora – Solidariedade em Meio à Tragédia
              </h1>
              <p className="text-sm text-gray-500 font-medium mb-4">ID: 5965612</p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Nos últimos dias, fortes chuvas atingiram a cidade de Juiz de Fora, em Minas Gerais, provocando uma das maiores tragédias recentes da região. As tempestades causaram enchentes e deslizamentos de terra que deixaram centenas de famílias desabrigadas.
              </p>
              
              {/* Mobile "Quero Ajudar" Button */}
              <div className="mt-6 lg:hidden">
                <button onClick={() => setCurrentPage('payment')} className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-sm">
                  Quero Ajudar
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200 px-6 pt-2">
                <nav className="flex gap-8 overflow-x-auto">
                  {['Sobre', 'Atualizações', 'Quem ajudou'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab.toLowerCase() 
                          ? 'border-green-500 text-green-600' 
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
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div className="prose max-w-none text-gray-600">
                      <p className="text-sm font-bold text-gray-900 mb-4">Vaquinha criada em: <span className="font-normal text-gray-600">24/02/2026</span></p>
                      <p className="mb-4">Nos últimos dias, fortes chuvas atingiram a cidade de Juiz de Fora, em Minas Gerais, provocando uma das maiores tragédias recentes da região. As tempestades causaram enchentes e deslizamentos de terra que deixaram 19 pessoas mortas, além de centenas de famílias desabrigadas.</p>
                      <p className="mb-4">Diversos bairros foram atingidos, com casas destruídas, ruas alagadas e famílias que perderam praticamente tudo. Muitas vítimas estavam em áreas atingidas por deslizamentos, e equipes de resgate continuam trabalhando para ajudar quem foi afetado.</p>
                      
                      <img src="https://www.otempo.com.br/content/dam/otempo/editorias/cidades/2026/2/cidades-juiz-de-fora-comerciantes--1772053247.jpeg" alt="Rua alagada e com lama" className="w-full rounded-xl my-6 object-cover shadow-sm" referrerPolicy="no-referrer" />
                      
                      <p className="mb-4">De acordo com as autoridades, mais de 440 pessoas ficaram desabrigadas, e escolas precisaram ser transformadas em abrigos temporários para acolher moradores que perderam suas casas.</p>
                      <p className="mb-4">Diante dessa situação tão difícil, criamos esta vaquinha solidária para ajudar as famílias atingidas pela tragédia. As doações arrecadadas serão destinadas para:</p>
                      <ul className="list-disc pl-5 mb-4 space-y-2">
                        <li>Compra de alimentos e água potável</li>
                        <li>Roupas, cobertores e itens de higiene</li>
                        <li>Apoio a famílias que perderam suas casas</li>
                        <li>Ajuda emergencial para reconstrução e recomeço</li>
                      </ul>
                      <p className="mb-4">Cada contribuição, independente do valor, pode ajudar a levar esperança para quem está passando por um dos momentos mais difíceis da vida.</p>
                      <p className="mb-2 font-bold text-yellow-600">💛 Se você puder contribuir, qualquer valor faz diferença.</p>
                      <p className="mb-4 font-bold text-yellow-600">💛 Se não puder doar, compartilhe essa campanha para que mais pessoas possam ajudar.</p>
                      <p className="font-bold text-gray-900 text-lg mt-6">Juntos podemos fazer a diferença e ajudar essas famílias a reconstruírem suas vidas.</p>
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
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1" id="donation-card">
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

  const handleCopy = () => {
    navigator.clipboard.writeText('00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z92i93aNMxHrzCRfSAqN15204000053039865802BR5907vakinha6009SAO PAULO62080504mpis6304C070');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 font-sans text-gray-800">
      {/* Topo */}
      <div className="flex items-center mb-12 cursor-pointer hover:opacity-80 transition-opacity" onClick={onBack}>
        <img src="https://seeklogo.com/images/V/vakinha-logo-88066E3580-seeklogo.com.png" alt="Vakinha Logo" className="h-8" referrerPolicy="no-referrer" />
      </div>

      {/* Título */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Obrigado por ajudar! 💛</h1>
        <p className="text-lg text-gray-600">Finalize sua doação via PIX</p>
      </div>

      {/* Card Central */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 mb-12">
        {!pixGenerated ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Valor da doação</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                <input 
                  type="number" 
                  placeholder="Digite o valor da sua doação" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-bold text-gray-900 bg-gray-50 focus:bg-white transition-colors text-lg" 
                />
              </div>
            </div>
            <button 
              onClick={() => setPixGenerated(true)}
              disabled={!value || Number(value) <= 0}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl text-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Gerar PIX
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-white border-2 border-orange-100 rounded-2xl shadow-sm">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com%2Finstore%2Fol%2Fv2%2F3Z92i93aNMxHrzCRfSAqN15204000053039865802BR5907vakinha6009SAO%20PAULO62080504mpis6304C070" alt="QR Code PIX" className="w-48 h-48 rounded-lg" referrerPolicy="no-referrer" />
            </div>
            <p className="text-center text-gray-600 font-medium">Escaneie o QR Code ou copie a chave PIX abaixo</p>
            
            <div className="w-full space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-mono text-gray-800 font-bold break-all text-sm">
                00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z92i93aNMxHrzCRfSAqN15204000053039865802BR5907vakinha6009SAO PAULO62080504mpis6304C070
              </div>
              <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-3.5 rounded-xl transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Chave copiada com sucesso!' : 'Copiar chave PIX'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé Simples */}
      <div className="mt-auto text-center text-sm text-gray-400">
        <p>Esta é uma página demonstrativa para fins educacionais.</p>
      </div>
    </div>
  );
}
