// This is a JavaScript file
function PieIndex(target,percent,flag){
    var myChart = echarts.init(document.getElementById(target));
    var tag="";
    var color1="#c23531";
    if(flag==1) {tag="党建指数";color1="#FF4C37";}
    else if(flag==2) {tag="为民指数";color1="#FF9F38";}
    else if(flag==3) {tag="舆情指数";color1="#41B8FB";}
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/> {b} : {c} "
        },
        legend: {
            show:false,
            orient : 'vertical',
            x : 'left',
        },
        //calculable : true,
        series : [
            {
                name: '',
                type: 'pie',
                radius: ['60%', '85%'],
                data: [{value:percent,name:tag},
                ],
                labelLine:{normal:{show:false}},
                label:{
                    normal:{
                        position:'center',
                        formatter:'{c}',
                        textStyle: {
                            fontSize: '26',
                            fontWeight: 'bold'
                        }
                    }
                },
            }
        ],
        color:[color1,'#2f4554']
    };
    myChart.setOption(option);
    return myChart;
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