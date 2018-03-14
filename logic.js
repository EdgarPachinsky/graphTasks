/*********************************** /
 /*********************************** /         /
 /*********************************** /
 /*********************************** /       /
 /*********************************** /
 /*********************************** /      /
 /*** DEVELOPED BY EDGAR PACHINSKY ***/
/*********************************** /  /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /*********************************** /
 /***************** */
/*** GRAPH TASKS ***/
/**
 * version v0.5
 */
/***************** */


/*** BASIC VARIABLES ***/
var graphSelected = false;

/*** LINE DRAWING  VARS ***/
var first = true;
var x = 0;
var y = 0;
var oldX = 0;
var oldY = 0;
var newX = 0;
var newY = 0;
var widthX = 0;
var widthY = 0;
var midX = 0;
var midY = 0;
var lineRotateInRadian = 0;
var lineRotateInDegree = 0;
var lineWidth = 0;
var fromPeak = null;
var toPeak = null;
var fst = true;
/*** LINE DRAWING VARS END ***/

/*** GRAPH TYPE ***/
/**
 * @type {null}
 * 0 Քաշ ունեցող
 * 1 Ուղղությամբ
 * 2 Առանց Ուղղության, Առանց Քաշի
 */
var graphType = null;
/**
 * @type {number}
 */
var peakDataIndex = 1;
/*** GRAPH TYPE END ***/

/*** DRAWING DOM ELEMENTS PLACES ***/
$drawPlace = $('#drawing-canvas');
$resultMatrix = $('#block-of-graph-matrix');

/** Hide Button **/
$secondStep = $('#go-to-second-step');
$secondStep.css({
    'display': 'none'
})
/*** DRAWING DOM ELEMENT PLACES END ***/

/*** GENERATE MATRIX OF GRAPH ***/
/**
 * @type {Array}
 */
var graphMatrix = [];
function generateGraphMatrix(peakCount) {
    graphMatrix = [];

    for (i = 0; i < peakCount; i++) {
        graphMatrix[i] = [];
    }

    for (i = 0; i < peakCount; i++) {
        for (j = 0; j < peakCount; j++) {
            graphMatrix[i][j] = 0;
        }
    }
}
function transformGraphMatrix(from, to, value) {
    if (graphType == 1 || graphType == 2) {
        graphMatrix[from][to] = value;
        graphMatrix[to][from] = value;
    }
}
/*** GENERATE MATRIX OF GRAPH END***/

/*** TASK BUTTONS ***/
$minimalWayCalc = $('#calculateMinimalWay');
/*** TASK BUTTONS END***/


$(document).ready(function () {
    $('#graphSelected').click(function () {
        graphType = $('#graph-type').val()
        graphSelected = true;
    })

    /*** DRAWING PEAKS OF GRAPH ***/
    $drawPlace.click(function (e) {
        if (graphSelected === true) {
            if (e.target.classList['value'] !== "graph-peak-delete") {
                var x = e.pageX - this.offsetLeft;
                var y = e.pageY - this.offsetTop;
                $drawPlace.append(createGraphPeak(x, y, peakDataIndex));
                generateGraphMatrix(peakDataIndex);
                drawResultMatrix(peakDataIndex);
                if (peakDataIndex >= 2) {
                    $secondStep.css({
                        'display': 'inline'
                    })
                } else {
                    $secondStep.css({
                        'display': 'none'
                    })
                }
                peakDataIndex++;
            }
        }
    });
    /*** DRAWING PEAKS OF GRAPH END ***/

    /*** SECOND STEP DRAW LINES ***/
    $secondStep.click(function () {
        fromPeak = null;
        toPeak = null;
        fst = true;


        if (graphType == 1) {
            /*** CALLING MODULE 2 FUNCTIONS ***/
            $drawPlace.unbind("click");
            unbindDeleteFunctionFromPeaksModule2()
        }


        if (graphType == 2) {
            /*** CALLING MODULE 2 FUNCTIONS ***/
            $drawPlace.unbind("click");
            unbindDeleteFunctionFromPeaks()
        }
    })
    $drawPlace.mousemove(function (e) {
        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;
    });

    /*** SECOND STEP DRAW LINES END ***/
    $minimalWayCalc.click(function () {
        var from = $('#from').val();
        var to = $('#to').val();
        dropAllValuesForBasicGraph();
        $('.graph-peak').each(function () {
            $(this).css({
                'background': 'whitesmoke'
            });
        })
        calcMinimalWay(from - 1, to - 1)
    })
})

/*** FUNCTIONS ***/

/*** CREATE/DELETE GRAPH PEAK ***/
function createGraphPeak(x, y, dataIndex) {
    return '<div class="graph-peak" data-index="' + dataIndex + '" style="left:' + x + 'px;top: ' + y + 'px">' +
        '<span>' + dataIndex + '</span>' +
        '<delete class="graph-peak-delete" onclick="deleteGraphPeak(this)">x</delete>' +
        '</div>';
}

function deleteGraphPeak(domObj) {
    $(domObj).parent().remove();
    /*** USED TO COUNT PEAKS OF GRAPH***/
    var peakCounter = 1;
    $('.graph-peak').each(function () {
        $(this).attr('data-index', peakCounter);
        $(this).find('span').html(peakCounter)
        peakCounter++;
    })
    peakDataIndex = peakCounter;
    if (peakCounter - 1 >= 2) {
        $secondStep.css({
            'display': 'inline'
        })
    } else {
        $secondStep.css({
            'display': 'none'
        })
    }
    generateGraphMatrix(peakCounter - 1);
    drawResultMatrix(peakCounter - 1);
}
/*** CREATE/DELETE GRAPH PEAK END***/


/*** DRAW IN DIV RESULT MATRIX ***/
function drawResultMatrix(counter) {
    $resultMatrix.html("");
    var result = "";
    for (i = 0; i < counter; i++) {
        for (j = 0; j < counter; j++) {
            result += "  " + graphMatrix[i][j] + "  ";
            if (j == counter - 1)
                result += "<br>"
        }
    }
    $resultMatrix.html(result);
}
/*** DRAW IN DIV RESULT MATRIX END ***/


/*** ---- MODULE FOR NON DIRECTIONAL GRAPH ---- ***/

/*** ---- MODULE FOR NON DIRECTIONAL GRAPH END ---- ***/


/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */

/*** ---- MODULE FOR NON DIRECTIONAL GRAPH WITH VALUES---- ***/
function unbindDeleteFunctionFromPeaksModule2() {
    $('.graph-peak').each(function () {
        $(this).find('delete').remove()
        $(this).attr('onclick', "startLineModule2(this)");
    })
}
function startLineModule2(domObj) {

    if (fst == true) {
        fromPeak = $(domObj).attr('data-index')
        oldX = x;
        oldY = y;
        fst = false;
    }
    else {
        newX = x;
        newY = y;
        toPeak = $(domObj).attr('data-index')

        module2TakeValueOfWay(false)
    }
}
function module2TakeValueOfWay(taken) {
    if(taken == false){
        $('.way-value-input-block').css({
            'display':'block'
        })
        $('.way-value-input-block').focus();
    }else{

        var peakVal =  $('.way-value-input-block').find('input').val();

        transformGraphMatrix(fromPeak - 1, toPeak - 1, peakVal);
        drawResultMatrix(peakDataIndex - 1);
        drawLineModule2(oldX, newX, oldY, newY,peakVal);
        fst = true

        $('.way-value-input-block').css({
            'display':'none'
        })
    }
}
function drawLineModule2(oldX, newX, oldY, newY,val) {
    if (newX >= oldX) {
        widthX = newX - oldX;
    } else {
        widthX = oldX - newX;
    }
    if (newY >= oldY) {
        widthY = newY - oldY;
    } else {
        widthY = oldY - newY;
    }
    lineWidth = ~~(Math.sqrt((widthX * widthX) + (widthY * widthY)));
    lineRotateInRadian = Math.atan2(oldY - newY, oldX - newX);
    lineRotateInDegree = (lineRotateInRadian * 180) / Math.PI;
    midX = ( newX + oldX ) / 2;
    midY = ( newY + oldY ) / 2;
    $drawPlace.append('<span style="position: absolute;top: '+ (midY-30) +'px; left: '+ (midX-10) +'px">'+val+'</span>')
    var lineLeft = midX - (lineWidth / 2);
    $drawPlace.append("<div class = 'baseLine' style='width:" + lineWidth + "px;top:" + midY + "px;left:" + lineLeft + "px;transform:rotate(" + lineRotateInDegree + "deg)'></div>");

}


/**
 * This will hold visited peaks of graph
 * @type {Array}
 */
var visitedPeaks = [];
var plusInfinity = Number.POSITIVE_INFINITY;


/**
 * Parameter TO , to go back to FROM
 * @param to
 */
function calculateBestWayWithValues(to) {
    var currentValue = peakValues[to];
    for (j = 0; j < graphMatrix[0].length; j++) {
        if (graphMatrix[to][j] != 0 && peakValues[j] <= currentValue && visitedPeaks[j] != 'visited' ) {
            return j;
        }
    }
}

/*** ---- MODULE FOR NON DIRECTIONAL GRAPH WITH VALUES END ---- ***/

/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */

/*** ---- MODULE FOR BASIC GRAPH ---- ***/
function unbindDeleteFunctionFromPeaks() {
    $('.graph-peak').each(function () {
        $(this).find('delete').remove()
        $(this).attr('onclick', "startLine(this)");
    })
}
function startLine(domObj) {

    if (fst == true) {
        fromPeak = $(domObj).attr('data-index')
        oldX = x;
        oldY = y;
        fst = false
    }
    else {
        newX = x;
        newY = y;
        toPeak = $(domObj).attr('data-index')
        transformGraphMatrix(fromPeak - 1, toPeak - 1, 1)
        drawResultMatrix(peakDataIndex - 1);
        drawLine(oldX, newX, oldY, newY);
        fst = true
    }
}
function drawLine(oldX, newX, oldY, newY) {
    if (newX >= oldX) {
        widthX = newX - oldX;
    } else {
        widthX = oldX - newX;
    }
    if (newY >= oldY) {
        widthY = newY - oldY;
    } else {
        widthY = oldY - newY;
    }

    lineWidth = ~~(Math.sqrt((widthX * widthX) + (widthY * widthY)));
    lineRotateInRadian = Math.atan2(oldY - newY, oldX - newX);
    lineRotateInDegree = (lineRotateInRadian * 180) / Math.PI;
    midX = ( newX + oldX ) / 2;
    midY = ( newY + oldY ) / 2;
    var lineLeft = midX - (lineWidth / 2);
    $drawPlace.append("<div class = 'baseLine' style='width:" + lineWidth + "px;top:" + midY + "px;left:" + lineLeft + "px;transform:rotate(" + lineRotateInDegree + "deg)'></div>");

}

/**
 * Array for peak values in graph
 * @type {Array}
 */
var peakValues = [];
/**
 * In this array will store related peaks for next step
 * @type {Array}
 */
var peaks = [];

/**
 * This will store lengths from one to another peak of graph
 * @type {number}
 */
var wayLength = 0;

/**
 * This will hold the best way
 * @type {Array}
 */
var bestWayArray = []

function calcMinimalWay(from, to) {
    var correctFrom = from + 1;
    var correctTo = to + 1;
    if (graphMatrix[from][to] == 1) {
        alert("Shortest way is from->" + correctFrom + ":to->" + correctTo)
        return 0;
    }
    else {
        for (i = 0; i < graphMatrix[0].length; i++) {
            peakValues[i] = -1;
        }
        peakValues[from] = wayLength;
        peaks.push(from)


        /**
         * First part of algorithm is to calculate values of peaks
         */
        while (true) {

            wayLength++;
            peaks = calculatePeakValues(peaks, wayLength);

            var negativeVal = false;
            for (i = 0; i < peakValues.length; i++) {
                if (peakValues[i] == -1) negativeVal = true;
            }
            if (negativeVal == false)break;
        }
        console.log(peakValues)


        /**
         * Second part of algorithm is to find best way to given point
         *
         * first part is similar for graphs with types of 1 and 2
         *
         * so second part is different but simple if will solve this issue
         *
         *
         */

        if(graphType == 1) {
            /**
             * initialize visited peaks with infinity
             */
            for (i = 0 ; i < peakValues.length ; i++){
                visitedPeaks[i] = plusInfinity;
            }
            console.log(visitedPeaks);

            /**
             * find best way for type 1
             */
            bestWayArray.push(to + 1)
            visitedPeaks[to] = 'visited';
            while (true) {

                to = calculateBestWayWithValues(to);
                console.log(to)
                visitedPeaks[to] = 'visited';
                bestWayArray.push(to + 1)
                if (peakValues[to] == 0) {
                    break;
                }
            }
        }

        if(graphType == 2) {
            /**
             * find best way for type 2
             */
            bestWayArray.push(to + 1)
            while (true) {
                to = calculateBestWay(to);
                bestWayArray.push(to + 1)
                if (peakValues[to] == 0) {
                    break;
                }
            }
        }
        var way = "";
        for (i = bestWayArray.length - 1; i >= 0; i--) {
            if (i == 0) {
                way += bestWayArray[i] + ":"
            } else {
                way += bestWayArray[i] + "->"
            }
        }
        $('#calculated-best-way-result').html(way)
        moveBot()
    }
}
function calculatePeakValues(peaks, wayLength) {
    /**
     * To store related peaks of given peaks
     * @type {Array}
     */
    var buffer = [];

    for (i = 0; i < peaks.length; i++) {

        for (j = 0; j < graphMatrix[0].length; j++) {

            if (graphMatrix[peaks[i]][j] != 0) {

                if (peakValues[j] == -1) {

                    buffer.push(j)
                    if(graphType == 1)
                    peakValues[j] = parseInt(graphMatrix[peaks[i]][j])
                    if(graphType == 2)
                    peakValues[j] = parseInt(wayLength)
                }
            }
        }
    }
    return buffer;
}
/**
 * Parameter TO , to go back to FROM
 * @param to
 */
function calculateBestWay(to) {

    var currentValue = peakValues[to];
    for (j = 0; j < graphMatrix[0].length; j++) {
        if (graphMatrix[to][j] != 0 && peakValues[j] == currentValue - 1) {
            return j;
        }
    }
}
function dropAllValuesForBasicGraph() {
    peakValues = [];
    peaks = [];
    bestWayArray = []
    wayLength = 0;
    $drawPlace.find('#bot').remove();
}
/*** ---- MODULE FOR BASIC GRAPH END ---- ***/
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */
/****************************************************** */


/*** ---- MODULE FOR BOT ---- ***/
function moveBot() {
    var arrayCoordinates = [];
    for (i = bestWayArray.length - 1; i >= 0; i--) {
        $('.graph-peak').each(function () {
            if ($(this).data('index') == bestWayArray[i]) {
                $(this).css({
                    'background': 'yellow'
                });
                var top = $(this).position().top
                var left = $(this).position().left
                var c = [];
                c.push(top);
                c.push(left);
                arrayCoordinates.push(c)
            }
        })
    }

    var bot = "<div class='bot' id='bot'></div>"
    $('.bot').css({
        'display': 'block',
        'background': 'red'
    })
    $drawPlace.append(bot)

    var index = 0;
    var animBot = setInterval(function () {
        if (index == arrayCoordinates.length) clearInterval(animBot)

        animateBot(arrayCoordinates[index][0], arrayCoordinates[index][1])
        index++;
    }, 500)


    console.log(arrayCoordinates)
}
function animateBot(top, left) {
    $('.bot').animate({
        "top": top + "px",
        "left": left + "px"
    }, 500)
}
/*** ---- MODULE FOR BOT END ---- ***/

/*** FUNCTIONS END ***/