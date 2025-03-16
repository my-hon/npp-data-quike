module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      '@vue/babel-plugin-jsx',
      { 
        mergeProps: false,
        enableObjectSlots: false // 需要添加此参数
      }
    ]
  ]
}