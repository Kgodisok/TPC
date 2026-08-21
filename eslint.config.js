const eslint = require('@eslint/js');

module.exports = [
    {
        ignores: ['node_modules/**']
    },
    eslint.configs.recommended,
    {
        files: ['backend/**/*.js', 'tests/**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly'
            }
        },
        rules: {
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always']
        }
    }
];
