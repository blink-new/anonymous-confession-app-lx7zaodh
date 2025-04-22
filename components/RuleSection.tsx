
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type RuleSectionProps = {
  title: string;
  rules: string[];
  icon?: React.ReactNode;
};

export function RuleSection({ title, rules, icon }: RuleSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rulesList}>
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleItem}>
            <View style={styles.bullet} />
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9775fa',
    marginTop: 7,
    marginRight: 10,
  },
  ruleText: {
    fontSize: 14,
    color: '#E2E8F0',
    flex: 1,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
});