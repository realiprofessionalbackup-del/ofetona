/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  Star, 
  AlertTriangle,
  Package,
  User,
  MapPin,
  Mail,
  Hash,
  Timer as TimerIcon,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface CatalogItem {
  id: string;
  name: string;
  stock: number;
  options: {
    quantity: number;
    price: number;
    isBestSeller?: boolean;
  }[];
  image?: string;
}

interface CustomerOrder {
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  cep: string;
  marca: string;
  pagamento: string;
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'oferta-dia',
    name: 'Shampoo e Condicionador Belutti',
    image: 'https://i.ibb.co/d4jX5Qm2/Chat-GPT-Image-5-04-2026-10-56-59.png',
    stock: 50,
    options: [
      { quantity: 1, price: 27.90, isBestSeller: true },
    ]
  },
  {
    id: 'reparador',
    name: 'Reparador de Pontas Belutti',
    image: 'https://i.ibb.co/3YFwLGXb/Chat-GPT-Image-5-04-2026-11-23-08.png',
    stock: 45,
    options: [
      { quantity: 1, price: 29.90, isBestSeller: true },
    ]
  },
  {
    id: 'progressiva',
    name: 'Progressiva Blackprincess',
    image: 'https://i.ibb.co/Q3MBL6HQ/Whats-App-Image-2024-12-05-at-17-39-36.jpg',
    stock: 12,
    options: [
      { quantity: 1, price: 139.90 },
      { quantity: 2, price: 249.90, isBestSeller: true },
      { quantity: 3, price: 299.90 },
    ]
  },
  {
    id: 'teia',
    name: 'Hidratação Teia 1kg',
    image: 'https://i.ibb.co/n4vG0HF/Whats-App-Image-2024-12-05-at-17-39-37.jpg',
    stock: 18,
    options: [
      { quantity: 1, price: 37.90, isBestSeller: true },
    ]
  },
  {
    id: 'ativador',
    name: 'Ativador de Cachos',
    image: 'https://i.ibb.co/5PTsK0y/Whats-App-Image-2025-12-03-at-12-45-53.jpg',
    stock: 24,
    options: [
      { quantity: 1, price: 34.89, isBestSeller: true },
    ]
  },
  {
    id: 'liquida',
    name: 'Máscara de Chuveiro',
    image: 'https://i.ibb.co/cKCWD8Bt/Whats-App-Image-2024-12-05-at-17-39-10.jpg',
    stock: 31,
    options: [
      { quantity: 1, price: 27.80, isBestSeller: true },
    ]
  }
];

export default function BeluttiCosmeticosStore() {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { quantity: number; price: number }>>({});
  const [orderData, setOrderData] = useState<CustomerOrder>({
    nome: '',
    telefone: '',
    endereco: '',
    email: '',
    cep: '',
    marca: 'Minha Marca',
    pagamento: 'PIX'
  });
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);

  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCookies, setShowCookies] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedOrderDate = systemTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleItemSelection = (productId: string, quantity: number, price: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: { quantity, price }
    }));
  };

  const handleFieldUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setOrderData(prev => ({ ...prev, [id]: value }));
  };

  const cartTotal = useMemo(() => {
    return (Object.values(selectedOptions) as { quantity: number; price: number }[]).reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedOptions]);

  const submitOrderToWhatsApp = () => {
    if (!orderData.nome || !orderData.telefone || !orderData.endereco || !orderData.email || !orderData.cep) {
      setErrorMsg('Por favor, preencha todos os dados do pedido.');
      return;
    }

    if (Object.keys(selectedOptions).length === 0) {
      setErrorMsg('Por favor, selecione pelo menos um produto.');
      return;
    }

    let resumoStr = '';
    (Object.entries(selectedOptions) as [string, { quantity: number; price: number }][]).forEach(([id, data]) => {
      const item = CATALOG_ITEMS.find(p => p.id === id);
      resumoStr += `• ${item?.name}: ${data.quantity} un - R$ ${data.price.toFixed(2)}\n`;
    });

    const pagamentoFinal = orderData.pagamento === 'PIX' 
      ? 'PIX' 
      : `Cartão de Crédito (${selectedInstallment}x de R$ ${(cartTotal / selectedInstallment).toFixed(2)})`;

    const msg = `🛒 *NOVO PEDIDO - BELUTTI COSMÉTICOS*\n\n` +
      `👤 *Dados do Cliente:*\n` +
      `Nome: ${orderData.nome}\n` +
      `Telefone: ${orderData.telefone}\n` +
      `Endereço: ${orderData.endereco}\n` +
      `Email: ${orderData.email}\n` +
      `CEP: ${orderData.cep}\n\n` +
      `🏷️ *Marca:* ${orderData.marca}\n\n` +
      `📦 *Produtos:*\n${resumoStr}\n` +
      `💰 *TOTAL: R$ ${cartTotal.toFixed(2)}*\n` +
      `💳 *Pagamento:* ${pagamentoFinal}\n` +
      `📅 *Data:* ${formattedOrderDate}`;

    const whatsappNumber = '5573988143062'; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const requestWholesaleInfo = (itemName: string) => {
    const msg = `Olá! Tenho interesse em um pedido maior do produto: ${itemName}. Poderia me passar os valores de atacado?`;
    const whatsappNumber = '5573988143062';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-20">
      {/* Header / Info */}
      <header className="bg-neutral-900 text-white py-3 px-4 sticky top-0 z-50 shadow-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Package className="text-red-500" size={18} />
            <span className="uppercase tracking-wider">Belutti Cosméticos - Catálogo de Produtos</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="opacity-80">
              📦 Enviamos para todo o Brasil
            </span>
            <span className="hidden sm:inline opacity-80">
              💳 Parcelamento em até 6x
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
            CUIDADO <span className="text-red-600">PROFISSIONAL</span> PARA SEU CABELO
          </h1>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto">
            Produtos desenvolvidos com tecnologia avançada para proporcionar brilho, hidratação e saúde aos seus fios.
          </p>
        </section>

        {/* Ofertas em Destaque Section */}
        <section className="space-y-6">
          {/* Oferta do Dia Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-neutral-100 text-neutral-900 shadow-sm border border-neutral-200">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
                  KIT <span className="text-red-600">PROFISSIONAL</span> BELUTTI
                </h2>
                <p className="text-base md:text-lg font-medium text-neutral-600">
                  Resultados de salão no conforto da sua casa com tecnologia orgânica avançada.
                </p>
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] bg-neutral-200 px-3 py-1 rounded-full mb-2">Destaque do Catálogo</span>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter">R$ 27,90</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Valor unitário para pedidos via WhatsApp</span>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('oferta-dia');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full md:w-auto bg-neutral-900 text-white px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-md hover:bg-neutral-800 transition-all"
                >
                  VER DETALHES
                </button>
              </div>
              
              <div className="w-full md:w-1/2 relative">
                <img 
                  src="https://i.ibb.co/d4jX5Qm2/Chat-GPT-Image-5-04-2026-10-56-59.png" 
                  alt="Oferta do Dia" 
                  className="w-full h-auto object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Segunda Maior Oferta do Dia Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-sm">
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 p-8 md:p-12">
              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
                  REPARADOR <span className="text-yellow-500">DE PONTAS</span>
                </h2>
                <p className="text-base md:text-lg font-medium opacity-80">
                  Brilho intenso e restauração instantânea para todos os tipos de cabelo.
                </p>
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="text-xs font-black text-neutral-500 uppercase tracking-[0.2em] bg-neutral-200 px-3 py-1 rounded-full mb-2 border border-neutral-300">Linha Profissional</span>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter">R$ 29,90</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Valor unitário para pedidos via WhatsApp</span>
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('reparador');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full md:w-auto bg-white text-neutral-900 px-8 py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-md hover:bg-neutral-100 transition-all"
                >
                  VER DETALHES
                </button>
              </div>
              
              <div className="w-full md:w-1/2 relative">
                <img 
                  src="https://i.ibb.co/3YFwLGXb/Chat-GPT-Image-5-04-2026-11-23-08.png" 
                  alt="Segunda Maior Oferta" 
                  className="w-full h-auto object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
            <ShoppingBag className="text-neutral-900" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Produtos Disponíveis</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATALOG_ITEMS.map((item, idx) => (
              <motion.div 
                key={item.id}
                id={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-neutral-200 group flex flex-col hover:shadow-md transition-shadow"
              >
                {item.image && (
                  <div className="aspect-square overflow-hidden bg-white p-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4 flex-grow flex flex-col">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Package className="text-neutral-400" size={18} />
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold uppercase tracking-tight">{item.name}</h3>
                      </div>
                    </div>
                    
                    <div className="mt-2 mb-1 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-neutral-900 tracking-tighter">
                        R$ {item.options[0].price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        {item.id === 'oferta-dia' ? 'por kit' : 'por unidade'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                        Disponível em estoque
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 flex-grow">
                    {['oferta-dia', 'reparador', 'teia', 'ativador', 'liquida'].includes(item.id) ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 bg-neutral-50">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Quantidade</span>
                            <span className="text-2xl font-bold text-neutral-900">
                              {selectedOptions[item.id]?.quantity || 0} {item.id === 'oferta-dia' ? 'Kits' : 'Unid.'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                const currentQty = selectedOptions[item.id]?.quantity || 0;
                                if (currentQty > 0) {
                                  const unitPrice = item.options[0].price;
                                  handleItemSelection(item.id, currentQty - 1, (currentQty - 1) * unitPrice);
                                }
                              }}
                              className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all shadow-sm active:scale-90"
                            >
                              <Minus size={20} />
                            </button>
                            <button 
                              onClick={() => {
                                const currentQty = selectedOptions[item.id]?.quantity || 0;
                                const unitPrice = item.options[0].price;
                                handleItemSelection(item.id, currentQty + 1, (currentQty + 1) * unitPrice);
                              }}
                              className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-sm hover:bg-neutral-800 transition-all active:scale-90"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <span className="text-xs font-bold text-neutral-400 uppercase">Subtotal:</span>
                          <span className="text-xl font-bold text-neutral-900">
                            R$ {((selectedOptions[item.id]?.quantity || 0) * (item.options[0].price)).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      item.options.map((opt) => (
                        <label 
                          key={`${item.id}-${opt.quantity}`}
                          className={`
                            relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
                            ${selectedOptions[item.id]?.quantity === opt.quantity 
                              ? 'border-red-600 bg-red-50' 
                              : 'border-neutral-100 hover:border-neutral-200 bg-neutral-50'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name={item.id}
                              className="w-5 h-5 accent-red-600"
                              checked={selectedOptions[item.id]?.quantity === opt.quantity}
                              onChange={() => handleItemSelection(item.id, opt.quantity, opt.price)}
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-neutral-800">
                                {opt.quantity} {opt.quantity === 1 ? 'unidade' : 'unidades'}
                              </span>
                              {opt.isBestSeller && (
                                <span className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1">
                                  <Star size={10} fill="currentColor" /> Mais Vendido
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-lg font-black text-neutral-900">
                            R$ {opt.price.toFixed(2).replace('.', ',')}
                          </span>
                        </label>
                      ))
                    )}
                  </div>

                  <button 
                    onClick={() => requestWholesaleInfo(item.name)}
                    className="w-full mt-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-xl font-bold text-sm uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Quero um pedido maior
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hero Section */}
        <section className="text-center space-y-4 py-12 border-y border-neutral-100">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
            CUIDADO <span className="text-red-600">PROFISSIONAL</span> PARA SEU CABELO
          </h1>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto">
            Produtos desenvolvidos com tecnologia avançada para proporcionar brilho, hidratação e saúde aos seus fios.
          </p>
        </section>

        {/* Sobre Nós Section */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Sobre a Belutti</h2>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              A Belutti Cosméticos é dedicada a trazer o melhor da tecnologia capilar para o seu dia a dia. Nossos produtos são formulados com ingredientes de alta qualidade, focando em resultados reais e duradouros.
            </p>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              Acreditamos que cada pessoa merece um cuidado profissional, e trabalhamos incansavelmente para democratizar o acesso a cosméticos de alto desempenho, garantindo brilho, saúde e vitalidade para todos os tipos de fios.
            </p>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-6 rounded-2xl text-center space-y-2">
              <ShieldCheck className="mx-auto text-red-600" size={32} />
              <p className="text-xs font-bold uppercase">Qualidade Garantida</p>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl text-center space-y-2">
              <Truck className="mx-auto text-red-600" size={32} />
              <p className="text-xs font-bold uppercase">Entrega Rápida</p>
            </div>
          </div>
        </section>

        {/* Brand Selection */}
        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <ShieldCheck size={24} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">Escolha sua Marca</h2>
                <p className="text-xs text-neutral-500 font-medium">Personalize seu pedido conforme sua necessidade</p>
              </div>
            </div>
            <select 
              id="marca"
              value={orderData.marca}
              onChange={handleFieldUpdate}
              className="w-full md:w-80 p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 focus:ring-0 transition-all font-bold text-neutral-700 cursor-pointer"
            >
              <option value="Minha Marca">Quero com minha marca (Personalizado)</option>
              <option value="Belutti">Quero com marca Belutti (Original)</option>
            </select>
          </div>
        </section>

        {/* Customer Data */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-red-100 p-2 rounded-xl text-red-600">
              <User size={24} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Dados do Pedido</h2>
              <p className="text-xs text-neutral-500 font-medium">Preencha as informações para entrega e faturamento</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                <User size={12} /> Nome Completo
              </label>
              <input 
                type="text" 
                id="nome"
                value={orderData.nome}
                onChange={handleFieldUpdate}
                placeholder="Ex: Maria Silva"
                className="w-full p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                <MessageCircle size={12} /> WhatsApp
              </label>
              <input 
                type="tel" 
                id="telefone"
                value={orderData.telefone}
                onChange={handleFieldUpdate}
                placeholder="(00) 00000-0000"
                className="w-full p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                <MapPin size={12} /> Endereço Completo
              </label>
              <input 
                type="text" 
                id="endereco"
                value={orderData.endereco}
                onChange={handleFieldUpdate}
                placeholder="Rua, Número, Bairro, Cidade"
                className="w-full p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                <Hash size={12} /> CEP
              </label>
              <input 
                type="text" 
                id="cep"
                value={orderData.cep}
                onChange={handleFieldUpdate}
                placeholder="00000-000"
                className="w-full p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 transition-all outline-none"
              />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                <Mail size={12} /> E-mail para confirmação
              </label>
              <input 
                type="email" 
                id="email"
                value={orderData.email}
                onChange={handleFieldUpdate}
                placeholder="seu@email.com"
                className="w-full p-4 rounded-2xl bg-neutral-50 border-2 border-neutral-100 focus:border-red-600 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* Summary & Payment */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-neutral-900 text-white p-8 md:p-10 rounded-3xl shadow-xl space-y-8 sticky top-24">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold uppercase tracking-tight">Resumo do Pedido</h2>
            </div>
            
            <div className="space-y-4 min-h-[100px]">
              <AnimatePresence mode="popLayout">
                {Object.keys(selectedOptions).length === 0 ? (
                  <p className="text-neutral-500 italic text-sm">Nenhum produto selecionado...</p>
                ) : (
                  (Object.entries(selectedOptions) as [string, { quantity: number; price: number }][]).map(([id, data]) => {
                    const item = CATALOG_ITEMS.find(p => p.id === id);
                    return (
                      <motion.div 
                        key={id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-between items-center border-b border-white/5 pb-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{item?.name}</span>
                          <span className="text-xs text-neutral-500">{data.quantity}x unidades</span>
                        </div>
                        <span className="font-bold text-sm">R$ {data.price.toFixed(2).replace('.', ',')}</span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-neutral-400 font-bold uppercase text-xs tracking-widest">Total Geral</span>
                <span className="text-4xl font-black text-red-500">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Forma de Pagamento Escolhida:</span>
                <span className="text-sm font-bold text-white">
                  {orderData.pagamento === 'PIX' 
                    ? 'PIX (Aprovação Imediata)' 
                    : `${selectedInstallment}x de R$ ${(cartTotal / selectedInstallment).toFixed(2).replace('.', ',')} no Cartão`}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100 space-y-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <CreditCard className="text-red-600" size={24} />
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold uppercase tracking-tight">Pagamento Seguro</h2>
                  <p className="text-xs text-neutral-500 font-medium">Escolha como deseja finalizar sua compra</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setOrderData(prev => ({ ...prev, pagamento: 'PIX' }))}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-bold text-sm ${orderData.pagamento === 'PIX' ? 'border-red-600 bg-red-50 text-red-600' : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'}`}
                  >
                    <Hash size={20} />
                    PIX
                  </button>
                  <button 
                    onClick={() => setOrderData(prev => ({ ...prev, pagamento: 'Cartão de crédito' }))}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-bold text-sm ${orderData.pagamento === 'Cartão de crédito' ? 'border-red-600 bg-red-50 text-red-600' : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'}`}
                  >
                    <CreditCard size={20} />
                    CARTÃO
                  </button>
                </div>

                {orderData.pagamento === 'Cartão de crédito' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 overflow-hidden"
                  >
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Opções de Parcelamento:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          onClick={() => setSelectedInstallment(n)}
                          className={`
                            p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center
                            ${selectedInstallment === n 
                              ? 'border-red-600 bg-red-50 text-red-700' 
                              : 'border-neutral-50 hover:border-neutral-100 text-neutral-600'}
                          `}
                        >
                          <span className="text-xs font-bold">{n === 1 ? 'À vista' : `${n}x`}</span>
                          <span className="text-sm font-bold">R$ {(cartTotal / n).toFixed(2).replace('.', ',')}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-xs font-bold text-neutral-600 uppercase">Ambiente Seguro</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Truck size={18} />
                  </div>
                  <span className="text-xs font-bold text-neutral-600 uppercase">Entrega Garantida</span>
                </div>
              </div>
            </div>

            <button 
              onClick={submitOrderToWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold text-lg uppercase tracking-widest shadow-lg shadow-green-100 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} />
              FINALIZAR PELO WHATSAPP
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Perguntas Frequentes</h2>
            <p className="text-sm text-neutral-500">Tire suas dúvidas sobre nossos produtos e entregas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="font-bold text-neutral-900">Qual o prazo de entrega?</h3>
              <p className="text-sm text-neutral-600">O prazo varia de acordo com sua região, geralmente entre 3 a 7 dias úteis após a confirmação do pedido.</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="font-bold text-neutral-900">Os produtos são originais?</h3>
              <p className="text-sm text-neutral-600">Sim, todos os produtos são originais da Belutti Cosméticos e acompanham nota fiscal.</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="font-bold text-neutral-900">Como posso rastrear meu pedido?</h3>
              <p className="text-sm text-neutral-600">Após o envio, você receberá o código de rastreio diretamente no seu WhatsApp ou e-mail cadastrado.</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-2xl space-y-2">
              <h3 className="font-bold text-neutral-900">Quais as formas de pagamento?</h3>
              <p className="text-sm text-neutral-600">Aceitamos PIX com desconto e Cartão de Crédito em até 6x sem juros.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-neutral-900 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight">Ainda tem dúvidas?</h2>
            <p className="opacity-80 max-w-md">Nossa equipe de especialistas está pronta para te atender e ajudar na escolha dos melhores produtos.</p>
          </div>
          <button 
            onClick={() => window.open('https://wa.me/5573988143062', '_blank')}
            className="bg-white text-neutral-900 px-10 py-5 rounded-2xl font-bold text-lg uppercase tracking-widest hover:bg-neutral-100 transition-all flex items-center gap-3"
          >
            <MessageCircle size={24} />
            Falar com Especialista
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-16 bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-widest text-sm text-neutral-400">Belutti Cosméticos</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Qualidade profissional e tecnologia avançada para o cuidado dos seus cabelos.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-widest text-sm text-neutral-400">Links Úteis</h3>
              <ul className="text-xs text-neutral-500 space-y-2">
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">Política de Privacidade</button></li>
                <li><button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">Termos de Uso</button></li>
                <li><button className="hover:text-white transition-colors">Sobre Nós</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-widest text-sm text-neutral-400">Contato</h3>
              <p className="text-xs text-neutral-500">
                Email: contato@belutticosmeticos.com.br<br/>
                WhatsApp: (73) 98814-3062
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex justify-center gap-6 opacity-30 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
            </div>
            <p className="text-neutral-600 text-[10px] font-medium text-center">
              © 2026 Belutti Cosméticos Profissionais. Todos os direitos reservados.<br/>
              CNPJ: 34.380.287/0001-44 | Atendimento de Segunda a Sexta, das 09h às 18h.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookies && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white border-t border-neutral-200 shadow-2xl"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-600 font-medium text-center md:text-left">
                Utilizamos cookies para melhorar sua experiência em nosso site. Ao continuar navegando, você concorda com nossa <button onClick={() => setShowPrivacy(true)} className="underline font-bold">Política de Privacidade</button>.
              </p>
              <button 
                onClick={() => setShowCookies(false)}
                className="bg-neutral-900 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
              >
                Aceitar e Continuar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowPrivacy(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Política de Privacidade</h2>
                <div className="text-sm text-neutral-600 space-y-4 leading-relaxed">
                  <p>A Belutti Cosméticos valoriza a sua privacidade. Esta política descreve como coletamos e usamos seus dados.</p>
                  <h3 className="font-bold text-neutral-900">1. Coleta de Dados</h3>
                  <p>Coletamos informações como nome, e-mail e endereço apenas para processar seus pedidos e garantir a entrega dos produtos.</p>
                  <h3 className="font-bold text-neutral-900">2. Uso das Informações</h3>
                  <p>Seus dados são utilizados exclusivamente para a finalização da compra via WhatsApp e para o envio das mercadorias.</p>
                  <h3 className="font-bold text-neutral-900">3. Segurança</h3>
                  <p>Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms of Use Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 md:p-10 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowTerms(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Termos de Uso</h2>
                <div className="text-sm text-neutral-600 space-y-4 leading-relaxed">
                  <p>Ao acessar este site, você concorda com os seguintes termos e condições.</p>
                  <h3 className="font-bold text-neutral-900">1. Uso do Site</h3>
                  <p>Este site é destinado à apresentação de produtos capilares da marca Belutti e facilitação de pedidos via WhatsApp.</p>
                  <h3 className="font-bold text-neutral-900">2. Preços e Ofertas</h3>
                  <p>Os preços exibidos são promocionais e podem ser alterados sem aviso prévio. As ofertas são válidas enquanto durarem os estoques.</p>
                  <h3 className="font-bold text-neutral-900">3. Responsabilidade</h3>
                  <p>A Belutti Cosméticos não se responsabiliza por mau uso dos produtos após a entrega.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error Modal */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Atenção</h3>
              <p className="text-sm text-neutral-600">{errorMsg}</p>
              <button 
                onClick={() => setErrorMsg(null)}
                className="w-full bg-neutral-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
