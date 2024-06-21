
import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",

};
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);
//By using { children }, we're explicitly extracting the children prop from the props object passed to the ThemeProvider component. This makes the code more concise and easier to understand.
//{ children }: This represents all the components that are wrapped inside the ThemeProvider when it is used in the component tree.
//When the ThemeProvider wraps other components, it passes the context values down to those children.
//The children prop represents the content nested inside the provider component when it is used in the application.
const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [ isLoading, setIsLoading ] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio:currentAccount.bio,
          
        })
        setIsAuthenticated(true);
        return true;
      } 

        return false;

      /*
      const {$id,name,username,email,imageUrl,bio} = await getCurrentUser();
      
      if ($id) {
        setUser({
          id: $id,
          name,
          username,
          email,
          imageUrl,
          bio,
        })
      }
      
instead of this above,If you destructure the currentAccount, in If statement,you don't even need currentAccount since you don't have full access to it if u destructure props inside.
Here,If you keep your code like this just to write less by destructuring the currentAccount,it will cause a typescript error 
since the getCurrentUser() function in api.tsx does have catch block and these $id,name etc. are not defined in case the getCurrentUser() fails.
*/
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === null ||
      localStorage.getItem("cookieFallback") === "[]" 
    ) navigate("/sign-in");
    
    checkAuthUser();
  },[]);



  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);