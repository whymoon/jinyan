// This is a JavaScript file
function initYqrd(){
    initYuqingNumber();
    initYuqingStat();
    initYuqingTrend();    
}

function initYuqingNumber(){
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/api/djyun_publicopinion?loc=',
        dataType: "json",
        success: function (data) {
            $('#yqrd-pos-count').html(data.pos);
            $('#yqrd-neg-count').html(data.neg);
            $('#yqrd-pos-cmp').html(Mustache.render(
                '较上月{{text}}<span class="yqrd-numbers-{{direct}}">{{diff}}%</span>',
                calcUpDown(data.posC))
            );
            $('#yqrd-neg-cmp').html(Mustache.render(
                '较上月{{text}}<span class="yqrd-numbers-{{direct}}">{{diff}}%</span>',
                calcUpDown(data.negC))
            );
        },
        error: function (e) {
            console.log(e);
        }
    });
    function calcUpDown(cmp) {
        var diff, text, direct, shape;
        
        if (cmp >= 0) {
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
            diff: Math.abs(cmp),
            text: text,
            direct: direct,
            shape: shape,
        };
    }
}

function initYuqingStat() {
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/cntYuqingType?loc=',
        dataType: "json",
        success: function (data) {
            plotYuqingStat("div#yqrd-yuqing-stat", data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

function initYuqingTrend() {
    $.ajax({
        type: "GET",
        url: 'https://ring.cnbigdata.org/getYuqingEmo?loc=',
        dataType: "json",
        success: function (data) {
            console.log(data);
            plotYuqingTrend("div#yqrd-yuqing-trend", data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}
function plotYuqingStat(targetDom, data) {
    var srctype = [[],[],[],[],[],[]];
    var typeList = [];
    for(var i in data){
        var type = data[i];
        for(var j = 0;j < 6;++j)
            srctype[j].push(type[j]);
        typeList.push(typeArr[type[6]].split(" ")[0]);
    }
    var statChart = echarts.init($(targetDom).get(0));
    statChart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['新闻', '论坛', '微博', '微信', '平媒', '其他']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '25%',
            containLabel: true
        },
        xAxis : [
            {
                name: '类型',
                type: 'category',
                data: typeList//['交通','环卫','人社','生态','政治','体育','财经']
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
                data:srctype[0]//[197, 150, 101, 134, 90, 116, 126]
            },
            {
                name:'论坛',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:srctype[1]//[203, 174, 191, 234, 120, 192, 144]
            },
            {
                name:'微博',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:srctype[2]//[210, 196, 47, 84, 111, 70, 132]
            },
            {
                name:'微信',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:srctype[3]//[220, 271, 191, 134, 140, 110, 130]
            },
            {
                name:'平媒',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:srctype[4]//[220, 40, 201, 154, 190, 120, 40]
            },
            {
                name:'其他',
                type:'bar',
                barWidth: '40%',
                stack: '来源',
                data:srctype[5]//[230, 232, 201, 154, 190, 130, 40]
            },
        ]
    });
}
function plotYuqingTrend(targetDom, data) {
    var datelist = [];
    var pos = [];
    var neg = [];
    var neu = [];
console.log(1);
    for(var i in data){
        var d = data[i];
        var t = new Date(d.time);
        datelist.push(t.getMonth() + '-' + t.getDate());
        pos.push(d.positive);
        neg.push(d.negative);
        neu.push(d.neutral);
    }
    
    // var maxBound = -1;
    // $.each(data, function (i, item) {
    //     maxBound = Math.max(maxBound, item.negative);
    //     maxBound = Math.max(maxBound, item.neutral);
    //     maxBound = Math.max(maxBound, item.positive);
    // });
    var trendChart = echarts.init($(targetDom).get(0));
    console.log(3);
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
                data: datelist,//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(function(x) { return '2017/3/' + x; }),
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                max: 100,//Math.round(maxBound * 1.1),
                min: 0
            },
            {
                name: '影响力指数',
                type: 'value',
                max: 100,
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
                data: pos,//[19, 29, 10, 12, 13, 12, 17, 19, 27, 23, 20, 11, 13, 15, 18, 20, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+150; }),
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
                data: neg,//[13, 25, 17, 22, 17, 29, 30, 24, 15, 18, 19, 12, 10, 20, 29, 14, 32, 22, 32, 23, 24, 26, 19].map(function (x) { return x+50; }),
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
                data: neu,//[3, 4, 3, 2, 5, 7, 3, 4, 6, 3, 5, 4, 3, 2, 4, 5, 6, 7, 3, 4, 5, 5, 6],
            }
        ]
    });
}