import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLTextAreaElement: 'readonly',
                FileReader: 'readonly',
                HTMLElement: 'readonly',
                Event: 'readonly',
                MouseEvent: 'readonly',
                KeyboardEvent: 'readonly',
                AbortController: 'readonly',
                Response: 'readonly',
                Request: 'readonly',
                Headers: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                process: 'readonly',
                Image: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            // TypeScript
            'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
            'no-undef': 'off', // TypeScript handles this
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': 'warn',

            // React
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/jsx-no-target-blank': 'error',
            'react/self-closing-comp': 'warn',

            // React Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // General
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'prefer-const': 'warn',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        ignores: ['node_modules/', 'dist/', 'build/', '*.config.*'],
    },
];
