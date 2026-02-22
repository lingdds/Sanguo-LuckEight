import React from 'react';
import { motion } from 'motion/react';

interface RulesModalProps {
  onStart: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
      >
        <h1 className="text-3xl font-black mb-6 text-zinc-900 border-b pb-4">
          幸运 8 点 <span className="text-indigo-600">Luck Eights</span>
        </h1>
        
        <div className="space-y-4 text-zinc-700 leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
          <section>
            <h3 className="font-bold text-lg text-zinc-900 mb-1">游戏目标</h3>
            <p>最先出完手中所有牌的玩家获胜。</p>
          </section>
          
          <section>
            <h3 className="font-bold text-lg text-zinc-900 mb-1">发牌规则</h3>
            <p>使用 52 张标准扑克牌。每位玩家（你和 AI）初始分得 8 张牌。</p>
          </section>
          
          <section>
            <h3 className="font-bold text-lg text-zinc-900 mb-1">出牌逻辑</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>你出的牌必须在<span className="font-semibold text-indigo-600">花色</span>或<span className="font-semibold text-indigo-600">点数</span>上与弃牌堆顶部的牌匹配。</li>
              <li><span className="font-semibold text-red-600">数字 8 是万能牌！</span>你可以在任何时候打出 8。</li>
              <li>打出 8 后，你可以指定一个新的花色。</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-bold text-lg text-zinc-900 mb-1">摸牌规则</h3>
            <p>如果你无牌可出，必须从摸牌堆摸一张牌。如果摸牌堆为空，则跳过该回合。</p>
          </section>
        </div>
        
        <button
          onClick={onStart}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          开始游戏
        </button>
      </motion.div>
    </div>
  );
};
