import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Droplets, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingElements } from './FloatingElements';
import { useSoundFeedback } from './SoundFeedback';
import { StatsPanel } from './StatsPanel';

interface FlowerData {
  date: string;
  stage: 'seed' | 'sprout' | 'small' | 'bloom';
  watered: boolean;
  waterCount: number;
}

const FlowerStages = {
  seed: { emoji: '🌱', name: '种子', description: '等待发芽' },
  sprout: { emoji: '🌿', name: '发芽', description: '正在成长' },
  small: { emoji: '🌸', name: '小苗', description: '茁壮成长' },
  bloom: { emoji: '🌺', name: '盛开', description: '美丽绽放' }
};

export function FlowerGarden() {
  const [flowers, setFlowers] = useState<Record<string, FlowerData>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAnimation, setShowAnimation] = useState(false);
  const { playWaterSound, playGrowthSound } = useSoundFeedback();

  useEffect(() => {
    const savedFlowers = localStorage.getItem('flowerGarden');
    if (savedFlowers) {
      setFlowers(JSON.parse(savedFlowers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowerGarden', JSON.stringify(flowers));
  }, [flowers]);

  const getTodaysFlower = () => {
    const today = new Date().toISOString().split('T')[0];
    return flowers[today] || { date: today, stage: 'seed', watered: false, waterCount: 0 };
  };

  const waterFlower = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentFlower = getTodaysFlower();
    
    if (currentFlower.watered) return;

    const newWaterCount = currentFlower.waterCount + 1;
    let newStage = currentFlower.stage;
    const oldStage = currentFlower.stage;
    
    if (newWaterCount >= 1 && currentFlower.stage === 'seed') newStage = 'sprout';
    if (newWaterCount >= 3 && currentFlower.stage === 'sprout') newStage = 'small';
    if (newWaterCount >= 5 && currentFlower.stage === 'small') newStage = 'bloom';

    setFlowers(prev => ({
      ...prev,
      [today]: {
        ...currentFlower,
        watered: true,
        waterCount: newWaterCount,
        stage: newStage
      }
    }));

    // 播放音效
    playWaterSound();
    if (newStage !== oldStage) {
      setTimeout(() => playGrowthSound(), 300);
    }

    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
  };

  const getRecentFlowers = () => {
    const recent = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      recent.push({
        date: dateString,
        flower: flowers[dateString] || { date: dateString, stage: 'seed', watered: false, waterCount: 0 }
      });
    }
    return recent;
  };

  const todaysFlower = getTodaysFlower();
  const recentFlowers = getRecentFlowers();
  const currentStage = FlowerStages[todaysFlower.stage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 relative">
      <FloatingElements />
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl text-green-800 mb-2">我的花园</h1>
          <p className="text-green-600">每天浇水，看花儿成长</p>
        </div>

        {/* Today's Flower */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="text-center">
            <div className="text-6xl mb-4 relative">
              <motion.div
                animate={{ 
                  scale: showAnimation ? [1, 1.2, 1] : 1,
                  rotate: showAnimation ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {currentStage.emoji}
              </motion.div>
              
              <AnimatePresence>
                {showAnimation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="text-yellow-400 w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <h2 className="text-xl text-green-800 mb-2">{currentStage.name}</h2>
            <p className="text-green-600 mb-4">{currentStage.description}</p>
            
            <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-700">
              <Droplets className="w-4 h-4" />
              <span>已浇水 {todaysFlower.waterCount} 次</span>
            </div>

            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                onClick={waterFlower}
                disabled={todaysFlower.watered}
                className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 touch-manipulation"
                size="lg"
              >
              {todaysFlower.watered ? (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  今天已浇水
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4 mr-2" />
                  浇水
                </>
              )}
              </Button>
            </motion.div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="flex items-center justify-between text-sm text-green-700 mb-2">
            <span>成长进度</span>
            <span>{todaysFlower.waterCount}/5</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((todaysFlower.waterCount / 5) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </Card>

        {/* Recent Flowers */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-green-600" />
            <h3 className="text-green-800">最近一周</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {recentFlowers.map(({ date, flower }) => {
              const dayName = new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' });
              const isToday = date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={date} className="text-center">
                  <div className="text-xs text-green-600 mb-1">{dayName}</div>
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      isToday ? 'bg-green-200 ring-2 ring-green-400' : 'bg-green-50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {FlowerStages[flower.stage].emoji}
                  </motion.div>
                  {flower.watered && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stats Panel */}
        <StatsPanel flowers={flowers} />

        {/* Tips */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="text-center text-sm text-green-700">
            <p className="mb-2">💡 小贴士</p>
            <p>每天坚持浇水，花儿会越长越美丽哦！</p>
          </div>
        </Card>
      </div>
    </div>
  );
}