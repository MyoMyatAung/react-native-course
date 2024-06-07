import React, { useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'

import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { searchPosts } from '@/lib/appwrite'
import { useAppWrite } from '@/hooks/useAppWrite'
import VideoCard from '@/components/VideoCard'

const Search = () => {

    const { query } = useLocalSearchParams();

    const { data: posts, loading, refetch } = useAppWrite(() => searchPosts(query as string));

    useEffect(() => {
        refetch();
    }, [query])

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
                        <Text className='font-pmedium text-sm text-gray-100'>Search Results</Text>
                        <Text className='text-xl font-psemibold text-white'>{query}</Text>
                        <View className='mt-6 mb-8'>
                            <SearchInput initialQuery={query as string} />
                        </View>
                    </View>
                }}
                ListEmptyComponent={() => {
                    return <EmptyState title='No Videos Found' subTitle='No videos found for this search query.' />
                }}
            />
        </SafeAreaView>
    )
}

export default Search