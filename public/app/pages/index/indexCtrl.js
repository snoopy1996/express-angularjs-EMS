(function() {
    'use strict';
    angular.module('LQ_EMS')
        .controller('indexCtrl', indexCtrl);
    function indexCtrl($scope,$timeout,$interval) {
        console.log(123456789484);
        var themeObj = {
            backgroundColor: "rgba(51,51,51,0.3)",
            title:{
                textStyle: { color: '#fff' }
            },
            color: [
                "rgba(221,107,102,0.69)",
                "rgba(117,154,160,0.78)",
                "rgba(113,159,201,0.76)",
                "rgba(141,193,169,0.77)",
                "rgba(182,107,184,0.85)"
            ],
            "legend": { show:true,textStyle:{color:"#fff"}}
        }

        var data = [220, 182, 191, 234, 190, 330, 310,50,200];
        var markLineData = [];
        for (var i = 1; i < data.length; i++) {
            markLineData.push([{
                xAxis: i - 1,
                yAxis: data[i - 1],
                value: (data[i] + data[i-1]).toFixed(2)
            }, {
                xAxis: i,
                yAxis: data[i]
            }]);
        }
        $scope.myConfig =  {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '部门人数',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[
                        {value:335, name:'财务部'},
                        {value:310, name:'市场部'},
                        {value:234, name:'人事部'},
                        {value:265, name:'产品部'},
                        {value:548, name:'技术部'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        $.extend(true,$scope.myConfig,themeObj);
        $scope.mtoption ={};
        $scope.mtoption.option = {
            radar: [

                {
                    indicator: [
                        { text: '融资', max: 150 },
                        { text: '报备', max: 150 },
                        { text: '运转', max: 150 },
                        { text: '故事', max: 120 },
                        { text: '化学', max: 108 }
                    ],
                    center: ['50%', '50%'],
                    radius: 60
                    // shape: 'circle'
                }
            ],
            series: [
                {
                    name: '成绩单',
                    type: 'radar',
                    radarIndex: 0,
                    data: [
                        {
                            value: [90, 113, 140, 30, 70],
                            name: '李四',
                            areaStyle: {
                                normal: {
                                    opacity: 0.9,
                                    color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                        {
                                            color: '#B8D3E4',
                                            offset: 0
                                        },
                                        {
                                            color: '#72ACD1',
                                            offset: 1
                                        }
                                    ])
                                }
                            }
                        }
                    ]
                }
            ]
        } ;
        $.extend(true,$scope.mtoption.option,themeObj);
        $scope.mtoption.sex = {
            // backgroundColor: '#060f4c',
            series: [{
                type: 'pie',
                radius: ['35%', '55%'],
                silent: true,
                data: [{
                    value: 1,
                    itemStyle: {
                        normal: {
                            color: '#050f58',
                            borderColor: '#162abb',
                            borderWidth: 2,
                            shadowBlur: 50,
                            shadowColor: 'rgba(21,41,185,.75)'
                        }
                    }
                }]
            }, {
                type: 'pie',
                radius: ['35%', '55%'],
                silent: true,
                label: {
                    normal: {
                        show: false,
                    }
                },
                data: [{
                    value: 1,
                    itemStyle: {
                        normal: {
                            color: '#050f58',
                            shadowBlur: 30,
                            shadowColor: 'rgba(21,41,185,.75)'
                        }
                    }
                }]
            }, {
                name: '占比',
                type: 'pie',
                radius: ['39%', '52%'],
                hoverAnimation: false,

                data: [{
                    value: 52.7,
                    name: "男性",
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 15,
                                    fontWeight: "bold"
                                },
                                position: "center"
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(5,193,255,0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(15,15,90,1)'
                            }])
                        }
                    },
                    label: {
                        normal: {
                            position: 'outside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            },
                            formatter: '{b}: 527\n\n{a}: {c}%'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 20,
                            length2: 10,
                            smooth: false,
                            lineStyle: {
                                width: 1,
                                color: "#2141b5"
                            }
                        }
                    }
                }, {
                    value: 47.3,
                    name: "女性",
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 15,
                                    fontWeight: "bold"
                                },
                                position: "center"
                            },
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(5,15,88,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(235,122,255,1)'
                            }])
                        }
                    },
                    label: {
                        normal: {
                            position: 'outside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            },
                            formatter: '{b}: 527\n\n{a}: {c}%'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 20,
                            length2: 10,
                            smooth: false,
                            lineStyle: {
                                width: 1,
                                color: "#2141b5"
                            }
                        }
                    }
                }]
            }, {
                name: '',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [200, 200],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                data: [{
                    value: 0,
                    label: {
                        normal: {
                            formatter: '35',
                            textStyle: {
                                color: '#fe8b53',
                                fontSize: 25,
                                fontWeight: 'bold'
                            }
                        }
                    }
                }, {
                    tooltip: {
                        show: false
                    },
                    label: {
                        normal: {
                            formatter: '\n平均年龄',
                            textStyle: {
                                color: '#bbeaf9',
                                fontSize: 12
                            }
                        }
                    }
                }]
            }]
        };
        $.extend(true,$scope.mtoption.sex,themeObj);
        $scope.mtoption.flowWater = {
            xAxis: [
                {
                    type: 'category',
                    data: ['everyMin','everyMin','everyMin','everyMin','everyMin','everyMin','everyMin','everyMin','everyMin','everyMin'],
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: { show: true, textStyle: { color: '#fff' } }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: 0,
                    max: 100,
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} K￥',
                        show: true, textStyle: { color: '#fff' }
                    }
                }
            ],
            series: [

                {
                    name:'流水入账',
                    type:'line',
                    yAxisIndex: 0,
                    data:[20, 22, 33, 45, 63, 92, 80.3, 23.4, 45, 63]
                }
            ]
        };
        $.extend(true,$scope.mtoption.flowWater,themeObj);
        $interval(function () {
            $scope.mtoption.flowWater.series[0].data.shift();
            $scope.mtoption.flowWater.series[0].data.push(Math.random()*100);
        },1000);

        // 百度地图
        $timeout(function () {
            var map = new BMap.Map("allmap");    // 创建Map实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.setMapStyle({style:'midnight'});
            var point = new BMap.Point(116.331398,39.897445);
            map.centerAndZoom(point,16);
            //定位功能
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    var opts = {
                        position : r.point,    // 指定文本标注所在的地理位置
                        offset   : new BMap.Size(-30, -50)    //设置文本偏移量
                    };
                    var label = new BMap.Label("联趣科技公司", opts);  // 创建文本标注对象
                    label.setStyle({
                        color : "rgb(124,184,242)",
                        fontSize : "12px",
                        height : "20px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑",
                        border: "none",
                        "background-color":"rgba(5,5,5,0)"
                    });
                    map.addOverlay(label);
                }
                else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            // map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            console.log('地图定位加载成功！');
        },100)
    }
})();