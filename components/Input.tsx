
import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  ...props 
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.multilineInput
        ]}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2D2D3F',
    borderRadius: 8,
    padding: 12,
    color: '#E2E8F0',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
});