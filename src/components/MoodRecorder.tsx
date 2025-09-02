import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MOODS, Mood } from './FlowerGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Edit3, Save } from 'lucide-react';

interface MoodRecorderProps {
  onComplete: (mood: Mood, note: string) => void;
  isCompleted: boolean;
  existingMood?: Mood;
  existingNote?: string;
}

export function MoodRecorder({ onComplete, isCompleted, existingMood, existingNote }: MoodRecorderProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(existingMood || null);
  const [note, setNote] = useState(existingNote || '');
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const handleSubmit = () => {
    if (selectedMood && note.trim()) {
      onComplete(selectedMood, note.trim());
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isCompleted && !isEditing) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
        <div className="text-center">
          <div className="text-4xl mb-2">{existingMood?.emoji}</div>
          <h3 className="text-purple-800 mb-2">今日心情：{existingMood?.name}</h3>
          <p className="text-purple-600 text-sm mb-4 break-words">{existingNote}</p>
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            编辑
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
      <div className="text-center mb-6">
        <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <h2 className="text-purple-800 mb-1">记录今日</h2>
        <p className="text-purple-600 text-sm">选择心情，写下感受，生成专属花朵</p>
      </div>

      {/* 心情选择 */}
      <div className="mb-6">
        <label className="block text-purple-700 text-sm mb-3">今天的心情</label>
        <div className="grid grid-cols-3 gap-3">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedMood?.id === mood.id
                  ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg ring-2 ring-purple-200'
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-25 hover:to-pink-25'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-purple-700">{mood.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 文字记录 */}
      <div className="mb-6">
        <label className="block text-purple-700 text-sm mb-3">今日记录</label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写下今天发生的事情、感受或想法..."
          className="min-h-[100px] border-purple-200 focus:border-purple-400 focus:ring-purple-400 resize-none"
          maxLength={200}
        />
        <div className="text-xs text-purple-500 mt-1 text-right">
          {note.length}/200
        </div>
      </div>

      {/* 提交按钮 */}
      <AnimatePresence>
        {selectedMood && note.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                生成我的花朵
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 小贴士 */}
      {!selectedMood || !note.trim() ? (
        <div className="mt-4 text-center">
          <p className="text-xs text-purple-500">
            💡 选择心情和写下记录后，就能生成你的专属花朵啦
          </p>
        </div>
      ) : null}
    </Card>
  );
}