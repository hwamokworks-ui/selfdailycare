import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Video as VideoIcon,
  Heart
} from 'lucide-react';

import { DailyRecord, Video, UserGoals } from './types';
import { formatDate } from './utils/period';
import { DEFAULT_GOALS, SEED_VIDEOS, generateSeedRecords } from './utils/seedData';

// Sub-tabs imports
import TodayTab from './components/TodayTab';
import TrendTab from './components/TrendTab';
import CalendarTab from './components/CalendarTab';
import VideoTab from './components/VideoTab';

// App's unified baseline today date
const TODAY_STR = '2026-07-02';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'today' | 'trends' | 'calendar' | 'videos'>('today');

  // --- Core States ---
  const [allRecords, setAllRecords] = useState<DailyRecord[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localstorage on mount
  useEffect(() => {
    // 1. Load Goals
    const storedGoals = localStorage.getItem('today_health_goals');
    let loadedGoals = DEFAULT_GOALS;
    if (storedGoals) {
      try {
        loadedGoals = JSON.parse(storedGoals);
        setGoals(loadedGoals);
      } catch (e) {
        console.error('Error parsing stored goals', e);
      }
    } else {
      localStorage.setItem('today_health_goals', JSON.stringify(DEFAULT_GOALS));
    }

    // 2. Load Videos
    const storedVideos = localStorage.getItem('today_health_videos');
    if (storedVideos) {
      try {
        setVideos(JSON.parse(storedVideos));
      } catch (e) {
        console.error('Error parsing stored videos', e);
        setVideos(SEED_VIDEOS);
      }
    } else {
      setVideos(SEED_VIDEOS);
      localStorage.setItem('today_health_videos', JSON.stringify(SEED_VIDEOS));
    }

    // 3. Load Daily Records
    const storedRecords = localStorage.getItem('today_health_records');
    let records: DailyRecord[] = [];
    if (storedRecords) {
      try {
        records = JSON.parse(storedRecords);
      } catch (e) {
        console.error('Error parsing stored records', e);
        records = generateSeedRecords(TODAY_STR);
      }
    } else {
      // First-time seeding with 14 days of mock logs
      records = generateSeedRecords(TODAY_STR);
      localStorage.setItem('today_health_records', JSON.stringify(records));
    }

    // Ensure TODAY's record exists in the array
    const todayRecordExists = records.some((r) => r.date === TODAY_STR);
    if (!todayRecordExists) {
      const emptyTodayRecord: DailyRecord = {
        date: TODAY_STR,
        meals: [],
        water: 0,
        steps: null,
        sleepH: null,
        sleepQ: null,
        weight: null,
        mood: null,
        period: null,
      };
      records.push(emptyTodayRecord);
      localStorage.setItem('today_health_records', JSON.stringify(records));
    }

    setAllRecords(records);
    setLoading(false);
  }, []);

  // Set up global callback hook for TodayTab goals setup
  useEffect(() => {
    (window as any)._updateGoals = (updatedGoals: UserGoals) => {
      setGoals(updatedGoals);
      localStorage.setItem('today_health_goals', JSON.stringify(updatedGoals));
    };
    return () => {
      delete (window as any)._updateGoals;
    };
  }, []);

  // Update a single field inside today's record
  const handleUpdateTodayRecord = (updatedFields: Partial<DailyRecord>) => {
    const updatedRecords = allRecords.map((rec) => {
      if (rec.date === TODAY_STR) {
        return {
          ...rec,
          ...updatedFields,
        };
      }
      return rec;
    });

    setAllRecords(updatedRecords);
    localStorage.setItem('today_health_records', JSON.stringify(updatedRecords));
  };

  // --- Videos manipulation callbacks ---
  const handleAddVideo = (newVideoData: Omit<Video, 'id'>) => {
    const newVid: Video = {
      ...newVideoData,
      id: `custom-vid-${Date.now()}`,
    };
    const updatedVideos = [newVid, ...videos];
    setVideos(updatedVideos);
    localStorage.setItem('today_health_videos', JSON.stringify(updatedVideos));
  };

  const handleRemoveVideo = (id: string) => {
    const updatedVideos = videos.filter((v) => v.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('today_health_videos', JSON.stringify(updatedVideos));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold text-[#737373] tracking-widest uppercase">LOADING...</span>
      </div>
    );
  }

  const todayRecord = allRecords.find((r) => r.date === TODAY_STR) || {
    date: TODAY_STR,
    meals: [],
    water: 0,
    steps: null,
    sleepH: null,
    sleepQ: null,
    weight: null,
    mood: null,
    period: null,
  };

  return (
    <div className="min-h-screen bg-transparent text-[#2A2723] font-sans antialiased selection:bg-[#F2EEE2] pb-24">
      {/* Upper Brand Nav Rail (Clean Organic Minimalism) */}
      <header className="sticky top-0 bg-[#F5F2EA]/90 backdrop-blur-md border-b border-[#E4DECF]/60 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6F8F6A]"></div>
              <span className="font-bold tracking-tight text-sm text-[#2A2723] font-serif">오늘의 건강</span>
            </div>
            <div className="px-1.5 py-0.5 bg-[#EEE9DD] border border-[#E4DECF] text-[#8A8271] text-[9px] font-mono rounded font-bold uppercase tracking-wider">
              SAVED
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#8A8271] bg-[#EEE9DD]/60 px-2.5 py-1 rounded border border-[#E4DECF]">
            {TODAY_STR} (목)
          </span>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-2xl mx-auto px-4 pt-6 min-h-[calc(100vh-120px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {currentTab === 'today' && (
              <TodayTab
                record={todayRecord}
                goals={goals}
                onUpdateRecord={handleUpdateTodayRecord}
                allRecords={allRecords}
                todayStr={TODAY_STR}
              />
            )}
            {currentTab === 'trends' && (
              <TrendTab
                allRecords={allRecords}
                goals={goals}
              />
            )}
            {currentTab === 'calendar' && (
              <CalendarTab
                allRecords={allRecords}
                goals={goals}
                todayStr={TODAY_STR}
              />
            )}
            {currentTab === 'videos' && (
              <VideoTab
                videos={videos}
                onAddVideo={handleAddVideo}
                onRemoveVideo={handleRemoveVideo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Beautiful Fixed Bottom Tab Bar (Clean Organic Minimalism) */}
      <nav className="fixed bottom-5 inset-x-4 max-w-sm mx-auto bg-[#FBF9F3]/95 backdrop-blur-md rounded-full border border-[#E4DECF] shadow-lg p-1.5 z-40 flex items-center justify-around">
        {[
          { id: 'today' as const, label: '오늘', icon: Sparkles },
          { id: 'trends' as const, label: '추세', icon: TrendingUp },
          { id: 'calendar' as const, label: '달력', icon: Calendar },
          { id: 'videos' as const, label: '영상', icon: VideoIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-1.5 transition-all ${
                active
                  ? 'bg-[#6F8F6A] text-white shadow-sm'
                  : 'text-[#8A8271] hover:text-[#2A2723] hover:bg-[#F2EEE2]'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
