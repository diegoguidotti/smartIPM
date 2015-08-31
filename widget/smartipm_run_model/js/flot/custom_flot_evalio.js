var drag_message='';

function evalioPlot (id_pest, dt){

    drag_message=jQuery("#show_all_chart_"+id_pest).html();

    var i = 0;

    // insert checkboxes 
    var choiceContainer = $("#legend_"+id_pest);
    jQuery.each(dt, function(key, val) {
            val.color = i;
            ++i;
        
            choiceContainer.append("<br/><div class=\"evalio_elab_legend_box\" id=\"evalio_legend_"+id_pest+"_"+i+"\" style=\"background-color: red\">&nbsp;</div><input type='checkbox' name='" + key +
                    "' checked='checked' id='id" + key + "'></input>" +
                    "<label for='id" + key + "'>"
                    + val.label + "</label>");
    });

    choiceContainer.find("input").click(function() { plotAccordingToChoices(id_pest, dt)});

		jQuery("#chart_"+id_pest).bind("plotselected", function (event, ranges) {
        plotAccordingToChoices(id_pest, dt, ranges);
    });


		$("#chart_"+id_pest).bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                $("#tooltip").remove();
                var x = item.datapoint[0],
                    y = item.datapoint[1].toFixed(2);

                showTooltip(item.pageX, item.pageY, item.series.label + " "+formatDate(x)+" = " + y);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });

    plot=plotAccordingToChoices(id_pest, dt);
    console.log(plot);
    if(plot){
        var series = plot.getData();
        for (var i = 0; i < series.length; ++i){
            jQuery("#evalio_legend_"+id_pest+"_"+(i+1)).css("background-color",series[i].color);
        }
    }
    else{
        $("#chart_"+id_pest).html("No data");
        console.log(dt);
    }


}



function plotAccordingToChoices(id_pest, dt, ranges) {
    var data = [];
    var choiceContainer = jQuery("#legend_"+id_pest);

    var custom_opt=getEvalioOption();
    if(ranges){
        jQuery("#show_all_chart_"+id_pest).html('<div class="show_all_chart">Show all data</div>');

        jQuery("#show_all_chart_"+id_pest).click(function(){
            plotAccordingToChoices(id_pest, dt);
        });

        custom_opt=$.extend(true, {}, getEvalioOption(), {
            xaxis: {
                min: ranges.xaxis.from,
                max: ranges.xaxis.to
            }
        });
    }
    else{
        jQuery("#show_all_chart_"+id_pest).html(drag_message);
    }

    choiceContainer.find("input:checked").each(function () {
            var key = $(this).attr("name");
            if (key && dt[key]) {
                    data.push(dt[key]);
            }
    });

    var plot=null;
    if (data.length > 0) {
        plot=jQuery.plot("#chart_"+id_pest, data, custom_opt);
    }
    return plot;
}


function getEvalioOption(){
    return {
        series: {
                lines: {
                        show: true
                }
                ,
                points: {
                        show: true
                }
        },
        xaxis: {
                mode: "time"
        },
        selection: {
            mode: "x"
        },
        legend: {
            show: false
        },
        grid: {
                hoverable: true,
                clickable: true
        }
    };
}


function showTooltip(x, y, contents) {
    $("<div id='tooltip'>" + contents + "</div>").css({
        position: "absolute",
        display: "none",
        top: y + 5,
        left: x + 5,
        border: "1px solid #fdd",
        padding: "2px",
            "background-color": "#fee",
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}


function formatDate(x){
	var dt=new Date(x);

	var d =("0" + dt.getDate()).slice(-2);
	var m =  ("0" + (dt.getMonth() + 1)).slice(-2);
	var y = dt.getFullYear();
	
	return d+"-"+m+"-"+y;
}

