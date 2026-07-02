import { DailyRecord, Video, UserGoals } from '../types';
import { formatDate } from './period';

export const DEFAULT_GOALS: UserGoals = {
  water: 8,
  steps: 8000,
  sleep: 8,
  kcal: 2000,
};

export const SEED_VIDEOS: Video[] = [
  {
    id: 'seed-vid-1',
    vid: '8mP5XGHAAl8',
    title: '하루의 시작을 여는 아침 스트레칭 요가 (15분)',
    cat: 'yoga',
  },
  {
    id: 'seed-vid-2',
    vid: '2Gg6C_G39g8',
    title: '마음의 평화를 찾는 10분 데일리 마음챙김 명상',
    cat: 'meditation',
  },
  {
    id: 'seed-vid-3',
    vid: 'tLdD8l_3pIQ',
    title: '거북목과 굽은 등 피는 전신 스트레칭 (10분)',
    cat: 'stretch',
  },
  {
    id: 'seed-vid-4',
    vid: 'wS8vEozYFmE',
    title: '스트레스 완화와 깊은 이완을 위한 478 호흡 가이드',
    cat: 'breath',
  },
  {
    id: 'seed-vid-5',
    vid: 'D3S1zU-m3o8',
    title: '불면증 극복! 밤에 하는 숙면 요가와 깊은 이완',
    cat: 'yoga',
  },
  {
    id: 'seed-vid-6',
    vid: 'f3W_1-Wf7Z0',
    title: '지친 마음을 따뜻하게 위로하는 저녁 수면 명상',
    cat: 'meditation',
  },
];

export function generateSeedRecords(todayStr: string): DailyRecord[] {
  const records: DailyRecord[] = [];
  const today = new Date(todayStr);

  // Generate records for the last 15 days (excluding today, which starts empty)
  for (let i = 15; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = formatDate(date);

    // Periodic weight: starts around 56.4kg, fluctuates slightly
    const baseWeight = 56.4;
    const weightFluctuation = Math.sin(i * 0.5) * 0.3;
    const weight = Math.round((baseWeight + weightFluctuation) * 10) / 10;

    // Menstruation simulation: 2026-06-20 to 2026-06-24 (assuming today is 2026-07-02)
    // We target June 18th to 22nd, or we can relative-calculate it so it's around 10-14 days ago.
    const daysAgo = i;
    const isPeriodDay = daysAgo >= 10 && daysAgo <= 14;

    let period = null;
    if (isPeriodDay) {
      let flow: 'light' | 'medium' | 'heavy' = 'medium';
      if (daysAgo === 14) flow = 'light';
      if (daysAgo === 13) flow = 'heavy';
      if (daysAgo === 12) flow = 'heavy';
      if (daysAgo === 11) flow = 'medium';
      if (daysAgo === 10) flow = 'light';

      const symptoms = [];
      if (daysAgo === 13 || daysAgo === 12) {
        symptoms.push('복통', '피로', '예민함');
      } else {
        symptoms.push('두통', '붓기');
      }

      period = {
        active: true,
        flow,
        symptoms,
      };
    }

    // Steps: 5000 to 11000
    const steps = Math.floor(6500 + Math.sin(i) * 2500 + (i % 3 === 0 ? 1500 : 0));

    // Water: 4 to 9 cups
    const water = Math.floor(6 + Math.cos(i) * 2 + (i % 4 === 0 ? -1 : 1));

    // Sleep: 6 to 8.5 hours
    const sleepH = Math.round((7.2 + Math.sin(i * 0.8) * 1.0) * 10) / 10;
    const sleepQ = Math.min(5, Math.max(1, Math.floor(4 + Math.sin(i) * 1.5)));

    // Mood: 2 to 5
    let mood = Math.min(5, Math.max(1, Math.floor(4 + Math.sin(i * 1.2) * 1.2)));
    if (isPeriodDay) {
      mood = Math.max(2, mood - 1); // Mood drops slightly during period
    }

    // Meals
    const mealKcalBase = 1800 + (i % 2 === 0 ? 150 : -100);
    const meals = [
      {
        id: `seed-meal-b-${dateStr}`,
        type: 'breakfast' as const,
        name: i % 2 === 0 ? '사과, 아보카도 토스트, 계란' : '요거트 볼, 바나나, 아몬드',
        kcal: Math.round(mealKcalBase * 0.25),
        carbs: Math.round(mealKcalBase * 0.25 * 0.55 / 4),
        protein: Math.round(mealKcalBase * 0.25 * 0.2 / 4),
        fat: Math.round(mealKcalBase * 0.25 * 0.25 / 9),
      },
      {
        id: `seed-meal-l-${dateStr}`,
        type: 'lunch' as const,
        name: i % 2 === 0 ? '닭가슴살 샐러드, 현미밥' : '두부면 볶음, 고구마',
        kcal: Math.round(mealKcalBase * 0.4),
        carbs: Math.round(mealKcalBase * 0.4 * 0.5 / 4),
        protein: Math.round(mealKcalBase * 0.4 * 0.25 / 4),
        fat: Math.round(mealKcalBase * 0.4 * 0.25 / 9),
      },
      {
        id: `seed-meal-d-${dateStr}`,
        type: 'dinner' as const,
        name: i % 2 === 0 ? '연어 구이, 버섯 야채 볶음' : '소고기 안심, 구운 채소',
        kcal: Math.round(mealKcalBase * 0.35),
        carbs: Math.round(mealKcalBase * 0.35 * 0.45 / 4),
        protein: Math.round(mealKcalBase * 0.35 * 0.3 / 4),
        fat: Math.round(mealKcalBase * 0.35 * 0.25 / 9),
      },
    ];

    records.push({
      date: dateStr,
      meals,
      water,
      steps,
      sleepH,
      sleepQ,
      weight,
      mood,
      period,
    });
  }

  return records;
}
