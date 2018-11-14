/*
 * Copyright (c) 2017 Beigesoft™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

function setCartItem(pItTyp, pItId, pItNm, pPrice, pQuant, pAvQuan, pLnId, pUomId, pUomNm, pUStep, pPriceDp, pPriceRm) {
  var pref = "";
  if (pLnId != null) {
    pref = "Edit";
    var lnId = document.getElementById("lnId" + pref);
    lnId.value = pLnId;
    $('#cartEditMdl').modal({keyboard: false, backdrop: false});
  } else {
    $('#cartAddMdl').modal('show');
  }
  var itNm = document.getElementById("itNm" + pref);
  itNm.value = pItNm;
  var quant = document.getElementById("quant" + pref);
  $(quant).bsInpNumber({step: pUStep});
  var price = document.getElementById("price" + pref);
  price.value = numToStr(pPrice.toString(), pPriceDp);
  var uomNm = document.getElementById("uomNm" + pref);
  uomNm.value = pUomNm;
  var uomId = document.getElementById("uomId" + pref);
  uomId.value = pUomId;
  quant.value = numToStr(pQuant.toString(), quant.decPl);
  var avQuan = document.getElementById("avQuan" + pref);
  avQuan.value = pAvQuan;
  var unStep = document.getElementById("unStep" + pref);
  unStep.value = pUStep;
  var itTyp = document.getElementById("itTyp" + pref);
  itTyp.value = pItTyp;
  var itId = document.getElementById("itId" + pref);
  itId.value = pItId;
  refreshCartItemTotal(pref, pPriceDp, pPriceRm);
};

function refreshCartItemTotal(pPref, pPriceDp, pPriceRm) {
  var price = document.getElementById("price" + pPref);
  var quant = document.getElementById("quant" + pPref);
  var total = document.getElementById("total" + pPref);
  var pr = strToFloat(price.value);
  var qu = strToFloat(quant.value);
  var tot = numRound(pr * qu, pPriceDp, pPriceRm);
  total.value = numToStr(tot.toString(), pPriceDp);
};

function delCartItem(pItTyp, pItId, pItNm, pPrice, pQuant, pLnId) {
  var itNm = document.getElementById("itNmDel");
  itNm.value = pItNm;
  var price = document.getElementById("priceDel");
  price.value = pPrice;
  var quant = document.getElementById("quantDel");
  quant.value = pQuant;
  var total = document.getElementById("totalDel");
  total.value = pPrice * pQuant;
  var lnId = document.getElementById("lnIdDel");
  lnId.value = pLnId;
};

function onFilterNumberOperChanged(pSelect, pVal1Id, pVal2Id) {
  var isDisabledV1 = pSelect.options[pSelect.selectedIndex].value == "";
  document.getElementById(pVal1Id).disabled = isDisabledV1;
  var isDisabledV2 = pSelect.options[pSelect.selectedIndex].value != "BETWEEN_INCLUDE";
  document.getElementById(pVal2Id).disabled = isDisabledV2;
};

function onCatalogOperChanged(pSelect, pFltCtValId, pRowCatId) {
  var fltCtVal = document.getElementById(pFltCtValId);
  var rowCat = document.getElementById(pRowCatId);
  onFltCatalogChanged(pSelect, fltCtVal, rowCat);
};

function onCatalogValChanged(pSelect, pFltCtOpId, pRowCatId) {
  var fltCtOp = document.getElementById(pFltCtOpId);
  var rowCat = document.getElementById(pRowCatId);
  onFltCatalogChanged(fltCtOp, pSelect, rowCat);
};

function onFltCatalogChanged(pFltCtOp, pFltCtVal, pRowCat) {
  var isDisabledCatalog = pFltCtOp.options[pFltCtOp.selectedIndex].value != "";
  if (!isDisabledCatalog) {
    var i;
    for (i = 0; i < pFltCtVal.length; i++) {
      if (pFltCtVal.options[i].selected) {
        isDisabledCatalog = false;
        break;
      }
    }
  }
  pFltCtVal.disabled = !isDisabledCatalog;
  if (isDisabledCatalog && !pRowCat.classList.contains('dimmed')) {
    pRowCat.classList.add('dimmed');
  } else if (!isDisabledCatalog && pRowCat.classList.contains('dimmed')) {
    pRowCat.classList.remove('dimmed');
  }
};
