This is Android version of Beige-Accounting based on embedded A-Jetty.
It requires Google Chrome browser.

Features:
* Double entries accounting system include ledger and balance reports.
* COGS FIFO/LIFO perpetual automatically for sales, sales returns, inventory loses.
* Automatically sales taxes accounting entries (a goods may has several sales taxes) for sales, purchase invoice and their returns.
* Prepayments/payments tracking for sales/purchases.
* Payroll - automatically taxes calculation (by percentage tax table method) and accounting entries. 
* Manufacturing - automatically cost calculation from used materials and direct labor (and other) costs.
* Multi-databases (organizations) support.
* and more
* There is BeigeAccounting version for MS Windows/Mac/*Nix and SQLite database, so you can work with the same database anywhere.

license:

GNU General Public License version 2 - http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html

3-D PARTY LICENSES:

Oracle JEE:
CDDL + GPLv2 with classpath exception
https://javaee.github.io/glassfish/LICENSE

part of Apache Tomcat/JSTL by Apache Software Foundation, adapted for Android to precompile and run JSP/JSTL:
The Apache Software License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0.txt

part of Jetty 9.2 by Mort Bay Consulting Pty. Ltd (adapted for Android):
The Eclipse Public License, Version 1.0
http://www.eclipse.org/legal/epl-v10.html

JavaMail API (compat) 1.4 plus JavaBeans(TM) Activation Framework:
Common Development and Distribution License (CDDL) v1.0
https://glassfish.dev.java.net/public/CDDLv1.0.html

SLF4J by QOS.ch:
MIT License
http://www.opensource.org/licenses/mit-license.php

CSS/Javascript framework Bootstrap by Twitter, Inc:
MIT License
https://github.com/twbs/bootstrap/blob/master/LICENSE

JQuery by JS Foundation and other contributors:
MIT license
https://jquery.org/license

DejaVu fonts by Bitstream:
https://dejavu-fonts.github.io/License.html 

site: http://www.beigesoft.org
or https://sites.google.com/site/beigesoftware

Working with source:
Android SDK for Fedora 64bit requires libraries (for AVD):
dnf install glibc.i686 glibc-devel.i686 libstdc++.i686 zlib-devel.i686 ncurses-devel.i686 zlib.i686 ncurses-libs.i686 bzip2-libs.i686
it might help for AVD rendering:
dnf install  libX11-devel.i686 libXrender.i686 libXrandr.i686
New Android SDK emulator can't emulates localhost (127.0.0.1), it starts well but browser "is frozen forever for that address",
old SDK24.4.1 does it with no problems and it's also more fast and stable than new emulator. Chrome doesn't crashed on it (on 24.4.1).
Emulation means that a application can works on emulator same as on real device, i.e. emulator must emulates everything.
------------------
emulator 24.4.1:
generic_x86:/ # netstat -lp                                                                                                                                            
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program Name
tcp        0      0 localhost:5037          0.0.0.0:*               LISTEN      4281/adbd
tcp        0      0 :::5555                 :::*                    LISTEN      4281/adbd
tcp        0      0 localhost:8083          :::*                    LISTEN      4036/org.beigesoft.a
udp        0      0 :::57458                :::*                                -
udp        0      0 :::55947                :::*                                -
generic_x86:/ # netstat -r                                                                                                                                             
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
10.0.2.0        *               255.255.255.0   U         0 0          0 eth0
generic_x86:/ # netstat -e                                                                                                                                             
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       User       Inode      
tcp        1      0 localhost:42133         localhost:8083          CLOSE_WAIT  u0_a37     31075       
tcp        1      0 localhost:42135         localhost:8083          CLOSE_WAIT  u0_a37     31081       
tcp        1      0 localhost:42134         localhost:8083          CLOSE_WAIT  u0_a37     31078       
tcp        1      0 localhost:42127         localhost:8083          CLOSE_WAIT  u0_a37     30687       
tcp        1      0 ::ffff:10.0.2.15:36499  lm-in-f95.1e100.net:htt CLOSE_WAIT  u0_a14     24344       
tcp        1      0 ::ffff:10.0.2.15:60252  it-in-f188.1e100.net:52 CLOSE_WAIT  u0_a14     13163       
tcp        1      0 ::ffff:10.0.2.15:42996  lj-in-f95.1e100.net:htt CLOSE_WAIT  u0_a14     24756       
tcp        1      0 ::ffff:10.0.2.15:60355  og-in-f188.1e100.net:52 CLOSE_WAIT  u0_a14     15896       
tcp        0      0 localhost:8083          localhost:42134         FIN_WAIT2   u0_a80     31086       
tcp        1      0 ::ffff:10.0.2.15:53181  le-in-f138.1e100.net:ht CLOSE_WAIT  u0_a14     31211       
tcp     1112      0 ::ffff:10.0.2.15:60339  lr-in-f100.1e100.net:ht CLOSE_WAIT  u0_a14     19211       
tcp        1      0 ::ffff:10.0.2.15:60358  lr-in-f100.1e100.net:ht CLOSE_WAIT  u0_a14     26691       
tcp        0      0 localhost:8083          localhost:42133         FIN_WAIT2   u0_a80     30821       
tcp        0      0 ::ffff:10.0.2.15:57977  lr-in-f188.1e100.net:52 ESTABLISHED u0_a14     15872       
tcp        1      0 ::ffff:10.0.2.15:60354  lr-in-f100.1e100.net:ht CLOSE_WAIT  u0_a14     23196       
tcp        1      0 ::ffff:10.0.2.15:36501  lm-in-f95.1e100.net:htt CLOSE_WAIT  u0_a14     24873       
tcp        1      0 ::ffff:10.0.2.15:49527  lf-in-f102.1e100.net:ht CLOSE_WAIT  u0_a14     28897       
tcp        1      0 ::ffff:10.0.2.15:42993  lj-in-f95.1e100.net:htt CLOSE_WAIT  u0_a14     22125       
tcp        1      0 ::ffff:10.0.2.15:57968  lr-in-f188.1e100.net:52 CLOSE_WAIT  u0_a14     13122       
tcp        0      0 ::ffff:10.0.2.15:57990  lr-in-f188.1e100.net:52 ESTABLISHED u0_a14     20436       
tcp        0      0 ::ffff:10.0.2.15:5555   ::ffff:10.0.2.2:36601   ESTABLISHED root       28987       
tcp        0      0 localhost:8083          localhost:42135         FIN_WAIT2   u0_a80     31089       
-------------------
new emulator 26.1.4:
generic_x86:/ # netstat -lp                                                                                                                                            
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program Name
tcp        0      0 localhost:5037          0.0.0.0:*               LISTEN      3445/adbd
tcp        0      0 localhost:8083          :::*                    LISTEN      2494/org.beigesoft.a
tcp        0      0 localhost:49935         :::*                    LISTEN      3002/com.google.andr
udp        0      0 :::mdns                 :::*                                2279/com.google.andr
udp        0      0 :::mdns                 :::*                                -
generic_x86:/ # netstat -r                                                                                                                                             
Kernel IP routing table
Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
10.0.2.0        *               255.255.255.0   U         0 0          0 eth0
generic_x86:/ # netstat -e                                                                                                                                             
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       User       Inode      
tcp        1      0 localhost:52591         localhost:8083          CLOSE_WAIT  u0_a32     19875       
tcp        0      0 localhost:8083          localhost:52591         FIN_WAIT2   u0_a80     16680       
tcp        0      0 ::ffff:10.0.2.15:35580  lf-in-f95.1e100.net:htt ESTABLISHED u0_a14     13626       
tcp        0      0 ::ffff:10.0.2.15:57485  lm-in-f100.1e100.net:ht ESTABLISHED u0_a14     16245       
tcp        0      0 ::ffff:10.0.2.15:40123  lm-in-f188.1e100.net:52 ESTABLISHED u0_a14     13961       
tcp        1      0 ::ffff:10.0.2.15:46912  ams17s01-in-f3.1e100.ne CLOSE_WAIT  u0_a72     15777       
tcp        1      0 ::ffff:10.0.2.15:39770  lt-in-f95.1e100.net:htt CLOSE_WAIT  u0_a14     19515       
---------------------
