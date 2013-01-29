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
    Library to manage account out of office user parameters
    @author Olivier Brun - BT Global Services / Etat francais Ministere de la Defense
*/

/*
 * Global object to access preference services
 */
var gPreference = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
jsLoader.loadSubScript( "chrome://out_of_office/content/libs/preferences.js" );

/**
    @class OutOfOfficeSettings object parameters.
    @constructor
*/
function OutOfOfficeSettings (services) {
    /*
     * Allow the application to start in test mode.
     * This option set to true, set also all value of this object to differents value.
     * Then the developer don't need to type anything to the fields.
     * @type boolean
     * this.unitestPhase = true;
     * this.testCaseNumber = 0;
     */

     /*
      * Definition of the constants keyword. These keywords are inserted in comment in the generated script.
      * They are decoded when the file is read to retrieve user parameters and initialize interface.
      */
    this.CONST_HEADER                      = new String("OutOfOfficeSettings: "); // for trace
    this.CONST_KEYWORD_PREFIX              = new String( "@" );
    this.CONST_KEYWORD_REDIRECTION         = new String( "redirection" );
    this.CONST_KEYWORD_FROMADDRESSES       = new String( "addresses" );
    this.CONST_KEYWORD_REDIRECTIONADDRESS  = new String( "redirection.address" );
    this.CONST_KEYWORD_KEEPMESSAGE         = new String( "redirection.keepMessage" );
    this.CONST_KEYWORD_NOTIFICATION        = new String( "notification" );
    this.CONST_KEYWORD_NOTIFICATIONMESSAGE = new String( "notification.message" );
    this.CONST_PREFERENCE_KEY_             = null;


    /**
        Preference URI of the extension.
        @type string
    */
    this.prefURI = null;

    /**
        Redirection activation field.
        It allow the user to redirect his mail to another destination address define in the
        destinationAddress field.
        @type boolean
    */
    this.redirectionEnable = false;

    /**
     *         The fromAddresses field indicates the address mail from the selected account.
     *         @type string
     */
    this.fromAddresses = "";

    this.fromAddressesEnabled = false;

    /**
     *         The destinationAddress field indicates the address mail to redirect the received
     *         mail for the selected account.
     *         @type string
     */
    this.redirectionDestinationAddress = "";
    /**
     *         The short destinationAddress to redirect the received mail for the selected account.
     *         This address looks like the following format 'user@domain.extension'.
     *         Without confusing display name or anything else.
     *         @type string
     */
    this.redirectionShortMailAddress = "";

    /**
        Keep message allow the user to keep the original message to his own mail box.
        If this field is not activated the redirected mail message will be removed from
        the user mailbox.
        @type boolean
    */
    this.redirectionKeepMessage = false;

    /**
     *     The notificationEnable field activate the automatic response in case of the    'Out Of Office' of the user.
     *     For each mail message received in the mailbox of the user account, all sender will recieve an out of office
     *  notification.
     *  @type boolean
    */
    this.notificationEnable = false;

    /**
     * Definition of the message sent for each sender of a mail message to this mailbox account.
     * @type string
     */
    this.notificationMessage = "";

    /**
     * Object to access to global service (Log, ...)
     * @type Services
     */
    this.services = services;

    /**
     *     Name of the script installed to the sieve server
     *     @type string
     */
    this.scriptName = null;

    /**
     *    Value define to put the default subjet for the notification
     *    @type string
     */
    this.notificationSubject = null;

    /**
     *     Object that contains the generated data to build the runtime script.
     *     This field will be sent to the sieve server in the file named 'scriptOutOfOffice'.
     *     @type string
     */
    this.scriptCore = "";

    /**
     *     Latest script core.
     *     @type string
     */
    this.latestScript = "";

    this.prefs = new Preferences();
}

OutOfOfficeSettings.prototype = {

    /**
     *    Return the name of the class initialized in CONST_HEADER variable.
     *    This function overload the 'toString' standard function from Javascript Object.
     *
     *    @return (string) CONST_HEADER containing class name.
     */
    toString : function()
    {
        if( this.CONST_HEADER == undefined || this.CONST_HEADER == null ){
            return "OutOfOfficeSettings: Invalid String"; // Error
        }
        return this.CONST_HEADER;
    },

    /**
     *     Initialize OutOfOfficeSettings
     */
    initialize : function(uri)
    {
        this.services.logSrv( 'OutOfOfficeSettings.initialize' );

        if( this.services == undefined || this.services == null ) {
            this.services = new Services();
        }
        this.prefURI = this.services.getExtensionKey() + uri;
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:initilize URI=" + this.prefURI);
        // Read settings from preference
        this.read();

    },

    /**
     *     Dump OutOfOfficeSettings
     */
    dump : function()
    {
        if( this.services != null ) {
            this.services.logSrv( this.toString() + "OutOfOfficeSettings:dump script named'" + this.getScriptName() + "'...");
            this.services.logSrv( this.toString() + "\tValue.FromAddressesEanble="+this.getFromAddressesEnabled());
            this.services.logSrv( this.toString() + "\tValue.redirectionEnable="+this.getRedirection());
            this.services.logSrv( this.toString() + "\tValue.redirectionDestinationAddress="+this.getRedirectionAddress() );
            this.services.logSrv( this.toString() + "\tValue.redirectionKeepMessage="+this.getRedirectionKeepMessage() );
            this.services.logSrv( this.toString() + "\tValue.notificationEnable="+this.getNotification() );
            this.services.logSrv( this.toString() + "\tValue.notificationMessage="+this.getNotificationMessage() );
            this.services.logSrv( this.toString() + "OutOfOfficeSettings:dump ended.");
        }
    },


    /**
     *    @TODO
     *    @return (boolean) redirectionEnable containing the activation status of redirection
     */
    getRedirection : function()
    {
        return this.redirectionEnable;
    },

    /**
     *    @TODO
     *    @param (boolean) value containing the activation status of redirection
     */
    setRedirection : function(value)
    {
        this.redirectionEnable = value;
    },

    /**
     *     @TODO
     *     @return (string) fromAddresses containing the addresses from the redirection
     */
    getFromAddresses : function()
    {
        if (this.fromAddresses != null) {
            return this.fromAddresses;
        } else {
            return "";
        }
    },

    /**
     *     @TODO
     *     @param (string) value containing the addresses from the redirection
     */
    setFromAddresses : function(value)
    {
        this.fromAddresses = value;
    },

    /**
     *     @TODO
     *     @return (string) redirectionDestinationAddress containing the address of the redirection
     */
    getRedirectionAddress : function()
    {
        if (this.redirectionDestinationAddress != null) {
            return this.redirectionDestinationAddress;
        } else {
            return "";
        }
    },

    /**
     *     @TODO
     *     @param (string) value containing the address of the redirection
     */
    setRedirectionAddress : function(value)
    {
        this.redirectionDestinationAddress = value;
    },

    /**
     *     @TODO
     *     The requirement is strict because this parameter is use only for the generated script
     *     @return (string) redirectionDestinationAddress containing the address of the redirection
     */
    getShortMailAddress : function()
    {
        // require parameter must be defined
        if( this.redirectionShortMailAddress == undefined || this.redirectionShortMailAddress == null ){
            throw "ERROR: Out of Office Manager: To get the short mail address, the value must be defined.";
        }
        return this.redirectionShortMailAddress;
    },

    /**
     *     @TODO
     *     The requirement is strict because this parameter is use only for the generated script
     *     @param (string) value containing the address of the redirection
     */
    setShortMailAddress : function(value)
    {
        // require parameter must be defined
        if( value == undefined || value == null ){
            throw "ERROR: Out of Office Manager: To set the short mail address, the value must be defined.";
        }
        this.redirectionShortMailAddress = value;
    },


    /**
     *    @TODO
     *    @return (boolean) redirectionKeepMessage containing the keep message status of redirection
     */
    getRedirectionKeepMessage : function()
    {
        return this.redirectionKeepMessage;
    },

    /**
     *    @TODO
     *    @return (boolean) value containing the keep message status of redirection
     */
    setRedirectionKeepMessage : function(value)
    {
        this.redirectionKeepMessage = value;
    },

    /**
     *    @TODO
     *    @return (boolean) notificationEnable containing the activation status of notification
     */
    getNotification : function()
    {
        return this.notificationEnable;
    },

    /**
     *    @TODO
     *    @return (boolean) value containing the activation status of notification
     */
    setNotification : function(value)
    {
        this.notificationEnable = value;
    },

    getFromAddressesEnabled : function()
    {
        return this.fromAddressesEnabled;
    },

    setFromAddressesEnabled : function( enabled )
    {
        this.fromAddressesEnabled = enabled;
    },

    /**
     *    @TODO
     *    @return (string) notificationMessage containing the notification message
     */
    getNotificationMessage : function()
    {
        return this.notificationMessage;
    },

    /**
     *    @TODO
     *    @return (string) value containing the notification message
     */
    setNotificationMessage : function(value)
    {
        this.notificationMessage = value;
    },

    /**
     *    Set data of an OutOfOfficeSettings object with an array of attributs data
     *    @param (array) arraySettings Define all attributes to set an OutOfOfficeSettings object
     */
    setDataFromArray : function(arraySettings)
    {
        this.setRedirection( arraySettings[0] );
        this.setRedirectionAddress( arraySettings[1] );
        this.setRedirectionKeepMessage( arraySettings[2] );
        this.setNotification( arraySettings[3] );
        this.setNotificationMessage( arraySettings[4] );
        this.dump();
    },

    /**
        Set data of an OutOfOfficeSettings object with each attributs in parameters of this function
        @param {boolean} redirection Define the redirectionEnable field of the OutOfOfficeSettings object
        @param {string} destinationAddress Define the redirectionDestinationAddress field of the OutOfOfficeSettings object
        @param {boolean} keepMessage Define the redirectionKeepMessage field of the OutOfOfficeSettings object
        @param {boolean} notificationEnable Define the notificationEnable field of the OutOfOfficeSettings object
        @param {string} notificationMessage Define the notificationMessage field of the OutOfOfficeSettings object
    */
    setDataFromFields : function(redirectionEnable, fromAddressesEnabled, fromAddresses,redirectionDestinationAddress,redirectionKeepMessage, notificationEnable, notificationMessage)
    {
        this.setRedirection( redirectionEnable );
        this.setFromAddressesEnabled( fromAddressesEnabled );
        this.setFromAddresses( fromAddresses );
        this.setRedirectionAddress( redirectionDestinationAddress );
        this.setRedirectionKeepMessage( redirectionKeepMessage );
        this.setNotification( notificationEnable );
        this.setNotificationMessage( notificationMessage );
        this.dump();
    },

    /**
        Set data of an OutOfOfficeSettings object with an other OutOfOfficeSettings object
        @param (OutOfOfficeSettings) objSettings Define all attributes to set an OutOfOfficeSettings object
    */
    setDataFromObject : function(objSettings)
    {
        this.setRedirection( objSettings.getRedirection() );
        this.setAddresses( objSettings.getFromAddresses() );
        this.setRedirectionAddress( objSettings.getRedirectionAddress() );
        this.setRedirectionKeepMessage( objSettings.getRedirectionKeepMessage() );
        this.setNotification( objSettings.getNotification() );
        this.setNotificationMessage( objSettings.getNotificationMessage() );
        this.dump();
    },

    /**
        Check the validity of the data of the current OutOfOfficeSettings object
        @return (integer) result Indicate wich value is invalid.
    */
    checkDataValidity : function()
    {
        // Redirection activated check the mail address.
        if( this.getRedirection() == true ){
            if( this.services.isAddressMailValid( this.getRedirectionAddress(), true ) == false ){
                return 1;
            }
            // Redirection address valid, update the short mail address to use in the final sieve script
            this.setShortMailAddress( this.services.getShortAddressMailFrom( this.getRedirectionAddress() ) );
        }
        // Redirection activated check the mail address.
        if( this.getNotification() == true ){
            if( this.services.isNotificationMessageValid( this.getNotificationMessage() ) == false ){
                return 2;
            }
        }
        return 0;
    },


    /**
        Get the generated sieve script
    */
    getFormatedScript : function()
    {
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:getFormatedScript '" + this.getScriptName() + "'...");
        /* if( this.scriptCore == null || this.scriptCore == "" ){
            // script not built then generate it
            this.generateScript();
        } */
        this.generateScript();
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:getFormatedScript ended.");
        return this.scriptCore ;
    },

    /**
        Generate sieve script with data enter by the user.
    */
    generateScript : function()
    {
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:generateScript started.");
        if( this.scriptCore != null && this.scriptCore != "" ){
            // Save latest generated script
            this.latestScript = this.scriptCore; // Not used
            this.scriptCore = "";
        }
        this.generateHeader();
        this.generateCore();
        this.generateFooter();
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:generateScript ended.");
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:generated script '" + this.getScriptName() + "'...");
        this.services.logSrv( this.toString() + this.scriptCore);
        this.services.logSrv( this.toString() + "OutOfOfficeSettings:generated script.");
    },


    /**
        Generate header of the script.
    */
    generateHeader : function()
    {    // Don't use the comment /* */ the sieve compiler doesn't works correctly
        this.insertLine();
        this.insertLine("# ******************************************************************************");
        this.insertLine("# * Script file generated automaticaly by the '"+ this.services.getExtensionNameDisplayable() +"'.");
        this.insertLine("# * Do not modify this part.");
        this.insertLine("# *" );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_REDIRECTION             + "=" + this.getRedirection() );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_FROMADDRESSES             + "=" + this.getFromAddresses() );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_REDIRECTIONADDRESS    + "=" + this.getRedirectionAddress() );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_KEEPMESSAGE             + "=" + this.getRedirectionKeepMessage() );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_NOTIFICATION         + "=" + this.getNotification() );
        var tempNotification = this.encodeNotification( this.getNotificationMessage() );
        this.insertLine("# *\t" + this.CONST_KEYWORD_PREFIX, false);
        this.insertLine(this.CONST_KEYWORD_NOTIFICATIONMESSAGE    + "=" + tempNotification);
        this.insertLine("# ******************************************************************************");    //Line 12
        this.services.logSrv( this.toString() + "\tgenerate header of the script");
    },

    /*
     * Generate core of the script. This part will be executed by the sieve server.
     */
    generateCore : function()
    {
        this.insertRequires();
        this.generateCoreRedirection();
        this.generateCoreNotification();

        this.services.logSrv( this.toString() + "\tgenerate core of the script");
    },

    /*
     * Generate requirement functionnalities definition.
     * This keyword 'require' allow the server to check if it support the function.
     * This is requirement to execute the script.
     */
    insertRequires : function()
    {
        this.insertLine();
        this.insertLine( "require \"vacation\";" );
        this.insertLine();

        this.services.logSrv( this.toString() + "\tinsertRequires");
    },


    /*
     * Generate core of the script for the redirection part. This part will be executed by the sieve server.
     */
    generateCoreRedirection : function()
    {
        if( this.getRedirection() == false )
            return;

        this.insertLine( "if header :contains \"From\" \"" + this.getShortMailAddress() + "\" {" );
        this.insertLine( "\tstop;" );
        this.insertLine( "}" );
        this.insertLine();

        if( this.getFromAddressesEnabled() )
            this.insertLine( "if header :contains \"To\" [ " + this.getFromAddressesList() + " ] {" );

        this.insertLine( "redirect \"" + this.getShortMailAddress() + "\";" );

        if( this.getRedirectionKeepMessage() )
            this.insertLine( "keep;" );

        if( this.getFromAddressesEnabled() )
            this.insertLine( "}" );

        this.services.logSrv( this.toString() + "\tgenerateCoreRedirection" );
    },


    getFromAddressesList : function()
    {
        s = "";
        fa = this.getFromAddresses().split( ',' );

        for( i in fa )
            s += '"' + fa[ i ].trim() + '"' + ( i == fa.length - 1 ? '' : ', ' );

        return s;
    },

    /*
     * Generate core of the script for the notification part. This part will be executed by the sieve server.
     */
    generateCoreNotification : function()
    {
        if( this.getNotification() )
        {
            this.insertLine();
            this.insertLine( "vacation", false );

            if( this.getFromAddressesEnabled() && this.getFromAddresses() != '' )
                this.insertLine( " :addresses [ " + this.getFromAddressesList() + " ]", false );

            this.insertLine( " :days 1 :subject \"Out of office auto reply\"", false );
            this.insertLine( " text: " );
            this.insertLine( this.getNotificationMessage() );
            this.insertLine( "." );
            this.insertLine( ";" );
        }

        this.services.logSrv( this.toString() + "\tgenerateCoreNotification");
    },


    /*
     * Generate footer of the script.
     */
    generateFooter : function()
    {    // Don't use the comment /* */ the sieve compiler doesn't works correctly
        this.insertLine();
        this.insertLine("# ******************************************************************************");
        this.insertLine("# * End of script file generated automatically by the '"+ this.services.getExtensionNameDisplayable() +"'.");
        this.insertLine("# * Do not modify this part.");
        this.insertLine("# ******************************************************************************");
        this.insertLine();
        this.insertLine();
        this.services.logSrv( this.toString() + "\tgenerate footer of the script");
    },

    /*
     * Encode the notification message to add in the header of generated script file.
     * Translate not displayable char to text like \n\r to <LF><CR>.
     * @param (string) notification Message to encode
     * @return (string) Encoded notification message.
     */
    encodeNotification : function(notification)
    {
        var encodedText = "";
        var _item=notification.split("");
        for(var i=0;i<_item.length;i++)
        {
            if(_item[i]=='\t')
            {
                encodedText += "<TAB>" ;
            }
            else if(_item[i]=='\r')
            {
                encodedText += "<CR>" ;
            }
            else if(_item[i]=='\n')
            {
                encodedText += "<LF>" ;
            }
            else
                encodedText += _item[i];
        }
        return encodedText;
    },


    /*
     * Insert text to script core object string and add ; with LF.
     * @param (string) Test to insert in the final script core
     * @param (boolean) Indicate if new line will insert
    */
    insertLine : function( text, newLine )
    {
        if(text == undefined){
            text = "";
            newLine = true;
        }
        if(newLine == undefined){
            newLine = true;
        }
        this.scriptCore += (text);
        if(newLine == true){
            this.scriptCore += ("\n");
        }
    },

    /**
        Decode the text from script core object string.
        @return (boolean) result Indicate the result of the script parsing.
    */
    parseScriptCore : function()
    {
        // TODO Not need to use
    },

    /**
        Retrieve the script file name definition from preference settings
        @return (string) Script file name.
    */
    getScriptName : function()
    {
        if( this.scriptName == null ){
            try {
                this.scriptName = this.services.preferences.getCharPref(globalServices.getExtensionKey()+"scriptFileName");
            } catch (e) {}
        }
        return this.scriptName;
    },

    /**
        Retrieve the notification subject definition from preference settings
        @return (string) Notification subject.
    */
    getNotificationSubject : function()
    {
        if( this.notificationSubject == null ){
            try {
                this.notificationSubject = this.services.preferences.getCharPref(globalServices.getExtensionKey()+"notificationSubject");
            } catch (e) {}
        }
        return this.notificationSubject;
    },

    /**
        @TODO
        @return (string) fromAddresses containing the address from the redirection
    */
    readPreferenceFromAddresses : function()
    {
        this.services.logSrv( 'OutOfOfficeSettings.readPreferenceFromAddresses' );

        try
        {
            fa = gPreference.getCharPref( this.prefURI + "." + this.CONST_KEYWORD_FROMADDRESSES ).trim();

            if( fa == '' )
            {
                for( id = 1; id < 10; id++ ) // an arbitrary number, make sure it is big enough but not insanely big
                {
                    if( this.prefs.charPrefExist( 'mail.account.account' + id + '.server' ) )
                    {
                        server = gPreference.getCharPref( 'mail.account.account' + id + '.server' );

                        if( gOutOfOfficeManager.account.getImapKey() != server )
                            continue;

                        if( !this.prefs.charPrefExist( 'mail.account.account' + id + '.identities' ) )
                        {
                            fa = gOutOfOfficeManager.account.getDescription();
                            break;
                        }
                        else
                        {
                            ids = gPreference.getCharPref( 'mail.account.account' + id + '.identities' ).split( ',' );

                            for( i in ids )
                                fa += gPreference.getCharPref( 'mail.identity.' + ids[ i ] + '.useremail' ) + ', ';

                            fa = fa.slice( 0, -2 );
                        }
                    }
                }
            }

            this.setFromAddresses( fa );
            this.services.logSrv( 'fromAddresses: ' + fa );
        }
        catch(e)
        {
            this.setFromAddresses( gOutOfOfficeManager.account.getDescription() );
            this.services.logSrv( this.toString() + "Set fromAddresses to default value (account description)" );
        }
    },

    /**
        @TODO
        @return (boolean) redirectionEnable containing the activation status of redirection
    */
    readPreferenceRedirection : function()
    {
        try {
            var valueToRead = this.prefURI+ "." +this.CONST_KEYWORD_REDIRECTION + ".enabled";
            this.setRedirection( gPreference.getBoolPref(valueToRead) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getRedirection());
        }
        catch(e) {
            this.setRedirection(  false );
            this.services.logSrv( this.toString() + "Set redirectionEnable to default value (false)" );
        }
    },

    /**
        @TODO
        @return (string) redirectionDestinationAddress containing the address of the redirection
    */
    readPreferenceRedirectionAddress : function()
    {
        try {
            var valueToRead = this.prefURI+ "." +this.CONST_KEYWORD_REDIRECTIONADDRESS;
            this.setRedirectionAddress( gPreference.getCharPref(valueToRead) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getRedirectionAddress() );
        }
        catch(e) {
            this.setRedirectionAddress( "" );
            this.services.logSrv( this.toString() + "Set redirectionDestinationAddress to default value (empty string)" );
        }
    },

    /**
        @TODO
        @return (boolean) redirectionKeepMessage containing the keep message status of redirection
    */
    readPreferenceRedirectionKeepMessage : function()
    {
        try {
            var valueToRead = this.prefURI+ "." +this.CONST_KEYWORD_KEEPMESSAGE + ".enabled";
            this.setRedirectionKeepMessage( gPreference.getBoolPref(valueToRead) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getRedirectionKeepMessage() );
        }
        catch(e) {
            this.setRedirectionKeepMessage( false );
            this.services.logSrv( this.toString() + "Set redirectionKeepMessage to default value (false)" );
        }
    },

    /**
        @TODO
        @return (boolean) notificationEnable containing the activation status of notification
    */
    readPreferenceNotification : function()
    {
        try {
            var valueToRead = this.prefURI+ "." +this.CONST_KEYWORD_NOTIFICATION + ".enabled";
            this.setNotification( gPreference.getBoolPref(valueToRead) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getNotification() );
        }
        catch(e) {
            this.setNotification( false );
            this.services.logSrv( this.toString() + "Set notificationEnable to default value (false)" );
        }
    },

    readPreferenceFromAddressesEnabled : function()
    {
        try
        {
            var valueToRead = this.prefURI + "." + this.CONST_KEYWORD_FROMADDRESSES + ".enabled";
            this.setFromAddressesEnabled( gPreference.getBoolPref( valueToRead ) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getFromAddressesEnabled() );
        }
        catch( e )
        {
            this.setFromAddressesEnabled( false );
            this.services.logSrv( this.toString() + "Set fromAddressesEnabled to default value (false)" );
        }
    },

    /**
        @TODO
        @return (string) notificationMessage containing the notification message
    */
    readPreferenceNotificationMessage : function()
    {
        try {
            var valueToRead = this.prefURI+ "." +this.CONST_KEYWORD_NOTIFICATIONMESSAGE;
            this.setNotificationMessage( gPreference.getCharPref(valueToRead) );
            this.services.logSrv( this.toString() + valueToRead + "=" + this.getNotificationMessage());
        }
        catch(e) {
            this.setNotificationMessage( "" );
            this.services.logSrv( this.toString() + "Set notificationMessage to default value (empty string)" );
        }
    },

    /**
        Read settings parameter from preferences
    */
    read : function()
    {
        this.services.logSrv( 'OutOfOfficeSettings.read' );

        if( this.prefURI == null ){
            throw  this.toString() + "Preference URI cannot be null to read preference parameters";
        }

        this.services.logSrv( this.toString() + "read preferences...");
        this.readPreferenceFromAddressesEnabled();
        this.readPreferenceFromAddresses();
        this.readPreferenceRedirection();
        this.readPreferenceRedirectionAddress();
        this.readPreferenceRedirectionKeepMessage();
        this.readPreferenceNotification();
        this.readPreferenceNotificationMessage();
        this.services.logSrv( this.toString() + "read preferences ended");
    },

    /**
        Save settings parameter to preferences
    */
    save : function()
    {
        if( this.prefURI == null )
        {
            throw this.toString() + "Preference URI cannot be null to save preference parameters";
        }

        this.services.logSrv( this.toString() + "save preferences" );

        gPreference.setBoolPref(this.prefURI+ "." +this.CONST_KEYWORD_REDIRECTION + ".enabled", this.getRedirection());
        gPreference.setBoolPref(this.prefURI+ "." +this.CONST_KEYWORD_FROMADDRESSES + ".enabled", this.getFromAddressesEnabled() );
        gPreference.setCharPref(this.prefURI+ "." +this.CONST_KEYWORD_FROMADDRESSES, this.getFromAddresses());
        gPreference.setCharPref(this.prefURI+ "." +this.CONST_KEYWORD_REDIRECTIONADDRESS, this.getRedirectionAddress());
        gPreference.setBoolPref(this.prefURI+ "." +this.CONST_KEYWORD_KEEPMESSAGE + ".enabled", this.getRedirectionKeepMessage());
        gPreference.setBoolPref(this.prefURI+ "." +this.CONST_KEYWORD_NOTIFICATION + ".enabled", this.getNotification());
        gPreference.setCharPref(this.prefURI+ "." +this.CONST_KEYWORD_NOTIFICATIONMESSAGE, this.getNotificationMessage());
    }

} // class


/*
 * @class This Class is to manage the configuration from user interface
 * @version 0.1.0
 * @author Olivier Brun - BT Global Services / Etat francais Ministere de la Defense
 * @constructor
 * @param {object} SieveAccount account source
 */

function OutOfOfficeManager(account) {

    this.CONST_HEADER = new String("OutOfOfficeManager: "); // for trace

    // @TODO To check Can be null
     if (account == undefined ){
        // throw  FILE_HEADER + "Account cannot be null";
        account = null;
    }

    /*
     * account to configure
     * @type SieveAccount
     */
    this.account = account;
    /*
     * Object to access to global service (Log, ...)
     * @type Services
     */
    this.services = new Services();
    /*
     * OutOfOffice settings parameters built read the script from the Sieve server or
     * set by the user with the interface.
     * @type OutOfOfficeSettings
     */
    this.settings = new OutOfOfficeSettings(this.services);
    /*
     * OutOfOffice sieve server object. Manage connection and communication between
     * server and client.
     * @type OutOfOfficeSieveServer
     * */
    this.sieveServer = null;
    this.loadClass();
    this.services.logSrv( this.toString() + "Constructor.");
}

OutOfOfficeManager.prototype = {

    /*
     * Return the name of the class initialized in CONST_HEADER variable.
     * This function overload the 'toString' standard function from Javascript Object.
     *
     * @return (string) CONST_HEADER containing class name.
     */
    toString : function()
    {
        if( this.CONST_HEADER == undefined || this.CONST_HEADER == null ){
            return "OutOfOfficeManager: Invalid String"; // Error
        }
        return this.CONST_HEADER;
    },

    /**
        Load all the Libraries we need.
    */
    loadClass : function()
    {
        // Load all the Libraries we need...
        var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveAccounts.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/Sieve.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveRequest.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponse.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponseParser.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveResponseCodes.js");
        jsLoader.loadSubScript("chrome://out_of_office/content/editor/OutOfOfficeSieveServer.js");
    },

    /*
     * Reset attributes
     */
    reset : function()
    {
        this.account = null;
        this.sieveServer = null;
    },

    /*
     * Initialize OutOfOfficeManager
     */
    initialize : function()
    {
        this.services.logSrv( 'OutOfOfficeManager.initialize' );

        if (this.account == null){
            throw  this.toString() + "initialize:Account cannot be null";
        }
        if( this.settings == null ) {
            // throw this.toString() + "ERROR : The object settings is null, unable to continue";
            return null;
        }

        this.services.logSrv( this.toString() + "initialize");
        this.settings.initialize( this.account.getUri() );
    },

    /*
     * Initialize script status from server for each account
     * TODO This function is not used
     */
    initializeScriptStatus : function(accountList)
    {
        if (accountList == null){
            throw  this.toString() + "initialize:Account cannot be null";
        }
        this.services.logSrv( this.toString() + "initializeScriptStatus");
        for(var count= 0; count<accountList.length; count++)
        {

        }
    },


    /*
     * Connect to Sieve server.
     * @param (object) account Sieve server account settings
     */
    connectServer : function(account, bActivateScript)
    {
        if (account == undefined || account == null){
            throw this.toString() + "connectServer:Account cannot be null";
        }

        // Disable and cancel if account is not enabled
        if( account.isEnabled() == false )
        {    // If we have this message it is a conflict with Sieve extension
            this.services.warningSrv( this.toString() + "Unable to connect to Sieve server. This Sieve server is disabled." );
            postStatusMessage(this.services.localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.inactive;") );
            postStatusAndUpdateUI( account.isEnabledOutOfOffice() );
            this.reset();
            return;
        }

        if( account.getHost().getHostname() == null || account.getHost().getHostname() == "" )
        {
            // nothing to do the hostname must be define in the Sieve server settings.
            this.services.warningSrv( this.toString() + "Unable to connect to Sieve server. Invalid Sieve server settings. The host name cannot be empty." );
            postStatusMessage(this.services.localizeString( "out_of_office_locale.properties", "&outofoffice.connection.status.badsettings;") );
            postStatusAndUpdateUI( account.isEnabledOutOfOffice() );
            this.reset();
            return;
        }

        if( bActivateScript == true )
            account.setEnabledOutOfOffice( !account.isEnabledOutOfOffice() );
        else
            bActivateScript = false; // Always set to false if equal to null or undefined

        if( this.account == account )
        {
            this.services.logSrv( this.toString() + "connectServer Already connected.");

            if (bActivateScript == true)
            {
                this.services.logSrv( this.toString() + "connectServer Try to set the script to active=" + this.account.isEnabledOutOfOffice() );
                this.activate(this.account.isEnabledOutOfOffice());
            }
            else
                this.services.logSrv( this.toString() + "connectServer Script activation not requested." );

            return ; // already connected
        }

        this.account = account;
        this.services.logSrv( this.toString() + "connectServer Try to connect to '" + this.account.getHost().getHostname() + "' user '" + this.account.getUri() + "'.");
        this.sieveServer = new OutOfOfficeSieveServer(this.account, this.services, this.settings, bActivateScript);
    },

    /*
     * Disconnect Sieve server.
     */
    disconnectServer : function()
    {
        this.services.logSrv( this.toString() + "disconnectServer.");
        if( this.sieveServer != null ){
            this.sieveServer.disconnect();
            delete this.sieveServer;
        }
        this.reset();
    },

    /*
     * Reconnect to a different Sieve server. This function manage the disconnect before try to connect to another server account.
     * @param (object) account Sieve server account settings
     */
    reConnectServerTo : function(account, bActivateScript)
    {
        this.services.logSrv( this.toString() + "reConnectServerTo with activation=" + bActivateScript);
        this.connectServer(account, bActivateScript);
    },

    /*
     * Load user parameters to account configuration preferences.
     */
    loadSettings : function(parent)
    {
        if (this.sieveServer == null){
            throw this.toString() + "loadSettings:Sieve server object cannot be null";
        }
        this.initialize();
        this.sieveServer.loadScript(parent);
    },

    /*
     * Save user parameters to account configuration preferences.
     */
    saveSettings : function()
    {
        if( this.settings == null ) {
            // throw this.toString() + "ERROR : The object settings is null, unable to continue";
        }
        this.services.logSrv( this.toString() + "saveSettings");

        this.getSettings().getFormatedScript();
        this.getSettings().save(); // Save parameters to Thunderbird configuration
        this.sieveServer.saveScript();

    },

    /*
     * Activate settings on the server by creating symbolic link
     * @param (boolean) Activate script when true
     */
    activate : function(active)
    {
        if (this.account == null){
            // throw this.toString() + "activate:Account cannot be null";
            this.services.warningSrv( this.toString() + "activate:Account cannot be null" );
            return; //not initialized (possible while window is loading)
        }
        if( this.settings == null ) {
            // throw this.toString() + "ERROR : The object settings is null, unable to continue";
            this.services.warningSrv( this.toString() + "activate:The object settings is not initialized, unable to continue" );
            return null;
        }
        if( this.sieveServer == null ) {
            this.services.warningSrv( this.toString() + "activate:The Sieve server is not initialized, unable to continue" );
            return ;
        }
        this.services.logSrv( this.toString() + "activate(" + active + ")" );
        this.sieveServer.activateScript(active);
    },

    /*
     * Keep Alive
     */
    keepAlive : function()
    {
        if( this.sieveServer == null ) {
            return ;
        }
        this.services.logSrv( this.toString() + "keepAlive.");
        this.sieveServer.keepAlive();
    },

    /*
     * Retrieve settings after read and decode sieve script from cyrus sieve server
     * @return (object) OutOfOfficeSettings
     */
    getSettings : function()
    {
        if( this.settings == null ) {
            // throw this.toString() + "ERROR : The object settings is null, unable to continue";
            return null;
        }
        // DEBUG this.services.logSrv( this.toString() + "getSettings");
        return this.settings;
    },

}
