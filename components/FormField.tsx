import { View, Text, TextInput, TextInputProps, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants';

type Prop = {
    label: string,
    otherStyle?: string,
} & TextInputProps

const FormField: React.FC<Prop> = ({ label, otherStyle, ...rest }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleToggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <View className={`space-y-2 ${otherStyle}`}>
            <Text className='text-md text-gray-100 font-pmedium'>{label}</Text>
            <View className='border-2 border-black-200 rounded-2xl w-full h-14 px-4 bg-black-100 focus:border-secondary items-center flex-row'>
                <TextInput
                    className='flex-1 text-white font-psemibold text-md'
                    placeholderTextColor="#7b7b8b"
                    secureTextEntry={label === "Password" && !showPassword}
                    {...rest}
                />
                {label === 'Password' &&
                    <TouchableOpacity onPress={handleToggleShowPassword}>
                        <Image source={showPassword ? icons.eyeHide : icons.eye} className='w-6 h-6' resizeMode='contain' />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default FormField