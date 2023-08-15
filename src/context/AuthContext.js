import { createContext } from "react"
export const AuthContext = createContext({
    user: undefined,
    loggedInUser: {},
    allUsers: {},
    setUser: () => {},
});