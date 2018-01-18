package org.beigesoft.accountingoio.android;

/*
 * Copyright (c) 2018 Beigesoft ™
 *
 * Licensed under the GNU General Public License (GPL), Version 2.0
 * (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 */

import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;

import org.beigesoft.factory.IFactoryAppBeans;

/**
 * <p>Invoke factory release beans.</p>
 *
 * @author Yury Demidenko
 */
public class WebContextCleaner implements ServletContextListener {

  @Override
  public final void contextDestroyed(final ServletContextEvent sce) {
    try {
      IFactoryAppBeans factoryAppBeans = (IFactoryAppBeans) sce
        .getServletContext().getAttribute("IFactoryAppBeans");
      if (factoryAppBeans != null) {
        factoryAppBeans.releaseBeans();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Override
  public final void contextInitialized(final ServletContextEvent sce) {
    //nothing
  }
}
