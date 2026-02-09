import apiClient from './apiClient';

/**
 * Generates content by sending a prompt to the backend AI service.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<object>} - The generated content as a JSON object.
 */
export const generateAiContent = async (prompt) => {
  try {
    const { data } = await apiClient.post('/ai/generate', { prompt });
    return data;
  } catch (error) {
    console.error("Error calling AI generation service:", error.response?.data?.message || error.message);
    // Propagate the error so the component can handle it
    throw new Error(error.response?.data?.message || 'Failed to generate content');
  }
};

/**
 * Generates content ideas by sending a topic to the backend AI service.
 * @param {string} prompt - The prompt/topic for idea generation.
 * @returns {Promise<object>} - An object containing an array of generated ideas.
 */
export const generateIdeasFromAI = async (prompt) => {
  try {
    const { data } = await apiClient.post('/ai/ideas', { prompt });
    return data;
  } catch (error) {
    console.error("Error calling AI idea generation service:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to generate ideas');
  }
};