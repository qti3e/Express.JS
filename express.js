/*****************************************************************************
 *                           In the name of Freedom                          *
 *___________________________________________________________________________*
 *   This program is free software: you can redistribute it and/or modify    *
 *   it under the terms of the GNU General Public License as published by    *
 *   the Free Software Foundation, either version 3 of the License, or       *
 *   (at your option) any later version.                                     *
 *___________________________________________________________________________*
 *   This program is distributed in the hope that it will be useful,         *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           *
 *   GNU General Public License for more details.                            *
 *___________________________________________________________________________*
 *   You should have received a copy of the GNU General Public License       *
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.   *
 *___________________________________________________________________________*
 *                       Created by AliReza Ghadimi                          *
 *     <http://AliRezaGhadimi.ir>    LO-VE    <AliRezaGhadimy@Gmail.com>     *
 *___________________________________________________________________________*
 *           Some of codes (most of events) copied from Impress.JS           *
 *  https://github.com/impress/impress.js                                    *
 *      by @bartaz                                                           *
 *          https://github.com/bartaz                                        *
 *****************************************************************************/

/**
 * With this work we set $ as jQuery pointer because some users disables this pointer and they use jQuery.everyCode and it's hard to write!
 */
(function($) {
    /**
     * Keep all position's attributes of steps
     * @type {{}}
     */
    var steps   = {};

    /**
     * @type {{}}
     */
    var ids     = {}

    /**
     * Present step jQuery pointer
     */
    var present = $("#express .step").first();

    /**
     *Last hash string
     */
    var lastHash = "";
    /**
     * Express.JS main jQuery plugin:
     *  USE:$(document).express();
     * @returns {jQuery}
     */
    $.fn.express = function (properties) {
        /**
         * Some times you'll want to disable arrow keys and spacebar for transform between steps
         * In this times you should set properties.key false value
         * @type {{keys: boolean}}
         * @private
         */
        var _p = {
            keys:true
        };
        if(properties != undefined){
            if(properties["keys"] != undefined){
                _p["keys"] = properties["keys"];
            }
        }
        function getElementFromHash() {
            // get id from url # by removing `#` or `#/` from the beginning,
            // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
            if(window.location.hash.replace(/^#\/?/,"") !== ""){
                return $("#"+window.location.hash.replace(/^#\/?/,""));
            }
            return false;
        };
        /**
         * Express's GoOn API codes
         * It'll go on your selected slide
         *  USE:$("#step-1").GoOn();
         * @returns {$.fn.GoOn}
         * @constructor
         */
        $.fn.GoOn = function() {
            var el       = $(this).first();
            var id       = ids[el.attr("id")];

            present
                .removeClass("present")
                .addClass("past");
            el
                .removeClass("past")
                .addClass("present");

            var camera_x = -steps[id]["x"];
            var camera_y = -steps[id]["y"];
            var camera_z = -steps[id]["z"];

            var camera_rx = -steps[id]["rotate_x"];
            var camera_ry = -steps[id]["rotate_y"];
            var camera_rz = -steps[id]["rotate_z"];


            $("#express").css({
                transform: "rotateZ("+camera_rz+"deg) rotateY("+camera_ry+"deg) rotateX("+camera_rx+"deg) translate3d("+camera_x+"px, "+camera_y+"px, "+camera_z+"px) scale(1)"
            });
            window.location.hash = lastHash = "#/" + el.attr("id");
            present = el;
            return this;
        };
        $.next = function(){
            var old_id   = ids[present.attr("id")]+1;
            if(old_id > steps["count"]){
                old_id = 1;
            }
            var id       = steps[old_id]["id"];
            $("#"+id).GoOn();
            return id;
        };
        $.prev = function(){
            var old_id   = ids[present.attr("id")]-1;
            if(old_id == 0){
                old_id = steps["count"];
            }
            var id       = steps[old_id]["id"];
            $("#"+id).GoOn();
            return id;
        };
        $.resize = function(){
            $("#express .step").css({
                height:$(window).height(),
                width:$(window).width()
            });
        };
        /**
         * Set html and body css attributes
         */
        $("html,body").css({
            height:"100%",
            width:"100%",
            overflow:"hidden"//It will hide scroll bars (x,y)
        });
        /**
         * #express is Express's camera and here is its css attributes for normal position
         */
        $("#express").css({
            position: "absolute",
            "transform-origin":"left top 0px",
            top: "50%",
            left: "50%",
            transition: "all 1000ms ease-in-out 0ms",
            "transform-style": "preserve-3d",
            transform: "rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(0px, 0px, 0px) scale(0.639323)"
        });
        var i     = 1;
        /**
         * Set css attributes of each step
         * From here you can now each step should be an element inside of #express
         */
        $("#express .step").each(function(){
            /**
             * Make jQuery pointer for step.
             * You can use this variable when you want to do something on steps.
             *  ----------PLEASE DON'T CHANGE VALUE OF THIS VARIABLE.----------
             */
            var el  = $(this).first();
            /**
             * Array of step's css attributes
             * @type {{x: number, y: number, z: number, rotate_x: number, rotate_y: number, rotate_z: number, scale: number}}
             */
            var pos = {
                id:"",
                x:0,
                y:0,
                z:0,
                rotate_x:0,
                rotate_y:0,
                rotate_z:0,
            };
            /**
             * Put data in pos object
             */
            if(el.data("x") != undefined){
                pos["x"] = parseInt(el.data("x"));
            }
            if(el.data("y") != undefined){
                pos["y"] = parseInt(el.data("y"));
            }
            if(el.data("z") != undefined){
                pos["z"] = parseInt(el.data("z"));
            }
            if(el.data("rotate-x") != undefined){
                pos["rotate_x"] = parseInt(el.data("rotate-x"));
            }
            if(el.data("rotate-y") != undefined){
                pos["rotate_y"] = parseInt(el.data("rotate-y"));
            }
            if(el.data("rotate-z") != undefined){
                pos["rotate_z"] = parseInt(el.data("rotate-z"));
            }else if(el.data("rotate") != undefined){
                pos["rotate_z"] = parseInt(el.data("rotate"));
            }
            /**
             * Css transform attribute value
             * @type {string}
             */
            var transform = "translate(-50%, -50%) translate3d("+pos["x"]+"px, "+pos["y"]+"px, "+pos["z"]+"px) rotateX("+pos["rotate_x"]+"deg) rotateY("+pos["rotate_y"]+"deg) rotateZ("+pos["rotate_z"]+"deg) scale(1)";
            /**
             * Set 3d position of step
             */
            el.css({
                position:"absolute",
                transform:transform,
                "transform-style":"preserve-3d"
            });
            /**
             * Set step id when it don't have
             */
            if(el.attr("id") == undefined){
                el.attr("id","step-"+i);
            }
            var id   = el.attr("id");
            pos["id"]= id;
            steps[i] = pos;
            steps["count"] = i;
            ids[id]  = i;
            i++;
        });
        $.resize();
        if(getElementFromHash() !== false){
            getElementFromHash().GoOn();
        }else{
            $("#express .step").GoOn();
        }
        window.addEventListener("hashchange", function () {
            // When the step is entered hash in the location is updated
            // (just few lines above from here), so the hash change is
            // triggered and we would call `GoOn` again on the same element.
            //
            // To avoid this we store last entered hash and compare.
            if (window.location.hash !== lastHash) {
                getElementFromHash().GoOn();
            }
        }, false);
        window.addEventListener("resize", function () {
            $.resize();
        }, false);
        if(_p.keys == true){
            document.addEventListener("keyup",function(event){
                keyCode = event.keyCode;
                if ( keyCode === 9 || ( keyCode >= 32 && keyCode <= 34 ) || (keyCode >= 37 && keyCode <= 40) ) {
                    switch( event.keyCode ) {
                        case 33: // pg up
                        case 37: // left
                        case 38: // up
                            $.prev();
                            break;
                        case 9:  // tab
                        case 32: // space
                        case 34: // pg down
                        case 39: // right
                        case 40: // down
                            $.next();
                            break;
                    }
                    event.preventDefault();
                }
            },false);
            document.addEventListener("touchstart", function ( event ) {
                if (event.touches.length === 1) {
                    var x = event.touches[0].clientX,
                        width = window.innerWidth * 0.3,
                        result = null;

                    if ( x < width ) {
                        result = $.prev();
                    } else if ( x > window.innerWidth - width ) {
                        result = $.next();
                    }

                    if (result) {
                        event.preventDefault();
                    }
                }
            }, false);
        }
        return this;
    };
})(jQuery);