import React from 'react';
import { Card } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { GeneratedFlower, FlowerEntry } from './FlowerGenerator';
import { Sparkles, Heart } from 'lucide-react';

interface FlowerDisplayProps {
  flowerEntry: FlowerEntry;
  showAnimation?: boolean;
}

export function FlowerDisplay({ flowerEntry, showAnimation = false }: FlowerDisplayProps) {
  const { flower, mood } = flowerEntry;

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200 relative overflow-hidden">
      {/* 背景装饰 */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${flower.primaryColor}20, transparent 70%)`
        }}
      />
      
      <div className="relative z-10 text-center">
        {/* 主花朵区域 */}
        <div className="relative inline-block mb-4">
          {/* 光环效果 */}
          <motion.div
            className="absolute -inset-4 flex items-center justify-center"
            animate={{
              rotate: showAnimation ? [0, 360] : 0,
              scale: showAnimation ? [1, 1.1, 1] : 1
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <span className="text-4xl opacity-30">{flower.aura}</span>
          </motion.div>
          
          {/* 主花朵 */}
          <motion.div
            className="text-6xl relative z-10"
            animate={showAnimation ? {
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 1 }}
            style={{
              filter: `drop-shadow(0 0 10px ${flower.primaryColor}40)`
            }}
          >
            {flower.baseEmoji}
          </motion.div>
          
          {/* 装饰元素 */}
          <div className="absolute inset-0">
            {flower.decorations.map((decoration, index) => (
              <motion.div
                key={index}
                className={`absolute text-lg`}
                style={{
                  left: `${20 + (index * 40)}%`,
                  top: `${10 + (index * 20)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                animate={showAnimation ? {
                  y: [-5, 5, -5],
                  rotate: [-10, 10, -10],
                  opacity: [0.7, 1, 0.7]
                } : {}}
                transition={{
                  duration: 2 + index * 0.5,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              >
                {decoration}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 花朵信息 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl text-purple-800 mb-1">
              {mood.name}之花
            </h2>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: flower.primaryColor }}
            >
              {flower.description}
            </p>
          </div>
          
          {/* 色彩展示 */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-purple-600">花朵色彩</span>
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: flower.primaryColor }}
              />
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: flower.secondaryColor }}
              />
            </div>
          </div>
          
          {/* 关键词展示 */}
          {flowerEntry.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {flowerEntry.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full border"
                  style={{
                    backgroundColor: `${flower.secondaryColor}20`,
                    borderColor: `${flower.secondaryColor}40`,
                    color: flower.primaryColor
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 动画装饰 */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-4 right-4"
            >
              <Sparkles className="text-yellow-400 w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

// 迷你版花朵展示（用于日历视图）
interface MiniFlowerProps {
  flowerEntry: FlowerEntry;
  isToday?: boolean;
  onClick?: () => void;
}

export function MiniFlower({ flowerEntry, isToday = false, onClick }: MiniFlowerProps) {
  const { flower, mood } = flowerEntry;
  
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 ${
        isToday 
          ? 'border-purple-400 shadow-lg ring-2 ring-purple-200' 
          : 'border-purple-200 hover:border-purple-300'
      } bg-white/80 backdrop-blur-sm`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: `radial-gradient(circle, ${flower.primaryColor}15, white)`
      }}
    >
      {/* 主花朵 */}
      <span className="text-lg">{flower.baseEmoji}</span>
      
      {/* 装饰点 */}
      <div className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center">
        <span className="text-xs opacity-60">{flower.decorations[0]}</span>
      </div>
      
      {/* 光环效果 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <span className="text-xs opacity-20">{flower.aura}</span>
      </motion.div>
    </motion.button>
  );
}