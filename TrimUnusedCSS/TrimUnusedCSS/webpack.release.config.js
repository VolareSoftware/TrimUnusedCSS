const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                map: { inline: false }
            }
        })
    ]
};