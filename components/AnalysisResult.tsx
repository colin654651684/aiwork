import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, XCircle, HelpCircle, BookOpen, Lightbulb, ListChecks, ArrowRight } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">分析结果</h2>
            <p className="text-slate-500 text-sm mt-1">{result.problemIdentified}</p>
          </div>
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${
            result.isCorrect === true 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : result.isCorrect === false 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {result.isCorrect === true && <CheckCircle2 className="h-4 w-4" />}
            {result.isCorrect === false && <XCircle className="h-4 w-4" />}
            {result.isCorrect === null && <HelpCircle className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {result.isCorrect === true ? '回答正确' : result.isCorrect === false ? '需要修正' : '题目解析'}
            </span>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
           <span className="font-semibold text-slate-900 block mb-1">AI 老师点评:</span>
           {result.feedback}
        </div>
      </div>

      {/* Step by Step Solution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <ListChecks className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-800">详细解题步骤</h3>
        </div>
        <div className="space-y-4">
          {result.solutionSteps.map((step, index) => (
            <div key={index} className="flex gap-4 group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {index + 1}
              </div>
              <div className="pt-1.5 text-slate-600 text-sm leading-relaxed border-b border-slate-50 pb-4 w-full last:border-0 last:pb-0">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Concepts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">核心考点</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.keyConcepts.map((concept, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 shadow-md text-white h-full">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-indigo-100" />
            <h3 className="font-semibold text-white">学习建议</h3>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed mb-4">
            {result.learningPath}
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-white/80 uppercase tracking-wider">
            <span>下一步</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>

    </div>
  );
};