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

//set UOM and known cost (if exist)  for picked item
function setCostUom(pKnownCost, uomId, uomName, idDomBasePicker, costPrecision, totalPrecision, pDsep, pDgSep) {
  var whoPicking = cnvState["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] + "unitOfMeasureId").value = uomId;
  var unitOfMeasureAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + "unitOfMeasureAppearanceVisible");
  unitOfMeasureAppearanceVisible.value = uomName;
  unitOfMeasureAppearanceVisible.onchange();
  if (pKnownCost != null) {
    var itsCostVisible = document.getElementById(whoPicking["pickingEntity"] + "itsCostVisible");
    var itsCost = document.getElementById(whoPicking["pickingEntity"] + "itsCost");
    if (itsCost.value != pKnownCost) {
      itsCostVisible.value = pKnownCost;
      itsCost.value = pKnownCost;
      calculateTotalForCost(whoPicking["pickingEntity"], costPrecision, totalPrecision, pDsep, pDgSep);
    }
  }
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

function calculateTotalTax(nameEntity, totalGross) {
  var inpAllowance = document.getElementById(nameEntity + "allowance");
  var inpPlusAmount = document.getElementById(nameEntity + "plusAmount");
  var inpPercentage = document.getElementById(nameEntity + "itsPercentage");
  var allowance = parseFloat(inpAllowance.value);
  var plusAmount = parseFloat(inpPlusAmount.value);
  var itsPercentage = parseFloat(inpPercentage.value);
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = plusAmount + (totalGross - allowance) * itsPercentage / 100;
  inpTotal.value = total.toFixed(2);
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
}

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
}

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
}

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
}

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
}
