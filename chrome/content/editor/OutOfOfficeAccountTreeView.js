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
 * @fileoverview This is our custom view, based on the <b>Tree View</b> interface
 * @see <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 * @author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
*/

// Load all the Libraries we need...
var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
// includes
jsLoader.loadSubScript("chrome://out_of_office/content/libs/preferences.js");
jsLoader.loadSubScript("chrome://out_of_office/content/libs/misc.js");

/**
 * Global variables
 */
var globalServices=new Services();

/**
 * @class Account list tree view.
 * @constructor
 * @param listener Client of the tree view to receive event.
 */
function OutOfOfficeAccountTreeView(listener)
{
    // includes SieveAccount class
    jsLoader.loadSubScript("chrome://out_of_office/content/libs/libManageSieve/SieveAccounts.js");

    /** @type string */
    this.CONST_HEADER = new String("OutOfOfficeAccountTreeView: "); // for trace
    globalServices.logSrv( this.toString() + "Constructor.");

    /**
     * SieveAccounts object
     *
     * @type SieveAccounts
     */
    this.sieveAccounts = new SieveAccounts();
    /**
     * SieveAccounts list
     *
     * @type Array
     */
    this.accounts = this.sieveAccounts.getAccounts();
    /**
     * SieveAccount number
     *
     * @type integer
     */
    this.rowCount = this.accounts.length;
    /**
     * Client of the tree view
     *
     * @type object
     */
    this.listener = listener;
}

/**
 * Return the name of the class initialized in CONST_HEADER variable.
 * This function overload the 'toString' standard function from Javascript Object.
 *
 * @return (string) CONST_HEADER containing class name.
 */
OutOfOfficeAccountTreeView.prototype.toString
    = function()
{
    if( this.CONST_HEADER == undefined || this.CONST_HEADER == null ){
        return "OutOfOfficeAccountTreeView: Invalid String"; // Error
    }
    return this.CONST_HEADER;
}

/**
 * Update class member.
 * @param (object) rules Not used
 */
OutOfOfficeAccountTreeView.prototype.update
    = function(rules)
{
    this.accounts = this.sieveAccounts.getAccounts();
    this.rowCount = this.accounts.length;
}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getCellValue
    = function(row,column)
{
    return "";
}

/**
 * Provide the label of the selected item to the control view.
 * This label contain:
 *     <ul>
 *        <li>The description of item.
 *        <li>The status of latest access to the Sieve server.
 *    </ul>
 * @param (Integer) row Row selected by the user in the tree view
 * @param (Integer) col Column selected by the user in the tree view
 * @return (String) Label of the selected item
 * @base Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getCellText
    = function(row,column)
{
    //consoleService.logStringMessage(row+"/"+column.id+"/"+column+"/"+column.cycler+"/"+column.type);

    if (column.id == "namecol"){
        var information  = new String("");
        if( this.accounts[row].isEnabled() ){
            if(this.accounts[row].isConnectRequest() == false){
                //information =  " [" + globalServices.localizeString( "out_of_office_locale.properties", "&outofoffice.list.tree.account.norequest;" ) + "]";
            }
        } else {
             //information =  " [" + globalServices.localizeString( "out_of_office_locale.properties", "&outofoffice.list.tree.account.noactivate;" ) + "]";
        }
        return this.accounts[row].getDescription() + information;
    }
    else
        return "";
}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.setTree
    = function(treebox){ this.treebox = treebox; }

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.isContainer
    = function(row){ return false; }

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.isSeparator
    = function(row){ return false; }

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.isSorted
    = function(row){ return false; }

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getLevel
    = function(row){ return 0; }

/**
 * Provide the icon status of the selected item to the control view.
 * This icon can indicate:
 *     <ul>
 *        <li>Connection success and the functionalities are active on the server.
 *        <li>Connection success and the functionalities are inactive on the server.
 *        <li>Connection not yet establish.
 *        <li>Connection failed and the account has been deactivated.
 *    </ul>
 * @param (Integer) row Row selected by the user in the tree view
 * @param (Integer) col Column selected by the user in the tree view
 * @return (String) Chrome path to the image file.
 * @base Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getImageSrc
    = function(row,column)
{
    if (column.id == "namecol")
        return null;

    if( this.accounts[row].isEnabled() )
    {
        if( this.accounts[row].isConnectRequest() )
        {
            if (this.accounts[row].isEnabledOutOfOffice())
            {
                return "chrome://out_of_office/content/images/out_of_office_active.png";
            }
            else
                return "chrome://out_of_office/content/images/out_of_office_inactive.png";
        }
        return "chrome://out_of_office/content/images/out_of_office_not_connected.png";
    }
    return  "chrome://out_of_office/content/images/out_of_office_connect_failed.png";
}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getRowProperties
    = function(row,props){}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getCellProperties
    = function(row,col,props){}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.getColumnProperties
    = function(colid,col,props){}

/**
 * Mozilla treeview documentation <li>http://www.xulplanet.com/references/xpcomref/ifaces/nsITreeView.html</li>
 */
OutOfOfficeAccountTreeView.prototype.cycleHeader
    = function(col){}

/**
 * Called on the view when a cell is clicked
 * @param (integer) row Row selected by the user in the tree view
 * @param (integer) col Column selected by the user in the tree view
 */
OutOfOfficeAccountTreeView.prototype.cycleCell
    = function(row, col)
{    // check if a connection is running
    globalServices.logSrv(this.toString() + "cycleCell");
    if( this.listener.onCycleCellActivate(this, row) == true ){
        this.selection.select(row);
    }else{
        globalServices.logSrv(this.toString() + "Connection active cannot select new item");
    }
}

/**
 * Retrieve current selected account
 * @param (integer) index of the account to retrieve
 * @return (object) @see <b>SieveAccount</b> class object
 */
OutOfOfficeAccountTreeView.prototype.getAccount = function(index)
{
    if( index < 0 || index >= this.accounts.length ){
        return null;
    }
    return this.accounts[index];
}

/**
 * Retrieve the account list
 * @link SieveAccounts.js
 * @return (object) Array of @see <b>SieveAccount</b>  class object
 */
OutOfOfficeAccountTreeView.prototype.getAccountList = function()
{
    return this.accounts;
}

