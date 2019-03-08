This is Android version of Beige-Accounting based on embedded A-Jetty.
It requires Google Chrome browser.

Beige-Accounting is always in secure enabled mode (protected from scams). It requires user authentication with strong password. It uses encryption for HTTPS and file exchange - modern algorithms asymmetric RSA 2048bit key size and symmetric AES 256bit size.
-------------------------------------------------------------------------------------------------------------
At first you should better read article <a href="https://sites.google.com/site/beigesoftware/bobs-pizza/acc-android">Beigesoft™ Accounting on Android:</a> https://sites.google.com/site/beigesoftware/bobs-pizza/acc-android

This application never waste your time because of:
  1. It provides sufficient functionality:  
* Double entry accounting system including ledger and balance reports.
* COGS FIFO/LIFO automatically for sales, sales returns, inventory losses.
* Automatically sales taxes accounting entries for sales, purchases and their returns.
* Sales tax methods: item/invoice basis, destination-based, aggregate rate, price inclusive of tax.
* Prepayments/payments tracking for sales/purchases (including invoices with foreign currency).
* Payroll - automatically taxes calculation (by percentage tax table method) and accounting entries.
* Manufacturing - automatically cost calculation from used materials and direct labor (and other) costs.
* Multi-databases (organizations).
* Embed Web-Store
* There is Beigesoft™ Accounting version for MS Windows/Mac/*Nix and SQLite database, so you can work with the same database anywhere.

You can check functionality without installation by reading the articles (see above).
  
  2. It's reliable software:
* All its parts are under truly free licenses.
* It's open source software, so fixing an error or customizing is not a problem.
* It will never be downgraded or disappeared. You always can find it (binary and source code) in Central Maven Repository.

Web-Store is included for pricing, study, and tests purposes and you are also able to make full DB copy from cloud version.
You can make price lists (in different price categories) and export it in CSV file to your customers or POS.

This is enterprise application, database consist of 200 tables, so it requires a time to initialize itself and to create and upgrade database.

licenses:

GNU General Public License version 2 - http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

The Eclipse Public License, Version 1.0 - http://www.eclipse.org/legal/epl-v10.html

The Apache Software License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0.txt

CDDL + GPLv2 with classpath exception - https://javaee.github.io/glassfish/LICENSE

MIT License - https://github.com/twbs/bootstrap/blob/master/LICENSE

DejaVu fonts by Bitstream - https://dejavu-fonts.github.io/License.html

SIL OPEN FONT LICENSE Version 1.1 - http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web

--------------------------------------------------------------------------------------------------------------
Вам лучше прочесть для начала <a href="https://sites.google.com/site/beigesoftware/acc-iv">Пример использования Беижсофт Бухгалтерии:</a> https://sites.google.com/site/beigesoftware/acc-iv

Преимущества Беижсофт Бухгалтерии:

  Первое это функциональность:
*Оценить функциональность можно без установки, просто читая документацию данную выше.
*Это готовое решение для ведения коммерческого учета методом двойной записи по рыночным правилам.
*НДС методы: по отгрузке/оплате.
*Автоматическое вычисление себестоимости методами ФИФО/ЛИФО и по стоимости единицы.
*Веб-магазин включен в локальные версии для изучения, тренировки и возможности копирования полной базы данных из Интернет-версии.
...

  Второе это надежность, работоспособность:
*Лицензии всех частей гарантируют отсутствие возможных проблем в будущем.
*Открытый код - возможность доработки, исправление ошибок.
*Дистрибутивы и исходный код находятся в центральном Мавен репозитории. Нет риска даунгрэйда, исчезновения.

База данных включает больше 200 таблиц, поэтому запуск потребует времени.

Лицензии:

GNU General Public License version 2 - http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

The Eclipse Public License, Version 1.0 - http://www.eclipse.org/legal/epl-v10.html

The Apache Software License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0.txt

CDDL + GPLv2 with classpath exception - https://javaee.github.io/glassfish/LICENSE

MIT License - https://github.com/twbs/bootstrap/blob/master/LICENSE

DejaVu fonts by Bitstream - https://dejavu-fonts.github.io/License.html

SIL OPEN FONT LICENSE Version 1.1 - http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web

--------------------------------------------------------------------------------------------------------------
Version 1.1.8:
*web-store first release
*sales taxes: allowed to edit them in any invoice
*new input number instead of auto-numeric.

Version 1.1.7:
*added multi-currency (including payments tracking).
*sales taxes:
  1. added invoice level switcher "omit taxes"
  2. added invoice basis method.
  3. added aggregate rate method.
  4. added "price inclusive of tax" method (it should be used along with aggregate rate method or only tax).
  5. purchases - user is allowed to change tax amount in line (item basis) or in total tax (invoice basis)
  6. purchases - vendor can has "tax destination" method that is actually overrides tax calculation method (rounding mode, invoice/item basis, aggregate/not rate)
  7. sales - added destination-based method for "other-region" customers, that "other region" has different sales taxes.
*added importing  bank statement from CSV file, semi-automatically bank reconciliation.
*added exporting price list into CSV file.
*PDF reports (sales invoice, balance sheet): User can change paper size, orientation, margins and font size in "Accounting Settings".
*it use entered by user invoice line's price, amount, total, prior to 1.1.7 total was always calculated from price and quantity.

The 1-st start application:
1. You should enter strong (see below) password to start Beige-Accounting. Press "Start" button, then wait while server has been started
2. A-Jetty CA certificate ajetty-ca.pem will be at the external storage. You have to install it
  as trusted Certificate Authority in the settings.
  Certificate Authorities that aren't signed by global trusted CA are often used to create private (non-public) intranets, using digital signatures inside organization and its partners.
  Here A-Jetty CA used to create HTTPS intranet inside only computer and for encrypted file exchange between your computers/tablets...
3. press button "https://localhost:8443/bsa8433" to start the browser.
4. Empty database requires to add the first (only) user with strong password.
  To make strong and ease to remember password use method similar to this:
  a. use at least 3 words, e.g. raccoon eat stone
  b. change these words with a rule e.g. "last letter to thirst position upper case" e.g. Nraccoo Tea Eston
  c. add several digits, e.g. result is "NraccooTeaEston165" or "165NraccooTeaEston" or "165NraccooTeaEston165"...

license:

GNU General Public License version 2 - http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

3-D PARTY LICENSES:

Oracle JEE:
CDDL + GPLv2 with classpath exception
https://javaee.github.io/glassfish/LICENSE

https://github.com/demidenko05/a-tomcat-all - part of Apache Tomcat/JSTL by Apache Software Foundation, adapted for Android to precompile and run JSP/JSTL:
The Apache Software License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0.txt

https://github.com/demidenko05/a-jetty-all - part of Jetty 9.2 by Mort Bay Consulting Pty. Ltd adapted for Android:
The Eclipse Public License, Version 1.0
http://www.eclipse.org/legal/epl-v10.html

https://github.com/demidenko05/a-javabeans8 - adapted OpenJDK8 javabeans for Android:
GNU General Public License, version 2, with the Classpath Exception
http://openjdk.java.net/legal/gplv2+ce.html

JavaMail API (compat) 1.4 plus JavaBeans(TM) Activation Framework:
Common Development and Distribution License (CDDL) v1.0
https://glassfish.dev.java.net/public/CDDLv1.0.html

Bouncy Castle Crypto APIs by the Legion of the Bouncy Castle Inc:
Bouncy Castle License (actually MIT)
http://www.bouncycastle.org/licence.html

CSS/Javascript framework Bootstrap by Twitter, Inc and the Bootstrap Authors:
MIT License
https://github.com/twbs/bootstrap/blob/master/LICENSE

JQuery by JS Foundation and other contributors:
MIT license
https://jquery.org/license

JS library Popper by Federico Zivolo and contributors:
MIT License
https://github.com/twbs/bootstrap/blob/master/LICENSE

Open Iconic icon fonts by Waybury:
SIL OPEN FONT LICENSE Version 1.1
http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web
Open Iconic to Bootstrap CSS by Waybury:
MIT License
https://github.com/twbs/bootstrap/blob/master/LICENSE

DejaVu fonts by Bitstream:
https://dejavu-fonts.github.io/License.html 

flag-icon-css collection of all country flags in SVG by Panayiotis Lipiridis
MIT License
https://github.com/lipis/flag-icon-css

site: https://sites.google.com/site/beigesoftware

Working with source:
building APK works fine on the latest 64bit Android SDK.
multidex requires build tools 28.0.2, works OK on SDK tools 26.1.1, platform - 28.0.0
outdated?64bit AVD works fine on the last emulator (27.1.12) and SDK platform API26,
Google APIs system Intel x86 Atom system image(API26).
outdated?On Debian fix emulator with:
ln -sf /usr/lib/x86_64-linux-gnu/libstdc++.so.6 ~/Android/Sdk/emulator/lib64/libstdc++/libstdc++.so.6

outdated?Google APIs system Intel x86 Atom system image(API27) rises SSL error:
java.lang.NullPointerException: ssl == null
	at com.android.org.conscrypt.NativeCrypto.SSL_get_shutdown(Native Method)


