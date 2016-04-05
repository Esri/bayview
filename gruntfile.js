/* global module */
module.exports = function(grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Code Quality Tasks
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      files: {
        // Run JSHint on all JS files in the /app folder (ignore /libs for now)
        src: ['app/**/*.js']
      }
    },

    jscs: {
      options: {
        config: '.jscsrc',
        esnext: false,
        verbose: true
      },
      files: {
        // Run JSHint on all JS files in the /app folder (ignore /libs for now)
        src: ['app/**/*.js']
      }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Dependency Management Tasks
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    shell: {
      bowerInstall: {
        command: 'bower install'
      }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Sass/CSS Tasks
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    sass: {
      dev: {
        options: {
          // Generate a sourcemap to assist with debugging
          sourceMap: true,
          outputStyle: 'expanded',
          sourceComments: true
        },
        files: {
          'app/css/main.css': 'app/sass/main.scss'
        }
      },
      prod: {
        options: {
          // Generate a sourcemap to assist with debugging
          sourceMap: true,
          outputStyle: 'compressed'
        },
        files: {
          'app/css/main.css': 'app/sass/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')
        ]
      },
      dev: {
        src: 'app/css/main.css'
      },
      prod: {
        options: {
          processors: [
            require('cssnano')({
              sourcemap: true
            })
          ]
        },
        src: 'app/css/main.css'
      }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Serve Tasks
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 9001,
          livereload: 35729,
          open: {
            target: 'http://127.0.0.1:9001'
          }
        }
      }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Watch Tasks
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    watch: {
      sass: {
        // When any .scss files in app/sass/ are modified...
        files: ['**/*.scss'],
        // Run the sass task
        tasks: ['sass:dev', 'postcss:dev']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: ['index.html', 'app/**/*.{js,css}']
      }
    }
    // End of Task Config
  });

  // Task Registration

  // Default task
  grunt.registerTask('default', ['shell:bowerInstall', 'jshint']);

  // Custom tasks
  grunt.registerTask('init', 'Run this task to perform any setup necessary.', ['shell:bowerInstall', 'sass:dev', 'postcss:dev']);
  grunt.registerTask('serve', 'Spin up a server and open the app in a browser.', ['sass:dev', 'connect', 'watch']);
  grunt.registerTask('test', 'Run tests, right now this is just running jshint.', ['jshint', 'jscs']);
  grunt.registerTask('build', 'Execute build steps.', ['init', 'jshint', 'sass:prod', 'postcss:prod']);
};
