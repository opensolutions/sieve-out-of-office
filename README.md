# Sieve Out of Office Addon for Thunderbird

This is primarily a project from Trustedbird/Milimail who appear to have stopped supporting it a couple of years ago.

Their original project pages are:

* http://adullact.net/plugins/mediawiki/wiki/milimail/index.php/Trustedbird_Project
* http://www.trustedbird.org/
* http://adullact.net/plugins/mediawiki/wiki/milimail/index.php/Out_of_Office
* https://adullact.net/anonscm/git/milimail/milimail.git


We ([Open Solutions](http://www.opensolutions.ie/) have fixed a significant number of bugs to make it work
with Thunderbird 17 and can confirm that it is working with Dovecot Sieve (2.1.7).


It was and continues to be released under *MPL 1.1/GPL 2.0/LGPL 2.1*.


## Installing

To add this to your Thunderbird you'll need to do the following:

1. Clone the repository

    ```
    git clone https://.../sieve-out-of-office
    ```

2. Create the XPI file

    ```
    cd sieve-out-of-office
    zip -r ../sieve-ooo.xpi *
    ```
    
3. Open the Thunderbird Add-ons page and choose "Install Add-on from file" in the menu and select the XPI file you created.

## Usage

1. Configure the add-on connection from the account settings.
2. Edit the out-of-office settings from the Tools > Out Of Office Settings menu entry.

At the time of writing this add-on creates a file in the sieve folder named `OutOfOfficeScriptFile.sieve`.  In order to use this you'll need to add this configuration to your default sieve script.  Unfortunately this is currently a manual process and is best done with the [Thunderbird sieve addon](https://github.com/thsmi/sieve/blob/master/nightly/README.md) nightly builds.
