/*
 * Copyright (c) 2016 Beigesoft™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

function submitItemSpecificsByAjax(pIdFrm, pItemSpecNm) {
  var frm = document.getElementById(pIdFrm);
  var gsAlUpUrl = document.getElementById(pItemSpecNm + ".stringValue1");
  var gsFile = document.getElementById(pItemSpecNm + ".path");
  if (gsAlUpUrl.value == "" && gsFile.value == "") {
    showWarning(MSGS["enterEitherAlreadyOrLoadNew"]);
  } else {
    var addParams;
    if (gsFile.value != "") {
      var inpNmsAct = document.getElementById(pIdFrm + ".nmsAct");
      inpNmsAct.value = "entitySave,list";
      frm.action = "uploadSingle/";
      addParams = "&nmRnd=listAfterFormActionJson";
    } else {
      addParams = "&nmRnd=editEntitySavedJson";
    }
    sendFormByAjax(frm, addParams);
  }
};

//set known cost for picked item
function setCost(pKnownCost, idDomBasePicker, costPrecision, totalPrecision, pDsep, pDgSep) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  var itsCostVisible = document.getElementById(whoPicking["pickingEntity"] + "itsCostVisible");
  var itsCost = document.getElementById(whoPicking["pickingEntity"] + "itsCost");
  if (itsCost.value != pKnownCost) {
    itsCostVisible.value = pKnownCost;
    itsCost.value = pKnownCost;
    itsCostVisible.onchange();
  }
  calculateTotalForCost(whoPicking["pickingEntity"], costPrecision, totalPrecision, pDsep, pDgSep);
};

//set UOM for picked item (goods)
function setUom(uomId, uomName, idDomBasePicker) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  var inpUomId = document.getElementById(whoPicking["pickingEntity"] + "unitOfMeasureId");
  if (inpUomId != null) {
    inpUomId.value = uomId;
    var unitOfMeasureAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + "unitOfMeasureAppearanceVisible");
    unitOfMeasureAppearanceVisible.value = uomName;
    unitOfMeasureAppearanceVisible.onchange();
  }
};


function openPickerSubacc(entitySimpleName, accName, subaccName, paramsAdd) {
  var inpAccId = document.getElementById(entitySimpleName + accName + "Id");
  if (inpAccId.value == "") {
    showError(MSGS['choose_account_first']);
  } else {
    openEntityPicker('SubaccountLine', entitySimpleName, subaccName, "&fltordPitsOwnerValId="
      + inpAccId.value + "&fltordPitsOwnerOpr=eq&fltordPforcedFor=itsOwner" + paramsAdd);
  }
};

function selectSubacc(subaccId, subaccType, subaccAppearance, idDomBasePicker) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Appearance").value = subaccAppearance;
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Type").value = subaccType;
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Id").value = subaccId;
  var inpVisible = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "AppearanceVisible");
  inpVisible.value = subaccAppearance;
  inpVisible.onchange();
  document.getElementById(idDomBasePicker+"Dlg").close();
};

function selectChooseableSpecType(typeId, typeAppearance, idDomBasePicker) {
  whoPicking = cnvState["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] +"TypeId").setAttribute("value", typeId);
  var inpAppearance = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "TypeAppearance");
  inpAppearance.setAttribute("value", typeAppearance);
  var inpAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "TypeAppearanceVisible");
  inpAppearanceVisible.value = typeAppearance;
  inpAppearanceVisible.onchange();
};

/**
 * <p>Select sub-account simple implementation.
 * Sub-account picker is enable if account is chosen despite of
 * it no has sub-account.
 * </p>
 **/
function clearSubacc(entitySimpleName, accName, subaccName) {
  var isDisabled = (document.getElementById(entitySimpleName + accName + "Id").value == '');
  document.getElementById(entitySimpleName + subaccName + "Choose").disabled = isDisabled;
  document.getElementById(entitySimpleName + subaccName + "Clear").disabled = isDisabled;
  document.getElementById(entitySimpleName + subaccName + "Appearance").value = "";
  document.getElementById(entitySimpleName + subaccName + "Type").value = "";
  document.getElementById(entitySimpleName + subaccName + "Id").value = "";
  var inpVisible = document.getElementById(entitySimpleName + subaccName + "AppearanceVisible");
  inpVisible.value = "";
  inpVisible.onchange();
};

function clearSubaccLine(entitySimpleName) {
  document.getElementById(entitySimpleName + "subaccId").setAttribute("value", "");
  document.getElementById(entitySimpleName + "subaccNameAppearance").setAttribute("value", "");
  document.getElementById(entitySimpleName + "subaccNameAppearanceVisible").setAttribute("value", "");
};

function selectAccSubacc(entityId, entityAppearance, idDomBasePicker) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] +"subaccId").setAttribute("value", entityId);
  document.getElementById(whoPicking["pickingEntity"] +"subaccNameAppearance").setAttribute("value", entityAppearance);
  var inpAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + "subaccNameAppearanceVisible");
  inpAppearanceVisible.value = entityAppearance;
  inpAppearanceVisible.onchange();
  document.getElementById(idDomBasePicker+"Dlg").close();
};

function makeTotalTax(nameEntity, totalGross, pDsep, pDgSep) {
  var inpAllowance = document.getElementById(nameEntity + "allowance");
  var inpPlusAmount = document.getElementById(nameEntity + "plusAmount");
  var inpPercentage = document.getElementById(nameEntity + "itsPercentage");
  var dec = inpAllowance.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var allowance = parseFloat(dec);
  var dec = inpPlusAmount.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var plusAmount = parseFloat(dec);
  var dec = inpPercentage.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var itsPercentage = parseFloat(dec);
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = plusAmount + (totalGross - allowance) * itsPercentage / 100;
  $(inpTotal).autoNumeric('update');
  inputHasBeenChanged(inpTotal);
};

function clearWageTaxes(nameEntity) {
  var inpTotalWageTaxes = document.getElementById(nameEntity + "totalWageTaxes");
  var inpTotalWageTaxesVisible = document.getElementById(nameEntity + "totalWageTaxesVisible");
  inpTotalWageTaxes.value = 0;
  inpTotalWageTaxesVisible.value = 0;
  inputHasBeenChanged(inpTotalWageTaxesVisible);
};

function tryToSetPercentagePlusAmount(itsPercentage, plusAmount, idDomBasePicker) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  var inpPercentage = document.getElementById(whoPicking["pickingEntity"] + "itsPercentage");
  if(inpPercentage != null) {
    var inpPlusAmount = document.getElementById(whoPicking["pickingEntity"] + "plusAmount");
    if(inpPlusAmount != null) {
      inpPlusAmount.value = plusAmount;
      inputHasBeenChanged(inpPlusAmount);
    }
    inpPercentage.value = itsPercentage;
    inpPercentage.onchange();
  }
};

function makeFltrPaymentTot(pInp, pIdSelFlt) {
  var fldWas;
  var fldIs;
  if (pInp.options[pInp.selectedIndex].value == "ITSTOTAL") {
    fltIs = "ITSTOTAL";
    fltWas = "FOREIGNTOTAL";
  } else {
    fltIs = "FOREIGNTOTAL";
    fltWas = "ITSTOTAL";
  }
  var selFlt = document.getElementById(pIdSelFlt);
  for (var i=0; i < selFlt.options.length; i++) {
    selFlt.options[i].value = selFlt.options[i].value.replace(fltWas, fltIs);
  }  
};

function bnStLnAccentryMatchChanged(pInp) {
  var tbPrepPayEntry = document.getElementById("bnkStLnPrepPayEntry");
  var tbPrepPay = document.getElementById("bnkStLnPrepPay");
  var tbPrep = document.getElementById("bnkStLnPrep");
  var tbPay = document.getElementById("bnkStLnPay");
  var tbEntry = document.getElementById("bnkStLnEntry");
  var bnkStLnPrepMatch = document.getElementById("bnkStLnPrepMatch");
  var bnkStLnPayMatch = document.getElementById("bnkStLnPayMatch");
  if (pInp.selectedIndex == 0) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="table"; }
    if (tbPrep != null) { tbPrep.style.display="table"; }
    if (tbPay != null) { tbPay.style.display="table"; }
    if (tbEntry != null) { tbEntry.style.display="table"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="table"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="table"; }
  } else {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="none"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="none"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="none"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="none"; }
  }
};

function bnStLnPrepayMatchChanged(pInp) {
  var tbPrepPayEntry = document.getElementById("bnkStLnPrepPayEntry");
  var tbPrepPay = document.getElementById("bnkStLnPrepPay");
  var tbPrep = document.getElementById("bnkStLnPrep");
  var tbPay = document.getElementById("bnkStLnPay");
  var tbEntry = document.getElementById("bnkStLnEntry");
  var bnkStLnPayMatch = document.getElementById("bnkStLnPayMatch");
  var bnkStLnAccentryMatch = document.getElementById("bnkStLnAccentryMatch");
  if (pInp.selectedIndex == 0) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="table"; }
    if (tbPrep != null) { tbPrep.style.display="table"; }
    if (tbPay != null) { tbPay.style.display="table"; }
    if (tbEntry != null) { tbEntry.style.display="table"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="table"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="table"; }
  } else {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="none"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="none"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="none"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="none"; }
  }
};

function bnStLnPayMatchChanged(pInp) {
  var tbPrepPayEntry = document.getElementById("bnkStLnPrepPayEntry");
  var tbPrepPay = document.getElementById("bnkStLnPrepPay");
  var tbPrep = document.getElementById("bnkStLnPrep");
  var tbPay = document.getElementById("bnkStLnPay");
  var tbEntry = document.getElementById("bnkStLnEntry");
  var bnkStLnPrepMatch = document.getElementById("bnkStLnPrepMatch");
  var bnkStLnAccentryMatch = document.getElementById("bnkStLnAccentryMatch");
  if (pInp.selectedIndex == 0) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="table"; }
    if (tbPrep != null) { tbPrep.style.display="table"; }
    if (tbPay != null) { tbPay.style.display="table"; }
    if (tbEntry != null) { tbEntry.style.display="table"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="table"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="table"; }
  } else {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="none"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="none"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="none"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="none"; }
  }
};

function bnStLnDocTypeChanged(pInp) {
  var tbPrepPayEntry = document.getElementById("bnkStLnPrepPayEntry");
  var tbPrepPay = document.getElementById("bnkStLnPrepPay");
  var tbPrep = document.getElementById("bnkStLnPrep");
  var tbPay = document.getElementById("bnkStLnPay");
  var tbEntry = document.getElementById("bnkStLnEntry");
  var bnkStLnPrepMatch = document.getElementById("bnkStLnPrepMatch");
  var bnkStLnPayMatch = document.getElementById("bnkStLnPayMatch");
  var bnkStLnAccentryMatch = document.getElementById("bnkStLnAccentryMatch");
  if (pInp.selectedIndex == 0) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="none"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="none"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="table"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="table"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="table"; }
  } else if (pInp.selectedIndex == 1) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="table"; }
    if (tbPrep != null) { tbPrep.style.display="table"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="none"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="none"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="none"; }
  } else if (pInp.selectedIndex == 2) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="table"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="table"; }
    if (tbEntry != null) { tbEntry.style.display="none"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="none"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="none"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="none"; }
  } else if (pInp.selectedIndex == 3) {
    if (tbPrepPayEntry != null) { tbPrepPayEntry.style.display="table"; }
    if (tbPrepPay != null) { tbPrepPay.style.display="none"; }
    if (tbPrep != null) { tbPrep.style.display="none"; }
    if (tbPay != null) { tbPay.style.display="none"; }
    if (tbEntry != null) { tbEntry.style.display="table"; }
    if (bnkStLnPrepMatch != null) { bnkStLnPrepMatch.style.display="none"; }
    if (bnkStLnPayMatch != null) { bnkStLnPayMatch.style.display="none"; }
    if (bnkStLnAccentryMatch != null) { bnkStLnAccentryMatch.style.display="none"; }
  }
};

function selectCsvPath(pVal, pPathAppr) {
  var CsvColumndataIndex = document.getElementById("CsvColumndataIndex");
  var CsvColumnfieldPath = document.getElementById("CsvColumnfieldPath");
  var dataPath = document.getElementById("dataPath");
  var scIdx = pVal.indexOf(";");
  if (scIdx == -1) {
    CsvColumndataIndex.value = pVal;
    CsvColumnfieldPath.value = "";
  } else {
    var arr = pVal.split(";");
    CsvColumndataIndex.value = arr[0];
    CsvColumnfieldPath.value = arr[1];
  }
  dataPath.value = pPathAppr;
  dataPath.onchange();
};

function clearCsvPath() {
  var CsvColumndataIndex = document.getElementById("CsvColumndataIndex");
  var dataPath = document.getElementById("dataPath");
  var CsvColumnfieldPath = document.getElementById("CsvColumnfieldPath");
  CsvColumnfieldPath.value = "";
  CsvColumndataIndex.value = "";
  dataPath.value = "";
  dataPath.onchange();
};

function openCsvPathPicker() {
  var pickerPlace = "pickersCsvPath";
  var readerName = null;
  var readerNameSel = document.getElementById("CsvMethodretrieverName");
  if (readerNameSel.selectedIndex > 0) {
    readerName = readerNameSel.options[readerNameSel.selectedIndex].value;
  }
  if (readerName != null) {
    var picker = document.getElementById(pickerPlace + readerName + "Dlg");
    if (picker != null) {
        picker.showModal();
    } else {
      getHtmlByAjax('GET', 'service/?nmHnd=hndTrdTrnsReq&nmPrc=PrcCsvSampleDataRow&nmRnd=pickerCsvPathJson&nmRet=' + readerName);
    }
  }
};
function calculatePriceTax(nameEntity, pDsep, pDgSep, pIsTaxIncluded) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var dec = inpTotal.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var total = parseFloat(dec);
  if (total > 0) {
    calcTotalTax(nameEntity, total, pDsep, pDgSep, pIsTaxIncluded);
    var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
    dec = inpQuantity.value;
    if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
    if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
    var quantity = parseFloat(dec);
    if (quantity > 0) {
      var inpPrice = document.getElementById(nameEntity + "itsPrice");
      var price = total/quantity;
      inpPrice.value = price.toString();
      var inpPriceVisible = document.getElementById(nameEntity + "itsPriceVisible");
      if (inpPriceVisible != null) {
        inpPriceVisible.value = price.toString();
        $(inpPriceVisible).autoNumeric('update');
        inputHasBeenChanged(inpPriceVisible);
      } else {
        $(inpPrice).autoNumeric('update');
        inputHasBeenChanged(inpPrice);
      }
    }
  }
};

function calculateCostTax(nameEntity, pDsep, pDgSep, pIsTaxIncluded) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var dec = inpTotal.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var total = parseFloat(dec);
  if (total > 0) {
    calcTotalTax(nameEntity, total, pDsep, pDgSep, pIsTaxIncluded);
    var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
    dec = inpQuantity.value;
    if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
    if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
    var quantity = parseFloat(dec);
    if (quantity > 0) {
      var inpCost = document.getElementById(nameEntity + "itsCost");
      var cost = total/quantity;
      inpCost.value = cost.toString();
      var inpCostVisible = document.getElementById(nameEntity + "itsCostVisible");
      if (inpCostVisible != null) {
        inpCostVisible.value = cost.toString();
        $(inpCostVisible).autoNumeric('update');
        inputHasBeenChanged(inpCostVisible);
      } else {
        $(inpCost).autoNumeric('update');
        inputHasBeenChanged(inpCost);
      }
    }
  }
};

function calculateTotalAndTaxForPrice(nameEntity, pDsep, pDgSep, pIsTaxIncluded) {
  var inpPrice = document.getElementById(nameEntity + "itsPrice");
  if (inpPrice != null) {
    var dec = inpPrice.value;
    if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
    if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
    var price = parseFloat(dec);
    if (price > 0) {
      var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
      dec = inpQuantity.value;
      if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
      if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
      var quantity = parseFloat(dec);
      if (quantity > 0) {
        var inpTotal = document.getElementById(nameEntity + "itsTotal");
        var total = price * quantity;
        inpTotal.value = total.toString();
        var inpTotalVisible = document.getElementById(nameEntity + "itsTotalVisible");
        if (inpTotalVisible != null) {
          inpTotalVisible.value = total.toString();
          $(inpTotalVisible).autoNumeric('update');
          inputHasBeenChanged(inpTotalVisible);
        } else {
          $(inpTotal).autoNumeric('update');
          inputHasBeenChanged(inpTotal);
        }
        calcTotalTax(nameEntity, total, pDsep, pDgSep, pIsTaxIncluded);
      }
    }
  }
};

function calculateTotalAndTaxForCost(nameEntity, pDsep, pDgSep, pIsTaxIncluded) {
  var inpCost = document.getElementById(nameEntity + "itsCost");
  if (inpCost != null) {
    var dec = inpCost.value;
    if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
    if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
    var cost = parseFloat(dec);
    if (cost > 0) {
      var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
      dec = inpQuantity.value;
      if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
      if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
      var quantity = parseFloat(dec);
      if (quantity > 0) {
        var inpTotal = document.getElementById(nameEntity + "itsTotal");
        var total = cost * quantity;
        inpTotal.value = total.toString();
        var inpTotalVisible =   document.getElementById(nameEntity + "itsTotalVisible");
        if (inpTotalVisible != null) {
          inpTotalVisible.value = total.toString();
          $(inpTotalVisible).autoNumeric('update');
          inputHasBeenChanged(inpTotalVisible);
        } else {
          $(inpTotal).autoNumeric('update');
          inputHasBeenChanged(inpTotal);
        }
        calcTotalTax(nameEntity, total, pDsep, pDgSep, pIsTaxIncluded);
      }
    }
  }
};

function calcTaxOchRate(nameEntity, pDsep, pDgSep, pIsTaxIncluded) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  dec = inpTotal.value;
  if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
  if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
  var total = parseFloat(dec);
  calcTotalTax(nameEntity, total, pDsep, pDgSep, pIsTaxIncluded);
};

function setTaxCat(pTcRate, pTcNm, pIdDomBasePicker) {
  var whoPicking = cnvState["Who Picking"][pIdDomBasePicker];
  var btnTaxDestination = document.getElementById(whoPicking["pickingEntity"] + "btnTaxDestination");
  var inpTaxNm = document.getElementById(whoPicking["pickingEntity"] + "taxCategory");
  var inpTaxRate = document.getElementById(whoPicking["pickingEntity"] + "itsPercentage");
  if (btnTaxDestination == null) {
    inpTaxNm.value = pTcNm;
    inpTaxNm.onchange();
    if (inpTaxRate != null) { // aggregate or only rate
      inpTaxRate.value = pTcRate.toString();
      $(inpTaxRate).autoNumeric('update');
      inpTaxRate.onchange();
    }
  } else {
    btnTaxDestination.style.display="inherit";
    inpTaxNm.value = "";
    inpTaxNm.onchange();
    if (inpTaxRate != null) { // aggregate or only rate
      inpTaxRate.value = "";
      inpTaxRate.onchange();
    }
  }
};

function setDestTaxCat(pTcRate, pTcNm, pEntityName) {
  var inpTaxNm = document.getElementById(pEntityName + "taxCategory");
  inpTaxNm.value = pTcNm;
  inpTaxNm.onchange();
  var inpTaxRate = document.getElementById(pEntityName + "itsPercentage");
  if (inpTaxRate != null) { // aggregate or only rate
    inpTaxRate.value = pTcRate.toString();
    $(inpTaxRate).autoNumeric('update');
    inpTaxRate.onchange();
  }
  var btnTaxDestination = document.getElementById(pEntityName + "btnTaxDestination");
  btnTaxDestination.style.display="none";
};

function calcTotalTax(pNameEntity, pTotal, pDsep, pDgSep, pIsTaxIncluded) {
  var inpTaxRate = document.getElementById(pNameEntity + "itsPercentage");
  var inpTaxTotal = document.getElementById(pNameEntity + "totalTaxes");
  dec = inpTaxRate.value;
  if (dec == "") {
    inpTaxTotal.value = "";
    inpTaxTotal.onchange();
  } else {
    if (pDgSep != "") { dec = dec.replace(pDgSep, ""); }
    if (pDsep != ".") { dec = dec.replace(pDsep, "."); }
    var taxRate = parseFloat(dec);
    var taxTotal;
    if (pIsTaxIncluded) {
      taxTotal = pTotal-(pTotal/(1+taxRate/100.0));
    } else {
      taxTotal = pTotal*taxRate/100.0;
    }
    inpTaxTotal.value = taxTotal.toString();
    $(inpTaxTotal).autoNumeric('update');
    inpTaxTotal.onchange();
  }
};

function setAutoNumTax(pTarget, pRounding, pTaxPrecision, pPricePrecision) {
  $('#'+ pTarget).find('.autoNumSalTax').autoNumeric('init', {mDec: '' + pTaxPrecision + '', vMin:'0', mRound:'' + pRounding+ '', dGroup:'' + RSdGroup + ''});
  $('#'+ pTarget).find('.autoNumSalTaxTot').autoNumeric('init', {mDec: '' + pPricePrecision + '', vMin:'0', mRound:'' + pRounding+ '', dGroup:'' + RSdGroup + ''});
};
