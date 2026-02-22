import React from 'react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, SUITS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
      >
        <h3 className="text-2xl font-bold mb-6 text-zinc-800">选择一个花色</h3>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-xl border-2 border-zinc-100
                hover:border-indigo-500 hover:bg-indigo-50 transition-all group
              `}
            >
              <span className={`text-4xl mb-2 ${SUIT_COLORS[suit]}`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-sm font-medium text-zinc-600 capitalize">
                {suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
