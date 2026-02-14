import React from 'react';
import { GraduationCap, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AI 数学助教</span>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-500 hidden sm:block">智能作业批改助手</span>
             <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
               <Github className="h-5 w-5" />
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};