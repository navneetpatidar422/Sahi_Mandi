
import React, { useState } from 'react';
import { ShieldCheck, Lock, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Mandi Admin Portal</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Login to update prices and manage your mandi.</p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Government ID / Mandi ID</label>
            <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. MND-2024-8821" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input type="password" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
            Secure Login
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          Verification is mandatory for all administrators to prevent fraud.
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [prices, setPrices] = useState({ wheat: 2200, rice: 4500, tomato: 1200 });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500">Welcome back, Admin (ID: MND-8821)</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-green-100 text-green-800 px-3 py-1.5 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          System Live
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">128</div>
            <div className="text-sm text-gray-500">Today's Visitors</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="text-sm text-gray-500">Trust Score</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">+12%</div>
            <div className="text-sm text-gray-500">Volume Growth</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Update Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-800 text-lg">Update Daily Prices</h3>
            <span className="text-xs text-gray-400">Last updated: Today, 8:00 AM</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-700">Wheat (Grade A)</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={prices.wheat}
                  onChange={(e) => setPrices({...prices, wheat: parseInt(e.target.value)})}
                  className="w-28 p-2 border border-gray-200 rounded-lg text-right font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-700">Rice (Basmati)</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={prices.rice}
                  onChange={(e) => setPrices({...prices, rice: parseInt(e.target.value)})}
                  className="w-28 p-2 border border-gray-200 rounded-lg text-right font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-700">Tomato (Hybrid)</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">₹</span>
                <input 
                  type="number" 
                  value={prices.tomato}
                  onChange={(e) => setPrices({...prices, tomato: parseInt(e.target.value)})}
                  className="w-28 p-2 border border-gray-200 rounded-lg text-right font-bold focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-100">
            <Lock className="w-4 h-4" />
            Update & Publish Prices
          </button>
        </div>

        {/* Notifications / Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Important Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm">Heavy Rain Warning</h4>
                <p className="text-xs text-yellow-700 mt-1">Met department has issued a yellow alert for next 24 hours. Advise farmers to cover their produce.</p>
              </div>
            </div>
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 text-sm">New Transport Regulation</h4>
                <p className="text-xs text-blue-700 mt-1">Only verified trucks allowed in Gate No. 2 from tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
