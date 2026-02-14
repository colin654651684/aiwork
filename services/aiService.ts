import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// 使用 process.env.API_KEY，这将在构建时由 Vite 替换
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    problemIdentified: {
      type: Type.STRING,
      description: "图片中识别出的数学问题的简要中文描述。",
    },
    isCorrect: {
      type: Type.BOOLEAN,
      description: "如果图片中有学生的解答，判断是否正确（True为正确，False为错误）。如果只有题目没有解答，则返回 Null。",
      nullable: true,
    },
    errorBoundingBox: {
      type: Type.OBJECT,
      description: "如果解答错误，请提供具体错误部分在图片中的边界框坐标（坐标范围 0-1000）。",
      properties: {
        ymin: { type: Type.NUMBER, description: "Top Y (0-1000)" },
        xmin: { type: Type.NUMBER, description: "Left X (0-1000)" },
        ymax: { type: Type.NUMBER, description: "Bottom Y (0-1000)" },
        xmax: { type: Type.NUMBER, description: "Right X (0-1000)" },
      },
      nullable: true,
    },
    solutionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "分步解题过程（中文）。",
    },
    feedback: {
      type: Type.STRING,
      description: "给学生的建设性反馈，指出具体错误或表扬其思路（中文）。",
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "涉及的数学核心概念列表（例如：'微积分'，'勾股定理'）。",
    },
    learningPath: {
      type: Type.STRING,
      description: "关于学生接下来应该学习或复习什么的建议（中文）。",
    },
  },
  required: ["problemIdentified", "solutionSteps", "feedback", "keyConcepts", "learningPath"],
};

export const analyzeMathProblem = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `你是一位专业、耐心且充满鼓励的数学导师。
            请分析提供的图片。图片中包含一道数学题，可能还有学生的解答过程。
            
            请执行以下操作：
            1. 识别并简述题目。
            2. 如果能看到学生的解答，请检查是否正确。如果只有题目，请直接进行解答。
            3. 如果发现学生的解答有错误，请务必识别出错误具体的区域，并返回 bounding box 坐标（基于 0-1000 的归一化坐标）。
            4. 提供清晰、分步骤的解题过程。
            5. 识别题目涉及的核心考点（Key Concepts）。
            6. 提供后续的学习建议或复习方向。
            
            请严格按照 JSON 格式输出，所有文本字段必须使用简体中文。`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "你是一位乐于助人、循循善诱的教育 AI 助手。你的回答应该是简体中文。",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};