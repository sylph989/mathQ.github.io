function equationTemplateA(v1, v2, op, v3){
    let template = `<div class='row justify-content-center mb-1 question-row'><div class='col-auto d-print-none'><i class='answer-svg'></i></div>${getNo()}.` 
    + `<div class='col-4 border border-secondary d-flex align-items-center justify-content-end'>`
    + `<span class='question'>${v1} ${op} ${v2} =</span></div>`
    + `<div class='col-6'><div class='input-group'><input class='form-control keyin ' type='text' data-answer='${v3}'/>`
    + `<span class='answer d-none input-group-text addon'>${v3}</span>`
    + `</div></div></div>`;
    return template;
}
function equationTemplateADivide(v1, v2, op, v3, v4){
    let template = `<div class='row justify-content-center mb-1 question-row'><div class='col-auto d-print-none'><i class='answer-svg'></i></div>${getNo()}.` 
    + `<div class='col-4 border border-secondary d-flex align-items-center justify-content-end'>`
    + `<span class='question'>${v1} ${op} ${v2} =</span></div>`
    + `<div class='col-6 col-answer-root'>`
    + `<div class='row'><div class='input-group'>`
    + `<span class='input-group-text addon'>商數</span><input class='form-control keyin-quotient ' type='text' data-answer='${v3}'/>`
    + `<span class='answer d-none input-group-text addon'>${v3}</span></div></div>`
    + `<div class='row'><div class='input-group'>` 
    + `<span class='input-group-text addon'>餘數</span><input class='form-control keyin-remaining ' type='text' data-answer='${v4}'/>`
    + `<span class='answer d-none input-group-text addon'>${v4}</span></div></div>`
    + `</div></div>`;
    return template;
}
function answerTemplate(no, ans){
    let template = `<b>(${no}). ${ans}&nbsp;</b>`;
    return template;
}


var no = 0;
function getNo (){
    return (no+"").padStart(2, "0");
}
$(document).ready(function(){
    $("#mainForm").submit(function(e){
        e.preventDefault();
        let total = $("#numOfQuestion").val();
        let rowCnt = total / 2;
        let colCnt = 2;
        let len = $("#lenOfVariable").val();
        let sizeArray = new Array($("input[name='qStyle']").length);
        let typeSize = $("input[name='qStyle']:checked").length;
        
        //check
        if(typeSize == 0){
            alert('請選擇題目類型');
            return;
        }
        
        let remaining = total % typeSize;
        $("input[name='qStyle']:checked").each(function(idx, e){
            sizeArray[$(e).val()] = 0;
            if(remaining > 0){
                sizeArray[$(e).val()] += 1;
                remaining--;
            }
            sizeArray[$(e).val()] += parseInt(total / typeSize);
        });
        bShowAnswer = true;
        let generatedRow = genRow(rowCnt, colCnt, sizeArray, len);
        $("#layout").html(generatedRow["row"]);
        $("#layout_ans").html(generatedRow["row_ans"]);
    });
    var bShowAnswer = false;
    $("#btnShowAnswer").on("click", function(){
        //$(".question-row").removeClass("border border-success border-danger");
        $(".answer-svg").removeClass("fa-times-circle fa-check-circle correct wrong");
        if(bShowAnswer){
            //
            $(".answer").removeClass('d-none');
            $(".keyin").each(function(idx, e){
                let row = $(e).parent().parent().parent();
                let img = $(row.children()[0]).children("i");
                if($(e).attr('data-answer') == $(e).val()){
                    //row.addClass("border border-2 border-success");
                    img.addClass("fa-check-circle correct");
                }
                else{
                    //row.addClass("border border-2 border-danger");
                    img.addClass("fa-times-circle wrong");
                }
                
            });

            //divide
            $(".keyin-quotient").each(function(idx, e){
                let row = $(e).closest(".question-row");
                let img = row.find("i");
                let rem = $(e).closest(".col-answer-root").find(".keyin-remaining");
                if($(e).attr('data-answer') == $(e).val() && rem.length > 0 && rem.val() == rem.attr('data-answer')){
                    img.addClass("fa-check-circle correct");
                }
                else{
                    img.addClass("fa-times-circle wrong");
                }
                
            });
        }
        else{
            $(".answer").addClass('d-none');
        }
        bShowAnswer = !bShowAnswer;
        
    });

    $("#btnPrint").on("click", function(){
        window.print();
    });

});

function genRow(rowCnt, colCnt, qArray, len){
    let row = "<div class='row'>";
    let row_ans = "<div class='row'>";
    let c = 0;
    no = 0;
    for(let i = 0; i< qArray.length; ++i){
        for(let j =0; j< qArray[i]; ++j){
            no++;
            let a = getRandomInt(1, Math.pow(10, len)-1);
            let b = getRandomInt(1, Math.pow(10, len)-1);
            row += `<div class='col'>`
                + `${i == 0 ? genAdd(a,b): 
                    (i == 1 ? genSubstract(a,b) :
                    (i == 2 ? genMultiple(a,b) : genDivide(a,b)))}`
                +`</div>`;
            ++c;
            if(c % colCnt == 0){
                row += `</div><div class='row avoid-break'>`;
                c = 0;
            }

            //ans
            let ans = i == 0 ? a+b: 
                    (i == 1 ? a-b :
                    (i == 2 ? a*b : `${Math.floor(a/b)}, ${a%b}`));
            row_ans += `<div class='col-2'>${answerTemplate(no, ans)}</div>`;
        }
    }
    row += `</div>`;
    row_ans += `</div>`;
    return {row, row_ans};
}

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min+1) + min);
}

function genAdd(a, b, len){
    return equationTemplateA(a, b, "+", a + b, 1);
}

function genSubstract(a, b, len){
    if(a < b) return genSubstract(b, a, len);
    return equationTemplateA(a, b, "-", a - b);
}

function genMultiple(a, b, len){
    return equationTemplateA(a, b, "*", a * b);
}

function genDivide(a, b, len){
    return equationTemplateADivide(a, b, "/", Math.floor(a / b), a % b);
}