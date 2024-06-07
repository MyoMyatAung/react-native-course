import { useEffect, useState } from "react"
import { GlobalContext } from "./useGlobalContext"
import { getCurrentUser } from "@/lib/appwrite"

type Props = {
    children: React.ReactNode
}
const GlobalProvider: React.FC<Props> = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getCurrentUser()
            .then(res => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

    return <GlobalContext.Provider value={{ isLoading, isLoggedIn, user, setUser, setIsLoggedIn }}>
        {children}
    </GlobalContext.Provider>
}

export default GlobalProvider;