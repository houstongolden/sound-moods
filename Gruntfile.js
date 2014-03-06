module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

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
    shell: {
      startServer: {
        command: 'nodemon app.js',
        options: {
          async: true
        }
      }
    }
  });

  grunt.registerTask('default', ['shell', 'compass:dev', 'watch']);

  // grunt.registerTask('build', ['compass:build', 'uglify']);

};
