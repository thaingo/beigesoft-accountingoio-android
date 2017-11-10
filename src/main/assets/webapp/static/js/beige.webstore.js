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

function setCartItem(pCartItemType, pCartItemId, pCartItemName, pCartItemPrice, pCartItemQuantity, pAvailableQuantity, pCartItemItsId) {
  var pref = "";
  if (pCartItemItsId != null) {
    pref = "Edit";
    var cartItemItsId = document.getElementById("cartItemItsId" + pref);
    cartItemItsId.value = pCartItemItsId;
    $('#cartEditMdl').modal({keyboard: false, backdrop: false});
  } else {
    $('#cartAddMdl').modal('show');
  }
  var cartItemName = document.getElementById("cartItemName" + pref);
  cartItemName.value = pCartItemName;
  var cartItemPrice = document.getElementById("cartItemPrice" + pref);
  cartItemPrice.value = pCartItemPrice;
  var cartItemQuantity = document.getElementById("cartItemQuantity" + pref);
  cartItemQuantity.value = pCartItemQuantity;
  cartItemQuantity.max = pAvailableQuantity;
  var cartItemAvailableQuantity = document.getElementById("cartItemAvailableQuantity" + pref);
  cartItemAvailableQuantity.value = pAvailableQuantity;
  var cartItemType = document.getElementById("cartItemType" + pref);
  cartItemType.value = pCartItemType;
  var cartItemId = document.getElementById("cartItemId" + pref);
  cartItemId.value = pCartItemId;
  refreshCartItemTotal(pref);
};

function refreshCartItemTotal(pPref) {
  var cartItemPrice = document.getElementById("cartItemPrice" + pPref);
  var cartItemQuantity = document.getElementById("cartItemQuantity" + pPref);
  var cartItemTotal = document.getElementById("cartItemTotal" + pPref);
  cartItemTotal.value = cartItemPrice.value * cartItemQuantity.value;
};

function delCartItem(pCartItemType, pCartItemId, pCartItemName, pCartItemPrice, pCartItemQuantity, pCartItemItsId) {
  var cartItemName = document.getElementById("cartItemNameDel");
  cartItemName.value = pCartItemName;
  var cartItemPrice = document.getElementById("cartItemPriceDel");
  cartItemPrice.value = pCartItemPrice;
  var cartItemQuantity = document.getElementById("cartItemQuantityDel");
  cartItemQuantity.value = pCartItemQuantity;
  var cartItemTotal = document.getElementById("cartItemTotalDel");
  cartItemTotal.value = pCartItemPrice * pCartItemQuantity;
  var cartItemItsId = document.getElementById("cartItemItsIdDel");
  cartItemItsId.value = pCartItemItsId;
};
