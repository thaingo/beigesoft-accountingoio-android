package org.beigesoft.accountingoio.factory;

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

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.security.KeyStore;

import android.database.Cursor;

import org.eclipse.jetty.security.DataBaseLoginService;

import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.delegate.IDelegate;
import org.beigesoft.web.model.FactoryAndServlet;
import org.beigesoft.service.ISrvDatabase;
import org.beigesoft.web.service.SrvAddTheFirstUser;
import org.beigesoft.ajetty.LstnUserPswdChanged;
import org.beigesoft.ajetty.SrvGetUserCredentials;
import org.beigesoft.ajetty.crypto.CryptoHelper;
import org.beigesoft.accounting.service.ISrvAccSettings;
import org.beigesoft.accounting.service.HndlAccVarsRequest;
import org.beigesoft.webstore.service.HndlTradeVarsRequest;
import org.beigesoft.webstore.service.ISrvTradingSettings;
import org.beigesoft.webstore.service.UtlTradeJsp;
import org.beigesoft.webstore.service.ISrvSettingsAdd;

/**
 * <p>
 * Initialize app-factory with servlet parameters.
 * </p>
 *
 * @author Yury Demidenko
 */
public class InitAppFactoryAndroidHttps
  implements IDelegate<FactoryAndServlet> {

  /**
   * <p>Make something with a model.</p>
   * @param pReqVars additional request scoped parameters
   * @throws Exception - an exception
   * @param pFactoryAndServlet with make
   **/
  @Override
  public final synchronized void makeWith(final Map<String, Object> pReqVars,
    final FactoryAndServlet pFactoryAndServlet) throws Exception {
    FactoryAppBeansAndroid factoryAppBeans =
      (FactoryAppBeansAndroid) pFactoryAndServlet.getFactoryAppBeans();
    factoryAppBeans.setWebAppPath(pFactoryAndServlet.getHttpServlet()
      .getServletContext().getRealPath(""));
    String isShowDebugMessagesStr = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("isShowDebugMessages");
    factoryAppBeans.setIsShowDebugMessages(Boolean
      .valueOf(isShowDebugMessagesStr));
    String detailLevelStr = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("detailLevel");
    factoryAppBeans.setDetailLevel(Integer.parseInt(detailLevelStr));
    String newDatabaseIdStr = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("newDatabaseId");
    factoryAppBeans.setNewDatabaseId(Integer.parseInt(newDatabaseIdStr));
    String ormSettingsDir = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("ormSettingsDir");
    factoryAppBeans.setOrmSettingsDir(ormSettingsDir);
    String ormSettingsBaseFile = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("ormSettingsBaseFile");
    factoryAppBeans.setOrmSettingsBaseFile(ormSettingsBaseFile);
    String uvdSettingsDir = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("uvdSettingsDir");
    factoryAppBeans.setUvdSettingsDir(uvdSettingsDir);
    String uvdSettingsBaseFile = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("uvdSettingsBaseFile");
    factoryAppBeans.setUvdSettingsBaseFile(uvdSettingsBaseFile);
    factoryAppBeans.setWriteTi(1);
    factoryAppBeans.setReadTi(1);
    factoryAppBeans.setWriteReTi(1);
    factoryAppBeans.setWrReSpTr(false);
    factoryAppBeans.setFastLoc(false);
    String databaseName = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("databaseName");
    factoryAppBeans.setDatabaseName(databaseName);
    android.content.Context aContext = (android.content.Context)
      pFactoryAndServlet.getHttpServlet().getServletContext()
        .getAttribute("android.content.Context");
    if (aContext == null) {
      throw new ExceptionWithCode(
        ExceptionWithCode.CONFIGURATION_MISTAKE,
          "Servlet context attribute android.content.Context is null!!!");
    }
    String langCountriesStr = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("langCountries");
    List<String> lngCntLst = new ArrayList<String>();
    for (String str : langCountriesStr.split(",")) {
      lngCntLst.add(str);
    }
    String[] lngCntArr = new String[lngCntLst.size()];
    factoryAppBeans.lazyGetSrvI18n().add(lngCntLst.toArray(lngCntArr));
    factoryAppBeans.setContext(aContext);
    pFactoryAndServlet.getHttpServlet().getServletContext()
      .setAttribute("srvI18n", factoryAppBeans.lazyGet("ISrvI18n"));
    pFactoryAndServlet.getHttpServlet().getServletContext()
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
    LstnDbChangedAndroid lstnDbChanged = new LstnDbChangedAndroid();
    lstnDbChanged.setFactoryAndServlet(pFactoryAndServlet);
    factoryAppBeans.getListenersDbChanged().add(lstnDbChanged);
    @SuppressWarnings("unchecked")
    ISrvDatabase<Cursor> srvDb = (ISrvDatabase<Cursor>)
      factoryAppBeans.lazyGet("ISrvDatabase");
    SrvAddTheFirstUser<Cursor> srvAddFiU = new SrvAddTheFirstUser<Cursor>();
    srvAddFiU.setSrvDatabase(srvDb);
    pFactoryAndServlet.getHttpServlet().getServletContext()
      .setAttribute("srvAddTheFirstUser", srvAddFiU);
    DataBaseLoginService srvDbl = (DataBaseLoginService)
      pFactoryAndServlet.getHttpServlet().getServletContext()
        .getAttribute("JDBCRealm");
    if (srvDbl != null) {
      SrvGetUserCredentials<Cursor> srvCr = new SrvGetUserCredentials<Cursor>();
      srvCr.setSrvDatabase(srvDb);
      srvDbl.setSrvGetUserCredentials(srvCr);
      LstnUserPswdChanged lstnUserPswdChanged = new LstnUserPswdChanged();
      lstnUserPswdChanged.setDbLoginService(srvDbl);
      pFactoryAndServlet.getHttpServlet().getServletContext()
        .setAttribute("ILstnUserPswdChanged", lstnUserPswdChanged);
    }
    //crypto init:
    CryptoHelper ch = (CryptoHelper) factoryAppBeans.lazyGet("ICryptoHelper");
    KeyStore ks = (KeyStore) pFactoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ajettyKeystore");
    ch.setKeyStore(ks);
    String passw = (String) pFactoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ksPassword");
    ch.setKsPassword(passw.toCharArray());
    Integer ajettyIn = (Integer) pFactoryAndServlet.getHttpServlet()
      .getServletContext().getAttribute("ajettyIn");
    ch.setAjettyIn(ajettyIn);
  }
}
