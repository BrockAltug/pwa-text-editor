const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

// Use workbox plugins for adding service worker functionality and generating the PWA manifest file.
// Set up CSS loaders and Babel for ES6 compatibility.

module.exports = () => {
  return {
    mode: "development", // Set the build mode to development for easier debugging.
    entry: {
      main: "./src/js/index.js", // Entry point for the main application script.
      install: "./src/js/install.js", // Entry point for the service worker install script.
    },
    output: {
      filename: "[name].bundle.js", // Define the output file name based on entry points.
      path: path.resolve(__dirname, "dist"), // Output path for bundled files.
    },
    plugins: [
      // HtmlWebpackPlugin automatically generates an HTML file and injects the JavaScript bundles.
      new HtmlWebpackPlugin({
        template: "./index.html", // Template HTML file to use for generation.
        title: "Text Editor", // Sets the title for the generated HTML page.
      }),

      // Inject custom service worker into the build.
      new InjectManifest({
        swSrc: "./src-sw.js", // Path to the custom service worker.
        swDest: "src-sw.js", // Output path for the generated service worker file.
      }),

      // WebpackPwaManifest generates the manifest.json for PWA configuration.
      new WebpackPwaManifest({
        fingerprints: false, // Disable fingerprints for the icons in the manifest.
        inject: true, // Inject the generated manifest into the HTML file.
        name: "Text Editor", // Full name of the PWA.
        short_name: "textedit", // Short name for the PWA, displayed on the home screen.
        description: "Snip and save, even when offline!", // Description of the PWA's functionality.
        background_color: "#225ca3", // Background color for the PWA.
        theme_color: "#225ca3", // Theme color for the PWA, typically used in the address bar.
        start_url: "./", // Start URL for the PWA.
        publicPath: "./", // Public path for the PWA assets.
        icons: [
          {
            src: path.resolve("src/images/logo.png"), // Path to the icon image.
            sizes: [96, 128, 192, 256, 384, 512], // Sizes of the icon for different device resolutions.
            destination: path.join("assets", "icons"), // Destination folder for icons.
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i, // Apply loaders for CSS files.
          use: ["style-loader", "css-loader"], // Use style-loader and css-loader to process CSS files.
        },
        {
          test: /\.m?js$/, // Apply Babel loader for JavaScript files.
          exclude: /node_modules/, // Exclude node_modules from being processed.
          use: {
            loader: "babel-loader", // Use Babel to transpile ES6+ code.
            options: {
              presets: ["@babel/preset-env"], // Preset to transpile modern JavaScript.
              plugins: [
                "@babel/plugin-proposal-object-rest-spread", // Plugin for object spread syntax.
                "@babel/transform-runtime", // Plugin to optimize helper functions.
              ],
            },
          },
        },
      ],
    },
  };
};