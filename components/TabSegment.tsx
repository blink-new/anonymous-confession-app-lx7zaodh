
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Tab = {
  key: string;
  label: string;
};

type TabSegmentProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function TabSegment({ tabs, activeTab, onTabChange }: TabSegmentProps) {
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
  
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: withTiming(activeIndex * (100 / tabs.length) + '%', { 
            duration: 250 
          }) 
        }
      ],
      width: `${100 / tabs.length}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { width: `${100 / tabs.length}%` }
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    fontFamily: 'Inter_500Medium',
  },
  activeTabText: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#9775fa',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});