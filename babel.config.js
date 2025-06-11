module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-paper/babel',
            [
                'module-resolver',
                {
                    root: ['.'],
                    alias: {
                        '@': '.',
                        '@/src': './src',
                        '@/components': './src/components',
                        '@/screens': './src/screens',
                        '@/utils': './src/utils',
                        '@/hooks': './src/hooks',
                        '@/contexts': './src/contexts',
                        '@/types': './src/types'
                    }
                }
            ]
        ]
    };
};
