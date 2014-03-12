module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        browsers: ['PhantomJS']
      }
    },

    jasmine: {
      soundcollage: {
        src: 'public/js/**/*.js',
        options: {
          specs: 'tests/specs/*Spec.js',
          outfile: 'tests/SpecRunner.html',
          display: 'full',
          summary: true
        }
      }
    },

    compass: {
      dev: {
        options: {
          basePath: 'public',
          config: 'public/config.rb'
        }
      },
      build: {
        options: {
          basePath: 'public',
          sassDir: 'scss',
          cssDir: 'css',
          imagesDir: 'img',
          javascriptsDir: 'js',
          outputStyle: 'compressed'
        }
      }
    },
    uglify: {
      dist: {
        src: 'js/*.js',
        dest: 'dist/soundcollage.min.js'
      }
    },

    watch: {
      sass: {
        files: 'public/scss/*.scss',
        tasks: ['compass:dev']
      }
    },
    express: {
      dev: {
        options: {
          script: 'app.js',
          background: true
        }
      }
    }

  });

  grunt.registerTask('default', ['express', 'compass:dev', 'watch']);

  grunt.registerTask('test', ['karma']);
  // grunt.registerTask('build', ['compass:build', 'uglify']);

};
