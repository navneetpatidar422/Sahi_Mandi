
import React from 'react';
import { MapPin, Star, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface MandiCardProps {
  mandi: any;
  onClick: () => void;
  priceInfo?: {
    price: number;
    cropName: string;
  };
}

export function MandiCard({ mandi, onClick, priceInfo }: MandiCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="h-40 w-full relative overflow-hidden">
        <ImageWithFallback 
          src={mandi.image} 
          alt={mandi.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          <span>{mandi.trustScore}</span>
        </div>
        
        {mandi.isVerified && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold shadow-lg shadow-blue-900/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </div>
        )}

        {priceInfo && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-white/50 shadow-lg flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">{priceInfo.cropName}</p>
              <p className="text-lg font-bold text-green-700 leading-none">₹{priceInfo.price}</p>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">/ quintal</div>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors line-clamp-1">{mandi.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          {mandi.location}
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-green-600 font-semibold">{mandi.distance}</span>
        </div>

        <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {mandi.schedule.open} - {mandi.schedule.close}
          </div>
          <div className="bg-gray-50 p-1.5 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
