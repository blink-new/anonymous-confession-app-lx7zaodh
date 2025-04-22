
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type Tab = {
  key: string;
  title: string;
};

type TabSegmentProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
};

export function TabSegment({ tabs, activeTab, onTabChange }: TabSegmentProps) {
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const handleTabPress = (tabKey: string, index: number) => {
    // Calculate the position and width for the indicator
    const tabWidth = 100 / tabs.length;
    const position = index * tabWidth;
    
    indicatorPosition.value = withTiming(position, { duration: 200 });
    indicatorWidth.value = withTiming(tabWidth, { duration: 200 });
    
    onTabChange(tabKey);
  };

  // Set initial indicator position and width
  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (activeIndex !== -1) {
      const tabWidth = 100 / tabs.length;
      indicatorPosition.value = activeIndex * tabWidth;
      indicatorWidth.value = tabWidth;
    }
  }, []);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      left: `${indicatorPosition.value}%`,
      width: `${indicatorWidth.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { width: `${100 / tabs.length}%` },
            ]}
            onPress={() => handleTabPress(tab.key, index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.title}
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
    position: 'relative',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2D2D3F',
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'SpaceGrotesk_500Medium',
  },
  activeTabText: {
    color: '#E2E8F0',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#9775fa',
    borderRadius: 1.5,
  },
});