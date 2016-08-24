/**
 * Guardian visuals interactive project
 *
 * ./utils/analytics.js - Add Google analytics
 * ./utils/detect.js	- Device and env detection
 */

var getJSON = require('./utils/getjson');
var template = require('./html/base.html');
var mapTemplate = require('./html/map-template.html');
var constituencyQuoteBlockTemplate = require('./html/constituency-quote-block.html');
var shareTemplate = require('./html/share.html');
var $ = require('jquery');
var u = require('underscore');

var dataset = null;
var currentDataset;
var shareMessage = "The Guardian - The Corbyn effect: who are the thousands of new Labour members?";

function doStuff(data, el) {
	// Do stuff
    
    dataset = data["sheets"]["responses"];
    
    console.log(dataset);
    
    buildView(dataset);
    addListeners();
    $("#gv-filter").find('option:first').attr('selected', 'selected');
}

function boot(el) {
	el.innerHTML = template;
    
	var key = '10GWbYvJDUWhX3akAJlKauYtUsPTxEaYGLQnXfY0XLPw';
	//var url = 'https://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';
    var url = sheetURL(key);
	getJSON(url, function(data) {
        $("#gv-share-container").html(shareTemplate);
		doStuff(data, el);
	});
}

function sheetURL(sheetID) {
    var protocol = window.location.protocol.substring(0,4) !== 'http' ? 'https://' : '//';
    return protocol + 'interactive.guim.co.uk/docsdata/' + sheetID + '.json';
}

function buildView( data ) {
    
    var i, html = "", infoText, yr;
	
	var cbTemplate = u.template(constituencyQuoteBlockTemplate);
	
	
	for ( i = 0; i < data.length; i++ ) {
        
        infoText = "<strong>Current ";
        
        if (data[i]["constituency type"] == "Westminster") {
            infoText += " MP: ";
            yr = "2015";
        } else if (data[i]["constituency type"] == "Cardiff") {
             infoText += " AM: ";
             yr = "2011";
        } else {
             infoText += " MSP: ";
             yr = "2011";
        }
        
        infoText += data[i]["mp or msp"] + "</strong><br/>" + yr + " majority: " + data[i]["majority"];
        
        var moreString = '';
        
        if ( dataset[i].fullquote != "") {
            moreString = '<strong class="gv-more"> more...</strong>';
        }
        
		
		
		html += cbTemplate({ quoteId: i,
									quote: data[i].fullquote,
                                    pullquote: data[i].pullquote + moreString,
                                    source: data[i].Source,
                                    title: data[i].title,
                                    constituency: data[i].Constituency,
                                    info: infoText,
                                    mapHtml: mapTemplate
									 });
	}
	
	var $qa = $("#gv-content");
	
	$qa.html(html);
    
    
    
    for ( i = 0; i < data.length; i++ ) {
        var $map = $("#gv-consituency-quote-block-" + i + " .qa-locator-map");
        
        var mapID = data[i].mapID; //.replace(/ /g,"\\ ");
        
        //console.log($map[0])
        
        var partyColours = {};
        
        partyColours["CON"] = "#005789";
partyColours["LAB"] = "#E31F26";
partyColours["LD"] = "#FFB900";
partyColours["SNP"] = "#FCDD03";
partyColours["UKIP"] = "#7D0069";
partyColours["PC"] = "#868686";
partyColours["OTH"] = "#777777";

var partyColour = partyColours[data[i].partyID];
        
        $map.find("[id='" + mapID + "']").css("background-color", partyColour).show();
    }
    
     
}

function addListeners() {
    
    // $(".gv-consituency-quote-block").click( function (e) {
    //     var blk = $(this);
    //     $(blk).toggleClass("gv-expanded");
    // });
    
    $("#gv-content").click( function (e) {
        var blk = $(this);
        //alert ("blk");
        //$(blk).toggleClass("gv-expanded");
           var blk = $(e.target).closest(".gv-consituency-quote-block");
        

        if ( blk.length > 0) { // its a live cell

          $(blk).toggleClass("gv-expanded");
        }
    });
    
    $("#gv-share-container .share-button").click( function(e) {
		var $btn = $(this);
		share($btn.data("platform"));
	});
    
   

    $("#gv-filter").change(function(e) {

        //console.log(this.value);

        filterCells(this.value);

    });
}

function filterCells(filter) {

    switch (filter) {

        case "show all":

            displayCellsByFilter("ALL", filter);

            break;

       default:
       
       displayCellsByFilter("region", filter);
 
       break;

    }

}

function displayCellsByFilter(key, value) {
    
    //alert(value);

    if (key == "ALL") {
        currentDataset = dataset;
        buildView(currentDataset);
        return;
    }

    var i, ii, testValue, testArray, found;

    currentDataset = [];
    deselectedDataset = [];

    for (i = 0; i < dataset.length; i++) {

        found = false;

        testArray = String(dataset[i][key]).split(",");

        for (ii = 0; ii < testArray.length; ii++) {

            testValue = testArray[ii].trim();
            //testValue = testValue.toLowerCase();

       



            if (testValue == value) {

                currentDataset.push(dataset[i]);
                found = true;

                break;

            }

        }

        if (!found) {
            deselectedDataset.push(dataset[i]);
        }
    }
    
    //alert(currentDataset)
    buildView(currentDataset);
}

function share( platform ){
	
						var shareWindow;
				       	var twitterBaseUrl = "http://twitter.com/share?text=";
				        var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";
				        var articleUrl = "http://gu.com/p/4fn24";
                        //var articleUrl = ""; //http://gu.com/p/4f3qg";
				        //var urlsuffix = url.toString() ? "#p" + url : "";
				        var shareUrl = articleUrl;

				        //var message = this.get('shareMessage')
						
						var message = shareMessage;
				        
				        //var facebookImage = "http://media.guim.co.uk/06de8957d360b17426086762f9d6998307127b84/0_134_6233_3740/1000.jpg";
				        var twitterImage = " ";
						var facebookImage = " ";
				         
				        if(platform === "twitter"){
				            shareWindow = 
				                twitterBaseUrl + 
				                encodeURIComponent(message + twitterImage) + 
				                "&url=" + 
				                encodeURIComponent(shareUrl + '/stw')   
				        }else if(platform === "facebook"){
				            shareWindow = 
				                facebookBaseUrl + 
				                encodeURIComponent(shareUrl) + 
				                "&picture=" + 
				                encodeURIComponent(facebookImage) + 
				                "&redirect_uri=http://www.theguardian.com";
				        }else if(platform === "mail"){
				            shareWindow =
				                "mailto:" +
				                "?subject=" + message +
				                "&body=" + shareUrl 
				        }
				        window.open(shareWindow, platform + "share", "width=640,height=320");     
}

module.exports = { boot: boot };
