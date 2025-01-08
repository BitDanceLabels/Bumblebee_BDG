// Updated by trungquandev.com's author on May 13 2023
// Sample Eslint config for React project
module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '20.11' } },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,

    'no-console': 1, //Không console.log trong dự án
    'no-lonely-if': 1, //If phải có else, không được đứng rời
    'no-unused-vars': 1, //Biến không sử dụng thì phải xóa đi
    'no-trailing-spaces': 1, //Thừa nhiều khoảng trắng ở cuối dòng code
    'no-multi-spaces': 1, //Thừa nhiều khoảng trắng ở trong code (VD: a   <   b)
    'no-multiple-empty-lines': 1, //Thừa nhiều enter line
    'space-before-blocks': ['error', 'always'], //Trước các khối code sẽ phải có khoảng trắng
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2], //Khoảng cách khi tab là 2
    //'semi': [1, 'never'], //Không có dấu ;
    //'quotes': ['warn', 'single'], //Dùng nháy đơn thay vì nháy kép cho BIẾN kiểu chuỗi
    'array-bracket-spacing': 1, //Không thừa khoảng trắng trong khai báo array
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1, //Dư dấu phẩy ở cuối dòng code
    'comma-spacing': 1, //Dư khoảng trắng trước dấu phẩy (VD: var a = 5 , var b = 6)
    'arrow-spacing': 1
  }
}