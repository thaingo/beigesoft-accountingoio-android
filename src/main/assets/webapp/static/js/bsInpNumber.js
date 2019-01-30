/*
 * Copyright (c) 2018 Beigesoft™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 * JQuery based input number. It requires beige.num.js.
 * author Yury Demidenko
 * 
 * It makes internationalized input number (substitute of HTML5 input number that not yet enough implemented).
 * NULL value is not allowed!
 * Initial value must be exactly number or empty (it will be 0) - dot separator without group separators, number without decimal separator will do, e.g. "0".
 * If you pass only "step" in parameter, then decimal places and nmin will be same as in "step". If you pass "decimal places" without "step", then step will be minimum.
 * Number will be always adjusted to the "previous step", e.g. if step=0.25 and edited value=12.27, then value will be adjusted to 12.25.
 * It has two custom events "increase" and "decrease" by "step".
 * adjustOnKeyUp is true, set it false then step has "more than one nonzero digit ", e.g "0.25" or "1.5"
 */

(function($) {
  $.fn.bsInpNumber = function(pVars) {
    //default vars:
    var vars = {
      step: 1,
      decPl: 0,
      nmin: 0,
      nmax: 999999999999999,
      adjustOnKeyUp: true
    };
    $.extend(vars, pVars);
    if (pVars != null && pVars.step != null) {
      if (pVars.nmin == null) {
        vars.nmin = pVars.step;
      }
      if (pVars.decPl == null) {
        var steps = vars.step.toString();
        var dsIdx = steps.indexOf(".");
        var decPl = 0;
        if (dsIdx == -1) {
          vars.decPl = 0;
        } else {
          vars.decPl = steps.length - dsIdx - 1;
        }
      }
    } else if (pVars != null && pVars.decPl != null && pVars.step == null) {
      var stepMin = numRound(1.0 / Math.pow(10, vars.decPl), vars.decPl);
      vars.step = stepMin;
    }
    var isInit0 = true;
    $.each(this, function(idx, inp) {
      if (isInit0 && inp.decPl != null) {
        isInit0 = false;
      }
      //add/set input scoped vars:
      inp.decPl = vars.decPl;
      inp.nstep = vars.step;
      inp.nmin = vars.nmin;
      inp.nmax = vars.nmax;
      inp.adjustOnKeyUp = vars.adjustOnKeyUp;
      numMake(inp);
    });
    //events handlers:
    function numIncr(e) {
      var vn = strToFloat(e.target.value);
      vn = numRound(vn + e.target.nstep, e.target.decPl);
      if (vn <= e.target.nmax) {
        e.target.value = numToStr(vn.toString(), e.target.decPl);
      } else {
        e.target.value = numToStr(e.target.nmax.toString(), e.target.decPl);        
      }  
    };
    function numDecr(e) {
      var vn = strToFloat(e.target.value);
      vn = numRound(vn - e.target.nstep, e.target.decPl);
      if (vn >= e.target.nmin) {
        e.target.value = numToStr(vn.toString(), e.target.decPl);      
      } else {
        e.target.value = numToStr(e.target.nmin.toString(), e.target.decPl);        
      }
    };
    function numChanged(e) {
      numMake(e.target);
    };
    function numKeydown(e) {
      //Allow: backspace, delete, tab, esc, enter, end, arrow navigation:
      if ($.inArray(e.keyCode, [8, 46, 9, 27, 13, 37, 39, 190]) !== -1
        //Allow Ctrl+V
        || (e.ctrlKey && e.keyCode === 86)
        //Allow Ctrl+A, Command+A
        || (e.keyCode === 65 && (e.ctrlKey || e.metaKey))
        //Allow: home, end, left, right, down, up:
        || (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      //Handle minus:
      if (e.key === "-") {
        if (e.target.nmin < 0 && e.target.value.indexOf("-") === -1 && e.target.selectionStart === 0
          || (e.target.value.startsWith("0") && e.target.selectionStart === 1)) {
          return;
        }
        e.preventDefault();
        return;
      }
      //Handle decimal separator:
      if (e.keyCode === 110 || e.key === RSNUMVS.decSep) {
        if (e.target.decPl === 0) {
          e.preventDefault();
          return;
        }
        if (e.target.value.indexOf(RSNUMVS.decSep) !== -1) {
          var dotIdx = e.target.value.indexOf(RSNUMVS.decSep) + 1;
          e.target.selectionStart = dotIdx;
          e.target.selectionEnd = dotIdx;
          e.preventDefault();
          return;
        }
      } else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        //Prevent non-numbers:
        e.preventDefault();
        return;
      }
      //new digit or DS
    };
    function numKeyup(e) {
      if (e.target.value != "" && e.target.value != "-" && e.target.prevVal != e.target.value) {
        var isNeg = e.target.value.startsWith("-")
        if (e.target.decPl > 0 && e.target.value.indexOf(RSNUMVS.decSep) == -1
          && (e.target.value.length > 2 || e.target.value.length == 2 && !isNeg)) {
          //delete decimal separator handling:
          e.target.value = e.target.prevVal;
          var dotIdx = e.target.value.indexOf(RSNUMVS.decSep);
          e.target.selectionStart = dotIdx;
          e.target.selectionEnd = dotIdx;
        } else if (e.key === "-") {
            if (e.target.value.startsWith("0-")) {
              //minus at start:
              e.target.value = e.target.value.substring(1);
              e.target.selectionStart = 1;
              e.target.selectionEnd = 1;
            } else {
              e.target.prevVal = e.target.value;
            }
        } else {
          var ss = e.target.selectionStart;
          var isFirstDig = false;
          //handling the first digit:
          if (ss == 1 && !isNeg || (ss == 2 && isNeg)) {
            var stp;
            if (isNeg) {
              stp = "-" + e.key + "0";
            } else {
              stp = e.key + "0";
            }
            if (e.target.decPl > 0) {
              stp += RSNUMVS.decSep;
              for (i = 0; i < e.target.decPl; i++) {
                stp += "0";
              }
            }
            isFirstDig = e.target.value == stp;
          }
          if (isFirstDig) {
            if (isNeg) {
              e.target.value = "-" + e.key;
            } else {
              e.target.value = e.key;
            }
            if (e.target.decPl > 0) {
              e.target.value += RSNUMVS.decSep;
              for (i = 0; i < e.target.decPl; i++) {
                e.target.value += "0";
              }
            }
            e.target.selectionStart = ss;
            e.target.selectionEnd = ss;
          } else {
            if (ss == 2 && e.target.value.startsWith("0")) {
              ss = ss - 1;
            }
            var vn = strToFloat(e.target.value);
            if (e.target.adjustOnKeyUp) {
              vn = adjustNum(e.target, vn);
            }
            e.target.value = numToStr(vn.toString(), e.target.decPl);
            if (e.target.value.length - e.target.prevVal.length == 2) {
              //adding group separator:
              e.target.selectionStart = ss + 1;
              e.target.selectionEnd = ss + 1;
            } else if (ss != 0 && e.target.value.length - e.target.prevVal.length == -2) {
              //deleting group separator except digit before zero:
              e.target.selectionStart = ss - 1;
              e.target.selectionEnd = ss - 1;
            } else {
              e.target.selectionStart = ss;
              e.target.selectionEnd = ss;
            }
          }
          e.target.prevVal = e.target.value;
        }
      }
    };
    function numFocus(e) {
      if (e.target.value.startsWith("0")) {
        e.target.selectionStart = 1;
        e.target.selectionEnd = 1;
        e.preventDefault();
      }
    };
    if (isInit0) {
      $(this).on("keydown", numKeydown);
      $(this).on("keyup", numKeyup);
      $(this).on("change", numChanged);
      $(this).on("focus", numFocus);
      $(this).on("increase", numIncr);
      $(this).on("decrease", numDecr);
    }
    //Utils:
    function numMake(pInp) {
      if (pInp.value == "") {
        pInp.value = "0";
      }
      var vn = strToFloat(pInp.value);
      vn = adjustNum(pInp, vn);
      pInp.value = numToStr(vn.toString(), pInp.decPl);
      //add/set input scoped var:
      pInp.prevVal = pInp.value;
    };
    function adjustNum(pInp, pVn) {
      if (pVn > pInp.nmax) {
        pVn = pInp.nmax;
      } else if (pVn < pInp.nmin) {
        pVn = pInp.nmin;
      } else if (pVn != pInp.nmax && pVn != pInp.nmin) {
        var stepMin = numRound(1.0 / Math.pow(10, pInp.decPl), pInp.decPl);
        if (pInp.nstep != stepMin) {
          //Java gives right result % on BigDecimal, e.g. 10%0.01==0
          //JS gives wrong result 10%0.01=0.009999999, so do it by hand:
          var vnds = (pVn / pInp.nstep).toString();
          var dotIdx = vnds.indexOf(".");
          if (dotIdx != -1) {
            var daf = parseFloat("0" + vnds.substring(dotIdx));
            var vnr = daf * pInp.nstep;
            pVn = pVn - vnr;
          }
        }
      }
      return pVn;
    };
  };
}(jQuery));
