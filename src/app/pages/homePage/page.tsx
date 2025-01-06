"use client";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { fetchCountOfUsers, getTopUsers } from "@/app/functions/usersFunctions";
import {
  fetchCountOfKilometers,
  fetchCountOfRoutes,
  getTopRoutes,
} from "@/app/functions/routesFunctions";
import {
  FaUser,
  FaRoute,
  FaWalking,
  FaCrown,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { CounterProps } from "@/app/types/props/CounterProps";
import { TopUser } from "@/app/types/topUser";
import Star from "@/app/components/Star";
import PopUpRoute from "@/app/components/PopUpRoute";
import IRoute from "@/app/types/routes";
import { Types } from "mongoose";

const Counter: React.FC<CounterProps> = ({ target, duration, icon, label }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const step = target / (duration / 10);
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < target) {
          const nextCount = prevCount + step;
          return nextCount > target ? target : nextCount;
        } else {
          clearInterval(interval);
          return target;
        }
      });
    }, 10);

    return () => clearInterval(interval);
  }, [target, duration]);

  return (
    <div className="w-60 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 flex flex-col items-center justify-between space-y-4">
      <div className="text-white text-5xl">{icon}</div>
      <div className="text-4xl font-extrabold text-white">
        {Math.floor(count)}
      </div>
      <div className="text-lg font-medium text-white">{label}</div>
    </div>
  );
};

const RecommendedRouteCard = ({
  route,
  setExpandedRouteId,
}: {
  route: IRoute;
  setExpandedRouteId: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <>
      <div
        className="w-60 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4 cursor-pointer"
        onClick={() => setExpandedRouteId(route._id as string)}
      >
        <div className="text-white text-3xl">
          <FaMapMarkedAlt className="text-white text-3xl mb-2" />
        </div>
        <Star rate={route.rate} filtered={1} onClick={undefined} />
        <div className="text-white text-sm text-center">
          {route.description}
        </div>
      </div>
    </>
  );
};

const ActiveUserCard = ({
  username,
  activities,
}: {
  username: string;
  activities: number;
}) => {
  return (
    <div className="w-60 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
      <div className="flex flex-col text-white text-2xl font-bold items-center">
        <FaCrown className="text-yellow-400 text-3xl mb-2" />
        {username}
        <div className="text-white text-base mt-2">{activities} פעילויות</div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [routesCount, setRoutesCount] = useState<number>(0);
  const [kilometersCount, setKilometersCount] = useState<number>(0);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [recommendedRoutes, setRecommendedRoutes] = useState<IRoute[]>([]);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const animationDuration = 2000;

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetchCountOfUsers();
      const routes = await fetchCountOfRoutes();
      const kilometers = await fetchCountOfKilometers();
      setUsersCount(users);
      setRoutesCount(routes);
      setKilometersCount(kilometers as number);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const users: TopUser[] = await getTopUsers();
        setTopUsers(users);
      } catch (error) {
        console.error("Failed to fetch top users:", error);
      }
    };
    fetchTopUsers();
  }, []);

  useEffect(() => {
    const fetchTopRoutes = async () => {
      try {
        const routes: IRoute[] = await getTopRoutes();
        setRecommendedRoutes(routes);
      } catch (error) {
        console.error("Failed to fetch top routes:", error);
      }
    };
    fetchTopRoutes();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-8 mt-10">
      <div className="flex flex-wrap justify-center gap-10 mt-6">
        <Counter
          target={usersCount}
          duration={animationDuration}
          icon={<FaUser />}
          label="משתמשים פעילים"
        />
        <Counter
          target={routesCount}
          duration={animationDuration}
          icon={<FaRoute />}
          label="מסלולים ששותפו"
        />
        <Counter
          target={kilometersCount}
          duration={animationDuration}
          icon={<FaWalking />}
          label="קילומטרים שהלכו"
        />
      </div>

      {/* Active Users Section */}
      <div className="animate-fadeInUp delay-100">
        <div className="text-2xl font-bold text-gray-800 text-center">
          המשתמשים הספורטיבים
        </div>
        <div
          className="flex flex-wrap justify-center gap-10 mt-12 text-center"
          dir="rtl"
        >
          {topUsers.map((user, index) => (
            <ActiveUserCard
              key={index}
              username={user.name as string}
              activities={user.numRoute}
            />
          ))}
        </div>
      </div>

      {/* Recommended Routes Section */}
      <div className="animate-fadeInUp delay-100">
        <div className="text-2xl font-bold text-gray-800 text-center animate-fadeInUp delay-100">
          מסלולים מומלצים
        </div>
        <div
          className="flex flex-wrap justify-center gap-10 mt-12 text-center animate-fadeInUp"
          dir="rtl"
        >
          {recommendedRoutes.map((route, index) => (
            <RecommendedRouteCard
              key={index}
              route={route}
              setExpandedRouteId={setExpandedRouteId}
            />
          ))}
        </div>
      </div>

      {expandedRouteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
            <PopUpRoute
              onClose={() => setExpandedRouteId(null)}
              routeId={new Types.ObjectId(expandedRouteId)}
              filtered={4}
            />
        </div>
      )}
    </div>
  );
};

export default HomePage;
