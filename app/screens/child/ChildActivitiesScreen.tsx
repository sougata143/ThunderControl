import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChildActivitiesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ChildActivitiesScreen;
