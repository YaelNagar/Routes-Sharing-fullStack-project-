import axios from "axios";
import IUser from "../types/users";
import useStore from "@/app/store/store";
import { jwtDecode } from "jwt-decode";
import { Token } from "../types/storeState";

// const url = "http://localhost:3000";
const url = "https://route-sharing-bsd7.vercel.app";

export const signupFunction = async (
  fullName: string,
  email: string,
  password: string,
  address: string,
  googleUser: boolean
): Promise<IUser | null> => {
  return await axios
    .post(`${url}/api/signup`, {
      fullName,
      email,
      password,
      address,
      googleUser,
    })
    .then((response) => {
      const { setToken } = useStore.getState();

      // פענוח התוקן
      const decodedToken = jwtDecode<Token>(response.data.token);

      const userToken = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
      };

      setToken(userToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", JSON.stringify(userToken));
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Signup error:", error);
      return null;
    });
};

export const loginFunction = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  return await axios
    .post(`${url}/api/login`, { email, password })
    .then((response) => {
      const { setToken } = useStore.getState();

      const decodedToken = jwtDecode<Token>(response.data.token);

      const userToken = {
        id: decodedToken.id,
        email: decodedToken.email,
        name: decodedToken.name,
      };

      setToken(userToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", JSON.stringify(userToken));
      }
      return response.data;
    })
    .catch((error) => {
      console.log("Login error:", error.response?.data || error.message);
    });
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${url}/api/users`);
    return response.data;
  } catch (error) {
    console.error("Error get users:", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${url}/api/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const getUserHistoryRoutes = async (
  userId: string,
  page: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    if (page === 1) setLoading(true);
    const response = await axios.get(
      `${url}/api/users/historyRoutes/${userId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user history routes:", error);
  }
};

export const addHistoryRoute = async (userId: string, routeId: string) => {
  try {
    const response = await axios.put(`${url}/api/users`, {
      userId,
      routeId,
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw new Error("Failed to add route");
  }
};

export const putUserRouteRate = async (
  userId: string,
  routeId: string,
  rateRoute: number
) => {
  try {
    const response = await axios.put(
      `${url}/api/users/historyRateRoute/${userId}`,
      {
        routeId,
        rateRoute,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating route:", error);
  }
};

export const putUserDetails = async (
  userId: string,
  userDetails: {
    fullName: string;
    email: string;
    address: string;
  }
) => {
  try {
    const response = await axios.put(`${url}/api/users/${userId}`, {
      userDetails,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating route:", error);
  }
};

export const verifyEmailAndSendOTP = async (email: string) => {
  try {
    const response = axios.post(`${url}/api/forgetPassword`, { email });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = axios.put(`${url}/api/forgetPassword`, { email, otp });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const editPassword = async (email: string, newPassword: string) => {
  try {
    const response = axios.put(`${url}/api/forgetPassword`, {
      email,
      password: newPassword,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
