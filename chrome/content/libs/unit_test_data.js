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
 * 	@fileoverview Unit Test Data - This file provides data for unit tests used by the 'unit test' javascript file.
 * 	@author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
 */

/**
 * Data to perform preferences unit test
 */
var wordList = ["erable","chaine","bouleau"];
var keyCharTest="extensions.out_of_office.unittestchar";
var keyBoolTest="extensions.out_of_office.unittestbool";
var keyIntTest="extensions.out_of_office.unittestint";



/**
 * Data to perform Mail Address Validation (RFC2822) unit test
 *
 * 
 * Array definitions:
 * oooSettings.redirectionEnable=true;
 * oooSettings.redirectionDestinationAddress=DisplayName UserName@DomaineName
 * oooSettings.redirectionKeepMessage=true;
 * oooSettings.notificationEnable=true;
 * oooSettings.notificationMessage="Je suis absent pour le moment.\r\n\nRobert.";
 * 
 * 	@author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
 */

var arrayObjectSettings = [ 
/*00*/	[false,"toto@bidon.com",false,false,"Pas là !!!!"], 
/*01*/	[false,"toto@bidon.com",true,false,"Pas là !!!!"], 
/*02*/	[false,"toto@bidon.com",false,true,"Pas là !!!!"], 
/*03*/	[false,"toto@bidon.com",true,true,"Pas là !!!!"], 
/*04*/	[true,"toto@bidon.com",false,false,"Pas là !!!!"], 
/*05*/	[true,"toto@bidon.com",true,false,"Pas là !!!!"], 
/*06*/	[true,"toto@bidon.com",false,true,"Pas là !!!!"], 
/*07*/	[true,"toto@bidon.com",true,true,"Pas là !!!!"], 
/*08*/	[false,null,false,false,"Pas là !!!!"], 
/*09*/	[false,null,true,false,"Pas là !!!!"], 
/*10*/	[false,null,false,true,"Pas là !!!!"], 
/*11*/	[false,null,true,true,"Pas là !!!!"], 
/*12*/	[true,null,false,false,"Pas là !!!!"], 
/*13*/	[true,null,true,false,"Pas là !!!!"], 
/*14*/	[true,null,false,true,"Pas là !!!!"], 
/*15*/	[true,null,true,true,"Pas là !!!!"], 
/*16*/	[false,"toto@bidon.com",false,false,null], 
/*17*/	[false,"toto@bidon.com",true,false,null], 
/*18*/	[false,"toto@bidon.com",false,true,null], 
/*29*/	[false,"toto@bidon.com",true,true,null], 
/*20*/	[true,"toto@bidon.com",false,false,null], 
/*21*/	[true,"toto@bidon.com",true,false,null], 
/*22*/	[true,"toto@bidon.com",false,true,null], 
/*23*/	[true,"toto@bidon.com",true,true,null], 
/*24*/	[false,null,false,false,null], 
/*25*/	[false,null,true,false,null], 
/*26*/	[false,null,false,true,null], 
/*27*/	[false,null,true,true,null], 
/*28*/	[true,null,false,false,null], 
/*39*/	[true,null,true,false,null], 
/*30*/	[true,null,false,true,null], 
/*31*/	[true,null,true,true,null], 
/*32*/	[false,"",false,true,"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>"], 		// 01 Notification Monkey test
/*33*/	[false,"",false,true,"\0&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>"], 	// 02 Notification Monkey test
/*34*/	[false,"",false,true,"I'am not in the office today.\nI will treat your message soon\r\nRegards"], 	// 03 Normal Notification test Lf CrLf
/*35*/	[false,"",false,true,"I'am not in the office today.\rI will treat your message soon\r\nRegards"], 	// 04 Normal Notification test Cr CrLf
/*36*/	[false,"",false,true,"I'am not in the office today.\nI will treat your message soon\r\rRegards"], 	// 05 Normal Notification test Lf CrCr
/*37*/	[false,"",false,true,"I'am not in the office today.\nI will treat your message soon\n\nRegards"], 	// 06 Normal Notification test Lf LfLf
];

/**
 * Data to perform Mail Address Validation (RFC2822) unit test
 *
 * Array definitions:
 * 		Field 0 : Result of the test
 * 		Field 1 : Mail Address to test
 * 		Field 2 : Mail Address extracted ( if Field 0 == true this field must be not null )
 * 
 * 	@author Olivier Brun BT Global Services / Etat francais Ministere de la Defense
 */

var arrayAddressMail = [
/*000*/	[	true,	"USERUSER <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] , 
/*001*/	[	true,	"\"User Of this address\" <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] , 
/*002*/	[	true,	"1 <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*003*/	[	false,	"1\" <USERUSER@test.milimail.org>" ,	null	] ,
/*004*/	[	false,	"\"1 <USERUSER@test.milimail.org>" ,	null	] ,
/*005*/	[	true,	"\"1\"   <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*006*/	[	true,	"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*007*/	[	true,	"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*008*/	[	false,	"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ <USERUSER@test.milimail.org>" ,	null	] ,
/*009*/	[	false,	"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\" <USERUSER@test.milimail.org>" ,	null	] ,
/*010*/	[	false,	"\"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ <USERUSER@test.milimail.org>" ,	null	] ,
/*011*/	[	false,	"USER\"@ABCDEFGHIJKLMNOPQRSTUVWXYZ\" <USERUSER@test.milimail.org>" ,	null	] ,
/*012*/	[	true,	"\"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\" <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*013*/	[	false,	"\"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\"\" <USERUSER@test.milimail.org>" ,	null	] ,
/*014*/	[	true,	" \"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\" <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*015*/	[	true,	" \"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\" <USERUSER@test.milimail.org> " ,	"USERUSER@test.milimail.org"	] ,
/*016*/	[	true,	"  \"USER@ABCDEFGHIJKLMNOPQRSTUVWXYZ\"  <USERUSER@test.milimail.org>   " ,	"USERUSER@test.milimail.org"	] ,
/*017*/	[	false,	"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>\" <USERUSER@test.milimail.org>" ,	null	] ,
/*018*/	[	true,	" USERUSER@test.milimail.org " ,	"USERUSER@test.milimail.org"	] ,
/*019*/	[	true,	" <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*020*/	[	true,	"  <USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*021*/	[	true,	"<USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*022*/	[	true,	"USERUSER@test.milimail.org " ,	"USERUSER@test.milimail.org"	] ,
/*023*/	[	true,	"<USERUSER@test.milimail.org> " ,	"USERUSER@test.milimail.org"	] ,
/*024*/	[	true,	"<USERUSER@test.milimail.org>  " ,	"USERUSER@test.milimail.org"	] ,
/*025*/	[	true,	"  <USERUSER@test.milimail.org>  " ,	"USERUSER@test.milimail.org"	] ,
/*026*/	[	true,	"USERUSER USERUSER@test.milimail.org" ,	"USERUSER@test.milimail.org"	] , 	// Should be translated to 'USERUSER <USERUSER@test.milimail.org>'
/*027*/	[	true,	"USERUSER <<USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] , 
/*028*/	[	true,	"USERUSER <USERUSER@test.milimail.org>>" ,	"USERUSER@test.milimail.org"	] , 
/*029*/	[	true,	"USERUSER <<USERUSER@test.milimail.org>>" ,	"USERUSER@test.milimail.org"	] , 
/*030*/	[	true,	"Glue<USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] , 		// Should be translated to 'Glue <USERUSER@test.milimail.org>'
/*031*/	[	true,	"\"Glue\"<USERUSER@test.milimail.org>" ,	"USERUSER@test.milimail.org"	] ,
/*032*/	[	false,	"\"Glue<USERUSER@test.milimail.org>" ,	null	] ,
/*033*/	[	false,	"Glue\"<USERUSER@test.milimail.org>" ,	null	] ,
/*034*/	[	true,	" USERUSER@test.milimail.org;" ,	"USERUSER@test.milimail.org"	] ,
/*035*/	[	false,	"DisplayName <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@test.milimail.org>" ,	null	] ,
/*036*/	[	false,	"\"Display Name\" <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@test.milimail.org>" ,	null	] ,
/*037*/	[	false,	"DisplayName <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!@test.milimail.org>" ,	null	] ,
/*038*/	[	false,	"\"Display Name\" <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!@test.milimail.org>" ,	null	] ,
/*039*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@test.milimail.org" ,	null	] ,
/*040*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>.org" ,	null	] ,
/*041*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@[test.milimail.org]" ,	null	] ,
/*042*/	[	false,	"DisplayName  &é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@test.milimail.org" ,	null	] ,
/*043*/	[	false,	" &é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>.org" ,	null	] ,
/*044*/	[	false,	"  &é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@[test.milimail.org]" ,	null	] ,
/*045*/	[	true,	" <  USERUSER@test.milimail.org  > " ,	"USERUSER@test.milimail.org"	] ,
/*046*/	[	true,	"USERUSER <USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] , 
/*047*/	[	true,	"\"User Of this address\" <USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] , 
/*048*/	[	false,	"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>\" <USERUSER@[123.124.233.4]>" ,	null	] ,
/*049*/	[	true,	"1 <USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] ,
/*050*/	[	true,	" USERUSER@[123.124.233.4] " ,	"USERUSER@[123.124.233.4]"	] ,
/*051*/	[	true,	" <USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] ,
/*052*/	[	true,	"  <USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] ,
/*053*/	[	true,	"<USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] ,
/*054*/	[	true,	"Glue<USERUSER@[123.124.233.4]>" ,	"USERUSER@[123.124.233.4]"	] ,
/*055*/	[	true,	" USERUSER@[123.124.233.4];" ,	"USERUSER@[123.124.233.4]"	] ,
/*056*/	[	false,	"DisplayName <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>>@[123.124.233.4]" ,	null	] ,
/*057*/	[	false,	"\"Display Name\" <&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>>@[123.124.233.4]" ,	null	] ,
/*058*/	[	false,	"USERUSER@1.2.3.4" ,	null	] ,
/*059*/	[	true,	"USERUSER@[1.2.3.4]" ,	"USERUSER@[1.2.3.4]"	] ,
/*060*/	[	false,	"\"jiminy cricket\"@1.2.3.4" ,	null	] ,
/*061*/	[	false,	"\"jiminy cricket\"@[1.2.3.4]" ,	null	] ,
/*062*/	[	false,	"joe@123.124.233.4]" ,	null	] ,
/*063*/	[	false,	"joe@[123.124.233.4" ,	null	] ,
/*064*/	[	false,	"joe@]123.124.233.4[" ,	null	] ,
/*065*/	[	true,	"joe@[123.124.233.4]" ,	"joe@[123.124.233.4]"	] ,
/*066*/	[	true,	" USERUSER@256.256.256.256 " ,	"USERUSER@256.256.256.256"	] ,
/*067*/	[	false,	" <USERUSER@0.0.0.0>" ,	null	] ,
/*068*/	[	true,	"  <USERUSER@2000.2000.2000.2000>" ,	"USERUSER@2000.2000.2000.2000"	] ,
/*069*/	[	false,	"<USERUSER@2000..2000>" ,	null	] ,
/*070*/	[	false,	"Glue<USERUSER@.2000..2000.>" ,	null	] ,
/*071*/	[	false,	"USERUSER@.20002000." ,	null	] ,
/*072*/	[	false,	"USERUSER@ 20002000 " ,	null	] ,
/*073*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@1.2.3.4" ,	null	] ,
/*074*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>@[123.124.233.4]" ,	null	] ,
/*075*/	[	false,	"joe&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>joe@[123.124.233.4]" ,	null	] ,
/*076*/	[	true,	"USERUSER@test.milimail.org" ,	"USERUSER@test.milimail.org"	] ,
/*077*/	[	false,	"\"jiminy cricket\"@milimail.com" ,	null	] ,
/*078*/	[	true,	"USERUSER@test.milimail.org;" ,	"USERUSER@test.milimail.org"	] ,
/*079*/	[	false,	"USER@123.124.233.4]" ,	null	] ,
/*080*/	[	false,	"USER@[123.124.233.4" ,	null	] ,
/*081*/	[	false,	"USER@]123.124.233.4[" ,	null	] ,
/*082*/	[	true,	"USER@[123.124.233.4]" ,	"USER@[123.124.233.4]"	] ,
/*083*/	[	true,	" USER@[123.124.233.4]" ,	"USER@[123.124.233.4]"	] ,
/*084*/	[	true,	" USER@[123.124.233.4] " ,	"USER@[123.124.233.4]"	] ,
/*085*/	[	true,	"  USER@[123.124.233.4] " ,	"USER@[123.124.233.4]"	] ,
/*086*/	[	true,	"  USER@[123.124.233.4]  " ,	"USER@[123.124.233.4]"	] ,
/*087*/	[	false,	" USERUSER@[256.256.256.256] " ,	null	] ,
/*088*/	[	false,	"  <USERUSER@[2000.2000.2000.2000]>" ,	null	] ,
/*089*/	[	false,	"USER&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>USER@[123.124.233.4]" ,	null	] ,
/*090*/	[	true,	"<USER@[123.124.233.4]>;;" ,	"USER@[123.124.233.4]"	] ,
/*091*/	[	true,	"< USER@[123.124.233.4]>>;;;" ,	"USER@[123.124.233.4]"	] ,
/*092*/	[	true,	"<< USER@[123.124.233.4];;;>>> " ,	"USER@[123.124.233.4]"	] ,
/*093*/	[	true,	"<<  USER@[123.124.233.4] ;>" ,	"USER@[123.124.233.4]"	] ,
/*094*/	[	true,	"<<<  USER@[123.124.233.4]  >>>" ,	"USER@[123.124.233.4]"	] ,
/*095*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<> <user3@[123.124.233.4]>" ,	null	] ,
/*096*/	[	false,	"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>\" <user3@[123.124.233.4]>" ,	null	] ,
/*097*/	[	false,	"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<> <user3@test.milimail.museum>" ,	null	] ,
/*098*/	[	false,	"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!<>\" <user3@test.milimail.museum>" ,	null	] ,
/*099*/	[	false,	"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,;.:/!§!\" <user3@test.milimail.museum>" ,	null	] ,
/*100*/	[	false,	"\"\"&é\"''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?, .:/!§!\" <user3@test.milimail.museum>" ,	null	] ,
/*101*/	[	true,	"\"&é\''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,.:/!§!<>\" <user3@test.milimail.museum>" ,	"user3@test.milimail.museum"	] ,
/*102*/	[	false,	"&é\''(-è_çà)=&~#{[|`\^@]}$£¤*µ*ù%?,.:/!§!<>\" <user3@test.milimail.museum>" ,	null	] ,
/*103*/	[	false,	"user3@test.milimail.f" ,	null	] ,
/*104*/	[	true,	"user3@test.milimail.fr" ,	"user3@test.milimail.fr"	] ,
/*105*/	[	true,	"user3@test.milimail.com" ,	"user3@test.milimail.com"	] ,
/*106*/	[	true,	"user3@test.milimail.zzzz" ,	"user3@test.milimail.zzzz"	] ,
/*107*/	[	true,	"user3@test.milimail.aaaaa" ,	"user3@test.milimail.aaaaa"	] ,
/*108*/	[	true,	"user3@test.milimail.museum" ,	"user3@test.milimail.museum"	] ,
/*109*/	[	true,	"user3@test.milimai.museum" ,	"user3@test.milimai.museum"	] ,
/*110*/	[	true,	"user3@test.milima.aaaaa" ,	"user3@test.milima.aaaaa"	] ,
/*111*/	[	true,	"user3@test.milim.zzzz" ,	"user3@test.milim.zzzz"	] ,
/*112*/	[	true,	"user3@test.mili.com" ,	"user3@test.mili.com"	] ,
/*113*/	[	true,	"user3@test.mi.fr" ,	"user3@test.mi.fr"	] ,
/*114*/	[	true,	"user3@test.m.museum" ,	"user3@test.m.museum"	] ,
/*115*/	[	true,	"user3@tes.m.museum" ,	"user3@tes.m.museum"	] ,
/*116*/	[	true,	"user3@te.m.museum" ,	"user3@te.m.museum"	] ,
/*117*/	[	true,	"user3@t.m.museum" ,	"user3@t.m.museum"	] ,
/*118*/	[	true,	"ser3@test.milimail.com" ,	"ser3@test.milimail.com"	] ,
/*119*/	[	true,	"er3@test.milimail.com" ,	"er3@test.milimail.com"	] ,
/*120*/	[	true,	"r3@test.milimail.com" ,	"r3@test.milimail.com"	] ,
/*121*/	[	true,	"3@test.milimail.com" ,	"3@test.milimail.com"	] ,
/*122*/	[	false,	"user3@test.milimail.museummuseum" ,	null	] ,
/*123*/	[	false,	"@test.milimail.com" ,	null	] ,
/*124*/	[	false,	"user3@.m.museum" ,	null	] ,
/*125*/	[	false,	"user3@..museum.org" ,	null	] ,
/*126*/	[	false,	"user3@.m." ,	null	] ,
/*127*/	[	true,	"u@m.aa" ,	"u@m.aa"	] ,
/*128*/	[	false,	"@.aa" ,	null	] ,
/*129*/	[	false,	"...@..." ,	null	] ,
/*130*/	[	false,	"..@..." ,	null	] ,
/*131*/	[	false,	".@..." ,	null	] ,
/*132*/	[	false,	".@.." ,	null	] ,
/*133*/	[	false,	".@." ,	null	] ,
/*134*/	[	false,	"@." ,	null	] ,
/*135*/	[	false,	".@" ,	null	] ,
/*136*/	[	false,	"@" ,	null	] ,
];
