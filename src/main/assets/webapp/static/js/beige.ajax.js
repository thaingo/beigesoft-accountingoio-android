/*
 * Copyright (c) 2015-2017 Beigesoft ™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

function getHtmlByAjax(method,url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    takeRequest(xmlhttp);
  };
  xmlhttp.open(method, encodeURI(url), true);
  xmlhttp.send();
};

function sendFormByAjax(pFrm, pAddParams) {
  var xmlhttp = new XMLHttpRequest();
  var frmData = new FormData(pFrm);
  if (pAddParams != null) {
    pAddParams.split("&").forEach(function(paramValue) {
      var arrParamValue = paramValue.split("=");
      frmData.append(arrParamValue[0], arrParamValue[1]);
    });
  }
  xmlhttp.open(pFrm.method, pFrm.action, true);
  xmlhttp.onload = function(evnt) {
    takeRequest(xmlhttp);
  };
  xmlhttp.send(frmData);
};

function takeRequest(xmlhttp) {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    if (xmlhttp.responseText.indexOf('j_security_check') > 0) {
      location.reload();
    }
    var complRes = JSON.parse(xmlhttp.responseText);
    var arr=complRes.multiTargetResponse;
    for (var i = 0; i < arr.length; i++) {
      var target = document.getElementById(arr[i].nameTarget);
      if (target == null) {
        target = document.createElement('div');
        target.setAttribute("id", arr[i].nameTarget);
        document.getElementById(arr[i].nameTargetParent).appendChild(target);
      }
      target.innerHTML = arr[i].content;
      if (arr[i].javascript!=null) {
        eval(arr[i].javascript);
      }
    }
  }
  else if (xmlhttp.readyState == 4) {
    if (xmlhttp.responseText == "") {
      document.getElementById("errorPlace").innerHTML = "<h4>http status = " + xmlhttp.status
        +"!!! </h4>";
    } else {
      document.getElementById("errorPlace").innerHTML = xmlhttp.responseText;
    }
    document.getElementById("dlgError").showModal();
  }
};
