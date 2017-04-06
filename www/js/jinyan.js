// This is a JavaScript file
var typeArr = [
    "其他", "党建", "经贸 商务", "国资 投资", "工业 科技", "工商 物价", "财政 税收", "交通", "邮政", "金融 证券",
    "市政 环卫", "农业", "林业", "文化 教育", "民族 宗教","体育", "国防 公安", "司法 法治", "反腐 ", "人事 档案",
    "医疗 卫生", "社保 扶贫", "影视 出版", "食品 药品", "安全", "政治"];

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

