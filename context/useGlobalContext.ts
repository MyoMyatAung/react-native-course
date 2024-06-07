import { User } from "@/constants/models";
import { createContext, useContext, useState, useEffect } from "react";

type ContextDefaultType = {
    isLoggedIn: boolean,
    user: User | null,
    isLoading: boolean,
    setUser: any,
    setIsLoggedIn: any,
}

const contextDefaultValue: ContextDefaultType = {
    isLoggedIn: false,
    user: null,
    isLoading: true,
    setUser: () => { },
    setIsLoggedIn: () => { },
}

export const GlobalContext = createContext(contextDefaultValue);
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};