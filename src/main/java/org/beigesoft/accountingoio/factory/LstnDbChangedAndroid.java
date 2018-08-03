package org.beigesoft.accountingoio.factory;

/*
 * Copyright (c) 2017 Beigesoft ™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

import java.util.List;
import java.util.ArrayList;
import java.security.KeyStore;

import android.database.Cursor;

import org.eclipse.jetty.security.DataBaseLoginService;

import org.beigesoft.delegate.IDelegateSimpleExc;
import org.beigesoft.service.ISrvDatabase;
import org.beigesoft.web.model.FactoryAndServlet;
import org.beigesoft.web.factory.AFactoryAppBeans;
import org.beigesoft.web.service.SrvAddTheFirstUser;
import org.beigesoft.ajetty.SrvGetUserCredentials;
import org.beigesoft.ajetty.LstnUserPswdChanged;
import org.beigesoft.ajetty.crypto.CryptoHelper;
import org.beigesoft.accounting.service.ISrvAccSettings;
import org.beigesoft.accounting.service.HndlAccVarsRequest;
import org.beigesoft.webstore.service.HndlTradeVarsRequest;
import org.beigesoft.webstore.service.ISrvTradingSettings;
import org.beigesoft.webstore.service.UtlTradeJsp;
import org.beigesoft.webstore.service.ISrvSettingsAdd;

/**
 * <p>Re-initializes external context after database
 * has been changed (i.e. switch from a.sqlite to b.sqlite).</p>
 *
 * @author Yury Demidenko
 */
public class LstnDbChangedAndroid implements IDelegateSimpleExc {

  /**
   * <p>Factory and servlet bundle.</p>
   **/
  private FactoryAndServlet factoryAndServlet;

  /**
   * <p>Make something with a model.</p>
   * @throws Exception - an exception
   * @param pFactoryAppBeans with make
   **/
  @Override
  public final void make() throws Exception {
    @SuppressWarnings("unchecked")
    AFactoryAppBeans<Cursor> factoryAppBeans =
      (AFactoryAppBeans<Cursor>) this.factoryAndServlet.getFactoryAppBeans();
    this.factoryAndServlet.getHttpServlet().getServletContext()
      .setAttribute("srvI18n", factoryAppBeans.lazyGet("ISrvI18n"));
    String langCountriesStr = this.factoryAndServlet.getHttpServlet()
      .getInitParameter("langCountries");
    List<String> lngCntLst = new ArrayList<String>();
    for (String str : langCountriesStr.split(",")) {
      lngCntLst.add(str);
    }
    String[] lngCntArr = new String[lngCntLst.size()];
    factoryAppBeans.lazyGetSrvI18n().add(lngCntLst.toArray(lngCntArr));
    this.factoryAndServlet.getHttpServlet().getServletContext()
      .setAttribute("sessionTracker",
        factoryAppBeans.lazyGet("ISessionTracker"));
    HndlTradeVarsRequest<Cursor> hndlTradeVarsRequest =
      new HndlTradeVarsRequest<Cursor>();
    hndlTradeVarsRequest.setLogger(factoryAppBeans.lazyGetLogger());
    hndlTradeVarsRequest.setSrvDatabase(factoryAppBeans.lazyGetSrvDatabase());
    hndlTradeVarsRequest.setSrvOrm(factoryAppBeans.lazyGetSrvOrm());
    hndlTradeVarsRequest.setUtlTradeJsp((UtlTradeJsp)
      factoryAppBeans.lazyGet("utlTradeJsp"));
    hndlTradeVarsRequest.setSrvSettingsAdd((ISrvSettingsAdd)
      factoryAppBeans.lazyGet("ISrvSettingsAdd"));
    hndlTradeVarsRequest.setSrvTradingSettings((ISrvTradingSettings)
      factoryAppBeans.lazyGet("ISrvTradingSettings"));
    HndlAccVarsRequest<Cursor> hndlAccVarsRequest =
      new HndlAccVarsRequest<Cursor>();
    hndlAccVarsRequest.setAdditionalI18nReqHndl(hndlTradeVarsRequest);
    hndlAccVarsRequest.setLogger(factoryAppBeans.lazyGetLogger());
    hndlAccVarsRequest.setSrvDatabase(factoryAppBeans.lazyGetSrvDatabase());
    hndlAccVarsRequest.setSrvOrm(factoryAppBeans.lazyGetSrvOrm());
    hndlAccVarsRequest.setSrvAccSettings((ISrvAccSettings) factoryAppBeans
      .lazyGet("ISrvAccSettings"));
    factoryAppBeans.lazyGetHndlI18nRequest()
      .setAdditionalI18nReqHndl(hndlAccVarsRequest);
    factoryAppBeans.lazyGet("ISrvOrm");
    // single user mode anyway:
    factoryAppBeans.getFactoryBldServices().lazyGetHandlerEntityRequest()
      .setChangingTranIsol(ISrvDatabase.TRANSACTION_READ_UNCOMMITTED);
    ISrvDatabase<Cursor> srvDb = (ISrvDatabase<Cursor>)
      factoryAppBeans.lazyGet("ISrvDatabase");
    @SuppressWarnings("unchecked")
    SrvAddTheFirstUser<Cursor> srvAddFiU = (SrvAddTheFirstUser<Cursor>)
      this.factoryAndServlet.getHttpServlet().getServletContext()
        .getAttribute("srvAddTheFirstUser");
    srvAddFiU.setSrvDatabase(srvDb);
    srvAddFiU.setIsThereAnyUser(false);
    DataBaseLoginService srvDbl = (DataBaseLoginService)
      this.factoryAndServlet.getHttpServlet().getServletContext()
        .getAttribute("JDBCRealm");
    if (srvDbl != null) {
      @SuppressWarnings("unchecked")
      SrvGetUserCredentials<Cursor> srvCr = (SrvGetUserCredentials<Cursor>)
        srvDbl.getSrvGetUserCredentials();
      srvCr.setSrvDatabase(srvDb);
      srvDbl.getUsers().clear();
      LstnUserPswdChanged lstnUserPswdChanged = new LstnUserPswdChanged();
      lstnUserPswdChanged.setDbLoginService(srvDbl);
      this.factoryAndServlet.getHttpServlet().getServletContext()
        .setAttribute("ILstnUserPswdChanged", lstnUserPswdChanged);
    }
    //crypto init:
    CryptoHelper ch = (CryptoHelper) factoryAppBeans.lazyGet("ICryptoHelper");
    KeyStore ks = (KeyStore) this.factoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ajettyKeystore");
    ch.setKeyStore(ks);
    String passw = (String) this.factoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ksPassword");
    ch.setKsPassword(passw.toCharArray());
    Integer ajettyIn = (Integer) this.factoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ajettyIn");
    ch.setAjettyIn(ajettyIn);
  }

  //Simple getters and setters:

  /**
   * <p>Getter for factoryAndServlet.</p>
   * @return FactoryAndServlet
   **/
  public final FactoryAndServlet getFactoryAndServlet() {
    return this.factoryAndServlet;
  }

  /**
   * <p>Setter for factoryAndServlet.</p>
   * @param pFactoryAndServlet reference
   **/
  public final void setFactoryAndServlet(
    final FactoryAndServlet pFactoryAndServlet) {
    this.factoryAndServlet = pFactoryAndServlet;
  }
}
