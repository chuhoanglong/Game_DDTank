import { Dimensions, Platform } from 'react-native';
let { width, height } = Dimensions.get('screen');

export const width_screen = width < height ? width : height;
export const height_screen = width > height ? width : height;
