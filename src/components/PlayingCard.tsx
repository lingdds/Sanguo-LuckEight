import React from 'react';
import { Card } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';
import { motion } from 'motion/react';

interface PlayingCardProps {
  card: Card;
  onClick?: () => void;
  isFlipped?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  onClick,
  isFlipped = true,
  disabled = false,
  className = '',
}) => {
  if (!isFlipped) {
    return (
      <motion.div
        layoutId={card.id}
        className={`w-[86px] h-[129px] sm:w-[130px] sm:h-[195px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center relative overflow-hidden ${className}`}
      >
        {/* Modern Geometric Pattern Background */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px' 
        }}></div>
        
        <div className="absolute inset-2 border-2 border-white/30 rounded-lg flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-md">
          <div className="flex flex-col items-center z-10">
            <div className="text-white text-4xl sm:text-7xl font-calligraphy select-none leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              三国
            </div>
            <div className="mt-2 w-12 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-2 left-2 text-white/40 text-[8px] sm:text-[10px] font-black tracking-widest uppercase">LUCK</div>
        <div className="absolute bottom-2 right-2 text-white/40 text-[8px] sm:text-[10px] font-black tracking-widest uppercase rotate-180">LUCK</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      whileHover={!disabled ? { y: -15, scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        w-[86px] h-[129px] sm:w-[130px] sm:h-[195px] bg-white rounded-xl shadow-xl border-2 border-zinc-100 
        flex flex-col justify-between p-2 sm:p-4 cursor-pointer select-none relative overflow-hidden
        ${disabled ? 'opacity-80 grayscale-[0.2] cursor-not-allowed' : 'hover:shadow-2xl'}
        ${className}
      `}
    >
      {/* Top Left */}
      <div className={`flex flex-col items-center w-fit leading-none ${SUIT_COLORS[card.suit]}`}>
        <span className="text-xl sm:text-3xl font-black tracking-tighter">{card.rank}</span>
        <span className="text-sm sm:text-xl">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
      
      {/* Center Suit */}
      <div className={`text-4xl sm:text-7xl self-center ${SUIT_COLORS[card.suit]} opacity-90`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      
      {/* Bottom Right (Symmetrical) */}
      <div className={`flex flex-col items-center w-fit leading-none self-end rotate-180 ${SUIT_COLORS[card.suit]}`}>
        <span className="text-xl sm:text-3xl font-black tracking-tighter">{card.rank}</span>
        <span className="text-sm sm:text-xl">{SUIT_SYMBOLS[card.suit]}</span>
      </div>
    </motion.div>
  );
};
