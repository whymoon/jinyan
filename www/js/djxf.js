// This is a JavaScript file

function initDjxf(){
    getThematicActivities();
    // getTopActivities('#djxf-activities', "", 8);
    getTopActiveMembers("#djxf-active-members", "", 6);
    getRecentActivityCount("");
    getActiveAndCommentDegree("");
    initDeptCount();
}

function getTopActiveMembers(targetId, areaName, threshold) {
    $.getJSON('https://ring.cnbigdata.org/api/getTopTenMember', {areaName: areaName}, function (data) {
        for (var idx in data) {
            data[idx].idx = parseInt(idx) + 1;
        }
        data[0].ranktext = 'first';
        data[1].ranktext = 'second';
        data[2].ranktext = 'third';
        var tpl = '{{#members}} \
            <ons-list-item>{{name}} - {{branch_name}} - {{dept_name}}</ons-list-item>\
        {{/members}}';
        // var tpl = '{{#members}} \
        //     <li> \
        //         <span class="index {{ranktext}}">{{idx}}</span> \
        //         <a class="link" href="#" target="_blank" data-toggle="tooltip" title="{{name}}"> \
        //             {{name}} - {{branch_name}} - {{dept_name}} \
        //         </a> \
        //         <span class="time">{{partyDay}}&nbsp;入党</span> \
        //     </li> \
        // {{/members}}';
        $(targetId).html(Mustache.render(tpl, {members: data.slice(0, threshold)}));
    });
}

function initDeptCount() {
    $.getJSON("https://ring.cnbigdata.org/api/tianjin/getPartyCount", {areaName: ""}, function (data) {
        $("#party-count-total").html(data.total);
        $("#party-count-active").html(data.active);
    });
}

function getThematicActivities(){
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/getThematicActivities',
        dataType: "json",
        success: function (data) {
            $("#twostudycount").html(data.twostudypoint);
            $("#sanhuicount").html(data.sanhuipoint );
            $("#twostudyrate").html(data.twostudyrate +"%");
            $("#sanhuirate").html(data.sanhuirate +"%");
        },
        error: function (e) {
            console.log(e);
        }
    });
}
function getRecentActivityCount(location){
    $.ajax({
        type:"GET",
        url: 'https://ring.cnbigdata.org/api/tianjin/getRecentActivityCount',
        data: {loc: location},
        dataType:"json",
        success:function(data){
            plotDangjianStat("div#dangjian-stat", data);
        },
        error:function(e){
            console.log(e);
        }
    });
}

function getActiveAndCommentDegree(location) {
    location="";
    $.ajax({
        type:"GET",
        url: 'https://ring.cnbigdata.org/api/tianjin/getActiveAndCommentDegree',
        data: {loc: location},
        dataType:"json",
        success:function(data){            
            plotDangjianTrend("div#dangjian-trend", data);
        },
        error:function(e){
            console.log(e);
        }
    });
}
function plotDangjianTrend(targetDom, data) {
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
                data: data.data_x.slice(-20).map(function(x){return x.substring(x.indexOf('-') + 1)}),
                axisLabel:
                {
                    rotate:45,
                    textStyle:
                    {
                        fontSize: 10
                    }
                }
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                max: 1000,
                min: 0
            },
            {
                name: '凝聚力指数',
                type: 'value',
                max: 6,
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
                data: data.data_y1.slice(-20),
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
                data:  data.data_y2.slice(-20),
            }
        ]
    });
}

function plotDangjianStat(targetDom, data) {
    var statChart = echarts.init($(targetDom).get(0));
    statChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
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
                data: data.data_x
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
                name:'组织活动数',
                type:'bar',
                barWidth: '40%',
                stack: '类型',
                data:data.data_y
            },
        ],
        itemStyle:{
            normal:{
                color: function(params) {
                    // build a color map as your need.
                    var colorList = [
                        "#6EB9EC","#F3B460","#F7835B",'#d48265', '#91c7ae','#749f83',  '#ca8622','#bda29a','#6e7074', '#546570', '#c4ccd3'
                    ];
                    return colorList[params.dataIndex]
                }
            }
        }
    });
}

