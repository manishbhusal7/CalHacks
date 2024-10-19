import axios from 'axios';
const fetchApiData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/chat', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          messages: {
            role: 'user',
            content: 'Explain the importance of fast language models',
          },
          model: 'llam8',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };
export default fetchApiData;