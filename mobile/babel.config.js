module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@store': './src/store',
          '@api': './src/api',
          '@theme': './src/theme',
          '@types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@validation': './src/validation',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
