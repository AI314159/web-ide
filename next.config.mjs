// next.config.mjs
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

export default {
  webpack: (config) => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["c"],
        filename: "static/[name].worker.js",
      })
    );
    return config;
  },
  devIndicators: false,
};
