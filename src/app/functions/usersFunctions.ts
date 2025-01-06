import User from "@/app/types/users";
import {
  getAllUsers,
  getUserById,
  putUserRouteRate,
} from "../services/userService";
import { TopUser } from "../types/topUser";

export const getUserToken = (): {
  id: string;
  email: string;
  name: string;
} | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const userTokenFromStorage = localStorage.getItem("userToken");
  return userTokenFromStorage ? JSON.parse(userTokenFromStorage) : null;
};

export const getUserAddress = async () => {
  try {
    const user: User | undefined = await fetchUserById();

    if (!user) {
      console.error("user not found");
      return;
    }
    return user.address;
  } catch (error) {
    console.error("Error fetching user address:", error);
    return null;
  }
};

export const fetchUserById = async () => {
  try {
    const userToken = getUserToken();
    if (!userToken) {
      console.error("No user token found");
      return;
    }
    const user: User = await getUserById(userToken.id);
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const putUserRate = async (routeId: string, rate: number) => {
  try {
    const userToken = getUserToken();
    if (!userToken) {
      console.error("No user token found");
      return;
    }

    const userRate = await putUserRouteRate(
      userToken.id as string,
      routeId,
      rate
    );
    return userRate;
  } catch (error) {
    console.error("Error updating user route rate:", error);
    throw new Error("Failed to update route rate");
  }
};

export const fetchCountOfUsers = async () => {
  try {
    const usersCounter = await getAllUsers();
    return usersCounter.length;
  } catch (error) {
    console.error("Error getting users:", error);
  }
};

export const getTopUsers = async (): Promise<TopUser[]> => {
  const users: User[] = await getAllUsers();
  const topUsers: TopUser[] = [];

  users.forEach(user => {
      const score = user.historyRoutes.length;
      topUsers.push({ name: user.fullName, numRoute: score });
      topUsers.sort((a, b) => b.numRoute - a.numRoute);
      if (topUsers.length > 3) topUsers.pop();
  });

  return topUsers;
};