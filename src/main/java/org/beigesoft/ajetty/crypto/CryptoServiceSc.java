package org.beigesoft.ajetty.crypto;

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

import java.math.BigInteger;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.BufferedInputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.X509Certificate;
import java.security.SecureRandom;
import java.util.Date;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Locale;
import java.util.ResourceBundle;
import java.security.Security;
import javax.security.auth.x500.X500Principal;

import org.spongycastle.asn1.x500.X500Name;
import org.spongycastle.asn1.x509.GeneralName;
import org.spongycastle.asn1.x509.GeneralNames;
import org.spongycastle.asn1.x509.BasicConstraints;
import org.spongycastle.asn1.x509.Extension;
import org.spongycastle.asn1.x509.ExtendedKeyUsage;
import org.spongycastle.asn1.x509.KeyPurposeId;
import org.spongycastle.asn1.x509.KeyUsage;
import org.spongycastle.asn1.x509.SubjectKeyIdentifier;
import org.spongycastle.cert.X509v1CertificateBuilder;
import org.spongycastle.cert.X509v3CertificateBuilder;
import org.spongycastle.cert.jcajce.JcaX509CertificateConverter;
import org.spongycastle.cert.jcajce.JcaX509ExtensionUtils;
import org.spongycastle.cert.jcajce.JcaX509v1CertificateBuilder;
import org.spongycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.spongycastle.operator.ContentSigner;
import org.spongycastle.operator.jcajce.JcaContentSignerBuilder;
import org.spongycastle.pkcs.PKCS12PfxPdu;
import org.spongycastle.pkcs.PKCS12PfxPduBuilder;
import org.spongycastle.pkcs.PKCS12SafeBag;
import org.spongycastle.pkcs.PKCS12SafeBagBuilder;
import org.spongycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.spongycastle.pkcs.jcajce.JcaPKCS12SafeBagBuilder;
import org.spongycastle.pkcs.jcajce.JcePKCS12MacCalculatorBuilder;
import org.spongycastle.pkcs.jcajce.JcePKCSPBEOutputEncryptorBuilder;
import org.spongycastle.asn1.ASN1Encoding;
import org.spongycastle.asn1.DERBMPString;
import org.spongycastle.asn1.nist.NISTObjectIdentifiers;
import org.spongycastle.operator.OutputEncryptor;
import org.spongycastle.crypto.Digest;
import org.spongycastle.crypto.digests.SHA1Digest;
import org.spongycastle.jce.provider.BouncyCastleProvider;

/**
 * <p>It serves A-Jetty with encryption features.
 * It's based on Bounce Castle example.</p>
 */
public class CryptoServiceSc implements ICryptoService {

  /**
   * <p>I18N.</p>
   **/
  private ResourceBundle messages;

  /**
   * <p>Only constructor.</p>
   **/
  public CryptoServiceSc() {
    try {
      this.messages = ResourceBundle.getBundle("MessagesCrypto");
    } catch (Exception e) {
      try { // fix Android Java
        Locale locale = new Locale("en", "US");
        this.messages = ResourceBundle.getBundle("MessagesCrypto", locale);
      } catch (Exception e1) {
        e1.printStackTrace();
      }
    }
  }

  /**
   * <p>Check if password strong.
   * It implements logic:
   * At least 15 letters and digits!
   * 60% of them must be different!
   * At least 50% of them must be letters!
   * At least 3 of them must be digits!
   * No containing qwerty, 12345, admin, user etc!</p>
   * @param pPassword Password
   * @return NULL if strong, otherwise message.
   **/
  @Override
  public final String isPasswordStrong(final char[] pPassword) {
    if (pPassword == null || pPassword.length < 15) {
      return getMsg("Password15");
    }
    String passw = new String(pPassword).toLowerCase();
    if (passw.contains("qwert") || passw.contains("qwaszx")
      || passw.contains("qweasd") || passw.contains("qazwsx")
        || passw.contains("wsxedc") || passw.contains("wqsaxz")
          || passw.contains("ewqdsa") || passw.contains("zaqxsw")
            || passw.contains("xswzaq") || passw.contains("qscwdv")
              || passw.contains("csqvdw") || passw.contains("zaxqsc")
                || passw.contains("qscax") || passw.contains("csqxa")
                  || passw.contains("trewq") || passw.contains("asdfg")
                || passw.contains("zxcvb") || passw.contains("bvcxz")
              || passw.contains("gfdsa")) {
      return getMsg("noQwerty");
    } else if (passw.contains("raccooneatstone")
      || passw.contains("nraccooteaeston")) {
      return getMsg("noDemoPassw");
    } else if (passw.contains("2345") || passw.contains("admin")
      || passw.contains("user") || passw.contains("5432")
        || passw.contains("5678") || passw.contains("9876")
          || passw.contains("password")) {
      return getMsg("noAdmin12345");
    }
    HashSet<Character> chars = new HashSet<Character>();
    ArrayList<Character> digits = new ArrayList<Character>();
    ArrayList<Character> letters = new ArrayList<Character>();
    for (char ch : pPassword) {
      if (!Character.isLetterOrDigit(ch)) {
        return getMsg("letterOrDig");
      }
      if (Character.isDigit(ch)) {
        digits.add(ch);
      } else {
        letters.add(ch);
      }
      chars.add(ch);
    }
    double allLn = pPassword.length;
    double lettersLn = letters.size();
    double distinctLn = chars.size();
    if (lettersLn / allLn < 0.49999999999) {
      return getMsg("lettersAtLeast50pr");
    }
    if (distinctLn / allLn < 0.59999999999) {
      return getMsg("distinct60pr");
    }
    if (digits.size() < 3) {
      return getMsg("atLeast3digits");
    }
    return null;
  }

  /**
   * <p>Generates RSA pair for HTTPS and file exchange,
   * then makes certificates for them,
   * then creates Key Store and save them into it.
   * Keystore name is ajettykeystore.[pAjettyIn]
   * Validity period is 10 years since now.</p>
   * <p>It uses standard aliases prefixes:
   * <ul>
   * <li>AJettyRoot[pAjettyIn] - root certificate alias.
   *  But all self-signed CA is version 3, so it's omitted.</li>
   * <li>AJettyCA[pAjettyIn] - self -signed CA certificate alias V3.</li>
   * <li>AJettyHttps[pAjettyIn] - HTTPS certificate/private key alias</li>
   * <li>AJettyFileExch[pAjettyIn] - File exchanger certificate/private
   * key alias</li>
   * </ul>
   * </p>
   * @param pFilePath path, if null - use current
   * @param pAjettyIn A-Jetty instance number.
   * @param pPassw password
   * @throws Exception an Exception
   */
  @Override
  public final void createKeyStoreWithCredentials(final String pFilePath,
    final int pAjettyIn, final char[] pPassw) throws Exception {
    File pks12File;
    if (pFilePath == null) {
      pks12File = new File("ajettykeystore." + pAjettyIn);
    } else {
      pks12File = new File(pFilePath + File.separator
        + "ajettykeystore." + pAjettyIn);
    }
    if (pks12File.exists()) {
      throw new Exception("File already exist - " + pks12File.getPath());
    }
    // generate key pairs:
    KeyPairGenerator kpGenRsa = KeyPairGenerator.getInstance("RSA", "SC");
    kpGenRsa.initialize(2048, new SecureRandom());
    KeyPair kpHttps = kpGenRsa.generateKeyPair();
    kpGenRsa.initialize(2048, new SecureRandom());
    KeyPair kpFileExch = kpGenRsa.generateKeyPair();
    // generate certificates:
    Calendar cal = Calendar.getInstance();
    Date start = cal.getTime();
    cal.add(Calendar.YEAR, 10);
    Date end = cal.getTime();
      // CA:
    kpGenRsa.initialize(2048, new SecureRandom());
    KeyPair kpCa = kpGenRsa.generateKeyPair();
    String x500dn = "CN=A-Jetty" + pAjettyIn
      + " CA, OU=A-Jetty" + pAjettyIn + " CA, O=A-Jetty"
        + pAjettyIn + " CA, C=RU";
    X509Certificate caCert = buildCaCertSelfSign(kpCa, x500dn, start, end);
      // HTTPS:
    x500dn = "CN=localhost, OU=A-Jetty" + pAjettyIn + " HTTPS, O=A-Jetty"
        + pAjettyIn + " HTTPS, C=RU";
    X509Certificate httpsCert = buildLocalhostHttpsCert(kpHttps.getPublic(),
      kpCa.getPrivate(), caCert, 2, x500dn, start, end);
      // File exchanger:
    x500dn = "CN=A-Jetty" + pAjettyIn
      + " File Exchanger, OU=A-Jetty" + pAjettyIn + " File Exchanger, O=A-Jetty"
        + pAjettyIn + " File Exchanger, C=RU";
    X509Certificate fileExchCert = buildEndEntityCert(kpFileExch.getPublic(),
      kpCa.getPrivate(), caCert, 3, x500dn, start, end);
    // save to keystore:
    JcePKCSPBEOutputEncryptorBuilder jcePcEb =
      new JcePKCSPBEOutputEncryptorBuilder(NISTObjectIdentifiers.id_aes256_CBC);
    jcePcEb.setProvider("SC");
    OutputEncryptor encOut = jcePcEb.build(pPassw);
    PKCS12SafeBagBuilder caCrtBagBld = new JcaPKCS12SafeBagBuilder(caCert);
    caCrtBagBld.addBagAttribute(PKCS12SafeBag.friendlyNameAttribute,
      new DERBMPString("AJettyCa" + pAjettyIn));
    JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();
    PKCS12SafeBagBuilder httpsCrBgBr = new JcaPKCS12SafeBagBuilder(httpsCert);
    httpsCrBgBr.addBagAttribute(PKCS12SafeBag.friendlyNameAttribute,
      new DERBMPString("AJettyHttps" + pAjettyIn));
    SubjectKeyIdentifier skiHttps = extUtils
      .createSubjectKeyIdentifier(httpsCert.getPublicKey());
    httpsCrBgBr.addBagAttribute(PKCS12SafeBag.localKeyIdAttribute, skiHttps);
    PKCS12SafeBagBuilder httpsKbb =
      new JcaPKCS12SafeBagBuilder(kpHttps.getPrivate(), encOut);
    httpsKbb.addBagAttribute(PKCS12SafeBag.friendlyNameAttribute,
      new DERBMPString("AJettyHttps" + pAjettyIn));
    httpsKbb.addBagAttribute(PKCS12SafeBag.localKeyIdAttribute, skiHttps);
    PKCS12SafeBagBuilder fileExchCrBgBr =
      new JcaPKCS12SafeBagBuilder(fileExchCert);
    fileExchCrBgBr.addBagAttribute(PKCS12SafeBag.friendlyNameAttribute,
      new DERBMPString("AJettyFileExch" + pAjettyIn));
    SubjectKeyIdentifier skiFileExch = extUtils
      .createSubjectKeyIdentifier(fileExchCert.getPublicKey());
    fileExchCrBgBr
      .addBagAttribute(PKCS12SafeBag.localKeyIdAttribute, skiFileExch);
    PKCS12SafeBagBuilder fileExchKbb =
      new JcaPKCS12SafeBagBuilder(kpFileExch.getPrivate(), encOut);
    fileExchKbb.addBagAttribute(PKCS12SafeBag.friendlyNameAttribute,
      new DERBMPString("AJettyFileExch" + pAjettyIn));
    fileExchKbb.addBagAttribute(PKCS12SafeBag.localKeyIdAttribute, skiFileExch);
    PKCS12PfxPduBuilder builder = new PKCS12PfxPduBuilder();
    builder.addData(httpsKbb.build());
    builder.addData(fileExchKbb.build());
    builder.addEncryptedData(new JcePKCSPBEOutputEncryptorBuilder(
      PKCSObjectIdentifiers.pbeWithSHAAnd128BitRC2_CBC).setProvider("SC")
        .build(pPassw), new PKCS12SafeBag[] {httpsCrBgBr.build(),
          fileExchCrBgBr.build(), caCrtBagBld.build()});
    JcePKCS12MacCalculatorBuilder jmcb = new JcePKCS12MacCalculatorBuilder();
    jmcb.setProvider("SC");
    PKCS12PfxPdu pfx = builder.build(jmcb, pPassw);
    FileOutputStream pfxOut = null;
    try {
      pfxOut = new FileOutputStream(pks12File);
      // make sure we don't include indefinite length encoding
      pfxOut.write(pfx.getEncoded(ASN1Encoding.DL));
      pfxOut.flush();
    } finally {
      if (pfxOut != null) {
        pfxOut.close();
      }
    }
  }

  /**
   * <p>Calculate SHA1 for given file.</p>
   * @param pFile file
   * @return SHA1 bytes array
   * @throws Exception an Exception
   */
  @Override
  public final byte[] calculateSha1(final File pFile) throws Exception {
    BufferedInputStream bis = null;
    Digest sha1 = new SHA1Digest();
    try {
      bis = new BufferedInputStream(new FileInputStream(pFile));
      byte[] buffer = new byte[1024];
      while (bis.read(buffer) >= 0) {
        sha1.update(buffer, 0, buffer.length);
      }
    } finally {
      if (bis != null) {
        try {
          bis.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    byte[] digest = new byte[sha1.getDigestSize()];
    sha1.doFinal(digest, 0);
    return digest;
  }

  /**
   * <p>Initialize (cryptop-rovider).</p>
   * @throws Exception an Exception
   */
  @Override
  public final void init() throws Exception {
    if (Security.getProvider(getProviderName()) == null) {
      Security.addProvider(new BouncyCastleProvider());
    }
  }

  /**
   * <p>Get crypto-provider name.</p>
   * @return crypto-provider name
   **/
  @Override
  public final String getProviderName() {
    return "SC";
  }

  /**
   * <p>To override odd behavior standard I18N.</p>
   * @param pKey key
   * @return i18n message
   **/
  public final String getMsg(final String pKey) {
    try {
      return this.messages.getString(pKey);
    } catch (Exception e) {
      return "[" + pKey + "]";
    }
  }

  /**
   * <p>Build A-Jetty Root V1 certificate.</p>
   * @param pKpRoot Root key pair
   * @param pX500dn X.500 distinguished name.
   * @param pStart date from.
   * @param pEnd date to.
   * @throws Exception an Exception
   * @return root certificate
   */
  public final X509Certificate buildRootCert(final KeyPair pKpRoot,
    final String pX500dn, final Date pStart, final Date pEnd) throws Exception {
    X509v1CertificateBuilder certBldr = new JcaX509v1CertificateBuilder(
      new X500Name(pX500dn), BigInteger.valueOf(1), //#1
        pStart, pEnd, new X500Name(pX500dn), pKpRoot.getPublic());
    ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
      .setProvider("SC").build(pKpRoot.getPrivate());
    return new JcaX509CertificateConverter().setProvider("SC")
      .getCertificate(certBldr.build(signer));
  }

  /**
   * <p>Build A-Jetty CA intermediate V3 certificate
   * to use for creating (signing) end entities certificates.</p>
   * @param pCaPk CA PK
   * @param pRootSk root private key
   * @param pRootCert root certificate
   * @param pX500dn X.500 distinguished name.
   * @param pStart date from.
   * @param pEnd date to.
   * @throws Exception an Exception
   * @return CA certificate
   */
  public final X509Certificate buildCaCert(final PublicKey pCaPk,
    final PrivateKey pRootSk, final X509Certificate pRootCert,
      final String pX500dn, final Date pStart,
        final Date pEnd) throws Exception {
    X509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
      pRootCert.getSubjectX500Principal(), BigInteger.valueOf(2), //#2
        pStart, pEnd, new X500Principal(pX500dn), pCaPk);
    JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();
    certBldr.addExtension(Extension.authorityKeyIdentifier, false, extUtils
      .createAuthorityKeyIdentifier(pRootCert)).addExtension(Extension
      .subjectKeyIdentifier, false, extUtils.createSubjectKeyIdentifier(pCaPk))
      .addExtension(Extension.basicConstraints, true,
        new BasicConstraints(0))
      .addExtension(Extension.keyUsage, true, new KeyUsage(KeyUsage
      .digitalSignature | KeyUsage.keyCertSign | KeyUsage.cRLSign));
    ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
      .setProvider("SC").build(pRootSk);
    return new JcaX509CertificateConverter().setProvider("SC")
      .getCertificate(certBldr.build(signer));
  }

  /**
   * <p>Build A-Jetty self signing CA intermediate V3 certificate
   * to use for creating (signing) end entities certificates.</p>
   * @param pKpCa CA key pair
   * @param pX500dn X.500 distinguished name.
   * @param pStart date from.
   * @param pEnd date to.
   * @throws Exception an Exception
   * @return CA certificate
   */
  public final X509Certificate buildCaCertSelfSign(final KeyPair pKpCa,
    final String pX500dn, final Date pStart, final Date pEnd) throws Exception {
    X509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
      new X500Principal(pX500dn), BigInteger.valueOf(1), //#1
        pStart, pEnd, new X500Principal(pX500dn), pKpCa.getPublic());
    JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();
    certBldr.addExtension(Extension
      .subjectKeyIdentifier, false, extUtils
      .createSubjectKeyIdentifier(pKpCa.getPublic()))
      .addExtension(Extension.basicConstraints, true,
        new BasicConstraints(0))
      .addExtension(Extension.keyUsage, true,
        new KeyUsage(KeyUsage.keyCertSign | KeyUsage.cRLSign));
    ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
      .setProvider("SC").build(pKpCa.getPrivate());
    return new JcaX509CertificateConverter().setProvider("SC")
      .getCertificate(certBldr.build(signer));
  }

  /**
   * <p>Build end entity V3 certificate.</p>
   * @param pEntityPk entity PK
   * @param pCaSk CA private key
   * @param pCaCert CA certificate
   * @param pSn serial number
   * @param pX500dn X.500 distinguished name.
   * @param pStart date from.
   * @param pEnd date to.
   * @throws Exception an Exception
   * @return end user certificate
   */
  public final X509Certificate buildEndEntityCert(final PublicKey pEntityPk,
    final PrivateKey pCaSk, final X509Certificate pCaCert, final int pSn,
      final String pX500dn, final Date pStart,
        final Date pEnd) throws Exception {
    X509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
      pCaCert.getSubjectX500Principal(), BigInteger.valueOf(pSn),
        pStart, pEnd, new X500Principal(pX500dn), pEntityPk);
    JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();
    certBldr.addExtension(Extension.authorityKeyIdentifier, false, extUtils
      .createAuthorityKeyIdentifier(pCaCert)).addExtension(Extension
      .subjectKeyIdentifier, false, extUtils.createSubjectKeyIdentifier(
      pEntityPk)).addExtension(Extension.basicConstraints, true,
      new BasicConstraints(false)).addExtension(Extension.keyUsage, true,
      new KeyUsage(KeyUsage.digitalSignature | KeyUsage.keyEncipherment));
    ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
      .setProvider("SC").build(pCaSk);
    return new JcaX509CertificateConverter().setProvider("SC")
      .getCertificate(certBldr.build(signer));
  }

  /**
   * <p>Build localhost HTTPS V3 certificate.</p>
   * @param pEntityPk entity PK
   * @param pCaSk CA private key
   * @param pCaCert CA certificate
   * @param pSn serial number
   * @param pX500dn X.500 distinguished name.
   * @param pStart date from.
   * @param pEnd date to.
   * @throws Exception an Exception
   * @return end user certificate
   */
  public final X509Certificate buildLocalhostHttpsCert(
    final PublicKey pEntityPk, final PrivateKey pCaSk,
      final X509Certificate pCaCert, final int pSn,
        final String pX500dn, final Date pStart,
          final Date pEnd) throws Exception {
    X509v3CertificateBuilder certBldr = new JcaX509v3CertificateBuilder(
      pCaCert.getSubjectX500Principal(), BigInteger.valueOf(pSn),
        pStart, pEnd, new X500Principal(pX500dn), pEntityPk);
    JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();
    certBldr.addExtension(Extension.authorityKeyIdentifier, false, extUtils
      .createAuthorityKeyIdentifier(pCaCert));
    certBldr.addExtension(Extension.subjectKeyIdentifier, false, extUtils
      .createSubjectKeyIdentifier(pEntityPk));
    certBldr.addExtension(Extension.basicConstraints, true,
      new BasicConstraints(false));
    certBldr.addExtension(Extension.extendedKeyUsage, false,
      new ExtendedKeyUsage(KeyPurposeId.id_kp_serverAuth));
    GeneralName dns = new GeneralName(GeneralName.dNSName, "localhost");
    GeneralName ip = new GeneralName(GeneralName.iPAddress, "127.0.0.1");
    GeneralNames dnsIp = new GeneralNames(new GeneralName[] {dns, ip});
    certBldr.addExtension(Extension.subjectAlternativeName, false, dnsIp);
    ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
      .setProvider("SC").build(pCaSk);
    return new JcaX509CertificateConverter().setProvider("SC")
      .getCertificate(certBldr.build(signer));
  }

  //Simple getters and setters:
  /**
   * <p>Getter for messages.</p>
   * @return ResourceBundle
   **/
  public final ResourceBundle getMessages() {
    return this.messages;
  }

  /**
   * <p>Setter for messages.</p>
   * @param pMessages reference
   **/
  public final void setMessages(final ResourceBundle pMessages) {
    this.messages = pMessages;
  }
}
