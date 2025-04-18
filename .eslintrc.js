module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/explicit-function-return-type': 'warn', // rule for function returnType
        'no-console': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',

        'prettier/prettier': [
            'warn',
            {
                arrowParens: 'always',
                bracketSameLine: false,
                bracketSpacing: true,
                embeddedLanguageFormatting: 'auto',
                insertPragma: false,
                printWidth: 100,
                proseWrap: 'preserve',
                quoteProps: 'as-needed',
                requirePragma: false,
                semi: true,
                singleQuote: true,
                tabWidth: 2,
                trailingComma: 'all',
                useTabs: false,
                endOfLine: 'auto',
            },
        ],
    },
};
