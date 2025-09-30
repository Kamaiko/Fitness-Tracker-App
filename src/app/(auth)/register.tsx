import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Halterofit</Text>
      <Text style={styles.subtitle}>Create your account to start tracking</Text>
      {/* Registration form will be added here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
});