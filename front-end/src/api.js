import axios from 'axios';

const fetchApiData = async (prompt) => {
    try {
      const response = await axios.post('http://localhost:3000/chat', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          messages: [{
            role: 'user',
            content: prompt,
          }],
          model: 'llama3-8b-8192',
        },
      });
    //   console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      throw new Error('Failed to fetch data'); // Throw an error with a descriptive message
    }
};

export default fetchApiData;