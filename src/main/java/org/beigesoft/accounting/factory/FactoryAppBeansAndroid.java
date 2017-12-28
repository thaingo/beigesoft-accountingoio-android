package org.beigesoft.accounting.factory;

/*
 * Copyright (c) 2016 Beigesoft ™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

import java.util.Properties;
import java.io.File;
import java.io.InputStream;
import java.net.URL;

import android.os.Environment;
import android.content.Context;
import android.content.ContextWrapper;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import org.beigesoft.log.ILogger;
import org.beigesoft.log.LoggerFile;
import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.replicator.service.PrepareDbAfterGetCopy;
import org.beigesoft.web.factory.AFactoryAppBeans;
import org.beigesoft.orm.service.SrvOrmAndroid;

import org.beigesoft.android.sqlite.service.CursorFactory;
import org.beigesoft.android.sqlite.service.SrvDatabase;

/**
 * <p>
 * Application beans factory for Android.
 * </p>
 *
 * @author Yury Demidenko
 */
public class FactoryAppBeansAndroid extends AFactoryAppBeans<Cursor> {

  /**
   * <p>Android context.</p>
   **/
  private Context context;

  /**
   * <p>Invoke complex inner factories initialization.</p>
   * @throws Exception - an exception
   **/
  public FactoryAppBeansAndroid() throws Exception {
    init();
  }

  //To override:
  /**
   * <p>Initialize inner factories after clear beans or on startup.</p>
   * @throws Exception - an exception
   */
  @Override
  public final synchronized void init() throws Exception {
    FactoryBldAccServices<Cursor> factoryBldAccServices =
      new FactoryBldAccServices<Cursor>();
    factoryBldAccServices.setFactoryAppBeans(this);
    setFactoryBldServices(factoryBldAccServices);
    FactoryAccServices<Cursor> factoryAccServices =
      new FactoryAccServices<Cursor>();
    factoryAccServices.setFactoryAppBeans(this);
    factoryAccServices.setFactoryBldAccServices(factoryBldAccServices);
    factoryBldAccServices.setFactoryAccServices(factoryAccServices);
    setFactoryOverBeans(factoryAccServices);
    FactoryAccReplicatorXmlHttps<Cursor> factoryReplicatorXmlHttps =
      new FactoryAccReplicatorXmlHttps<Cursor>();
    factoryReplicatorXmlHttps.setFactoryAppBeans(this);
    setFactoryReplicatorXmlHttps(factoryReplicatorXmlHttps);
    FactoryAccDatabaseWriterXml<Cursor> factoryDatabaseWriterXml =
      new FactoryAccDatabaseWriterXml<Cursor>();
    factoryDatabaseWriterXml.setFactoryAppBeans(this);
    setFactoryDatabaseWriterXml(factoryDatabaseWriterXml);
  }

  /**
   * <p>Get other bean in lazy mode (if bean is null then initialize it).</p>
   * @param pBeanName - bean name
   * @return Object - requested bean
   * @throws Exception - an exception
   */
  @Override
  public final Object lazyGetOtherBean(
    final String pBeanName) throws Exception {
    if ("CursorFactory".equals(pBeanName)) {
      return lazyGetCursorFactory();
    } else if ("IMngDatabaseExt".equals(pBeanName)) {
      return lazyGetMngDatabaseAndroid();
    } else {
      return null;
    }
  }

  /**
   * <p>Is need to SQL escape (character ').</p>
   * @return for Android false, JDBC - true.
   */
  @Override
  public final boolean getIsNeedsToSqlEscape() {
    return false;
  }

  /**
   * <p>Instantiate ORM  service.</p>
   * @return SrvOrmAndroid - ORM  service
   */
  @Override
  public final SrvOrmAndroid<Cursor> instantiateSrvOrm() {
    SrvOrmAndroid<Cursor> srvOrmAndroid = new SrvOrmAndroid<Cursor>();
    return srvOrmAndroid;
  }

  /**
   * <p>Get Service that prepare Database after full import
   * in lazy mode.</p>
   * @return IDelegator - preparator Database after full import.
   * @throws Exception - an exception
   */
  @Override
  public final PrepareDbAfterGetCopy
    lazyGetPrepareDbAfterFullImport() throws Exception {
    String beanName = getPrepareDbAfterFullImportName();
    PrepareDbAfterGetCopy prepareDbAfterGetCopy =
      (PrepareDbAfterGetCopy) getBeansMap().get(beanName);
    if (prepareDbAfterGetCopy == null) {
      prepareDbAfterGetCopy = new PrepareDbAfterGetCopy();
      prepareDbAfterGetCopy.setLogger(lazyGetLogger());
      prepareDbAfterGetCopy.setFactoryAppBeans(this);
      getBeansMap().put(beanName, prepareDbAfterGetCopy);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return prepareDbAfterGetCopy;
  }

  /**
   * <p>Get SrvDatabase in lazy mode.</p>
   * @return SrvDatabase - SrvDatabase
   * @throws Exception - an exception
   */
  @Override
  public final ILogger lazyGetLogger() throws Exception {
    String beanName = getLoggerName();
    LoggerFile logger = (LoggerFile) getBeansMap().get(beanName);
    if (logger == null) {
      logger = new LoggerFile();
      logger.setIsShowDebugMessages(getIsShowDebugMessages());
      String currDir = this.context.getFilesDir().getAbsolutePath();
      String fileBaseName = "beige-accounting";
      logger.setFilePath(currDir + File.separator + fileBaseName);
      Log.i("A-Jetty", "> Log file path: " + logger.getFilePath());
      String logPropFn = "/" + fileBaseName + ".properties";
      URL urlSetting = FactoryAppBeansAndroid.class.getResource(logPropFn);
      if (urlSetting != null) {
        Log.i("A-Jetty",
          "> Found properties: " + logPropFn);
        InputStream inputStream = null;
        try {
          Properties props = new Properties();
          inputStream = FactoryAppBeansAndroid.class
            .getResourceAsStream(logPropFn);
          props.load(inputStream);
          String fileMaxSizeStr = props.getProperty("fileMaxSize");
          if (fileMaxSizeStr != null) {
            Integer fileMaxSize = Integer.parseInt(fileMaxSizeStr);
            logger.setFileMaxSize(fileMaxSize);
          }
          String maxIdleTimeStr = props.getProperty("maxIdleTime");
          if (maxIdleTimeStr != null) {
            Integer maxIdleTime = Integer.parseInt(maxIdleTimeStr);
            logger.setMaxIdleTime(maxIdleTime);
          }
          String isCloseFileAfterRecordStr = props
            .getProperty("isCloseFileAfterRecord");
          if (isCloseFileAfterRecordStr != null) {
            Boolean isCloseFileAfterRecord = Boolean
              .valueOf(isCloseFileAfterRecordStr);
            logger.setIsCloseFileAfterRecord(isCloseFileAfterRecord);
          }
          String isShowDebugMessagesStr = props
            .getProperty("isShowDebugMessages");
          if (isShowDebugMessagesStr != null) {
            Boolean isShowDebugMessages = Boolean
              .valueOf(isShowDebugMessagesStr);
            logger.setIsShowDebugMessages(isShowDebugMessages);
          }
        } catch (Exception ex) {
          ex.printStackTrace();
        } finally {
          if (inputStream != null) {
            try {
              inputStream.close();
            } catch (Exception ex) {
              ex.printStackTrace();
            }
          }
        }
      } else {
        Log.i("A-Jetty",
          "> There is no properties: " + logPropFn);
      }
      getBeansMap().put(beanName, logger);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return logger;
  }

  /**
   * <p>Get SrvDatabase in lazy mode.</p>
   * @return SrvDatabase - SrvDatabase
   * @throws Exception - an exception
   */
  @Override
  public final SrvDatabase lazyGetSrvDatabase() throws Exception {
    String beanName = getSrvDatabaseName();
    SrvDatabase srvDatabase = (SrvDatabase) getBeansMap().get(beanName);
    if (srvDatabase == null) {
      srvDatabase = new SrvDatabase();
      SQLiteDatabase db = context.openOrCreateDatabase(getDatabaseName(),
       Context.MODE_PRIVATE, lazyGetCursorFactory());
      srvDatabase.setSqliteDatabase(db);
      srvDatabase.setLogger(lazyGetLogger());
      getBeansMap().put(beanName, srvDatabase);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return srvDatabase;
  }

  /**
   * <p>Get MngDatabaseAndroid in lazy mode.</p>
   * @return MngDatabaseAndroid - MngDatabaseAndroid
   * @throws Exception - an exception
   */
  public final MngDatabaseAndroid
    lazyGetMngDatabaseAndroid() throws Exception {
    String beanName = getMngDatabaseAndroidName();
    MngDatabaseAndroid mngDatabaseAndroid =
      (MngDatabaseAndroid) getBeansMap().get(beanName);
    if (mngDatabaseAndroid == null) {
      mngDatabaseAndroid = new MngDatabaseAndroid();
      mngDatabaseAndroid.setFactoryAppBeansAndroid(this);
      ContextWrapper cw = new ContextWrapper(context);
      mngDatabaseAndroid.setDatabaseDir(cw.getFilesDir()
        .getAbsolutePath().replace("files", "databases"));
      File bkDir = new File(Environment.getExternalStorageDirectory()
        .getAbsolutePath() + "/" + "BeigeAccountingBackup");
      if (!bkDir.exists() && !bkDir.mkdirs()) {
        throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
          "Can't create dir: " + bkDir);
      }
      mngDatabaseAndroid.setBackupDir(bkDir.getAbsolutePath());
      getBeansMap().put(beanName, mngDatabaseAndroid);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return mngDatabaseAndroid;
  }

  /**
   * <p>Getter of MngDatabaseAndroid service name.</p>
   * @return service name
   **/
  public final String getMngDatabaseAndroidName() {
    return "mngDatabaseAndroid";
  }

  /**
   * <p>Get lazy for cursorFactory.</p>
   * @return CursorFactory
   * @throws Exception - an exception
   **/
  public final CursorFactory
    lazyGetCursorFactory() throws Exception {
    String beanName = getCursorFactoryName();
    CursorFactory cursorFactory = (CursorFactory) getBeansMap().get(beanName);
    if (cursorFactory == null) {
      cursorFactory = new CursorFactory();
      getBeansMap().put(beanName, cursorFactory);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return cursorFactory;
  }

  /**
   * <p>Getter of Cursor Factory name.</p>
   * @return service name
   **/
  public final String getCursorFactoryName() {
    return "CursorFactory";
  }

  /**
   * <p>Geter for context.</p>
   * @return Context
   **/
  public final Context getContext() {
    return this.context;
  }

  /**
   * <p>Setter for context.</p>
   * @param pContext reference
   **/
  public final void setContext(final Context pContext) {
    this.context = pContext;
  }

  /**
   * <p>Get SrvDatabase if exist for database manager.</p>
   * @return SrvDatabase - SrvDatabase
   */
  public final SrvDatabase getSrvDatabase() {
    String beanName = getSrvDatabaseName();
    SrvDatabase srvDatabase = (SrvDatabase) getBeansMap().get(beanName);
    return srvDatabase;
  }
}
