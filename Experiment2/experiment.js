/*
ChangeLog
8 Dec 12, Sat
- Added Browser Detection
- V11: Recorded emotion data shown to participants as variables ... 
   but stupidly recorded numComplete wrongly (thus, missed out emoData for 1st trial)

27 Nov 12, Tuesday.
- Converted to inference version.
- Made the choosing of colors OUTSIDE the wheel. Thus only three colors are passed to the call to each wheel.
- added more names (from 17 to 30)

8 Nov 12, Thursday (for Version 3)
- Added 50 colors, have sectors be randomized colors
- Fixed code to allow random sampling of the spinner values from a large dataset instead of a fixed one.
- Added "SpinnerID" to uniquely identify a spinner/win combination.
- Fixed "presentation Order" bug
- Added lots more "low-level" data (as opposed to keeping the winProbs, winChoice etc in data.trial)
  - e.g. added payoff1Array, payoff2Array, payoff3Array,
                prob1Array, prob2Array, prob3Array,
                winChoiceArray, winArray, winProbArray
- Populated new spinner dataset.
*/


var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      }
      else if (dataProp)
        return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {   // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
         string: navigator.userAgent,
         subString: "iPhone",
         identity: "iPhone/iPod"
      },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

};
BrowserDetect.init();

/*
showSlide(id)
Displays each slide
*/

function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

/* 
random(a,b)
Returns random number between a and b, inclusive
*/

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}


function myGaussian(mean, sd) {
// Returns a (pseudo-random) number drawn from a Gaussian with mean and sd provided.
// Uses the Box-Muller method to convert two uniform numbers into two normal numbers with mean 0, var 1
// Finally, does a transform by multiplying that number by sd and adding mean.

  var r1, r2;
  r1 = 0;
  r2 = 0;
  while (r1 * r2 == 0.) {
    r1 = Math.random();
    r2 = Math.random();
  }
  var n1 = Math.sqrt(-2. * Math.log(r1)) * Math.cos(2 * Math.PI * r2);

  return (n1*sd + mean);
}




/* 
Array.prototype.random
Randomly shuffles elements in an array. Useful for condition randomization.
*/

Array.prototype.random = function() {
  return this[random(this.length)];
}

/* 
Produces an array with numbers 0~arrLength
in random order. Kind of spurious--use 
Array.prototype.random instead
*/

function shuffledArray(arrLength)
{
  var j, tmp;
  var arr = new Array(arrLength);
  for (i = 0; i < arrLength; i++)
  {
    arr[i] = i;
  }
  for (i = 0; i < arrLength-1; i++)
  {
    j = Math.floor((Math.random() * (arrLength - 1 - i)) + 0.99) + i;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/* 
Gets the value of the checked radio button
*/

function getRadioCheckedValue(formNum, radio_name)
{
   var oRadio = document.forms[formNum].elements[radio_name];
   for(var i = 0; i < oRadio.length; i++)
   {
      if(oRadio[i].checked)
      {
         return oRadio[i].value;
      }
   }
   return '';
}

function setQuestion(array) {
    var i = random(0, array.length - 1);
    var q = array[i];
    return q;
}


/* 
Clears value from form
*/

function clearForm(oForm) {
    
  var elements = oForm.elements; 
    
  oForm.reset();

  for(i=0; i<elements.length; i++) {
      
	field_type = elements[i].type.toLowerCase();
	
	switch(field_type) {
	
		case "text": 
		case "password": 
		case "textarea":
	        case "hidden":	
			
			elements[i].value = ""; 
			break;
        
		case "radio":
		case "checkbox":
  			if (elements[i].checked) {
   				elements[i].checked = false; 
			}
			break;

		case "select-one":
		case "select-multi":
            		elements[i].selectedIndex = -1;
			break;

		default: 
			break;
	}
    }
}

 Raphael.fn.printWin = function(x, y, num) {
  return this.text(x, y, "Bob won $" + num, this.getFont("Myriad")).attr("font-size", "24");
  };


Raphael.fn.triangle = function(x, y, size) {
  var path = ["M", x, y];
  path = path.concat(["L", (x + size / 2), (y + size)]);
  path = path.concat(["L", (x - size / 2), (y + size)]);
  return this.path(path.concat(["z"]).join(" "));
};

Raphael.fn.pieChart = function (cx, cy, r, ProbValues, PayoffValues, colors, fontSize, stroke) { 
  var paper = this,
  rad = Math.PI / 180,
  chart = this.set();
  

  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
    x2 = cx + r * Math.cos(-endAngle * rad),
    y1 = cy + r * Math.sin(-startAngle * rad),
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }
  function writeInSector(cx, cy, r, angle, PayoffValue, fontSize, params) {
    return paper.text(cx + (r*0.6) * Math.cos(-angle * rad),
      cy + (r*0.6) * Math.sin(-angle * rad),
      "$" + PayoffValue, paper.getFont("Myriad")).attr("font-size", fontSize);
  }

  var angle = 0,
  total = 0,
  start = 0,
  process = function (j) {
    var value = ProbValues[j],
    angleplus = 360 * value / total,
    popangle = angle + (angleplus / 2),
    color_name = 0;
    ms = 500,
    delta = 30,
    bcolor = Raphael.hsb(start, 1, 1),
    // color="90-" + bcolor + "-" + Raphael.hsb(start, .75, 1);
      
      color = colors[j].color;
    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 10});
    p.start = angle;
    p.end =  angle + angleplus;
    var pFont = writeInSector(cx, cy, r, angle+angleplus/2, PayoffValues[j], fontSize);
    p.color_name =  color_name;
    p.val= Math.round(100*(value/total));
    angle += angleplus;

    chart.push(p);
    chart.push(pFont);
    

    start += .1;
  };
  for (var i = 0, ii = ProbValues.length; i < ii; i++) {
    total += ProbValues[i];
  }
  for (i = 0; i < ii; i++) {
    process(i);
  }
  return chart;
};





// Input Data for the wheel



var allConditions = [
[
{"condition":1, "Version":"3a", "SpinnerID":"1",  "probabilityVector":[.38, .36, .26],  "payoffVector":[0, 30, 60],   "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"2",  "probabilityVector":[.42, .31, .27],  "payoffVector":[0, 30, 60],   "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"3",  "probabilityVector":[.41, .37, .22],  "payoffVector":[0, 30, 60],   "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"4",  "probabilityVector":[.5, .31, .19],   "payoffVector":[10, 35, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"5",  "probabilityVector":[.515, .3, .185], "payoffVector":[10, 35, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"6",  "probabilityVector":[.5, .32, .18],   "payoffVector":[10, 35, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"7",  "probabilityVector":[.47, .28, .25],  "payoffVector":[15, 70, 80],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"8",  "probabilityVector":[.49, .27, .24],  "payoffVector":[15, 70, 80],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"9",  "probabilityVector":[.45, .29, .26],  "payoffVector":[15, 70, 80],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"10", "probabilityVector":[.43, .39, .18],  "payoffVector":[20, 45, 70],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"11", "probabilityVector":[.41, .35, .24],  "payoffVector":[20, 45, 70],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"12", "probabilityVector":[.40, .34, .26],  "payoffVector":[20, 45, 70],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"13", "probabilityVector":[.31, .25, .44],  "payoffVector":[30, 50, 95],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"14", "probabilityVector":[.33, .29, .38],  "payoffVector":[30, 50, 95],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"15", "probabilityVector":[.30, .30, .40],  "payoffVector":[30, 50, 95],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"16", "probabilityVector":[.45, .37, .18],  "payoffVector":[25, 60, 100], "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"17", "probabilityVector":[.42, .38, .20],  "payoffVector":[25, 60, 100], "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"18", "probabilityVector":[.43, .35, .22],  "payoffVector":[25, 60, 100], "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"19", "probabilityVector":[.31, .32, .37],  "payoffVector":[25, 45, 80],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"20", "probabilityVector":[.26, .32, .42],  "payoffVector":[25, 45, 80],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"21", "probabilityVector":[.30, .30, .40],  "payoffVector":[25, 45, 80],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"22", "probabilityVector":[.32, .16, .52],  "payoffVector":[20, 60, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"23", "probabilityVector":[.34, .22, .44],  "payoffVector":[20, 60, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"24", "probabilityVector":[.33, .20, .47],  "payoffVector":[20, 60, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"25", "probabilityVector":[.21, .36, .43],  "payoffVector":[15, 50, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"26", "probabilityVector":[.24, .40, .36],  "payoffVector":[15, 50, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"27", "probabilityVector":[.25, .38, .37],  "payoffVector":[15, 50, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"28", "probabilityVector":[.36, .40, .24],  "payoffVector":[40, 65, 100], "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"29", "probabilityVector":[.38, .34, .28],  "payoffVector":[40, 65, 100], "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"30", "probabilityVector":[.37, .32, .31],  "payoffVector":[40, 65, 100], "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"31", "probabilityVector":[.54, .30, .16],  "payoffVector":[45, 60, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"32", "probabilityVector":[.52, .29, .19],  "payoffVector":[45, 60, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"33", "probabilityVector":[.50, .30, .20],  "payoffVector":[45, 60, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"34", "probabilityVector":[.43, .23, .34],  "payoffVector":[30, 50, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"35", "probabilityVector":[.41, .24, .35],  "payoffVector":[30, 50, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"36", "probabilityVector":[.39, .25, .36],  "payoffVector":[30, 50, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"37", "probabilityVector":[.28, .19, .53],  "payoffVector":[20, 50, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"38", "probabilityVector":[.30, .18, .52],  "payoffVector":[20, 50, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"39", "probabilityVector":[.32, .18, .50],  "payoffVector":[20, 50, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"40", "probabilityVector":[.27, .38, .35],  "payoffVector":[0, 40, 95],   "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"41", "probabilityVector":[.27, .40, .33],  "payoffVector":[0, 40, 95],   "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"42", "probabilityVector":[.26, .42, .32],  "payoffVector":[0, 40, 95],   "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"43", "probabilityVector":[.55, .28, .17],  "payoffVector":[10, 50, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"44", "probabilityVector":[.58, .24, .18],  "payoffVector":[10, 50, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"45", "probabilityVector":[.60, .24, .16],  "payoffVector":[10, 50, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"46", "probabilityVector":[.26, .53, .21],  "payoffVector":[55, 70, 85],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"47", "probabilityVector":[.28, .51, .21],  "payoffVector":[55, 70, 85],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"48", "probabilityVector":[.25, .52, .23],  "payoffVector":[55, 70, 85],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"49", "probabilityVector":[.30, .52, .18],  "payoffVector":[50, 75, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"50", "probabilityVector":[.32, .50, .18],  "payoffVector":[50, 75, 90],  "winChoice":2}
],
[
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
]
];


 var emotionData = [
{"SpinnerID":"1",   "emotionMean":[.041666667, .725000000, .366666667, .3750000, .350000000, .008333333, .0250000, .866666667],  "emotionSD":[.11246693, .29955324, .29302405, .2165064, .25963573, .03227486, .07007649, .12909944] },
{"SpinnerID":"2",   "emotionMean":[.604166667, .197916667, .135416667, .4583333, .083333333, .062500000, .5312500, .354166667],  "emotionSD":[.11717961, .20956078, .16392152, .2837119, .14433757, .12500000, .22691734, .31002810] },
{"SpinnerID":"3",   "emotionMean":[.951923077, .000000000, .000000000, .7596154, .009615385, .000000000, .7596154, .000000000],  "emotionSD":[.09599346, .00000000, .00000000, .2308360, .03466876, .00000000, .34407764, .00000000] },
{"SpinnerID":"4",   "emotionMean":[.286764706, .389705882, .183823529, .1544118, .176470588, .029411765, .1985294, .713235294],  "emotionSD":[.18095183, .26839494, .18284667, .1741576, .17149859, .07028696, .18253223, .16396399] },
{"SpinnerID":"5",   "emotionMean":[.604166667, .173611111, .048611111, .4097222, .062500000, .013888889, .4791667, .333333333],  "emotionSD":[.12314805, .11455548, .08722529, .1908069, .10718662, .05892557, .24348119, .18688625] },
{"SpinnerID":"6",   "emotionMean":[.942307692, .000000000, .000000000, .7980769, .000000000, .000000000, .7403846, .000000000],  "emotionSD":[.10963225, .00000000, .00000000, .1733438, .00000000, .00000000, .35156473, .00000000] },
{"SpinnerID":"7",   "emotionMean":[.269230769, .480769231, .365384615, .2115385, .173076923, .009615385, .2884615, .605769231],  "emotionSD":[.18988863, .33790930, .31233970, .1935457, .18069932, .03466876, .22467926, .28342287] },
{"SpinnerID":"8",   "emotionMean":[.800000000, .150000000, .037500000, .5000000, .025000000, .012500000, .6250000, .162500000],  "emotionSD":[.12076147, .21889876, .06038074, .3004626, .05270463, .03952847, .28259708, .19587765] },
{"SpinnerID":"9",   "emotionMean":[.937500000, .008928571, .008928571, .7589286, .000000000, .000000000, .5625000, .008928571],  "emotionSD":[.10685630, .03340766, .03340766, .1989412, .00000000, .00000000, .44600254, .03340766] },
{"SpinnerID":"10",  "emotionMean":[.441666667, .283333333, .125000000, .2416667, .133333333, .033333333, .3166667, .550000000],  "emotionSD":[.20521475, .22393930, .15669579, .2137394, .17969882, .09985108, .15574323, .23528099] },
{"SpinnerID":"11",  "emotionMean":[.659722222, .166666667, .083333333, .3958333, .076388889, .034722222, .5277778, .250000000],  "emotionSD":[.14093670, .20561958, .14852213, .1780718, .16121602, .09398799, .26274693, .19647631] },
{"SpinnerID":"12",  "emotionMean":[.854166667, .090277778, .013888889, .6666667, .006944444, .000000000, .6805556, .076388889],  "emotionSD":[.19764235, .24179763, .05892557, .3061862, .02946278, .00000000, .25804063, .21920180] },
{"SpinnerID":"13",  "emotionMean":[.411764706, .463235294, .286764706, .5000000, .272058824, .044117647, .2279412, .750000000],  "emotionSD":[.18095183, .21544243, .24907919, .2025231, .26233363, .08773603, .15458674, .18750000] },
{"SpinnerID":"14",  "emotionMean":[.612500000, .193750000, .093750000, .4250000, .087500000, .037500000, .5187500, .293750000],  "emotionSD":[.16171368, .19649478, .12081821, .1961806, .16272757, .10016434, .21180226, .19565595] },
{"SpinnerID":"15",  "emotionMean":[.976562500, .000000000, .000000000, .7187500, .000000000, .000000000, .7343750, .015625000],  "emotionSD":[.05038911, .00000000, .00000000, .2116404, .00000000, .00000000, .33502177, .06250000] },
{"SpinnerID":"16",  "emotionMean":[.375000000, .390625000, .257812500, .3281250, .289062500, .078125000, .4062500, .664062500],  "emotionSD":[.20412415, .30914870, .28309580, .1983001, .32824898, .24947862, .23048861, .22693038] },
{"SpinnerID":"17",  "emotionMean":[.695312500, .085937500, .046875000, .4218750, .054687500, .023437500, .5546875, .312500000],  "emotionSD":[.09092980, .08801929, .08984941, .2034853, .12884705, .05038911, .20900932, .25413251] },
{"SpinnerID":"18",  "emotionMean":[.973214286, .000000000, .000000000, .8839286, .000000000, .000000000, .7946429, .000000000],  "emotionSD":[.07236678, .00000000, .00000000, .1035927, .00000000, .00000000, .29664447, .00000000] },
{"SpinnerID":"19",  "emotionMean":[.403409091, .369318182, .267045455, .4488636, .238636364, .090909091, .3181818, .579545455],  "emotionSD":[.20749289, .28732467, .27896347, .2718409, .28584954, .22221095, .20675811, .25161814] },
{"SpinnerID":"20",  "emotionMean":[.615000000, .210000000, .095000000, .3900000, .115000000, .035000000, .4800000, .375000000],  "emotionSD":[.13938107, .17940875, .13149778, .2375000, .17275344, .11133658, .23848480, .23662118] },
{"SpinnerID":"21",  "emotionMean":[.912500000, .006250000, .012500000, .7125000, .012500000, .025000000, .7812500, .050000000],  "emotionSD":[.12888694, .02795085, .05590170, .2225007, .03847419, .07694838, .28352515, .14845698] },
{"SpinnerID":"22",  "emotionMean":[.264423077, .413461538, .326923077, .5384615, .293269231, .043269231, .2451923, .730769231],  "emotionSD":[.21309306, .25682978, .28079557, .2801099, .27600341, .09963877, .17132122, .23369935] },
{"SpinnerID":"23",  "emotionMean":[.675925926, .148148148, .106481481, .5694444, .092592593, .032407407, .5324074, .351851852],  "emotionSD":[.17765587, .16639936, .16151217, .1779063, .12302572, .06571164, .23664470, .21660913] },
{"SpinnerID":"24",  "emotionMean":[.919117647, .000000000, .000000000, .5514706, .000000000, .007352941, .7573529, .000000000],  "emotionSD":[.11643447, .00000000, .00000000, .2797139, .00000000, .03031695, .33503320, .00000000] },
{"SpinnerID":"25",  "emotionMean":[.277173913, .510869565, .358695652, .5543478, .304347826, .065217391, .2010870, .717391304],  "emotionSD":[.20628106, .28681500, .32705719, .2523359, .29151370, .13520589, .17572549, .24488341] },
{"SpinnerID":"26",  "emotionMean":[.666666667, .202380952, .089285714, .4345238, .113095238, .005952381, .5714286, .333333333],  "emotionSD":[.09128709, .17886880, .14865468, .2456466, .15764260, .02727724, .16091258, .19498932] },
{"SpinnerID":"27",  "emotionMean":[.915000000, .020000000, .010000000, .6250000, .025000000, .010000000, .7000000, .070000000],  "emotionSD":[.12869538, .07806247, .05000000, .2700309, .12500000, .05000000, .36084392, .21372198] },
{"SpinnerID":"28",  "emotionMean":[.479166667, .270833333, .270833333, .3854167, .156250000, .072916667, .4062500, .500000000],  "emotionSD":[.13933011, .23130886, .28119739, .2095608, .21403191, .17236930, .16100713, .25000000] },
{"SpinnerID":"29",  "emotionMean":[.641666667, .191666667, .075000000, .3583333, .025000000, .000000000, .5750000, .300000000],  "emotionSD":[.07999256, .21058309, .10350983, .1557432, .07007649, .00000000, .19364917, .26642474] },
{"SpinnerID":"30",  "emotionMean":[.964285714, .000000000, .017857143, .7321429, .017857143, .008928571, .7232143, .071428571],  "emotionSD":[.07640623, .00000000, .06681531, .2493122, .04539206, .03340766, .35415993, .26726124] },
{"SpinnerID":"31",  "emotionMean":[.455357143, .357142857, .232142857, .2142857, .142857143, .035714286, .3482143, .508928571],  "emotionSD":[.18085762, .22391374, .25877458, .1423411, .20130072, .05860090, .17798668, .29197720] },
{"SpinnerID":"32",  "emotionMean":[.700000000, .087500000, .043750000, .5125000, .018750000, .012500000, .6187500, .231250000],  "emotionSD":[.14281014, .09158689, .06117006, .2717511, .04579344, .03847419, .19226404, .21180226] },
{"SpinnerID":"33",  "emotionMean":[.987068966, .000000000, .000000000, .7844828, .004310345, .000000000, .8879310, .004310345],  "emotionSD":[.05115657, .00000000, .00000000, .2162396, .02321192, .00000000, .16483497, .02321192] },
{"SpinnerID":"34",  "emotionMean":[.515625000, .250000000, .125000000, .3203125, .101562500, .039062500, .3828125, .500000000],  "emotionSD":[.23662118, .25819889, .19895561, .2325974, .23371435, .09915003, .25604667, .23273733] },
{"SpinnerID":"35",  "emotionMean":[.652777778, .152777778, .125000000, .4861111, .069444444, .027777778, .5694444, .284722222],  "emotionSD":[.17445058, .16357425, .14219911, .2223243, .08809902, .06853986, .31278582, .19556458] },
{"SpinnerID":"36",  "emotionMean":[.941176471, .007352941, .007352941, .6397059, .036764706, .007352941, .8750000, .000000000],  "emotionSD":[.08967876, .03031695, .03031695, .2610165, .15158477, .03031695, .19764235, .00000000] },
{"SpinnerID":"37",  "emotionMean":[.293478261, .472826087, .364130435, .5923913, .304347826, .065217391, .2445652, .733695652],  "emotionSD":[.13903429, .24987645, .29655466, .2268153, .26335383, .09878211, .17868785, .22393799] },
{"SpinnerID":"38",  "emotionMean":[.633928571, .214285714, .089285714, .5803571, .160714286, .008928571, .4107143, .455357143],  "emotionSD":[.17309600, .23219568, .09078413, .1998024, .21610946, .03340766, .30393482, .28422949] },
{"SpinnerID":"39",  "emotionMean":[.919117647, .014705882, .007352941, .4779412, .014705882, .007352941, .7426471, .014705882],  "emotionSD":[.11643447, .04151320, .03031695, .2696761, .04151320, .03031695, .30126876, .06063391] },
{"SpinnerID":"40",  "emotionMean":[.006944444, .722222222, .513888889, .4930556, .416666667, .069444444, .1597222, .937500000],  "emotionSD":[.02946278, .25203421, .31180478, .3164376, .29393377, .23570226, .32028697, .10718662] },
{"SpinnerID":"41",  "emotionMean":[.631944444, .166666667, .055555556, .3611111, .041666667, .041666667, .5208333, .305555556],  "emotionSD":[.15141624, .18688625, .09797792, .2741594, .07426107, .08574929, .21113315, .22776981] },
{"SpinnerID":"42",  "emotionMean":[.951923077, .000000000, .000000000, .7403846, .009615385, .000000000, .6923077, .038461538],  "emotionSD":[.12009612, .00000000, .00000000, .2722473, .03466876, .00000000, .34841675, .09388345] },
{"SpinnerID":"43",  "emotionMean":[.317307692, .471153846, .221153846, .1538462, .201923077, .019230769, .2692308, .673076923],  "emotionSD":[.14978617, .28483295, .30256648, .1919869, .26779609, .04694173, .19662619, .28658578] },
{"SpinnerID":"44",  "emotionMean":[.763888889, .083333333, .041666667, .6041667, .055555556, .034722222, .6597222, .173611111],  "emotionSD":[.11253177, .11343565, .07426107, .2358106, .07696235, .09398799, .24179763, .16121602] },
{"SpinnerID":"45",  "emotionMean":[.980769231, .009615385, .009615385, .8557692, .038461538, .019230769, .7307692, .009615385],  "emotionSD":[.04694173, .03466876, .03466876, .1233870, .10685630, .04694173, .35665603, .03466876] },
{"SpinnerID":"46",  "emotionMean":[.527173913, .195652174, .141304348, .4130435, .146739130, .048913043, .4565217, .418478261],  "emotionSD":[.19927611, .19153272, .16124669, .2274950, .18712908, .12913133, .25452913, .26276690] },
{"SpinnerID":"47",  "emotionMean":[.750000000, .100000000, .075000000, .3625000, .075000000, .012500000, .6125000, .237500000],  "emotionSD":[.11785113, .20241596, .16873714, .3087272, .23717082, .03952847, .29726765, .22399467] },
{"SpinnerID":"48",  "emotionMean":[.977272727, .005681818, .005681818, .7897727, .000000000, .000000000, .7443182, .011363636],  "emotionSD":[.04934638, .02665009, .02665009, .1561553, .00000000, .00000000, .34606047, .03678062] },
{"SpinnerID":"49",  "emotionMean":[.426470588, .352941176, .272058824, .4411765, .191176471, .029411765, .3676471, .507352941],  "emotionSD":[.22988968, .23483411, .25091743, .2170364, .28338649, .08302640, .26320808, .25567996] },
{"SpinnerID":"50",  "emotionMean":[.783333333, .075000000, .041666667, .3416667, .041666667, .025000000, .6416667, .233333333],  "emotionSD":[.09985108, .09209855, .07715167, .2188988, .13081703, .05175492, .24488822, .19970216] }
]



/* Experimental Variables */
// Number of conditions in experiment
var numConditions = 1; //allConditions.length;

// Randomly select a condition number for this particular participant
var chooseCondition = 1; // random(0, numConditions-1);

// Based on condition number, choose set of input (trials)
var allTrialOrders = allConditions[chooseCondition-1];

// Number of trials in each condition
var numTrials = 10; //not necessarily allTrialOrders.length;

// Produce random order in which the trials will occur
var shuffledOrder = shuffledArray(allTrialOrders.length);

// Keep track of current trial 
var currentTrialNum = 0;

// A variable special for this experiment because we're randomly
// choosing word orders as well
// var wordOrder = 100;
var trial;

// Keep track of how many trials have been completed
var numComplete = 0;


var colors = [{color_name:"AliceBlue",color:"#F0F8FF"}, 
            {color_name:"AntiqueWhite",color:"#FAEBD7"},
            {color_name:"Aqua",color:"#00FFFF"},
            {color_name:"Aquamarine",color:"#7FFFD4"},
            {color_name:"Bisque",color:"#FFE4C4"},
            {color_name:"Chocolate",color:"#D2691E"},
            {color_name:"CornflowerBlue",color:"#6495ED"},
            {color_name:"Crimson",color:"#DC143C"},
            {color_name:"DarkCyan",color:"#008B8B"},
            {color_name:"DarkGoldenRod",color:"#B8860B"},
            {color_name:"DarkKhaki",color:"#BDB76B"},
            {color_name:"DarkOliveGreen",color:"#556B2F"},
            {color_name:"DarkOrange",color:"#FF8C00"},
            {color_name:"DarkSalmon",color:"#E9967A"},
            {color_name:"DeepPink",color:"#FF1493"},
            {color_name:"DeepSkyBlue",color:"#00BFFF"},
            {color_name:"DodgerBlue",color:"#1E90FF"},
            {color_name:"ForestGreen",color:"#228B22"},
            {color_name:"Gold",color:"#FFD700"},
            {color_name:"GoldenRod",color:"#DAA520"},
            {color_name:"Gray",color:"#808080"},
            {color_name:"GreenYellow",color:"#ADFF2F"},
            {color_name:"IndianRed",color:"#CD5C5C"},
            {color_name:"Khaki",color:"#F0E68C"},
            {color_name:"Lavender",color:"#E6E6FA"},
            {color_name:"LemonChiffon",color:"#FFFACD"},
            {color_name:"LightBlue",color:"#ADD8E6"},
            {color_name:"LightCoral",color:"#F08080"},
            {color_name:"LightCyan",color:"#E0FFFF"},
            {color_name:"LightGray",color:"#D3D3D3"},
            {color_name:"MistyRose",color:"#FFE4E1"},
            {color_name:"Orange",color:"#FFA500"},
            {color_name:"OrangeRed",color:"#FF4500"},
            {color_name:"PaleGoldenRod",color:"#EEE8AA"},
            {color_name:"PaleGreen",color:"#98FB98"},
            {color_name:"PaleTurquoise",color:"#AFEEEE"},
            {color_name:"PaleVioletRed",color:"#DB7093"},
            {color_name:"PeachPuff",color:"#FFDAB9"},
            {color_name:"Peru",color:"#CD853F"},
            {color_name:"Pink",color:"#FFC0CB"},
            {color_name:"Plum",color:"#DDA0DD"},
            {color_name:"PowderBlue",color:"#B0E0E6"},
            {color_name:"SeaGreen",color:"#2E8B56"},
            {color_name:"Sienna",color:"#A0522D"},
            {color_name:"Silver",color:"#C0C0C0"},
            {color_name:"SteelBlue",color:"#4682B4"},
            {color_name:"Tan",color:"#D2B48C"},
            {color_name:"Tomato",color:"#FF6347"},
            {color_name:"Turquoise",color:"#40E0D0"},
            {color_name:"YellowGreen",color:"#9ACD32"}
            ];


/*
Show the instructions slide — this is what we want subjects to see first.
*/

$("#progressBar").hide();
showSlide("instructions");


// Updates the progress bar
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);

/*
The actual variable that will be returned to MTurk. The experiment object with various variables that you want to keep track of and return as results.

More practically, you should stick everything in an object and submit that whole object so that you don’t lose data (e.g. randomization parameters, what condition the subject is in, etc). Don’t worry about the fact that some of the object properties are functions — mmturkey (the Turk submission library) will strip these out.
*/

var experiment = {

/*
Parameters for this sequence.
*/
  condition: 1,

  startTime: 0,
  endTime: 0,

  // An array of subjects' responses to each trial (NOTE: in the order in which
  // you initially listed the trials, not in the order in which they appeared)
  //results: new Array(numTrials),

  // The order in which each trial appeared
  //orders: new Array(numTrials),

  // The order in which each trial is presented. i.e. 
  // presentationOrder[i] = j means the i-th trial is the j-th one in the trial sequence.
  // Note that presentationOrder is now obsolete with spinnerIDArray
  // presentationOrder: new Array(numTrials),

  spinnerIDArray: new Array(numTrials),
  payoff1Array: new Array(numTrials),
  payoff2Array: new Array(numTrials),
  payoff3Array: new Array(numTrials),
  prob1Array: new Array(numTrials),
  prob2Array: new Array(numTrials),
  prob3Array: new Array(numTrials),
  winChoiceArray: new Array(numTrials),
  winArray: new Array(numTrials),
  winProbArray: new Array(numTrials),
  

  emo1Array: new Array(numTrials),
  emo2Array: new Array(numTrials),
  emo3Array: new Array(numTrials),
  emo4Array: new Array(numTrials),
  emo5Array: new Array(numTrials),
  emo6Array: new Array(numTrials),
  emo7Array: new Array(numTrials),
  emo8Array: new Array(numTrials),
  

  // My Results:
  outcome1Array: new Array(numTrials),
  outcome2Array: new Array(numTrials),
  outcome3Array: new Array(numTrials),
  

  angleProportionArray: new Array(numTrials),


  reactionTimeArray: new Array(numTrials),

  // Demographics
  //gender: "",
  //age:"",
  //nativeLanguage:"",
  comments:"",

 //trials: myTrialOrder,

/*
An array to store the data that we’re collecting.
*/

  data: [],

// Goes to description slide
  description: function() {
    $("#progressBar").show();
    showSlide("description");
    $("#tot-num").html(numTrials);

    if (turk.previewMode) {
      alert ( "Please accept the HIT before continuing." );;
    }   
  },

/*
The function that gets called when the sequence is finished.
*/

  end: function() {
  	// Records demographics
    //var gen = $('input[name="genderButton"]:checked').val();
    //var ag = document.age.ageRange.value;
    //var lan = document.language.nativeLanguage.value;
    var comm = document.comments.input.value;
    //experiment.gender = gen;
    //experiment.age = ag;
    //experiment.nativeLanguage = lan;
    experiment.comments = comm;
    //clearForm(document.forms[1]);
    //clearForm(document.forms[2]);
    //clearForm(document.forms[3]);
    //clearForm(document.forms[4]);

    // Show the finish slide.
    showSlide("finished");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },





  next: function() {
  
  //var n = experiment.trials.shift();
  // if (typeof n == "undefined") {
  //      return experiment.end();
  //    }
        var charNameList = ["Alex", "Bob", "Charlie", "Chris", 
        "David", "Eric", "Frank", "George", "Jacob", "Jake", 
        "James", "John", "Josh", "Mike", "Scott", "Steve", "Tom", 
        "Will", "Zach", "Vince", "Ted", "Sean", "Ron", "Peter", 
        "Paul", "Mark", "Joe", "Nick", "Carl", "Kevin"];

        function refreshCharName() {
            return(charNameList[Math.floor(Math.random()*charNameList.length)]);
        };
        var charName = refreshCharName();    
        $('#CharName1').html(charName);
        $('#CharName2').html(charName);
        $('#CharName3').html(charName);
        $('#CharName4').html(charName);
    
    var winningAngle;
    var probabilityVectorTotal;
    var angleStart;
    var angleEnd;
    var randProportion;
    var bobStickFigure, hand, spinner, goButton, goButtonLabel;




  showSlide("stage");
  $("#response").hide();
  
  if (numComplete == 0) { // First trial: create canvas.
      canvas=Raphael('wheel');
      canvasOutcome1=Raphael('outcomeGraphic1', 90, 90);
      canvasOutcome2=Raphael('outcomeGraphic2', 90, 90);
      canvasOutcome3=Raphael('outcomeGraphic3', 90, 90);


      slider1=Raphael('sliderDiv1', 600, 50);
      slider2=Raphael('sliderDiv2', 600, 50);
      slider3=Raphael('sliderDiv3', 600, 50);
      slider4=Raphael('sliderDiv4', 600, 50);
      slider5=Raphael('sliderDiv5', 600, 50);
      slider6=Raphael('sliderDiv6', 600, 50);
      slider7=Raphael('sliderDiv7', 600, 50);
      slider8=Raphael('sliderDiv8', 600, 50);

        


      //make sliders
        sliderStartLeft = 185;
        sliderStartRight = 585;
        sliderTop = 10;
        sliderMiddle = 30;
        sliderBottom = 50;

        slider1.text(sliderStartLeft,4, "Less");
        slider1.text(sliderStartRight,4, "More");
        



        slider1.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider1.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider1.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider1.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider1.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider1.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider2.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider2.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider2.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider2.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider2.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider2.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider3.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider3.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider3.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider3.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider3.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider3.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider4.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider4.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider4.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider4.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider4.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider4.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider5.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider5.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider5.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider5.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider5.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider5.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider6.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider6.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider6.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider6.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider6.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider6.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider7.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider7.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider7.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider7.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider7.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider7.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));

        slider8.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + sliderStartRight);
        slider8.path("M" + sliderStartLeft + " " + sliderTop + "V" + sliderBottom);
        slider8.path("M" + sliderStartRight + " " + sliderTop + "V" + sliderBottom);
        slider8.path("M" + (1/2*sliderStartLeft + 1/2*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider8.path("M" + (1/4*sliderStartLeft + 3/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));
        slider8.path("M" + (3/4*sliderStartLeft + 1/4*sliderStartRight) + " " + (sliderTop+8) + "V" + (sliderBottom-8));


        indicator1 = slider1.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator2 = slider2.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator3 = slider3.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator4 = slider4.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator5 = slider5.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator6 = slider6.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator7 = slider7.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});
        indicator8 = slider8.circle(sliderStartLeft, sliderMiddle,6).attr({fill: "#099"});

       

  }
  
  // If this is not the first trial, record variables
  if (numComplete > 0) {
    canvas.clear();
    canvasOutcome1.clear();
    canvasOutcome2.clear();
    canvasOutcome3.clear();
    

            //var rating = parseFloat(document.rating.score.value);
            //experiment.results[currentTrialNum] = rating;
            //experiment.orders[currentTrialNum] = numComplete;
            //experiment.wordOrders[currentTrialNum] = wordOrder;
            
            //experiment.isPuns[currentTrialNum] = trial.isPun;
            //experiment.isCorrects[currentTrialNum] = trial.isCorrect;

            //experiment.presentationOrder[numComplete-1] = currentTrialNum;
            /*
            experiment.q1responseArray[numComplete-1] = $('input[name="q1"]:checked').val();
            experiment.q2responseArray[numComplete-1] = $('input[name="q2"]:checked').val();
            experiment.q3responseArray[numComplete-1] = $('input[name="q3"]:checked').val();
            experiment.q4responseArray[numComplete-1] = $('input[name="q4"]:checked').val();
            experiment.q5responseArray[numComplete-1] = $('input[name="q5"]:checked').val();
            experiment.q6responseArray[numComplete-1] = $('input[name="q6"]:checked').val();
            experiment.q7responseArray[numComplete-1] = $('input[name="q7"]:checked').val();
            experiment.q8responseArray[numComplete-1] = $('input[name="q8"]:checked').val();

            $('input[name="q1"]:').prop('checked', false);
            $('input[name="q2"]:').prop('checked', false);
            $('input[name="q3"]:').prop('checked', false);
            $('input[name="q4"]:').prop('checked', false);
            $('input[name="q5"]:').prop('checked', false);
            $('input[name="q6"]:').prop('checked', false);
            $('input[name="q7"]:').prop('checked', false);
            $('input[name="q8"]:').prop('checked', false);
            */
            experiment.data.push(trial);
            
            experiment.outcome1Array[numComplete-1] = $('input[name="q1"]:checked').val();
            experiment.outcome2Array[numComplete-1] = $('input[name="q2"]:checked').val();
            experiment.outcome3Array[numComplete-1] = $('input[name="q3"]:checked').val();


            $('input[name="q1"]:').prop('checked', false);
            $('input[name="q2"]:').prop('checked', false);
            $('input[name="q3"]:').prop('checked', false);

            experiment.endTime = (new Date()).getTime();
            experiment.reactionTimeArray[numComplete-1] = experiment.endTime - experiment.startTime;



            indicator1.transform("t" + (-emo1 * myscale) + ",0");
            indicator2.transform("t" + (-emo2 * myscale) + ",0");
            indicator3.transform("t" + (-emo3 * myscale) + ",0");
            indicator4.transform("t" + (-emo4 * myscale) + ",0");
            indicator5.transform("t" + (-emo5 * myscale) + ",0");
            indicator6.transform("t" + (-emo6 * myscale) + ",0");
            indicator7.transform("t" + (-emo7 * myscale) + ",0");
            indicator8.transform("t" + (-emo8 * myscale) + ",0");

            indicatorPath1.remove();
            indicatorPath2.remove();
            indicatorPath3.remove();
            indicatorPath4.remove();
            indicatorPath5.remove();
            indicatorPath6.remove();
            indicatorPath7.remove();
            indicatorPath8.remove();
            //clearForm(document.forms[0]);
          }
        // If subject has completed all trials, update progress bar and
        // show slide to ask for demographic info
        if (numComplete >= numTrials) {
          $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
          $("#trial-num").html(numComplete);
          $("#total-num").html(numTrials);
          showSlide("askInfo");
        // Otherwise, if trials not completed yet, update progress bar
        // and go to next trial based on the order in which trials are supposed
        // to occur
      } else {
        $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
        $("#trial-num").html(numComplete);
        $("#total-num").html(numTrials);


        //currentTrialNum is used for randomizing later
        currentTrialNum = shuffledOrder[numComplete]; //numComplete //allTrialOrders[numComplete];
        trial = allTrialOrders[currentTrialNum];

        probabilityVector = trial.probabilityVector;
        payoffVector = trial.payoffVector;
        winChoice = trial.winChoice;
        
        // winningAngle = 3000;

        // simple routine to calculate win angle.
        // normalizing 
        probabilityVectorTotal=0;
        angleStart = 0;
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVectorTotal += probabilityVector[i];
          if (i<winChoice-1) {
            angleStart += probabilityVector[i];
          };
        };
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVector[i] = probabilityVector[i] / probabilityVectorTotal;
        }
        angleStart = angleStart / probabilityVectorTotal;
        angleEnd = angleStart + probabilityVector[winChoice-1];
        // now the desired winning angle is between [angleStart, angleEnd] * 360 degrees
        randProportion = Math.random();
        // calculate winning angle = uniform draw from [angleStart, angleEnd] * 360 degrees
        // plus 5-10 rounds. Remember to offset - 90 degrees because the angles are calculated
        // from the positive x axis while the pointer is along the positive y axis.
        winningAngle = ((angleStart * (1-randProportion) + angleEnd * randProportion) 
        + 5 + Math.floor(Math.random()*5)) * 360 - 90;
        //randProportion = 1;
        //winningAngle = ((angleStart * (1-randProportion) + angleEnd * randProportion) * 360)- 90; 
            // 0 is nearer the outcome before it, 1 is nearer the outcome after it
        
        //probabilityVector = [.1, .3, .6];
        //payoffVector = [10, 5, 2];
            

            experiment.spinnerIDArray[numComplete] = trial.SpinnerID;
            experiment.payoff1Array[numComplete] = payoffVector[0] ;
            experiment.payoff2Array[numComplete] = payoffVector[1] ;
            experiment.payoff3Array[numComplete] = payoffVector[2] ;
            experiment.prob1Array[numComplete] = probabilityVector[0] ;
            experiment.prob2Array[numComplete] = probabilityVector[1] ;
            experiment.prob3Array[numComplete] = probabilityVector[2] ;
            experiment.angleProportionArray[numComplete] = Math.round(randProportion*1000)/1000;
            experiment.winChoiceArray[numComplete] = winChoice;
            experiment.winArray[numComplete] = payoffVector[winChoice-1];
            experiment.winProbArray[numComplete] = probabilityVector[winChoice-1];
            
            $('#Outcome1').html(payoffVector[0]);
            $('#Outcome2').html(payoffVector[1]);
            $('#Outcome3').html(payoffVector[2]);
        
        //canvas.printWin(canvas.width/2 + 135, 150, payoffVector[winChoice])
        // Adds pointer
        canvas.triangle(canvas.width/2, 5, 15).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        
        chosenColorsNum = shuffledArray(colors.length);
        //chosenColorsNum = [];
        chosenColors = [];
        for (var l = 0; l<3; l++) {
        //  pickedColorNum = Math.floor(Math.random()*colors.length);
        //  for (var k = 0; k<l; k++) {
        //    while (pickedColorNum == chosenColorsNum[k]) {
        //      pickedColorNum = Math.floor(Math.random()*colors.length);
        //    }
        //  }
        //  chosenColorsNum[l] = pickedColorNum;
          chosenColors[l] = colors[chosenColorsNum[l]];
        }


        // Creates spinner
        spinner = canvas.pieChart(canvas.width/2, 150, 125, probabilityVector, payoffVector,
          chosenColors, 24);

        

        bobStickFigure = canvas.image("images/bob.jpeg", canvas.width/4-15, 70, 52, 128);
        hand = canvas.image("images/hand.png", canvas.width/4 + 12, 112, 64, 48).transform("r90");

        blocker = canvas.rect(canvas.width/2 - 150, -350 ,300,300).attr({fill: "#999"});



        goButton = canvas.rect(canvas.width/4-20,20,90,25,0).attr({fill: "#0f0"});
        goButtonLabel = canvas.text(canvas.width/4+25,10,"Go!");

        goButton.click(function() {
          hand.animate(
            {transform: "r90,T" + (canvas.width/4 - 170) + ",0"}, 1000, '<',  
              function() {
                blocker.animate({transform: "T0,350"}, 4000, 'linear');
                spinner.animate(
                  {transform: "r" + winningAngle + " " + canvas.width/2 + " " + 150}, 6000, '>',
                  afterSpin)
                  }
              )
        });





        emos = emotionData[currentTrialNum];

        
        emo1 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[1-1], emos.emotionSD[1-1])));
        emo2 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[2-1], emos.emotionSD[2-1])));
        emo3 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[3-1], emos.emotionSD[3-1])));
        emo4 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[4-1], emos.emotionSD[4-1])));
        emo5 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[5-1], emos.emotionSD[5-1])));
        emo6 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[6-1], emos.emotionSD[6-1])));
        emo7 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[7-1], emos.emotionSD[7-1])));
        emo8 = Math.min(1, Math.max(0, myGaussian(emos.emotionMean[8-1], emos.emotionSD[8-1])));
        

        myscale = 400;
        indicator1.transform("t" + (emo1 * myscale) + ",0");
        indicator2.transform("t" + (emo2 * myscale) + ",0");
        indicator3.transform("t" + (emo3 * myscale) + ",0");
        indicator4.transform("t" + (emo4 * myscale) + ",0");
        indicator5.transform("t" + (emo5 * myscale) + ",0");
        indicator6.transform("t" + (emo6 * myscale) + ",0");
        indicator7.transform("t" + (emo7 * myscale) + ",0");
        indicator8.transform("t" + (emo8 * myscale) + ",0");
        
        indicatorPath1 = slider1.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo1 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator1);
        indicatorPath2 = slider2.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo2 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator2);
        indicatorPath3 = slider3.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo3 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator3);
        indicatorPath4 = slider4.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo4 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator4);
        indicatorPath5 = slider5.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo5 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator5);
        indicatorPath6 = slider6.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo6 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator6);
        indicatorPath7 = slider7.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo7 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator7);
        indicatorPath8 = slider8.path("M" + sliderStartLeft + " " + sliderMiddle + "H" + (emo8 * myscale + sliderStartLeft)).attr({"stroke-width": 3}).insertBefore(indicator8);


            experiment.emo1Array[numComplete-1] = Math.round(emo1*1000)/1000;
            experiment.emo2Array[numComplete-1] = Math.round(emo2*1000)/1000; 
            experiment.emo3Array[numComplete-1] = Math.round(emo3*1000)/1000; 
            experiment.emo4Array[numComplete-1] = Math.round(emo4*1000)/1000; 
            experiment.emo5Array[numComplete-1] = Math.round(emo5*1000)/1000; 
            experiment.emo6Array[numComplete-1] = Math.round(emo6*1000)/1000; 
            experiment.emo7Array[numComplete-1] = Math.round(emo7*1000)/1000; 
            experiment.emo8Array[numComplete-1] = Math.round(emo8*1000)/1000; 
          
/*

        goButton.click(startSpinning());

        function startSpinning() {
          hand.animate(
            {transform: "r90,T" + (canvas.width/4 - 170) + ",0"}, 1000, '<>',  
              function() {
                spinner.animate(
                  {transform: "r" + winningAngle + " " + canvas.width/2 + " " + 150}, 6000, '>',
                  afterSpin)
                  }
              )
        }
*/

        /*
        spinner.click(function() {
        spinner.animate(
          {transform: "r" + winningAngle + " " + canvas.width/2 + " " + 150}, 6000, '>',
          afterSpin)
        });
         spinner.animate({transform: "r" + amount_in_degrees + " " + center_x
         + " " + center_y}, duration_in_milliseconds, easing_formula, optional_callback);
        */

        function afterSpin() {
          var winningPayoff = payoffVector[winChoice-1];
          $('#Outcome').html(winningPayoff);
          $("#response").show(); 
          canvas.text(canvas.width*4/5, 5, '(The wheel before it was spun)');
          spinnerCopy = canvas.pieChart(canvas.width*4/5, 150, 125, probabilityVector, payoffVector,
          chosenColors, 24);
          //setTimeout(function(){$("#response").show(); $('#response').text("The results is:" + winningPayoff);}, 6000);
          //$('#response').text("The results is:  " + winningPayoff);
          //document.getElementById("response").innerText(charName + "has won $" + winningPayoff);
          //document.write(charName) document.write(winningPayoff)
          experiment.startTime = (new Date()).getTime();

          slider1.text(70,sliderMiddle, "Happy").attr({"font-size": 14});
          slider2.text(70,sliderMiddle, "Sad").attr({"font-size": 14});
          slider3.text(70,sliderMiddle, "Angry").attr({"font-size": 14});
          slider4.text(70,sliderMiddle, "Surprised").attr({"font-size": 14});
          slider5.text(70,sliderMiddle, "Disgusted").attr({"font-size": 14});
          slider6.text(70,sliderMiddle, "Fearful").attr({"font-size": 14});
          slider7.text(70,sliderMiddle, "Content").attr({"font-size": 14});
          slider8.text(70,sliderMiddle, "Disappointed").attr({"font-size": 14});

        
        spinnerAngle1 = probabilityVector[0]/2 * 360 - 90 + (Math.random()-0.5)*10;
        spinnerAngle2 = (probabilityVector[0] + probabilityVector[1]/2) * 360 - 90 + (Math.random()-0.5)*10;
        spinnerAngle3 = -1*probabilityVector[2]/2 * 360 - 90 + (Math.random()-0.5)*10;
        canvasOutcome1.triangle(canvasOutcome1.width/2, 5, 5).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        spinnerOutcome1 = canvasOutcome1.pieChart(canvasOutcome1.width/2, canvasOutcome1.height/2+5, 40, 
            probabilityVector, payoffVector, chosenColors, 8)
            .transform("r" + spinnerAngle1 + " " + canvasOutcome1.width/2 + " " + (canvasOutcome1.height/2+5));
        
        canvasOutcome2.triangle(canvasOutcome2.width/2, 5, 5).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        spinnerOutcome2 = canvasOutcome2.pieChart(canvasOutcome2.width/2, canvasOutcome2.height/2+5, 40, 
            probabilityVector, payoffVector, chosenColors, 8)
            .transform("r" + spinnerAngle2 + " " + canvasOutcome2.width/2 + " " + (canvasOutcome2.height/2+5));
        
        canvasOutcome3.triangle(canvasOutcome3.width/2, 5, 5).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        spinnerOutcome3 = canvasOutcome3.pieChart(canvasOutcome3.width/2, canvasOutcome3.height/2+5, 40, 
            probabilityVector, payoffVector, chosenColors, 8)
            .transform("r" + spinnerAngle3 + " " + canvasOutcome3.width/2 + " " + (canvasOutcome3.height/2+5));

        }





          //$("#condition").html(experiment.condition);
          //currentTrialNum = shuffledOrder[numComplete];
          //trial = allTrialOrders[currentTrialNum];
          //          showSlide("stage");



            numComplete++;
          }
            // var startTime = (new Date()).getTime();
            // var endTime = (new Date()).getTime();
            //key = (keyCode == 80) ? "p" : "q",
            //userParity = experiment.keyBindings[key],
            // data = {
            //   stimulus: n,
            //   accuracy: realParity == userParity ? 1 : 0,
            //   rt: endTime - startTime
            // };

       // experiment.data.push(data);
     //setTimeout(experiment.next, 500);
  }

  


};

/*
  var canvas=document.getElementById("spinnerCanvas");
  var context=canvas.getContext("2d");
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = 30;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "black";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "black";
  context.stroke();
  */