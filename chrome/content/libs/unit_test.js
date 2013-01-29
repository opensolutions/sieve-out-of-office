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
	@fileoverview Unit Test - Provide unit test definition for Out of Office extension - Require MozLab add-ons
	@author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
*/

/**
 * External object from MozLab add-ons library to perform unit test
 */
var TestCase = mozlab.mozunit.TestCase;
var assert = mozlab.mozunit.assertions;


/**
 * Library loader to include objects and data to perform unit test
 */
var jsLoader =  Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
/**
 * Include library files
 */
jsLoader.loadSubScript("chrome://out_of_office/content/libs/preferences.js");
jsLoader.loadSubScript("chrome://out_of_office/content/libs/misc.js");
jsLoader.loadSubScript("chrome://out_of_office/content/libs/unit_test_data.js");

/**
 * Global variables
 */
var globalServices=new Services();
var preferences=new Preferences();

/**
 * Unit test variables
 */
var tc_Preferences = new TestCase('Preferences');
var tc_arrayDataValidation= new TestCase('Unit Test Array Validation (' + arrayAddressMail.length + ' entries)' );
var tc_mailAddressValidation= new TestCase('Mail Address Validation (' + arrayAddressMail.length + ' entries)' );
var tc_mailAddressExtraction= new TestCase('Mail Address Extraction (' + arrayAddressMail.length + ' entries)' );


/**
 * 	Compare two arrays
 * 	@param {array} array1
 * 	@param {array} array2
 * 	@private
 * 	@return {boolean} true if arrays are equals
 */
function compareArrays(array1,array2) {
		// if is not an Array
		if (typeof(array1)!="object" || typeof(array2)!="object") return false;
		if (!(array1 instanceof Array) || !(array2 instanceof Array)) return false;
		// compare length
		if (array1.length != array2.length)
			return false;
		for (var i=0; i<array1.length ; i++)
			if (array1[i]!=array2[i]) return false;
		return true;
}

/**
 * Global function to validate the unit test of mail address
 * @param address Mail address to test
 * @param result Waiting result after check of the mail address 
 * @return nothing
 */
function checkAndTraceAndAssert(index, label, address, waitingResult) {
	// alert(index + ":" +address+">>>" +globalServices.isAddressMailValid( address )+ " must be " + result);
	
	// globalServices.logSrv( "**********************************************************************" );
	// globalServices.logSrv( "Unit Test check address:'" + address + "' index=" + index + " begin..." );
	
	// prepare display trace message 
	var message = " : Mail Validation '" + label + "' index=" + index + " waitingResult:'" + waitingResult + "' data:'" + address + "'." ;
	
	var result = globalServices.isAddressMailValid( address );
/**
 * Debug part remove comment to have more information
	if( result != waitingResult ) {
		// Dump the entry on error
		globalServices.logSrv( "Unit Test Error" + message );
		globalServices.errorSrv( "Unit Test Error" + message );
	} else {
		// Dump the entry on error
		globalServices.logSrv( "Unit Test Success" + message );
	}
 */

	assert.isTrue( result == waitingResult );
}


/**
	Preferences unit test
	@see Preferences
*/
tc_Preferences.tests = {

	'charPrefExist': function() {
		assert.isTrue(preferences.charPrefExist("mailnews.customDBHeaders")); //true
		assert.isFalse(preferences.charPrefExist("noExist")); // false
	},

	'createCharPref': function() {
		assert.isTrue(preferences.createCharPref(keyCharTest)); // true
		assert.isTrue(preferences.charPrefExist(keyCharTest)); //true
	},
	'addWordIfNotExist wordExist': function() {
		// add
		for (var i=0 ; i < wordList.length ; i++)
		{
			assert.isTrue(preferences.addWordIfNotExist(keyCharTest,wordList[i])); //true
			// test if exist
			for (var j=0 ; j <= i ; j++) {
				assert.isTrue(preferences.wordExist(keyCharTest,wordList[j])); //true
			}
		}
	},
	'getCharPrefFromKey': function() {
		// get an array
		var myTab=preferences.getCharPrefFromKey(keyCharTest);
		// test length
		assert.equals(myTab.length,wordList.length);
		// test equal
		for (var i=0 ; i < myTab.length ; i++) {
			assert.equals(myTab[i],wordList[i]);
		}
	},

	'removeWord wordExist': function() {
		//now remove
		for (var i=0 ; i < wordList.length ; i++)
		{
			assert.isTrue(preferences.removeWord(keyCharTest,wordList[i])); //true
			for (var j=0 ; j < wordList.length ; j++) {
				// test if exist (or not)
				if (j<=i)
					assert.isFalse(preferences.wordExist(keyCharTest,wordList[j])); //false
				else
					assert.isTrue(preferences.wordExist(keyCharTest,wordList[j])); //true
			}
		}
	},

	'setCharPref getCharPref': function() {
		var val="unittest";
		assert.isTrue(preferences.setCharPref(keyCharTest,val)); //true
		assert.equals(preferences.getCharPref(keyCharTest),val); //true
	},

	'setBoolPref getBoolPref': function() {
		var val=true;
		assert.isTrue(preferences.setBoolPref(keyBoolTest,val)); //true
		assert.equals(preferences.getBoolPref(keyBoolTest),val); //true
	},

	'boolPrefExist': function() {
		assert.isTrue(preferences.boolPrefExist(keyBoolTest)); //true
		assert.isFalse(preferences.boolPrefExist("noExist")); //false
	},

	'setIntPref getIntPref': function() {
		var val=575;
		assert.isTrue(preferences.setIntPref(keyIntTest,val)); //true
		assert.equals(preferences.getIntPref(keyIntTest),val); //true
	},

	'intPrefExist': function() {
		assert.isTrue(preferences.intPrefExist(keyIntTest)); //true
		assert.isFalse(preferences.intPrefExist("noExist")); //false
	},
	

	'clean': function() {
		preferences.pref.clearUserPref (keyCharTest);
		preferences.pref.clearUserPref (keyBoolTest);
		preferences.pref.clearUserPref (keyIntTest);
		assert.isFalse(preferences.charPrefExist(keyCharTest)); // false
		assert.isFalse(preferences.boolPrefExist(keyBoolTest)); // false
		assert.isFalse(preferences.intPrefExist(keyIntTest)); // false
	}
}

//Global Index in the array of address to test 
var _RESULT = 0;
var _ADDR_TEST = 1;
var _ADDR_EXTRACTED = 2;
/**
 * Unit test to validate data from the array
 * If this test abort then the tc_mailAddressExtraction unit test will failed
 */
tc_arrayDataValidation.tests = {
	'arrayDataValidation' : function() { // Check the validity of the array that contain data to Validate and Extract mail address
		for (var index = 0; index < arrayAddressMail.length; index++) {
			if( arrayAddressMail[index][_RESULT] == true ){
				assert.isTrue( arrayAddressMail[index][_ADDR_EXTRACTED] != null );
			} else { // No extraction possible
				assert.isTrue( arrayAddressMail[index][_ADDR_EXTRACTED] == null );
			}
		}
	},
}

/**
 * 	Mail Address Validation (RFC2822) unit test
 */
tc_mailAddressValidation.tests = {
	'AddressMailValidation' : function() { // DisplayName <User@DomainName>, User@DomainName and domaine name as an IP address
		for (var index = 0; index < arrayAddressMail.length; index++) {
			checkAndTraceAndAssert(index, 'arrayAddressMail for validation',  arrayAddressMail[index][_ADDR_TEST], arrayAddressMail[index][_RESULT]);
		}
	},
}

/**
 * 	Mail Address Extraction unit test
 */
tc_mailAddressExtraction.tests = {
	'AddressMailExtraction' : function() { // From table extract mail address if valid with format user@domain.ext
		for (var index = 0; index < arrayAddressMail.length; index++) {
			var address = globalServices.getShortAddressMailFrom(arrayAddressMail[index][_ADDR_TEST] );
			// Check if mail can be valid
			if( arrayAddressMail[index][_RESULT] == true ){
				assert.isTrue( address == arrayAddressMail[index][_ADDR_EXTRACTED] );
			} else { // No extraction possible
				assert.isTrue( address == null );
			}
		}
	},
}
