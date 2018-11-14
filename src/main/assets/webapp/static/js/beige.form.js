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
/*
 * implements logic "form has been changed" "nothing to send"
 * and "Ajax submit"
 */
 
//Conversation state variables
var CNVSTATE = {
    "Who Picking" : {},
  };
  
window.onbeforeunload = function(e) {
  if(anyOpenedFormHasBeenChanged()) {
    return MSGS["formHasBeenChanged"];
  }
};

window.onload=function(e){
  initJs();
};

function initJs(){
  CNVSTATE["Who Picking"]={};
}

function getHtmlByAjaxCareful(method, url) {
  if (anyOpenedFormHasBeenChanged()) {
    var funcYes = function() {
      document.getElementById('dlgConfirm').close();
      getHtmlByAjax(method,url);
    };
    showConfirm(MSGS["formHasBeenChanged"], funcYes);
  } else {
    getHtmlByAjax(method,url);
  }
};

function anyOpenedFormHasBeenChanged() {
  var forms = document.querySelectorAll('form');
  for(var i=0; i < forms.length; i++) {
    var formDlg = document.getElementById(forms[i].id.replace("Frm", "Dlg"));
    if(formDlg != null && formDlg.open && formHasBeenChanged(forms[i])) {
      return true;
    }
  }
  return false;
};

function inputHasBeenChanged(inpt) {
  switch (inpt.type) {
  case "select-one":
    if (!inpt.options[inpt.selectedIndex].defaultSelected && !inpt.classList.contains('changed')) {
      inpt.classList.add('changed');
      return true;
    } else if(inpt.options[inpt.selectedIndex].defaultSelected && inpt.classList.contains('changed')) {
      inpt.classList.remove('changed');
      return true;
    }
    return false;
  case "checkbox":
    return checkableChanged(inpt);
  case "radio":
    var radios = document.getElementsByName(inpt.name);
    var isChanged = false;
    for (i = 0; i < radios.length; i++) {
      if (radios[i].type == "radio") { //filter hidden from main form
        if (checkableChanged(radios[i])) {
          isChanged = true;
        }
      }
    }
    return isChanged;
  default:
    if (inpt.value != inpt.defaultValue && !inpt.classList.contains('changed')) {
      inpt.classList.add('changed');
      return true;
    } else if(inpt.value == inpt.defaultValue && inpt.classList.contains('changed')) {
      inpt.classList.remove('changed');
      return true;
    }
    return false;
  }
};

function checkableChanged(inpt) {
  if(inpt.checked != inpt.defaultChecked && !inpt.labels[0].classList.contains('changed')) {
    inpt.labels[0].classList.add('changed');
    return true;
  } else if(inpt.checked == inpt.defaultChecked && inpt.labels[0].classList.contains('changed')) {
    inpt.labels[0].classList.remove('changed');
    return true;
  }
  return false;
};

function filterOperChanged(inpt, nameInput) {
  inputHasBeenChanged(inpt);
  var isDisabled = !(inpt.options[inpt.selectedIndex].value == "gt"
    || inpt.options[inpt.selectedIndex].value == "lt"
    || inpt.options[inpt.selectedIndex].value == "eq");
  document.getElementById(nameInput).disabled = isDisabled;
};

function filterStringChanged(inpt, nameInput1) {
  inputHasBeenChanged(inpt);
  var isDisabled = (inpt.options[inpt.selectedIndex].value == "disabled");
  document.getElementById(nameInput1).disabled = isDisabled;
};

function openDlg(idDlg) {
  document.getElementById(idDlg).showModal();
};

function closeDlg(nameDlg) {
  document.getElementById(nameDlg).close();
};

function closeDlgCareful(idDomBase) {
  var pFrm=document.getElementById(idDomBase + "Frm");
  if (formHasBeenChanged(pFrm)) {
    var funcYes = function() {
      document.getElementById(idDomBase + "Dlg").close();
      document.getElementById('dlgConfirm').close();
    };
    showConfirm(MSGS["formHasBeenChanged"], funcYes);
  } else {
    document.getElementById(idDomBase + "Dlg").close();
  }
};

function clearChangesAndCloseDialog(idDomBase) {
  document.getElementById(idDomBase + "Dlg").close();
  removeFormChanges(document.getElementById(idDomBase + "Frm"));
};

function submitFormByAjaxConfirm(pIdFrm, pIsMustHasChanges, pAddParams) {
  var funcYes = function() {
    document.getElementById('dlgConfirm').close();
    submitFormByAjax(pIdFrm, pIsMustHasChanges, pAddParams);
  };
  showConfirm(MSGS['are_you_sure'], funcYes);
};

function submitFormByAjax(pIdFrm, pIsMustHasChanges, pAddParams) {
  var frm = document.getElementById(pIdFrm);
  if (checkForm(frm, pIsMustHasChanges)) {
    sendFormByAjax(frm, pAddParams);
  }
};

function submitFormForNewWindow(pIdFrm, pIsMustHasChanges) {
  var frm = document.getElementById(pIdFrm);
  if (checkForm(frm, pIsMustHasChanges)) {
    frm.submit();
    removeFormChanges(frm);
  }
};

function checkForm(pFrm, pIsMustHasChanges) {
  if (!pFrm.checkValidity()){
    document.getElementById(pFrm.id + 'FakeSubmit').click();
    return false;
  }
  if (pIsMustHasChanges == null || pIsMustHasChanges) {
    if (!formHasBeenChanged(pFrm)){
      showWarning(MSGS["nothingToSend"]);
      return false;
    }
  }
  //validation of owned entity
  reqiredChildSelected = true;
  inputs = pFrm.querySelectorAll('input[type="hidden"][required]');
  for (var i=0; i < inputs.length; i++)
    if(inputs[i].value==""){
      reqiredChildSelected=false;
      break;
    }
  if(!reqiredChildSelected) {
    showWarning(MSGS['select_child']);
    return false;
  }
  return true;
};

function formHasBeenChanged(pFrm) {
  var childrenChanged = pFrm.querySelectorAll(".changed");
  if (childrenChanged.length > 0) {
    return true;
  }
  return false;
};

function removeFormChanges(pFrm) {
  inputs = pFrm.querySelectorAll(".changed");
  for (var i=0; i < inputs.length; i++) {
    inputs[i].classList.remove('changed');
  }
  var inputs = pFrm.querySelectorAll('input[type="radio"]:not([disabled])');
  for (var i=0; i < inputs.length; i++){
    inputs[i].defaultChecked = inputs[i].checked;     
  }
  inputs = pFrm.querySelectorAll('select:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    for (var j=0; j < inputs[i].options.length; j++) {
      inputs[i].options[j].defaultSelected = false;
    }
    inputs[i].options[inputs[i].selectedIndex].defaultSelected = true;
  }
  inputs = pFrm.querySelectorAll('input[type="checkbox"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultChecked = inputs[i].checked;
  }
  inputs = pFrm.querySelectorAll('input[type="text"]');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('textarea');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('input[type="hidden"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('input[type="textarea"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('input[type="datetime-local"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('input[type="date"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
  inputs = pFrm.querySelectorAll('input[type="number"]:not([disabled])');
  for (var i=0; i < inputs.length; i++) {
    inputs[i].defaultValue=inputs[i].value;
  }
};

function selectEntity(entityId, entityAppearance, idDomBasePicker) {
  whoPicking = CNVSTATE["Who Picking"][idDomBasePicker];
  document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] +"Id").setAttribute("value", entityId);
  var inpAppearance = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "Appearance");
  if (inpAppearance != null) { //invisible appearence to be sent
    inpAppearance.setAttribute("value", entityAppearance);
  }
  var inpAppearanceVisible = document.getElementById(whoPicking["pickingEntity"] + whoPicking["pickingField"] + "AppearanceVisible");
  inpAppearanceVisible.value = entityAppearance;
  inpAppearanceVisible.onchange();
  document.getElementById(idDomBasePicker+"Dlg").close();
};

function clearSelectedEntity(idDomBaseProperty) {
  var inpId = document.getElementById(idDomBaseProperty + "Id");
  if (inpId.value != "") {
    inpId.setAttribute("value", "");
    var inpAppearance = document.getElementById(idDomBaseProperty + "Appearance");
    if (inpAppearance != null) { //invisible appearence to be sent
      inpAppearance.setAttribute("value", "");
    }
    var inpAppearanceVisible = document.getElementById(idDomBaseProperty + "AppearanceVisible");
    inpAppearanceVisible.value = "";
    inpAppearanceVisible.onchange();
  }
};

function openEntityPicker(pickedEntity, pickingEntity, pickingField, addParam){
  var pickerPlace = "pickersPlace";
  var pickerForEntity = document.getElementById(pickerPlace + pickedEntity + "Dlg");
  var pikerRenderer = null;
  if (pickerForEntity != null) {
    if (!pickerForEntity.open) {
      if (CNVSTATE["Who Picking"][pickerPlace + pickedEntity + "addParam"] == addParam) {
        pickerForEntity.showModal();
      } else {
        pikerRenderer = "pickerWholeJson";
      }
    } else {
      if (addParam != null) {
        addParam.replace("fltordP", "fltordPD");
      }
      pikerPlace = "pickersPlaceDub";
      pickerForEntity = document.getElementById(pickerPlace + pickedEntity + "Dlg");
      if (pickerForEntity != null) {
        if (!pickerForEntity.open) {
          if (CNVSTATE["Who Picking"][pickerPlace + pickedEntity + "addParam"] == addParam) {
              pickerForEntity.showModal();
          } else {
            pikerRenderer = "pickerDubWholeJson";
          }
        } else {
          showError(MSGS['2_pickers_opened_already_for'] + pickedEntity);
        }
      } else {
        pikerRenderer = "pickerDubWholeJson";
      }
    }
  } else {
    pikerRenderer = "pickerWholeJson";
  }
  if (pikerRenderer != null) {
    var paramsStr = "service/?nmsAct=list&page=1&nmRnd=" + pikerRenderer + "&nmEnt="
    + pickedEntity;
    CNVSTATE["Who Picking"][pickerPlace + pickedEntity + "addParam"] = addParam;
    if (addParam != null) {
      getHtmlByAjax('GET', paramsStr + addParam);
    } else {
      getHtmlByAjax('GET', paramsStr);
    }
  }
  CNVSTATE["Who Picking"][pickerPlace + pickedEntity] = {pickingEntity, pickingField};
};

function confirmHref(inpHref, msg) {
  var funcYes = function() {
    window.location.assign(inpHref.href);
    document.getElementById('dlgConfirm').close();
  };
  showConfirm(msg, funcYes);
};

function confirmSubmit(inpSbmt, msg) {
  var funcYes = function() {
    inpSbmt.form.submit();
    document.getElementById('dlgConfirm').close();
  };
  showConfirm(msg, funcYes);
};

function showConfirm(msg, yesHandler) {
  document.getElementById("confirmPlace").innerHTML = msg;
  document.getElementById("dlgConfirm").showModal();
  document.getElementById("confirmYes").onclick = yesHandler;
};

function showWarning(msg) {
  document.getElementById("warningPlace").innerHTML = msg;
  document.getElementById("dlgWarning").showModal();
};

function showError(msg) {
  document.getElementById("errorPlace").innerHTML = msg;
  document.getElementById("dlgError").showModal();
};

function showSuccess(msg) {
  document.getElementById("successPlace").innerHTML = msg;
  document.getElementById("dlgSuccess").style.display = "block";
  setTimeout(closeSuccess, 3000);
};

function closeSuccess() {
  document.getElementById("dlgSuccess").style.display = "none";
};

function calcTotal(pInp, nameEntity, pPriceNm, pDecPl, pRm) {
  var inpPrice = document.getElementById(nameEntity + pPriceNm);
  var price = strToFloat(inpPrice.value);
  var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
  var quantity = strToFloat(inpQuantity.value);
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = numRound(price * quantity, pDecPl, pRm);
  var totals = numToStr(total.toString(), pDecPl);
  inpTotal.value = totals;
  var inpTotalVisible = document.getElementById(nameEntity + "itsTotalVisible");
  if (inpTotalVisible != null) {
    inpTotalVisible.value = totals;
    inputHasBeenChanged(inpTotalVisible);
  } else {
    inputHasBeenChanged(inpTotal);
  }
  inputHasBeenChanged(pInp);
};

function calcPrice(pInp, nameEntity, pPriceNm, pDecPl, pRm) {
  var inpTotal = document.getElementById(nameEntity + "itsTotal");
  var total = strToFloat(inpTotal.value);
  var inpQuantity = document.getElementById(nameEntity + "itsQuantity");
  var quantity = strToFloat(inpQuantity.value);
  var inpPrice = document.getElementById(nameEntity + pPriceNm);
  var price = numRound(total/quantity, pDecPl, pRm);
  var prices = numToStr(price.toString(), pDecPl);
  inpPrice.value = prices;
  var inpPriceVisible = document.getElementById(nameEntity + pPriceNm + "Visible");
  if (inpPriceVisible != null) {
    inpPriceVisible.value = prices;
    inputHasBeenChanged(inpPriceVisible);
  } else {
    inputHasBeenChanged(inpPrice);
  }
  inputHasBeenChanged(pInp);
};

function makeRelatedInput(pInput, pIdRelInp) {
  var inpRel = document.getElementById(pIdRelInp);
  if (pInput.value != "") {
    inpRel.required = true;
  } else {
    inpRel.required = false;
    inpRel.value = "";
  }
};

function fileUpPathChanged(pInp, pInpFileUpNm, pInpParamNameFileToUploadNm) {
  if (pInp.value != "") {
    var inpFileUp = document.getElementById(pInpFileUpNm);
    inpFileUp.value = "";
    if (inpFileUp.required) {
      pInp.required = true;
      inpFileUp.required = false;
    }
    inputHasBeenChanged(inpFileUp);
    var inpParamNameFileToUpload = document.getElementById(pInpParamNameFileToUploadNm);
    inpParamNameFileToUpload.disabled = true;
  }
  inputHasBeenChanged(pInp);
};

function fileUpChanged(pInp, pInpFileUpPathNm, pInpParamNameFileToUploadNm) {
  if (pInp.value != "") {
    var inpFileUpPath = document.getElementById(pInpFileUpPathNm);
    inpFileUpPath.value = "";
    if (inpFileUpPath.required) {
      pInp.required = true;
      inpFileUpPath.required = false;
    }
    inputHasBeenChanged(inpFileUpPath);
    var inpParamNameFileToUpload = document.getElementById(pInpParamNameFileToUploadNm);
    inpParamNameFileToUpload.disabled = false;
  }
  inputHasBeenChanged(pInp);
};

/*
 * <p>Initializes BS inputs for class "bsNum[dpm]", where dpm:
 * 0 - 0 DP; 1 - 1 DP; 2m - 2DP, nmin -999999999.99.
 * </p>
 * @param pUsedDpm comma separated DPM
 * @param pParent ID of parent DOM
 */
function initBsInpsNum(pUsedDpm, pParent) {
  $.each(pUsedDpm.split(","), function (idx, dpm) {
    var dp = parseInt(dpm.charAt(0));
    var ndef = {decPl: dp};
    if (dpm.length > 1) {
      nmins = "-999999999";
      if (dp > 0) {
        nmins = nmins + ".9";
        for (i = 1; i < dp; i++) {
          nmins = nmins + "9";
        }
      }
      ndef.nmin = parseFloat(nmins);
    }
    if (pParent == null) {
      $(".bsNum" + dpm).bsInpNumber(ndef);
    } else {
      $("#" + pParent).find(".bsNum" + dpm).bsInpNumber(ndef);
    }
  });
};

/*
 * <p>Initializes BS inputs for class "bsNum[step]", where step:
 * 0d25 - 0.25, 1 - 1, 2d5 - 2.5.
 * It's useful for initialize "quantity" that has minimum=step, shopping cart
 * may has items with different quantity's step.
 * </p>
 * @param pUsedSteps comma separated steps
 * @param pParent ID of parent DOM
 */
function initBsInpsNumStep(pUsedSteps, pParent) {
  $.each(pUsedSteps.split(","), function (idx, sts) {
    var stsd = sts.replace("d", ".");
    var st = parseFloat(stsd);
    var ndef = {step: st};
    if (pParent == null) {
      $(".bsNum" + sts).bsInpNumber(ndef);
    } else {
      $("#" + pParent).find(".bsNum" + sts).bsInpNumber(ndef);
    }
  });
};
