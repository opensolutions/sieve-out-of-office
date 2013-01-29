/* -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * ***** BEGIN LICENSE BLOCK *****
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
 * Netscape Communications Corporation.
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
 * @fileoverview Account User Interface - Library to configure Sieve server settings by account.
 * This file will called by the Account Service manager by the class @{link OUT_OF_OFFICEService}.
 * This file use the {@link SieveServerSettingsData} class to store account settings.
 * @author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
 */

//Load all the Libraries we need...
var jsLoader =  Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);

//includes
jsLoader.loadSubScript( "chrome://out_of_office/content/libs/preferences.js" );
jsLoader.loadSubScript( "chrome://out_of_office/content/libs/misc.js" );

/**
 * Global variables services tool
 */
var globalServices = new Services();

/**
 * Global variables
 */
var gIdentity = null;
var gServer = null;
var gAccount = null;
var gSieveServerToConfigure = null;

/**
 * onPreInit function to initialize account parameters when it change.
 * This initialize global variable:
 * <ul>
 *     <li>The incoming Server (gServer) from account object.
 *     <li>The default identity (gIdentity) from account object.
 * </ul>
 *
 * This function can be hooked to add more treatment on pre-initialization.
 * @param (Object) account selected in the account properties tree.
 * @param (Object) accountValues values associate to the account selected in the properties tree.
 */
function onPreInit(account, accountValues)
{
    gAccount = null;
    gServer = account.incomingServer;
    gIdentity = account.defaultIdentity;
    globalServices.logSrv("onPreInit Server='" + gServer.key + "' and Identity='" + gIdentity.key + "'.");
}

/**
 *    Tell to the page that new values for account have been loaded
 *    @param (Object) aPageId
 *    @param (Object) aServerId
 */
function onInit(aPageId, aServerId)
{
    globalServices.logSrv("onInit for Server='" + gServer.key + "' and for Identity='" + gIdentity.key + "' started.");
    gAccount = getAccountByKey(gServer.key);

    // For the first version all functionalities are not used.
    // hideControlNotUsed();

    if( gAccount == null ){
        onDialogDisabled(); // Account not found or isn't an IMAP account
    } else {
        onDialogLoad();
        setInformationFields();
    }
    globalServices.logSrv("onInit ended.");
}

/**
 *    Tell to the page that new values from user can be saved
 */
function onSave(){
    globalServices.logSrv("onSave started.");

    // Accept user data if account is valid.
    if( gAccount != null ){
        onDialogAccept();
    }
    globalServices.logSrv("onSave ended.");
    return false;
}

/**
 * Disable all user interface control because the account is not valid or not
 */
function onDialogDisabled()
{
    globalServices.logSrv( "onDialogDisabled" );

    globalServices.enableCtrlID('cbxHost', false);
    globalServices.enableCtrlID('labelHostname', false);
    globalServices.enableCtrlID('txtHostname', false);
    globalServices.enableCtrlID('labelPort', false);
    globalServices.enableCtrlID('txtPort', false);
    globalServices.enableCtrlID('labelDefaultPort', false);
    globalServices.enableCtrlID('cbxTLS', false);
    globalServices.enableCtrlID('txtUsername', false);
    globalServices.enableCtrlID('txtPassword', false);
    globalServices.enableCtrlID('cbxPassword', false);
}

/**
 * For the first version all functionalities are not used.
 * Control hidden to make configuration simply.
 */
function hideControlNotUsed()
{
    globalServices.logSrv( "hideControlNotUsed" );

    globalServices.showCtrlID('groupLogin', false);
    globalServices.showCtrlID('labelLogin', false);
    globalServices.showCtrlID('rgLogin', false);
    globalServices.showCtrlID('labelUsername', false);
    globalServices.showCtrlID('txtUsername', false);
    globalServices.showCtrlID('labelPassword', false);
    globalServices.showCtrlID('txtPassword', false);
    globalServices.showCtrlID('cbxPassword', false);
}

/**
 * Load data and initialize user interface with the Sieve server account settings
 */
function onDialogLoad()
{
    globalServices.logSrv( "onDialogLoad" );

    // Require
    if( gAccount == null ){
        throw "onDialogLoad(): Sieve Server Account cannot be null (gAccount)!";
    }

    jsLoader.loadSubScript( "chrome://out_of_office/content/account/OutOfOfficeSieveServerSettingsData.js" );

    // Enable global check box
    globalServices.enableCtrlID( 'cbxHost', true );

    // Initialize UI parameters
    gSieveServerToConfigure = new SieveServerSettingsData( gAccount );
    updateData( false ); // Set data to user interface control

    // Enable dialog control
    enableHost( gSieveServerToConfigure.getHostType() );
    enableLogin( gSieveServerToConfigure.getLoginIndex() );
    enableKeepAlive( gSieveServerToConfigure.isKeepAlive() );
    enableCompile( gSieveServerToConfigure.getCompileCheck() );
}

/**
 * Set information fields to show current sieve server parameters
 */
function setInformationFields()
{
    globalServices.logSrv( "setInformationFields" );

    if( gAccount == null )
        return; //Invalid account object

    document.getElementById( 'txtDispHostname' ).value = gAccount.getHost().getHostname();
    document.getElementById( 'txtDispPort' ).value = gAccount.getHost().getPort();
    document.getElementById( 'txtDispTLS' ).value = gAccount.getHost().isTLS();

    var authType = "";

    switch( gAccount.getLogin().getType() )
    {
        case 0: authType = "outofoffice.list.tree.info.login.noauth"; break;
        case 1: authType = "outofoffice.list.tree.info.login.useimap"; break;
        case 2: authType = "outofoffice.list.tree.info.login.custom"; break;
    }

    document.getElementById( 'txtDispAuth').value = globalServices.localizeString( "out_of_office_locale.properties", "&" + authType + ";" );
    document.getElementById( 'txtDispUserName').value = gAccount.getLogin().getUsername();

    enableAll( document.getElementById( 'cbxEnableOOO' ) );
}

/**
 * Retrieve and validate data from user interface
 * @return (Boolean) <b>true</b> the data are validated <b>false</b> for invalid data
 */
function onDialogAccept()
{
    globalServices.logSrv( "onDialogAccept" );

    if( updateData() == true )
    {
        // Retrieve and validate data
        globalServices.logSrv( "onDialogAccept data validated." );
        return true;
    }

    globalServices.warningSrv( "onDialogAccept: Invalid data." );
    return false; // Invalid data
}

/**
 * Login radio user control change.
 * @param (object) sender Context of the event
 */
function onLoginSelect(sender)
{
    globalServices.logSrv( "onLoginSelect" );

    var type = 0;
    if (sender.selectedItem.id == "rbNoAuth")
        type = 0;
    else if (sender.selectedItem.id == "rbImapAuth")
        type = 1;
    else if (sender.selectedItem.id == "rbCustomAuth")
        type = 2;

    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setLoginIndex( type );
        enableLogin(type);
    }
    else {
        throw "onLoginSelect(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Enable/Disable login option.
 * @param (Integer) Login type selected by the radio button
 */
function enableLogin(type)
{
    switch (type)
    {
    case 0:
    case 1:
        globalServices.enableCtrlID('txtUsername', false);
        globalServices.enableCtrlID('txtPassword', false);
        globalServices.enableCtrlID('cbxPassword', false);
     break;
    case 2:
        globalServices.enableCtrlID('txtUsername', true);
        globalServices.enableCtrlID('cbxPassword', true);

     var cbxPassword = document.getElementById('cbxPassword');
        globalServices.enableCtrlID('txtPassword', cbxPassword.checked);
        break;
    default:
        globalServices.warningSrv("Invalid login type.");
        break;
    }
}

/**
 * Login user control change.
 * @param (object) sender Context of the event
 */
function onLoginChange(sender)
{
    var cbxPassword = document.getElementById('cbxPassword');
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setUserPasswordCheck(cbxPassword.checked);
        gSieveServerToConfigure.setUserName(document.getElementById('txtUsername').value);
        gSieveServerToConfigure.setUserPassword( ( (cbxPassword.checked == true) ? document.getElementById('txtPassword').value : null ) );
    }
    else {
        throw "onLoginChange(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Password user control get the focus.
 * @param (object) sender Context of the event
 */
function onPasswordFocus(sender)
{
//  document.getElementById('txtPassword').value = "";
}


/**
 * Password user control command.
 * @param (object) sender Context of the event
 */
function onPasswordCommand(sender)
{
    onLoginChange(sender);
    enablePassword(sender.checked);
}

/**
 * Enable/Disable password option.
 * @param (Boolean) <b>true</b> Enable attribute, <b>false</b> Disable attribute
 */
function enablePassword(enabled)
{
    globalServices.enableCtrlID('txtPassword', enabled);
}

/**
 * Host name user control command.
 * @param (object) sender Context of the event
 */
function onHostCommand( sender )
{
    if( gSieveServerToConfigure != null )
    {
        gSieveServerToConfigure.setHostType( sender.checked );
        enableHost( sender.checked );
    }
    else
    {
        throw "onHostCommand(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Enable/Disable Host option.
 * @param (Boolean) <b>true</b> Enable attribute, <b>false</b> Disable attribute
 */
function enableHost( enabled )
{
    globalServices.enableCtrlID( 'labelHostname', enabled );
    globalServices.enableCtrlID( 'txtHostname', enabled );
    globalServices.enableCtrlID( 'labelPort', enabled );
    globalServices.enableCtrlID( 'txtPort', enabled );
    globalServices.enableCtrlID( 'labelDefaultPort', enabled );
    globalServices.enableCtrlID( 'cbxTLS', enabled );
}


function enableAll( sender )
{
    enabled = sender.checked;

    onHostCommand( document.getElementById( 'cbxHost' ) );

    globalServices.enableCtrlID( 'cbxHost', enabled );
    globalServices.enableCtrlID( 'rbNoAuth', enabled );
    globalServices.enableCtrlID( 'rbImapAuth', enabled );
    globalServices.enableCtrlID( 'rbCustomAuth', enabled );

}

/**
 * Host name user control change.
 * @param (object) sender Context of the event
 */
function onHostnameChange(sender)
{
    if(gSieveServerToConfigure != null) {
        globalServices.logSrv( sender.value );
        gSieveServerToConfigure.setHostName( sender.value );
    }
    else {
        throw "onHostnameChange(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Port user control change.
 * @param (object) sender Context of the event
 */
function onPortChange(sender)
{
    if(gSieveServerToConfigure != null) {
        globalServices.logSrv( sender.value );
        gSieveServerToConfigure.setHostPort(sender.value)
    }
    else {
        throw "onPortChange(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * TLS user control command.
 * @param (object) sender Context of the event
 */
function onTLSCommand(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setHostTLS(sender.checked);
    }
    else {
        throw "onTLSCommand(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Keep alive user control command.
 * @param (object) sender Context of the event
 */
function onKeepAliveCommand(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.enableKeepAlive(sender.checked);
        enableKeepAlive(sender.checked);
    }
    else {
        throw "onKeepAliveCommand(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Enable/Disable keep alive option.
 * @param (Boolean) <b>true</b> Enable attribute, <b>false</b> Disable attribute
 */
function enableKeepAlive(enabled)
{
/*
 *  Olivier Brun
 *      - Options not used in the first version.
 *      - These parameters come from sieve extension.
 *      globalServices.enableCtrlID('txtKeepAlive', enabled);
 */
}

/**
 * Keep alive user control change.
 * @param (object) sender Context of the event
 */
function onKeepAliveChange(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setKeepAliveInterval(sender.value);
    }
    else {
        throw "onKeepAliveChange(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Compile user control command.
 * @param (object) sender Context of the event
 */
function onCompileCommand(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setCompileCheck(sender.checked);
        enableCompile(sender.checked);
    }
    else {
        throw "onCompileCommand(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Enable/Disable compile option.
 * @param (Boolean) <b>true</b> Enable attribute, <b>false</b> Disable attribute
 */
function enableCompile(enabled)
{
/*
 *  Olivier Brun
 *      - Options not used in the first version.
 *      - These parameters come from sieve extension.
 *      globalServices.enableCtrlID('txtCompile', enabled);
 */
}

/**
 * Compile user control change.
 * @param (object) sender Context of the event
 */
function onCompileChange(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.setCompileDelay(sender.value);
    }
    else {
        throw "onCompileChange(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
 * Debug user control command.
 * @param (object) sender Context of the event
 */
function onDebugCommand(sender)
{
    if(gSieveServerToConfigure != null) {
        gSieveServerToConfigure.getDebugMode(sender.checked);
    }
    else {
        throw "onDebugCommand(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}

/**
* Call this member function to initialize data in a dialog box, or to retrieve and validate dialog data.
* @param (boolean) bSaveAndValidate Flag that indicates whether dialog box is being initialized (FALSE) or data is being retrieved (TRUE).
* @return (boolean) Nonzero if the operation is successful; otherwise 0. If bSaveAndValidate is TRUE, then a return value of nonzero means that the data is successfully validated.
* @throws Standard exception if the global variable of the server to configure is null @see gSieveServerToConfigure.
*/
function updateData(bSaveAndValidate)
{
    if (gSieveServerToConfigure == null){
        throw "updateData(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
    if(bSaveAndValidate == undefined){
        bSaveAndValidate = true;
    }
    if(bSaveAndValidate == true){    // Retrieve and validate value from control ID
        if( checkDataValidity() == false ) { // Check Data validity
            return false; // Invalid data
        }
        SaveData();
    } else {    // Set value to control ID
        LoadData();
    }
    return true;
}


/**
 * Call this member function to load data from the Sieve account object.
 */
function LoadData()
{
    // get the custom Host settings
    document.getElementById('txtHostname').value = gSieveServerToConfigure.getHostName();
    document.getElementById('txtPort').value = gSieveServerToConfigure.getHostPort();
    document.getElementById('cbxTLS').checked = gSieveServerToConfigure.getHostTLS();
    document.getElementById( 'cbxEnableOOO' ).checked = gAccount.isEnabled();

    var cbxHost = document.getElementById('cbxHost');
    cbxHost.checked = gSieveServerToConfigure.getHostType();

    // Login field.
    document.getElementById('txtUsername').value = gSieveServerToConfigure.getUserName();

    var cbxPassword = document.getElementById('cbxPassword');
    cbxPassword.checked = gSieveServerToConfigure.getUserPasswordCheck();
    document.getElementById('txtPassword').value = ( (cbxPassword.checked == true) ? gSieveServerToConfigure.getUserPassword() : "" );

    var rgLogin = document.getElementById('rgLogin');
    rgLogin.selectedIndex = gSieveServerToConfigure.getLoginIndex();

/**
* Olivier Brun
    - Options not used in the first version.
    - These parameters come from sieve extension.
    document.getElementById('txtKeepAlive').value = gSieveServerToConfigure.getKeepAlive();

    var cbxKeepAlive = document.getElementById('cbxKeepAlive');
    cbxKeepAlive.checked = gSieveServerToConfigure.isKeepAlive();

    document.getElementById('txtCompile').value = gSieveServerToConfigure.getCompileDelay();

    var cbxCompile = document.getElementById('cbxCompile');
    cbxCompile.checked = gSieveServerToConfigure.getCompileCheck();

    var cbxDebug = document.getElementById('cbxDebug');
    // * TODO There is not a checkbox anymore then check this code in the future (Flags)
    // * cbxDebug.checked = gSieveServerToConfigure.getDebugFlags();
*/
}

/**
 * Call this member function to check the validity of the data before set the Sieve account object.
 * @return (boolean) True indicate that the data are correct, False indicate an invalid data set.
 */
function checkDataValidity()
{
    if(gSieveServerToConfigure == null) {
        throw "checkDataValidity(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
    var type = gSieveServerToConfigure.getLoginIndex();
    if ((type < 0) || (type > 2)){
        alertDataValidity("&outofoffice.settings.invalid.choice;", 'labelLogin' );
        return false;
    }
    if ( type == 2 ){ // Use username/password
        if( gSieveServerToConfigure.getUserName() == "" ){    // type 2 request a username
            alertDataValidity("&outofoffice.settings.invalid.data;", 'labelUsername' );
            globalServices.setFocusCtrlID('txtUsername');
            return false;
        }
        if( gSieveServerToConfigure.getUserPasswordCheck()==true ){// Remember the password
            if( gSieveServerToConfigure.getUserPassword() == null || gSieveServerToConfigure.getUserPassword() == "" ){    // Then the password cannot be empty
                alertDataValidity("&outofoffice.settings.invalid.data;", 'labelPassword' );
                globalServices.setFocusCtrlID('txtPassword');
                return false;
            }
        }
    }
    type = gSieveServerToConfigure.getHostType();
    if ((type < 0) || (type > 1)){
        alertDataValidity("&outofoffice.settings.invalid.choice;", 'cbxHost' );
        return false;
    }
    if( type == 1 ){
        // retrieve default value if an error occurs
        var account = new SieveImapHost(gAccount.imapKey);
        if( gSieveServerToConfigure.getHostName() == "" ) {
            gSieveServerToConfigure.setHostName( account.getHostname() );
            alertDataValidity("&outofoffice.settings.invalid.data;", 'labelHostname', account.getHostname());
            //globalServices.setFocusCtrlID('txtHostname');
            //return false;
        }

        if( gSieveServerToConfigure.getHostPort() == 0 ){
            gSieveServerToConfigure.setHostPort( account.getPort() );
            alertDataValidity("&outofoffice.settings.invalid.data;", 'labelPort', account.getPort());
        }
        account = null;
    } else { // reset preference to the default value if the user want to use default imap settings
        gSieveServerToConfigure.setHostPort(2000);
        gSieveServerToConfigure.setHostName("");
    }
    return true;
}

/**
 * Display an error popup and set the focus to the UI control on error.
 * @param (string) message String to localize.
 * @param (string) fieldName Label of the UI control id.
 * @param (string) value put in the string message if a variable is found.
 */
function alertDataValidity( message, fieldName, value )
{
    var values = new Array();
    values.push( globalServices.getStringLabel(fieldName) );
    if( value != undefined && value != null ){
        values.push( value );
    }
    alert( globalServices.localizeString( "out_of_office_locale.properties", message, values) );
}

/**
 *  Call this member function to save data to the Sieve account object.
 */
function SaveData()
{
    if(gSieveServerToConfigure != null) {
        // TODO Make this attribute accessible to the final user.
        // Hard coded. Activation of the sieve server the current gAccount
        gAccount.setEnabled( document.getElementById( 'cbxEnableOOO' ).checked );

        /*
         * Update gAccount settings
         */
        gSieveServerToConfigure.updateAccount(gAccount);
    }
    else {
        throw "SaveData(): Sieve server account to configure cannot be null (gSieveServerToConfigure)!";
    }
}