package org.beigesoft.accountingoio.factory;

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

import java.io.File;

import android.os.Environment;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import org.beigesoft.log.ILogger;
import org.beigesoft.log.LoggerFile;
import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.replicator.service.PrepareDbAfterGetCopy;
import org.beigesoft.web.factory.AFactoryAppBeans;
import org.beigesoft.ajetty.crypto.CryptoHelper;
import org.beigesoft.ajetty.MngDatabaseSqliteEncrypted;
import org.beigesoft.orm.service.SrvOrmAndroid;

import org.beigesoft.android.sqlite.service.CursorFactory;
import org.beigesoft.android.sqlite.service.SrvDatabase;
import org.beigesoft.accounting.factory.FactoryAccDatabaseWriterXml;
import org.beigesoft.accounting.factory.FactoryAccReplicatorXmlHttps;
import org.beigesoft.accounting.factory.FactoryBldAccServices;
import org.beigesoft.accounting.factory.FactoryAccServices;

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
    if (getCursorFactoryName().equals(pBeanName)) {
      return lazyGetCursorFactory();
    } else if (getMngDatabaseName().equals(pBeanName)) {
      return lazyGetMngDatabaseSqliteEncrypted();
    } else if (getCryptoHelperName().equals(pBeanName)) {
      return lazyGetCryptoHelper();
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
   * <p>Get logger mode.</p>
   * @return ILogger Logger
   * @throws Exception - an exception
   */
  @Override
  public final ILogger lazyGetLogger() throws Exception {
    String beanName = getSecureLoggerName();
    LoggerFile logger = (LoggerFile) getBeansMap().get(beanName);
    if (logger == null) {
      logger = new LoggerFile();
      logger.setIsShowDebugMessages(getIsShowDebugMessages());
      logger.setFilePath(getWebAppPath() + "/beige-accounting");
      Log.i("A-Jetty", "> Log file path: " + logger.getFilePath());
      getBeansMap().put(beanName, logger);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return logger;
  }

  /**
   * <p>Get secure logger in lazy mode.</p>
   * @return secure logger
   * @throws Exception - an exception
   */
  @Override
  public final ILogger lazyGetSecureLogger() throws Exception {
    String beanName = getLoggerName();
    LoggerFile logger = (LoggerFile) getBeansMap().get(beanName);
    if (logger == null) {
      logger = new LoggerFile();
      logger.setIsCloseFileAfterRecord(true);
      logger.setIsShowDebugMessages(getIsShowDebugMessages());
      logger.setFilePath(getWebAppPath() + "/secure");
      Log.i("A-Jetty", "> Log file path: " + logger.getFilePath());
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
   * <p>Get CryptoHelper in lazy mode.</p>
   * @return CryptoHelper - CryptoHelper
   * @throws Exception - an exception
   */
  public final synchronized CryptoHelper
    lazyGetCryptoHelper() throws Exception {
    String beanName = getCryptoHelperName();
    CryptoHelper cryptoHelper =
      (CryptoHelper) getBeansMap().get(beanName);
    if (cryptoHelper == null) {
      cryptoHelper = new CryptoHelper();
      cryptoHelper.setKsDirPath(this.context.getFilesDir()
        .getAbsolutePath() + "/ks");
      File bkDir = new File(Environment.getExternalStorageDirectory()
        .getAbsolutePath() + "/BeigeAccountingBackup");
      if (!bkDir.exists() && !bkDir.mkdirs()) {
        throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
          "Can't create dir: " + bkDir);
      }
      File peDir = new File(bkDir + "/pub-exch");
      if (!peDir.exists() && !peDir.mkdir()) {
        throw new Exception("Can't create directory: " + peDir);
      }
      cryptoHelper.setPublicKeyDir(peDir.getAbsolutePath());
      getBeansMap().put(beanName, cryptoHelper);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return cryptoHelper;
  }

  /**
   * <p>Getter of Manager Database service name.</p>
   * @return service name
   **/
  public final String getCryptoHelperName() {
    return "ICryptoHelper";
  }

  /**
   * <p>Get MngDatabaseSqliteEncrypted in lazy mode.</p>
   * @return MngDatabaseSqliteEncrypted<Cursor> - MngDatabaseSqliteEncrypted
   * @throws Exception - an exception
   */
  public final synchronized MngDatabaseSqliteEncrypted<Cursor>
    lazyGetMngDatabaseSqliteEncrypted() throws Exception {
    String beanName = getMngDatabaseName();
    @SuppressWarnings("unchecked")
    MngDatabaseSqliteEncrypted<Cursor> mngDatabaseSqlite =
      (MngDatabaseSqliteEncrypted<Cursor>) getBeansMap().get(beanName);
    if (mngDatabaseSqlite == null) {
      mngDatabaseSqlite = new MngDatabaseSqliteEncrypted<Cursor>();
      mngDatabaseSqlite.setFactoryAppBeans(this);
      mngDatabaseSqlite.setCryptoHelper(lazyGetCryptoHelper());
      mngDatabaseSqlite.setLogDir(new File(getWebAppPath()));
      mngDatabaseSqlite.setDatabaseDir(this.context.getFilesDir()
        .getAbsolutePath().replace("files", "databases"));
      File bkDir = new File(Environment.getExternalStorageDirectory()
        .getAbsolutePath() + "/BeigeAccountingBackup");
      if (!bkDir.exists() && !bkDir.mkdirs()) {
        throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
          "Can't create dir: " + bkDir);
      }
      mngDatabaseSqlite.setBackupDir(bkDir.getPath());
      getBeansMap().put(beanName, mngDatabaseSqlite);
      lazyGetLogger().info(null, FactoryAppBeansAndroid.class, beanName
        + " has been created.");
    }
    return mngDatabaseSqlite;
  }

  /**
   * <p>Getter of Manager Database service name.</p>
   * @return service name
   **/
  public final String getMngDatabaseName() {
    return "IMngDatabaseExt";
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
