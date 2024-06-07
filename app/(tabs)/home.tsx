import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import { useAppWrite } from '@/hooks/useAppWrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/useGlobalContext'

const Home = () => {

    const { user } = useGlobalContext();

    const { data: posts, loading, refetch } = useAppWrite(getAllPosts);
    const { data: latestPosts } = useAppWrite(getLatestPosts);

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => {
                    return <VideoCard post={item} />
                }}
                ListHeaderComponent={() => {
                    return <View className='my-6 px-4 space-y-6'>
                        <View className='justify-between items-start flex-row mb-6'>
                            <View>
                                <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                                <Text className='text-xl font-psemibold text-white'>{user?.username}</Text>
                            </View>
                            <View className='mt-1.5'>
                                <Image source={images.logoSmall} resizeMode='contain' className='w-9 h-10' />
                            </View>
                        </View>
                        <SearchInput initialQuery={""} />
                        <View className='w-full flex-1 pt-5 pb-8'>
                            <Text className='text-gray-100 text-lg mb-3 font-pregular'>Latest View</Text>
                            <Trending posts={latestPosts} />
                        </View>
                    </View>
                }}
                ListEmptyComponent={() => {
                    return <EmptyState title='No Videos Found' subTitle='Be the first one to upload the video.' />
                }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            />
        </SafeAreaView>
    )
}

export default Home