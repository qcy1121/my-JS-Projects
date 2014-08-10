var __extends = this.__extends || function(d, b) {
    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["exports","jquery"],function(exports,$){
    var dataApi;
    dataApi = (function () {
        function dataApi () {
        };
        dataApi.wordsArray =
            ['土', '王', '免', '兔', '代', '伐', '休', '体', '盲', '育', '育', '育', '鸟', '乌', '鸣', '呜', '师', '帅', '家', '侯', '候',
                '壶', '壶', '斤', '斥', '飞', '戈', '享', '亨', '又', '叉', '巾', '币', '勺', '匀', '爪', '瓜', '几', '凡', '厂', '广',
                '今', '令', '勿', '匆', '予', '矛', '九', '丸', '良', '良', '折', '拆', '析', '拆', '析', '诉', '住', '往', '茶', '荼', '快', '快',
                '吴', '吴', '狠', '狼', '扰', '拢', '洗', '洗', '冶', '治', '理', '埋', '云', '去', '库', '库', '西', '百', '洒', '酒', '早', '旱',
                '侍', '待', '仿', '彷', '倘', '尚', '欠', '久', '牛', '生', '干', '午', '味', '昧', '昕', '昕', '唔', '晤', '喧', '瞌', '哺', '晴',
                '响', '晌', '呢', '昵', '暖', '暖', '历', '厉', '氏', '民', '也', '也', '血', '皿', '思', '恩', '旦', '亘', '夫', '失', '晴', '睛',
                '徒', '徙', '暑', '署', '毫', '毫', '账', '帐', '气', '乞', '史', '吏', '戎', '戒', '了', '子', '沪', '泸', '幼', '幻', '伯', '伯',
                '刀', '刃', '王', '主', '玉', '大', '太', '犬', '木', '本', '术', '戊', '戍', '戌', '兵', '乒', '乓', '哀', '衷', '衰', '尤', '尤', '龙',
                '往', '住', '佳', '凭', '筑', '就', '杏', '杳', '查'];

        dataApi.load = {
            wordsArray: function () {
                var arr= dataApi.wordsArray;
                return arr.slice(0,arr.length);
            },
            imagesArray:function(){
                var arr = dataApi.imagesArray;
                return arr?arr.slice(0,arr.length):dataApi.loadImages();
            }
        }
        dataApi.loadImages=function(){

        }
        return dataApi;
    })();
    exports.webApi = dataApi;
});
