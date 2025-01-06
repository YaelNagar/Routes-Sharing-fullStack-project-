import axios from "axios";

// const url = "http://localhost:3000";
const url = "https://route-sharing-bsd7.vercel.app";

// פונקציה להוספת קילומטרים
export const addDistance = async (meter: number) => {
  try {
    const response = await axios.post(`${url}/api/distance`, {
      metersToAdd: meter,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding kilometers:", error);
  }
};

// פונקציה לשליפת סך הקילומטרים
export const getMeter = async () => {
  try {
    const response = await axios.get(`${url}/api/distance`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meters:", error);
  }
};
