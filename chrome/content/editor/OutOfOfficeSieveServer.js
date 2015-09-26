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
    @fileoverview
    Library to manage connection and communication between the Thundirbird client and the sieve server.
    This object allow the client to manage the out of office sieve script on the server.
    @author Olivier Brun - BT Global Services / Etat francais Ministere de la Defense
*/

/*
 * Global object.
 */


var gParent = null;
var gOutOfOfficeSieveServer = null;
var gSieve = null;
var gCompileTimeout = null;
var gCompile = null
var gCompileDelay = null;
var closeTimeout = null;
var gKeepAliveInterval = null;
var gTryToCreate = true;
var gRequestedScriptActivation = false;

var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

/**
    @TODO
    Event to manange connection between client and sieve server.
*/
var gEventConnection =
{
    onAuthenticate: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( 'onAuthenticate' );

        // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onAuthenticate: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(gOutOfOfficeSieveServer.toString() + "gEventConnection:onAuthenticate: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onAuthenticate Sieve server check if password is requested.");
        var login = gOutOfOfficeSieveServer.getAccount().getLogin();

        // Without a user name, we can skip the authentication
        if (login.hasUsername() == false){
            gEventConnection.onLoginResponse(null);
            return;
        }

        var request = null;
        // the first in the sasl list is preferred by the server
        switch (response.getSasl()[0].toLowerCase())
        {
            case "login":
                request = new SieveSaslLoginRequest();
                request.addSaslListener(gEventConnection);
                break;
            /*case "digest-md5":
                request = new SieveSaslDigestMD5Request();
                request.addSaslListener(gEventConnection);
                break;*/
            case "plain":
            default: // plain is the fallback...
                request = new SieveSaslPlainRequest();
                request.addSaslListener(gEventConnection);
                break;
        }
        request.addErrorListener(gEventConnection);
        request.setUsername(login.getUsername());

        var password = login.getPassword();
        // TODO: terminate connection in case of an invalid password and notify the user
        if (password == null)
        {
            gEventConnection.onTreatError( "ERRORCODE:0002" ); // invalid password
            return; //TODO Make an error and disconnect the server properly.
            //sivSetStatus(2, "Error: Unable to retrieve Authentication information.");
            //return;
        }
        request.setPassword(password);
        gSieve.addRequest(request);
    },

    onInitResponse: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( 'onInitResponse' );

        // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onInitResponse: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(gOutOfOfficeSieveServer.toString() + "gEventConnection:onInitResponse: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onInitResponse Sieve server initialization done.");
        var login = gOutOfOfficeSieveServer.getAccount().getLogin();

        // is the Server TLS capable?
        if (gOutOfOfficeSieveServer.getAccount().getHost().isTLS() && response.getTLS())
        {
            var request = new SieveStartTLSRequest();
            request.addStartTLSListener(gEventConnection);
            request.addErrorListener(gEventConnection);

            gSieve.addRequest(request);
            return;
        }

        gEventConnection.onAuthenticate(response);
    },

    onStartTLSResponse : function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( 'onStartTLSResponse' );

      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onStartTLSResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        if( gSieve == null ){
            throw new Exception(gOutOfOfficeSieveServer.toString() + "gEventConnection:onStartTLSResponse: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onStartTLSResponse Sieve server start TLS connection.");
        // activate TLS
        gSieve.startTLS();

        // we should call now Capabilities ...
        // .. they can change with enabled TLS

        var request = new SieveCapabilitiesRequest();
        request.addCapabilitiesListener(gEventConnection);
        request.addErrorListener(gEventConnection);

        gSieve.addRequest(request);
    },

    onSaslResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onSaslResponse' );

      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onSaslResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onSaslResponse.");
        gEventConnection.onLoginResponse(response);
    },


    onLoginResponse: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( 'onLoginResponse' );

        // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onLoginResponse: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onLoginResponse Sieve server connected. Request link/unlink script=" + gOutOfOfficeSieveServer.bActivateScript);
        // enable the disabled controls....
        gOutOfOfficeSieveServer.setConnectedTo( gOutOfOfficeSieveServer.getAccount() );

        // Update status
        var values = new Array();
        values.push(gOutOfOfficeSieveServer.getAccount().getHost().getHostname());
        postStatusMessage(gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.connected;", values) );

        if( gOutOfOfficeSieveServer.bActivateScript == true ){
            gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "Set link to script=" + gOutOfOfficeSieveServer.getAccount().isEnabledOutOfOffice() );
            gOutOfOfficeSieveServer.activateScript(gOutOfOfficeSieveServer.getAccount().isEnabledOutOfOffice());
        }
         else {
            gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "Try to update script list status." );
            // Update status for the user interface ...
            gOutOfOfficeSieveServer.updateScriptListStatus();
        }
    },

    onLogoutResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onLogoutResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onLogoutResponse: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(this.toString() + "gEventConnection:onLogoutResponse: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onLogoutResponse Sieve server logout.");
        if (gSieve.isAlive())
            gSieve.disconnect();
        clearTimeout(closeTimeout);

        // this will close the Dialog!
//        close();
        // Update status
        var values = new Array();
        values.push(gOutOfOfficeSieveServer.getAccount().getHost().getHostname());
        postStatusMessage( gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.disconnected;", values) );
        gOutOfOfficeSieveServer.setConnectedTo();
    },

    onListScriptResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onListScriptResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onListScriptResponse: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if (response.hasError()) {
            // alert(gOutOfOfficeSieveServer.toString() + "gEventConnection:onListScriptResponse Command \"Listscripts\" failed");
            gOutOfOfficeSieveServer.getServices().errorSrv(gOutOfOfficeSieveServer.toString() + "gEventConnection:onListScriptResponse Command \"Listscripts\" failed");
            return ;
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onListScriptResponse Sieve server script list response. Try to load " +gOutOfOfficeSieveServer.getScriptName());
        //@TODO get script list and check if the script out of office is activated or not
        var scriptList = response.getScripts();
        for( var count=0; count < scriptList.length ; count++ ){
            if(scriptList[count][0] == gOutOfOfficeSieveServer.getScriptName() ){
//                gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "postStatusAndUpdateUI for " + scriptList[count][0] + " to " + scriptList[count][1]);
                postStatusAndUpdateUI(scriptList[count][1]);
                return; // stop loop this extension manage only out of office specific script
            }
        }
// TODO Make a log message or popup user message if needed
// alert("Script out of office '" + gOutOfOfficeSieveServer.getScriptName() + "' not found .");
        //gOutOfOfficeSieveServer.createScript();
        postStatusAndUpdateUI(false);
    },

    onSetActiveResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onSetActiveResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onSetActiveResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        if( gSieve == null ){
            throw new Exception(this.toString() + "gEventConnection:onSetActiveResponse: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onSetActiveResponse Sieve server set active response.");
        if (response.hasError()){
            // alert(gOutOfOfficeSieveServer.toString() + "gEventConnection:onSetActiveResponse Command \"setActive\" failed");
            gOutOfOfficeSieveServer.getServices().errorSrv(gOutOfOfficeSieveServer.toString() + "gEventConnection:onSetActiveResponse Command \"setActive\" failed");
        }
        // Update status for the user interface ...
        gOutOfOfficeSieveServer.updateScriptListStatus();
        gRequestedScriptActivation = false;
    },

    onCapabilitiesResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onCapabilitiesResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onCapabilitiesResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onCapabilitiesResponse.");
        gEventConnection.onAuthenticate(response);
    },

    onDeleteScriptResponse:  function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onDeleteScriptResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onDeleteScriptResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onDeleteScriptResponse.");
        clearInterval(gCompileTimeout);
        close();
    },

    onPutScriptResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onPutScriptResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onPutScriptResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onPutScriptResponse script installed.");
        //gOutOfOfficeSieveServer.disconnect();

        // Not used because the script file name is hard coded
        /*
         * if ((window.arguments[0]["scriptName"] != null)
         *         && (window.arguments[0]["scriptName"] != gOutOfOfficeSieveServer.getScriptName()))
         *         {
         *             var request = new SieveDeleteScriptRequest( new String(gOutOfOfficeSieveServer.getScriptName()) );
         *             request.addDeleteScriptListener(gEventConnection);
         *             request.addErrorListener(gEventConnection);
         *
         *             gSieve.addRequest(request);
         *             return
         *         }
         */

        // clearTimeout(gCompileTimeout);
        // gOutOfOfficeSieveServer.compileScript();
        // close();
    },

    onGetScriptResponse: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onGetScriptResponse' );
      // Require
        if( gOutOfOfficeSieveServer == null ){
            throw new Exception("gEventConnection:onGetScriptResponse: Require invalid (gOutOfOfficeSieveServer).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onGetScriptResponse Get script name =" + response.getScriptName() );
        gOutOfOfficeSieveServer.setScriptText( response.getScriptBody() );
        gTryToCreate = false;
        if( gParent != null ){
            gParent.postStatusMessage(gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.connectedloaded;") );
            gParent.onConnectFinish(true);
        }else{
            gOutOfOfficeSieveServer.getServices().errorSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onGetScriptResponse:The parent object is not initialized");
        }
    },

    onError: function(response)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onError' );
      // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onError: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(this.toString() + "gEventConnection:onError: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onError");
        var code = response.getResponseCode();

        if (code instanceof SieveRespCodeReferral)
        {
            // close the old sieve connection
            gSieve.disconnect();

            var values = new Array();
            values.push(code.getHostname());
            postStatusMessage(gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.codereferral;", values) );

            gSieve = new Sieve(
                                code.getHostname(),
                                gOutOfOfficeSieveServer.getAccount().getHost().getPort(),
                                gOutOfOfficeSieveServer.getAccount().getHost().isTLS(),
                                (gOutOfOfficeSieveServer.getAccount().getSettings().isKeepAlive() ?
                                    gOutOfOfficeSieveServer.getAccount().getSettings().getKeepAliveInterval():null));

            gSieve.setDebugLevel( gOutOfOfficeSieveServer.getAccount().getSettings().getDebugFlags(), consoleService );
            gOutOfOfficeSieveServer.sieve = gSieve;

            var request = new SieveInitRequest();
            request.addErrorListener(gEventConnection)
            request.addInitListener(gEventConnection)
            gSieve.addRequest(request);

            gSieve.connect();
            return;
        }
/*        if(gRequestedScriptActivation == true ){ // Script doesn't exist
            gOutOfOfficeSieveServer.createScript();
            return;
        }
*/        if(gTryToCreate == true /*&& response.getMessage()*/ ){
            gOutOfOfficeSieveServer.createScript();
            gOutOfOfficeSieveServer.activateScript();
            gTryToCreate = false;
            return;
        }
        var message = response.getMessage();
        gEventConnection.onTreatError(message);
    },

    /*
     * Error code treatment
     */
    onTreatError: function(message)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onTreatError' );
      // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onError: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(this.toString() + "gEventConnection:onError: Require invalid (gSieve).");
        }
        var disableAccount = true;
        var header = "ERRORCODE:";
        var reg = new RegExp(header, "g");
        if( message.length > header.length && message.match(reg) ){ // The message is an error code to build a user label
            var code = message.substring(header.length, message.length );
            switch( code )
            {
            case "0001" : { // Hard coded error from sieve.js connection to server error
                var values = new Array();
                values.push(gOutOfOfficeSieveServer.getAccount().getHost().getPort());
                message = gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.cannotopenconnection;", values);
                break;
            }
            case "0002" : { // Invalid password from user
                var values = new Array();
                values.push(gOutOfOfficeSieveServer.getAccount().getLogin().getUsername());
                message = gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.invalidpassword;", values);
                break;
            }
            default: // Code unknown
                gOutOfOfficeSieveServer.getServices().errorSrv( gOutOfOfficeSieveServer.toString() + "gEventConnection:onTreatError ==>" + message );
                break;
            }
        } else { // Error from server, the message cannot be localize.
            var values = new Array();
            values.push(message);
            message = gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.errorfromserver;", values);
        }
        if( disableAccount == true){ // set it to false if don't need
            // Disable account on error
            gOutOfOfficeSieveServer.getAccount().setEnabled(false);
            gSieve.disconnect();
            gSieve = null;
        }

        postStatusMessage(message);
        // Send status with connection error to reset manager
        postStatusAndUpdateUI(false, true);
//        alert("Sever ERROR: " + message);
    },

    onCycleCell: function(row,col,script,active)
    {
      gOutOfOfficeSieveServer.getServices().logSrv( 'onCycleCell' );
      // Require
        if( gOutOfOfficeSieveServer == null || gOutOfOfficeSieveServer.getAccount() == null ){
            throw new Exception("gEventConnection:onCycleCell: Require invalid (gOutOfOfficeSieveServer or Account member).");
        }
        if( gSieve == null ){
            throw new Exception(this.toString() + "gEventConnection:onCycleCell: Require invalid (gSieve).");
        }
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "onCycleCell Script=" + gOutOfOfficeSieveServer.getScriptName() );
        var request = null;
        if (active == true){
            request = new SieveSetActiveRequest();
        }
        else {    // Script name hard coded for this extension
            request = new SieveSetActiveRequest(gOutOfOfficeSieveServer.getScriptName());
        }

        request.addSetScriptListener(gEventConnection);
        request.addErrorListener(gEventConnection);
        gSieve.addRequest(request);
    }
}
/*
 * Request password if the connection has not been establish
 */
function promptPassword()
{
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);

    input = {value:null};
    check = {value:false};
    var result = prompts.promptPassword(window,"Password", "Please enter the password for your Sieve account", input, null, check);

    if (result)
        return input.value;

    return null;
}

/*
 *  @TODO
 *  Event to manange script creation.
 */
var gEventCreateScript =
{
    onPutScriptResponse: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventCreateScript:onPutScriptResponse Create script name =" + gOutOfOfficeSieveServer.getScriptName() );
        gTryToCreate = false;
        if( gParent != null ){
            gParent.postStatusMessage( gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.connectedcreated;") );
            gParent.onConnectFinish(true);
        }else{
//            if( gRequestedScriptActivation == true )
    //            return;

//            gOutOfOfficeSieveServer.getServices().errorSrv( gOutOfOfficeSieveServer.toString() + "gEventCreateScript:onPutScriptResponse The parent object is not initialized");
//            stop();
        }
    },

    onError: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventCreateScript:onError Error =" + response.getScriptName() );

        // the server did not accept our script therfore wa can't delete it...
    }
}


/**
    @TODO
    Event to manange script compilation.
*/
var gEventCompile =
{
    onPutScriptResponse: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventCompile:onPutScriptResponse Put script name =" + response.getScriptName() );
        document.getElementById("gbError").setAttribute('hidden','true');

        // we need no handlers thus we don't care if the call succseeds
        gSieve.addRequest(new SieveDeleteScriptRequest("TMP_FILE_DELETE_ME"));
        clearTimeout(gCompileTimeout);
        if( gParent != null ){
            gParent.close();
        }else{
            close(); // try to close windows without parent initialized.
        }
        gParent = null;
    },

    onError: function(response)
    {
        gOutOfOfficeSieveServer.getServices().logSrv( gOutOfOfficeSieveServer.toString() + "gEventCompile:onError Error =" + response.getScriptName() );
        document.getElementById("gbError").removeAttribute('hidden');
        document.getElementById("lblError").value = response.getMessage();

        // the server did not accept our script therfore wa can't delete it...
    }
}


/*
 * @class This Class link data from user interface to the sieve service running on cyrus server.
 * @version 0.1.0
 * @author Olivier Brun - BT Global Services / Etat francais Ministere de la Defense
 * @constructor
 * @param {object} SieveAccount account source
 */
function OutOfOfficeSieveServer(account, services, settings, bActivateScript) {
    /*
     * Constant declaration.
     */
    this.CONST_HEADER = new String("OutOfOfficeSieveServer: ");

    /*
     * Sieve object that manage the connection with the server
     * @type Sieve
     */
    this.sieve = null;

    /*
     * account to access to the sieve server
     * @type SieveAccount
     */
    this.account = account;
    /*
     * Current account connected, should be null if no connection active
     * @type SieveAccount
     */
    this.accountConnected = null;

    /*
     * Object to access to global service (Log, ...)
     * @type Services
     */
    this.services = services;
    /*
     * Out of office parameters
     * @type OutOfOfficeSettings
     */
    this.settings = settings;

    /*
     * Indicate if the function activate will called. This function active or not the symbolic
     * link to the server on the out of office script.
     * @type boolean
     */
    this.bActivateScript = bActivateScript;

    this.getServices().logSrv( this.toString() + "Constructor this.sieve=" + this.sieve );
    this.initialize();
}

/*
 * Return the name of the class initialized in CONST_HEADER variable.
 * This function overload the 'toString' standard function from Javascript Object.
 *
 * @return (string) CONST_HEADER containing class name.
 */
OutOfOfficeSieveServer.prototype.toString    = function ()
{
    if( this.CONST_HEADER == undefined || this.CONST_HEADER == null ){
        return "OutOfOfficeSieveServer: Invalid String"; // Error
    }
    return this.CONST_HEADER;
}

/*
 * Load all the Libraries we need.
 */
OutOfOfficeSieveServer.prototype.loadClass    = function ()
{
    var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveAccounts.js");
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/Sieve.js");
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveRequest.js");
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponse.js");
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponseParser.js");
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponseCodes.js");
}

/*
 * Initialize OutOfOfficeSieveServer
 */
OutOfOfficeSieveServer.prototype.initialize    = function ()
{
    /*
     * Initialize sieve server as a global object
     * This is to use the sieve server object by the event objects
     */
    gOutOfOfficeSieveServer = this;
    this.setConnectedTo();

    this.loadClass();

    // @TODO Initialize sieve object
    this.connect();
}

/*
 * Start connection to sieve server
 */
OutOfOfficeSieveServer.prototype.connect    = function ()
{
    this.getServices().logSrv( this.toString() + "try to connect to sieve server " + this.getAccount().getHost().getHostname() );
    this.getServices().logSrv( this.toString() + "activate=" + this.bActivateScript );
    var logoutTimeout = null;
    // Override the unsual request handler because we have to logout first
    var levent =
    {
        onLogoutResponse: function(response)
        {
            clearTimeout(logoutTimeout);
            if ((gOutOfOfficeSieveServer.sieve != null) && (gOutOfOfficeSieveServer.sieve.isAlive())){
                gOutOfOfficeSieveServer.sieve.disconnect();
            }

            // Disable and cancel if account is not enabled
            if (gOutOfOfficeSieveServer.getAccount().isEnabled() == false)
            {    // If we have this message it is a conflict with Sieve extension
                postStatusMessage( gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.inactive;") );
                return;
            }

            postStatusMessage( gOutOfOfficeSieveServer.getServices().localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.connecting;") );

            // TODO To be reactivated if this functionality is requested
            /*
            if (gOutOfOfficeSieveServer.getAccount().getSettings().isKeepAlive())
                gKeepAliveInterval = setInterval("onKeepAlive()",gOutOfOfficeSieveServer.getAccount().getSettings().getKeepAliveInterval());
            */

            gSieve = new Sieve(
                                gOutOfOfficeSieveServer.getAccount().getHost().getHostname(),
                                gOutOfOfficeSieveServer.getAccount().getHost().getPort(),
                                gOutOfOfficeSieveServer.getAccount().getHost().isTLS(),
                                (gOutOfOfficeSieveServer.getAccount().getSettings().isKeepAlive() ?
                                    gOutOfOfficeSieveServer.getAccount().getSettings().getKeepAliveInterval():null));

            gSieve.setDebugLevel( gOutOfOfficeSieveServer.getAccount().getSettings().getDebugFlags(), consoleService );
            gOutOfOfficeSieveServer.sieve = gSieve;

            var request = new SieveInitRequest();
            request.addErrorListener(gEventConnection)
            request.addInitListener(gEventConnection)
            gSieve.addRequest(request);

            gSieve.connect();
        }
    }

    // Besteht das Objekt überhaupt bzw besteht eine Verbindung?
    if ((gSieve == null) || (gSieve.isAlive() == false))
    {
        // beides schein nicht zu existieren, daher connect direkt aufrufen...
        levent.onLogoutResponse("");
        return;
    }

    // hier haben wir etwas weniger Zeit ...
    logoutTimeout = setTimeout("levent.onLogoutResponse(\"\")",250);

    if (gKeepAliveInterval != null)
    {
        clearInterval(gKeepAliveInterval);
        gKeepAliveInterval = null;
    }
    var request = new SieveLogoutRequest();
    request.addLogoutListener(levent);
    request.addErrorListener(gEventConnection);
    gSieve.addRequest(request);
}

/*
 * Stop connection to sieve server
 */
OutOfOfficeSieveServer.prototype.disconnect    = function ()
{
    /*
     * Can be null if an error occurs
    if (gSieve == null){
        this.getServices().warningSrv( this.toString() + "disconnect invalid sieve server object.");
        return false;
    }
     */
    this.getServices().logSrv( this.toString() + "disconnect.");
    if (gKeepAliveInterval != null)
    {
        this.getServices().logSrv( this.toString() + "disconnect : Disable gKeepAliveInterval.");
        clearInterval(gKeepAliveInterval);
        gKeepAliveInterval = null;
    }

    if (gSieve == null)
        return true;
    // Force disconnect in 500 MS
    closeTimeout = setTimeout("gSieve.disconnect(); close();",500);

    var request = new SieveLogoutRequest(gEventConnection)
    request.addLogoutListener(gEventConnection);
    request.addErrorListener(gEventConnection);

    gSieve.addRequest(request);
}


/*
 * Create script if it doesn't exist on the server
 *
 */
OutOfOfficeSieveServer.prototype.createScript    = function ()
{
    if (this.sieve == null){
        this.getServices().warningSrv( this.toString() + "loadScript invalid sieve server object");
        return false;
    }
    this.getServices().logSrv( this.toString() + "createScript" + this.getScriptName());

    // TODO put the right parameters to send to sieve server name and data script
    var request = new SievePutScriptRequest( new String(this.getScriptName()), new String("/*NEW*/") );
    request.addPutScriptListener(gEventCreateScript);
    request.addErrorListener(gEventCreateScript);

    this.sieve.addRequest(request);
}

/*
 * Load the script out of office from sieve server
 * @param (object) Parent window that request the load
 * @return (boolean) Load script successfully started
 */
OutOfOfficeSieveServer.prototype.loadScript    = function (parent)
{
    if (gSieve == null){
        this.getServices().warningSrv( this.toString() + "loadScript invalid sieve server object");
        return false;
    }
    this.getServices().logSrv( this.toString() + "loadScript " + this.getScriptName() );

    gParent = parent;

    // List all scripts as soon as we are connected
/*        var request = new SieveListScriptRequest();
    request.addListScriptListener(gEventConnection);
    request.addErrorListener(gEventConnection);

    gSieve.addRequest(request);
*/

    // script load
    // gSieve = this.connect();
    gCompile = this.getAccount().getSettings().hasCompileDelay();
    gCompileDelay = this.getAccount().getSettings().getCompileDelay();
    this.getServices().logSrv( this.toString() + "loadScript Compile =" + gCompile + " delay=" + gCompileDelay );

    var request = new SieveGetScriptRequest( new String(this.getScriptName()) );
    request.addGetScriptListener(gEventConnection);
    request.addErrorListener(gEventConnection);
    this.getServices().logSrv( this.toString() + "loadScript send request to sieve." );

    gSieve.addRequest(request);
    gTryToCreate = true;
    this.getServices().logSrv( this.toString() + "loadScript ENDED");
    return true;
}

/*
 * Save the script out of office to sieve server
 */
OutOfOfficeSieveServer.prototype.saveScript    = function ()
{
    this.getServices().logSrv( this.toString() + "saveScript");

    // TODO put the right parameters to send to sieve server name and data script
    var request = new SievePutScriptRequest( new String(this.getScriptName()), new String(this.getScriptText()) );
    request.addPutScriptListener(gEventConnection);
    request.addErrorListener(gEventConnection);

    gSieve.addRequest(request);
}

/*
 * Compile the script out of office and check result
 */
OutOfOfficeSieveServer.prototype.compileScript    = function ()
{
    this.saveScript();
    /*
    this.getServices().logSrv( this.toString() + "compileScript");
    var request = new SievePutScriptRequest("TMP_FILE_DELETE_ME", new String(this.getScriptText()) );
    request.addPutScriptListener(gEventCompile);
    request.addErrorListener(gEventCompile);
    gSieve.addRequest(request);
    */
}

/*
 * Activate the script out of office on the server with a symbolic link
 * @param (boolean) Activate script when true
 */
OutOfOfficeSieveServer.prototype.activateScript    = function (active)
{
    if( this.isConnectionActive() == false ){
        this.getServices().logSrv( this.toString() + "The script cannot be set to active=" + active + " because the server is not connected.");
        return;
    }
    this.getServices().logSrv( this.toString() + "activate script=" + active );
    var request = null;
    if (active == false){
        request = new SieveSetActiveRequest();
    } else {
        request = new SieveSetActiveRequest(this.getScriptName());
    }
//    gRequestedScriptActivation = true;
    request.addSetScriptListener(gEventConnection);
    request.addErrorListener(gEventConnection);
    gSieve.addRequest(request);
}

/*
 * Activate the script out of office on the server with a symbolic link
 * @param (boolean) Activate script when true
 */
OutOfOfficeSieveServer.prototype.updateScriptListStatus    = function ()
{
    if( this.isConnectionActive() == false ){
        this.getServices().logSrv( this.toString() + "The update script link status cannot be done because the server is not connected.");
        return;
    }
    if (gSieve == null){
        this.getServices().warningSrv( this.toString() + "loadScript invalid sieve server object");
        return;
    }
    this.getServices().logSrv( this.toString() + "Update script link status.");

    // Always refresh the table to update status for the user interface ...
    var request = new SieveListScriptRequest();
    request.addListScriptListener(gEventConnection);
    request.addErrorListener(gEventConnection);
    gSieve.addRequest(request);
}

/*
 * Keep Alive
 */
OutOfOfficeSieveServer.prototype.keepAlive    = function (script,active)
{
      // create a sieve request without an eventhandler...
    gSieve.addRequest(new SieveCapabilitiesRequest())
}

/*
 * Retrieve the name of the script file
 * @return (string) scriptName Text of the script
 */
OutOfOfficeSieveServer.prototype.getScriptName    = function ()
{
    return this.settings.getScriptName();
}

/*
 * Retrieve the text of the script after read from file or generated with data from UI
 * @return (string) script Text of the script
 */
OutOfOfficeSieveServer.prototype.getScriptText    = function ()
{
    return this.settings.scriptCore;
}

/**
 * Set the text of the script after read from file or generated with data from UI
 * @param (string) script Text of the script
 */
OutOfOfficeSieveServer.prototype.setScriptText    = function (script)
{
    this.settings.scriptCore = script;
}

/**
 * Retrieve current sieve account object
 * @return (SieveAccount) Sieve account selected
 */
OutOfOfficeSieveServer.prototype.getAccount    = function ()
{
    return this.account;
}

/**
 * Set the account currently connected to a sieve server
 * @param (SieveAccount) Active Sieve account connection
 */
OutOfOfficeSieveServer.prototype.setConnectedTo    = function (account)
{
    if( account == undefined ){ // Accept no parameter
        account = null;
    }
    this.accountConnected = account;
}

/**
 * Check if a connection to a sieve server is active
 * @return (boolean) Sieve account selected
 */
OutOfOfficeSieveServer.prototype.isConnectionActive    = function ()
{
    return (this.accountConnected != null);
}

/**
 * Retrieve object service
 * @return (Services) Services object
 */
OutOfOfficeSieveServer.prototype.getServices    = function ()
{    // Require
    if( this.services == null ){
        throw new Exception(this.toString() + "getServices: Require invalid (services).");
    }
    return this.services;
}

/**
 * Parse the script file read and extract value to initialize Out of Office settings objectc.
 * This will use by the OutOfOfficeAccountSettings to set the user interface
 */
OutOfOfficeSieveServer.prototype.fillSettings    = function ()
{
    return this.getServices().parseScriptCore();
}
