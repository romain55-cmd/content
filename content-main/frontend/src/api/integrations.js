// Mock implementation of integrations

const mockIntegrations = {
  InvokeLLM: async (options) => {
    console.log('[Mock API] InvokeLLM called with:', options);
    return Promise.resolve({ result: 'This is a mock response from the LLM. The original integration has been removed.' });
  },
  // Add other mock functions if they are used elsewhere
  SendEmail: async () => console.log('[Mock API] SendEmail called'),
  UploadFile: async ({ file }) => {
    console.log(`[Mock API] "Uploading" file: ${file.name}`);
    // Simulate a network delay
    await new Promise(res => setTimeout(res, 750));
    // Return a mock URL object, as the component expects
    return { file_url: `https://mock-storage.com/uploads/${file.name}` };
  },
  GenerateImage: async () => console.log('[Mock API] GenerateImage called'),
  ExtractDataFromUploadedFile: async () => console.log('[Mock API] ExtractDataFromUploadedFile called'),
  CreateFileSignedUrl: async () => console.log('[Mock API] CreateFileSignedUrl called'),
  UploadPrivateFile: async () => console.log('[Mock API] UploadPrivateFile called'),
};

export const Core = mockIntegrations;
export const {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
} = mockIntegrations;