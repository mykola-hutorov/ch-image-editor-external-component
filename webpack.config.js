const path = require("path");
const glob = require("glob");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

function getConfig() {
    const entries = glob.globSync("./src/!(_*)/Index.{js,ts,jsx,tsx}").map(entryPath => [path.basename(path.dirname(entryPath)), `./${entryPath}`])
    return {
        entry: Object.fromEntries(entries),
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    use: 'ts-loader',
                },
                {
                    test: /\.(js|jsx)$/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'public'),
            library: {
                type: "module"
            }
        },
        // plugins: [
        //     new CopyWebpackPlugin({
        //         patterns: [
        //             { from: 'src/static', to: 'static' }
        //         ]
        //     })
        // ],
        devServer: {
            compress: true,
            hot: false,
            port: 3000,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            watchFiles: ['./src/**/*'],
        },
        optimization: {
            minimize: false,
            minimizer: [
            new TerserPlugin({
                exclude: /static/,
            }),
            ],
        },
        experiments: {
            outputModule: true
        }
    };
}

module.exports = getConfig();