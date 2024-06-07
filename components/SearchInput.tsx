import { View, Alert, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';
import { router, usePathname } from 'expo-router';

type Props = {
    initialQuery: string;
}

const SearchInput: React.FC<Props> = ({ initialQuery }) => {

    const pathname = usePathname();

    const [query, setQuery] = useState(initialQuery || '');

    const handleOnChangeText = (val: string) => {
        setQuery(val);
    }

    const handleOnSearch = () => {
        if (!query) {
            return Alert.alert('Missing query', 'Please input something to search results across database.')
        }
        if (pathname.startsWith('/search')) {
            router.setParams({ query });
        } else {
            router.push(`/search/${query}`);
        }
    }

    return (
        <View className='border-2 border-black-200 rounded-2xl w-full h-14 px-4 bg-black-100 focus:border-secondary items-center flex-row space-x-4'>
            <TextInput
                className='text-base mt-0.5 text-white flex-1 font-pregular'
                placeholderTextColor="#CDCDE0"
                placeholder='Search for a video topic'
                value={query}
                onChangeText={handleOnChangeText}
            />
            <TouchableOpacity onPress={handleOnSearch}>
                <Image source={icons.search} className='w-5 h-5' resizeMode='contain' />
            </TouchableOpacity>
        </View>
    )
}

export default SearchInput