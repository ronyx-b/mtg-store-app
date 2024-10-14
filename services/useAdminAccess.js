import { useSelector } from "react-redux";
import { selectToken } from "./store/tokenSlice";
import useIsAdmin from "./cache/useIsAdmin";
import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * A custom hooks that provides information of whether the current user is admin or not, and automatically redirects the user to the home landing page if the user is not admin.
 * @returns {{ isAdminAccessLoading: boolean, isAdmin: boolean }} and object with consisting of: "isAdmin": a boolean that indicates whether the user is admin or not; "isAdminAccessLoading": a boolean that indicates status of admin information retrieval.
 */
export default function useAdminAccess() {
  const token = useSelector(selectToken);
  const isAdmin = useIsAdmin(token);
  const router = useRouter();

  useEffect(() => {
    if(!isAdmin.isLoading && isAdmin.data === false) {
      router.push("/");
    }
  }, [isAdmin, router]);

  return ({
    isAdminAccessLoading: isAdmin.isLoading,
    isAdmin: isAdmin.data
  });
}