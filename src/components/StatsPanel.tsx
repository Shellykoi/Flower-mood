import React from 'react';
import { Card } from './ui/card';
import { Trophy, Target, Calendar, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface FlowerData {
  date: string;
  stage: 'seed' | 'sprout' | 'small' | 'bloom';
  watered: boolean;
  waterCount: number;
}

interface StatsPanelProps {
  flowers: Record<string, FlowerData>;
}

export function StatsPanel({ flowers }: StatsPanelProps) {
  const stats = React.useMemo(() => {
    const flowersList = Object.values(flowers);
    const totalWatered = flowersList.filter(f => f.watered).length;
    const totalBloomed = flowersList.filter(f => f.stage === 'bloom').length;
    const currentStreak = getCurrentStreak(flowers);
    const totalWaterCount = flowersList.reduce((sum, f) => sum + f.waterCount, 0);
    
    return {
      totalWatered,
      totalBloomed,
      currentStreak,
      totalWaterCount
    };
  }, [flowers]);

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-green-200">
      <h3 className="text-green-800 mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        我的成就
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="text-center p-3 bg-green-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl text-green-600 mb-1">{stats.totalWatered}</div>
          <div className="text-sm text-green-700 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" />
            总浇水天数
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-purple-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl text-purple-600 mb-1">{stats.totalBloomed}</div>
          <div className="text-sm text-purple-700 flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3" />
            花朵盛开数
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-blue-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl text-blue-600 mb-1">{stats.currentStreak}</div>
          <div className="text-sm text-blue-700 flex items-center justify-center gap-1">
            <Target className="w-3 h-3" />
            连续天数
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center p-3 bg-orange-50 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl text-orange-600 mb-1">{stats.totalWaterCount}</div>
          <div className="text-sm text-orange-700 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            总浇水次数
          </div>
        </motion.div>
      </div>
      
      {stats.totalBloomed >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg text-center"
        >
          <div className="text-yellow-800 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            恭喜！你已经是资深园丁了！ 🌺
          </div>
        </motion.div>
      )}
    </Card>
  );
}

function getCurrentStreak(flowers: Record<string, FlowerData>): number {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    if (flowers[dateString]?.watered) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}