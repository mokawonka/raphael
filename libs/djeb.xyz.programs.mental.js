$(document).ready(function () {

    var list = document.getElementById('pcscenarios');

    var scenarios = document.getElementsByTagName('scenario');
    var powercards = document.getElementsByTagName('powercard');

    var nbofscenarios = scenarios.length;
    var nbofpowercards = powercards.length;

    // Power cards
    for (var f = 0; f < nbofpowercards; f++) {
        $(powercards[f]).addClass('d-none');

        var _id = 'pc' + f;
        var _contentid = 'pccontent' + f;
        var elem = "<div class=accordion-item> \
        <h2 class=accordion-header id=" + _id + ">  \
        <button class=\"accordion-button collapsed\" type=button data-bs-toggle=collapse \
        data-bs-target=#" + _contentid + " aria-expanded=false aria-controls=" + _contentid + "> " + "<img class=cardicon src='media/card_icon.png'>" +
            $(powercards[f]).attr('title') + " </button> </h2> \
        <div id=\"" + _contentid + "\" class=\"accordion-collapse collapse\" aria-labelledby=" + _id + "> \
            <div class=accordion-body>  <br>" + $(powercards[f]).html() + "</div> </div> \
        </div>";

        list.innerHTML += elem;
    }


    for (var s = 0; s < nbofscenarios; s++) {
        // hiding handwritten content
        $(scenarios[s]).addClass('d-none');

        var msgdependingoncontent = '';
        if($(scenarios[s]).hasClass("sensitive"))
        {
            msgdependingoncontent = '<div class="text-center" style="color:red"><img class=sensitiveimg src="media/content/dicaprio_meme.jpg"><br><br> \
                            <p>This scenario contains content that may disturb sensitive people.</p> <br> \
                            <button class="btn btn-danger warning-button"> I understand </button> </div>' + "<div class='scontent d-none'>" + $(scenarios[s]).html() + "</div>";
        }
        else msgdependingoncontent = "<div class='scontent'>" + $(scenarios[s]).html() + "</div>";

        var _id = 'scenario' + s;
        var _contentid = 'content' + s;
        var elem = "<div class=accordion-item> \
        <h2 class=accordion-header id=" + _id + ">  \
        <button class=\"accordion-button collapsed\" type=button data-bs-toggle=collapse \
        data-bs-target=#" + _contentid + " aria-expanded=false aria-controls=" + _contentid + "> " + "<img class=cardicon src='media/scenario_icon.png'>" +
            $(scenarios[s]).attr('title') + " </button> </h2> \
        <div id=\"" + _contentid + "\" class=\"accordion-collapse collapse\" aria-labelledby=" + _id + "> \
            <div class=accordion-body> <br>" + msgdependingoncontent + "</div> </div> \
        </div>";

        list.innerHTML += elem;
    }

    // uncollapsing event
    $('.accordion-button').on('click',function(){
        if($(this).parent().attr('id').indexOf('scenario') != -1)
        {
            // prepending problem title
            var problem = $(this).parent().parent().find('.problem');
            if(!problem.find('hr').length)
            {
                problem.prepend('<hr>');
                problem.prepend('<b>Problem</b>');
            }

        }
    });


    // Adding [see analysis/solution] buttons to scenarios
    var items = document.getElementsByClassName('accordion-item');
    for (var s = 0; s < items.length; s++) 
    {
        // if scenario (not powercard snippet)
        if($(items[s]).find('.accordion-header').attr('id').indexOf('scenario') != -1)
        {
            var scontent = $(items[s]).find('.scontent');
            var solution = $(items[s]).find('.solution');
            var problem  = $(items[s]).find('.problem');
            var analysis = $(items[s]).find('.analysis');

            if(solution.length)
            {
                scontent.append('<button class="viewsolution scenariobuts btn btn-warning"> See Solution </button>');
            }

            if(problem.length)
            {
                if(solution.length) problem.remove().insertAfter(solution);
            }

            if(analysis.length)
            {
                scontent.append('<button class="viewanalysis scenariobuts btn btn-primary"> See Analysis </button>');
                if(problem.length) analysis.remove().insertAfter(problem);
            }
        }
    }

    // buttons coloring
    var buts = $(".accordion-button");
    for (var i = 0; i < buts.length; i++) {
        var r = 0; var g = 0; var b = 0;

        if ($(buts[i]).parents()[0].id.search("pc") >= 0) {
            r = 55; g = 55; b = 55;
        }

        if ($(buts[i]).parents()[0].id.search("scenario") >= 0) {
            r = 150; g = 150; b = 150;
        }
        buts[i].style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
    }

    // I understand button
    $('.warning-button').click(function(){
        $(this).parent().hide();
        $(this).parent().parent().find('.scontent').removeClass('d-none');
    });

    // Show scenario solution
    $('.viewsolution').click(function(){
        $(this).hide();
        var solution = $(this).parent().find('.solution');
        solution.prepend('<hr>');
        solution.prepend('<b>Solution</b>');

        var img = $(solution).find('.solutionimg');
        img.attr('src', img.attr('data-src'));

        solution.show();
    });

    // Show scenario analysis
    $('.viewanalysis').click(function(){
        $(this).hide();

        var analysis = $(this).parent().find('.analysis');
        analysis.prepend('<hr>');
        analysis.prepend('<b>Analysis</b>');

        var allanalysisimgs = analysis[0].getElementsByClassName('analysisimg');
        for(var a = 0 ; a < allanalysisimgs.length; a++)
        {
            var img = $(allanalysisimgs[a]);
            img.attr('src', img.attr('data-src'));
        }

        analysis.show();
    });


    // display image on modal when clicking on it
    $(document).on('click', 'img' ,function(){
        $('#imagepreview').attr('src', $(this).attr('src'));
        $('#imagemodal').modal('show');
    });


});