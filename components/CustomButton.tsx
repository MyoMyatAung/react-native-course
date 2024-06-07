import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
    label: string,
    containerStyle?: string,
    textStyle?: string,
    handlePress: (event: GestureResponderEvent) => void,
    isLoading?: boolean,
}

const CustomButton: React.FC<Props> = ({ label, containerStyle, textStyle, handlePress, isLoading }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            className={`bg-secondary rounded-xl min-h-[52px] justify-center items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
        >
            <Text className={`text-primary font-psemibold text-md ${textStyle}`}>{label}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton