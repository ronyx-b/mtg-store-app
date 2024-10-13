import useIsAdmin from "@/services/cache/useIsAdmin";
import { selectToken } from "@/services/store/tokenSlice";
import { useSelector } from "react-redux";

export default function Account({ ...props }) {
  const token = useSelector(selectToken);
  const isAdmin = useIsAdmin(token);

  return (<>
  <p>Account</p>
  <p>Admin: {isAdmin ? "yes" : "no"}</p>
  </>);
}