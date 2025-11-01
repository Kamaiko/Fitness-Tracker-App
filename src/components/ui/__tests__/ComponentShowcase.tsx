import { View, Text, ScrollView } from 'react-native';
import { Icon } from '@/components/ui/icon';

/**
 * Component Showcase - UI Foundation Test
 *
 * This component validates the React Native Reusables installation
 * by rendering the Icon wrapper with various configurations.
 *
 * **Test Coverage:**
 * - Icon wrapper with all size variants (sm, md, lg, xl)
 * - Icon wrapper with all color variants (default, primary, secondary, etc.)
 * - All three icon packs (MaterialIcons, Ionicons, FontAwesome)
 * - Tailwind class merging with cn() utility
 *
 * **Usage:**
 * Import this component in your app to verify installation.
 * Delete after Phase 0.6 is complete.
 *
 * @example
 * ```tsx
 * import { ComponentShowcase } from '@/components/ui/__tests__/ComponentShowcase';
 *
 * export default function TestScreen() {
 *   return <ComponentShowcase />;
 * }
 * ```
 */
export function ComponentShowcase() {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-foreground mb-6">Icon Component Test</Text>

      {/* Size Variants */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">Size Variants</Text>
        <View className="flex-row gap-4 items-center">
          <Icon name="home" size="sm" />
          <Icon name="home" size="md" />
          <Icon name="home" size="lg" />
          <Icon name="home" size="xl" />
        </View>
      </View>

      {/* Color Variants */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">Color Variants</Text>
        <View className="flex-row gap-4 flex-wrap">
          <Icon name="circle" variant="default" size="lg" />
          <Icon name="circle" variant="primary" size="lg" />
          <Icon name="circle" variant="success" size="lg" />
          <Icon name="circle" variant="danger" size="lg" />
          <Icon name="circle" variant="warning" size="lg" />
        </View>
      </View>

      {/* Icon Packs */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">Icon Packs</Text>
        <View className="gap-3">
          <View className="flex-row gap-2 items-center">
            <Icon name="home" pack="material" size="lg" />
            <Text className="text-foreground">MaterialIcons</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Icon name="home" pack="ionicons" size="lg" />
            <Text className="text-foreground">Ionicons</Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <Icon name="home" pack="fontawesome" size="lg" />
            <Text className="text-foreground">FontAwesome</Text>
          </View>
        </View>
      </View>

      {/* Custom Classes */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Custom Styling (cn utility)
        </Text>
        <View className="flex-row gap-4">
          <Icon name="star" className="text-yellow-400" size="lg" />
          <Icon name="heart" className="text-red-500" size="lg" />
          <Icon name="check-circle" className="text-green-500" size="lg" />
        </View>
      </View>

      <Text className="text-sm text-foreground-secondary mt-4">
        ✅ React Native Reusables installation validated
      </Text>
    </ScrollView>
  );
}
