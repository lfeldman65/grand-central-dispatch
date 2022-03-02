import { StyleSheet, TouchableHighlight, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  children: React.ReactNode;
  onPress?(): void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: ButtonVariant;
  accessibilityLabel?: string;
}

function getColor(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return '#00abf7';
    case 'secondary':
      return '#6c757d';
  }
}

export default function Button(props: ButtonProps) {
  const { children, onPress, size = 'md', title, variant = 'primary', accessibilityLabel = `${title} button` } = props;

  const styles = StyleSheet.create({
    button: {
      padding: 10,
      textAlign: 'center',
      backgroundColor: getColor(variant),
      borderRadius: 5,
    },
    buttonText: {
      fontWeight: '400',
      fontSize: 14,
      color: '#fff',
    },
  });

  return (
    <TouchableHighlight style={styles.button} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableHighlight>
  );
}
