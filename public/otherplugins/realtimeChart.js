var realObjects = new Array();
var animitTimeOut//画布重绘线程
var lineColors = new Array("#00ff00","#ff0046","#00FBFB","#FFFF00");
var freshTime = 5000;
var realtimeData = 1;
var isFirstTEST = false;
var rtcTimeout = "";
var addValueTimeout = "";
var fsdf = false; 
var getRealTimeData = function(){
	var condition = navTab.getCurrentPanel().find("#condition","#realTimeChart").val();
	//var data = '{"condition":"'+condition+'", "SYSTEMKEYNAME" : "'+GMS_SYSTEM_KEYNAME+'", "SYSTEMTELLERNO" : "'+GMS_SYSTEM_TELLERNO+'"}';
	var data = '{"condition":"'+condition+'", "SYSTEMKEYNAME" : "'+ gms_constants.getSystem_key_name()+'", "SYSTEMTELLERNO" : "'+gms_constants.getSystem_teller_node()+'"}';
	data = $.parseJSON(data);
	$.ajax({        
		global : false, 
        url : "getRealData",  
		type:"POST",
		dataType:"JSON",
		data : data,
//		data : "appGrpId="+monitor.common.AppGrpName,
        success : function(data) {
			if(!data) return;
			var chats = navTab.getCurrentPanel().find("#chart");
			if(data){
				var $divL = navTab.getCurrentPanel().find("#legend");
				var noLengend = false;
				if($divL.find("span[id^='smoothStatu']").length<1){
					noLengend = true;
					realObjects = new Array();
				}else{
//					当前视图数据
					realObjects = chats.data("realObjects");
				}
				realtimeData = data;
				var colorIndex = 0;//颜色数组下标
				$.each(data,function(i,item){
					var appInstName = i;
//						判断是否生成图例
					if(noLengend){
						var $lengend = $("<h3 class='smooth' ><div width = '15px' height='15px' style='background:"+lineColors[colorIndex]+"'>"+appInstName+" 当前状态：<span id = 'smoothStatu"+i+"'>"+item+"</span></h3>");
						$lengend.appendTo($divL);
						var realObject = {
								series:new TimeSeries(),
								name:i,
								color:lineColors[colorIndex],
								value:item,
						};
						colorIndex++;
						realObjects.push(realObject);
					}else{
//						修改值
						$.each(realObjects,function(i2,item2){
							if(item2.name==appInstName)
								item2.value = item;
						});
						//$divL.find("#smoothStatu"+i).html(item);
						$divL.find("span[id='smoothStatu" + i + "']").html(item);
					}
					//realtimeData = $divL.find("#smoothStatu"+i).html();
					realtimeData = $divL.find("span[id='smoothStatu" + i + "']")
				});
//					加载把数据绑定到当前chart或者改变当前chart上的数据
					chats.data("realObjects",realObjects);
				if(navTab.getCurrentPanel().find("#smoothSelected").length>0){
					freshTime = navTab.getCurrentPanel().find("#smoothSelected").val()*1000;
				}
			}
		},
		error: DWZ.ajaxError
	});
};
var chanegInterval = function(obj) {
	freshTime = $(obj).val()*1000;
};
var initRealTimeChart = function() {
	getRealTimeData();
	realtimeData = 1;
      // Add random data points at irregular intervals
      var maxYValue = 50;
	//fresh data on freshTime     
      var chageValueLoop = function() {
    	  clearTimeout(rtcTimeout);
    	  if($("#chart").length>0){
	    	  rtcTimeout = setTimeout(function(){
	    		  if(navTab.getCurrentPanel().find("#chart").length>0){
	    			  getRealTimeData();
	    		  }
	    		  chageValueLoop();
	    	  }, freshTime);
    	  }

      };
      var addValueLoop = function() {
    	  clearTimeout(addValueTimeout);
    	  if($("#chart").length>0){
	    	  addValueTimeout = setTimeout(function() {
	    		  realObjects = navTab.getCurrentPanel().find("#chart").data("realObjects");
	    		  if(typeof realObjects!="undefined")
	    		  $.each(realObjects,function(i,item){
	    			  item.series.append(new Date().getTime(), item.value);
	    		  });
	    		  addValueLoop();
	    	  }, 1000);
    	  }
      };
      chageValueLoop();
      addValueLoop();

      // A function for nicely rounding numbers up for human beings.
      // Eg: 180.2 -> 200
      //       3.5 -> 5
      //       8.9 -> 10
      var ln10 = Math.log(10);
      var roundUpHumane = function(value)
      {
        // calculate the magnitude of the value
        var mag = Math.floor(Math.log(value) / ln10);
        var magPow = Math.pow(10, mag);

        // calculate the most significant digit of the value
        var magMsd = Math.ceil(value / magPow);

        // promote the MSD to either 1, 2, or 5
        if (magMsd > 5.0)
          magMsd = 10.0;
        else if (magMsd > 2.0)
          magMsd = 5.0;
        else if (magMsd > 1.0)
          magMsd = 2.0;

        return magMsd * magPow;
      };

      var customYRangeFunction = function(range) {
        // Find the greatest absolute value
        var max = Math.max(Math.abs(range.min), Math.abs(range.max));
        // Ensure we're viewing at least a quarter of the range, so that
        // very small values don't appear exaggeratedly large
        max = Math.max(max, 50);
        // Round the limit up to a more pleasant number
        max = roundUpHumane(max);
        return {min: 0, max: max};
      };

      var sampleHorizontalLines = [
          {color:'#ffffff', lineWidth: 1, value: 0},
          {color:'#880000', lineWidth: 2, value: Math.round(maxYValue/3)},
          {color:'#880000', lineWidth: 2, value: Math.round(-maxYValue/3)}
      ];

//      var updateCode = function(canvas, chart) {
//        document.getElementById('html-code').textContent = '<canvas id="smoothie-chart" width="' + canvas.width + '" height="' + canvas.height + '">';
//
//        var chartOptions = difference(chart.options, SmoothieChart.defaultChartOptions);
//        var seriesOptionsJs = toJsCode(difference(chart.seriesSet[0].options, SmoothieChart.defaultSeriesPresentationOptions));
//
//        var js = "";
//
//        if (chart.options.timestampFormatter) {
//          chartOptions.timestampFormatter = "SmoothieChart.timeFormatter";
//        }
//
//        if (chart.options.yRangeFunction) {
//          chartOptions.yRangeFunction = "myYRangeFunction";
//          js += "function myYRangeFunction(range) {\n";
//          js += "  // TODO implement your calculation using range.min and range.max\n";
//          js += "  var min = ...;\n";
//          js += "  var max = ...;\n";
//          js += "  return {min: min, max: max};\n";
//          js += "}\n\n";
//        }
//
//        if (chart.options.horizontalLines && chart.options.horizontalLines.length) {
//          chartOptions.horizontalLines = chart.options.horizontalLines;
//        }
//
//        js += "var chart = new SmoothieChart(" + toJsCode(chartOptions) + "),\n";
//        js += "    canvas = document.getElementById('smoothie-chart'),\n";
//        js += "    series = new TimeSeries();\n\n";
//        js += "chart.addTimeSeries(series" + (seriesOptionsJs ? ', ' + seriesOptionsJs : '') + ");\n";
//        js += "chart.streamTo(canvas, " + chart.delay + ");";
//
//        js = js.replace("'SmoothieChart.timeFormatter'", 'SmoothieChart.timeFormatter')
//               .replace("'myYRangeFunction'", 'myYRangeFunction');
//
//        document.getElementById('javascript-code').textContent = js;
//      };

//      var toJsCode = function(obj) {
//        var code = JSON.stringify(obj).replace(/"([a-z0-9_]+)":/gi,'$1:').replace(/"/g, "'");
//        if (code === '{}') {
//          code = '';
//        }
//        return code;
//      };

      // returns values in a but not in b
//      var difference = function(a, b) {
//        var result = {};
//        for (var key in a)
//        {
//          if (!a.hasOwnProperty(key) || a[key] === b[key]) {
//            continue;
//          }
//
//          if (typeof(a[key]) === 'object') {
//            if (a[key] instanceof Array) {
//              // ignore arrays
//            } else {
//              var sub = difference(a[key], b[key]);
//              if (Object.keys(sub).length)
//                result[key] = sub;
//            }
//          } else {
//            result[key] = a[key];
//          }
//        }
//        return result;
//      };

      function onLoad() {
        var chart = new SmoothieChart({maxValue:100,minValue:0,timestampFormatter:SmoothieChart.timeFormatter});
        var milli = new Date().getTime(); 
        var canvas;
//        navTab.getCurrentPanel().find("#chart").attr("id","chart"+milli);
//        canvas = navTab.getCurrentPanel().find("#chart"+milli).get(0);
        canvas = navTab.getCurrentPanel().find("#chart").get(0);
        $.each(realObjects,function(i,item){
        	 chart.addTimeSeries(item.series, { strokeStyle: item.color, lineWidth: 2 });
		  });
        chart.streamTo(canvas, 1000);

        //updateCode(canvas, chart);
        var controlContainer;
        controlContainer = navTab.getCurrentPanel().find("#controls").get(0);
        inputIdCounter = 0;

        var setVisible = function(element, isVisible) {
          element.style.display = isVisible ? '' : 'none';
        };

        var startControlSection = function(name) {
          var controlDiv = document.createElement('h3');
          controlDiv.textContent = name;
          controlContainer.appendChild(controlDiv);
        };

        var bindRange = function(options) {
          var inputId = 'input' + (inputIdCounter++),
              scale = options.scale || 1,
              defaultLink;

          var controlDiv = document.createElement('div');
          controlDiv.className = 'control';
          controlContainer.appendChild(controlDiv);

          var label = document.createElement('label');
          label.className = 'slider';
          label.htmlFor = inputId;
          label.textContent = options.name;
          controlDiv.appendChild(label);

          var slider = document.createElement('input');
          slider.id = inputId;
          slider.type = 'range';
          slider.min = options.min * scale;
          slider.max = options.max * scale;
          if (options.step) {
            slider.step = options.step * scale;
          }
          var defaultValue = options.target[options.propertyName];
          slider.value = defaultValue * scale;
          slider.onchange = function() {
            options.target[options.propertyName] = parseInt(slider.value) / scale;
            setVisible(defaultLink, slider.value != defaultValue);
            //updateCode(canvas, chart);
          };
          controlDiv.appendChild(slider);

          defaultLink = document.createElement('a');
          defaultLink.href = '#';
          defaultLink.className = 'default';
          defaultLink.textContent = 'default';
          defaultLink.onclick = function() {
            slider.value = defaultValue * scale;
            slider.onchange();
            return false;
          };
          setVisible(defaultLink, slider.value != defaultValue);
          controlDiv.appendChild(defaultLink);
        };

        var bindCheckBox = function(options) {
          var inputId = 'input' + (inputIdCounter++),
              defaultLink;

          var controlDiv = document.createElement('div');
          controlDiv.className = 'control';
          controlContainer.appendChild(controlDiv);

          var checkbox = document.createElement('input');
          checkbox.id = inputId;
          checkbox.type = 'checkbox';
          var defaultValue = options.convertBack
              ? options.convertBack(options.target[options.propertyName])
              : !!options.target[options.propertyName];
          checkbox.checked = defaultValue;
          checkbox.onchange = function() {
            options.target[options.propertyName] = options.convert
                ? options.convert(checkbox.checked)
                : !!checkbox.checked;
            //updateCode(canvas, chart);
            setVisible(defaultLink, checkbox.checked !== defaultValue);
          };
          controlDiv.appendChild(checkbox);

          var label = document.createElement('label');
          label.className = 'checkbox';
          label.htmlFor = inputId;
          label.textContent = options.name;
          controlDiv.appendChild(label);

          defaultLink = document.createElement('a');
          defaultLink.href = '#';
          defaultLink.className = 'default';
          defaultLink.textContent = 'default';
          setVisible(defaultLink, checkbox.checked !== defaultValue);
          defaultLink.onclick = function() {
            checkbox.checked = defaultValue;
            checkbox.onchange();
            return false;
          };
          controlDiv.appendChild(defaultLink);
        };

        var bindColor = function(options) {
          var inputId = 'input' + (inputIdCounter++),
              defaultValue = options.target[options.propertyName] || '#000000',
              colorString = defaultValue,
              defaultEnabled = options.optional ? options.enabled : true,
              enabled = defaultEnabled,
              enabledCheckbox,
              defaultLink,
              defaultOpacity = typeof(options.opacity) === 'undefined' ? 1 : options.opacity,
              opacity = defaultOpacity,
              opacitySlider,
              update = function() {
                if (!enabled) {
                  if (options.emptyValue)
                    options.target[options.propertyName] = options.emptyValue;
                  else
                    delete options.target[options.propertyName];
                } else if (opacity === 0) {
                  options.target[options.propertyName] = 'transparent';
                } else if (opacity !== 1) {
                  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorString);
                  options.target[options.propertyName] = 'rgba('+parseInt(result[1],16)+','+parseInt(result[2],16)+','+parseInt(result[3],16)+','+opacity.toFixed(2)+')';
                } else {
                  options.target[options.propertyName] = colorString;
                }
                setVisible(defaultLink, enabled != defaultEnabled || opacity !== defaultOpacity || (defaultValue && colorString !== defaultValue));
                //updateCode(canvas, chart);
              };

          var controlDiv = document.createElement('div');
          controlDiv.className = 'control';

          var label = document.createElement('label');
          label.className = 'color';
          label.htmlFor = inputId;
          label.textContent = options.name;
          controlDiv.appendChild(label);

          controlContainer.appendChild(controlDiv);
          var colorInput = document.createElement('input');
          colorInput.id = inputId;
          colorInput.type = 'color';
          colorInput.value = defaultValue;
          colorString = colorInput.value;
          colorInput.onchange = function() {
            colorString = colorInput.value;
            update();
          };
          controlDiv.appendChild(colorInput);

          if (typeof(options.opacity) !== 'undefined') {
            opacitySlider = document.createElement('input');
            opacitySlider.id = inputId + '-opacity';
            opacitySlider.className = 'opacity';
            opacitySlider.title = 'Opacity';
            opacitySlider.type = 'range';
            opacitySlider.min = 0;
            opacitySlider.max = 100;
            opacitySlider.value = defaultOpacity * 100;
            opacitySlider.onchange = function () {
              opacity = opacitySlider.value / 100;
              update();
            };
            controlDiv.appendChild(opacitySlider);
          }

          if (options.optional) {
            enabledCheckbox = document.createElement('input');
            enabledCheckbox.id = inputId+'-enabled';
            enabledCheckbox.type = 'checkbox';
            enabledCheckbox.checked = defaultEnabled;
            enabledCheckbox.onchange = function() {
              enabled = enabledCheckbox.checked;
              update();
            };
            controlDiv.appendChild(enabledCheckbox);

            var enabledLabel = document.createElement('label');
            enabledLabel.className = 'checkbox';
            enabledLabel.htmlFor = enabledCheckbox.id;
            enabledLabel.textContent = '显示';
            controlDiv.appendChild(enabledLabel);
          }

          defaultLink = document.createElement('a');
          defaultLink.href = '#';
          defaultLink.className = 'default';
          defaultLink.textContent = 'default';
          defaultLink.onclick = function() {
            colorString = colorInput.value = defaultValue;
            opacity = defaultOpacity;
            if (opacitySlider) {
              opacitySlider.value = defaultOpacity * 100;
            }
            if (enabledCheckbox) {
              enabledCheckbox.checked = defaultEnabled;
            }
            enabled = defaultEnabled;
            update();
            return false;
          };
          controlDiv.appendChild(defaultLink);
          update();
        };

        // General
        //startControlSection('General');
        //bindColor({target: chart.options.grid, name: 'Background color', propertyName: 'fillStyle', opacity: 1});
        bindRange({target: chart.options, name: '速度', propertyName: 'millisPerPixel', min: 1, max: 100});
        bindRange({target: canvas, name: '高度', propertyName: 'height', min: 20, max: 400});
        bindRange({target: canvas, name: '宽度', propertyName: 'width', min: 20, max: 1000});
        bindRange({target: chart, name: '延迟', propertyName: 'delay', min: 0, max: 2000});

        // Series
       // startControlSection('Series');
//        bindColor({target: chart.seriesSet[0].options, name: '线条样式', propertyName: 'strokeStyle', optional: true, enabled: true, opacity: 1, emptyValue: 'none'});
//        bindColor({target: chart.seriesSet[0].options, name: '填充区域样式', propertyName: 'fillStyle', optional: true, enabled: false, opacity: 0.3});
       // bindRange({target: chart.seriesSet[0].options, name: 'Series line width', propertyName: 'lineWidth', min: 0.5, max: 5, scale: 10});
       // bindCheckBox({
         // target: chart.options,
         // name: 'Smooth series lines',
         // propertyName: 'interpolation',
        //  convert: function (checked) {
         //   return checked ? 'bezier' : 'linear';
        //  },
        //  convertBack: function (value) {
        //    return value !== 'linear';
        //  }
      //  });

        // Grid lines
       // startControlSection('Grid Lines');
      //  bindColor({target: chart.options.grid, name: 'Grid line color', propertyName: 'strokeStyle', opacity: 1});
        bindRange({target: chart.options.grid, name: '垂直剖面', propertyName: 'verticalSections', min: 0, max: 20});
        bindRange({target: chart.options.grid, name: '时间轴间距', propertyName: 'millisPerLine', min: 1000, max: 10000, step: 1000});
       // bindCheckBox({target: chart.options.grid, name: 'Sharp grid lines', propertyName: 'sharpLines'});
       // bindCheckBox({target: chart.options.grid, name: 'Draw border', propertyName: 'borderVisible'});

        // Labels
      //  startControlSection('Labels');
      //  bindColor({target: chart.options.labels, name: 'Label text color', propertyName: 'fillStyle', opacity: 1});
        //bindCheckBox({
        //  target: chart.options.labels,
        //  name: 'Show max/min labels',
        //  propertyName: 'disabled',
        //  convert: function (checked) {
        //    return !checked;
        //  },
        //  convertBack: function (value) {
         //   return !value;
       //   }
       // });
      //  bindRange({target: chart.options.labels, name: 'Font size', propertyName: 'fontSize', min: 1, max: 20});
      //  bindRange({target: chart.options.labels, name: 'Label precision', propertyName: 'precision', min: 0, max: 6});
        bindCheckBox({
          target: chart.options,
          name: '显示时间戳',
          propertyName: 'timestampFormatter',
          convert: function (checked) {
            return checked ? SmoothieChart.timeFormatter : undefined;
          }
        });

        // Y-scaling
      // startControlSection('Y-scaling');
       // bindCheckBox({
       //   target: chart.options,
       //   name: 'Fix maximum value',
       //   propertyName: 'maxValue',
       //   convert: function (checked) {
       //     return checked ? maxYValue : undefined;
       //   }
      //  });
       // bindCheckBox({
        //  target: chart.options,
        //  name: 'Fix minimum value',
        //  propertyName: 'minValue',
        //  convert: function (checked) {
        //    return checked ? -maxYValue : undefined;
        //  }
      //  });
      //  bindRange({target: chart.options, name: 'Max-value scale', propertyName: 'maxValueScale', min: 0.8, max: 1.5, scale: 100});
     //   bindRange({target: chart.options, name: 'Scale adjust speed', propertyName: 'scaleSmoothing', min: .01, max: 1, scale: 1000});
        bindCheckBox({
          target: chart.options,
          name: '固定y值',
          propertyName: 'yRangeFunction',
          convert: function (checked) {
            return checked ? customYRangeFunction : undefined;
          }
        });

        // Misc
        bindCheckBox({
          target: chart.options,
          name: '显示y值线',
          propertyName: 'horizontalLines',
          convert: function (checked) {
            return checked ? sampleHorizontalLines : [];
          },
          convertBack: function (value) {
            return value && !!value.length;
          }
        });
      }
      	$(function() {
      		setTimeout(function() {onLoad();},500);
      	})
      }
