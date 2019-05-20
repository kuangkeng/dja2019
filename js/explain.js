
//CODE FOR SCROLLSTORY STARTS HERE
// check viewport dimensions and use them to set the text box margin and chart height and width
var $scrollerWrapper = $('.scroller-wrapper'),
    $chartWrapper = $('.chart-wrapper');

var viewportHeight = $(window).height(),
    halfViewportHeight = Math.floor(viewportHeight / 2),
    twoThirdViewportHeight = Math.floor(viewportHeight / 3 * 2),
    chartWidth = $('.dataviz-wrapper').width()-22,
    chartMargin = 0 - (chartWidth/2), //use this to center align the chart when it's position is set as fixed
    chartHeight = Math.floor(viewportHeight*0.8),
    headlineHeight = $('.headline').outerHeight( true);

$chartWrapper.css({'width':chartWidth, 'margin-left':chartMargin, 'height':chartHeight});
$('.trigger').css({'margin-top':viewportHeight});
$('#opening-text').css({'margin-bottom':viewportHeight});
$('#pageMobileMenu').css({height:viewportHeight});
$('.mobileMenuBox').css({height:viewportHeight*0.8-headlineHeight});
$('.mobileAvatar').css({'max-height':viewportHeight});

var chart1, chart2, chart3, chart4, chart5, chart6, chart7, chart8;

//count and step are used to check if any chart animation step has been skipped
var count = 0,
    step = 0,
    chartSwitch = 0,
    lastScrollTop = 0,
    scrollDirection = 0; 

//CODE FOR SCROLLSTORY ENDS HERE

var dataDate = [],
    dataDate2 = [],
    dataSub = [],
    dataSub2 = [],
    dataCat2Name = [],
    dataCat2Data = [];

var itemChartSize;    

for (i = 0; i < dataDateAll.length; i++) { 
    dataDate.push(dataDateAll[i].Day);
    dataSub.push(dataDateAll[i].submissions);
}

for (i = 0; i < dataCat1All.length; i++) { 
    dataCat2Name.push(dataCat1All[i].name);
    dataCat2Data.push(dataCat1All[i].value);
}

dataDate2 = JSON.parse(JSON.stringify(dataDate));
dataSub2 = JSON.parse(JSON.stringify(dataSub));

    function init() {      
      steps = steps_null;
      setTimeout(scrollstory,500);
      setTimeout(function(){
        $('.trigger').css("opacity","0.1");
      },500);
      $('.highlight').addClass("changeBackground");
      if($('.text-wrapper').width() < 550){
        itemChartSize = "60%"; 
      } else {
        itemChartSize = "100%";        
      }
    }

    //SCROLLSTORY: handle the fixed/static position of grahpic
    var toggle = function(bottom) {
      if (bottom) {
        $chartWrapper.addClass('is-bottom');
        $('#instruct').fadeIn();
      } else {
        $chartWrapper.removeClass('is-bottom');
        $('#instruct').fadeOut();
      }
    }

    //SCROLLSTORY: fire function when scrollStory detects text box in focus
    var handleItemFocus = function(event, item) {    
          $('.trigger').eq(item.index).animate({opacity:1},500);
          //fire the animation on text after the text boxes have fully fade in
          setTimeout(function(){
            $('.trigger').eq(item.index).children('.background, .background-asia, .background-eu, .background-na, .background-large, .background-small').addClass("changeBackground");
          }, 500);
          step = item.data.step;    //"step" is the variable set in index.html
          //when scroll down, fire chart animation
          if(scrollDirection == 1){
              // console.log("item " + item.data.step + " in focus, draw");
              count++;
              steps[0][step].call();                
          }  
    } 

    //SCROLLSTORY: fire function when scrollStory detects text box is out of focus
    var handleItemBlur = function(event, item) {
        $('.trigger').eq(item.index).animate({opacity:0.1},500);
        var step2 = item.data.step;
        //when scroll down, do nothing; when scroll up, fire reverse animation
        if(scrollDirection == 1){} else {
            count--;
            steps[1][step2].call();
        } 
    }

    //SCROLLSTORY: scroll event
    var handleContainerScroll = function(event) {
    //detect scroll direction
        var st = $(document).scrollTop();
        if (st > lastScrollTop){
            scrollDirection = 1;
        } else {
            scrollDirection = 0;
        }
        lastScrollTop = st;

    // calculate the position of chart from page top
        var bottom = false
        var bb = $scrollerWrapper[0].getBoundingClientRect(),
            bottomFromTop = bb.bottom - viewportHeight,
            distance = bb.top - halfViewportHeight;

        bb = $scrollerWrapper[0].getBoundingClientRect();
        bottomFromTop = bb.bottom - viewportHeight;
      
    //fade in and fade out the chart
      if (bb.top < viewportHeight/2 && bb.top != 0) {
        if (chartSwitch == 0) {
            chartSwitch = 1;
        } 
        $chartWrapper.fadeIn(1000);
      } else {
        $chartWrapper.fadeOut(300);
      }
    }

    //SCROLLSTORY: call the scrollStory plugin and set the features to be used. Refer to ScrollStory documentation: http://sjwilliams.github.io/scrollstory/
    function scrollstory() {
      var $storywrapper = $('.scroller-wrapper')
      $storywrapper.scrollStory({
        contentSelector: '.trigger',
        triggerOffset: halfViewportHeight,
        itemfocus: handleItemFocus,
        containerscroll: handleContainerScroll,
        itemblur: handleItemBlur,
        scrollSensitivity: 10
      })
    }


    function callChart() {
      $('.chart-container').fadeOut(300);
      if ($('#chart-container-'+step).html() == ""){
        setTimeout(function(){
          makeCharts[step-1].call();  
        }, 300);
      } 
      $('#chart-container-'+ step).fadeIn(300);
    }

    function reverseChart() {
      $('.chart-container').fadeOut(300);
      $('#chart-container-'+ count).fadeIn(300);
    }

    //SCROLLSTORY: chart animation steps. steps[0][i] are sequential animations, steps[1][i] are reverse animations. Refer to highchart API: http://api.highcharts.com/highcharts/Chart.update
    var steps_null = [
        [
            function step0(){ 
              console.log("count = " + count + ", step = " + step);
            },
            function step1(){  
              callChart();
            },
            function step2(){   
              callChart();
            },
            function step3(){  
              callChart();
            },
            function step4(){ 
              callChart();
            },
            function step5(){ 
              callChart();
            },
            function step6(){ 
              callChart();
            },
            function step7(){ 
              callChart();
            },                        
            function step7(){ 
              callChart();
            },
        ],
        //reverse animations
        [   function reverse0(){
              reverseChart()
            },
            function reverse1(){  
              reverseChart()
            },
            function reverse2(){ 
              reverseChart()
            },
            function reverse3(){ 
              reverseChart()
            },
            function reverse4(){ 
              reverseChart() 
            },
            function reverse5(){ 
              reverseChart()  
            }, 
            function reverse6(){ 
              reverseChart()  
            },
            function reverse7(){ 
              reverseChart()  
            },      
            function reverse8(){ 
              reverseChart()  
            }, 
        ]
    ];

    //SCROLLSTORY: functions to make the animated chart
    var makeCharts = [
      function makeChart1 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart1 = new Highcharts.Chart({
              chart: {
                  height: chartHeight*0.8,
                  renderTo: 'chart-container-1',
                  type: 'line',
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              xAxis: {
                  categories: dataDate2,     
                  tickColor: '#ffffff',
              },
              yAxis: { 
                  title: {text: 'No. of submissions'},
                  min: 0,
                  max:610,  
                  endOnTick: false,    
              },
              credits: {enabled: false},
              legend: {enabled: false},
              tooltip: {enabled: false},
              plotOptions: {
                  series: {
                      dataLabels : {
                        enabled : true,
                        formatter: function() {
                          if (this.point.y == 607) {
                            return "607<br>entries";
                          }
                        },
                        style: {
                          fontSize: '18px',
                        },
                      },
                      lineWidth: 5,
                      pointPadding: 0,
                      groupPadding: 0,
                      borderWidth: 0,
                      shadow: false,
                      states: {
                        hover: {
                          brightness: 0.2,
                        }
                      },
                      animation: {duration: 4000},
                  },
                  line: {
                      marker: {
                          enabled: false
                      }
                  },
              },    
              series: [ 
                  {name: "chartDate", color:"#40c0f0", 
                  data: dataSub2,
                  },
              ],
          });
      },

      function makeChart2 () {
        $.getJSON('https://kuangkeng.github.io/dja2019/js/countries.json', function (dataCountryAll) {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart2 = new Highcharts.mapChart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-2',
                  map: 'custom/world'
              },
              title: {text: null,},
              subtitle: {enabled: false,},
              legend: {enabled: false},
              credits: {enabled: false},
              mapNavigation: {
                  enabled: false,
                  buttonOptions: {
                      verticalAlign: 'bottom'
                  }
              },
              series: [{
                  name: 'Countries',
                  color: '#E0E0E0',
                  enableMouseTracking: false
              }, {
                  type: 'mapbubble',
                  name: 'Submissions',
                  joinBy: ['iso-a2', 'code'],
                  data: dataCountryAll,
                  minSize: 6,
                  maxSize: '15%',
                  color: '#40c0f0',
                  tooltip: {
                      pointFormat: '{point.name}: {point.z}'
                  }
              },{
                  type: 'mapbubble',
                  data: [{
                    name: 'Hong Kong',
                    lat: 22.3964,
                    lon: 114.1095,
                    z: 24,
                  }],
                  minSize: 6,
                  maxSize: '15%',
                  color: '#40c0f0',
                }]     
          });
        });
      },

      function makeChart3 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart3 = new Highcharts.Chart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-3',
                  type: 'packedbubble',
              },
              title: {text: null,},
              subtitle: {enabled: false,},
              legend: {enabled: false},
              tooltip: {
                  useHTML: true,
                  pointFormat: '<b>{point.name}:</b> {point.value}'
              },
              credits: {enabled: false},
              plotOptions: {
                  packedbubble: {
                      minSize: '10%',
                      maxSize: '150%',
                      layoutAlgorithm: {
                          gravitationalConstant: 0.05,
                          splitSeries: true,
                          seriesInteraction: false,
                          dragBetweenSeries: true,
                          parentNodeLimit: true,
                          parentNodeOptions:{
                            bubblePadding: 15,
                          }
                      },
                      dataLabels: {
                          enabled: true,
                          formatter: function() {
                            if(this.point.y > 10){
                              return this.point.name;  
                            }
                          },
                          parentNodeFormat: '{point.series.name}',
                          style: {
                              color: 'black',
                              textOutline: 'none',
                              fontWeight: 'normal'
                          },
                      }
                  }
              },
              series: dataRegionAll,           
          });
      },

      function makeChart4 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart4 = new Highcharts.Chart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-4',
                  type: 'pie'
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              tooltip: {
                  useHTML: true,
                  pointFormat: 'Percentage: <b>{point.y}%</b><br>No. of submissions: <b>{point.submissions}</b>'
              },
              legend: {
                  enabled: false
              },
              credits: {enabled: false},
              plotOptions: {
                  pie: {
                      dataLabels: {
                          enabled: true,
                          format: '{point.title}<br><b>{point.y}%</b>',
                          distance: -50,
                          style: {
                              fontSize: '18px',
                          }
                      },
                      startAngle: -90,
                      endAngle: 90,
                      center: ['50%', '75%'],
                      size: '100%'
                  }
              },
              series: [{
                  type: 'pie',
                  name: 'Browser share',
                  innerSize: '50%',
                  data: dataSize1All,
              }]
          });
      },

      function makeChart5 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart6 = new Highcharts.Chart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-5',
                  type: 'bar'
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              tooltip: {
                  useHTML: true,
                  pointFormat: 'No. of submissions: <b>{point.y}</b>'
              },
              legend: {
                  enabled: false
              },
              credits: {enabled: false},
              xAxis: {
                  categories: dataCat2Name,   
              },
              yAxis: {
                  title: {
                    text: 'No. of submissions',
                    style: {
                      color: '#808080',
                      fontSize: '11px',
                    },  
                    x:-40,
                  },
                  endOnTick: false,

                  //MODIFY: set the minimum interval between unit of yAxis. Remove this line for Highcharts to decide based on width.    
                  minTickInterval:10,
              },            
              plotOptions: {
                  series:{
                      //MODIFY: adjust the space between bars
                      groupPadding: 0.05,
                      pointPadding: 0,
                      stickyTracking: false,

                      //MODIFY: Show/hide label on the data points. Default is hide.
                      dataLabels: {
                          enabled: true,
                          style: {
                              fontSize: '11px',
                          },
                          //MODIFY: Customize the data label. "point.y" is the data value. ",.1f" sets "," as thousand separator and sets the decimal point at zero. Refer to the syntax at Highcharts API under the topic "FORMAT STRINGS" (http://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting). Remove this line for Highcharts to auto-populate the label.
                          format: '{point.y}',
                      }
                  },
              }, 
              series: [ 
                  {
                    name:"Categories", 
                    color:"#40c0f0", 
                    data: dataCat2Data,
                  },
              ],
          });
      },

      function makeChart6 () {
        $.getJSON('https://kuangkeng.github.io/dja2019/js/countries-short.json', function (dataCountryShort) {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart7 = new Highcharts.mapChart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-6',
                  map: 'custom/world'
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              legend: {
                  enabled: false
              },
              credits: {enabled: false},
              mapNavigation: {
                  enabled: false,
                  buttonOptions: {
                      verticalAlign: 'bottom'
                  }
              },
              series: [{
                  name: 'CountriesShort',
                  color: '#E0E0E0',
                  enableMouseTracking: false
              }, {
                  type: 'mapbubble',
                  name: 'Shortlist',
                  joinBy: ['iso-a2', 'code'],
                  data: dataCountryShort,
                  minSize: 6,
                  maxSize: '15%',
                  color: '#40c0f0',
                  tooltip: {
                      pointFormat: '{point.name}: {point.z}'
                  }
              },{
                  type: 'mapbubble',
                  data: [{
                    name: 'Hong Kong',
                    lat: 22.3964,
                    lon: 114.1095,
                    z: 2,
                  }],
                  minSize: 6,
                  maxSize: '15%',
                  color: '#40c0f0',
                }]     
          });
        });
      },    

      function makeChart7 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart8 = new Highcharts.Chart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-7',
                  type: 'item',
                  marginRight: 0,
                  marginLeft: 0,
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              tooltip: {
                  useHTML: true,
                  pointFormat: 'No. of submissions: <b>{point.y}</b>'
              },
              legend: {
                  enabled: false,
              },
              credits: {enabled: false},
              series: [ 
                  {
                    name:"Regions", 
                    data: dataRegion2All,
                    dataLabels: {
                        enabled: true,
                        alignTo: 'connectors',
                        formatter: function() {
                          if (this.point.name == "South America") {
                            return "South<br>America";
                          } else if (this.point.name == "North America") {
                            return "North<br>America";
                          }
                          else {
                            return this.point.name;
                          }
                        },
                        style: {
                          fontSize: '12px',
                        },
                    },
                    center: ['50%', '70%'],
                    size: itemChartSize,
                    startAngle: -100,
                    endAngle: 100
                  },
              ],
          });
      },
      function makeChart8 () {
          Highcharts.setOptions({
              lang: {
                thousandsSep: ','
              }
          }),

          chart4 = new Highcharts.Chart({
              chart: {
                  height: chartHeight,
                  renderTo: 'chart-container-8',
                  type: 'packedbubble',
              },
              title: {
                  text: null,
              },
              subtitle: {
                  enabled: false,
              },
              tooltip: {
                  useHTML: true,
                  pointFormat: '<b>{point.organisation}, {point.country}</b><br>{point.title}<br>Newsroom size: {point.size}'
              },
              legend: {
                  enabled: false
              },
              credits: {enabled: false},
              plotOptions: {
                  series: {
                    marker: {
                      fillOpacity:1,
                    },
                  },
                  packedbubble: {
                      minSize: '10%',
                      maxSize: '50%',
                      layoutAlgorithm: {
                          bubblePadding: 5,
                          enableSimulation: true,
                          gravitationalConstant: 0.1,
                          splitSeries: true,
                          seriesInteraction: false,
                          parentNodeLimit: true,
                          parentNodeOptions:{
                            bubblePadding: 30,
                            gravitationalConstant: 0.05,
                            friction: -0.5,
                          },
                      },
                      dataLabels: {
                          enabled: true,
                          formatter: function() {return "";},
                          parentNodeFormat: '{point.series.name}',
                      },
                  }
              },
              series: shortCatAll,           
          });
      },
    ];
        
function addThousandSeparator(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$(document).ready(function(){
  init();
}); 