export interface FilteredRoutesProps {
  selectedRoute: string | null;
  setSelectedRoute: React.Dispatch<React.SetStateAction<string | null>>;
  setIsAreaChoosing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddRoute: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditUser: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
}
