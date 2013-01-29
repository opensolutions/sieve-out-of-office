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
 * The Original Code is Mozilla Communicator
 * 
 * The Initial Developer of the Original Code is
 *    Daniel Rocher <daniel.rocher@marine.defense.gouv.fr>
 *       Etat francais Ministere de la Defense
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 * 
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the LGPL or the GPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */


/**
	@fileoverview Preferences - This file implements the class Preferences
	@author Daniel Rocher / Etat francais Ministere de la Defense
*/



/**
	@class This Class provides methods to get and set preferences
	@version 0.9.0
	@author Daniel Rocher / Etat francais Ministere de la Defense
	@constructor
*/


function Preferences() {
	/**
		a nsIPrefBranch object
		@type nsIPrefBranch
	*/
	this.pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
}


Preferences.prototype = {
	/**
		regular expression cache
	*/
	regExpCache: { "removeEOL": new RegExp('\\n','g'),
		"removeCR": new RegExp('\\r','g'),
		"trim": new RegExp("(?:^\\s*)|(?:\\s*$)","g"),
		"findWhitespace": new RegExp("(\\s)+","g")
		},

	/**
		Test if key for char value exist
		@param {string} key
		@return {boolean} <b>true</b> if key exist
	*/
	charPrefExist : function(key) {
		try {
			this.pref.getCharPref(key);
			return true;
		}
		catch(e) {
			return false;
		}
	},

	/**
		Test if key for boolean value exist
		@param {string} key
		@return {boolean} <b>true</b> if key exist
	*/
	boolPrefExist : function(key) {
		try {
			this.pref.getBoolPref(key);
			return true;
		}
		catch(e) {
			return false;
		}
	},

	/**
		Test if key for integer value exist
		@param {string} key
		@return {boolean} <b>true</b> if key exist
	*/
	intPrefExist : function(key) {
		try {
			this.pref.getIntPref(key);
			return true;
		}
		catch(e) {
			return false;
		}
	},

	/**
		Create a Char preference
		@param {string} key
		@return {boolean} <b>true</b> if Successful process
	*/
	createCharPref : function(key) {
		return this.setCharPref(key,"");
	},

	/**
		Set a Char preference
		@param {string} key
		@param {string} val value
		@return {boolean} <b>true</b> if Successful process
	*/
	setCharPref : function(key,val) {
		try {
			this.pref.setCharPref(key,val);
		} catch(e) {
			return false;
		}
		return true;

	},

	/**
		get a Char preference
		@param {string} key
		@return {string} value or an empty string if this key doesn't exist
	*/
	getCharPref : function(key) {
		var val="";
		try {
			val=this.pref.getCharPref(key);
		} catch(e) {
			val="";
		}
		return val;
	},

	/**
		Set a Boolean preference
		@param {string} key
		@param {boolean} val value
		@return {boolean} <b>true</b> if Successful process
	*/
	setBoolPref : function(key,val) {
		try {
			this.pref.setBoolPref(key,val);
		} catch(e) {
			return false;
		}
		return true;

	},

	/**
		get a Boolean preference
		@param {string} key
		@return {boolean} value
	*/
	getBoolPref : function(key) {
		var val=false;
		try {
			val=this.pref.getBoolPref(key);
		} catch(e) {
			val=false;
		}
		return val;
	},

	/**
		Set an Integer preference
		@param {string} key
		@param {number} val value
		@return {boolean} <b>true</b> if Successful process
	*/
	setIntPref : function(key,val) {
		try {
			this.pref.setIntPref (key,val);
		} catch(e) {
			return false;
		}
		return true;

	},

	/**
		get an Integer preference
		@param {string} key
		@return {number} value
	*/
	getIntPref : function(key) {
		var val=0;
		try {
			val=this.pref.getIntPref(key);
		} catch(e) {
			val=0;
		}
		return val;
	},

	/**
		Get Char preference from key
		<p>
		Example:
		<pre>
		// extensions.myextension.mykey = "word1 word2 word3"
		getCharPrefFromKey("extensions.myextension.mykey");
		// return array word1,word2,word3
		</pre>
		@param {string} key
		@return {Array} A values list or null if key doesn't exist
	*/
	getCharPrefFromKey : function(key) {

		var allValues = "";
		var myArray=new Array();
		try {
			allValues=this.pref.getCharPref(key);
		}
		catch(e) {
			return null;
		}

		// no value
		if (allValues == "")
			return new Array();
		// remove whitespace characters and split
		myArray=(allValues.replace(this.regExpCache.findWhitespace," ").replace(this.regExpCache.trim, "")).split(/\s/);
		return myArray;
	},

	/**
		Remove a word in value string
		<p>
		Example:
		<pre>
		// extensions.myextension.mykey = "word1 word2 word3"
		removeWord("extensions.myextension.mykey","word2")
		// extensions.myextension.mykey = "word1 word3"
		</pre>
		@param {string} key
		@param {string} word Word to remove
		@return {boolean} <b>true</b> if Successful process
	*/
	removeWord : function(key,word) {
		var oldValues = "";
		var newValues = "";
		try {
			oldValues=this.pref.getCharPref(key);
		}
		catch(e) {
			return false;
		}
		newValues=oldValues.replace(word,"");
		// remove whitespace characters
		newValues=newValues.replace(this.regExpCache.findWhitespace," ").replace(this.regExpCache.trim, "");
		// change Value
		try {
			this.pref.setCharPref(key,newValues);
		} catch(e) {
			return false;
		}
		return true;
	},

	/**
		test if a word exist in value string
		<p>
		Example:
		<pre>
		// extensions.myextension.mykey = "word1 word2 word3"
		wordExist("extensions.myextension.mykey","word3")
		// return true
		</pre>
		@param {string} key
		@param {string} word Word to test
		@return {boolean} <b>true</b> if word exist
	*/
	wordExist : function(key,word) {
		var myValue="";
		try {
			myValue=this.pref.getCharPref(key);
		}
		catch(e) {
			return false;
		}
		var myExp=new RegExp("(^| )"+word+"( |$)","g");
		return myExp.test(myValue);
	},

	/**
		add a word in value string if not exist
		If key doesn't exist, it's created.
		<p>
		Example:
		<pre>
		// extensions.myextension.mykey = "word1 word2 word3"
		addWordIfNotExist("extensions.myextension.mykey","word4")
		// extensions.myextension.mykey = "word1 word2 word3 word4"
		</pre>
		@param {string} key
		@param {string} word Word to add
		@return {boolean} <b>true</b> if Successful process
	*/
	addWordIfNotExist : function(key,word) {
		var oldValues = "";
		var newValues = "";
		// test if word exist
		if (this.wordExist(key,word))
			return true; //nothing to do

		try {
			oldValues=this.pref.getCharPref(key);
		}
		catch(e) {} // nothing to do

		newValues=((oldValues.length > 0) ? oldValues+" " : "") + word;
		// remove whitespace characters
		newValues=newValues.replace(this.regExpCache.findWhitespace," ").replace(this.regExpCache.trim, "");

		// change Value
		try {
			this.pref.setCharPref(key,newValues);
		} catch(e) {
			return false;
		}
		return true;
	}
}


