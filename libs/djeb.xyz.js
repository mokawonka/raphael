

class Guid {

    static Empty = "00000000-0000-0000-0000-000000000000";

    static newGuid() {

        return  Array.from(Date.now() + String(Math.round(Math.random() * (999 - 100) + 100)),(x, i) => {

            return (x + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[~~(Math.random() * 52)] +
                (i == 3 || i == 5 || i == 7 || i == 9 ? "-" : "")
            )

        }).join("");
    }
}

async function translate(tobetranslated, target) {

	console.log(target);
	const res = await fetch("https://translate.argosopentech.com/translate", {
		method: "POST",
		body: JSON.stringify({
			q: tobetranslated,
			source: 'auto',
			target: target,
			format: "text"
		}),
		headers: { "Content-Type": "application/json" }
	});

	var translated = await res.json();
	var ttranslated = JSON.stringify(translated);
	var tt = JSON.parse(ttranslated);
	var ttt = tt.translatedText;

	// hiding translation button
	// $('#loadspinner').hide();

	var final_translation_text = ttt;

	$('#translation_div').text(final_translation_text);

	return 0;
}


function getSelected() {

	if(window.getSelection)  return window.getSelection().toString(); 
	else if(document.getSelection) return document.getSelection().toString(); 
	else
	{
		var selection = document.selection && document.selection.createRange();
		if(selection.text)  return selection.text; 

		return false;
	}
}


$('body').on("mouseup touchend", function(event)
{
	var selection = getSelected();
	selection = $.trim(selection);

	if(selection != '' && !$('#highlightmodal').is(':visible'))
	{
		var value = selection;

		$('#highlight').text(value);
		$("#copytext").text("Copy");

		$('#highlightmodal').modal('show');
		window.getSelection()?.removeAllRanges();
	}
});

// when we hide the modal
$('#highlightmodal').on('hidden.bs.modal', function () {
	//reset
	$("#copytext").text("Copy");
	$("#tolang").text("to");
	$("#translation_div").text("")
	$('#trbody').addClass('d-none');
});

function copytoclip (content) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.removeAllRanges();
    selection.addRange(range);
    const listener = (e) => {
        e.clipboardData.setData("text/html", content);
        e.clipboardData.setData("text/plain", content);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
    selection.removeAllRanges();
}


// copying text to clipboard
$('#highlightmodal').on('click', '#copytext', function(){
	copytoclip($('#highlight').text());
	$(this).text("Copied");
});

// display the div
$('#highlightmodal').on('click', '#translatetext', function(){
	$('#trbody').removeClass('d-none');
});


function changetolang(item, trto) {

	document.getElementById("tolang").innerHTML = item.innerHTML;
	var translationdiv = $('<div id=translation_div>');
	$('#trbody').append(translationdiv[0]);


	if($('#trbody').find('#loadspinner').length == 0){
		$('#translation_div').prepend('<div class=text-center><span id="loadspinner" class="spinner-grow" role="status" aria-hidden="true"></span></div>');
	}
	else $('#loadspinner').show();

	var rc = translate($('#highlight').text(), trto);
}


function colorizeChars(element){

    var chars = $(element).text().split('');
    $(element).html('');
    for(var i=0; i<chars.length; i++)
    {
        var r = Math.floor(Math.random()*255);
        var g = Math.floor(Math.random()*255);
        var b = Math.floor(Math.random()*255);

        var span = $('<span>' + chars[i] + '</span>').css("color", "rgb("+r+", "+g+", "+b+")");
        $(element).append(span);
    }

}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight)-30;
}


function displayContent(element){
    // display div
    $(element).css("display", "block");

	// ignoring gifs
	if($(element).find('img').parent().hasClass('gif')) return;
	
	// display all images within div
	var nbOfImgs = element.getElementsByTagName('img').length;
	if(nbOfImgs > 0)
	{
		
		// load images
		for(var i=0; i < nbOfImgs; i++){
			$(element.getElementsByTagName('img')[i]).attr("src", $(element.getElementsByTagName('img')[i]).attr("data-src"));
		}
	}
}

function hideContent(element){
    // hide div
    $(element).css("display", "none");

	// ignoring gifs
	if($(element).find('img').parent().hasClass('gif'))  return;
		
	// hide all images within div to save bandwidth
    var nbOfImgs = element.getElementsByTagName('img').length;
    if(nbOfImgs > 0)
    {
        // unload images
        for(var i=0; i < nbOfImgs; i++){
			$(element.getElementsByTagName('img')[i]).attr("data-src", $(element.getElementsByTagName('img')[i]).attr("src"));			
        }
    }
}

function hideallposts(){
	for (var i = 0; i < nbOfPosts; i++)
	{
		hideContent(postlist[i]);
	}
}



////////////////////////////////////////////////////////////////
//                      Search
////////////////////////////////////////////////////////////////
;(function (window, document, undefined) {

	'use strict';

	var form = document.querySelector('#form-search');
	var input = document.querySelector('#input-search');
	var resultList = document.querySelector('#search-results');

	/**
	 * Create the HTML for each result
	 * @param  {Object} article The article
	 * @param  {Number} id      The result index
	 * @return {String}         The markup
	 */
	var createHTML = function (article, id) {

        var html = '<div>' + article.content + '</div>';

		return html;
	};

	/**
	 * Create the markup when no results are found
	 * @return {String} The markup
	 */
	var createNoResultsHTML = function () {
		return '<a href="index.html" class=small>Go Back</a><p>Sorry, no matches were found.</p>';
	};

    var createShortQueryHTML = function () {
		return '<a href="index.html" class=small>Go Back</a><p>Query is too short.</p>';
	};

	/**
	 * Create the markup for results
	 * @param  {Array} results The results to display
	 * @return {String}        The results HTML
	 */
	var createResultsHTML = function (results) {
		var html = '<a href="index.html" class=small>Go Back</a><p>Found ' + results + ' matching</p>';
		return html;
	};

	/**
	 * Search for matches
	 * @param  {String} query The term to search for
	 */
	var search = function (query) {

        if(query.length < 2){
            resultList.innerHTML = createShortQueryHTML();
            return;
        }

		// disabled scrolling/browsing mode
		browsingmode = false;

		hideallposts();

		// Search the content
        var cpt = 0;
        for(var i=0; i<postlist.length; i++){
            if(postlist[i].innerHTML.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                displayContent(postlist[i]);
                cpt++;
            }
        }
                                        
        resultList.innerHTML = createResultsHTML(cpt);

		// highlighting results
		var searchTerm = query;
		$('#memory *').contents()
			.filter(function () { 
				return this.nodeType == 3 
					&& this.nodeValue.indexOf(searchTerm) > -1; 
			})
			.replaceWith(function () {
				var i, l, $dummy = $("<span>"),
					parts = this.nodeValue.split(searchTerm);
				
				for (i=0, l=parts.length; i<l; i++) {
				
					$dummy.append(document.createTextNode(parts[i].substring(parts[i].indexOf(" "))));
				
					if (i < l - 1) {

						var newtext = $("<span>", {text: searchTerm+parts[i+1].split(/[.,!,?,:,;,,, ,+,*]/)[0]}).css('background-color', "yellowgreen");
						$dummy.append(newtext);
					}
				}
				return $dummy.contents();
			});
	};

	/**
	 * Handle submit events
	 */
	var submitHandler = function (event) {
		event.preventDefault();
		search(input.value);
	};

	/**
	 * Remove site: from the input
	 */
	var clearInput = function () {
		input.value = input.value.replace(' site:your-domain.com', '');
	};


	//
	// Inits & Event Listeners
	//

	// Make sure required content exists
	if (!form || !input || !resultList) return;

	// Clear the input field
	clearInput();

	// Create a submit handler
	form.addEventListener('submit', submitHandler, false);

})(window, document);