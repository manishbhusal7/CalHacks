import axios from "axios";


const GROQ_API_KEY = "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"; // Replace with your actual API key

export async function createChatCompletion (chatHistory) {
    try {
        const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama3-70b-8192",
            messages: chatHistory,
            max_tokens: 100,
            temperature: 1.2,
        },
        {
            headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
            },
        }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Sorry, I couldn't get a response.";
    }
};


export async function transcribeAudio(audioBlob){
    try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'sample_audio.mp3'); // Append the Blob
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'json');
    formData.append('temperature', '0.0');

    const response = await axios.post(
    "https://api.groq.com/openai/v1/audio/transcriptions",
    formData,
    {
        headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        },
    }
    );
    console.log('Request successful'); // Debugging statement
    console.log(response.data);
    return response.data;

    } catch (error) {
      console.error('Error processing audio:', error);
    }
  }

export async function translateAudio(audioBlob){
    try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'sample_audio.mp3'); // Append the Blob
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'json');
    formData.append('temperature', '0.0');

    const response = await axios.post(
    "https://api.groq.com/openai/v1/audio/translations",
    formData,
    {
        headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        },
    }
    );
    console.log('Request successful'); // Debugging statement
    console.log(response.data);
    return response.data;

    } catch (error) {
      console.error('Error processing audio:', error);
    }
}

