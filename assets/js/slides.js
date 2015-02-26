/**
 * Created by kintesh on 17/02/15.
 */

var Slides = (function($) {

    var TYPES = {
        SLIDE: 1,
        ELEM: 2
    };

    var CSS_SLIDES = "./slides_assets/css/slides.css",
        CSS_FONTAWESOME = "./slides_assets/css/font-awesome.css",
        JS_MATHJAX = "./slides_assets/js/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML";

    var list = [], curr = -1, slides, currSlide, sBar,
        rawSlides, currRawSlide = -1, slidesConsoleWindow, consoleCurrView, consoleNextView,
        startTime, currSlideStartTime, helpMenu;

    function init() {
        setupProgressbar();
        setupControls();
        setupHelp();
        setupSlides();
        //console.log("list length: " + list.length);
        startTime = Date.now();
        nextItem();
    }

    function setupSlides() {
        rawSlides = $(".slide").clone();
        slides = $(".slide").addClass("slide_hidden");
        slides.each(function(e) {
            list.push({
                type: TYPES.SLIDE,
                slide: slides[e]
            });
            var cList = $(slides[e]).find(".controlElem");
            cList.each(function(ce) {
                var nextElem = $(cList[ce]).next(),
                    nextElemChildren = nextElem.find("li"),
                    props = JSON.parse(cList[ce].innerHTML);
                if (props.hasOwnProperty("visibility")) {
                    props.visibility = "";
                    processCElemReveal(nextElem, nextElemChildren, props);
                } else {
                    processCElem(nextElem, nextElemChildren, props);
                }
            });
        });
    }

    function processCElemReveal(nextElem, nextElemChildren, props) {
        if (nextElemChildren.length != 0) {
            nextElemChildren.each(function(ch) {
                list.push({
                    type: TYPES.ELEM,
                    elem: $(nextElemChildren[ch]).addClass("controlled_elem hide_elem"),
                    props: props
                });
            });
        } else {
            list.push({
                type: TYPES.ELEM,
                elem: nextElem.addClass("controlled_elem hide_elem"),
                props: props
            });
        }
    }

    function processCElem(nextElem, nextElemChildren, props) {
        if (nextElemChildren.length != 0) {
            nextElemChildren.each(function(ch) {
                list.push({
                    type: TYPES.ELEM,
                    elem: $(nextElemChildren[ch]).addClass("controlled_elem"),
                    props: props
                });
            });
        } else {
            list.push({
                type: TYPES.ELEM,
                elem: nextElem.addClass("controlled_elem"),
                props: props
            });
        }
    }

    function nextItem() {
        if(curr+1 < list.length) {
            var temp = list[curr+1];
            if(temp.type === TYPES.SLIDE) {
                showSlide(curr+1);
            } else if(temp.type === TYPES.ELEM) {
                revealElem(temp);
            }
            curr++;
        }
    }


    function previousItem() {
        if(curr-1 > -1) {
            var temp = list[curr-1];
            if(temp.type === TYPES.SLIDE) {
                if(list[curr].type !== TYPES.ELEM) {
                    showSlide(curr-1);
                } else {
                    hideElem(list[curr])
                }
            } else if(temp.type === TYPES.ELEM) {
                var parentSlide = getElemSlide(curr-1);
                if(parentSlide != currSlide) {
                    showSlide(parentSlide);
                } else {
                    hideElem(list[curr])
                }
            }
            curr--;
        }
    }

    function showSlide(index) {
        var prev = getPreviousSlide(index-1),
            next = getNextSlide(index+1);
        //console.log("Curr: "+ curr +"SLIDE:" + index + "  Previous:" + prev + "  Next:" + next);
        slides.removeClass("slide_previous slide_next")
            .addClass("slide_hidden");
        if(prev != undefined) {
            $(list[prev].slide).removeClass("slide_hidden slide_previous slide_current slide_next")
                .addClass("slide_previous");
        }
        if(next != undefined) {
            $(list[next].slide).removeClass("slide_hidden slide_previous slide_current slide_next")
                .addClass("slide_next");
        }
        $(list[index].slide).removeClass("slide_hidden slide_previous slide_current slide_next")
            .addClass("slide_current");
        $("body").css("background-color", list[index].slide.style.backgroundColor);
        updateCurrRawSlide(index);
        currSlide = index;
        currSlideStartTime = Date.now();
    }

    function revealElem(cElem) {
        if(cElem.props.hasOwnProperty("visibility")) {
            $(cElem.elem).removeClass("hide_elem")
                .addClass("reveal_elem")
                .css(cElem.props);
        } else {
            $(cElem.elem).css(cElem.props);
        }
    }

    function hideElem(cElem) {
        if(cElem.props.hasOwnProperty("visibility")) {
            $(cElem.elem).removeClass("reveal_elem")
                .addClass("hide_elem")
                .css(cElem.props);
        } else {
            var nProps = {};
            $.each(cElem.props, function(prop) {
                nProps[prop] = "";
            });
            $(cElem.elem).css(nProps);
        }
    }

    function getElemSlide(index) {
        for (;index>=0;index--) {
            if(list[index].type == TYPES.SLIDE) {
                return index;
            }
        }
    }

    function getPreviousSlide(index) {
        for (;index>=0;index--) {
            if(list[index].type == TYPES.SLIDE) {
                return index;
            }
        }
    }

    function getNextSlide(index) {
        for (;index<list.length;++index) {
            if(list[index].type == TYPES.SLIDE) {
                return index;
            }
        }
    }

    function setupProgressbar() {
        $("<div id=\"sBar\" class=\"sBar\"></div>").appendTo("body");
        sBar = $("#sBar");
    }

    function updateProgressbar() {
        sBar.width(((curr)/(list.length-1))*100 + "vw");
    }

    function setupControls() {
        $("<div id=\"sControls\" class=\"sControls\">\n" +
        "<div id=\"cBtn_Previous\" class=\"cBtn\"><i class=\"fa fa-backward\"></i><span>Previous</span></div>" +
        "<div id=\"cBtn_Next\" class=\"cBtn\"><i class=\"fa fa-forward\"></i><span>Next</span></div>" +
        "<div id=\"cBtn_Screen\" class=\"cBtn\"><i class=\"fa fa-expand\"></i><span>Full Screen</span></div>" +
        "<div id=\"cBtn_Console\" class=\"cBtn\"><i class=\"fa fa-th-large\"></i><span>Console</span></div>" +
        "<div id=\"cBtn_Help\" class=\"cBtn\"><i class=\"fa fa-life-ring\"></i><span>Help</span></div>" +
        "</div>").appendTo("body").animate({opacity:"0"}, 2000);

        $("#cBtn_Previous" ).click(function() {
            previous();
        });

        $("#cBtn_Next" ).click(function() {
            next();
        });

        $("#cBtn_Screen" ).click(function() {
            toggleFullScreen();
        });

        $("#cBtn_Console" ).click(function() {
            openConsole();
        });

        $("#cBtn_Help" ).click(function() {
            toggleHelp();
        });
    }

    function setupHelp() {
        helpMenu = $("<div id=\"sHelp\" class=\"sHelp\">" +
        "Use keybord to navigate.<span id=\"hBtn_close\" class=\"btn_close\"><i class=\"fa fa-times\"></i></span><br>" +
        "<img src=\"./slides_assets/images/help.png\"></div>").appendTo("body").delay(2000).fadeOut("slow");

        $("#hBtn_close").click(function() {
            toggleHelp();
        });
    }

    function toggleHelp() {
        helpMenu.fadeToggle("slow");
    }

    function next() {
        nextItem();
        updateProgressbar();
    }

    function previous() {
        previousItem();
        updateProgressbar();
    }


    /**
     * Slides Console
     */
    function updateCurrRawSlide(index) {
        if(currSlide == undefined)
            currRawSlide++;
        else {
            if (index > currSlide)
                currRawSlide++;
            else
                currRawSlide--;
        }
        updateConsole();
    }

    function openConsole() {
        var consoleWindowHTML = "" +
            "<!DOCTYPE html><html><head><title>Slides Console</title><meta charset=\"UTF-8\">" +
            "<link rel=\"stylesheet\" href="+CSS_SLIDES+">" +
            "<link rel=\"stylesheet\" href="+CSS_FONTAWESOME+">" +
            "</head><body>" +
            "<div id=\"block\" class=\"block\"><i class=\"fa fa-cog fa-spin\"></i> Loading...</div>"+
            "<div class=\"console-top_controls\">"+
            "<div id=\"btn_prev\" class=\"btn console-btn_prev\">"+
            "<div class=\"cBtn\"><i class=\"fa fa-backward\"></i><span>Previous</span></div>" +
            "</div>"+
            "<div id=\"btn_next\" class=\"btn console-btn_next\">"+
            "<div class=\"cBtn\"><i class=\"fa fa-forward\"></i><span>Next</span></div>" +
            "</div>"+
            "</div>"+
            "<div class=\"console-views\">" +
            "<iframe id=\"view_curr\" class=\"console-view_curr\">Current Slide</iframe>"+
            "<iframe id=\"view_next\" class=\"console-view_next\">Next Slide</iframe>"+
            "</div>"+
            "<div class=\"console-tools\">" +
            "<div id=\"today\" class=\"today\">Wednesday, 18 February 2015</div>" +
            "<div class=\"durations\">" +
            "<div class=\"duration\"><span id=\"dur_slide\" class=\"duration-time\">--:--:--</span><br><span class=\"duration-lbl\">Slide</span></div>"+
            "<div class=\"duration\"><span id=\"dur_total\" class=\"duration-time\">--:--:--</span><br><span class=\"duration-lbl\">Total</span></div>" +
            "</div>"+
            "</div>"+
            "</body></html>";

        slidesConsoleWindow = window.open("","Slides Console","width=880,height=500");
        slidesConsoleWindow.document.open();
        slidesConsoleWindow.document.write(consoleWindowHTML);
        slidesConsoleWindow.document.close();

        var slideT, totalT;

        $(slidesConsoleWindow.document).ready(function () {
            $("#btn_prev", slidesConsoleWindow.document).click(function() {
                previous();
            });

            $("#btn_next", slidesConsoleWindow.document).click(function() {
                next();
            });

            setInterval(function() {
                $("#today", slidesConsoleWindow.document).html(new Date().toGMTString().slice(0, -4));
                slideT = new Date(Date.now() - currSlideStartTime);
                totalT = new Date(Date.now() - startTime);
                $("#dur_slide", slidesConsoleWindow.document).html(
                    (slideT.getUTCHours()<10 ? "0"+slideT.getUTCHours() : slideT.getUTCHours()) + ":" +
                    (slideT.getUTCMinutes()<10 ? "0"+slideT.getUTCMinutes() : slideT.getUTCMinutes()) + ":" +
                    (slideT.getUTCSeconds()<10 ? "0"+slideT.getUTCSeconds() : slideT.getUTCSeconds()));
                $("#dur_total", slidesConsoleWindow.document).html(
                    (totalT.getUTCHours()<10 ? "0"+totalT.getUTCHours() : totalT.getUTCHours()) + ":" +
                    (totalT.getUTCMinutes()<10 ? "0"+totalT.getUTCMinutes() : totalT.getUTCMinutes()) + ":" +
                    (totalT.getUTCSeconds()<10 ? "0"+totalT.getUTCSeconds() : totalT.getUTCSeconds()));
            }, 1000);

            consoleCurrView = $("#view_curr", slidesConsoleWindow.document);
            consoleNextView = $("#view_next", slidesConsoleWindow.document);
            updateConsole();
            setTimeout(function refresh() {
                $("#block", slidesConsoleWindow.document).fadeOut("slow");
            }, 1000);
        });
    }

    function updateConsole() {
        if(consoleCurrView != undefined && consoleNextView != undefined) {
            if (currRawSlide != undefined && currRawSlide < rawSlides.length) {
                consoleCurrView.prop("srcdoc", getIFrameSrcdoc(rawSlides[currRawSlide]))
            }
            if (currRawSlide != undefined && currRawSlide + 1 < rawSlides.length) {
                consoleNextView.prop("srcdoc", getIFrameSrcdoc(rawSlides[currRawSlide + 1]))
            }
        }
    }

    function getIFrameSrcdoc(slide) {
        return "<!DOCTYPE html><html><head lang=\"en\"><meta charset=\"UTF-8\">" +
            "<link rel=\"stylesheet\" href=" + CSS_SLIDES + ">" +
            "<script type=\"text/javascript\" src="+ JS_MATHJAX +"></script></head>" +
            "<body>"+slide.outerHTML+"</body></html>";
    }


    /**
     * Events
     */
    $( document ).keypress(function( event ) {
        //console.log("keyCode: " + event.keyCode + " | which:" + event.which + " | key:" + event.key);
        // Left:37  Up:38  Right:39  Down:40  13:Return
        if(event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 46) {
            next();
        } else if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 44) {
            previous();
        } else if (event.keyCode == 13) {
            toggleFullScreen();
        } else if(event.which == 67 || event.which == 99) {
            openConsole();
        } else if(event.which == 72 || event.which == 104) {
            toggleHelp();
        }
    });

    /**
     * From https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
     */
    function toggleFullScreen() {
        if (!document.fullscreenElement &&          // alternative standard method
            !document.mozFullScreenElement &&       //--\
            !document.webkitFullscreenElement &&    //   | current working methods
            !document.msFullscreenElement ) {       //--/
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            $("#cBtn_Screen").html("<i class=\"fa fa-compress\"></i><span>Restore</span>");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            $("#cBtn_Screen").html("<i class=\"fa fa-expand\"></i><span>Full Screen</span>");
        }
    }

    return {
        init: init,
        next: next,
        previous: previous
    }

})(jQuery);


$( document ).ready(function() {
    Slides.init();
});

