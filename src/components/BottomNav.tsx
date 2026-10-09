import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'lich-day', label: 'Lịch dạy', icon: 'calendar_today' },
    { id: 'lop-hoc', label: 'Lớp học', icon: 'groups' },
    { id: 'hoc-phi', label: 'Học phí', icon: 'qr_code_scanner' },
    { id: 'bao-cao', label: 'Báo cáo', icon: 'insights' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(42,20,180,0.06)] border-t border-surface-container-high/60">
      <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center min-w-[4.5rem] h-12 transition-all relative ${
                isActive 
                  ? 'text-primary font-bold scale-105' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              type="button"
              onClick={() => onChangeTab(item.id)}
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : undefined}
              >
                {item.icon}
              </span>
              <span className={`text-[11px] leading-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
