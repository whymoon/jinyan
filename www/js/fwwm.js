// This is a JavaScript file

function initFwwm(){
    initMomentCount("");
    initSolvedData("#fwwm-solved-list", "#fwwm-unsolved-list" ,"", 8);
    plotMomentStat("div#fwwm-moment-stat", "",6);
    plotMomentTrend("div#fwwm-moment-trend", "");
}

function plotMomentStat(targetDom, areaName,size) {

    var statChart = echarts.init($(targetDom).get(0));
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/api/getPlotMomentStatData?size='+size,
        dataType: "json",
        success: function (data) {
            var series = [];
            var mytypearr = [];
            var datearr = ["一天","三天","一周","半个月","一个月","更长"];
            for(var i=0;i<data.type.length;i++)
            {
                mytypearr.push(typeArr[data.type[i]].split(" ")[0]);
            }
            for(var i = 0;i<datearr.length;i++)
            {
                series.push({
                                name:datearr[i],
                                type:'bar',
                                barWidth: '40%',
                                stack: '时间',
                                data:data[i]
                            }
                    )
            }
            statChart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:datearr
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:'25%',
                    containLabel: true
                },
                color: ['#9fdabf', '#7fae90', '#6ab0b8', '#e98f6f', '#ed4a4a', '#d53a35'],
                xAxis : [
                    {
                        name: '类型',
                        type: 'category',
                        data: mytypearr,
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
                yAxis : [
                    {
                        name: '数量',
                        type: 'value',
                    }
                ],
                series : series                
            });
        },
        error: function (e) {
            console.log(e);
        }
    });

}

function plotMomentTrend(targetDom, areaName) {
    var trendChart = echarts.init($(targetDom).get(0));
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/api/getPlotMomentTrendData',
        data: {},
        dataType: "json",
        success: function (data) {
            // console.log(data);
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
                        data: data.datearray.map(function(x){return x.substring(x.indexOf('-') + 1)}),
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
                        max: 100,
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
                        data: data.count,
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
                        data: data.unsolvedcount,
                    },
                    {
                        name:'平均时长',
                        type:'line',
                        smooth: true,
                        yAxisIndex:1,
                        animation: false,
                        max: 10,
                        lineStyle: {
                            normal: {
                                width: 2,
                            }
                        },
                        data: data.avetime,
                    }
                ]
            });
        },
        error: function (e) {
            console.log(e);
        }
    });

}

function initMomentCount(areaName) {
    $.getJSON("https://ring.cnbigdata.org/api/tianjin/getStatOfMomentFromGridById", {areaName: areaName, cmp: 1}, function (data) {
        $("#fwwm-total-count").html(data.solved + data.unsolved);
        $("#fwwm-solved-count").html(data.solved);
        $("#fwwm-total-cmp").html(Mustache.render(
            '较上月{{text}}<span class="fwwm-numbers-{{direct}}">{{diff}}%</span>',
            calcUpDown(data.last_solved + data.last_unsolved, data.solved + data.unsolved)
        ));
        $("#fwwm-solved-cmp").html(Mustache.render(
            '较上月{{text}}<span class="fwwm-numbers-{{direct}}">{{diff}}%</span>',
            calcUpDown(data.last_solved, data.solved)
        ));
    });

    // 计算“上升/下降”的值。
    function calcUpDown(a, b) {
        var diff, text, direct, shape;
        if (a == 0) {
            a = b; // HACK by @ht, 2017-04-06
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