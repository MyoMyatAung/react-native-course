import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import { icons } from "@/constants";
import { useAppWrite } from "@/hooks/useAppWrite";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/useGlobalContext";
import InfoBox from "@/components/InfoBox";

export default function Profile() {

    const { user, setIsLoggedIn, setUser } = useGlobalContext();
    const { data: posts } = useAppWrite(() => user ? getUserPosts(user.$id) : []);
    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(null);
        router.replace('/sign-in')
    }

    if (!user) {
        return <SafeAreaView className='bg-primary h-full flex justify-center items-center'>
            <EmptyState title='User not found' subTitle='Please log in to view your profile.' />
        </SafeAreaView>
    }

    return <SafeAreaView className='bg-primary h-full'>
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => {
                return <VideoCard post={item} />
            }}
            ListHeaderComponent={() => {
                return <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
                    <TouchableOpacity className="w-full items-end mb-10" onPress={handleLogout}>
                        <Image source={icons.logout} className="w-6 h-6" resizeMode="contain" />
                    </TouchableOpacity>
                    <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                        <Image source={{ uri: user.avatar }} className="w-[90%] h-[90%] rounded-lg" resizeMode="cover" />
                    </View>
                    <InfoBox title={user.username} containerStyles="mt-5" titleStyle="text-lg" />
                    <View className="mt-5 flex-row">
                        <InfoBox title={posts.length.toString() || ''} subtitle="Posts" titleStyle="text-xl" containerStyles="mr-10" />
                        <InfoBox title="1.2K" subtitle="Followers" titleStyle="text-xl" />
                    </View>
                </View>
            }}
            ListEmptyComponent={() => {
                return <EmptyState title='No Videos Found' subTitle='Be the first one to upload the video.' />
            }}
        />
    </SafeAreaView>
}