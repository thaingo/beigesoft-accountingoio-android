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


//set known or from returned invoice line cost for picked item, cost is already rounded and internationalized string value
function setCost(pCost, idDomBasePicker) {
  var whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
  var inpCostVisible = document.getElementById(whoPicking["pickingEntity"] + "itsCostVisible");
  var inpCost = document.getElementById(whoPicking["pickingEntity"] + "itsCost");
  if (inpCost.value != pCost) {
    inpCost.value = pCost;
    if (inpCostVisible != null) {
      inpCostVisible.value = pCost;
      inpCostVisible.onchange();
    } else {
      inpCost.onchange();
    }
  }
};

//set UOM for picked item (goods)
function setUom(uomId, uomName, idDomBasePicker) {
  var whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
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
  var whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Appearance").value = subaccAppearance;
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Type").value = subaccType;
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Id").value = subaccId;
  var inpVisible = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "AppearanceVisible");
  inpVisible.value = subaccAppearance;
  inpVisible.onchange();
  document.getElementById(idDomBasePicker+"Dlg").close();
};

function selectChooseableSpecType(typeId, typeAppearance, idDomBasePicker) {
  whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
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
  var whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] +"subaccId").setAttribute("value", entityId);
  document.getElementById(whoPicking["pickingEntity"] +"subaccNameAppearance").setAttribute("value", entityAppearance);
  var inpAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + "subaccNameAppearanceVisible");
  inpAppearanceVisible.value = entityAppearance;
  inpAppearanceVisible.onchange();
  document.getElementById(idDomBasePicker+"Dlg").close();
};

function makeTotalTax(pInp, nameEntity, totalGross, pTaxDp, pTaxRm) {
  var inpAllowance = document.getElementById(nameEntity + "allowance");
  var inpPlusAmount = document.getElementById(nameEntity + "plusAmount");
  var inpPercentage = document.getElementById(nameEntity + "itsPercentage");
  var allowance = strToFloat(inpAllowance.value);
  var plusAmount = strToFloat(inpPlusAmount.value);
  var itsPercentage = strToFloat(inpPercentage.value);
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = numRound(plusAmount + (totalGross - allowance) * itsPercentage / 100, pTaxDp, pTaxRm);
  inpTotal.value = numToStr(total.toString(), pTaxDp);
  inputHasBeenChanged(inpTotal);
  inputHasBeenChanged(pInp);
};

function clearWageTaxes(nameEntity) {
  var inpTotalWageTaxes = document.getElementById(nameEntity + "totalWageTaxes");
  var inpTotalWageTaxesVisible = document.getElementById(nameEntity + "totalWageTaxesVisible");
  inpTotalWageTaxes.value = 0;
  inpTotalWageTaxesVisible.value = 0;
  inputHasBeenChanged(inpTotalWageTaxesVisible);
};

function tryToSetPercentagePlusAmount(itsPercentage, plusAmount, idDomBasePicker) {
  var whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
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

function calcPriceTax(pInp, nameEntity, pPriceNm, pPriceDp, pPriceRm, pIsTaxIncluded, pTaxDp, pTaxRm) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = strToFloat(inpTotal.value);
  calcTax(nameEntity, total, pIsTaxIncluded, pTaxDp, pTaxRm);
  var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
  var quantity = strToFloat(inpQuantity.value);
  var inpPrice = document.getElementById(nameEntity + pPriceNm);
  var price = numRound(total/quantity, pPriceDp, pPriceRm);
  inpPrice.value = numToStr(price.toString(), pPriceDp);
  var inpPriceVisible = document.getElementById(nameEntity + pPriceNm + "Visible");
  if (inpPriceVisible != null) {
    inpPriceVisible.value = inpPrice.value;
    inputHasBeenChanged(inpPriceVisible);
  } else {
    inputHasBeenChanged(inpPrice);
  }
  inputHasBeenChanged(pInp);
};

function calcTotalTax(pInp, nameEntity, pPriceNm, pPriceDp, pPriceRm, pIsTaxIncluded, pTaxDp, pTaxRm) {
  var inpPrice = document.getElementById(nameEntity + pPriceNm);
  var price = strToFloat(inpPrice.value);
  var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
  var quantity = strToFloat(inpQuantity.value);
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = numRound(price * quantity, pPriceDp, pPriceRm);
  inpTotal.value = numToStr(total.toString(), pPriceDp);
  var inpTotalVisible = document.getElementById(nameEntity + "itsTotalVisible");
  if (inpTotalVisible != null) {
    inpTotalVisible.value = inpTotal.value;
    inputHasBeenChanged(inpTotalVisible);
  } else {
    inputHasBeenChanged(inpTotal);
  }
  inputHasBeenChanged(pInp);
  calcTax(nameEntity, total, pIsTaxIncluded, pTaxDp, pTaxRm);
};

function setTaxCat(pTcRate, pTcNm, pIdDomBasePicker, pIsTaxIncluded, pTaxDp, pTaxRm, pPriceDp) {
  var whoPicking = CNVSTATE["Who Picking"][pIdDomBasePicker];
  var btnTaxDestination = document.getElementById(whoPicking["pickingEntity"] + "btnTaxDestination");
  var inpTaxNm = document.getElementById(whoPicking["pickingEntity"] + "taxCategory");
  var inpTaxRate = document.getElementById(whoPicking["pickingEntity"] + "itsPercentage");
  if (btnTaxDestination == null) {
    inpTaxNm.value = pTcNm;
    if (inpTaxRate != null) { // aggregate or only rate
      inpTaxRate.value = numToStr(pTcRate.toString(), pTaxDp);
      calcTaxFromTot(whoPicking["pickingEntity"], pIsTaxIncluded, pPriceDp, pTaxRm);
      inputHasBeenChanged(inpTaxRate);
    }
  } else {
    btnTaxDestination.style.display="inherit";
    inpTaxNm.value = "";
    if (inpTaxRate != null) { // aggregate or only rate
      inpTaxRate.value = "";
      calcTaxFromTot(whoPicking["pickingEntity"], pIsTaxIncluded, pPriceDp, pTaxRm);
      inputHasBeenChanged(inpTaxRate);
    }
  }
  inputHasBeenChanged(inpTaxNm);
};

function setDestTaxCat(pTcRate, pTcNm, pEntityName, pIsTaxIncluded, pTaxDp, pTaxRm, pPriceDp) {
  var inpTaxNm = document.getElementById(pEntityName + "taxCategory");
  inpTaxNm.value = pTcNm;
  inputHasBeenChanged(inpTaxNm);
  var inpTaxRate = document.getElementById(pEntityName + "itsPercentage");
  if (inpTaxRate != null) { // aggregate or only rate
    inpTaxRate.value = numToStr(pTcRate.toString(), pTaxDp);
    inputHasBeenChanged(inpTaxRate);
    calcTaxFromTot(pNameEntity, pIsTaxIncluded, pPriceDp, pTaxRm);
  }
  var btnTaxDestination = document.getElementById(pEntityName + "btnTaxDestination");
  btnTaxDestination.style.display="none";
};

function calcTaxFromTot(nameEntity, pIsTaxIncluded, pPriceDp, pTaxRm) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = strToFloat(inpTotal.value);
  calcTax(nameEntity, total, pIsTaxIncluded, pPriceDp, pTaxRm);
};

function calcTax(pNameEntity, pTotal, pIsTaxIncluded, pPriceDp, pTaxRm) {
  var inpTaxRate = document.getElementById(pNameEntity + "itsPercentage");
  var inpTaxTotal = document.getElementById(pNameEntity + "totalTaxes");
  var taxTotal;
  if (inpTaxRate.value == "") {
    taxTotal = 0.0;
  } else {
    var taxRate = strToFloat(inpTaxRate.value);
    if (pIsTaxIncluded) {
      taxTotal = numRound(pTotal-(pTotal/(1.0+taxRate/100.0)),  pPriceDp, pTaxRm);
    } else {
      taxTotal = numRound(pTotal*taxRate/100.0,  pPriceDp, pTaxRm);
    }
  }
  inpTaxTotal.value = numToStr(taxTotal.toString(), pPriceDp);
  inputHasBeenChanged(inpTaxTotal);
};
