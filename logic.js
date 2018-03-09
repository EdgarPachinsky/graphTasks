/***************** */
/*** GRAPH TASKS ***/
/**
 * version v0.3
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
    if (graphType == 1) {
        graphMatrix[from][to] = value;
    }
    if (graphType == 2) {
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




/*** ---- MODULE FOR NON DIRECTIONAL GRAPH ---- ***/

/*** ---- MODULE FOR NON DIRECTIONAL GRAPH END ---- ***/


/*** ---- MODULE FOR BASIC GRAPH ---- ***/
function unbindDeleteFunctionFromPeaks() {
    $('.graph-peak').each(function () {
        $(this).find('delete').remove()
        $(this).attr('onclick', "startLine(this)");
    })
}

var fromPeak = null;
var toPeak = null;
var fst = true;

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
         */
        bestWayArray.push(to + 1)
        while (true) {
            to = calculateBestWay(to);
            bestWayArray.push(to + 1)
            if (peakValues[to] == 0) {
                break;
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
        moveBot(0, 0)
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

            if (graphMatrix[peaks[i]][j] == 1) {

                if (peakValues[j] == -1) {
                    buffer.push(j)
                    peakValues[j] = wayLength
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
        if (graphMatrix[to][j] == 1 && peakValues[j] == currentValue - 1) {
            return j;
        }
    }
}

function dropAllValuesForBasicGraph() {
    peakValues = [];
    peaks = [];
    bestWayArray = []
    wayLength = 0;
}
/*** ---- MODULE FOR BASIC GRAPH END ---- ***/


/*** ---- MODULE FOR BOT ---- ***/
function moveBot(top, left) {


    for (i = 0; i < bestWayArray.length; i++) {
        $('.graph-peak').each(function () {
            if ($(this).data('index') == bestWayArray[i]) {
                $(this).css({
                    'background': 'yellow'
                });
            }
        })
    }
}

/*** ---- MODULE FOR BOT END ---- ***/


/*** FUNCTIONS END ***/