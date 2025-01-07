export default interface AddRouteProps {
  setIsAddRoute: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoute: React.Dispatch<React.SetStateAction<string | null>>;
}
