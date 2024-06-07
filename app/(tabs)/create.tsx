import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native'
import { View } from 'react-native-animatable'
import * as DocumentPicker from 'expo-document-picker';

import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { CreatePost } from '@/constants/models'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton'
import { router } from 'expo-router';
import { createVideo } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/useGlobalContext';

const Create = () => {
    const { user } = useGlobalContext();
    const [uploading, setUploading] = useState<boolean>(false);
    const [form, setForm] = useState<CreatePost>({
        title: '',
        video: null,
        thumbnail: null,
        prompt: ''
    });

    const openPicker = async (selectType: string) => {
        const result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
            type: selectType === 'image' ? ['image/png', 'image/jpeg', 'image/jpg'] : ['video/mp4', 'video/gif'],
        });

        if (!result.canceled) {
            if (selectType === 'image') {
                setForm(prev => {
                    return { ...prev, thumbnail: result.assets[0] }
                })
            }
            if (selectType === 'video') {
                setForm(prev => {
                    return { ...prev, video: result.assets[0] }
                })
            }
        }
    }

    const handleTitleChange = (val: string) => {
        setForm((prev) => {
            return { ...prev, title: val }
        })
    }

    const handlePromptChange = (val: string) => {
        setForm((prev) => {
            return { ...prev, prompt: val }
        })
    }

    const handleSubmit = async () => {
        if (!user) return;
        if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
            return Alert.alert("Error", "Please fill all fields")
        }

        setUploading(true);
        try {
            await createVideo(form, user.$id)

            Alert.alert("Success", "Post uploaded successfully");
            router.push("/home")
        } catch (error: any) {
            Alert.alert("Error", error.message)
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
                prompt: ''
            })
            setUploading(false);
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView className='px-4 my-6'>
                <Text className='text-2xl text-white font-psemibold'>Upload View</Text>
                <FormField
                    label='Video Title'
                    value={form.title}
                    placeholder='Give your video a catch title....'
                    onChangeText={handleTitleChange}
                    otherStyle='mt-10'
                />
                <View className='mt-7 space-y-2'>
                    <Text className='text-sm text-gray-100 font-pmedium'>Upload Video</Text>
                    <TouchableOpacity onPress={() => openPicker('video')}>
                        {
                            !!form.video ?
                                <Video
                                    source={{ uri: form.video.uri }}
                                    className='w-full h-64 rounded-2xl'
                                    resizeMode={ResizeMode.COVER}
                                />
                                :
                                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                                    <View className='w-14 h-14 border border-dashed border-secondary justify-center items-center'>
                                        <Image source={icons.upload} resizeMode='contain' className='w-1/2 h-1/2' />
                                    </View>
                                </View>
                        }
                    </TouchableOpacity>
                </View>

                <View className='mt-7 space-y-2'>
                    <Text className='text-sm text-gray-100 font-pmedium'>Thumbnail Image</Text>
                    <TouchableOpacity onPress={() => openPicker('image')}>
                        {
                            !!form.thumbnail ?
                                <Image
                                    source={{ uri: form.thumbnail.uri }}
                                    className='w-full h-64 rounded-2xl'
                                    resizeMode="cover"
                                />
                                :
                                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                                    <Image source={icons.upload} resizeMode='contain' className='w-5 h-5' />
                                    <Text className='text-sm text-gray-100 font-pmedium'>Choose a file</Text>
                                </View>
                        }
                    </TouchableOpacity>
                </View>
                <FormField
                    label='AI Prompt'
                    value={form.prompt}
                    placeholder='The prompt you used to create this video..'
                    onChangeText={handlePromptChange}
                    otherStyle='mt-7'
                />

                <CustomButton label='Submit & Publish' handlePress={handleSubmit} containerStyle='mt-7' isLoading={uploading} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Create