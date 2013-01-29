/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org Code.
 *
 * The Initial Developer of the Original Code is
 *   BT Global Services / Etat francais Ministere de la Defense
 * Portions created by the Initial Developer are Copyright (C) 1998-2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Olivier Brun BT Global Services / Etat francais Ministere de la Defense
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


/**
 * @fileoverview Sieve Server Data - Library to manage sieve server settings and the user interface.
 * @author Olivier Brun - BT Global Services / Etat francais Ministere de la Defense
 */

/**
 * @class Sieve server data for the user interface. Used in file am-sieveserverOverlay.js
 * @constructor
 * @param (Object) account with value to initialize user interface
 * @author Olivier Brun / BT Global Services / Etat francais Ministere de la Defense
 */

function SieveServerSettingsData(account)
{
    // require
    if (account == undefined || account == null){
        throw "SieveServerSettingsData(): Sieve server account parameter cannot be null (account)!";
    }

    // get the custom Host settings
    this.hostName = account.getHost(1).getHostname();
    this.hostPort = account.getHost(1).getPort();
    this.hostTLS = account.getHost(1).isTLS();
    this.hostType = ( (account.getHost().getType() == 1) ? true : false );

    // Login field.
    this.userName = account.getLogin(2).getUsername();
    this.userPassword = account.getLogin(2).getPassword(false); // Don't prompt for password
    // this.userPasswordCheck = account.getLogin(2).hasPassword();

    // Set type to use imap settings.
    account.setActiveLogin(1);
    this.rgLoginIndex = account.getLogin().getType();

    // Option fields.
    // TODO Not used in the user interface
    this.keepAlive = account.getSettings().getKeepAliveInterval();
    this.keepAliveCheck = account.getSettings().isKeepAlive();

    this.compileDelay = account.getSettings().getCompileDelay();
    this.compileCheck = account.getSettings().hasCompileDelay();

    // Debug fields.
    // TODO Not used in the user interface when it will used check code validity
    // this.debugMode = account.getSettings().hasDebugFlag(0);
    // this.debugMode = account.getSettings().hasDebugFlag(1);
    // this.debugMode = account.getSettings().hasDebugFlag(2);
}

/**
 * Getter of the host name value
 * @return (String) Return the host name value.
 */
SieveServerSettingsData.prototype.getHostName = function () {
    return this.hostName;
}
/**
 * Setter of the host name value
 * @param (String) New host name value.
 */
SieveServerSettingsData.prototype.setHostName = function (hostName) {
    this.hostName = hostName;
}

/**
 * Getter of the host port value
 * @return (Boolean) Return the host port value.
 */
SieveServerSettingsData.prototype.getHostPort = function () {
    return this.hostPort;
}
/**
 * Setter of the host port value
 * @param (Boolean) New host port value.
 */
SieveServerSettingsData.prototype.setHostPort = function (hostPort) {
    this.hostPort = hostPort;
}

/**
 * Getter of the host TLS value
 * @return (Boolean) Return the host TLS value.
 */
SieveServerSettingsData.prototype.getHostTLS = function () {
    return this.hostTLS;
}
/**
 * Setter of the host TLS value
 * @param (Boolean) New host TLS value.
 */
SieveServerSettingsData.prototype.setHostTLS = function (hostTLS) {
    this.hostTLS = hostTLS;
}

/**
 * Getter of the host type value
 * @return (Integer) Return the host type value.
 */
SieveServerSettingsData.prototype.getHostType = function () {
    return this.hostType;
}
/**
 * Setter of the host type value
 * @param (Integer) New host type value.
 */
SieveServerSettingsData.prototype.setHostType = function (hostType) {
    this.hostType = hostType;
}

/**
 * Getter of the user name value
 * @return (String) Return the user name value.
 */
SieveServerSettingsData.prototype.getUserName = function () {
    return this.userName;
}
/**
 * Setter of the user name value
 * @param (String) New user name value.
 */
SieveServerSettingsData.prototype.setUserName = function (userName) {
    this.userName = userName;
}

/**
 * Getter of the user password value
 * @return (String) Return the user password value.
 */
SieveServerSettingsData.prototype.getUserPassword = function () {
    return this.userPassword;
}
/**
 * Setter of the user password value
 * @param (String) New user password value.
 */
SieveServerSettingsData.prototype.setUserPassword = function (userPassword) {
    this.userPassword = userPassword;
}

/**
 * Getter of the password check attribute.
 * @return (Boolean) Return the password check value.
 */
SieveServerSettingsData.prototype.getUserPasswordCheck = function () {
    return this.userPasswordCheck;
}
/**
 * Setter of the password check attribute.
 * @param (Boolean) New password check value.
 */
SieveServerSettingsData.prototype.setUserPasswordCheck = function (userPasswordCheck) {
    this.userPasswordCheck = userPasswordCheck;
}

/**
 * Getter of the login value
 * @return (Integer) Return the login value.
 */
SieveServerSettingsData.prototype.getLoginIndex = function () {
    return this.rgLoginIndex;
}
/**
 * Setter of the login value
 * @param (Integer) New login value.
 */
SieveServerSettingsData.prototype.setLoginIndex = function (rgLoginIndex) {
    this.rgLoginIndex = rgLoginIndex;
}

/**
 * Getter of the keep alive value
 * @return (Integer) Return the keep alive value.
 */
SieveServerSettingsData.prototype.getKeepAliveInterval = function () {
    return this.keepAlive;
}
/**
 * Setter of the keep alive value
 * @param (Integer) New keep alive value.
 */
SieveServerSettingsData.prototype.setKeepAliveInterval = function (keepAlive) {
    this.keepAlive = keepAlive;
}

/**
 * Check if the keep alive is enable
 * @return (Boolean) <b>True</b> for enabled, <b>false</b> for disabled.
 */
SieveServerSettingsData.prototype.isKeepAlive = function () {
    return this.keepAliveCheck;
}
/**
 * Enable/Disable keep alive attribute.
 * @return (Boolean) <b>True</b> for enabled, <b>false</b> for disabled.
 */
SieveServerSettingsData.prototype.enableKeepAlive = function (keepAliveCheck) {
    this.keepAliveCheck = keepAliveCheck;
}

/**
 * Setter of the compile delay value
 * @param (Integer) New compile delay value.
 */
SieveServerSettingsData.prototype.getCompileDelay = function () {
    return this.compileDelay;
}
/**
 * Setter of the compile delay value
 * @param (Integer) New compile delay value.
 */
SieveServerSettingsData.prototype.setCompileDelay = function (compileDelay) {
    this.compileDelay = compileDelay;
}

/**
 * Getter of the compiler attribute.
 * @return (Boolean) Return the compile value.
 */
SieveServerSettingsData.prototype.getCompileCheck = function () {
    return this.compileCheck;
}
/**
 * Setter of the compiler attribute.
 * @param (Boolean) New compile value.
 */
SieveServerSettingsData.prototype.setCompileCheck = function (compileCheck) {
    this.compileCheck = compileCheck;
}

/**
 * Getter of the debug attribute.
 * @return (Boolean) Return the debug value.
 */
SieveServerSettingsData.prototype.getDebugMode = function () {
    return this.debugMode;
}
/**
 * Setter of the debug attribute.
 * @param (Boolean) New debug value.
 */
SieveServerSettingsData.prototype.setDebugMode = function (debugMode) {
    this.debugMode = debugMode;
}

/**
 * Update account settings with the user data
 * @param (Object) account to update with the user value
 */
SieveServerSettingsData.prototype.updateAccount = function ( account ) {
    // require
    if (account == undefined || account == null){
        throw "updateAccount(): Sieve server account parameter cannot be null (account)!";
    }

    // Login field.
    // gAccount.setActiveLogin( gSieveServerToConfigure.getLoginIndex() );
    // Force the login to use imap settings
    gAccount.setActiveLogin( 1 );
    if( gSieveServerToConfigure.getLoginIndex() == 2 ){
        gAccount.getLogin(2).setLogin( gSieveServerToConfigure.getUserName(), ( (gSieveServerToConfigure.getUserPasswordCheck()==true)?gSieveServerToConfigure.getUserPassword() : null ) );
    }

    // set the custom Host settings
    gAccount.setActiveHost( gSieveServerToConfigure.getHostType() );

    gAccount.setActiveLogin(1);
    if( gSieveServerToConfigure.getHostType() == 1 ){ // Host name used
        gAccount.getHost(1).setHostname( gSieveServerToConfigure.getHostName() );
    }
    gAccount.getHost(1).setPort( gSieveServerToConfigure.getHostPort() );
    gAccount.getHost(1).setTLS( gSieveServerToConfigure.getHostTLS() );

    // Debug fields.
    gAccount.getSettings().enableKeepAlive( gSieveServerToConfigure.isKeepAlive() );
    gAccount.getSettings().setKeepAliveInterval( gSieveServerToConfigure.getKeepAliveInterval() );
    gAccount.getSettings().enableCompileDelay( gSieveServerToConfigure.getCompileCheck() );
    gAccount.getSettings().setCompileDelay( gSieveServerToConfigure.getCompileDelay() );

    // Debug fields.
    gAccount.getSettings().setDebugFlag( gSieveServerToConfigure.getDebugMode() );
}

