var THREE = require('three');
module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'index.js',
        path:__dirname + "/www",
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options:{presets: ['es2015']}
                }]
            }
        ]
    }
}