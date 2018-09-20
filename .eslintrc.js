module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/recommended', '@vue/airbnb', '@vue/typescript'],
    plugins: [
        'prettier',
        'vue'
    ],
    rules: {
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': 0,
        'vue/mustache-interpolation-spacing': 0,
        'max-len': 0,
        indent: [0, 'tab'],
        'no-tabs': 0,
        quotes: 1,
        'arrow-parens': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    },
    parserOptions: {
        parser: 'typescript-eslint-parser',
    },
};
