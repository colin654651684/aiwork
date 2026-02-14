import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { AnalysisResultView } from './components/AnalysisResult';
// Change import from geminiService to aiService since that is the file present
import { analyzeMathProblem } from './services/aiService';
import { AppState, AnalysisResult, UploadedImage } from './types';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = (image: UploadedImage) => {
    setCurrentImage(image);
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setCurrentImage(null);
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!currentImage) return;

    setAppState(AppState.ANALYZING);
    try {
      const data = await analyzeMathProblem(currentImage.base64);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg("分析图片失败。请尝试上传更清晰的图片或更换题目。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Hero - Only show when no image selected */}
        {!currentImage && (
          <div className="text-center mb-12 animate-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              AI 智能批改，<span className="text-indigo-600">让数学更简单</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              上传你的数学作业照片。我们的 AI 助教将帮你检查对错，提供详细解析，并指导接下来的学习方向。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Actions */}
          <div className={`lg:col-span-5 space-y-6 ${result ? 'lg:sticky lg:top-24 h-fit' : 'lg:col-start-4 lg:col-span-6'}`}>
            <UploadSection 
              onImageSelected={handleImageSelected} 
              onClear={handleClear}
              currentImage={currentImage}
              isAnalyzing={appState === AppState.ANALYZING}
              boundingBox={result?.errorBoundingBox}
            />

            {currentImage && appState !== AppState.ANALYZING && appState !== AppState.SUCCESS && (
              <button
                onClick={handleAnalyze}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
              >
                <Sparkles className="h-5 w-5" />
                开始分析
              </button>
            )}

            {appState === AppState.ANALYZING && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center space-y-4">
                <div className="relative mx-auto w-12 h-12">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800">正在分析题目...</h3>
                  <p className="text-slate-500 text-sm">正在识别步骤和考点</p>
                </div>
              </div>
            )}

            {appState === AppState.ERROR && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm text-center">
                {errorMsg}
                <button onClick={handleAnalyze} className="block mx-auto mt-2 text-red-800 font-semibold underline hover:text-red-900">
                  重试
                </button>
              </div>
            )}
            
            {/* Guide Text if waiting */}
            {!currentImage && (
              <div className="grid grid-cols-3 gap-4 text-center mt-8">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="font-bold text-indigo-600 text-xl mb-1">1</div>
                  <div className="text-xs text-slate-500 font-medium">上传照片</div>
                </div>
                 <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="font-bold text-indigo-600 text-xl mb-1">2</div>
                  <div className="text-xs text-slate-500 font-medium">AI 诊断</div>
                </div>
                 <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="font-bold text-indigo-600 text-xl mb-1">3</div>
                  <div className="text-xs text-slate-500 font-medium">获取解析</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          {result && (
            <div className="lg:col-span-7">
              <AnalysisResultView result={result} />
              
              <div className="mt-8 flex justify-center lg:justify-start">
                 <button 
                  onClick={handleClear}
                  className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                 >
                   <span>分析下一道题</span>
                   <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;