module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

     
    //当运行一个任务时，Grunt会自动查找配置对象中的同名属性。多个任务可以有多个配置，每个任务可以使用任意的命名'targets'来定义多个任务目标。
    //在下面的例子中，concat任务有名为foo和bar两个目标，而mytest任务仅仅只有一个名为foo目标。
        // 指定一个像grunt concat:foo的任务和目标只会处理指定的任务目标配置，而运行grunt concat将遍历所有的(定义在concat任务中的)目标并依次处理。
        //注意，如果一个任务使用grunt.renameTask重命名过，Grunt将在配置对象中查找新的任务名称属性。

        mytest: {
            //这里是concat任务的配置信息
            foo:{
                // 这里是concat任务'foo'目标的选择和文件
            },
            bar: {
                // 这里是concat任务'bar'目标的选择和文件
                options: {
                    // 这里是'bar'目标的options，它会覆盖任务级的options.
                },
           //文件简洁格式
                //这种形式允许每个目标对应一个src-dest文件映射。通常情况下它用于只读任务，比如grunt-contrib-jshint,
                //它就值需要一个单一的src属性，而不需要关联的dest选项. 这种格式还支持为每个src-dest文件映射指定附加属性。
                //src: ['src/bb.js', 'src/bbb.js'], // move to 自定义过滤函数
                dest: 'dest/b.js',
                /*,
          //文件对象格式
                //这种形式支持每个任务目标对应多个src-dest形式的文件映射，属性名就是目标文件，
                //源文件就是它的值(源文件列表则使用数组格式声明)。可以使用这种方式指定数个src-dest文件映射， 但是不能够给每个映射指定附加的属性。
                files: {
                    'dest/b.js': ['src/bb.js', 'src/bbb.js'],
                    'dest/b1.js': ['src/bb1.js', 'src/bbb1.js']
                }
                */
                /*
         //文件数组格式
                //这种形式支持每个任务目标对应多个src-dest文件映射，同时也允许每个映射拥有附加属性：
                ,files: [
                {src: ['src/aa.js', 'src/aaa.js'], dest: 'dest/a.js'},
                {src: ['src/aa1.js', 'src/aaa1.js'], dest: 'dest/a1.js'}
                ]
                */
         //自定义过滤函数
                //filter属性可以给你的目标文件提供一个更高级的详细帮助信息。只需要使用一个有效的fs.Stats方法名。下面的配置仅仅是一个与模式匹配的真实的文件：
                src: ['temp/**/*'],
                filter: 'isFile'
                /*
                //或者创建你自己的filter函数根据文件是否匹配来返回true或者false。下面的例子将仅仅是一个空目录
                ,filter: function(filepath){
                    return (grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
                }
                */
            }
        },
        myNewTest:{
            foo:{

            }
        },

    //在一个任务配置中，options属性可以用来指定覆盖属性的内置默认值。此外，每一个任务目标中更具体的目标都可以拥有一个options属性。
    //目标级的选项将会覆盖任务级的选项(就近原则————options离目标越近,其优先级越高)。
    // options对象是可选，如果不需要，可以省略。

      //与下面冲突，被覆盖掉。
        //这里是uglify任务的配置信息
        uglify: {
            options: {// 这里是任务级的Options，覆盖任务的默认值 
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%=pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
                /*,
                options: {
                    // 这里是'build'目标的options，它会覆盖任务级的options.
                }
                */
                // 没有指定options，这个目标将使用任务级的options
            }
        },
            
        //任意非任务特定属性
        my_property: 'whatever',
        my_src_file: ['foo/*.js', 'bar/*.js'],

        //------------------------------------------
        concat: {
            options: {
                //定义一个用于插入合并输出文件之间的字符
                separator: ';'
            },
            dist: {
                //用于连接的文件
                src: ['src/**/*.js'],
                //返回的JS文件位置
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                //生成一个banner注释并插入到输出文件的顶部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']//glify会压缩concat任务中生成的文件。
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            //定义用于检测的文件
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            //配置JSHint (参考文档:http://www.jshint.com/docs)
            options: {
                //你可以在这里重写jshint的默认配置选项
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        //令行使用grunt watch来运行这个任务。
        //当它检测到任何你所指定的文件(在这里我使用了JSHint任务中需要检测的相同的文件)发生变化时，它就会按照你所指定的顺序执行指定的任务(在这里我指定了jshint和qunit任务)。
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });
    /*
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 默认任务
    grunt.registerTask('default', ['uglify']);
    */
    //我们还要加载所需要的Grunt插件。 它们应该已经全部通过npm安装好了
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //最后我们还要建立一些任务，最重要的是default任务：
    //终在这里指定的任务都可以通过在命令行中以grunt.taskName(最后建立/注册的任务名)的方式来运行指定的任务即可，
    //默认的情况我们最好定义一个默认执行的任务(也就是在命令行直接运行grunt就会执行的任务)。
    //grunt.registerTask(taskName, [description, ] taskFunction)

    //在命令行可以通过`grunt test`来运行执行jshint和qunit任务
    grunt.registerTask('test', ['jshint']);//, 'qunit']);
    //在命令行可以通过'grunt'来运行默认指定的4个任务
    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
    
}