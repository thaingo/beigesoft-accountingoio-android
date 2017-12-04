package org.beigesoft.accounting.android;

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
import java.io.OutputStream;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.util.Map;
import java.lang.reflect.Method;

import android.content.ContextWrapper;
import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.content.res.AssetManager;
import android.os.Bundle;
import android.os.Build;
import android.os.AsyncTask;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;
import android.net.Uri;
import android.Manifest;
import android.util.Log;

import org.beigesoft.exception.ExceptionWithCode;
import org.beigesoft.ajetty.FactoryAppBeansEmbedded;
import org.beigesoft.ajetty.BootStrapEmbedded;

/**
 * <p>Beige Accounting Jetty activity.</p>
 *
 * @author Yury Demidenko
 */
public class BeigeAccounting extends Activity implements OnClickListener {

  /**
   * <p>APP BASE dir.</p>
   **/
  public static final String APP_BASE = "webapp";

  /**
   * <p>Permissions request.</p>
   **/
  public static final int PERMISSIONS_REQUESTS = 2415;

  /**
   * <p>Flag to refresh UI.</p>
   **/
  private boolean isNeedsToRefresh;

  /**
   * <p>Button start.</p>
   **/
  private Button btnStart;

  /**
   * <p>Button stop.</p>
   **/
  private Button btnStop;

  /**
   * <p>Button start browser.</p>
   **/
  private Button btnStartBrowser;

  /**
   * <p>Combo-Box Port.</p>
   **/
  private Spinner cmbPort;

  /**
   * <p>TextView Status.</p>
   **/
  private TextView tvStatus;

  /**
   * <p>Application beans map reference to lock.</p>
   **/
  private Map<String, Object> beansMap;

  /**
   * <p>A-Jetty application beans factory.</p>
   **/
  private final FactoryAppBeansEmbedded jettyFactoryAppBeans =
    new FactoryAppBeansEmbedded();

  /**
   * <p>Called when the activity is first created or recreated.</p>
   * @param pSavedInstanceState Saved Instance State
   */
  @Override
  public final void onCreate(final Bundle pSavedInstanceState) {
    super.onCreate(pSavedInstanceState);
    //Only way to publish this project in central Maven repository
    //cause missing Google dependencies:
    if (android.os.Build.VERSION.SDK_INT >= 23) {
      try {
        Class[] argTypes = new Class[] {String.class};
        Method checkSelfPermission = ContextWrapper.class
          .getDeclaredMethod("checkSelfPermission", argTypes);
        Object result = checkSelfPermission.invoke(getApplicationContext(),
          Manifest.permission.WRITE_EXTERNAL_STORAGE);
        Integer chSlfPer = (Integer) result;
        if (chSlfPer != PackageManager.PERMISSION_GRANTED) {
          argTypes = new Class[] {String[].class, Integer.TYPE};
          Method requestPermissions = Activity.class
            .getDeclaredMethod("requestPermissions", argTypes);
          String[] args = new String[]
            {Manifest.permission.READ_EXTERNAL_STORAGE,
              Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.INTERNET};
          requestPermissions.invoke(this, (Object) args,
            PERMISSIONS_REQUESTS);
        }
      } catch (Exception x) {
          x.printStackTrace();
      }
    }
    ApplicationPlus appPlus = (ApplicationPlus) getApplicationContext();
    this.beansMap = appPlus.getBeansMap();
    setContentView(R.layout.beigeaccounting);
    this.tvStatus = (TextView) findViewById(R.id.tvStatus);
    this.cmbPort = (Spinner) findViewById(R.id.cmbPort);
    ArrayAdapter<Integer> cmbAdapter =
      new ArrayAdapter<Integer>(this, android.R.layout.simple_spinner_item);
    cmbAdapter.add(new Integer(8080));
    cmbAdapter.add(new Integer(8081));
    cmbAdapter.add(new Integer(8082));
    cmbAdapter.add(new Integer(8083));
    cmbPort.setAdapter(cmbAdapter);
    cmbPort.setSelection(0);
    this.btnStart = (Button) findViewById(R.id.btnStart);
    this.btnStartBrowser = (Button) findViewById(R.id.btnStartBrowser);
    this.btnStartBrowser.setOnClickListener(this);
    this.btnStop = (Button) findViewById(R.id.btnStop);
    this.btnStart.setOnClickListener(this);
    this.btnStop.setOnClickListener(this);
    try {
      File jettyBase = new File(getFilesDir().getAbsolutePath()
       + "/" + APP_BASE);
      PackageInfo packageInfo = getPackageManager()
        .getPackageInfo(getPackageName(), 0);
      String nameFileVersion = "version" + packageInfo.versionCode;
      File fileVersion = new File(getFilesDir().getAbsolutePath()
       + "/" + APP_BASE + "/" + nameFileVersion);
      if (!jettyBase.exists()) { //new install
        if (!jettyBase.mkdirs()) {
          throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
            "Can't create dir " + jettyBase);
        }
        copyAssets(APP_BASE);
        Toast.makeText(getApplicationContext(),
          "Beige Accounting directory has been  successfully created"
            + " and WEB static files has been copied!",
            Toast.LENGTH_SHORT).show();
        if (!fileVersion.createNewFile()) {
          throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
            "Cant't create file " + fileVersion);
        }
      } else if (!fileVersion.exists()) { // upgrade
        copyAssets(APP_BASE); // refresh from upgrade package
        if (!fileVersion.createNewFile()) {
          throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
            "Cant't create file " + fileVersion);
        }
        Toast.makeText(getApplicationContext(),
          "New version of WEB static files has been copied!",
            Toast.LENGTH_SHORT).show();
      }
    } catch (ExceptionWithCode e) {
      Toast.makeText(getApplicationContext(),
        e.getShortMessage(),
          Toast.LENGTH_SHORT).show();
    } catch (Exception e) {
      e.printStackTrace();
      Toast.makeText(getApplicationContext(),
        "There was errors!",
          Toast.LENGTH_SHORT).show();
    }
  }

  /**
   * <p>onClick handler.</p>
   * @param pTarget button
   */
  @Override
  public final void onClick(final View pTarget) {
    if (pTarget == this.btnStart) {
      BootStrapEmbedded bootStrap = getOrInitBootStrap();
      if (!bootStrap.getIsStarted()) {
        bootStrap.setPort((Integer) cmbPort.getSelectedItem());
        this.btnStart.setEnabled(false);
        this.cmbPort.setEnabled(false);
        Toast.makeText(getApplicationContext(),
          "Sending request to start server, please wait", Toast.LENGTH_SHORT)
            .show();
        Intent intent = new Intent(this, JettyAccountingService.class);
        intent.setAction(JettyAccountingService.ACTION_START);
        startService(intent);
      }
    } else if (pTarget == this.btnStop) {
      BootStrapEmbedded bootStrap = getOrInitBootStrap();
      if (bootStrap.getIsStarted()) {
        this.btnStop.setEnabled(false);
        this.btnStartBrowser.setEnabled(false);
        Intent intent = new Intent(this, JettyAccountingService.class);
        intent.setAction(JettyAccountingService.ACTION_STOP);
        startService(intent);
      }
    } else if (pTarget == this.btnStartBrowser) {
      startBrowser();
    }
  }

  /**
   * <p>onResume handler.</p>
   */
  @Override
  public final void onResume() {
    isNeedsToRefresh = true;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
      new Refresher().executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR,
        (Void[]) null);
    } else {
      new Refresher().execute((Void[]) null);
    }
    super.onResume();
  }

  /**
   * <p>onPause handler.</p>
   */
  @Override
  public final void onPause() {
    this.isNeedsToRefresh = false;
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    super.onPause();
  }

  /**
   * <p>Start browser.</p>
   */
  private void startBrowser() {
    String url = this.btnStartBrowser.getText().toString();
    Intent i = new Intent(Intent.ACTION_VIEW);
    i.setData(Uri.parse(url));
    startActivity(i);
  }

  /**
   * <p>Refresh view.</p>
   */
  private void refreshView() {
    synchronized (this.beansMap) {
      BootStrapEmbedded bootStrap = getOrInitBootStrap();
      if (bootStrap.getIsStarted()) {
        this.cmbPort.setEnabled(false);
        this.btnStart.setEnabled(false);
        this.btnStop.setEnabled(true);
        this.tvStatus.setText(getResources().getString(R.string.started));
        this.btnStartBrowser.setEnabled(true);
        String text = "http://localhost:"
          + String.valueOf(bootStrap.getPort());
        this.btnStartBrowser.setText(text);
      } else {
        this.btnStart.setEnabled(true);
        this.cmbPort.setEnabled(true);
        this.btnStop.setEnabled(false);
        this.tvStatus.setText(getResources().getString(R.string.stopped));
        this.btnStartBrowser.setEnabled(false);
        this.btnStartBrowser.setText("");
      }
    }
  }

  /**
   * <p>Get Or Initialize BootStrapEmbedded.</p>
   * @return BootStrapEmbedded BootStrapEmbedded
   */
  private BootStrapEmbedded getOrInitBootStrap() {
    BootStrapEmbedded bootStrap = null;
    Object bootStrapO = this.beansMap
      .get(BootStrapEmbedded.class.getCanonicalName());
    if (bootStrapO != null) {
      bootStrap = (BootStrapEmbedded) bootStrapO;
    } else { // initialize:
      synchronized (this.beansMap) {
        bootStrapO = this.beansMap
          .get(BootStrapEmbedded.class.getCanonicalName());
        if (bootStrapO == null) {
          bootStrap = new BootStrapEmbedded();
          bootStrap.setWebAppPath(getFilesDir().getAbsolutePath()
            + "/" + APP_BASE);
          try {
            bootStrap.setFactoryAppBeans(jettyFactoryAppBeans);
            // SERVER WILL BE CREATED BY START THREAD IN JettyAccountingService
          } catch (Exception e) {
            e.printStackTrace();
          }
          this.beansMap
            .put(BootStrapEmbedded.class.getCanonicalName(), bootStrap);
          // it will be removed from beans-map by STOP thread
          // in JettyAccountingService
        }
      }
    }
    return bootStrap;
  }

  /**
   * <p>Recursively copy assets.</p>
   * @param pCurrDir current directory assets
   * @throws Exception an Exception
   */
  private void copyAssets(final String pCurrDir) throws Exception {
    AssetManager assetManager = getAssets();
    String[] files = assetManager.list(pCurrDir);
    for (String fileName : files) {
      String createdPath = getFilesDir().getAbsolutePath()
        + "/" + pCurrDir + "/" + fileName;
      if (!fileName.contains(".")) {
        File subdir = new File(createdPath);
        if (!subdir.exists()) {
          if (!subdir.mkdirs()) {
            throw new ExceptionWithCode(ExceptionWithCode.SOMETHING_WRONG,
              "Cant't create dir " + subdir);
          } else {
            Log.i(BeigeAccounting.class.getSimpleName(),
              "Created : " + subdir);
          }
        }
        copyAssets(pCurrDir + "/" + fileName);
      } else {
        InputStream ins = null;
        OutputStream outs = null;
        try {
          ins = getAssets().open(pCurrDir + "/" + fileName);
          outs = new BufferedOutputStream(
            new FileOutputStream(createdPath));
          byte[] data = new byte[1024];
          int count;
          while ((count = ins.read(data)) != -1) {
            outs.write(data, 0, count);
          }
          outs.flush();
          Log.i(BeigeAccounting.class.getSimpleName(),
            "Copied: " + pCurrDir + "/" + fileName);
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
    }
  }

  /**
   * <p>Refresher thread.</p>
   */
  private class Refresher extends AsyncTask<Void, Void, Void> {

    /**
     * <p>doInBackground check is need refresh.</p>
     */
    @Override
    protected final Void doInBackground(final Void... params) {
      while (BeigeAccounting.this.isNeedsToRefresh) {
        publishProgress((Void[]) null);
        try {
          Thread.sleep(2000);
        } catch (InterruptedException e) {
          e.printStackTrace();
        }
      }
      return null;
    }

    /**
     * <p>onProgressUpdate call refresh.</p>
     */
    @Override
    protected final void onProgressUpdate(final Void... values) {
      BeigeAccounting.this.refreshView();
      super.onProgressUpdate(values);
    }
  }
}
