const production = process.env.NODE_ENV === "production"

function babelOptions() {
  return {
    plugins: production 
      ? ["transform-remove-console"] 
      : []
  }
}

module.exports = {
  mount: {
    public: "/",
    src: "/_dist_"    
  },
  plugins: [
    [
      "@snowpack/plugin-svelte", 
      {
        preprocess: require("svelte-preprocess")({  // svelte-preprocess 는 @snowpack/plugin-svelte에 내장되어 있음
          scss: {
            prependData: '@import "./src/scss/main.scss";'
          },
          postcss: {  // 번들링 이후의 처리
            plugins: [
              require('autoprefixer')()
            ]
          },
          babel: babelOptions()
        })
      }
    ],
    [
      "@snowpack/plugin-babel",
      {
        transformOptions: babelOptions()
      }
    ],
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-sass",
    "@snowpack/plugin-optimize"      
  ],
  alias: {
    "~": "./src"
  }
}