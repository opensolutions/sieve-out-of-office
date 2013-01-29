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
 *   Prin JC (jisse44)
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

/* Created with Mozilla documentation:
https://developer.mozilla.org/en/XPCOM_Interface_Reference/NsIMsgAccountManagerExtension/Building_an_Account_Manager_Extension?action=edit
*/


const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;


//class constructor
function SieveAccountManagerExtension() {};

// class definition
SieveAccountManagerExtension.prototype = 
{
  classID : Components.ID("{717489b0-7d88-11dd-ad8b-0800200c9a66}"),
  contactID : "@mozilla.org/accountmanager/extension;1?name=sieveserver",
  classDescription: "OutOfOffice Account Manager Extension Service",
  
  name : "sieveserver",  
  chromePackageName : "out_of_office",
  showPanel: function(server) 
  {
    if (server.type == "imap")
      return true;
      
    if (server.type == "pop3")
      return true;
      
    return false;
  },

  QueryInterface: function(aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIMsgAccountManagerExtension) 
      && !aIID.equals(Components.interfaces.nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

// ************************************************************************** //

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.


* @deprecated since Gecko 2.0 
*/
var SieveAccountManagerExtensionFactory = 
{
  createInstance : function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
      
    return (new SieveAccountManagerExtension()).QueryInterface(aIID);
  }
}

/**
 * module definition (xpcom registration)
 *
 * @deprecated since Gecko 2.0 
 */
var SieveAccountManagerExtensionModule = 
{
  registerSelf: function(compMgr, fileSpec, location, type)
  {
    compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
    compMgr.registerFactoryLocation(
        SieveAccountManagerExtension.prototype.classID, 
        SieveAccountManagerExtension.prototype.classDescription,
        SieveAccountManagerExtension.prototype.contactID,
        fileSpec, location, type);
        
    var catMgr = Components.classes["@mozilla.org/categorymanager;1"]
                     .getService(Ci.nsICategoryManager);
               
    catMgr.addCategoryEntry(
        "mailnews-accountmanager-extensions",
        SieveAccountManagerExtension.prototype.classDescription,
        SieveAccountManagerExtension.prototype.contactID,
        true, true);    
  },

  unregisterSelf: function(compMgr, location, type)
  {
    compMgr = compMgr.QueryInterface(Ci.nsIComponentRegistrar);
    compMgr.unregisterFactoryLocation(
        SieveAccountManagerExtension.prototype.classID, location);
    
    var catMgr = Components.classes["@mozilla.org/categorymanager;1"]
                     .getService(Ci.nsICategoryManager);
    catMgr.deleteCategoryEntry(
        "mailnews-accountmanager-extensions",
        SieveAccountManagerExtension.prototype.contactID, true);    
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Ci.nsIFactory))
      throw Cr.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(SieveAccountManagerExtension.prototype.classID))
      return SieveAccountManagerExtensionFactory;

    throw Cr.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

/***********************************************************
module initialization

When the application registers the component, this function
is called.
***********************************************************/

try
{
  Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
}
catch (e) { }

// Gecko 2.x uses NSGetFactory to register XPCOM Components...
// ... while Gecko 1.x uses NSGetModule


if ((typeof(XPCOMUtils) != "undefined") && (typeof(XPCOMUtils.generateNSGetFactory) != "undefined"))
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([SieveAccountManagerExtension]);
else
  var NSGetModule = function(compMgr, fileSpec) { return SieveAccountManagerExtensionModule; }
