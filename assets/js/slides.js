/**
 * Created by kintesh on 17/02/15.
 */

var Slides = (function($) {

    var TYPES = {
        SLIDE: 1,
        ELEM: 2
    };

    var list = [], curr = -1, slides, currSlide, sBar;

    function init() {
        setupProgressbar();
        setupControls();
        setupSlides();
        //console.log("list length: " + list.length);
        nextItem();
    }

    function setupSlides() {
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
        currSlide = index;
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
        "</div>").appendTo("body").animate({opacity:"0"}, 2000);

        $( "#cBtn_Previous" ).click(function() {
            previous();
        });

        $( "#cBtn_Next" ).click(function() {
            next();
        });

        $( "#cBtn_Screen" ).click(function() {
            toggleFullScreen();
        });
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
     * Events
     */
    $( document ).keypress(function( event ) {
        //console.log("keyCode: " + event.keyCode + " | which:" + event.which + " | key:" + event.key);
        // Left:37  Up:38  Right:39  Down:40  13:Return
        if(event.keyCode == 39 || event.keyCode == 40) {
            next();
        } else if (event.keyCode == 37 || event.keyCode == 38) {
            previous();
        } else if (event.keyCode == 13) {
            toggleFullScreen();
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
            $( "#cBtn_Screen").html("<i class=\"fa fa-compress\"></i><span>Restore</span>");
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
            $( "#cBtn_Screen").html("<i class=\"fa fa-expand\"></i><span>Full Screen</span>");
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

