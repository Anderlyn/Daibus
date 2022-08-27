import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
const useUser = async () => {
  const auth = await getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return auth.currentUser;
    } else {
      window.location.href = "/login";
    }
  });
};

export default useUser;
