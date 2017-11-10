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
import java.io.InputStream;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.web.service.IMngDatabaseExt;

/**
 * <p>Database manager for Android.
 * It can create and change current database (file),
 * backup DB to global storage and restore from it,
 * also can delete database.</p>
 *
 * @author Yury Demidenko
 */
public class MngDatabaseAndroid implements IMngDatabaseExt {

  /**
   * <p>Databases folder.</p>
   **/
  private String databaseDir;

  /**
   * <p>Backup databases folder.</p>
   **/
  private String backupDir;

  /**
   * <p>Database service.</p>
   **/
  private FactoryAppBeansAndroid factoryAppBeansAndroid;

  /**
   * <p>
   * List databases.
   * </p>
   * @return List<String> list of database files.
   * @throws Exception - an exception
   **/
  @Override
  public final List<String> retrieveList() throws Exception {
    List<String> result = new ArrayList<String>();
    File dbDir = new File(this.databaseDir);
    if (dbDir.exists() && dbDir.isDirectory()) {
      String[] files = dbDir.list();
      if (files != null) {
        for (String flNm : files) {
          if (flNm.endsWith(".sqlite")) {
            result.add(flNm.replace(".sqlite", ""));
          }
        }
      }
    } else {
      throw new ExceptionWithCode(ExceptionWithCode.CONFIGURATION_MISTAKE,
        "DB directory not found: " + this.databaseDir);
    }
    return result;
  }

  /**
   * <p>
   * List backup databases.
   * </p>
   * @return List<String> list of backup database files.
   * @throws Exception - an exception
   **/
  @Override
  public final List<String> retrieveBackupList() throws Exception {
    List<String> result = new ArrayList<String>();
    File dbDir = new File(this.backupDir);
    if (dbDir.exists() && dbDir.isDirectory()) {
      String[] files = dbDir.list();
      if (files != null) {
        for (String flNm : files) {
          if (flNm.endsWith(".sqlite")) {
            result.add(flNm.replace(".sqlite", ""));
          }
        }
      }
    } else {
      throw new ExceptionWithCode(ExceptionWithCode.CONFIGURATION_MISTAKE,
        "DB directory not found: " + this.backupDir);
    }
    return result;
  }

  /**
   * <p>
   * Retrieve current DB name.
   * </p>
   * @return String DB name.
   * @throws Exception - an exception
   **/
  @Override
  public final String retrieveCurrentDbName() throws Exception {
    return this.factoryAppBeansAndroid.getDatabaseName();
  }

  /**
   * <p>Create new database.</p>
   * @param pDbName database name without extension
   * @param pDbId database ID
   * @throws Exception - an exception
   **/
  @Override
  public final void createDatabase(final String pDbName,
    final int pDbId) throws Exception {
    String dbNm = pDbName + ".sqlite";
    synchronized (this.factoryAppBeansAndroid) {
      if (!this.factoryAppBeansAndroid.getDatabaseName().equals(dbNm)) {
        this.factoryAppBeansAndroid.setDatabaseName(dbNm);
        this.factoryAppBeansAndroid.setNewDatabaseId(pDbId);
        this.factoryAppBeansAndroid.handleDatabaseChanged();
      }
    }
  }

  /**
   * <p>Change database.</p>
   * @param pDbName database name without extension
   * @throws Exception - an exception
   **/
  @Override
  public final void changeDatabase(final String pDbName) throws Exception {
    String dbNm = pDbName + ".sqlite";
    synchronized (this.factoryAppBeansAndroid) {
      if (!this.factoryAppBeansAndroid.getDatabaseName().equals(dbNm)) {
        this.factoryAppBeansAndroid.setDatabaseName(dbNm);
        this.factoryAppBeansAndroid.handleDatabaseChanged();
      }
    }
  }

  /**
   * <p>Delete database.</p>
   * @param pDbName database name without extension
   * @throws Exception - an exception
   **/
  @Override
  public final void deleteDatabase(final String pDbName) throws Exception {
    String dbNm = pDbName + ".sqlite";
    synchronized (this.factoryAppBeansAndroid) {
      if (dbNm.equals(this.factoryAppBeansAndroid.getDatabaseName())
        && this.factoryAppBeansAndroid.getSrvDatabase() != null) {
        this.factoryAppBeansAndroid.getSrvDatabase()
          .getSqliteDatabase().close();
        this.factoryAppBeansAndroid.getSrvDatabase()
          .setSqliteDatabase(null);
      }
    }
    File dbFile = new File(this.databaseDir + "/" + dbNm);
    if (dbFile.exists() && !dbFile.delete()) {
      throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
        "Can't delete file: " + dbFile);
    }
  }

  /**
   * <p>Backup database.</p>
   * @param pDbName database name without extension
   * @throws Exception - an exception
   **/
  @Override
  public final void backupDatabase(final String pDbName) throws Exception {
    String dbNm = pDbName + ".sqlite";
    File dbFile = new File(this.databaseDir + "/" + dbNm);
    if (dbFile.exists()) {
      File dbBkFile = new File(this.backupDir + "/" + dbNm);
      if (dbBkFile.exists()) {
        Long time = new Date().getTime();
        dbBkFile = new File(this.backupDir + "/" + pDbName
          + time + ".sqlite");
      }
      copyFile(dbFile, dbBkFile);
    }
  }

  /**
   * <p>Restore database from backup and set it current.</p>
   * @param pDbName database name without extension
   * @throws Exception - an exception
   **/
  @Override
  public final void restoreDatabase(final String pDbName) throws Exception {
    String dbNm = pDbName + ".sqlite";
    File dbBkFile = new File(this.backupDir + "/" + dbNm);
    if (dbBkFile.exists()) {
      File dbFile = new File(this.databaseDir + "/" + dbNm);
      if (dbFile.exists()) {
        Long time = new Date().getTime();
        dbFile = new File(this.databaseDir + "/" + pDbName
          + time + ".sqlite");
      }
      copyFile(dbBkFile, dbFile);
    }
    changeDatabase(pDbName);
  }

  /**
   * <p>Getter for backupDir.</p>
   * @return String
   **/
  @Override
  public final String getBackupDir() {
    return this.backupDir;
  }

  /**
   * <p>Setter for backupDir.</p>
   * @param pBackupDir reference
   **/
  @Override
  public final void setBackupDir(final String pBackupDir) {
    this.backupDir = pBackupDir;
  }

  /**
   * <p>Copy file.</p>
   * @param pFileSrc File source
   * @param pFileDst File destination
   * @throws Exception an Exception
   */
  public final void copyFile(final File pFileSrc,
    final File pFileDst) throws Exception {
    InputStream ins = null;
    OutputStream outs = null;
    try {
      ins = new FileInputStream(pFileSrc);
      outs = new BufferedOutputStream(
        new FileOutputStream(pFileDst));
      byte[] data = new byte[1024];
      int count;
      while ((count = ins.read(data)) != -1) {
        outs.write(data, 0, count);
      }
      outs.flush();
    } finally {
      if (ins != null) {
        try {
          ins.close();
        } catch (Exception e2) {
          e2.printStackTrace();
        }
      }
      if (outs != null) {
        try {
          outs.close();
        } catch (Exception e3) {
          e3.printStackTrace();
        }
      }
    }
  }

  //Simple getters and setters:
  /**
   * <p>Getter for databaseDir.</p>
   * @return String
   **/
  public final String getDatabaseDir() {
    return this.databaseDir;
  }

  /**
   * <p>Setter for databaseDir.</p>
   * @param pDatabaseDir reference
   **/
  public final void setDatabaseDir(final String pDatabaseDir) {
    this.databaseDir = pDatabaseDir;
  }

  /**
   * <p>Getter for factoryAppBeansAndroid.</p>
   * @return FactoryAppBeansAndroid
   **/
  public final FactoryAppBeansAndroid getFactoryAppBeansAndroid() {
    return this.factoryAppBeansAndroid;
  }

  /**
   * <p>Setter for factoryAppBeansAndroid.</p>
   * @param pFactoryAppBeansAndroid reference
   **/
  public final void setFactoryAppBeansAndroid(
    final FactoryAppBeansAndroid pFactoryAppBeansAndroid) {
    this.factoryAppBeansAndroid = pFactoryAppBeansAndroid;
  }
}
