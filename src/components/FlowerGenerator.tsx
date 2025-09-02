// 花朵生成逻辑
export interface Mood {
  id: string;
  name: string;
  emoji: string;
  /**
   * 预设色盘（可为空，若为空将走 HSL 程序化调色）
   */
  colors?: string[];
  /**
   * 候选花朵基底（从中做稳定随机选择），提升多样性
   */
  baseFlowers: string[];
}

export const MOODS: Mood[] = [
  {
    id: 'happy',
    name: '开心',
    emoji: '😊',
    colors: ['#FFD700', '#FF69B4', '#FFA500', '#FF1493'],
    baseFlowers: ['🌸', '🌼', '🌻', '💐']
  },
  {
    id: 'peaceful',
    name: '平静',
    emoji: '😌',
    colors: ['#87CEEB', '#98FB98', '#E0E6FF', '#B0E0E6'],
    baseFlowers: ['🌿', '🍃', '🍀']
  },
  {
    id: 'excited',
    name: '兴奋',
    emoji: '🤩',
    colors: ['#FF4500', '#FF6347', '#FFB6C1', '#FF69B4'],
    baseFlowers: ['🌺', '💮', '🌷']
  },
  {
    id: 'melancholy',
    name: '忧郁',
    emoji: '😔',
    colors: ['#9370DB', '#6A5ACD', '#483D8B', '#8A2BE2'],
    baseFlowers: ['🥀', '🪻', '🌾']
  },
  {
    id: 'grateful',
    name: '感恩',
    emoji: '🙏',
    colors: ['#F0E68C', '#DDA0DD', '#FFFFE0', '#F5DEB3'],
    baseFlowers: ['🌻', '🌼']
  },
  {
    id: 'dreamy',
    name: '梦幻',
    emoji: '✨',
    colors: ['#E6E6FA', '#DDA0DD', '#F0E68C', '#FFB6C1'],
    baseFlowers: ['🌙', '🪽', '🦋']
  },
  // 扩展更多情绪，增强多样性
  {
    id: 'focused',
    name: '专注',
    emoji: '🎯',
    colors: ['#6EE7B7', '#34D399', '#10B981', '#059669'],
    baseFlowers: ['🌵', '🌿']
  },
  {
    id: 'romantic',
    name: '浪漫',
    emoji: '💞',
    colors: ['#FF7EB6', '#FF4D8D', '#FFC0CB', '#FF99CC'],
    baseFlowers: ['🌹', '🌷', '💐']
  },
  {
    id: 'calm',
    name: '安宁',
    emoji: '🧘',
    colors: ['#A7F3D0', '#93C5FD', '#C7D2FE', '#BFDBFE'],
    baseFlowers: ['🪷', '🌿']
  },
  {
    id: 'hopeful',
    name: '希望',
    emoji: '🌟',
    colors: ['#FDE68A', '#FCD34D', '#F59E0B', '#FBBF24'],
    baseFlowers: ['🌼', '🌻']
  },
  {
    id: 'energetic',
    name: '元气',
    emoji: '⚡',
    colors: ['#F87171', '#FB923C', '#FBBF24', '#34D399'],
    baseFlowers: ['🌺', '🌷', '🌻']
  },
  {
    id: 'serene',
    name: '恬静',
    emoji: '🌙',
    colors: ['#C4B5FD', '#A78BFA', '#93C5FD', '#60A5FA'],
    baseFlowers: ['🪻', '🪷']
  }
];

export interface GeneratedFlower {
  baseEmoji: string;
  primaryColor: string;
  secondaryColor: string;
  decorations: string[];
  aura: string;
  description: string;
  /**
   * 可选：自定义图片/SVG 链接。如果存在，展示组件将以图片为主进行渲染
   */
  imageUrl?: string;
}

export interface FlowerEntry {
  date: string;
  mood: Mood;
  note: string;
  flower: GeneratedFlower;
  keywords: string[];
}

// 关键词到装饰的映射（扩充）
const KEYWORD_DECORATIONS: Record<string, string[]> = {
  '工作': ['💼', '📝', '⚡', '📈', '🧠'],
  '学习': ['📚', '✏️', '🎓', '🧪', '🧩'],
  '朋友': ['👫', '🤝', '💕', '🎉', '🥳'],
  '家人': ['🏠', '❤️', '👨‍👩‍👧‍👦', '🫶'],
  '运动': ['🏃‍♀️', '💪', '🌟', '🚴', '🏀'],
  '美食': ['🍰', '☕', '🍎', '🍣', '🍫', '🍜'],
  '旅行': ['✈️', '🗺️', '🎒', '🏝️', '🏔️'],
  '音乐': ['🎵', '🎶', '🎸', '🎹', '🎧'],
  '电影': ['🎬', '🍿', '📽️', '🎞️'],
  '阅读': ['📖', '📚', '✨', '🖋️'],
  '睡觉': ['😴', '🌙', '⭐', '🛌'],
  '雨天': ['🌧️', '☔', '💧', '⛈️'],
  '阳光': ['☀️', '🌈', '🌞', '🕶️'],
  '咖啡': ['☕', '🤎', '☁️', '🫘'],
  '猫': ['🐱', '🐾', '😸', '🧶'],
  '狗': ['🐶', '🐾', '🦴', '🎾'],
  '花': ['🌸', '🌺', '🌻', '💮', '🌷'],
  '树': ['🌳', '🍃', '🌿', '🌲'],
  '科技': ['💻', '⚙️', '🛰️', '🤖'],
  '自然': ['⛰️', '🏞️', '🌊', '🍀'],
  '艺术': ['🎨', '🖼️', '🖌️', '🎭'],
};

// 光环效果（扩充）
const AURAS = ['✨', '💫', '🌟', '⭐', '💖', '🔮', '🌈', '🔥', '❄️', '🫧'];

// 稳定随机工具：基于字符串种子与可选 salt 生成 0..1 的伪随机数
function seededRandom01(seed: number, salt = 0): number {
  let t = seed ^ (salt * 374761393);
  t = (t ^ (t >>> 13)) * 1274126177;
  t = (t ^ (t >>> 16)) >>> 0;
  return (t % 10000) / 10000;
}

function pickStable<T>(arr: T[], seed: number, salt = 0): T {
  if (arr.length === 0) throw new Error('Cannot pick from empty array');
  const r = seededRandom01(seed, salt);
  return arr[Math.floor(r * arr.length) % arr.length];
}

// 通过 HSL 程序化生成两种颜色（与 mood 预设色盘混合）
function generateColorsFromHue(seed: number, moodColors?: string[]): { primary: string; secondary: string } {
  const baseHue = Math.floor(seededRandom01(seed, 1) * 360);
  const sat = 60 + Math.floor(seededRandom01(seed, 2) * 30); // 60-90
  const light = 55 + Math.floor(seededRandom01(seed, 3) * 20); // 55-75
  const hueShift = 20 + Math.floor(seededRandom01(seed, 4) * 40); // 20-60
  const hsl1 = `hsl(${baseHue}, ${sat}%, ${light}%)`;
  const hsl2 = `hsl(${(baseHue + hueShift) % 360}, ${Math.max(40, sat - 10)}%, ${Math.max(40, light - 10)}%)`;

  if (!moodColors || moodColors.length === 0) {
    return { primary: hsl1, secondary: hsl2 };
  }

  // 将程序色与预设色盘做稳定随机混合，提升一致性与差异性
  const usePresetFirst = seededRandom01(seed, 5) > 0.5;
  const presetA = pickStable(moodColors, seed, 6);
  const presetB = pickStable(moodColors, seed, 7);
  return usePresetFirst
    ? { primary: presetA, secondary: hsl2 }
    : { primary: hsl1, secondary: presetB };
}

// ========================= 自定义花朵库（可扩展） =========================
export type CustomFlowerRarity = 'common' | 'rare' | 'legendary';

export interface CustomFlower {
  id: string;
  name: string;
  imageUrl: string; // 支持 png/jpg/svg 的公网链接或相对路径
  tags: string[];   // 与关键词匹配的主题标签，如 '音乐'、'旅行'
  rarity?: CustomFlowerRarity; // 稀有度影响抽样概率
}

// 你可以在这里不断添加自己的作品链接（隐藏款）
export const CUSTOM_FLOWERS: CustomFlower[] = [
  {
    id: 'dream-aqua-001',
    name: '梦海蓝',
    imageUrl: 'https://example.com/flowers/dream-aqua.svg',
    tags: ['梦幻', '睡觉', '自然'],
    rarity: 'rare'
  },
  {
    id: 'sunny-pop-002',
    name: '晴彩',
    imageUrl: 'https://example.com/flowers/sunny-pop.svg',
    tags: ['阳光', '开心', '运动'],
    rarity: 'common'
  },
  // 在此继续追加你的图片链接...
  {
    id: 'dream-serene-001',
    name: '梦幻·恬静',
    imageUrl: 'https://shellykoi.github.io/Flower-mood/flowers/dream-serene-001.jpg',
    tags: ['梦幻', '恬静', '平静', '夜色'],
    rarity: 'legendary'
  },
];

function weightOfRarity(rarity: CustomFlowerRarity | undefined): number {
  if (rarity === 'legendary') return 6;
  if (rarity === 'rare') return 3;
  return 1; // common 或未指定
}

function pickCustomFlower(keywords: string[], seed: number): CustomFlower | null {
  if (CUSTOM_FLOWERS.length === 0) return null;

  // 为匹配到的自定义花朵加权；若没有关键词匹配，也允许少量随机掉落
  const candidates = CUSTOM_FLOWERS.map((f) => {
    const matches = f.tags.some(t => keywords.includes(t));
    const rarityWeight = weightOfRarity(f.rarity);
    const matchWeight = matches ? 3 : 1; // 关键词匹配权重
    return { f, w: rarityWeight * matchWeight };
  });

  const total = candidates.reduce((s, c) => s + c.w, 0);
  if (total === 0) return null;

  // 稳定随机抽样
  let r = seededRandom01(seed, 50) * total;
  for (const c of candidates) {
    if ((r -= c.w) <= 0) {
      return c.f;
    }
  }
  return candidates[candidates.length - 1].f;
}

export function generateFlower(mood: Mood, note: string): FlowerEntry {
  const today = new Date().toISOString().split('T')[0];
  
  // 提取关键词
  const keywords = extractKeywords(note);
  
  // 稳定随机种子：每日不同且与笔记相关
  const seed = hashString(`${note}|${today}|${mood.id}`);

  // 从关键词装饰中做稳定随机抽样（最多 3 个）
  const decorationPool: string[] = [];
  keywords.forEach((keyword, idx) => {
    const list = KEYWORD_DECORATIONS[keyword];
    if (list && list.length > 0) {
      // 每个关键词稳定选 1 个
      decorationPool.push(pickStable(list, seed, 100 + idx));
    }
  });
  if (decorationPool.length === 0) {
    decorationPool.push('💖', '✨', '🌟');
  }
  const decorations = decorationPool.slice(0, 3);

  // 选择颜色（HSL 程序化 + 预设色盘混合）
  const { primary: primaryColor, secondary: secondaryColor } = generateColorsFromHue(seed, mood.colors);

  // 选择光环（稳定随机）
  const aura = pickStable(AURAS, seed, 11);

  // 选择基底花朵（稳定随机）
  const baseEmoji = pickStable(mood.baseFlowers, seed, 12);

  // 按权重与关键词尝试选用“自定义花朵库”的图片
  // 基础触发概率：20%；若关键词命中自定义条目的 tag 则更容易触发
  const tryCustom = seededRandom01(seed, 13) > 0.8 || keywords.length > 0;
  const custom = tryCustom ? pickCustomFlower(keywords, seed) : null;

  // 生成描述
  const description = generateDescription(mood, keywords, seed);
  
  return {
    date: today,
    mood,
    note,
    keywords,
    flower: {
      baseEmoji,
      primaryColor,
      secondaryColor,
      decorations,
      aura,
      description,
      imageUrl: custom?.imageUrl
    }
  };
}

function extractKeywords(note: string): string[] {
  const keywords: string[] = [];
  Object.keys(KEYWORD_DECORATIONS).forEach(keyword => {
    if (note.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  return keywords;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

function generateDescription(mood: Mood, keywords: string[], seed: number): string {
  const templates: Record<string, string[]> = {
    happy: ['今天的花朵充满阳光', '绽放着快乐的光芒', '散发着温暖的香气'],
    peaceful: ['静谧如湖水般清澈', '带着宁静的力量', '散发着淡雅的芬芳'],
    excited: ['充满活力的花朵', '像烟花一样绚烂', '闪闪发光的花瓣'],
    melancholy: ['带着深沉的美丽', '如诗歌般忧郁', '有着独特的魅力'],
    grateful: ['温暖如拥抱的花朵', '散发着感恩的光辉', '充满爱与希望'],
    dreamy: ['如梦境般美丽', '飘散着仙气', '充满奇幻色彩'],
    focused: ['专注而坚定', '线条简洁有力', '如晨露般清透'],
    romantic: ['粉色的气息在空气中流淌', '轻语着浪漫', '如诗如画'],
    calm: ['云淡风轻', '安宁在花瓣间蔓延', '呼吸顺滑而温和'],
    hopeful: ['带来温暖的希望', '金色光辉轻抚花瓣', '向阳而生'],
    energetic: ['跃动的色彩', '充满能量的律动', '像跃起的心跳'],
    serene: ['月光般清澈', '静夜的温柔', '悠然自得'],
  };

  const base = templates[mood.id] || ['美丽的花朵'];
  const picked = pickStable(base, seed, 200);
  const withKeyword = keywords.length > 0
    ? `${picked}，承载着关于${keywords.join('、')}的美好回忆`
    : picked;
  return withKeyword;
}