const path = require('path')
module.exports = {
    publicPath: './', // 基本路徑
    outputDir: 'dist', // 輸出檔案目錄
    lintOnSave: true, // eslint-loader 是否在儲存的時候檢查
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // webpack配置
    chainWebpack: (config) => {
        // 以下相當於webpack的module配置
        config.module

    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 為生產環境修改配置...
            config.mode = 'production'
        } else {
            // 為開發環境修改配置...
            config.mode = 'development'
        }
    },
    productionSourceMap: false, // 生產環境是否生成 sourceMap 檔案
    // css相關配置
    css: {
        extract: true, // 是否使用css分離外掛 ExtractTextPlugin
        sourceMap: false, // 開啟 CSS source maps?
        requireModuleExtension: true,
        loaderOptions: {}, // css預設器配置項 詳見https://cli.vuejs.org/zh/config/#css-loaderoptions
    },
    devServer: {
        open: process.platform === 'darwin',
        host: '', // 允許外部ip訪問
        port: 8080, // 埠
        https: false, // 啟用https
        overlay: {
            warnings: true,
            errors: true
        }, // 錯誤、警告在頁面彈出
        proxy: 'http://localhost:8080'
    },
    // 第三方外掛配置
    pluginOptions: {}
}