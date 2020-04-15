const plugins = []
if(['production','prod'].includes(process.env.NODE_ENV)){
    plugins.push("transform-remove-console")
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  presets: [['@vue/app',{'useBuiltins':'entry'}]],
  plugins:plugins
};
