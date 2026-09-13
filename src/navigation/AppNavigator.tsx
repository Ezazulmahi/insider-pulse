import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ScreenerScreen } from '../screens/ScreenerScreen';
import { TradeDetailsScreen } from '../screens/TradeDetailsScreen';
import { colors } from '../theme/colors';
import { TradeFilters } from '../utils/filterTrades';

export type RootStackParamList = {
  Home: undefined;
  Screener: { focusSearch?: boolean; preset?: Omit<TradeFilters, 'query'> } | undefined;
  TradeDetails: { tradeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    border: colors.border,
    primary: colors.analytics,
    text: colors.text,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Screener" component={ScreenerScreen} />
        <Stack.Screen name="TradeDetails" component={TradeDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
