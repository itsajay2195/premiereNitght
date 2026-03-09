import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  DETAILS_SCREEN,
  HOME_SCREEN,
  MAIN_SCREEN,
  WATCHLIST_SCREEN,
} from '../constants/screens';
import { Movie } from '../api/types/movie';

export type RootStackParamList = {
  [MAIN_SCREEN]: undefined;
  [DETAILS_SCREEN]: { movieId: number; movie?: Movie };
};

export type TabParamList = {
  [HOME_SCREEN]: undefined;
  [WATCHLIST_SCREEN]: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
