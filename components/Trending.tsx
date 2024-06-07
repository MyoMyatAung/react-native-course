import { FlatList, TouchableOpacity, ImageBackground, Image, ViewToken } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from "react-native-animatable";
import { Video, ResizeMode } from "expo-av";

import { Post } from '@/constants/models'
import { icons } from '@/constants';

type Props = {
    posts: Array<Post>
}

type TrendingItemProps = {
    activeItem: Post,
    item: Post
}

const zoomIn = {
    0: {
        opacity: 1,
        scale: 0.9,
    },
    1: {
        opacity: 1,
        scale: 1.1
    }
}

const zoomOut = {
    0: {
        opacity: 1,
        scale: 1.1,
    },
    1: {
        opacity: 1,
        scale: 0.9
    }
}

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
    const [play, setPlay] = useState<boolean>(false);

    const handleOnPlay = () => {
        setPlay(prev => !prev);
    }

    return <Animatable.View
        className='mr-5'
        animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
        duration={500}
    >
        {
            play ?
                <Video
                    source={{ uri: item.video }}
                    className='w-52 h-72 rounded-[35px] mt-3  bg-white/10'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if ("didJustFinish" in status && status.didJustFinish) {
                            setPlay(false);
                        }
                    }}
                />
                :
                <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} onPress={handleOnPlay}>
                    <ImageBackground source={{ uri: item.thumbnail }} className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40' resizeMode='cover' />
                    <Image source={icons.play} className='w-12 h-12 absolute' resizeMode='contain' />
                </TouchableOpacity>
        }
    </Animatable.View>
}

const Trending: React.FC<Props> = ({ posts }) => {

    const [activeItem, setActiveItem] = useState<Post>(posts[0]);

    const viewableItemsChange = (info: { viewableItems: ViewToken<Post>[]; changed: ViewToken<Post>[]; }) => {
        if (info.viewableItems.length > 0) {
            setActiveItem(info.viewableItems[0].item);
        }
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            horizontal
            renderItem={({ item }) => {
                return <TrendingItem activeItem={activeItem} item={item} />
            }}
            onViewableItemsChanged={viewableItemsChange}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170, y: 0 }}
        />
    )
}

export default Trending