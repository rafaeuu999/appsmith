import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

async function webpackConfig(config) {
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      },
    },
  });

  config.module.rules.push({
    test: /\.module\.css$/,
    use: [
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              "postcss-nesting",
              "postcss-import",
              "postcss-at-rules-variables",
              "postcss-conditionals",
              "postcss-for",
              "postcss-each",
              "postcss-modules-values",
              [
                "cssnano",
                {
                  preset: ["default"],
                },
              ],
            ],
          },
        },
      },
    ],
  });

  config.resolve.plugins.push(new TsconfigPathsPlugin());
  return config;
}

function getStories() {
  if (process.env.CHROMATIC) {
    return ["../chromatic/**/*.chromatic.stories.@(js|jsx|ts|tsx)"];
  }

  return [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ];
}

module.exports = {
  stories: getStories(),
  addons: [
    "@storybook/addon-viewport",
    "@storybook/addon-docs",
    "@storybook/addon-actions",
    "@storybook/addon-controls",
    "@storybook/addon-toolbars",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    "@storybook/preset-create-react-app",
    "./addons/theming/manager.ts",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: webpackConfig,
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
};
