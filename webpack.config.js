const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('./web/static')
    .setPublicPath('/static')
    .cleanupOutputBeforeBuild()
    .autoProvidejQuery()
    .autoProvideVariables({
        "global.jQuery": "jquery",
        "global.$": "jquery",
        "window.Bloodhound": require.resolve('bloodhound-js'),
        "jQuery.tagsinput": "bootstrap-tagsinput"
    })
    .enableSassLoader()
    .createSharedEntry('js/common', ['jquery', 'bootstrap'])
    .addEntry('js/platform', './src/js/platform.js')
    .addEntry('js/login', './src/js/login.js')
    .addEntry('js/panel', './src/js/panel.js')
    .addStyleEntry('css/platform', ['./src/scss/platform.scss'])
    .addStyleEntry('css/panel', ['./src/scss/panel.scss'])
    .addStyleEntry('css/error', ['./src/scss/error.scss'])
    .addStyleEntry('css/login', ['./src/scss/login.scss'])
    .addStyleEntry('css/maintenance', ['./src/scss/maintenance.scss'])
;

module.exports = Encore.getWebpackConfig();