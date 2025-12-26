'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mix, KnowledgeNote } from '@/types';

interface AppContextType {
  // Мои миксы
  myMixes: Mix[];
  addMix: (mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMix: (id: string, mix: Partial<Mix>) => void;
  deleteMix: (id: string) => void;
  
  // Готовые миксы (шаблоны)
  readyMixes: Mix[];
  addReadyMix: (mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // База знаний
  knowledgeNotes: KnowledgeNote[];
  addNote: (note: Omit<KnowledgeNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<KnowledgeNote>) => void;
  deleteNote: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MY_MIXES: 'hok-mix-my-mixes',
  READY_MIXES: 'hok-mix-ready-mixes',
  KNOWLEDGE_NOTES: 'hok-mix-knowledge-notes',
};

// Начальные заметки базы знаний
const initialKnowledgeNotes: KnowledgeNote[] = [
  {
    id: '1',
    title: 'Способы забивки кальяна',
    content: `1. ПЛОТНАЯ ЗАБИВКА (Dense Pack)
- Табак укладывается плотно, без воздушных карманов
- Подходит для темных табаков (Dark Leaf)
- Не нужно фольги или калауда
- Время курения: 60-90 минут

2. ПУШИСТАЯ ЗАБИВКА (Fluffy Pack)
- Табак засыпается свободно, рыхло
- Подходит для светлых табаков (Blonde Leaf)
- Нужна фольга или калауд
- Время курения: 40-60 минут

3. ПЛОСКАЯ ЗАБИВКА (Flat Pack)
- Табак укладывается ровным слоем
- Универсальный способ
- Подходит для большинства табаков

ВАЖНО: Табак не должен касаться фольги/калауда!`,
    category: 'Способы забивки',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Популярные вкусы табака',
    content: `ФРУКТОВЫЕ:
- Двойное яблоко (Double Apple) - классика
- Манго - сладкий, тропический
- Клубника - сладкий, ягодный
- Вишня - кисло-сладкий
- Арбуз - освежающий, летний

ЦИТРУСОВЫЕ:
- Лимон - кислый, освежающий
- Лайм - более кислый чем лимон
- Апельсин - сладкий цитрус
- Грейпфрут - горьковатый

МЯТНЫЕ:
- Мята - классическое охлаждение
- Ментол - сильное охлаждение
- Мята + лимон - освежающий микс

ДЕСЕРТНЫЕ:
- Ваниль - сладкий, кремовый
- Шоколад - насыщенный
- Карамель - сладкий
- Тирамису - кофейно-сливочный

ЭКЗОТИЧЕСКИЕ:
- Роза - цветочный, нежный
- Жасмин - цветочный, ароматный
- Пачули - пряный, восточный`,
    category: 'Вкусы',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    title: 'Уход за кальяном',
    content: `ПОСЛЕ КАЖДОГО ИСПОЛЬЗОВАНИЯ:

1. Промыть колбу теплой водой
2. Очистить шахту ершиком
3. Промыть шланг (если съемный)
4. Высушить все части

ЕЖЕНЕДЕЛЬНО:

1. Полная разборка и промывка
2. Замачивание колбы в теплой воде с лимонной кислотой
3. Очистка всех уплотнителей
4. Проверка целостности шланга

ХРАНЕНИЕ:

- Хранить в разобранном виде
- В сухом месте
- Шланг хранить в расправленном виде
- Колбу хранить без воды

ВАЖНО: Не используйте агрессивные моющие средства!`,
    category: 'Уход',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '4',
    title: 'Правила смешивания вкусов',
    content: `ОСНОВНЫЕ ПРИНЦИПЫ:

1. БАЛАНС СЛАДКОГО И КИСЛОГО
   - Сладкие вкусы (фрукты, десерты) + кислые (лимон, лайм)
   - Пример: Манго 60% + Лимон 40%

2. КОМПЛЕМЕНТАРНЫЕ ВКУСЫ
   - Вкусы, которые дополняют друг друга
   - Пример: Кофе + Ваниль, Клубника + Банан

3. КОНТРАСТНЫЕ ВКУСЫ
   - Создают интересные сочетания
   - Пример: Мята + Шоколад, Роза + Лимон

4. ПРОЦЕНТНОЕ СООТНОШЕНИЕ
   - Основной вкус: 50-70%
   - Второстепенный: 20-30%
   - Акцент: 10-20%

5. ОХЛАЖДЕНИЕ
   - Мята/Холодок: 15-35% от общего объема
   - Больше = сильнее охлаждение

ПОПУЛЯРНЫЕ КОМБИНАЦИИ:
- Фрукт + Цитрус + Мята
- Десерт + Специи
- Ягоды + Кислинка`,
    category: 'Смешивание',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '5',
    title: 'Температура углей',
    content: `ВЫБОР УГЛЕЙ:

1. КОКОСОВЫЕ УГЛИ
   - Долго горят (60-90 минут)
   - Стабильная температура
   - Без запаха
   - Рекомендуется для новичков

2. ДРЕВЕСНЫЕ УГЛИ
   - Быстрее прогорают
   - Могут давать привкус
   - Дешевле кокосовых

ПОДГОТОВКА УГЛЕЙ:

1. Разогреть на электроплитке/газовой горелке
2. Довести до красного состояния со всех сторон
3. Время разогрева: 5-10 минут
4. Перевернуть угли несколько раз

РАЗМЕЩЕНИЕ НА КАЛЬЯНЕ:

- Для калауда: 3-4 угля по краям
- Для фольги: 2-3 угля, равномерно распределить
- Не ставить угли в центр!
- При необходимости сдуть пепел

ВАЖНО: Не используйте угли с химическими добавками!`,
    category: 'Угли',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '6',
    title: 'Типы табака',
    content: `BLONDE LEAF (Светлый табак):
- Легкий, мягкий вкус
- Меньше никотина
- Быстрее прогорает
- Примеры: Al Fakher, Adalya, Fumari
- Забивка: пушистая

DARK LEAF (Темный табак):
- Насыщенный, крепкий вкус
- Больше никотина
- Дольше курится
- Примеры: Tangiers, Darkside, Musthave
- Забивка: плотная

VIRGINIA (Вирджиния):
- Классический табак
- Средняя крепость
- Универсальный
- Примеры: Nakhla, Al Fakher

BURLEY (Берли):
- Крепкий табак
- Много никотина
- Для опытных курильщиков
- Примеры: Tangiers Noir

ВЫБОР:
- Новичкам: Blonde Leaf
- Опытным: Dark Leaf
- Экспериментам: смешивание типов`,
    category: 'Табак',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Начальные готовые миксы
const initialReadyMixes: Mix[] = [
  {
    id: '1',
    title: 'Тропический Шторм',
    description: 'Яркий, освежающий микс с тропическими нотами и кислинкой.',
    ingredients: [
      { name: 'Манго', percentage: 50 },
      { name: 'Лимон', percentage: 30 },
      { name: 'Мята / Холодок', percentage: 20 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Восточный Кофе',
    description: 'Теплый, согревающий десертный микс с пряностями.',
    ingredients: [
      { name: 'Кофе / Тирамису', percentage: 60 },
      { name: 'Ваниль / Крем', percentage: 30 },
      { name: 'Специи (Кардамон)', percentage: 10 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    title: 'Красный Чай',
    description: 'Легкий ягодный вкус с кислинкой, напоминающий каркаде.',
    ingredients: [
      { name: 'Вишня', percentage: 40 },
      { name: 'Ягода (Смесь)', percentage: 35 },
      { name: 'Лимон', percentage: 25 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '4',
    title: 'Морозное Яблоко',
    description: 'Классический вкус зеленого яблока с мощным охлаждением. Освежающий и терпкий.',
    ingredients: [
      { name: 'Зеленое Яблоко', percentage: 65 },
      { name: 'Мята / Холодок', percentage: 35 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [myMixes, setMyMixes] = useState<Mix[]>([]);
  const [readyMixes, setReadyMixes] = useState<Mix[]>([]);
  const [knowledgeNotes, setKnowledgeNotes] = useState<KnowledgeNote[]>([]);

  // Загрузка данных из LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Загружаем мои миксы
    const savedMyMixes = localStorage.getItem(STORAGE_KEYS.MY_MIXES);
    if (savedMyMixes) {
      setMyMixes(JSON.parse(savedMyMixes));
    }

    // Загружаем готовые миксы
    const savedReadyMixes = localStorage.getItem(STORAGE_KEYS.READY_MIXES);
    if (savedReadyMixes) {
      setReadyMixes(JSON.parse(savedReadyMixes));
    } else {
      // Инициализируем начальными данными
      setReadyMixes(initialReadyMixes);
      localStorage.setItem(STORAGE_KEYS.READY_MIXES, JSON.stringify(initialReadyMixes));
    }

    // Загружаем заметки
    const savedNotes = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_NOTES);
    if (savedNotes) {
      setKnowledgeNotes(JSON.parse(savedNotes));
    } else {
      // Инициализируем начальными данными
      setKnowledgeNotes(initialKnowledgeNotes);
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_NOTES, JSON.stringify(initialKnowledgeNotes));
    }
  }, []);

  // Сохранение в LocalStorage
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Мои миксы
  const addMix = (mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMix: Mix = {
      ...mix,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...myMixes, newMix];
    setMyMixes(updated);
    saveToStorage(STORAGE_KEYS.MY_MIXES, updated);
  };

  const updateMix = (id: string, mix: Partial<Mix>) => {
    const updated = myMixes.map((m) =>
      m.id === id ? { ...m, ...mix, updatedAt: Date.now() } : m
    );
    setMyMixes(updated);
    saveToStorage(STORAGE_KEYS.MY_MIXES, updated);
  };

  const deleteMix = (id: string) => {
    const updated = myMixes.filter((m) => m.id !== id);
    setMyMixes(updated);
    saveToStorage(STORAGE_KEYS.MY_MIXES, updated);
  };

  // Готовые миксы
  const addReadyMix = (mix: Omit<Mix, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMix: Mix = {
      ...mix,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...readyMixes, newMix];
    setReadyMixes(updated);
    saveToStorage(STORAGE_KEYS.READY_MIXES, updated);
  };

  // База знаний
  const addNote = (note: Omit<KnowledgeNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: KnowledgeNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [...knowledgeNotes, newNote];
    setKnowledgeNotes(updated);
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_NOTES, updated);
  };

  const updateNote = (id: string, note: Partial<KnowledgeNote>) => {
    const updated = knowledgeNotes.map((n) =>
      n.id === id ? { ...n, ...note, updatedAt: Date.now() } : n
    );
    setKnowledgeNotes(updated);
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_NOTES, updated);
  };

  const deleteNote = (id: string) => {
    const updated = knowledgeNotes.filter((n) => n.id !== id);
    setKnowledgeNotes(updated);
    saveToStorage(STORAGE_KEYS.KNOWLEDGE_NOTES, updated);
  };

  return (
    <AppContext.Provider
      value={{
        myMixes,
        addMix,
        updateMix,
        deleteMix,
        readyMixes,
        addReadyMix,
        knowledgeNotes,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

