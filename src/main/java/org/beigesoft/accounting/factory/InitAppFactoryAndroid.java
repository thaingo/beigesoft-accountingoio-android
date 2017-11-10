package org.beigesoft.accounting.factory;

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

import java.io.File;

import android.database.Cursor;

import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.delegate.IDelegateExc;
import org.beigesoft.web.model.FactoryAndServlet;

/**
 * <p>
 * Initialize app-factory with servlet parameters.
 * </p>
 *
 * @author Yury Demidenko
 */
public class InitAppFactoryAndroid implements IDelegateExc<FactoryAndServlet> {

  /**
   * <p>Make something with a model.</p>
   * @throws Exception - an exception
   * @param pFactoryAndServlet with make
   **/
  @Override
  public final synchronized void makeWith(
    final FactoryAndServlet pFactoryAndServlet) throws Exception {
    FactoryAppBeansAndroid factoryAppBeans =
      (FactoryAppBeansAndroid) pFactoryAndServlet.getFactoryAppBeans();
    factoryAppBeans.setWebAppPath(pFactoryAndServlet.getHttpServlet()
      .getServletContext().getRealPath(""));
    FactoryBldAccServices<Cursor> factoryBldAccServices =
      new FactoryBldAccServices<Cursor>();
    factoryBldAccServices.setFactoryAppBeans(factoryAppBeans);
    factoryAppBeans.setFactoryBldServices(factoryBldAccServices);
    FactoryAccServices<Cursor> factoryAccServices =
      new FactoryAccServices<Cursor>();
    factoryAccServices.setFactoryAppBeans(factoryAppBeans);
    factoryAccServices.setFactoryBldAccServices(factoryBldAccServices);
    factoryBldAccServices.setFactoryAccServices(factoryAccServices);
    factoryAppBeans.setFactoryOverBeans(factoryAccServices);
    String isShowDebugMessagesStr = pFactoryAndServlet.getHttpServlet()
      .getInitParameter("isShowDebugMessages");
    factoryAppBeans.setIsShowDebugMessages(Boolean
      .valueOf(isShowDebugMessagesStr));
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
    factoryAppBeans.setContext(aContext);
    File uploadDirectory = new File(aContext.getFilesDir().getAbsolutePath()
     + "/uploads");
    if (!uploadDirectory.exists() && !uploadDirectory.mkdirs()) {
      throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
        "Can't create dir " + uploadDirectory);
    }
    factoryAppBeans.setUploadDirectory(uploadDirectory.getAbsolutePath());
    pFactoryAndServlet.getHttpServlet().getServletContext()
      .setAttribute("srvI18n", factoryAppBeans.lazyGet("ISrvI18n"));
    //to create/initialize database if need:
    factoryAppBeans.lazyGet("ISrvOrm");
  }
}
