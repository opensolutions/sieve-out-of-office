/*
 * The contents of this file is licenced. You may obtain a copy of
 * the license at http://sieve.mozdev.org or request it via email
 * from the author. Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */
// we don't want to pollute the global namespace more than necessay.
var gSivExtUtils =
{

  /**
   * Opens the Account Manager and selects the page to configure sieve
   * settings and preferences.
   *
   * @param {nsIMsgIncomingServer}
   *   the server which should be configured, can be null.
   */
  OpenSettings : function( server )
  {
        var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService( Components.interfaces.nsIWindowMediator );
        var existingAccountManager = windowManager.getMostRecentWindow( "mailnews:accountmanager" );

        if( existingAccountManager )
        {
            existingAccountManager.focus();
            return;
        }

        var options = {};

        if( server == null )
            server = this.GetActiveServer();

        if( server != null )
            options = { server: server, selectPage: 'am-sieveserver.xul' };

        window.openDialog(  "chrome://messenger/content/AccountManager.xul",
                            "AccountManager",
                            "chrome,centerscreen,titlebar,modal",
                            options
                         );
  },

  /**
   * Retrieves the currently focused nsIMsgIncomingServer object. If the user
   * has not focused an server, it returns the default. In case no Server is
   * configured, null is returned.
   *
   * @return {nsIMsgIncomingServer}
   *   the active server or null
   */
  GetActiveServer : function()
  {
    // this function depends on funtions of the overlayed message window...
    if (typeof(GetFirstSelectedMsgFolder) == "undefined")
        return null;

    // As we can access message window functions, we can try to retrieve...
    // ... the currently selected message account
    var server = null;
    var folder = GetFirstSelectedMsgFolder();

    if (folder)
      server = folder.server;
    else
      server = accountManager.defaultAccount.incomingServer;

    if ((server.type == "imap") || (server.type == "pop3"))
      return server;

    return null;
  }

}


