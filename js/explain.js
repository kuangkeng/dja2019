
//CODE FOR SCROLLSTORY STARTS HERE
// check viewport dimensions and use them to set the text box margin and chart height and width
var $scrollerWrapper = $('.scroller-wrapper'),
    $chartWrapper = $('.chart-wrapper');

var viewportHeight = $(window).height(),
    halfViewportHeight = Math.floor(viewportHeight / 2),
    twoThirdViewportHeight = Math.floor(viewportHeight / 3 * 2),
    bottomSpace = 0, //use this to set the bottom margin of the chart 
    chartWidth = $('.wrapper').width()-22,
    chartMargin = 0 - (chartWidth/2), //use this to center align the chart when it's position is set as fixed
    chartHeight = Math.floor(viewportHeight*0.8),
    headlineHeight = $('.headline').outerHeight( true);

    console.log("viewportHeight = " + viewportHeight)

$chartWrapper.css({'width':chartWidth, 'margin-left':chartMargin, 'height':chartHeight, 'bottom':bottomSpace});
$('.trigger').css({'margin-bottom':viewportHeight});
$('#pageMobileMenu').css({height:viewportHeight});
$('.mobileMenuBox').css({height:viewportHeight*0.8-headlineHeight});
$('.mobileAvatar').css({'max-height':viewportHeight});

var chartDate;
var mapEntries;
var bubbleRegion;
var bubbleCat;
var chartSize1;
var chartCat;
var mapShort;
var itemCat;

//count and step are used to check if any chart animation step has been skipped
var count = 0,
    step = 0,
    chartSwitch = 0,
    lastScrollTop = 0,
    scrollDirection = 0; 

//CODE FOR SCROLLSTORY ENDS HERE

var selectedData,
    selectedSeat, 
    selectedVoter, 
    selectedKod, 
    oppData,
    oppSeat, 
    oppVoter, 
    oppKod, 
    difVoter,
    perVoter,
    halfround,
    voteWeight,
    voteWeight2,
    result,
    result_text,
    indexUser,
    indexOpp;

var dataDate = [],
    dataDate2 = [],
    dataSub = [],
    dataSub2 = [],
    dataCat2Name = [],
    dataCat2Data = [],
    dataBN = [],
    dataBN2 = [],
    dataOPP = [],
    dataRural = [],
    dataRural2 = [],
    dataUrban = [],
    dataUrban2 = [],
    dataPassed =[];

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

console.log("dataCat2Name = " + dataCat2Name);
console.log("dataCat2Data = " + dataCat2Data);

// makechartDate();
// makemapEntries();
// makebubbleRegion();
// makebubbleCat ();
// makechartSize1 ();
// makechartCat ();
// makemapShort ();
makeitemCat ();


for (i = 0; i < dataAll.length; i++) { 
    var partyFull = dataAll[i].party;
    var party = partyFull.substring(0, 2);
    if (party == "BN"){ 
      dataBN.push(dataAll[i].y);
      dataOPP.push(0);
    } else {
      dataBN.push(0);
      dataOPP.push(dataAll[i].y);
    }
    if (dataAll[i].kelas == "Rural"){
      dataRural.push(dataAll[i].y);
    } else {
      dataRural.push(0);
    }
    if (dataAll[i].kelas == "Urban"){
      dataUrban.push(dataAll[i].y);
    } else {
      dataUrban.push(0);
    }   
}

dataBN2 = JSON.parse(JSON.stringify(dataBN));
dataRural2 = JSON.parse(JSON.stringify(dataRural));
dataUrban2 = JSON.parse(JSON.stringify(dataUrban));

    function init() {      
      steps = steps_null;
      // setTimeout(scrollstory,500);
    }

    //Function to clear the chart for repeat play
    function clearChart(){
      var seriesLength = chart.series.length;
      for(var i = seriesLength - 1; i > -1; i--) {
          chart.series[i].remove();
      }
      chartSwitch = 0;
      $('#btnWhy').attr('disabled',true);
      count = 0;
      step = 0;   
      dataAll2 = JSON.parse(JSON.stringify(dataAll));
    }
  
    function matchSeat(){
      selectedData = jQuery.grep(dataAll, function (n, i) {
        return (n.kod == dataPassed[0]);
      },false);
      selectedVoter = selectedData[0].y;
      selectedSeat = selectedData[0].seat;
      oppData = jQuery.grep(dataAll, function (n, i) {
        return (n.kod == dataPassed[1]);
      },false);
      oppVoter = oppData[0].y;
      oppSeat = oppData[0].seat;
    }

    function compareSeat(){
      //Match the user's and opponent's seats in the small to big constituencies list
      var indexesUser = $.map(dataAll, function(obj, index) {
          if(obj.seat == selectedSeat) {
              return index;
          }
      });
      indexUser = indexesUser[0];
      // console.log("indexUser = " + indexUser);
      
      var indexesOpp = $.map(dataAll, function(obj, index) {
          if(obj.seat == oppSeat) {
              return index;
          }
      });
      indexOpp = indexesOpp[0];
      // console.log("indexOpp = " + indexOpp);
    }

    //Function to check if a number is integer
    function isInt(value) {
      return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
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
            $('.trigger').eq(item.index).children('.background, .backgroundBN, .backgroundOPP').addClass("changeBackground");
            $('.trigger').eq(item.index).children('.font, .fontBN, .fontOPP').addClass("changeFont");
          }, 500);

          //when reverse scroll text boxes that don't fire chart animation, need to minus the step value
          if(item.data.step == "none"){ 
            if(scrollDirection == 0){step--;}
          } 
          else {
            step = item.data.step;    //"step" is the variable set in index.html
            //when scroll down, fire chart animation
            if(scrollDirection == 1){
                // console.log("item " + item.data.step + " in focus, draw");
                count++;
                steps[0][step].call();

                //check if any animation step has been skipped and show the error box
                if(count != step){  
                    // console.log("count is smaller than step");
                    // console.log("count = " + count + ", step = " + step);
                    $('#chart-container').hide();
                    $('#errorBox').show();
                }                 
            }
          }
    } 

    //SCROLLSTORY: fire function when scrollStory detects text box is out of focus
    var handleItemBlur = function(event, item) {
        $('.trigger').eq(item.index).animate({opacity:0.1},500);
        if(item.data.step == "none"){} 
        else {
            var step2 = item.data.step;
            //when scroll down, do nothing; when scroll up, fire reverse animation
            if(scrollDirection == 1){} else {
                count--;
                // console.log("item " + item.data.step + " out of focus, reverse");
                steps[1][step2].call();

                //check if any animation step has been skipped and show the error box
                if(count != step2-1){  
                    $('#chart-container').hide();
                    $('#errorBox').show();
                } 
            } 
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
            makechart();
            chartSwitch = 1;
        } 
        $chartWrapper.fadeIn(1000);
      } else {
        $chartWrapper.fadeOut(300);
      }

    //fix the position of chart when scroll to the last animation
      if (bb.top < halfViewportHeight && bottomFromTop > 0) {
        bottom = false
      } else if (bb.top < 0 && bottomFromTop < 0) {
        bottom = true
      }
      toggle(bottom)
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

    //SCROLLSTORY: chart animation steps. steps[0][i] are sequential animations, steps[1][i] are reverse animations. Refer to highchart API: http://api.highcharts.com/highcharts/Chart.update
    var steps_null = [
        [
            function step0(){ 
                chart.addSeries({
                    name: "noColor", 
                    id: "noColor",
                    data :dataVoter2,
                });
            },
            function step1(){  
                chart.get("noColor").points[40].update({
                    color: colorBN,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Langkawi<br>37,632 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[98].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Bukit Bintang<br>52,753 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[169].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Bandar Kuching<br>81,037 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
            },
            function step2(){   
                chart.get("noColor").points[0].update({
                    color: colorBN,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Putrajaya<br>17,925 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[221].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Kapar<br>146,625 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.yAxis[0].addPlotLine({
                    value: averageNat, 
                    color: '#a8a8a8',
                    dashStyle: 'shortdash',
                    width: 2,
                    zIndex: 4,
                    label: {
                      text: 'National<br>average<br>61,103',
                      align: 'left',
                      rotation: 0,
                      style: {
                          color: '#939393',
                          fontSize: 12,
                      },
                    },
                    id: 'plotline-national'
                });        
            },
            function step3(){  
                chart.get("noColor").points[40].update({
                  dataLabels: {enabled: false}
                });  
                chart.get("noColor").points[98].update({
                  dataLabels: {enabled: false}
                }); 
                chart.get("noColor").points[169].update({
                  dataLabels: {enabled: false}
                });    
                chart.get("noColor").points[0].update({
                  dataLabels: {enabled: false}
                });
                chart.get("noColor").points[221].update({
                  dataLabels: {enabled: false}
                });             
                chart.get("noColor").remove();
                chart.addSeries({
                    name: "allColors", 
                    id: "allColors",
                    data :dataAll2
                });
                chart.get("allColors").setData(dataBN2);                  
                chart.yAxis[0].removePlotLine('plotline-national');
                chart.yAxis[0].addPlotLine({
                  value: averageBN, 
                  color: '#a8a8a8',
                  dashStyle: 'shortdash',
                  width: 2,
                  zIndex: 4,
                  label: {
                    text: 'BN<br>average<br>48,273',
                    align: 'left',
                    rotation: 0,
                    style: {
                        color: '#939393',
                        fontSize: 12,
                    },
                  },
                  id: 'plotline-BN'
                });                
            },
            function step4(){ 
                chart.get("allColors").setData(dataVoter2);            
                chart.yAxis[0].addPlotLine({
                  value: averageOPP, 
                  color: '#a8a8a8',
                  dashStyle: 'shortdash',
                  width: 2,
                  zIndex: 4,
                  label: {
                    text: 'OPP<br>average<br>79,921',
                    align: 'left',
                    rotation: 0,
                    style: {
                        color: '#939393',
                        fontSize: 12,
                    },
                  },
                  id: 'plotline-OPP'
                });
            },
            function step5(){ 
                chart.get("allColors").setData(dataRural2);
            },
            function step6(){ 
                chart.get("allColors").setData(dataUrban2);
            },
            function step7(){ 
                chart.get("allColors").setData(dataVoter2);
            },                        
        ],
        //reverse animations
        [   function reverse0(){},
            function reverse1(){  
                chart.get("noColor").points[40].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });  
                chart.get("noColor").points[98].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                }); 
                chart.get("noColor").points[169].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });   
            },
            function reverse2(){ 
                chart.get("noColor").points[0].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });
                chart.get("noColor").points[221].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });   
                chart.yAxis[0].removePlotLine('plotline-national');
            },
            function reverse3(){ 
                chart.get("allColors").remove();
                chart.addSeries({
                    color:"#d3d3d3",
                    name: "noColor", 
                    id: "noColor",
                    data :dataVoter2,
                });
                chart.yAxis[0].removePlotLine('plotline-BN');
                chart.yAxis[0].addPlotLine({
                    value: averageNat, 
                    color: '#a8a8a8',
                    dashStyle: 'shortdash',
                    width: 2,
                    zIndex: 4,
                    label: {
                      text: 'National<br>average<br>61,103',
                      align: 'left',
                      rotation: 0,
                      style: {
                          color: '#939393',
                          fontSize: 12,
                      },
                    },
                    id: 'plotline-national'
                });
                chart.get("noColor").points[40].update({
                    color: colorBN,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Langkawi<br>37,632 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[98].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Bukit Bintang<br>52,753 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[169].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Bandar Kuching<br>81,037 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[0].update({
                    color: colorBN,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Putrajaya<br>17,925 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("noColor").points[221].update({
                    color: colorOPP,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Kapar<br>146,625 voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
            },
            function reverse4(){ 
                chart.get("allColors").setData(dataBN2);
                chart.yAxis[0].removePlotLine('plotline-OPP');
            },
            function reverse5(){ 
                chart.get("allColors").setData(dataVoter2); 
            }, 
            function reverse6(){ 
                chart.get("allColors").setData(dataRural2);
            },
            function reverse7(){ 
                chart.get("allColors").setData(dataUrban2);
            },      
        ]
    ];

    var steps_num = [
        [
            function step0(){ 
                chart.addSeries({
                    name: "noColor", 
                    id: "noColor",
                    data :dataVoter2,
                });
            },
            function step1(){  
                chart.get("noColor").points[indexUser].update({
                    color: colorUser,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Your seat:<br>' + selectedSeat + '<br>' + addThousandSeparator(selectedVoter) + ' voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
            },
            function step2(){
                chart.get("noColor").points[indexUser].update({
                  dataLabels: {enabled: false}
                });    
                chart.get("noColor").points[indexOpp].update({
                    color: colorOpponent,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: "Opponent's seat:<br>" + oppSeat + "<br>" + addThousandSeparator(oppVoter) + " voters",
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.yAxis[0].addPlotLine({
                    value: averageNat, 
                    color: '#a8a8a8',
                    dashStyle: 'shortdash',
                    width: 2,
                    zIndex: 4,
                    label: {
                      text: 'National<br>average<br>61,103',
                      align: 'left',
                      rotation: 0,
                      style: {
                          color: '#939393',
                          fontSize: 12,
                      },
                    },
                    id: 'plotline-national'
                });        
            },
            function step3(){                 
                chart.get("noColor").points[indexOpp].update({
                  color: "#d3d3d3",
                  dataLabels: {enabled: false},
                });    
                chart.get("noColor").points[indexUser].update({
                  color: "#d3d3d3",
                });  
                chart.get("noColor").remove();
                chart.addSeries({
                    name: "allColors", 
                    id: "allColors",
                    data :dataAll2
                });
                chart.get("allColors").setData(dataBN2);
                chart.get("allColors").points[indexUser].update({
                    color: colorUser,
                });           
                chart.get("allColors").points[indexOpp].update({
                    color: colorOpponent,
                });         
                chart.yAxis[0].removePlotLine('plotline-national');
                chart.yAxis[0].addPlotLine({
                  value: averageBN, 
                  color: '#a8a8a8',
                  dashStyle: 'shortdash',
                  width: 2,
                  zIndex: 4,
                  label: {
                    text: 'BN<br>average<br>48,273',
                    align: 'left',
                    rotation: 0,
                    style: {
                        color: '#939393',
                        fontSize: 12,
                    },
                  },
                  id: 'plotline-BN'
                });                
            },
            function step4(){ 
                chart.get("allColors").setData(dataVoter2);
                chart.get("allColors").points[indexUser].update({
                    color: colorUser,
                });           
                chart.get("allColors").points[indexOpp].update({
                    color: colorOpponent,
                }); 
                chart.yAxis[0].addPlotLine({
                  value: averageOPP, 
                  color: '#a8a8a8',
                  dashStyle: 'shortdash',
                  width: 2,
                  zIndex: 4,
                  label: {
                    text: 'OPP<br>average<br>79,921',
                    align: 'left',
                    rotation: 0,
                    style: {
                        color: '#939393',
                        fontSize: 12,
                    },
                  },
                  id: 'plotline-OPP'
                });
            },
            function step5(){ 
                chart.get("allColors").setData(dataRural2);
            },
            function step6(){ 
                chart.get("allColors").setData(dataUrban2);
            },
            function step7(){ 
                chart.get("allColors").setData(dataVoter2);
                chart.get("allColors").points[indexUser].update({
                    color: colorUser,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'You',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.get("allColors").points[indexOpp].update({
                    color: colorOpponent,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Opponent',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
            },                        
        ],
        //reverse animations
        [   function reverse0(){},
            function reverse1(){  
                chart.get("noColor").points[indexUser].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });    
            },
            function reverse2(){ 
                chart.get("noColor").points[indexOpp].update({
                  color:"#d3d3d3",
                  dataLabels: {enabled: false}
                });   
                chart.get("noColor").points[indexUser].update({
                    color: colorUser,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: 'Your seat:<br>' + selectedSeat + '<br>' + addThousandSeparator(selectedVoter) + ' voters',
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
                chart.yAxis[0].removePlotLine('plotline-national');
            },
            function reverse3(){ 
                chart.get("allColors").remove();
                chart.addSeries({
                    color:"#d3d3d3",
                    name: "noColor", 
                    id: "noColor",
                    data :dataVoter2,
                });
                chart.yAxis[0].removePlotLine('plotline-BN');
                chart.yAxis[0].addPlotLine({
                    value: averageNat, 
                    color: '#a8a8a8',
                    dashStyle: 'shortdash',
                    width: 2,
                    zIndex: 4,
                    label: {
                      text: 'National<br>average<br>61,103',
                      align: 'left',
                      rotation: 0,
                      style: {
                          color: '#939393',
                          fontSize: 12,
                      },
                    },
                    id: 'plotline-national'
                });
                chart.get("noColor").points[indexOpp].update({
                    color: colorOpponent,
                    dataLabels: {
                      enabled: true,
                      allowOverlap: true,
                      padding: 0,
                      color: '#7e7e7e',
                      format: "Opponent's seat:<br>" + oppSeat + "<br>" + addThousandSeparator(oppVoter) + " voters",
                      align: 'left',
                      zIndex: 5,
                      style: {fontSize: '12px'},
                    }
                });
            },
            function reverse4(){ 
                chart.get("allColors").setData(dataBN2);
                chart.yAxis[0].removePlotLine('plotline-OPP');
            },
            function reverse5(){ 
                chart.get("allColors").setData(dataVoter2); 
                chart.get("allColors").points[indexUser].update({
                    color: colorUser,
                });           
                chart.get("allColors").points[indexOpp].update({
                    color: colorOpponent,
                });
            }, 
            function reverse6(){ 
                chart.get("allColors").setData(dataRural2);
            },
            function reverse7(){ 
                chart.get("allColors").setData(dataUrban2);
                chart.get("allColors").points[indexUser].update({dataLabels: {enabled: false}});
                chart.get("allColors").points[indexOpp].update({dataLabels: {enabled: false}});
            },      
        ]
    ];

    //SCROLLSTORY: functions to make the animated chart
    function makechartDate () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        chartDate = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
    };

    function makemapEntries () {
      $.getJSON('js/countries.json', function (dataCountryAll) {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        mapEntries = new Highcharts.mapChart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
    }

    function makebubbleRegion () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        bubbleRegion = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                    minSize: '10%',
                    maxSize: '150%',
                    layoutAlgorithm: {
                        gravitationalConstant: 0.05,
                        splitSeries: true,
                        seriesInteraction: false,
                        dragBetweenSeries: true,
                        parentNodeLimit: true
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 10
                        },
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: dataRegionAll,           
        });
    };

    function makebubbleCat () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        bubbleCat = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
    };

    function makechartSize1 () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        chartSize1 = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
                    size: '110%'
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: dataSize1All,
            }]
        });
    };

    function makechartCat () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        chartCat = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
    };

    function makemapShort () {
      $.getJSON('js/countries-short.json', function (dataCountryShort) {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        mapShort = new Highcharts.mapChart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
    }    

    function makeitemCat () {
        Highcharts.setOptions({
            lang: {
              thousandsSep: ','
            }
        }),

        itemCat = new Highcharts.Chart({
            chart: {
                height: chartHeight,
                renderTo: 'chart-container',
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
                enabled: false
            },
            credits: {enabled: false},
            series: [ 
                {
                  name:"Regions", 
                  data: dataRegion2All,
                  dataLabels: {
                      enabled: true,
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
                        fontSize: '14px',
                      },
                  },
                  center: ['47%', '50%'],
                  size: '100%',
                  startAngle: -100,
                  endAngle: 100
                },
            ],
        });
    };

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