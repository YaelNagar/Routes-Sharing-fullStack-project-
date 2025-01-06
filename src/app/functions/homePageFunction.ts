import { getAllRoutes } from "../services/routeService";
import { getAllUsers } from "../services/userService";
import IRoute from "../types/routes";
import IUser from "../types/users";


interface TopUser {
    name: string | undefined;
    numRoute: number;
}

interface TopRoute{
    rate: number;
    description: string;
}

export const getTopUsers = async (): Promise<TopUser[]> => {
    const users: IUser[] = await getAllUsers();
    const topUsers: TopUser[] = [];

    users.forEach(user => {
        const score = user.historyRoutes.length;
        topUsers.push({ name: user.fullName, numRoute: score });
        topUsers.sort((a, b) => b.numRoute - a.numRoute);
        if (topUsers.length > 3) topUsers.pop();
    });

    return topUsers;
};

export const getTopRoutes = async() : Promise<TopRoute[]> => {
    const routes: IRoute[] = await getAllRoutes();
    const topRoutes:TopRoute[] = []
    routes.forEach(route => {
        topRoutes.push({rate:route.rate, description:route.description});
        topRoutes.sort((a, b) => b.rate - a.rate);
        if (topRoutes.length > 3) topRoutes.pop();
    })
    return topRoutes;
}
