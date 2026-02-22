/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLuckEights } from './hooks/useLuckEights';
import { PlayingCard } from './components/PlayingCard';
import { RulesModal } from './components/RulesModal';
import { SuitPicker } from './components/SuitPicker';
import { SUIT_SYMBOLS, SUIT_COLORS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Info } from 'lucide-react';

export default function App() {
  const { state, initGame, playCard, drawCard, handleSuitSelection } = useLuckEights();

  const topDiscard = state.discardPile[state.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-[#1e293b] border-b border-slate-700 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-black italic shadow-lg">8</div>
          <h1 className="text-xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">幸运 8 点</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-sm font-medium border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            {state.turn === 'player' ? '你的回合' : '对手正在思考...'}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Game Table */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full"></div>

        {/* AI Hand (Cao Camp) */}
        <div className="absolute top-12 left-0 right-0 flex flex-col items-center px-4">
          <div className="relative flex -space-x-12 sm:-space-x-20">
            {state.aiHand.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <PlayingCard card={card} isFlipped={false} className="shadow-2xl" />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 px-6 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full">
            <span className="text-xs sm:text-sm font-black tracking-[0.5em] text-rose-300 uppercase">曹营</span>
          </div>
          {state.aiHand.length === 0 && state.status === 'playing' && (
            <div className="text-rose-400 font-bold animate-bounce mt-2">曹操胜出！</div>
          )}
        </div>

        {/* Center Area: Deck & Discard */}
        <div className="flex items-center gap-12 sm:gap-24 my-12">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-2xl group-hover:bg-indigo-500/40 transition-all"></div>
            <button
              onClick={() => state.turn === 'player' && drawCard('player')}
              disabled={state.turn !== 'player' || state.deck.length === 0}
              className="relative"
            >
              {state.deck.length > 0 ? (
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-[86px] h-[129px] sm:w-[130px] sm:h-[195px] bg-slate-800 rounded-xl border border-slate-700"></div>
                  <div className="absolute -top-1 -left-1 w-[86px] h-[129px] sm:w-[130px] sm:h-[195px] bg-slate-700 rounded-xl border border-slate-600"></div>
                  <PlayingCard 
                    card={{ id: 'back', suit: 'spades', rank: 'A' }} 
                    isFlipped={false} 
                    className="hover:scale-105 transition-transform active:scale-95"
                  />
                  <div className="absolute -bottom-8 left-0 right-0 text-center text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest">
                    摸牌 ({state.deck.length})
                  </div>
                </div>
              ) : (
                <div className="w-[86px] h-[129px] sm:w-[130px] sm:h-[195px] border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-600 text-xs text-center p-4">
                  牌堆已空
                </div>
              )}
            </button>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {topDiscard && (
                <motion.div
                  key={topDiscard.id}
                  initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="relative"
                >
                  <PlayingCard card={topDiscard} disabled className="shadow-2xl ring-8 ring-slate-800" />
                  
                  {/* Current Suit Indicator (for 8s) */}
                  {state.currentSuit && (
                    <div className="absolute -top-6 -right-6 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-800 z-20">
                      <span className={`text-2xl sm:text-4xl ${SUIT_COLORS[state.currentSuit]}`}>
                        {SUIT_SYMBOLS[state.currentSuit]}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute -bottom-8 left-0 right-0 text-center text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest">
              弃牌堆
            </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2">
             <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] ${state.turn === 'player' ? 'bg-indigo-600 text-white shadow-xl ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
               {state.turn === 'player' ? '你的回合' : '等待对手'}
             </span>
          </div>
          <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex justify-center min-w-max px-12 -space-x-2 sm:-space-x-4">
              {state.playerHand.map((card, idx) => {
                const isPlayable = card.rank === '8' || card.suit === state.currentSuit || card.rank === state.currentRank;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ zIndex: idx }}
                    className="relative"
                  >
                    <PlayingCard 
                      card={card} 
                      onClick={() => state.turn === 'player' && playCard(card, 'player')}
                      disabled={state.turn !== 'player' || !isPlayable}
                      className={isPlayable ? 'ring-4 ring-indigo-500' : ''}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {state.status === 'rules' && (
          <RulesModal onStart={initGame} />
        )}
        
        {state.isSuitPickerOpen && (
          <SuitPicker onSelect={handleSuitSelection} />
        )}
        
        {state.status === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[60] p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
            >
              <div className="mb-6 inline-flex p-4 bg-indigo-100 rounded-full text-indigo-600">
                <Trophy size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">
                {state.winner === 'player' ? '你赢了！' : '对手赢了'}
              </h2>
              <p className="text-slate-500 mb-8">
                {state.winner === 'player' ? '汉室复兴有望！' : '曹贼势大，再接再厉。'}
              </p>
              <button
                onClick={initGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                再来一局
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Turn Indicator Overlay */}
      {state.turn === 'ai' && state.status === 'playing' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 sm:hidden bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 z-20">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">对手正在思考...</span>
        </div>
      )}
    </div>
  );
}
