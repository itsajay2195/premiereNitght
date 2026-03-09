import Toast from 'react-native-toast-message';

export const showToast = {
  error: (message: string) =>
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: message,
      position: 'bottom',
    }),
  success: (message: string) =>
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    }),
};
