var approvedProductName = "";
var approvedProductId = 0;
var approvedTransactionId = 1;
var dbColsCount = 0;
var prodCount = 0;
var SupportTHRESHOLDmain = 0;
var matrixOfPassedProducts = [];


$tableHeader = $('.apriori-db-header')
$transactionLines = $('.transaction-lines')
$productAppendingPlace = $('.products-list')
$productAppend = $('.append-product')
$transactionAppend = $('.append-transaction')
$calculator = $('.calculate-rules')
$productFrequency = $('.product-frequency')
checkIfCanAddTransaction();

$(document).ready(function () {

    $productAppend.click(function () {

        var child = "<li>" +
            "<span><input type='text'></span> " +
            "<span class='approve-product' onclick='approveProduct(this," + approvedProductId + ")'>✔</span> " +
            "<span class='delete-product' onclick='deleteProduct(this," + approvedProductId + ")'>X</span> " +
            "</li>";
        approvedProductId++;
        $productAppendingPlace.append(child)
        prodCount = $productAppendingPlace.find('.approvedProduct').length
    })

    $transactionAppend.click(function () {
        //generate td's
        var mainTd = '';
        $tableHeader.find('th').each(function () {
            if ($(this).attr('id') != "start") {
                var id = $(this).attr('id');
                mainTd += '<td class="product-' + id + '-checkPlace"><input type="checkbox" class="' + $(this).html() + '' + id + '"></td>'
            }
        })


        var transactionDeleter = " <span class='transaction-deleter' onclick='deleteTransaction(this)'>X</span>  "
        var line = '<tr class="appended-transaction-line"><td>' + approvedTransactionId + '' + transactionDeleter + '</td>' + mainTd + '</tr>'
        $transactionLines.append(line)
        approvedTransactionId++;
    })

})

function deleteProduct(a, id) {
    $(a).parents("li").remove()
    $tableHeader.find('th').each(function () {
        if ($(this).attr('id') == id) {
            $(this).remove()
        }
    })
    prodCount = $productAppendingPlace.find('.approvedProduct').length
    $transactionLines.find('tr').each(function () {
        $(this).find('td').each(function () {
            if ($(this).hasClass('product-' + id + '-checkPlace')) {
                $(this).remove()
            }
        })
    })

    checkIfCanAddTransaction()

}
function approveProduct(a, id) {
    var val = $(a).parents("li").find('input').val()

    if (val.length > 0) {
        $(a).parents("li").addClass('approvedProduct')

        var prod = "<span class='approved-product'>" + val + "</span>"
        var header = "<th id=" + id + ">" + val + "</th>"
        $(a).parents("li").find('span').eq(0).html(prod)
        $(a).parents("li").find('span').eq(2).remove()
        $tableHeader.append(header)
        $transactionLines.find('tr').each(function () {

            if ($(this).find('td').length != prodCount - 1) {
                var mainTd = '<td class="product-' + id + '-checkPlace"><input type="checkbox" class="' + val + '' + id + '"></td>'
                $(this).append(mainTd)
            }
        })
        prodCount = $productAppendingPlace.find('.approvedProduct').length
        checkIfCanAddTransaction()
    }

}
function checkIfCanAddTransaction() {
    if (prodCount > 1) {
        $transactionAppend.css({'display': 'block'})
    } else {
        $transactionAppend.css({'display': 'none'})
    }
}
function deleteTransaction(a) {
    $(a).parents("tr").remove()
}

function calculateMinimumTHRESHOLD() {
    var transactionCount = $transactionLines.find('tr').length
    var SupportTHRESHOLD = $('.treshold-input').val();
    var res = 0;
    if (SupportTHRESHOLD > 0 && transactionCount > 1) {
        res = (transactionCount * SupportTHRESHOLD) / 100;
        SupportTHRESHOLDmain = res;
        $('.minimum-frequency').find('span').html(res)
        $productFrequency.html("")

        var arrayOfPassedProducts = [];
        $tableHeader.find('th').each(function () {
            var prodCheckCount = 0;
            if ($(this).attr('id') != "start") {
                var prodName = $(this).html();
                var id = $(this).attr('id')
                $transactionLines.find('td').each(function () {
                    if ($(this).hasClass('product-' + id + '-checkPlace')) {
                        if ($(this).find('input').is(':checked')) {
                            prodCheckCount++;
                        }
                    }

                })

                var line = "";
                if (prodCheckCount >= res) {
                    arrayOfPassedProducts.push(id)
                    line = " <tr><td style='border-right: 1px solid black' class='product-"+id+"'>" + prodName + "</td><td><span class='good-freq'>" + prodCheckCount + "</span></td></tr>"
                } else {
                    line = " <tr><td style='border-right: 1px solid black' class='product-"+id+"'>" + prodName + "</td><td><span class='bad-freq'>" + prodCheckCount + "</span></td></tr>"
                }
                $productFrequency.append(line)
            }
        })


        for (i = 0; i < arrayOfPassedProducts.length; i++) {
            matrixOfPassedProducts[i] = [];
        }
        for (i = 0; i < arrayOfPassedProducts.length; i++) {
            for (j = 0; j < 1; j++) {
                matrixOfPassedProducts[i][j] = arrayOfPassedProducts[i];
            }
        }

        var bufferResult = [];

        var result = makePairs(matrixOfPassedProducts);
        while (true) {
            if (result.length != 0) {
                bufferResult = result;
                result = makePairs(result)
            } else {
                break;
            }
        }

        var theMostFrequentItemSet = "ItemSet - {";
        $('.most-frequent-set').html("");


        for (i = 0 ; i < bufferResult.length ; i ++){
            for (j = 0 ; j < bufferResult[i].length ; j ++){
                //console.log(bufferResult[i][j])
                if(undefined != bufferResult[i][j]) {
                    $productFrequency.find('td').each(function () {
                        if ($(this).hasClass('product-' + bufferResult[i][j])) {
                            if(j == bufferResult[i].length-1){
                                theMostFrequentItemSet += " " + $(this).html() + " }"
                            }else
                            theMostFrequentItemSet += " " + $(this).html() + ","
                        }
                    })
                }
            }
            $('.most-frequent-set').append('<hr>')
            $('.most-frequent-set').append(theMostFrequentItemSet+"<br>")
            $('.most-frequent-set').append('<hr>')
            theMostFrequentItemSet = "ItemSet - {";
        }

    } else {
        if (SupportTHRESHOLD == 0 && transactionCount == 0) {
            alert('type Support THRESHOLD and You don"t have transactions')
        }
        else if (SupportTHRESHOLD == 0) {
            alert('type Support THRESHOLD')
        }
        else if (transactionCount == 0) {
            alert('You don"t have transactions')
        }
    }
}


function makePairs(matrix) {
    var uniqueMatrix = [];
    var returningMatrix = [];
    var union = [];
    var uniqueArray = [];
    for (i = 0; i < matrix.length; i++) {
        for (j = i + 1; j < matrix.length; j++) {


            for (f = 0; f < matrix[i].length; f++) {
                union.push(matrix[i][f])
            }
            for (f = 0; f < matrix[j].length; f++) {
                union.push(matrix[j][f])
            }


            for (m = 0; m < union.length; m++) {
                for (n = 0; n < union.length; n++) {
                    if (union[m] == union[n] && m != n) {
                        union[n] = "";
                    }
                }
            }

            for (m = 0; m < union.length; m++) {
                if (union[m] == "")continue;
                uniqueArray.push(union[m]);
            }

            returningMatrix.push(uniqueArray);
            union = [];
            uniqueArray = [];
        }
    }

    for (i = 0; i < returningMatrix.length; i++) {
        if (returningMatrix[i] == "")continue;

        for (j = i + 1; j < returningMatrix.length; j++) {
            if (_.isEqual(returningMatrix[i], returningMatrix[j])) {
                returningMatrix[j] = "";
                continue;
            } else {
                if (returningMatrix[i].length != returningMatrix[j].length || returningMatrix[j] == "") {
                    continue;
                } else {
                    var matches = 0;
                    for (m = 0; m < returningMatrix[i].length; m++) {
                        for (n = 0; n < returningMatrix[j].length; n++) {
                            if (returningMatrix[i][m] == returningMatrix[j][n]) {
                                matches++;
                                break;
                            }
                        }
                    }

                    if (matches == returningMatrix[i].length) {
                        returningMatrix[j] = "";
                    }
                }
            }
        }
    }

    for (m = 0; m < returningMatrix.length; m++) {
        if (returningMatrix[m] == "")continue;
        uniqueMatrix.push(returningMatrix[m])
    }

    uniqueMatrix = scanDbResults(uniqueMatrix);

    return uniqueMatrix;
}


function scanDbResults(matrix) {
    var itemSetFrequency = 0;

    for (m = 0; m < matrix.length; m++) {
        var checkingCount = 0;

        $transactionLines.find('tr').each(function () {

            var itemSetLength = matrix[m].length;

            for (n = 0; n < itemSetLength; n++) {

                $(this).find('td').each(function () {

                    if ($(this).hasClass('product-' + matrix[m][n] + '-checkPlace')) {

                        if ($(this).find('input').is(':checked')) {
                            checkingCount++;
                            return true;
                        }

                    }

                })

            }
            if (checkingCount == itemSetLength) {
                itemSetFrequency++;
            }
            checkingCount = 0;
        })


        if (itemSetFrequency < SupportTHRESHOLDmain) {
            matrix[m] = "";
        }
        itemSetFrequency = 0;
        checkingCount = 0;
    }

    var finalizedMatrix = [];

    for (m = 0; m < matrix.length; m++) {
        if (matrix[m] == "")continue;

        finalizedMatrix.push(matrix[m])
    }
    return finalizedMatrix;
}