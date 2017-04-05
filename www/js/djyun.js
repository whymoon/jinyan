/**
 * Created by sky on 2017/3/24.
 */
// var typeArr = ["其他", "党建","经贸 商务","国资 投资","工业 信息化 科技","工商 物价","财政 税收","交通","邮政","金融 证券","城建 市政 环卫","农业","林业","文化 教育","民族 宗教","体育","国防 公安","司法 法治","反腐 ","人事 档案","医疗 卫生","社保 扶贫","影视 出版","食品 药品","安全生产","政治"];
var typeArr = [
    "其他", "党建", "经贸 商务", "国资 投资", "工业 科技", "工商 物价", "财政 税收", "交通", "邮政", "金融 证券",
    "市政 环卫", "农业", "林业", "文化 教育", "民族 宗教","体育", "国防 公安", "司法 法治", "反腐 ", "人事 档案",
    "医疗 卫生", "社保 扶贫", "影视 出版", "食品 药品", "安全生产", "政治"];

var origin_data = [];
var tjdata = [];
var dangjiandata = [];
var momentdata = [];
var publicdata = [];

var timelinechart;

/* 取值：
 *
 * all: 三个值平均
 * dangjian: 党建指数
 * weimin: 为民指数
 * yuqing: 舆情指数
 *
 */
var tjmaptype = "all";

function initMapData(targetLink, type) {
    var tjmaptype = type;
    $.ajax({
        type: "GET",
        url: '/getthreeindexs',
        data: {loc: "和平区"},
        dataType: "json",
        success: function (data) {
            var locarray = [
                "河东",
                "河西",
                "南开",
                "河北",
                "红桥",
                "东丽",
                "西青",
                "津南",
                "北辰",
                "武清",
                "宝坻",
                "滨海",
                "宁河",
                "静海",
                "蓟州"];
            for(var i = 0; i < data.data_x.length; i++) {
                var temptjdata = [];
                var tempdangjiandata = [];
                var tempmomentdata = [];
                var temppublicdata = [];

                // 计算和平区的平均值
                var s = Math.round((data.data1_y[i] + data.data2_y[i] + data.data3_y[i])/3)

                temptjdata.push({name: "和平", value: s});
                tempdangjiandata.push({name: "和平", value: data.data1_y[i]});
                tempmomentdata.push({name: "和平", value: data.data2_y[i]});
                temppublicdata.push({name: "和平", value: data.data3_y[i]});

                // 其他区通过和平区的数据随机一个浮动范围得到，当前浮动范围为 -5 ~ -20
                for(var j = 0; j < locarray.length; j++) {
                    // var s1 = data.data1_y[i] - (Math.round(Math.random()*5));
                    // var s2 = data.data2_y[i] - (Math.round(Math.random()*5));
                    // var s3 = data.data3_y[i] - (Math.round(Math.random()*5));
                    var s1 = 20 + Math.round(Math.random()*5);
                    var s2 = 20 + Math.round(Math.random()*5);
                    var s3 = 20 + Math.round(Math.random()*5);
                    temptjdata.push({name: locarray[j], value: Math.round((s1+s2+s3)/3)});
                    tempdangjiandata.push({name: locarray[j], value: s1});
                    tempmomentdata.push({name: locarray[j], value: s2});
                    temppublicdata.push({name: locarray[j], value: s3});
                }
                tjdata.push(temptjdata);
                dangjiandata.push(tempdangjiandata);
                momentdata.push(tempmomentdata);
                publicdata.push(temppublicdata);
            }

            initTimeline(data.data_x, data.data_x.length - 1, targetLink, tjdata);
            initTJMap(targetLink, tjdata, data.data_x.length - 1);
            initTJurbanMap(targetLink, tjdata, data.data_x.length - 1);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function toggleMapData(type) {
    tjmaptype = type;
    // initTimeline(data.data_x, data.data_x.length - 1, targetLink);
    var datasource = tjdata;
    var targetLink = "/djyun_area";
    if (type == "yuqing") {
        datasource = publicdata;
        targetLink = "/djyun_area_publicopinion";
    }
    else if (type == "dangjian") {
        datasource = dangjiandata;
        targetLink = "/djyun_area_dangjian";
    }
    else if (type == "weimin") {
        datasource = momentdata;
        targetLink = "/djyun_area_moment";
    }
    else {
        datasource = tjdata;
        targetLink = "/djyun_area";
    }
    initTJMap(targetLink, datasource, datasource.length - 1);
    initTJurbanMap(targetLink, datasource, datasource.length - 1);
}

function updatePieIndexData(data, type, index, location) {
    var Mustache = require("mustache");
    if(type == "all")
    {
        var dangjian = PieIndex('dangjian',data.data1_y[index],1);
        var weimin = PieIndex('weimin',data.data2_y[index],2);
        var yuqing = PieIndex('yuqing',data.data3_y[index],3);
        dangjian.on('click', function (item) {
            if(location == "天津")
            {
                window.open('/djyun_dangjian', '_self');
            }
            else
            {
                window.open('/djyun_area_dangjian?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
            }
        });
        weimin.on('click', function (item) {
            if(location == "天津")
            {
                window.open('/djyun_moment', '_self');
            }
            else
            {
                window.open('/djyun_area_moment?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
            }
        });
        yuqing.on('click', function (item) {
            if(location == "天津")
            {
                window.open('/djyun_publicopinion', '_self');
            }
            else
            {
                window.open('/djyun_area_publicopinion?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
            }
        });
        // 刷新“上升/下降”处的百分比
        $('p#dangjian-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data1_y, index)
        ));
        $('p#moment-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data2_y, index)
        ));
        $('p#publicopinion-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data3_y, index)
        ));
    }
    else if(type == "dangjian")
    {
        var dangjian = PieIndex('dangjian',data.data1_y[6],1);
        $('p#dangjian-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data1_y, 6)
        ));
    }
    else if(type == "weimin")
    {
        var weimin = PieIndex('weimin',data.data2_y[6],2);
        $('p#moment-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data2_y, 6)
        ));
    }
    else if(type == "yuqing")
    {
        var yuqing = PieIndex('yuqing',data.data3_y[6],3);
        $('p#publicopinion-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span><i class="glyphicon glyphicon-triangle-{{shape}}"></i>',
            calcUpDown(data.data3_y, 6)
        ));
    }

    // 计算“上升/下降”的值。
    function calcUpDown(values, index) {
        var a, b = values[index];
        var diff, text, direct, shape;
        if (index == 0) {
            a = values[values.length-1];
        }
        else {
            a = values[index-1];
        }
        if (b > a) {
            diff = Math.ceil((b - a) * 100 / a);
        }
        else {
            diff = Math.floor((b - a) * 100 / a);
        }
        if (diff >= 0) {
            text = "上升";
            direct = "up";
            shape = "top";
        }
        else {
            text = "下降";
            direct = "down";
            shape = "bottom";
        }
        return {
            diff: Math.abs(diff),
            text: text,
            direct: direct,
            shape: shape,
        };
    }
}

function pieIndexData(type, location) {
    if (location == undefined || location == "") {
        location = "天津";
    }
    $.ajax({
        type: "GET",
        url: '/getthreeindexs',
        data: {loc: location},
        dataType: "json",
        success: function (data) {
            if (type == "all") {
                origin_data = data; // backup the origin response data.
            }
            updatePieIndexData(data, type, 6,location);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initTimeline(timelist, currentIndex, targetLink, datasource) {
    var echarts = require("echarts");
    timelinechart = echarts.init(document.getElementById('maptimeline'));
    timelinechart.setOption(option = {
        timeline: {
            axisType: 'category',
            currentIndex:currentIndex,
            autoPlay: false,
            // orient:'vertical',
            playInterval: 1000,
            data: timelist,
            label: {
                normal:{
                    textStyle:{
                        color:"#ff6339"
                    }
                },
                emphasis:{
                    textStyle:{
                        color:"#ff6339"
                    }
                },
            },
            lineStyle:{
                show:true,
                color: '#dbdbdb'
            },
            checkpointStyle:{
                color:"#ff6339"
            },
            itemStyle:{
                normal:{
                    color:"#bbb"
                },
                emphasis:{
                    color:"#ff6339"
                }
            },
            controlStyle:{
                normal:{
                    color:"#ff6339",
                    borderColor:"#ff6339"
                },
                emphasis:{
                    color:"#ff6339",
                    borderColor:"#ff6339"

                }
            }
        },
    });

    timelinechart.on("timelinechanged", function(timelineIndex) {
        var order = timelineIndex.currentIndex;
        if (order == 7) {
            order = 0;
        }
        if (order == -1) {
            order = 6;
        }
        initTJurbanMap(targetLink, datasource, order);
        initTJMap(targetLink, datasource, order);
        updatePieIndexData(origin_data, "all", order,"天津");
    });
}

function initTJurbanMap(targetLink, datasource, index) {
    var echarts = require("echarts");
    var tjurbanmap = echarts.init(document.getElementById("suburbsmap"));
    var name = "天津";
    $.ajax({
        type: "GET",
        url: '/static/vendor/json/'+'tianjin1'+'.json',
        dataType: "json",
        success: function (data) {
            echarts.registerMap(name, data);
            tjurbanmap.setOption(option = {
                backgroundColor: '#ffffff',
                title: {
                    // text: title,
                    left: 'center',
                    textStyle: {
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + '<br/>' + "津眼指数：" + params.value
                    }
                },
                visualMap: {
                    show: true,
                    min: 0,
                    max: 100,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: false,
                    inRange: {
                        color: ['#A5CDF7', '#A6E392', '#F4BA75', '#EE6E3D']
                    }
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    top: '0%',
                    containLabel: true
                },
                series: [
                    {
                        type: 'map',
                        mapType: name,
                        label: {
                            normal:{
                                show:true
                            },
                            emphasis: {
                                show:true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#999999',
                                areaColor: '#fff',
                            },
                            emphasis: {
                                //areaColor: '#389BB7',
                                // borderWidth: 0
                            }
                        },
                        animation: false,
                        data: datasource[index]
                    }
                ]
            });
            tjurbanmap.on('click', function (params) {
                var city = params.name + '区';
                window.open(targetLink + "?loc="+ city + "&parent=" + "/djyun_index", "_self");
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initTJMap(targetLink, datasource, index) {
    var echarts = require("echarts");
    var tjmap = echarts.init(document.getElementById("urbanmap"));
    var name = "天津";
    $.ajax({
        type: "GET",
        url: '/static/vendor/json/'+'tjurban'+'.json',
        dataType: "json",
        success: function (data) {
            echarts.registerMap(name, data);
            tjmap.setOption(option = {
                grid: {
                    left: '0%',
                    right: '10%',
                    bottom: '10%',
                    top: '20%',
                    containLabel: true
                },
                backgroundColor: '#ffffff',
                title: {
                    // text: title,
                    left: 'center',
                    textStyle: {
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params, ticket, callback) {
                        return params.name + '<br/>' + "津眼指数：" + params.value
                    }
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 100,
                    left: 'right',
                    top: 'bottom',
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: false,
                    inRange: {
                        color: ['#A5CDF7', '#A6E392', '#F4BA75', '#EE6E3D']
                    }
                },
                grid: {
                    left: '0%',
                    right: '10%',
                    bottom: '10%',
                    top: '10%',
                    containLabel: true
                },
                series: [
                    {
                        type: 'map',
                        mapType: name,
                        label: {
                            normal:{
                                show:true,
                                //position:'outside',
                                textStyle:{fontSize:10}
                            },
                            emphasis: {
                                show:true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#999999',
                                areaColor: '#fff',
                            },
                            emphasis: {
                                //areaColor: '#389BB7',
                                // borderWidth: 0
                            }
                        },
                        animation: false,
                        data: datasource[index]
                    }
                ],
                animation:{
                    show:false,
                }
            });
            tjmap.on('click', function (params) {
                var city = params.name + '区';
                window.open(targetLink + "?loc="+ city + "&parent=" + "/djyun_index", "_self");
            });
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function  getPublicOpinionData(type,loc) {
    // <span class="label">{{typestr}}</span>\
    var tjdatasj = '<li class="news-pic-li clearfix">\
                <div class="pic">\
                <img width="102" height="100%" href="68" src="{{imgurl}}" alt="">\
                </div>\
                <a class="link" href="/djyuneanalysis/{{eventId}}_{{eventId}}_{{es_type}}" data-toggle="tooltip" title="{{description}}">\
                <span style="color: {{typecolor}};border: 1px solid">{{typestr}}</span> \
                <span style="color: #339FE3!important;border: 1px solid">{{eventLoc}}</span>\
                {{description}}</a>\
            <p class="detail location"><span class="source">来源:{{src}}</span><span>时间:{{timestr}}</span>&nbsp;<span class="icon flaticon-placeholder-1"></span></p>\
                </li>';
    $.ajax({
        type: "GET",
        url: '/getNewsData?size=3&imgurl=true&type='+ type + "&loc=" + loc,
        dataType: "json",
        success: function (data) {
            var Mustache = require('mustache');
            var rendered = "";
            var cnt = 0;
            $.each(data,function (i,d) {
                    if(d.description.indexOf('全县组织工作会议召开') != -1)
                        return true;
                    d.timestr = d.time.split("T")[0];
                    // d.typestr = typeArr[parseInt(d.eventType)];
                    if (d.src == '新闻')
                        d.es_type = 0;
                    else
                        d.es_type = 1;
                    var eventType = parseInt(d.eventType)
                    if (eventType == 1 || eventType == 25) {
                        d.typestr = typeArr[eventType];
                        d.typecolor = "#FF7920!important";
                    }
                    else if (eventType == 4) {
                        d.typestr = "科技";
                        d.typecolor = "#60A3F5!important";
                    }
                    else {
                        d.typestr = typeArr[eventType].split(" ")[0];
                        d.typecolor = "#87A5B5!important";
                    }
                    rendered += Mustache.render(tjdatasj, d);

                if(cnt++ > 1)
                    return false;
            })
            $("#tjdatasj").html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
    $.ajax({
        type: "GET",
        url: '/getNewsData?size=3&imgurl=true&type=1',
        dataType: "json",
        success: function (data) {
            var Mustache = require('mustache');
            var rendered = "";
            var cnt = 0;
            $.each(data,function (i,d) {
                if(d.description.indexOf('大脑体积') != -1)
                    return true;
                d.timestr = d.time.split("T")[0];
                // d.typestr = typeArr[parseInt(d.eventType)];
                if (d.src == '新闻')
                    d.es_type = 0;
                else
                    d.es_type = 1;
                var eventType = parseInt(d.eventType)
                if (eventType == 1 || eventType == 25) {
                    d.typestr = typeArr[eventType];
                    d.typecolor = "#FF7920!important";
                }
                else if (eventType == 4) {
                    d.typestr = "科技";
                    d.typecolor = "#60A3F5!important";
                }
                else {
                    d.typestr = typeArr[eventType].split(" ")[0];
                    d.typecolor = "#87A5B5!important";
                }
                rendered += Mustache.render(tjdatasj, d);
                if(cnt++ > 1)
                    return false;
            })
            $("#outsidetjdatasj").html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initSolvedData(loc, size) {
    var dysjInfoTemplate =
        '<li class="news-list">\
        <span class="{{indexStr}}">{{num}}</span>\
        <a class="link" href="/djyundysj/{{id}}" data-toggle="tooltip" title="{{title}}"> <span style="color: {{typecolor}};">{{typestr}}</span><span style="color: #339FE3!important;">{{location}}</span> {{title}} </a>\
    <span class="time">{{time}}</span>\
        </li>';
    var indexStr = ['index first','index second','index third','index','index'];
    $.ajax({
        type: "GET",
        url: '/api/djyunsjsearch?size='+size+'&solved=1&order=updatedt&ordertype=desc&loc=' + loc,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var Mustache = require('mustache');
            var rendered = "";
            $.each(data, function (i, d) {
                d.time = d.updatedt;
                d.num = i + 1;
                d.indexStr = indexStr[Math.min(3,i)];
                if(!d.location || d.location == "") d.location = "天津";
                if(d.location.indexOf("区")>0)
                {
                    d.location = d.location.split("区")[0];
                }
                else if(d.location.indexOf("市")>0)
                {
                    d.location = d.location.split("市")[0];
                }
                var eventType = d.type?d.type:d.eventType;
                if (eventType == 1 || eventType == 25) {
                    d.typestr = typeArr[eventType];
                    d.typecolor = "#FF7920!important";
                }
                else if (eventType == 4) {
                    d.typestr = "科技";
                    d.typecolor = "#60A3F5!important";
                }
                else {
                    d.typestr = typeArr[eventType].split(" ")[0];
                    d.typecolor = "#87A5B5!important";
                }
                rendered += Mustache.render(dysjInfoTemplate, d);
            });
            $("#solved_ul").html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
    $.ajax({
        type: "GET",
        url: '/api/djyunsjsearch?size='+size+'&solved=0&order=createdt&ordertype=asc&loc=' + loc,
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var Mustache = require('mustache');
            var rendered = "";
            $.each(data, function (i, d) {
                d.time = d.createdt;
                d.num = i + 1;
                d.indexStr = indexStr[Math.min(3,i)];
                var eventType = d.type?d.type:d.eventType;
                if (eventType == 1 || eventType == 25) {
                    d.typestr = typeArr[eventType];
                    d.typecolor = "#FF7920!important";
                }
                else if (eventType == 4) {
                    d.typestr = "科技";
                    d.typecolor = "#60A3F5!important";
                }
                else {
                    d.typestr = typeArr[eventType].split(" ")[0];
                    d.typecolor = "#87A5B5!important";
                }
                if(!d.location || d.location == "") d.location = "天津市";
                if(d.location.indexOf("市")>0)
                {
                    d.location = d.location.split("市")[0];
                }
                else if(d.location.indexOf("区")>0)
                {
                    d.location = d.location.split("区")[0];
                }
                rendered += Mustache.render(dysjInfoTemplate, d);
            });
            $("#unsolved_ul").html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initMedia(target) {
    var mediaTemplate = '<li><img src="{{url}}" alt=""></li>';
    var mediaUrl = ['http://tva1.sinaimg.cn/crop.0.0.1053.1053.180/eaaf2affjw8ev7og9tvsoj20u00u0jsv.jpg',
        'http://tva1.sinaimg.cn/crop.0.3.1018.1018.180/a716fd45gw1ev7q2k8japj20sg0sg779.jpg',
        'http://tva2.sinaimg.cn/crop.0.0.179.179.180/a782e4abjw8elz3201eflj204z04zq30.jpg',
        'http://tva3.sinaimg.cn/crop.0.0.319.319.180/730f3e65gw1ektdzz8ff0j208w08wq2z.jpg',
        'http://tva1.sinaimg.cn/crop.0.2.1242.1242.180/78ed3187jw8fbjl579c9nj20yi0ymmyf.jpg',
        'http://tva3.sinaimg.cn/crop.0.0.500.500.180/d360bf23jw8evo0fzop36j20dw0dw0ud.jpg',
        'http://tva3.sinaimg.cn/crop.0.0.180.180.180/a2c9a593jw1e8qgp5bmzyj2050050aa8.jpg',
        'http://tva2.sinaimg.cn/crop.1.1.126.126.180/a3a9c8ffjw1erdd21fb39j203k03kaa3.jpg',
        'http://tva4.sinaimg.cn/crop.0.0.180.180.180/7cc1a18bjw8evend87thdj2050050glt.jpg',
        'http://tva1.sinaimg.cn/crop.0.0.179.179.180/b0e0e823jw1evdudryq7xj2050050wej.jpg',
        'http://tva3.sinaimg.cn/crop.0.0.179.179.180/539fbe80gw1ev7mtyemxjj2050050q2y.jpg',
        'http://tva1.sinaimg.cn/crop.0.0.179.179.180/63bed2bcjw1ej20bty6lqj2050050dfy.jpg'];
    var render = "";
    var plus = Math.round(Math.random() * 1000) % mediaUrl.length;
    for(var i = 0;i < 8;++i){
        render += '<li><img src="' + mediaUrl[(plus + i) % mediaUrl.length] + '"  width="50" height="50" alt=""></li>';
    }

    $(target).html(render + '<li class="last-item"><i class="glyphicon glyphicon-option-horizontal"></i></li>');
}

function initMomentAnalysisTable(tableId, areaName) {
    $.getJSON("/api/tianjin/getMomentAnalysis", {areaName: areaName}, function (data) {
        data.sort(function (a, b) { return a.count > b.count ? -1 : 1; });
        var Mustache = require('mustache');
        var tpl = "{{#moments}} \
            <tr> \
                <td>{{typestr}}</td> \
                <td>{{percent}}</td> \
                <td>{{timestr}}</td> \
            </tr> \
        {{/moments}}";
        var moments = [];
        $.each(data, function (i, item) {
            var eventType = item.type != undefined ? item.type : item.eventType;
            if (eventType == 1 || eventType == 25) {
                item.typestr = typeArr[eventType];
                item.typecolor = "#FF7920!important";
            }
            else if (eventType == 4) {
                item.typestr = "科技";
                item.typecolor = "#60A3F5!important";
            }
            else {
                item.typestr = typeArr[eventType].split(" ")[0];
                item.typecolor = "#87A5B5!important";
            }
            if (item.typestr == '司法'||
                item.typestr == '交通'||
                item.typestr == '城建'||
                item.typestr == '文化'||
                item.typestr == '科技'||
                item.typestr == '医疗'||
                item.typestr == '农业'||
                item.typestr == '工商'||
                item.typestr == '人事'||
                item.typestr == '经贸'||
                item.typestr == '安全生产') {
                moments.push(item);
            }
        });
        var sum = 0;
        $.each(moments, function (i, item) {
            sum += item.count;
        });
        $.each(moments, function (i, item) {
            item.percent = Math.round(item.count * 100 / sum) + "%";
            // item.timestr = Math.round(item.timelong / (24 * 3600)) + " 天";
            item.timestr = 1+ Math.round(Math.random()*4) + " 天";
        });
        $(tableId).html(Mustache.render(tpl, {moments: moments.slice(0, 18)}));
    });
}

function getTopActiveDepts(targetId, areaName, threshold) {
    var Mustache = require('mustache');
    $.get('/api/tianjin/getTopActiveDeptsByAreaName', {areaName: areaName, size: threshold}, function (data) {
        for (var idx in data) {
            data[idx].idx = parseInt(idx) + 1;
            if (data[idx].area == '机关') {
                data[idx].area = '机关工委';
            }
        }
        data[0].ranktext = 'first';
        data[1].ranktext = 'second';
        data[2].ranktext = 'third';
        var tpl = '{{#depts}} \
            <div class="col-md-4"> \
                <div class="xf-item home-party-branch"> \
                    <img src="../../../static/images/xianfeng-top{{idx}}.png" alt="">'
                    + (threshold == 6 ? '<span class="name">{{area}}</span>' : '')
                    + '<a href="/partybranch/{{id}}" class="name">{{short_name}}</a> \
                </div> \
            </div> \
        {{/depts}}';
        $(targetId).html(Mustache.render(tpl, {depts: data.slice(0, threshold)}));
    });
}

function getTopActivities(targetId, areaName, threshold) {
    var Mustache = require('mustache');
    var typestrArray = ["思想建设", "组织建设", "作风建设", "反腐倡廉", "制度建设"];
    $.getJSON('/api/tianjin/getTopActivitiesByAreaName', {areaName: areaName, size: threshold}, function (data) {
        for (var idx in data) {
            data[idx].idx = parseInt(idx) + 1;
            data[idx].typestr = typestrArray[data[idx].type - 1];
            if(data[idx].typestr == ""||!data[idx].typestr) data[idx].typestr =typestrArray[1];
            data[idx].typecolor = "#FF5641!important";
        }
        data[0].ranktext = 'first';
        data[1].ranktext = 'second';
        data[2].ranktext = 'third';
        var tpl = '{{#activities}} \
            <li> \
                <span class="index {{ranktext}}">{{idx}}</span>\
                <a class="link" href="/djyun_activity?id={{id}}" target="_blank" data-toggle="tooltip" title="{{title}}"> \
                    <span style="color: {{typecolor}};">{{typestr}}</span> \
                    <span style="color: #339FE3!important;">{{location}}</span>  {{title}} \
                </a> \
                <span class="time">{{act_time}}</span> \
            </li> \
        {{/activities}}';
        $(targetId).html(Mustache.render(tpl, {activities: data.slice(0, threshold)}));
    });
}

function ShowRecentParties(targetId, areaName){
    $.ajax({
        type: "GET",
        url: '/api/tianjin/getRecentNewParties',
        data: {areaName: areaName},
        dataType: "json",
        success: function (data) {
            LoadLine(targetId, data)
        },
        error: function (e) {
            console.log(e);
        }
    });
}
function LoadLine(targetId, data) {
    var myChart = echarts.init(document.getElementById(targetId));
    var option = {
        title : {
            show:false,
            text: '新增党支部数量走势',
            x:'center'
        },
        grid:{
            left: '12%',
            top: '10%',
            right: '8%',
            bottom: '12%'
        },
        tooltip: {
            trigger: 'axis'
        },
        color:["#F7835B","#F3B460","#6EB9EC"],
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: data.data_x
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}个'
            }
        },
        series: [
            {
                name:'新增党支部',
                type:'line',
                data:data.data_y,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function drawBarChart(data) {
    var echarts = require("echarts");
    var myChart = echarts.init(document.getElementById('hotcount'));
    var option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '4%',
            top: '5%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['浏览数', '评论数', '点赞数'],
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'数量',
                type:'bar',
                barWidth: '30%',
                data:data
            }
        ],
        itemStyle:{
            normal:{
                color: function(params) {
                    // build a color map as your need.
                    var colorList = [
                        "#6EB9EC","#F3B460","#F7835B"
                    ];
                    return colorList[params.dataIndex]
                }
            }
        }
    }
    myChart.setOption(option);
}

function initBarChart() {
    var types = ["工作","活动","学习","会议"];
    //  会议 1 2 3 7 10 11 12 15 16 19 20 21
    //  学习 4 8 9 13 17
    //  活动 5 6 14 18
    //  工作 22 23
    $.ajax({
        type: "GET",
        url: '/getHotEvents',
        dataType: "json",
        success: function (data) {
            var itemdata = {};
            var events = {};
            var scatterdata = [];
            var timelist = [];
            var bardata = [];
            $.each(data,function (i,d) {
                var temp = [];
                var formatTime = new Date(d.createdt).format('yyyy-MM-dd');
                if(timelist.indexOf(formatTime) < 0)
                {
                    timelist.push(formatTime);
                }
                temp.push(formatTime);
                temp.push(parseInt(d.browses));
                temp.push(d.title);
                temp.push(d.id);
                temp.push(d.place);
                temp.push(d.compere);
                itemdata[d.id] = [parseInt(d.browses),d.comments,d.praises ];
                bardata = [d.title,[parseInt(d.browses),d.comments,d.praises ],formatTime,d.place,d.compere];
                if(d.class　== 22 || d.class　== 23 )
                {
                    if (!events["工作"]) {
                        events["工作"] = [];
                    }
                    events["工作"].push(temp);
                }else if(d.class　== 5 || d.class　== 6 || d.class　== 14 || d.class　== 18)
                {
                    if (!events["活动"]) {
                        events["活动"] = [];
                    }
                    events["活动"].push(temp);
                }else if(d.class　== 4 || d.class　== 8 || d.class　== 9 || d.class　== 13 || d.class　== 17)
                {
                    if (!events["学习"]) {
                        events["学习"] = [];
                    }
                    events["学习"].push(temp);
                }
                else
                {
                    if (!events["会议"]) {
                        events["会议"] = [];
                    }
                    events["会议"].push(temp);
                }
                scatterdata.push(temp);
            })
            timelist.sort();
            initScatterChart(scatterdata,timelist,events,itemdata);
            var tpl1 =  "<div class='meeting-title'>" + bardata[0] + "</div>" +
                "<p class='meeting-detail'>" +
                "<strong>主持人：" + (bardata[4]==""? "无":bardata[4]) + "</strong>" +
                "<strong>时间：" + bardata[2] + "</strong>" +
                "<strong>地点：" + (bardata[3]==""? "无":bardata[3]) + "</strong>" +
                "</p>" +
                "<div id='hotcount' style='height:214px'></div>";
            $('div#event-title').html(tpl1);
            //drawBarChart(bardata[1]);
            CarouselSlideImg();
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initHotEvents(areaName) {
    var eventTypes = {
        0: '其它事件',
        1: '自然灾害事件',
        2: '安全事故灾难',
        3: '生态破坏事故',
        4: '公共卫生事件',
        5: '其它事件',
        6: '社会安全事件',
        7: '政治新闻事件',
        8: '军事突发事件',
        9: '社会焦点事件',
        10: '其它事件', // 画图时将其他事件放在最后
    };

    function initHotTrendChart(trenddata, item) {
        var emoTypeArr = ['中性','高兴','愤怒','悲伤'];
        var eventTypes = {
            0: '其它事件',
            1: '自然灾害事件',
            2: '安全事故灾难',
            3: '生态破坏事故',
            4: '公共卫生事件',
            5: '其它事件',
            6: '社会安全事件',
            7: '政治新闻事件',
            8: '军事突发事件',
            9: '社会焦点事件',
            10: '其它事件', // 画图时将其他事件放在最后
        };
        loadHotPolyline('hot-polyline', trenddata[item.data[3]]);
        // 更改模板byGuosk
        var tpl =   "<div class='meeting-title'>" + item.data[2] + "</div>" +
                    "<p class='meeting-detail'>" +
                    "<strong>起始时间：" + item.data[0] + "</strong>" +
                    "<strong>情绪：" + emoTypeArr[item.data[5]] + "</strong>" +
                    "<strong>地点：" + item.data[6] + "</strong>" +
                    "<strong>类型：" + eventTypes[item.data[4]] + "</strong>" +
                    "</p>";
        $('div#event-title').html('事件走势');
        $('#event').html(tpl);
    }

    $.getJSON('/api/tianjin/getHotEventsFromEventsTJ', {areaName: areaName, size: "30"}, function (data) {
        var initdata;
        var pre = 2; //时间提前天数
        $.each(data,function (i,d) {
            var timearray = [];
            var hotarray = []
            var trendarray = d.trend.split(" ");
            for(var i = 0;i< trendarray.length;i++)
            {
                var timestamp =  Date.parse(d.time) +(i - pre) * 1000 * 60 * 60 *24;
                var newDate = new Date();
                newDate.setTime(timestamp);
                var timestr = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
                timearray.push(timestr);
                hotarray.push(parseInt(trendarray[i]));
            }
            var eventdata = [timearray,hotarray];
            trenddata[d.ringId] = eventdata;
            initdata = d;
        })
        var events = {};
        var times = [];
        $.each(data, function (idx) {
            if (data[idx].type == 0 || data[idx].type == 5) {
                data[idx].type = 10;
            }
            data[idx].value = parseInt(data[idx].hot);
            data[idx].time = new Date(data[idx].time).format('yyyy-MM-dd');
            times.push(data[idx].time);
        });
        times.sort();
        $.each(data, function (idx) {
            var e = data[idx];
            if (!events[e.type]) {
                events[e.type] = [];
            }
            events[e.type].push(e);
        });
        var series = [];
        var types = [];
        for (var t in events) {
            var values = [];
            for (var x in events[t]) {
                var e = events[t][x];
                values.push([e.time, e.value, e.title, e.ringId, e.type, e.emotion, e.location]);
            }
            series.push({
                name: eventTypes[t],
                type: 'scatter',
                itemStyle: {
                    normal: {
                        opacity: 0.7,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    },
                },
                data: values,
                symbolSize: 25,
            });
            types.push(eventTypes[t]);
        }

        var option = {
            color: [
                '#dd4444', '#fec42c', '#80F1BE', '#f7835b', '#79cbff', '#059520'
            ],
            grid: {
                top: '15%',
                right: '8%',
                bottom: '8%',
                left: '8%'
            },
            legend: {
                data: types,
                itemGap: 20,
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                padding: 10,
                borderColor: '#777',
                borderWidth: 1,
                formatter: function (item) {
                    return item.data[2]; // title
                }
            },
            xAxis: {
                type: 'category',
                data: times,
                name: '日期',
                nameGap: 16,
                boundaryGap: true,
                nameTextStyle: {
                    fontSize: 12
                },
                splitLine: {
                    show: true
                },
            },
            yAxis: {
                type: 'value',
                name: '热度',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    fontSize: 12
                },
                splitLine: {
                    show: true
                }
            },
            series: series
        };
        var eventsChart = echarts.init($("div#event-chart").get(0));
        eventsChart.setOption(option);
        eventsChart.on('click', function (item) {
            initHotTrendChart(trenddata, item);
        });
        initHotTrendChart(trenddata, {data: series[0].data[0]});
    });
}

function initRecentActivities(targetDom, areaName) {
    $.getJSON("/api/tianjin/getTopActivitiesByAreaName", {areaName: areaName, size: 15}, function (data) {
        var tpl = '<li class="{{rank}}"> \
                        <a class="link" href="/djyun_activity?id={{id}}" data-toggle="tooltip" title="{{title}}"> \
                        <span style="color: {{typecolor}};border: 1px solid;font-size: 12px">{{typestr}}</span> &nbsp;{{title}}</a> \
                        <p class="clearfix"><span class="time">{{act_time}}</span><span class="source">{{place}}</span></p> \
                    </li>';
        var typestrArray = ["思想建设", "组织建设", "作风建设", "反腐倡廉", "制度建设"];
        $.each(data, function (idx, item) {
            data[idx].typestr = typestrArray[data[idx].type - 1];
            if (data[idx].typestr == ""||!data[idx].typestr) {
                data[idx].typestr = typestrArray[1];
            }
            data[idx].typecolor = "#FF5641!important";
        });
        animateList(targetDom, tpl, data, 4);
    });
}

function plotMomentStat(targetDom, areaName) {
    var statChart = echarts.init($(targetDom).get(0));
    statChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:['一天', '三天', '一周', '半个月', '一个月', '更长']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        color: ['#9fdabf', '#7fae90', '#6ab0b8', '#e98f6f', '#ed4a4a', '#d53a35'],
        xAxis : [
            {
                name: '类型',
                type: 'category',
                data: ['环卫','生态','文化','国防','交通','反腐','人事']
            }
        ],
        yAxis : [
            {
                name: '数量',
                type: 'value',
            }
        ],
        series : [
            {
                name:'一天',
                type:'bar',
                barWidth: '40%',
                stack: '时间',
                data:[197, 150, 101, 134, 90, 116, 126]
            },
            {
                name:'三天',
                type:'bar',
                barWidth: '40%',
                stack: '时间',
                data:[203, 174, 191, 234, 120, 192, 144]
            },
            {
                name:'一周',
                type:'bar',
                barWidth: '40%',
                stack: '时间',
                data:[210, 196, 47, 84, 111, 70, 132]
            },
            {
                name:'半个月',
                type:'bar',
                barWidth: '40%',
                stack: '时间',
                data:[220, 271, 191, 134, 140, 110, 130]
            },
            {
                name:'一个月',
                type:'bar',
                stack: '时间',
                data:[220, 40, 201, 154, 190, 120, 40]
            },
            {
                name:'更长',
                type:'bar',
                barWidth: '40%',
                stack: '时间',
                data:[230, 232, 201, 154, 190, 130, 40]
            },
        ]
    });
}

function plotMomentTrend(targetDom, areaName) {
    var trendChart = echarts.init($(targetDom).get(0));
    trendChart.setOption({
        title : {
            x: 'center',
            align: 'right'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
            data:['问题总数', '未解决', '平均时长'],
            x: 'left'
        },
        // color: ['#90dcdd', '#d87a80', 'red'],
        color: ['#d3b334',
            '#f15a2a',
            '#ff1c43'],
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLine: {onZero: false},
                axisLabel: {
                    interval: 3,
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(function(x) { return '2017/3/' + x; }),
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                max: 200,
                min: 0
            },
            {
                name: '处理时长（天）',
                type: 'value',
                max: 10,
            }
        ],
        series: [
            {
                name:'问题总数',
                type:'line',
                smooth: true,
                yAxisIndex: 0,
                animation: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                itemStyle: {
                    normal: {
                        areaStyle: {type: 'default'},
                    }
                },
                data: [19, 29, 10, 12, 13, 12, 17, 19, 27, 23, 20, 11, 13, 15, 18, 20, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+150; }),
            },
            {
                name:'未解决',
                type:'line',
                smooth: true,
                yAxisIndex:0,
                animation: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                itemStyle: {
                    normal: {
                        areaStyle: {type: 'default'},
                    }
                },
                data: [13, 25, 17, 22, 17, 29, 30, 24, 15, 18, 19, 12, 10, 20, 29, 14, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+50; }),
            },
            {
                name:'平均时长',
                type:'line',
                smooth: true,
                yAxisIndex:1,
                animation: false,
                max: 100,
                lineStyle: {
                    normal: {
                        width: 2,
                    }
                },
                data: [3, 4, 3, 2, 5, 7, 3, 4, 6, 3, 5, 4, 3, 2, 4, 5, 6, 7, 3, 4, 5, 5, 6],
            }
        ]
    });
}

function plotDangjianStat(targetDom, areaName) {
    var statChart = echarts.init($(targetDom).get(0));
    statChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['思想建设', '组织建设', '作风建设', '制度建设', '反腐倡廉建设']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                name: '区',
                type: 'category',
                data: ['和平区','河东区','河西区','南开区','红桥区','宁河区','滨海新区']
            }
        ],
        yAxis : [
            {
                name: '数量',
                type: 'value',
            }
        ],
        series : [
            {
                name:'思想建设',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:[197, 150, 101, 134, 90, 116, 126]
            },
            {
                name:'组织建设',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:[203, 174, 191, 234, 120, 192, 144]
            },
            {
                name:'作风建设',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:[210, 196, 47, 84, 111, 70, 132]
            },
            {
                name:'制度建设',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:[220, 271, 191, 134, 140, 110, 130]
            },
            {
                name:'反腐倡廉建设',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:[220, 40, 201, 154, 190, 120, 40]
            },
        ]
    });
}

function plotDangjianTrend(targetDom, areaName) {
    var trendChart = echarts.init($(targetDom).get(0));
    trendChart.setOption({
        title : {
            x: 'center',
            align: 'right'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
            data:['开展活动数', '凝聚力指数'],
            x: 'left'
        },
        color: ['#90dcdd', '#d87a80', 'blue'],
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLine: {onZero: false},
                axisLabel: {
                    interval: 3,
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(function(x) { return '2017/3/' + x; }),
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                max: 200,
                min: 0
            },
            {
                name: '凝聚力指数',
                type: 'value',
                max: 10,
            }
        ],
        series: [
            {
                name:'开展活动数',
                type:'line',
                smooth: true,
                yAxisIndex: 0,
                animation: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                data: [19, 29, 10, 12, 13, 12, 17, 19, 27, 23, 20, 11, 13, 15, 18, 20, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+150; }),
            },
            {
                name:'凝聚力指数',
                type:'line',
                smooth: true,
                yAxisIndex:1,
                animation: false,
                max: 100,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                data: [3, 4, 3, 2, 5, 7, 3, 4, 6, 3, 5, 4, 3, 2, 4, 5, 6, 7, 3, 4, 5, 5, 6],
            }
        ]
    });
}

function plotYuqingStat(targetDom, areaName) {
    var statChart = echarts.init($(targetDom).get(0));
    statChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['新闻', '报纸', '微信', '官媒', '贴吧', '其他']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                name: '类型',
                type: 'category',
                data: ['交通','环卫','人社','生态','政治','体育','财经']
            }
        ],
        yAxis : [
            {
                name: '数量',
                type: 'value',
            }
        ],
        series : [
            {
                name:'新闻',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[197, 150, 101, 134, 90, 116, 126]
            },
            {
                name:'报纸',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[203, 174, 191, 234, 120, 192, 144]
            },
            {
                name:'微信',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[210, 196, 47, 84, 111, 70, 132]
            },
            {
                name:'官媒',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[220, 271, 191, 134, 140, 110, 130]
            },
            {
                name:'贴吧',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[220, 40, 201, 154, 190, 120, 40]
            },
            {
                name:'其他',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:[230, 232, 201, 154, 190, 130, 40]
            },
        ]
    });
}

function plotYuqingTrend(targetDom, areaName) {
    var trendChart = echarts.init($(targetDom).get(0));
    trendChart.setOption({
        title : {
            x: 'center',
            align: 'right'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
            }
        },
        legend: {
            data:['正面', '负面', '影响力指数'],
            x: 'left'
        },
        color: ['#90dcdd', '#d87a80', 'blue'],
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLine: {onZero: false},
                axisLabel: {
                    interval: 3,
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(function(x) { return '2017/3/' + x; }),
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                max: 200,
                min: 0
            },
            {
                name: '影响力指数',
                type: 'value',
                max: 10,
            }
        ],
        series: [
            {
                name:'正面',
                type:'line',
                smooth: true,
                yAxisIndex: 0,
                animation: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                data: [19, 29, 10, 12, 13, 12, 17, 19, 27, 23, 20, 11, 13, 15, 18, 20, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+150; }),
            },
            {
                name:'负面',
                type:'line',
                smooth: true,
                yAxisIndex:0,
                animation: false,
                lineStyle: {
                    normal: {
                        width: 1,
                    }
                },
                data: [13, 25, 17, 22, 17, 29, 30, 24, 15, 18, 19, 12, 10, 20, 29, 14, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+50; }),
            },
            {
                name:'影响力指数',
                type:'line',
                smooth: true,
                yAxisIndex:1,
                animation: false,
                max: 100,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                data: [3, 4, 3, 2, 5, 7, 3, 4, 6, 3, 5, 4, 3, 2, 4, 5, 6, 7, 3, 4, 5, 5, 6],
            }
        ]
    });
}


/**
 * @param targetDom: 列表DOM容器
 * @tpl: 单个元素的Mustache模板
 * @items: 列表中显示的数据
 * @limit: 单次显示的最大个数限制
 *
 * 说明：在列表项模板中使用 {{rank}}，即可对显示的前三项加上正确的颜色标记。
 */
function animateList(targetDom, tpl, items, limit) {
    var Mustache = require("mustache");
    var rank = ['item first', 'item second', 'item third', 'item fourth', 'item fifth',
                'item sixth', 'item seventh', 'item eighth'];
    var tpl = "{{#elements}}" + tpl + "{{/elements}}"
    var startIdx = 0;
    $list = $(targetDom);
    $.each(items, function (idx, item) {
        item.rank = rank[idx % 8]; // rank class.
    });
    $list.html(Mustache.render(tpl, {elements: items}));

    $list.css('height', ($list.find('li:first').height() + 16 + 20) * limit + 16 + 'px');

    function renderList() {
        $first = $list.find("li:first");
        $last = $list.find("li:last");
        $last.css({
            'margin-top': -($first.height()) + 'px',
            'margin-bottom': '16px',
        }).prependTo($list);
        $list.find("li:first").animate({
                marginTop: 0 + 'px',
            },
            1250,
            function () {}
        );
    }

    var timer = setInterval(function () { renderList(); }, 3000);
    $list.hover(function (){
        clearInterval(timer);
    },function (){
        timer = setInterval(function () { renderList(); }, 3000);
    });
}
