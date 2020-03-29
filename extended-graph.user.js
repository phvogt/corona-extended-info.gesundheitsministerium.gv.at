// ==UserScript==
// @name         info.gesundheitsministerium.gv.at TrendPercent extended
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show percents
// @author       Philipp
// @match        https://info.gesundheitsministerium.gv.at/
// @match        https://info.gesundheitsministerium.at/
// @grant        unsafeWindow
// ==/UserScript==

/*
Changelog:

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
        col.classList.add("col-lg-6");
        col.classList.add("col-md-12");
        col.classList.add("col-sm-12");
        col.style.marginTop = "0.3em";
        var diagram = document.createElement("DIV");
        diagram.setAttribute("id", "customTrend");
        diagram.style.minHeight = "400px";
        col.appendChild(diagram);
        row.appendChild(col);
        var rows = document.getElementsByClassName("container-fluid")[0];
        rows.insertBefore(row, rows.firstChild);

        var ps=[];
        var maxi = dpTrend.length;
        for (var i=0;i<maxi-1;i++) {
            var v1 = dpTrend[i].y;
            var v2 = dpTrend[i+1].y;
            var p= Math.trunc((v2/v1-1)*100);
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
                title : "Steigerung in %",
                titleFontColor: "#4f81bc",
                labelFontColor: "#4f81bc",
                includeZero: true,
                stripLines:[{
                    value: 10
                }]
            },{
                title : "gesamt erkrankt",
                titleFontColor: "#c0504e",
                labelFontColor: "#c0504e",
                includeZero: true
            },{
                title : "logarithmisch gesamt erkrankt",
                titleFontColor: "#9bbb58",
                labelFontColor: "#9bbb58",
                logarithmic: true
            }],
            data: [{
                type: "line",
                axisYIndex: 0,
                lineColor: "#4f81bc",
                dataPoints: ps
            },{
                type: "line",
                axisYIndex: 1,
                lineColor: "#c0504e",
                dataPoints: dpTrend
            },{
                type: "line",
                axisYIndex: 2,
                lineColor: "#9bbb58",
                dataPoints: dpTrend
            }]
        });
        chart5.render();
        console.log(LOGPREFIX + methodname + "done");
    }

    // MAIN method
    var methodname = "main(): ";
    console.log(LOGPREFIX + methodname + "start");

    // call the function to add the custom trend graph
    intervalId = setInterval(addCustomTrend, 1000);

})();
