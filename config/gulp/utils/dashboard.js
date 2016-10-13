var envConfig = require('../utils/env'),
    util = require('gulp-util'),
    _ = require('lodash');

var color;
var colorMap = {
    'development': 'bgGreen',
    'production': 'bgCyan'
};
color = colorMap[envConfig.ENV] || 'bgMagenta';

var StarterDashboard = {
    show: function() {
        console.log('============= Angular 2 Minesweeper =============');
        console.log('Current environment: ' + util.colors[color](envConfig.ENV));
        console.log('=================================================');
    }
};

module.exports = StarterDashboard;
