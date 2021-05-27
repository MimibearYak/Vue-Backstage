/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-25 19:56:25
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-04 21:16:39
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-unused-vars':'off',
    'no-unused-vars':'off', //没使用变量无视
  }
}
