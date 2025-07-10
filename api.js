import axios from 'axios';

const BASE_URL = "http://localhost:8080";

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/question/allQuestion`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
