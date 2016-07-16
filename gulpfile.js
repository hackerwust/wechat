var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rsync = require('gulp-rsync');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var yuicompressor = require('gulp-yuicompressor');
var cleancss = require("gulp-clean-css");
var async = require('async');
var fs = require('fs');
var path = require("path");
var pump = require("pump");
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');

function getFormatDate() {
  var date = new Date();
  dateHM = (date.getHours() < 10 ? '0' : '') + date.getHours() + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  date = ''+date.getFullYear()+((date.getMonth() < 9 ? '0' : '')+(date.getMonth()+1))+(date.getDate() < 10 ? '0' : '')+date.getDate();
  return date;
}

// function getRelativePath(input, group1Str) {
//   // var type = {styl: "css"}
//   var filepath = group1Str.split("&")[1];
//   console.log(filepath);
//   filepath = filepath.substr(5).replace(/\.styl/i, "");
//   filepath = 
//   var pathArr = filepath.split("|");
  
// }

gulp.task("build_home", function() {
  gulp.src("www/static/modules/home/src/*.coffee")
    .pipe(coffee())
    .pipe(gulp.dest("www/static/modules/home/js"));
  gulp.src("www/static/modules/home/src/*.styl")
    .pipe(stylus())
    .pipe(gulp.dest("www/static/modules/home/css"));
});


gulp.task("build_chat", function() {
  gulp.src("www/static/modules/chat/src/*.coffee")
    .pipe(coffee())
    .pipe(gulp.dest("www/static/modules/chat/js"));
  gulp.src("www/static/modules/chat/src/*.styl")
    .pipe(stylus())
    .pipe(gulp.dest("www/static/modules/chat/css"));
});


gulp.task("minify_home", function() {
  gulp.src("www/static/modules/home/js/*.js")
    .pipe(replace(/\/static\/(.*\.(png|jpg|gif|jpeg))/gi, "http://dev.chat.com:5556/static/$1?t=" + getFormatDate()))
    .pipe(uglify())
    .pipe(gulp.dest("www/static/modules/home/minify"));
  gulp.src("www/static/modules/home/css/*.css")
    .pipe(replace(/\/static\/(.*\.(png|jpg|gif|jpeg))/gi, "http://dev.chat.com:5556/static/$1?t=" + getFormatDate()))
    .pipe(cleancss())
    .pipe(gulp.dest("www/static/modules/home/minify"))
});

gulp.task("minify_chat", function() {
  gulp.src("www/static/modules/chat/js/*.js")
    .pipe(replace(/\/static\/(.*\.(png|jpg|gif|jpeg))/gi, "http://dev.chat.com:5556/static/$1?t=" + getFormatDate()))
    .pipe(uglify())
    .pipe(gulp.dest("www/static/modules/chat/minify"));
  gulp.src("www/static/modules/chat/css/*.css")
    .pipe(replace(/\/static\/(.*\.(png|jpg|gif|jpeg))/gi, "http://dev.chat.com:5556/static/$1?t=" + getFormatDate()))
    .pipe(cleancss())
    .pipe(gulp.dest("www/static/modules/chat/minify"))
});

//link(rel="stylesheet", href="/chat/compiler/index?type=stylus&path=modules|home|src|index.styl", type="text/css")

gulp.task("replace_home", function() {        
  gulp.src("view/home/index_index.jade")
    .pipe(replace(/link\(rel="stylesheet", href="\/chat\/compiler\/index\?type=stylus\&path=modules\|home\|src\|index\.styl", type="text\/css"\)/gi, "style.\n        " + fs.readFileSync("www/static/modules/home/minify/index.css", "utf8")))
    .pipe(gulp.dest("view/home"))
});

gulp.task("replace_chat", function() {
  gulp.src("view/chat/index_index.jade")
    .pipe(replace(/link\(rel="stylesheet", href="\/chat\/compiler\/index\?type=stylus&path=modules\|chat\|src\|index\.styl", type="text\/css"\)/gi, "style.\n        " + fs.readFileSync("www/static/modules/chat/minify/index.css", "utf8")))
    .pipe(gulp.dest("view/chat"))
});

gulp.task("deploy_home", function() {
  var tasks = ["minify_home", "replace_home"];
  tasks = tasks.map(function(task) {
    return function(cb) {
      gulp.run(task, function() {
        setTimeout(function() {
          cb(null);
        }, 5000);
      });
    }
  });
  async.series(tasks);
});

gulp.task("deploy_chat", function() {
  var tasks = ["minify_chat", "replace_chat"];
  tasks = tasks.map(function(task) {
    return function(cb) {
      gulp.run(task, function() {
        setTimeout(function() {
          cb(null);
        }, 5000);
      });
    }
  });
  async.series(tasks);
});

gulp.task("watch", function() {
  var watcher = gulp.watch("www/static/modules/**/*.@(coffee|styl)", ["build_home", "build_chat"]);
  watcher.on("change", function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running build tasks...');
  });
});

// console.log(fs.readFileSync("www/static/modules/chat/minify/index.css").toString())

