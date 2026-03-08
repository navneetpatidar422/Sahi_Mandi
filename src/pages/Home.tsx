
import React, { useState } from 'react';
import { ArrowRight, TrendingUp, MapPin, Smartphone, CheckCircle2, BarChart3, Users, Search } from 'lucide-react';
import { motion } from 'motion/react';
import mandiBg from 'figma:asset/bc730f0680bf3af6c763248ec313e179c784a1b6.png';

interface HomeProps {
  onMandiSelect?: (mandiId: string) => void;
  onNavigate?: (page: string) => void;
  onSearch?: (query: string) => void;
}

export function Home({ onNavigate, onSearch }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    } else if (onNavigate) {
       onNavigate('mandis');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#0B0F19] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src={mandiBg}
            alt="Indian Mandi Market" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-48 lg:pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-300 text-sm font-medium">India's first Decision Support Platform for farmers</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Empowering Farmers with <span className="text-green-500">Right Prices</span> & Market Access
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              सही Mandi connects you directly to verified markets. It is a decision-support platform that helps farmers compare Latest mandi prices, distance, and net profit — so they can choose the best place to sell their crops.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate?.('mandis')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 group"
              >
                Find Mandi Near Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate?.('analyze')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
              >
                Analyse Prices Smartly
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-green-50 border-y border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Market Data', value: 'Real-Time' },
              { label: 'Price Analysis', value: 'AI-Driven' },
              { label: 'Farmer Connect', value: 'Direct' },
              { label: 'Mandi Network', value: 'Verified' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center md:text-left"
              >
                <div className="text-3xl font-bold text-green-700 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Provide */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Everything You Need to Grow
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We provide comprehensive tools and data to help you make informed decisions about your harvest.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin className="w-8 h-8 text-white" />}
              title="Mandi Discovery"
              desc="Locate the nearest verified mandis with our advanced geolocation search. Filter by distance, crop availability, and amenities."
              color="bg-orange-500"
              delay={0}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-white" />}
              title="Smart Price Analyzer"
              desc="Compare prices across multiple mandis side-by-side. View historical trends and forecast potential profits before you sell."
              color="bg-green-600"
              delay={0.2}
            />
            <FeatureCard 
              icon={<Smartphone className="w-8 h-8 text-white" />}
              title="Real-time Updates"
              desc="Get instant notifications on price changes and market news directly on your phone. Stay ahead of market fluctuations."
              color="bg-blue-500"
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-[#104a28] py-20 px-4">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto text-center"
         >
            <h2 className="text-3xl font-bold text-white mb-8">Find Verified Mandis Near You</h2>
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-full p-2 flex items-center shadow-2xl max-w-3xl mx-auto transition-transform hover:scale-[1.01]">
              <div className="pl-6 pr-4 text-gray-400">
                 <Search className="w-6 h-6" />
              </div>
              <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                 placeholder="Search for mandis (e.g. Azadpur, Nashik)..." 
              />
              <button 
                type="submit"
                className="bg-[#00B251] hover:bg-green-600 text-white text-lg font-bold px-8 py-3 rounded-full transition-colors shadow-md"
              >
                Search
              </button>
            </form>
         </motion.div>
      </div>

      {/* Feature Highlight Section */}
      <div className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1589292144899-2f43a71a1b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBpbiUyMGZpZWxkJTIwdXNpbmclMjBzbWFydHBob25lfGVufDF8fHx8MTc3MDAzMDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Farmer using app" 
                className="rounded-2xl shadow-2xl relative z-10 w-full hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            <div className="lg:w-1/2 space-y-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-900"
              >
                Take Control of Your Harvest
              </motion.h2>
              <div className="space-y-6">
                {[
                  { title: 'Transparent Pricing', desc: 'No hidden charges. See the exact rates being offered at different Mandis.' },
                  { title: 'Direct Farmer Connect', desc: 'Connect directly with verified buyers and Mandi agents without unnecessary middlemen.' },
                  { title: 'Government Schemes', desc: 'Stay updated with the latest government subsidies and support schemes for farmers.' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="bg-green-100 p-3 rounded-lg h-fit">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onClick={() => onNavigate?.('dashboard')}
                className="mt-4 text-green-600 font-bold text-lg hover:text-green-700 flex items-center gap-2 group"
              >
                Access Farmer Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#0B0F19] py-20 relative overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1697425206177-2ee963a17d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFibGUlMjBtYXJrZXR8ZW58MXx8fHwxNzcwMDMwMjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Market"
            className="w-full h-full object-cover opacity-20"
           />
         </div>
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-3xl md:text-5xl font-bold text-white"
           >
             Ready to get the best price for your crop?
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-xl text-gray-300"
           >
             Join thousands of farmers using सही Mandi to maximize their profits today.
           </motion.p>
           <motion.button 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             onClick={() => onNavigate?.('mandis')}
             className="bg-green-500 hover:bg-green-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1"
           >
             Start Exploring Now
           </motion.button>
         </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, delay }: { icon: any, title: string, desc: string, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group"
    >
      <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
