import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Calendar, Palette, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { FloatingElements } from './FloatingElements';
import { useSoundFeedback } from './SoundFeedback';
import { MoodRecorder } from './MoodRecorder';
import { FlowerDisplay, MiniFlower } from './FlowerDisplay';
import { FlowerEntry, generateFlower, Mood } from './FlowerGenerator';

export function DreamFlowerGarden() {
  const [flowers, setFlowers] = useState<Record<string, FlowerEntry>>({});
  const [showAnimation, setShowAnimation] = useState(false);
  const { playGrowthSound } = useSoundFeedback();

  useEffect(() => {
    const savedFlowers = localStorage.getItem('dreamFlowerGarden');
    if (savedFlowers) {
      setFlowers(JSON.parse(savedFlowers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreamFlowerGarden', JSON.stringify(flowers));
  }, [flowers]);

  const getTodayEntry = (): FlowerEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return flowers[today] || null;
  };

  const handleRecordComplete = (mood: Mood, note: string) => {
    const newEntry = generateFlower(mood, note);
    
    setFlowers(prev => ({
      ...prev,
      [newEntry.date]: newEntry
    }));

    // 播放音效和动画
    playGrowthSound();
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  const getRecentFlowers = () => {
    const recent = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const entry = flowers[dateString];
      recent.push({
        date: dateString,
        entry
      });
    }
    return recent;
  };

  const getStats = () => {
    const flowersList = Object.values(flowers);
    const totalFlowers = flowersList.length;
    const moodCounts = flowersList.reduce((acc, entry) => {
      acc[entry.mood.name] = (acc[entry.mood.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteKeywords = flowersList
      .flatMap(entry => entry.keywords)
      .reduce((acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    const topKeywords = Object.entries(favoriteKeywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([keyword]) => keyword);

    return {
      totalFlowers,
      topMood: topMood ? topMood[0] : null,
      topKeywords,
      currentStreak: getCurrentStreak()
    };
  };

  const getCurrentStreak = (): number => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (flowers[dateString]) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const todayEntry = getTodayEntry();
  const recentFlowers = getRecentFlowers();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 relative">
      <FloatingElements />
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl text-purple-800 mb-2">精怪小湲的花</h1>
          <p className="text-purple-600">用来给koi使用，记录她的心情</p>
        </div>

        {/* 今日记录或花朵展示 */}
        {todayEntry ? (
          <FlowerDisplay 
            flowerEntry={todayEntry} 
            showAnimation={showAnimation}
          />
        ) : (
          <MoodRecorder
            onComplete={handleRecordComplete}
            isCompleted={false}
          />
        )}

        {/* 最近一周花朵 */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-purple-600" />
            <h3 className="text-purple-800">最近一周</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {recentFlowers.map(({ date, entry }) => {
              const dayName = new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' });
              const isToday = date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={date} className="text-center">
                  <div className="text-xs text-purple-600 mb-1">{dayName}</div>
                  {entry ? (
                    <MiniFlower
                      flowerEntry={entry}
                      isToday={isToday}
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full border-2 border-dashed border-purple-200 flex items-center justify-center ${
                      isToday ? 'border-purple-400' : ''
                    }`}>
                      <span className="text-purple-300 text-xs">未记录</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 统计面板 */}
        {stats.totalFlowers > 0 && (
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200">
            <h3 className="text-purple-800 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              花园统计
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center p-3 bg-purple-50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl text-purple-600 mb-1">{stats.totalFlowers}</div>
                <div className="text-sm text-purple-700">朵花</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-pink-50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl text-pink-600 mb-1">{stats.currentStreak}</div>
                <div className="text-sm text-pink-700">连续天数</div>
              </motion.div>
              
              {stats.topMood && (
                <motion.div 
                  className="text-center p-3 bg-blue-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg text-blue-600 mb-1">{stats.topMood}</div>
                  <div className="text-sm text-blue-700">常见心情</div>
                </motion.div>
              )}
              
              {stats.topKeywords.length > 0 && (
                <motion.div 
                  className="text-center p-3 bg-green-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-sm text-green-600 mb-1">
                    {stats.topKeywords.join('、')}
                  </div>
                  <div className="text-sm text-green-700">热门话题</div>
                </motion.div>
              )}
            </div>
            
            {stats.totalFlowers >= 7 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center"
              >
                <div className="text-purple-800 flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  你已经拥有了一个美丽的梦幻花园！ ✨
                </div>
              </motion.div>
            )}
          </Card>
        )}

        {/* 使用提示 */}
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="text-center text-sm text-purple-700">
            <p className="mb-2">✨ 小贴士</p>
            <p>每天记录心情和感受，AI会为你生成独一无二的梦幻花朵！</p>
          </div>
        </Card>
      </div>
    </div>
  );
}