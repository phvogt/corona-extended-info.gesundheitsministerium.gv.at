// ==UserScript==
// @name         info.gesundheitsministerium.gv.at TrendPercent extended
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Show percents
// @author       Philipp
// @match        https://info.gesundheitsministerium.gv.at/
// @match        https://info.gesundheitsministerium.at/
// @grant        unsafeWindow
// ==/UserScript==

/*
Changelog:

0.8 number formatting (percentages), added margin, removed original chart
0.7 fixed new layout
0.6 dynamic legend and different markers
0.5 added interval to add diagram after reload

 */

var LOGPREFIX = "info.gesundheitsministerium.gv.at: ";

(function() {
    'use strict';

    var intervalId = 0;

    // add the custom trend graph
    function addCustomTrend() {

        var methodname = "addCustomTrend(): ";
//        console.log(LOGPREFIX + methodname + "start");

        var customTrendDiv = document.getElementById("customTrend");
        if (customTrendDiv) {
//            console.log(LOGPREFIX + methodname + "customTrendDiv exists");
            return;
        }

        var dpTrend = unsafeWindow.dpTrend;
        if (!dpTrend) {
//            console.log(LOGPREFIX + methodname + "no dpTrend!");
            return;
        }

        console.log(LOGPREFIX + methodname + "creating custom graph");

        var row = document.createElement("DIV");
        row.classList.add("row");
        var col = document.createElement("DIV");
        col.classList.add("col-lg-12");
        col.classList.add("col-md-12");
        col.classList.add("col-sm-12");
        col.classList.add("mb-4");
        col.style.marginTop = "0.3em";
        var diagram = document.createElement("DIV");
        diagram.setAttribute("id", "customTrend");
        diagram.style.minHeight = "400px";
        col.appendChild(diagram);
        row.appendChild(col);
        var rows = document.getElementsByClassName("container")[1];
        rows.insertBefore(row, rows.firstChild);

        var ps=[];
        var maxi = dpTrend.length;
        for (var i=0;i<maxi-1;i++) {
            var v1 = dpTrend[i].y;
            var v2 = dpTrend[i+1].y;
            var p = (v2/v1-1);
//            console.log(p);
            ps.push({"label" : dpTrend[i].label, "y":p, "x" : i+1});
        }

        var chart5 = new CanvasJS.Chart("customTrend", {
            animationEnabled: true,
            theme: "dark1",
            title: {
                text: "Nationaler Trend", fontFamily: "calibri", fontSize: 20, fontWeight: "normal"
            },
            axisY: [{
                title : "Steigerung",
                titleFontColor: "#4f81bc",
                labelFontColor: "#4f81bc",
                valueFormatString: "###%",
                includeZero: true,
                stripLines:[{
                    value: 10
                }]
            },{
                title : "Gesamt erkrankt",
                titleFontColor: "#c0504e",
                labelFontColor: "#c0504e",
                includeZero: true
            },{
                title : "Logarithmisch gesamt erkrankt",
                titleFontColor: "#9bbb58",
                labelFontColor: "#9bbb58",
                logarithmic: true
            }],
            data: [{
                type: "line",
                showInLegend: true,
                legendText: "Steigerung",
                markerType: "circle",
                axisYIndex: 0,
                yValueFormatString: "###.##%",
                lineColor: "#4f81bc",
                dataPoints: ps
            },{
                type: "line",
                showInLegend: true,
                legendText : "Gesamt erkrankt",
                markerType: "triangle",
                axisYIndex: 1,
                lineColor: "#c0504e",
                dataPoints: dpTrend
            },{
                type: "line",
                showInLegend: true,
                legendText : "Logarithmisch gesamt erkrankt",
                markerType: "square",
                axisYIndex: 2,
                lineColor: "#9bbb58",
                dataPoints: dpTrend
            }],
            legend: {
                cursor: "pointer",
                itemclick: function (e) {
                    //console.log("legend click: " + e.dataPointIndex);
                    //console.log(e);
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }

                    e.chart.render();
                }
            }
        });
        chart5.render();
        console.log(LOGPREFIX + methodname + "done");

        // remove original trend graph
        var origTrendChart = document.querySelector("body > main > div > div:nth-child(2) > div:nth-child(6)");
        if (origTrendChart != null) {
            origTrendChart.parentElement.removeChild(origTrendChart);
        }
    }

    // MAIN method
    var methodname = "main(): ";
    console.log(LOGPREFIX + methodname + "start");

    // call the function to add the custom trend graph
    intervalId = setInterval(addCustomTrend, 1000);

})();
