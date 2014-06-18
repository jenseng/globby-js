/* global require, module */
var matchdep = require('matchdep');

module.exports = function(grunt){
  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    clean: {
      tmp: [ 'tmp/**/*' ]
    },

    transpile: {
      testLib: {
        expand: true,
        type: 'cjs',
        cwd: 'lib',
        src: [ '**/*.js' ],
        dest: 'tmp/lib',
        compatFix: true
      },
      tests: {
        expand: true,
        type: 'cjs',
        cwd: 'test',
        src: [ '**/*.js', '!fixtures/**/*.js' ],
        dest: 'tmp/test',
        compatFix: true
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*_test.js'],
      options: {
        esnext: true,
        camelcase: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        undef: true,
        latedef: true,
        newcap: true,
        nonew: true,
        unused: true,
        trailing: true
      }
    },

    copy: {
      main: {
        cwd: 'tmp/lib/',
        src: '**',
        dest: 'dist/lib/',
        expand: true
      }
    }
  });

  grunt.registerTask('test', [ 'clean', 'transpile:testLib', 'transpile:tests' ]);
  grunt.registerTask('default', [ 'transpile:testLib', 'transpile:tests' ]);
  grunt.registerTask('dist', ['test', 'copy']);
};
