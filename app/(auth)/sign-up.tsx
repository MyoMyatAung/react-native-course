import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'

import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/useGlobalContext'

type SignUpFormData = {
    username: string,
    email: string,
    password: string,
}

const SignUp = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState<SignUpFormData>({ username: "", email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleUsernameChange = (val: string) => {
        setForm(prev => ({
            ...prev,
            username: val
        }));
    }

    const handleEmailChange = (val: string) => {
        setForm((prev) => ({
            ...prev,
            email: val
        }))
    }

    const handlePasswordChange = (val: string) => {
        setForm((prev) => ({
            ...prev,
            password: val
        }))
    }

    const handleSubmit = async () => {
        if (!form.email || !form.username || !form.password) {
            Alert.alert('Error', 'Pease fill in all the fields');
        }
        setIsSubmitting(true);
        try {
            const res = await createUser(form.email, form.username, form.password);
            setUser(res);
            setIsLoggedIn(true);
            router.replace("/home");
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full'>
            <ScrollView>
                <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
                    <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
                    <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Sign up to Aora</Text>
                    <FormField otherStyle='mt-7' label='Username' onChangeText={handleUsernameChange} value={form.username} />
                    <FormField otherStyle='mt-2' keyboardType='email-address' label='E-mail' onChangeText={handleEmailChange} value={form.email} />
                    <FormField otherStyle='mt-2' label='Password' onChangeText={handlePasswordChange} value={form.password} />
                    <CustomButton label='Sign Up' handlePress={handleSubmit} containerStyle='mt-7' isLoading={isSubmitting} />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <Text className='text-md text-gray-100 font-pregular'>Already have account?</Text>
                        <Link href="/sign-in" className='text-md font-pregular text-secondary'>Sign In</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp