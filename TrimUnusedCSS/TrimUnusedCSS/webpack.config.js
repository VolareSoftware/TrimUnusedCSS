const path = require("path");
const glob = require("glob-all");
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");

module.exports = env => {
    const commonConfig = {
        entry: {
            index: "index.js"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "dist"),
            publicPath: "/dist"
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new PurifyCSSPlugin({
                paths: glob.sync([
                    path.join(__dirname, "Views/**/*.cshtml"),
                    path.join(__dirname, "Scripts/**/*.html"),
                    path.join(__dirname, "Scripts/**/*.js")
                ]),
                purifyOptions: {
                    whitelist: ["*some-dynamic-class*"]
                }
            })
        ],
        resolve: {
            extensions: [
                ".js"
            ],
            modules: [
                path.resolve(__dirname, "Scripts"),
                path.resolve(__dirname, "Styles"),
                "node_modules"
            ],
            alias: {
                jquery: path.resolve(__dirname, "node_modules/jquery/dist/jquery.min.js"),
                ko: path.resolve(__dirname, "node_modules/knockout/build/output/knockout-latest.js")
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["env"]
                        }
                    }
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: ["raw-loader"]
                },
                {
                    test: /\.css$/,
                    include: path.resolve(__dirname, "Styles"),
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                }
            ]
        }
    };

    let finalConfig = null;
    switch (env.configuration) {
        case "RELEASE":
            finalConfig = merge(commonConfig, require("./webpack.release.config"));
            break;
        case "DEBUG":
            finalConfig = merge(commonConfig, require("./webpack.debug.config"));
            break;
    }

    return finalConfig;
};