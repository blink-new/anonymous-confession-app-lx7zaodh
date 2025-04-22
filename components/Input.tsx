
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        placeholderTextColor="#94A3B8"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {error && (
        <Animated.Text 
          style={styles.errorText}
          entering={FadeIn.duration(300)}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#E2E8F0',
    fontFamily: 'Inter_500Medium',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#2D2D3F',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#E2E8F0',
    backgroundColor: '#1E1E2E',
    fontFamily: 'Inter_400Regular',
  },
  inputFocused: {
    borderColor: '#9775fa',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
});