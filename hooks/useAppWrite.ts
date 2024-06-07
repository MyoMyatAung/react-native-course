import { Post } from "@/constants/models";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useAppWrite = (fn: Function): { data: Array<Post>, loading: boolean, refetch: Function } => {
    const [data, setData] = useState<Array<Post>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fn();
            setData(response);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();
    return { data, loading, refetch }
}