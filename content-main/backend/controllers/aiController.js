const asyncHandler = require('express-async-handler');
const axios = require('axios');
const { User, ActionLog } = require('../models');

const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const createdBy = req.user.id;

  const user = await User.findByPk(createdBy);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const canGenerate = user.has_unlimited_generations === true || user.freeGenerationsLeft > 0;

  if (!canGenerate) {
    res.status(403);
    throw new Error('Вы исчерпали бесплатные генерации контента. Пожалуйста, приобретите подписку.');
  }

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    res.status(500);
    throw new Error('DeepSeek API key is not configured on the server.');
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter who strictly follows instructions. You ALWAYS respond with a valid JSON object and nothing else.
First, study this example of a perfect response:
{
  "title": "3 привычки для железной дисциплины",
  "body": "Хотите стать более дисциплинированным? 💪 Начните с малого. Секрет не в силе воли, а в системе.\n\n1. Правило двух минут. Если задача занимает меньше двух минут — сделайте её немедленно. Это убирает барьер для старта.\n\n2. Трекинг привычек. Отмечайте каждый день, когда вы выполнили свою привычку. Визуальный прогресс — мощный мотиватор! 📈\n\n3. Награда. После выполнения сложной задачи дайте себе небольшую награду. Это создает позитивное подкрепление.\n\nКакую привычку вы начнете формировать уже сегодня?",
  "hashtags": ["дисциплина", "мотивация", "саморазвитие", "привычки"],
  "hook_analysis": "Вопрос в заголовке и эмодзи привлекают внимание.",
  "value_proposition": "Пользователь получает простые и действенные техники для улучшения дисциплины.",
  "call_to_action": "Прямой вопрос в конце стимулирует комментарии и вовлечение.",
  "estimated_performance": "high"
}

Now, based on the user's request, generate your own response following this exact structure and quality. Do not copy the example.
The JSON object you return must match this schema: { "type": "object", "properties": { "title": { "type": "string" }, "body": { "type": "string" }, "hashtags": { "type": "array", "items": { "type": "string" } }, "hook_analysis": { "type": "string" }, "value_proposition": { "type": "string" }, "call_to_action": { "type": "string" }, "estimated_performance": { "type": "string" } } }`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 120000 // 120-second timeout
      }
    );

    if (!user.has_unlimited_generations) {
      user.freeGenerationsLeft -= 1;
      await user.save();
    }

    let generatedJson;
    try {
      generatedJson = JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse JSON from DeepSeek API:', response.data.choices[0].message.content);
      return res.status(500).json({ message: 'AI service returned an invalid format. Please try regenerating.' });
    }
    
    ActionLog.create({
      userId: createdBy,
      action: 'generate_content',
      details: {
        prompt,
        generatedContent: generatedJson,
      },
    }).catch(err => console.error('Failed to log content generation action:', err));

    res.json({
      ...generatedJson,
      freeGenerationsLeft: user.freeGenerationsLeft,
      subscription_status: user.subscription_status, // Include subscription status
      has_unlimited_generations: user.has_unlimited_generations // Include unlimited generations flag
    });

  } catch (error) {
    console.error('Error calling DeepSeek API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500);
    throw new Error('Failed to generate content from AI service.');
  }
});

const generateContentIdeas = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt for generating ideas');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    res.status(500);
    throw new Error('DeepSeek API key is not configured on the server.');
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an expert content strategist. Your task is to generate a list of content ideas. Respond with a valid JSON object with a single key "ideas". This key should contain an array of 5 content idea objects. Each object must have only three keys: "topic" (a short, catchy title), "angle" (a one-sentence description of the idea), and "trending_factor" (a number from 0 to 100).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 120000 // 120-second timeout
      }
    );
    
    let generatedJson;
    try {
      generatedJson = JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse JSON from DeepSeek API for ideas:', response.data.choices[0].message.content);
      return res.status(500).json({ message: 'AI service returned an invalid format for ideas. Please try regenerating.' });
    }
    res.json(generatedJson);

  } catch (error) {
    // Check if the request was aborted
    if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('aborted'))) {
      console.log('Request to DeepSeek API for ideas was aborted, likely by the client closing the connection.');
      // No response is sent because the client has already disconnected.
      return;
    }

    const errorMessage = error.response ? error.response.data : error.message;
    console.error('Error calling DeepSeek API for ideas:', errorMessage);
    return res.status(error.response ? error.response.status : 500).json({
        message: 'Failed to generate content ideas from AI service.',
        error: errorMessage
    });
  }
});


const chatWithAgent = asyncHandler(async (req, res) => {
  const { prompt, history = [], agentName } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    res.status(500);
    throw new Error('DeepSeek API key is not configured on the server.');
  }

  const systemPrompts = {
    content_strategist: 'You are an expert content strategist who generates viral content ideas. Format your responses using Markdown for paragraphs, headings, bold text, and lists.',
    default: 'You are a helpful assistant.'
  };

  const systemMessage = { role: 'system', content: systemPrompts[agentName] || systemPrompts.default };
  const messages = [systemMessage, ...history, { role: 'user', content: prompt }];
  
  console.log('Sending messages to DeepSeek:', messages);

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 120000 // 120-second timeout
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Error calling DeepSeek API for chat:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500);
    throw new Error('Failed to get chat response from AI service.');
  }
});

module.exports = {
  generateContent,
  generateContentIdeas,
  chatWithAgent,
};