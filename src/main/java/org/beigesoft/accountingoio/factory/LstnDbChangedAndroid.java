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

import java.security.KeyStore;

import android.database.Cursor;

import org.eclipse.jetty.security.DataBaseLoginService;

import org.beigesoft.delegate.IDelegateSimpleExc;
import org.beigesoft.service.ISrvDatabase;
import org.beigesoft.web.model.FactoryAndServlet;
import org.beigesoft.web.factory.AFactoryAppBeans;
import org.beigesoft.web.service.SrvAddTheFirstUser;
import org.beigesoft.ajetty.SrvGetUserCredentials;
import org.beigesoft.web.service.CryptoHelper;

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
    factoryAppBeans.lazyGet("ISrvOrm");
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
