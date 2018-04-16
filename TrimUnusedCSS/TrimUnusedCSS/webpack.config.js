const path = require("path");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const PurifyCSSPlugin = require("purifycss-webpack");

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
           new ExtractTextPlugin("[name].css")//,
            //new PurifyCSSPlugin({
            //    paths: glob.sync([
            //        path.join(__dirname, "Views/**/*.cshtml"),
            //        path.join(__dirname, "Scripts/app/**/*.html")
            //    ]),
            //    purifyOptions: {
            //        whitelist: [".some-dynamic-class"]
            //    }
            //})
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
                    use: ExtractTextPlugin.extract({
                        use: "css-loader"
                    })
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