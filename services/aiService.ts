// services/aiService.ts (原 geminiService.ts)

export interface AnalysisResult {
  // 根据你的 AnalysisResult 组件需要的数据结构定义
  content: string; 
}

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  // 1. 将文件转换为 Base64
  const base64Image = await toBase64(file);

  // 2. 调用我们自己的 Netlify Function
  // 注意：这里 URL 填写相对路径
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64: base64Image,
      prompt: "作为一个小学数学老师，请批改这张图片里的作业。1. 指出做错的题目（如果有）。2. 给出详细的解题步骤。3. 给出一个简短的鼓励点评。请用JSON格式输出或Markdown格式清晰分层。" 
    }),
  });

  if (!response.ok) {
    throw new Error('分析请求失败');
  }

  const data = await response.json();
  
  // 3. 返回数据 (根据智谱返回的结构解析)
  return {
    content: data.content 
  };
}

// 辅助函数：将 File 对象转为 Base64 字符串
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}