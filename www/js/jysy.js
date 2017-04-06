// This is a JavaScript file

function initJysy(){
    pieIndexData("all", "");  
    getTopActiveDepts('table#active-depts', "", 4);
    getTopActivities('#activities', "", 6);
    initSolvedData("#solved-list", "#unsolved-list" ,"", 6);
    initZhengYuqing("#zmyq-list");
    initFuYuqing("#fmyq-list");
}


function initYuQingLineChart(target,data,type) {
    var datelist = [];
    var pos = [];
    var neg = [];
    var neu = [];
    for(var i in data){
        var d = data[i];
        datelist.push(new Date(d.time).format('MM-dd'));
        pos.push(d.positive);
        neg.push(d.negative);
        neu.push(d.neutral);
    }
    var maxBound = -1;
    $.each(data, function (i, item) {
        maxBound = Math.max(maxBound, item.negative);
        maxBound = Math.max(maxBound, item.neutral);
        maxBound = Math.max(maxBound, item.positive);
    });
    var lineChart = echarts.init(document.getElementById(target));
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        color:["#F7835B","#F3B460","#6EB9EC"],
        grid: {
            top: '12%',
            left: '4%',
            right: '2%',
            bottom: '10%'
        },
        legend: {
            data:type,//['正向','负向','中性']
            itemGap: 20,
            textStyle: {
                fontSize: 16
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: datelist
        },
        yAxis: {
            type: 'value',
            max: Math.round(maxBound * 1.2),
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name:type[0],
                type:'line',
                data:pos,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    itemStyle:{
                        normal:{
                            color:"#F7835B"
                        },
                        emphasis:{
                            color:"#F7835B"
                        }
                    },
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
            },
            {
                name:type[1],
                type:'line',
                data:neg,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            },{
                name:type[2],
                type:'line',
                data:neu,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }

        ]
    };
    lineChart.setOption(option);
}

function initqyLineChart(target,data,type,dataList) {
    var datelist = [];
    var pos = [];
    var neg = [];
    var neu = [];
    for(var i in data){
        var d = data[i];
        datelist.push(new Date(d.time).format('MM-dd'));
        pos.push(d.positive);
        neg.push(d.negative);
        neu.push(d.neutral);
    }
    var maxBound = -1;
    $.each(data, function (i, item) {
        maxBound = Math.max(maxBound, item.negative);
        maxBound = Math.max(maxBound, item.neutral);
        maxBound = Math.max(maxBound, item.positive);
    });
    var lineChart = echarts.init(document.getElementById(target));
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(i,datalist){
                // debugger
                var tmp = '<br />';
                var res = "";
                if(i.componentType == "markPoint"){
                    var k = i.seriesIndex + i.dataIndex * 3;
                    for(var j = 0;j < 3;++j){
                        res += dataList[k * 3 + j].description.substr(0,26) + tmp;
                    }
                }
                else{
                    res = i[0].name + tmp;
                    for(var j = 0;j < 3;++j){
                        res += i[j].seriesName + ':' + i[j].value + tmp;
                    }
                }
                return res;
            }
        },
        color:["#F7835B","#F3B460","#6EB9EC"],
        grid: {
            top: '13%',
            left: '4%',
            right: '2%',
            bottom: '10%'
        },
        legend: {
            data:type,//['正向','负向','中性']
            itemGap: 20,
            textStyle: {
                fontSize: 16
            }
        },
        // legend: {
        //     data:type,//['正向','负向','中性']
        // },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: datelist
        },
        yAxis: {
            type: 'value',
            max: Math.round(maxBound * 1.2),
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name:type[0],
                type:'line',
                data:pos,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    itemStyle:{
                        normal:{
                            color:"#F7835B"
                        },
                        emphasis:{
                            color:"#F7835B"
                        }
                    },
                    data: [
                        {type: 'max', name: '最大值'},
                        // {type: 'min', name: '最小值'}
                    ]
                },
            },
            {
                name:type[1],
                type:'line',
                data:neg,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        // {type: 'min', name: '最小值'}
                    ]
                },
            },
            {
                name:type[2],
                type:'line',
                data:neu,//[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        // {type: 'min', name: '最小值'}
                    ]
                },
            }

        ]
    };
    lineChart.setOption(option);
}

function updatePieIndexData(data, type, index, location) {
    if(type == "all")
    {
        var dangjian = PieIndex('dangjian',data.data1_y[index],1);
        var weimin = PieIndex('weimin',data.data2_y[index],2);
        var yuqing = PieIndex('yuqing',data.data3_y[index],3);
        // dangjian.on('click', function (item) {
        //     if(location == "天津")
        //     {
        //         window.open('/djyun_dangjian', '_self');
        //     }
        //     else
        //     {
        //         window.open('/djyun_area_dangjian?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
        //     }
        // });
        // weimin.on('click', function (item) {
        //     if(location == "天津")
        //     {
        //         window.open('/djyun_moment', '_self');
        //     }
        //     else
        //     {
        //         window.open('/djyun_area_moment?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
        //     }
        // });
        // yuqing.on('click', function (item) {
        //     if(location == "天津")
        //     {
        //         window.open('/djyun_publicopinion', '_self');
        //     }
        //     else
        //     {
        //         window.open('/djyun_area_publicopinion?loc=' + location + "&parent=" + "/djyun_area?loc="+location, '_self');
        //     }
        // });
        // 刷新“上升/下降”处的百分比
        $('p#dangjian-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
            calcUpDown(data.data1_y, index)
        ));
        $('p#moment-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
            calcUpDown(data.data2_y, index)
        ));
        $('p#publicopinion-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
            calcUpDown(data.data3_y, index)
        ));
    }
    else if(type == "dangjian")
    {
        var dangjian = PieIndex('dangjian',data.data1_y[6],1);
        $('p#dangjian-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
            calcUpDown(data.data1_y, 6)
        ));
    }
    else if(type == "weimin")
    {
        var weimin = PieIndex('weimin',data.data2_y[6],2);
        $('p#moment-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
            calcUpDown(data.data2_y, 6)
        ));
    }
    else if(type == "yuqing")
    {
        var yuqing = PieIndex('yuqing',data.data3_y[6],3);
        $('p#publicopinion-cmp').html(Mustache.render(
            '同比{{text}}<span class="num {{direct}}">{{diff}}%</span>',
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
            shape = "up";
        }
        else {
            text = "下降";
            direct = "down";
            shape = "down";
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
        url: 'https://ring.cnbigdata.org/getthreeindexs',
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

function getTopActiveDepts(targetId, areaName, threshold) {
    $.get('https://ring.cnbigdata.org/api/tianjin/getTopActiveDeptsByAreaName', {areaName: areaName, size: threshold}, function (data) {
        for (var idx in data) {
            data[idx].idx = parseInt(idx) + 1;
            if (data[idx].area == '机关') {
                data[idx].area = '机关工委';
            }
        }
        data[0].ranktext = 'first';
        data[1].ranktext = 'second';
        data[2].ranktext = 'third';
        var code = "";
        code += '<tr>';
        for(var i = 0; i < 4; i++){ 
            if(i != 0 && i % 2 == 0)
                code += '</tr><tr>'
            code += '<td class="xf-item home-party-branch">';
            code += '<img src="img/xianfeng-top' + (i+1) + '.png" width="40px" height="40px">';
            code += '<p class="name">' + data[i].area + '</p>';
            code += '<a href="https://ring.cnbigdata.org/partybranch/' + data[i].id + '" class="name jysy-xfzb-name">' + data[i].short_name + '</a></td>';            
        }
        code += '</tr>';
        $(targetId).html(code);
    });
}
function getTopActivities(targetId, areaName, threshold) {
    var typestrArray = ["思想建设", "组织建设", "作风建设", "反腐倡廉", "制度建设"];
    $.getJSON('https://ring.cnbigdata.org/api/tianjin/getTopActivitiesByAreaName', {areaName: areaName, size: threshold}, function (data) {
        for (var idx in data) {
            data[idx].idx = parseInt(idx) + 1;
            data[idx].typestr = typestrArray[data[idx].type - 1];
            data[idx].type = data[idx].type - 1;
            if(data[idx].typestr == ""||!data[idx].typestr) data[idx].typestr =typestrArray[1];
            data[idx].typecolor = "#FF5641!important";
        }
        data[0].ranktext = 'first';
        data[1].ranktext = 'second';
        data[2].ranktext = 'third';
        
        var tpl = '{{#activities}} \
            <ons-list-item> \
                <div class="left"><img class="list-item__thumbnail" src="img/xfhd-{{type}}.png" width="40px"></div>\
                <div class="center" href="https://ring.cnbigdata.org/djyun_activity?id={{id}}" data-toggle="tooltip" title="{{title}}"> \
                      {{title}} </div></ons-list-item> \
        {{/activities}}';
        $(targetId).html(Mustache.render(tpl, {activities: data.slice(0, threshold)}));
    });
}
function initSolvedData(target1, target2, loc, size) {
    var dysjInfoTemplate =
        '<ons-list-item class="news-list" modifier="nodivider">\
        <div class="left " style="color: {{typecolor}};"> <div class="item-label">{{typestr}}</div></div>\
        <div class="link center solve-unsolve-item" href="https://ring.cnbigdata.org/djyundysj/{{id}}"> {{title}}</div>\
        </ons-list-item>';
    var indexStr = ['index first','index second','index third','index','index'];
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/api/djyunsjsearch?size='+size+'&solved=1&order=updatedt&ordertype=desc&loc=' + loc,
        dataType: "json",
        success: function (data) {
            // console.log(data);
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
            $(target1).html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/api/djyunsjsearch?size='+size+'&solved=0&order=createdt&ordertype=asc&loc=' + loc,
        dataType: "json",
        success: function (data) {
            //console.log(data);
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
            $(target2).html(rendered);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initFuYuqing(target) {
    var newsInfoTemplate =
            '<ons-list-item class="news-list" modifier="nodivider">\
            <div class="left" style="color: {{typecolor}};"> <div class="item-label">{{typestr}}</div></div>\
            <div class="link center zm-fm-item" href="{{url}}" data-toggle="tooltip" title="{{description}}">{{description}}</div>\
            </ons-list-item>';   
    var indexStr = ['index first','index second','index third','index','index'];
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/getYuqing?size=15&index=yqyj&loc=&emo=2',
        dataType: "json",
        success: function (data) {
            // console.log(data);
            data.sort(function (a,b) {
                return a.time < b.time ? 1:-1;
            });
            // initYujingFix(data);
            var render = "";
            var cnt = 0;
            for (var i in data) {
                var d = data[i];
                if(d.site.indexOf("贴吧") != -1)continue;
                if(d.description.indexOf('行情分析') != -1 || d.description.indexOf('龙虎榜') != -1 ||
                        d.description.indexOf('求购') != -1 || d.description.indexOf('上市') != -1 ||
                        d.description.indexOf('成熟') != -1 || d.description.indexOf('彩票娱乐') != -1 ||
                        d.description.indexOf('招聘') != -1 ||
                        d.description.indexOf('培训') != -1 || d.description.indexOf('一对一') != -1
                        || d.description.indexOf('名师') != -1|| d.description.indexOf('找小姐') != -1
                        || d.description.indexOf('学大教育') != -1|| d.description.indexOf('琐事') != -1){
                    continue;
                }
                if(cnt++ < 6)
                    continue;
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

                d.num = cnt + 1 - 7;
                d.indexStr = indexStr[Math.min(3, cnt - 7)];
                d.time = d.time.substr(0, 4) + '-' + d.time.substr(4, 2) + '-' + d.time.substr(6, 2);
                render += Mustache.render(newsInfoTemplate, d);
                if(cnt > 13)
                    break;
            }
            $("#fmyq-list").html(render);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initZhengYuqing(target) {
    var newsInfoTemplate =
            '<ons-list-item class="news-list" modifier="nodivider">\
            <div class="left" style="color: {{typecolor}};"> <div class="item-label">{{typestr}}</div></div>\
            <div class="link center zm-fm-item" href="{{url}}" data-toggle="tooltip" title="{{description}}">{{description}}</div>\
            </ons-list-item>';
    var indexStr = ['index first','index second','index third','index','index'];
    var render = "";
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/getYuqing?size=8&index=tjnews&loc=&emo=1',
        dataType: "json",
        success: function (data) {
            // console.log(data);
            for (var i in data) {
                var d = data[i];
                d.eventLoc = d.eventLoc.substr(0,2);
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

                d.num = parseInt(i) + 1;
                d.indexStr = indexStr[Math.min(3,i)];
                if (d.src == '新闻')
                    d.es_type = 0;
                else
                    d.es_type = 1;
                d.time = d.time.substr(0, 10);
                render += Mustache.render(newsInfoTemplate, d);
                if(i > 6)
                    break;
            }
            $("#zmyq-list").html(render);
        },
        error: function (e) {
            console.log(e);
        }
    });

}

