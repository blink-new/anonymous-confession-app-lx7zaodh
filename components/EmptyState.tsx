
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaskIcon } from './MaskIcon';

type EmptyStateProps = {
  message: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, subMessage, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaskIcon size={64} color="#2D2D3F" />
      
      <Text style={styles.message}>{message}</Text>
      
      {subMessage && (
        <Text style={styles.subMessage}>{subMessage}</Text>
      )}
      
      {actionLabel && onAction && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  subMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  actionButton: {
    backgroundColor: '#9775fa',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});