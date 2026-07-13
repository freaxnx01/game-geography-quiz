// geo-data.js — dataset for Terra Geo Quiz
// C(iso2, isoNumeric, nameEN, nameDE, capitalEN, capitalDE, continent, area km2, difficulty 1-3, neighbors, atlasName)
// de/capDe/atlas = null when identical to EN name.
const C = (iso, n, en, de, cap, capDe, cont, area, d, nb, atlas) => ({
  iso, n, en, de: de || en, cap, capDe: capDe || cap, cont, area, d,
  nb: nb ? nb.split(' ') : [], atlas: atlas || en
});

export const COUNTRIES = [
  // ---- Europe ----
  C('al','008','Albania','Albanien','Tirana',null,'EU',28748,2,'me xk mk gr'),
  C('ad','020','Andorra',null,'Andorra la Vella',null,'EU',468,3,'fr es'),
  C('at','040','Austria','Österreich','Vienna','Wien','EU',83879,1,'de cz sk hu si it ch li'),
  C('by','112','Belarus',null,'Minsk',null,'EU',207600,2,'pl lt lv ru ua'),
  C('be','056','Belgium','Belgien','Brussels','Brüssel','EU',30528,1,'fr nl de lu'),
  C('ba','070','Bosnia and Herzegovina','Bosnien und Herzegowina','Sarajevo',null,'EU',51197,2,'hr rs me','Bosnia and Herz.'),
  C('bg','100','Bulgaria','Bulgarien','Sofia',null,'EU',110879,2,'ro rs mk gr tr'),
  C('hr','191','Croatia','Kroatien','Zagreb',null,'EU',56594,2,'si hu rs ba me'),
  C('cz','203','Czechia','Tschechien','Prague','Prag','EU',78865,1,'de pl sk at'),
  C('dk','208','Denmark','Dänemark','Copenhagen','Kopenhagen','EU',42933,1,'de'),
  C('ee','233','Estonia','Estland','Tallinn',null,'EU',45227,2,'lv ru'),
  C('fi','246','Finland','Finnland','Helsinki',null,'EU',338424,1,'se no ru'),
  C('fr','250','France','Frankreich','Paris',null,'EU',551695,1,'es ad be lu de ch it mc'),
  C('de','276','Germany','Deutschland','Berlin',null,'EU',357588,1,'dk pl cz at ch fr lu be nl'),
  C('gr','300','Greece','Griechenland','Athens','Athen','EU',131957,1,'al mk bg tr'),
  C('hu','348','Hungary','Ungarn','Budapest',null,'EU',93028,2,'at sk ua ro rs hr si'),
  C('is','352','Iceland','Island','Reykjavík',null,'EU',103000,2,''),
  C('ie','372','Ireland','Irland','Dublin',null,'EU',70273,1,'gb'),
  C('it','380','Italy','Italien','Rome','Rom','EU',301340,1,'fr ch at si sm va'),
  C('xk','-99','Kosovo',null,'Pristina',null,'EU',10887,3,'rs mk al me'),
  C('lv','428','Latvia','Lettland','Riga',null,'EU',64589,2,'ee lt by ru'),
  C('li','438','Liechtenstein',null,'Vaduz',null,'EU',160,3,'ch at'),
  C('lt','440','Lithuania','Litauen','Vilnius',null,'EU',65300,2,'lv by pl ru'),
  C('lu','442','Luxembourg','Luxemburg','Luxembourg','Luxemburg','EU',2586,2,'be fr de'),
  C('mt','470','Malta',null,'Valletta',null,'EU',316,2,''),
  C('md','498','Moldova','Moldau','Chișinău',null,'EU',33846,3,'ro ua'),
  C('mc','492','Monaco',null,'Monaco',null,'EU',2,2,'fr'),
  C('me','499','Montenegro',null,'Podgorica',null,'EU',13812,3,'hr ba rs xk al'),
  C('nl','528','Netherlands','Niederlande','Amsterdam',null,'EU',41543,1,'de be'),
  C('mk','807','North Macedonia','Nordmazedonien','Skopje',null,'EU',25713,3,'xk rs bg gr al','Macedonia'),
  C('no','578','Norway','Norwegen','Oslo',null,'EU',385207,1,'se fi ru'),
  C('pl','616','Poland','Polen','Warsaw','Warschau','EU',312696,1,'de cz sk ua by lt ru'),
  C('pt','620','Portugal',null,'Lisbon','Lissabon','EU',92212,1,'es'),
  C('ro','642','Romania','Rumänien','Bucharest','Bukarest','EU',238398,2,'hu ua md bg rs'),
  C('ru','643','Russia','Russland','Moscow','Moskau','EU',17098246,1,'no fi ee lv lt pl by ua ge az kz cn mn kp'),
  C('sm','674','San Marino',null,'San Marino',null,'EU',61,3,'it'),
  C('rs','688','Serbia','Serbien','Belgrade','Belgrad','EU',88361,2,'hu ro bg mk xk me ba hr'),
  C('sk','703','Slovakia','Slowakei','Bratislava',null,'EU',49035,2,'cz pl ua hu at'),
  C('si','705','Slovenia','Slowenien','Ljubljana',null,'EU',20273,2,'it at hu hr'),
  C('es','724','Spain','Spanien','Madrid',null,'EU',505990,1,'pt fr ad'),
  C('se','752','Sweden','Schweden','Stockholm',null,'EU',447425,1,'no fi'),
  C('ch','756','Switzerland','Schweiz','Bern',null,'EU',41285,1,'de fr it at li'),
  C('ua','804','Ukraine',null,'Kyiv','Kiew','EU',603628,1,'pl sk hu ro md by ru'),
  C('gb','826','United Kingdom','Vereinigtes Königreich','London',null,'EU',243610,1,'ie'),
  C('va','336','Vatican City','Vatikanstadt','Vatican City','Vatikanstadt','EU',0.49,2,'it','Vatican'),
  // ---- Asia ----
  C('af','004','Afghanistan',null,'Kabul',null,'AS',652864,2,'ir pk tm uz tj cn'),
  C('am','051','Armenia','Armenien','Yerevan','Eriwan','AS',29743,3,'ge az tr ir'),
  C('az','031','Azerbaijan','Aserbaidschan','Baku',null,'AS',86600,3,'ru ge am ir tr'),
  C('bh','048','Bahrain',null,'Manama',null,'AS',778,3,''),
  C('bd','050','Bangladesh','Bangladesch','Dhaka',null,'AS',147570,2,'in mm'),
  C('bt','064','Bhutan',null,'Thimphu',null,'AS',38394,3,'in cn'),
  C('bn','096','Brunei',null,'Bandar Seri Begawan',null,'AS',5765,3,'my'),
  C('kh','116','Cambodia','Kambodscha','Phnom Penh',null,'AS',181035,2,'th la vn'),
  C('cn','156','China',null,'Beijing','Peking','AS',9596960,1,'ru mn kz kg tj af pk in np bt mm la vn kp'),
  C('cy','196','Cyprus','Zypern','Nicosia','Nikosia','AS',9251,2,''),
  C('ge','268','Georgia','Georgien','Tbilisi','Tiflis','AS',69700,3,'ru az am tr'),
  C('in','356','India','Indien','New Delhi','Neu-Delhi','AS',3287263,1,'pk cn np bt bd mm'),
  C('id','360','Indonesia','Indonesien','Jakarta',null,'AS',1904569,1,'my tl pg'),
  C('ir','364','Iran',null,'Tehran','Teheran','AS',1648195,1,'iq tr am az tm af pk'),
  C('iq','368','Iraq','Irak','Baghdad','Bagdad','AS',438317,2,'tr sy jo sa kw ir'),
  C('il','376','Israel',null,'Jerusalem',null,'AS',22072,1,'lb sy jo eg ps'),
  C('jp','392','Japan',null,'Tokyo','Tokio','AS',377975,1,''),
  C('jo','400','Jordan','Jordanien','Amman',null,'AS',89342,2,'sy iq sa il ps'),
  C('kz','398','Kazakhstan','Kasachstan','Astana',null,'AS',2724900,2,'ru cn kg uz tm'),
  C('kw','414','Kuwait',null,'Kuwait City','Kuwait-Stadt','AS',17818,2,'iq sa'),
  C('kg','417','Kyrgyzstan','Kirgisistan','Bishkek','Bischkek','AS',199951,3,'kz uz tj cn'),
  C('la','418','Laos',null,'Vientiane',null,'AS',236800,3,'cn vn kh th mm'),
  C('lb','422','Lebanon','Libanon','Beirut',null,'AS',10452,2,'sy il'),
  C('my','458','Malaysia',null,'Kuala Lumpur',null,'AS',330803,2,'th id bn'),
  C('mv','462','Maldives','Malediven','Malé',null,'AS',298,3,''),
  C('mn','496','Mongolia','Mongolei','Ulaanbaatar',null,'AS',1564110,2,'ru cn'),
  C('mm','104','Myanmar',null,'Naypyidaw',null,'AS',676578,2,'bd in cn la th'),
  C('np','524','Nepal',null,'Kathmandu',null,'AS',147181,2,'in cn'),
  C('kp','408','North Korea','Nordkorea','Pyongyang','Pjöngjang','AS',120538,2,'cn ru kr'),
  C('om','512','Oman',null,'Muscat','Maskat','AS',309500,3,'ae sa ye'),
  C('pk','586','Pakistan',null,'Islamabad',null,'AS',881913,2,'in af ir cn'),
  C('ps','275','Palestine','Palästina','Ramallah',null,'AS',6020,3,'il eg jo'),
  C('ph','608','Philippines','Philippinen','Manila',null,'AS',300000,1,''),
  C('qa','634','Qatar','Katar','Doha',null,'AS',11586,2,'sa'),
  C('sa','682','Saudi Arabia','Saudi-Arabien','Riyadh','Riad','AS',2149690,1,'jo iq kw qa ae om ye'),
  C('sg','702','Singapore','Singapur','Singapore','Singapur','AS',728,2,''),
  C('kr','410','South Korea','Südkorea','Seoul',null,'AS',100210,1,'kp'),
  C('lk','144','Sri Lanka',null,'Sri Jayawardenepura Kotte',null,'AS',65610,2,''),
  C('sy','760','Syria','Syrien','Damascus','Damaskus','AS',185180,2,'tr iq jo il lb'),
  C('tw','158','Taiwan',null,'Taipei','Taipeh','AS',36193,2,''),
  C('tj','762','Tajikistan','Tadschikistan','Dushanbe','Duschanbe','AS',143100,3,'kg uz af cn'),
  C('th','764','Thailand',null,'Bangkok',null,'AS',513120,1,'mm la kh my'),
  C('tl','626','Timor-Leste','Osttimor','Dili',null,'AS',14874,3,'id'),
  C('tr','792','Turkey','Türkei','Ankara',null,'AS',783562,1,'gr bg ge am az ir iq sy'),
  C('tm','795','Turkmenistan',null,'Ashgabat','Aschgabat','AS',488100,3,'kz uz af ir'),
  C('ae','784','United Arab Emirates','Vereinigte Arabische Emirate','Abu Dhabi',null,'AS',83600,2,'sa om'),
  C('uz','860','Uzbekistan','Usbekistan','Tashkent','Taschkent','AS',447400,3,'kz kg tj af tm'),
  C('vn','704','Vietnam',null,'Hanoi',null,'AS',331212,1,'cn la kh'),
  C('ye','887','Yemen','Jemen','Sanaa',null,'AS',527968,2,'sa om'),
  // ---- Africa ----
  C('dz','012','Algeria','Algerien','Algiers','Algier','AF',2381741,2,'ma tn ly ne ml mr'),
  C('ao','024','Angola',null,'Luanda',null,'AF',1246700,2,'cd cg zm na'),
  C('bj','204','Benin',null,'Porto-Novo',null,'AF',114763,3,'tg bf ne ng'),
  C('bw','072','Botswana','Botsuana','Gaborone',null,'AF',581730,3,'na za zw zm'),
  C('bf','854','Burkina Faso',null,'Ouagadougou',null,'AF',274222,3,'ml ne bj tg gh ci'),
  C('bi','108','Burundi',null,'Gitega',null,'AF',27834,3,'rw tz cd'),
  C('cv','132','Cabo Verde','Kap Verde','Praia',null,'AF',4033,3,''),
  C('cm','120','Cameroon','Kamerun','Yaoundé',null,'AF',475442,2,'ng td cf cg ga gq'),
  C('cf','140','Central African Republic','Zentralafrikanische Republik','Bangui',null,'AF',622984,3,'td sd ss cd cg cm','Central African Rep.'),
  C('td','148','Chad','Tschad',"N'Djamena",null,'AF',1284000,3,'ly sd cf cm ng ne'),
  C('km','174','Comoros','Komoren','Moroni',null,'AF',1862,3,''),
  C('cg','178','Republic of the Congo','Republik Kongo','Brazzaville',null,'AF',342000,3,'ga cm cf cd ao','Congo'),
  C('cd','180','DR Congo','Demokratische Republik Kongo','Kinshasa',null,'AF',2344858,2,'cg cf ss ug rw bi tz zm ao','Dem. Rep. Congo'),
  C('ci','384',"Côte d'Ivoire",'Elfenbeinküste','Yamoussoukro',null,'AF',322463,2,'lr gn ml bf gh'),
  C('dj','262','Djibouti','Dschibuti','Djibouti City','Dschibuti-Stadt','AF',23200,3,'er et so'),
  C('eg','818','Egypt','Ägypten','Cairo','Kairo','AF',1001450,1,'ly sd il ps'),
  C('gq','226','Equatorial Guinea','Äquatorialguinea','Malabo',null,'AF',28051,3,'cm ga','Eq. Guinea'),
  C('er','232','Eritrea',null,'Asmara',null,'AF',117600,3,'sd et dj'),
  C('sz','748','Eswatini',null,'Mbabane',null,'AF',17364,3,'za mz','eSwatini'),
  C('et','231','Ethiopia','Äthiopien','Addis Ababa','Addis Abeba','AF',1104300,2,'er dj so ke ss sd'),
  C('ga','266','Gabon','Gabun','Libreville',null,'AF',267668,3,'gq cm cg'),
  C('gm','270','Gambia',null,'Banjul',null,'AF',11295,3,'sn'),
  C('gh','288','Ghana',null,'Accra',null,'AF',238533,2,'ci bf tg'),
  C('gn','324','Guinea',null,'Conakry',null,'AF',245857,3,'gw sn ml ci lr sl'),
  C('gw','624','Guinea-Bissau',null,'Bissau',null,'AF',36125,3,'sn gn'),
  C('ke','404','Kenya','Kenia','Nairobi',null,'AF',580367,1,'et so ss ug tz'),
  C('ls','426','Lesotho',null,'Maseru',null,'AF',30355,3,'za'),
  C('lr','430','Liberia',null,'Monrovia',null,'AF',111369,3,'sl gn ci'),
  C('ly','434','Libya','Libyen','Tripoli','Tripolis','AF',1759540,2,'tn dz ne td sd eg'),
  C('mg','450','Madagascar','Madagaskar','Antananarivo',null,'AF',587041,2,''),
  C('mw','454','Malawi',null,'Lilongwe',null,'AF',118484,3,'tz mz zm'),
  C('ml','466','Mali',null,'Bamako',null,'AF',1240192,2,'dz ne bf ci gn sn mr'),
  C('mr','478','Mauritania','Mauretanien','Nouakchott',null,'AF',1030700,3,'dz ml sn'),
  C('mu','480','Mauritius',null,'Port Louis',null,'AF',2040,3,''),
  C('ma','504','Morocco','Marokko','Rabat',null,'AF',446550,1,'dz'),
  C('mz','508','Mozambique','Mosambik','Maputo',null,'AF',801590,2,'tz mw zm zw za sz'),
  C('na','516','Namibia',null,'Windhoek','Windhuk','AF',825615,2,'ao zm bw za'),
  C('ne','562','Niger',null,'Niamey',null,'AF',1267000,3,'dz ly td ng bj bf ml'),
  C('ng','566','Nigeria',null,'Abuja',null,'AF',923768,1,'bj ne td cm'),
  C('rw','646','Rwanda','Ruanda','Kigali',null,'AF',26338,2,'ug tz bi cd'),
  C('st','678','São Tomé and Príncipe','São Tomé und Príncipe','São Tomé',null,'AF',964,3,'','São Tomé and Principe'),
  C('sn','686','Senegal',null,'Dakar',null,'AF',196722,2,'mr ml gn gw gm'),
  C('sc','690','Seychelles','Seychellen','Victoria',null,'AF',452,3,''),
  C('sl','694','Sierra Leone',null,'Freetown',null,'AF',71740,3,'gn lr'),
  C('so','706','Somalia',null,'Mogadishu','Mogadischu','AF',637657,2,'dj et ke'),
  C('za','710','South Africa','Südafrika','Pretoria',null,'AF',1221037,1,'na bw zw mz sz ls'),
  C('ss','728','South Sudan','Südsudan','Juba',null,'AF',619745,3,'sd et ke ug cd cf','S. Sudan'),
  C('sd','729','Sudan',null,'Khartoum','Khartum','AF',1861484,2,'eg ly td cf ss et er'),
  C('tz','834','Tanzania','Tansania','Dodoma',null,'AF',945087,2,'ke ug rw bi cd zm mw mz'),
  C('tg','768','Togo',null,'Lomé',null,'AF',56785,3,'gh bf bj'),
  C('tn','788','Tunisia','Tunesien','Tunis',null,'AF',163610,2,'dz ly'),
  C('ug','800','Uganda',null,'Kampala',null,'AF',241550,2,'ke ss cd rw tz'),
  C('zm','894','Zambia','Sambia','Lusaka',null,'AF',752618,3,'cd tz mw mz zw bw na ao'),
  C('zw','716','Zimbabwe','Simbabwe','Harare',null,'AF',390757,2,'za bw zm mz'),
  // ---- North America ----
  C('ag','028','Antigua and Barbuda','Antigua und Barbuda',"Saint John's",null,'NA',442,3,'','Antigua and Barb.'),
  C('bs','044','Bahamas',null,'Nassau',null,'NA',13943,2,''),
  C('bb','052','Barbados',null,'Bridgetown',null,'NA',430,3,''),
  C('bz','084','Belize',null,'Belmopan',null,'NA',22966,3,'mx gt'),
  C('ca','124','Canada','Kanada','Ottawa',null,'NA',9984670,1,'us'),
  C('cr','188','Costa Rica',null,'San José',null,'NA',51100,2,'ni pa'),
  C('cu','192','Cuba','Kuba','Havana','Havanna','NA',109884,1,''),
  C('dm','212','Dominica',null,'Roseau',null,'NA',751,3,''),
  C('do','214','Dominican Republic','Dominikanische Republik','Santo Domingo',null,'NA',48671,2,'ht','Dominican Rep.'),
  C('sv','222','El Salvador',null,'San Salvador',null,'NA',21041,2,'gt hn'),
  C('gd','308','Grenada',null,"Saint George's",null,'NA',344,3,''),
  C('gt','320','Guatemala',null,'Guatemala City','Guatemala-Stadt','NA',108889,2,'mx bz hn sv'),
  C('ht','332','Haiti',null,'Port-au-Prince',null,'NA',27750,2,'do'),
  C('hn','340','Honduras',null,'Tegucigalpa',null,'NA',112492,2,'gt sv ni'),
  C('jm','388','Jamaica','Jamaika','Kingston',null,'NA',10991,2,''),
  C('mx','484','Mexico','Mexiko','Mexico City','Mexiko-Stadt','NA',1964375,1,'us gt bz'),
  C('ni','558','Nicaragua',null,'Managua',null,'NA',130373,2,'hn cr'),
  C('pa','591','Panama',null,'Panama City','Panama-Stadt','NA',75417,2,'cr co'),
  C('kn','659','Saint Kitts and Nevis','St. Kitts und Nevis','Basseterre',null,'NA',261,3,'','St. Kitts and Nevis'),
  C('lc','662','Saint Lucia','St. Lucia','Castries',null,'NA',616,3,''),
  C('vc','670','Saint Vincent and the Grenadines','St. Vincent und die Grenadinen','Kingstown',null,'NA',389,3,'','St. Vin. and Gren.'),
  C('tt','780','Trinidad and Tobago','Trinidad und Tobago','Port of Spain',null,'NA',5130,3,''),
  C('us','840','United States','Vereinigte Staaten','Washington, D.C.',null,'NA',9833517,1,'ca mx','United States of America'),
  // ---- South America ----
  C('ar','032','Argentina','Argentinien','Buenos Aires',null,'SA',2780400,1,'cl bo py br uy'),
  C('bo','068','Bolivia','Bolivien','Sucre',null,'SA',1098581,2,'pe br py ar cl'),
  C('br','076','Brazil','Brasilien','Brasília',null,'SA',8515767,1,'uy ar py bo pe co ve gy sr'),
  C('cl','152','Chile',null,'Santiago',null,'SA',756102,1,'pe bo ar'),
  C('co','170','Colombia','Kolumbien','Bogotá',null,'SA',1141748,1,'ve br pe ec pa'),
  C('ec','218','Ecuador',null,'Quito',null,'SA',276841,2,'co pe'),
  C('gy','328','Guyana',null,'Georgetown',null,'SA',214969,3,'ve br sr'),
  C('py','600','Paraguay',null,'Asunción',null,'SA',406752,2,'bo br ar'),
  C('pe','604','Peru',null,'Lima',null,'SA',1285216,1,'ec co br bo cl'),
  C('sr','740','Suriname',null,'Paramaribo',null,'SA',163820,3,'gy br'),
  C('uy','858','Uruguay',null,'Montevideo',null,'SA',176215,2,'br ar'),
  C('ve','862','Venezuela',null,'Caracas',null,'SA',916445,2,'co br gy'),
  // ---- Oceania ----
  C('au','036','Australia','Australien','Canberra',null,'OC',7692024,1,''),
  C('fj','242','Fiji','Fidschi','Suva',null,'OC',18274,3,''),
  C('ki','296','Kiribati',null,'South Tarawa',null,'OC',811,3,''),
  C('mh','584','Marshall Islands','Marshallinseln','Majuro',null,'OC',181,3,'','Marshall Is.'),
  C('fm','583','Micronesia','Mikronesien','Palikir',null,'OC',702,3,''),
  C('nr','520','Nauru',null,'Yaren',null,'OC',21,3,''),
  C('nz','554','New Zealand','Neuseeland','Wellington',null,'OC',268838,1,''),
  C('pw','585','Palau',null,'Ngerulmud',null,'OC',459,3,''),
  C('pg','598','Papua New Guinea','Papua-Neuguinea','Port Moresby',null,'OC',462840,2,'id'),
  C('ws','882','Samoa',null,'Apia',null,'OC',2842,3,''),
  C('sb','090','Solomon Islands','Salomonen','Honiara',null,'OC',28896,3,'','Solomon Is.'),
  C('to','776','Tonga',null,"Nuku'alofa",null,'OC',747,3,''),
  C('tv','798','Tuvalu',null,'Funafuti',null,'OC',26,3,''),
  C('vu','548','Vanuatu',null,'Port Vila',null,'OC',12189,3,'')
];

export const CONTINENTS = {
  EU: ['Europe', 'Europa'],
  AS: ['Asia', 'Asien'],
  AF: ['Africa', 'Afrika'],
  NA: ['North America', 'Nordamerika'],
  SA: ['South America', 'Südamerika'],
  OC: ['Oceania', 'Ozeanien']
};

// Seas & oceans: {en, de, lat, lon, d}
const S = (en, de, lat, lon, d) => ({ en, de: de || en, lat, lon, d });
export const SEAS = [
  S('Pacific Ocean','Pazifischer Ozean', 0, -150, 1),
  S('Atlantic Ocean','Atlantischer Ozean', 25, -40, 1),
  S('Indian Ocean','Indischer Ozean', -20, 78, 1),
  S('Arctic Ocean','Arktischer Ozean', 82, -20, 1),
  S('Southern Ocean','Südlicher Ozean', -63, 20, 2),
  S('Mediterranean Sea','Mittelmeer', 35, 18, 1),
  S('Caribbean Sea','Karibisches Meer', 15, -75, 1),
  S('Gulf of Mexico','Golf von Mexiko', 25, -90, 1),
  S('Baltic Sea','Ostsee', 58, 19, 2),
  S('North Sea','Nordsee', 56, 3, 2),
  S('Black Sea','Schwarzes Meer', 43.5, 34, 2),
  S('Caspian Sea','Kaspisches Meer', 41, 51, 2),
  S('Red Sea','Rotes Meer', 20, 38, 2),
  S('Persian Gulf','Persischer Golf', 26.5, 51.5, 2),
  S('Arabian Sea','Arabisches Meer', 14, 63, 2),
  S('Bay of Bengal','Golf von Bengalen', 13, 88, 2),
  S('South China Sea','Südchinesisches Meer', 13, 113, 2),
  S('East China Sea','Ostchinesisches Meer', 29, 125, 3),
  S('Sea of Japan','Japanisches Meer', 40, 134, 2),
  S('Sea of Okhotsk','Ochotskisches Meer', 55, 148, 3),
  S('Bering Sea','Beringmeer', 58, -175, 2),
  S('Hudson Bay','Hudson Bay', 60, -85, 2),
  S('Labrador Sea','Labradorsee', 58, -55, 3),
  S('Gulf of Alaska','Golf von Alaska', 57, -145, 3),
  S('Coral Sea','Korallenmeer', -18, 155, 3),
  S('Tasman Sea','Tasmansee', -38, 160, 3),
  S('Philippine Sea','Philippinensee', 18, 132, 3),
  S('Adriatic Sea','Adria', 43, 15, 2),
  S('Aegean Sea','Ägäis', 38.5, 25, 2),
  S('Barents Sea','Barentssee', 74, 40, 3),
  S('Norwegian Sea','Europäisches Nordmeer', 68, 2, 3),
  S('Gulf of Guinea','Golf von Guinea', 2, 2, 2),
  S('Mozambique Channel','Strasse von Mosambik', -18, 41, 3),
  S('Andaman Sea','Andamanensee', 10, 96, 3),
  S('Java Sea','Javasee', -5, 111, 3)
];

// US states: {en, de (differs rarely), cap, ab}
const U = (en, cap, ab, de) => ({ en, de: de || en, cap, ab });
export const US_STATES = [
  U('Alabama','Montgomery','AL'), U('Alaska','Juneau','AK'), U('Arizona','Phoenix','AZ'),
  U('Arkansas','Little Rock','AR'), U('California','Sacramento','CA','Kalifornien'),
  U('Colorado','Denver','CO'), U('Connecticut','Hartford','CT'), U('Delaware','Dover','DE'),
  U('Florida','Tallahassee','FL'), U('Georgia','Atlanta','GA'), U('Hawaii','Honolulu','HI'),
  U('Idaho','Boise','ID'), U('Illinois','Springfield','IL'), U('Indiana','Indianapolis','IN'),
  U('Iowa','Des Moines','IA'), U('Kansas','Topeka','KS'), U('Kentucky','Frankfort','KY'),
  U('Louisiana','Baton Rouge','LA'), U('Maine','Augusta','ME'), U('Maryland','Annapolis','MD'),
  U('Massachusetts','Boston','MA'), U('Michigan','Lansing','MI'), U('Minnesota','Saint Paul','MN'),
  U('Mississippi','Jackson','MS'), U('Missouri','Jefferson City','MO'), U('Montana','Helena','MT'),
  U('Nebraska','Lincoln','NE'), U('Nevada','Carson City','NV'), U('New Hampshire','Concord','NH'),
  U('New Jersey','Trenton','NJ'), U('New Mexico','Santa Fe','NM'), U('New York','Albany','NY'),
  U('North Carolina','Raleigh','NC'), U('North Dakota','Bismarck','ND'), U('Ohio','Columbus','OH'),
  U('Oklahoma','Oklahoma City','OK'), U('Oregon','Salem','OR'), U('Pennsylvania','Harrisburg','PA'),
  U('Rhode Island','Providence','RI'), U('South Carolina','Columbia','SC'), U('South Dakota','Pierre','SD'),
  U('Tennessee','Nashville','TN'), U('Texas','Austin','TX'), U('Utah','Salt Lake City','UT'),
  U('Vermont','Montpelier','VT'), U('Virginia','Richmond','VA'), U('Washington','Olympia','WA'),
  U('West Virginia','Charleston','WV'), U('Wisconsin','Madison','WI'), U('Wyoming','Cheyenne','WY')
];

// Swiss cantons: {en, de, cap (EN), capDe, ab}
const K = (ab, de, en, capDe, capEn) => ({ ab, de, en: en || de, capDe, capEn: capEn || capDe });
export const CANTONS = [
  K('ZH','Zürich','Zurich','Zürich','Zurich'),
  K('BE','Bern',null,'Bern'),
  K('LU','Luzern','Lucerne','Luzern','Lucerne'),
  K('UR','Uri',null,'Altdorf'),
  K('SZ','Schwyz',null,'Schwyz'),
  K('OW','Obwalden',null,'Sarnen'),
  K('NW','Nidwalden',null,'Stans'),
  K('GL','Glarus',null,'Glarus'),
  K('ZG','Zug',null,'Zug'),
  K('FR','Freiburg','Fribourg','Freiburg','Fribourg'),
  K('SO','Solothurn',null,'Solothurn'),
  K('BS','Basel-Stadt',null,'Basel'),
  K('BL','Basel-Landschaft',null,'Liestal'),
  K('SH','Schaffhausen',null,'Schaffhausen'),
  K('AR','Appenzell Ausserrhoden',null,'Herisau'),
  K('AI','Appenzell Innerrhoden',null,'Appenzell'),
  K('SG','St. Gallen',null,'St. Gallen'),
  K('GR','Graubünden','Grisons','Chur'),
  K('AG','Aargau',null,'Aarau'),
  K('TG','Thurgau',null,'Frauenfeld'),
  K('TI','Tessin','Ticino','Bellinzona'),
  K('VD','Waadt','Vaud','Lausanne'),
  K('VS','Wallis','Valais','Sitten','Sion'),
  K('NE','Neuenburg','Neuchâtel','Neuenburg','Neuchâtel'),
  K('GE','Genf','Geneva','Genf','Geneva'),
  K('JU','Jura',null,'Delsberg','Delémont')
];

// Cities for the "Pin the City" mode, keyed by country iso.
// CT(nameEN, lat, lon, nameDE) — de = null when identical.
const CT = (en, lat, lon, de) => ({ en, de: de || en, lat, lon });
export const CITIES = {
  de: [
    CT('Berlin', 52.52, 13.40), CT('Hamburg', 53.55, 9.99), CT('Munich', 48.14, 11.58, 'München'),
    CT('Cologne', 50.94, 6.96, 'Köln'), CT('Frankfurt', 50.11, 8.68), CT('Stuttgart', 48.78, 9.18),
    CT('Dresden', 51.05, 13.74), CT('Hanover', 52.37, 9.73, 'Hannover'), CT('Nuremberg', 49.45, 11.08, 'Nürnberg'),
    CT('Bremen', 53.08, 8.80)
  ],
  ch: [
    // major cities
    CT('Zurich', 47.37, 8.54, 'Zürich'), CT('Winterthur', 47.50, 8.72), CT('Uster', 47.35, 8.72),
    CT('Geneva', 46.20, 6.14, 'Genf'), CT('Basel', 47.56, 7.59), CT('Bern', 46.95, 7.44),
    CT('Lausanne', 46.52, 6.63), CT('Lucerne', 47.05, 8.31, 'Luzern'), CT('St. Gallen', 47.42, 9.38),
    CT('Lugano', 46.00, 8.95),
    // canton capitals (Kantonshauptorte)
    CT('Altdorf', 46.88, 8.64), CT('Schwyz', 47.02, 8.65), CT('Sarnen', 46.90, 8.25),
    CT('Stans', 46.96, 8.37), CT('Glarus', 47.04, 9.07), CT('Zug', 47.17, 8.52),
    CT('Fribourg', 46.80, 7.16, 'Freiburg'), CT('Solothurn', 47.21, 7.53), CT('Liestal', 47.48, 7.73),
    CT('Schaffhausen', 47.70, 8.63), CT('Herisau', 47.39, 9.28), CT('Appenzell', 47.33, 9.41),
    CT('Aarau', 47.39, 8.05), CT('Frauenfeld', 47.56, 8.90), CT('Bellinzona', 46.19, 9.02),
    CT('Chur', 46.85, 9.53), CT('Sion', 46.23, 7.36, 'Sitten'),
    CT('Neuchâtel', 46.99, 6.93, 'Neuenburg'), CT('Delémont', 47.36, 7.34, 'Delsberg')
  ],
  at: [
    CT('Vienna', 48.21, 16.37, 'Wien'), CT('Graz', 47.07, 15.44), CT('Linz', 48.31, 14.29),
    CT('Salzburg', 47.81, 13.05), CT('Innsbruck', 47.27, 11.39), CT('Klagenfurt', 46.62, 14.31),
    CT('Bregenz', 47.50, 9.75)
  ],
  us: [
    CT('New York', 40.71, -74.01), CT('Los Angeles', 34.05, -118.24), CT('Chicago', 41.88, -87.63),
    CT('Houston', 29.76, -95.37), CT('Miami', 25.76, -80.19), CT('Seattle', 47.61, -122.33),
    CT('Denver', 39.74, -104.99), CT('Boston', 42.36, -71.06), CT('New Orleans', 29.95, -90.07),
    CT('San Francisco', 37.77, -122.42), CT('Washington, D.C.', 38.90, -77.04), CT('Dallas', 32.78, -96.80),
    CT('Minneapolis', 44.98, -93.27), CT('Atlanta', 33.75, -84.39)
  ],
  fr: [
    CT('Paris', 48.86, 2.35), CT('Marseille', 43.30, 5.37), CT('Lyon', 45.76, 4.84),
    CT('Toulouse', 43.60, 1.44), CT('Nice', 43.70, 7.27, 'Nizza'), CT('Bordeaux', 44.84, -0.58),
    CT('Strasbourg', 48.58, 7.75, 'Strassburg'), CT('Lille', 50.63, 3.06)
  ],
  it: [
    CT('Rome', 41.90, 12.50, 'Rom'), CT('Milan', 45.46, 9.19, 'Mailand'), CT('Naples', 40.85, 14.27, 'Neapel'),
    CT('Turin', 45.07, 7.69), CT('Palermo', 38.12, 13.36), CT('Venice', 45.44, 12.32, 'Venedig'),
    CT('Florence', 43.77, 11.26, 'Florenz'), CT('Bologna', 44.49, 11.34), CT('Genoa', 44.41, 8.93, 'Genua')
  ],
  es: [
    CT('Madrid', 40.42, -3.70), CT('Barcelona', 41.39, 2.17), CT('Valencia', 39.47, -0.38),
    CT('Seville', 37.39, -5.99, 'Sevilla'), CT('Bilbao', 43.26, -2.93), CT('Málaga', 36.72, -4.42),
    CT('Zaragoza', 41.65, -0.89, 'Saragossa'), CT('Santiago de Compostela', 42.88, -8.55)
  ],
  gb: [
    CT('London', 51.51, -0.13), CT('Manchester', 53.48, -2.24), CT('Birmingham', 52.49, -1.89),
    CT('Liverpool', 53.41, -2.99), CT('Edinburgh', 55.95, -3.19, 'Edinburgh'), CT('Glasgow', 55.86, -4.25),
    CT('Cardiff', 51.48, -3.18), CT('Belfast', 54.60, -5.93)
  ]
};

// Groups of flags that look confusingly alike (for the "Lookalikes" mini-game).
// Each inner array is a set of ISO codes whose flags are easy to mix up.
export const FLAG_SIMILAR = [
  ['id', 'mc', 'pl'],             // red/white bicolours (+ inverse)
  ['ro', 'td', 'ad', 'md'],       // blue-yellow-red verticals
  ['ie', 'ci', 'it'],             // green-white-orange/red verticals
  ['nl', 'lu'],                   // red-white-blue horizontals
  ['ru', 'si', 'sk'],             // white-blue-red horizontals (+ crests)
  ['co', 'ec', 've'],             // Andean yellow-blue-red
  ['sn', 'ml', 'gn', 'cm'],       // green-yellow-red African verticals
  ['no', 'is', 'fi', 'se', 'dk'], // Nordic crosses
  ['au', 'nz'],                   // blue ensign + Southern Cross
  ['sv', 'ni', 'hn', 'ar'],       // Central-American blue-white-blue
  ['ae', 'kw', 'sd', 'jo', 'ps'], // pan-Arab red/white/black/green
  ['eg', 'sy', 'iq', 'ye'],       // red-white-black horizontals
  ['tr', 'tn']                    // red with crescent
];

// Flags with unusual shapes or distinctive emblems (for the "Special Flags" game).
// {iso, en, de} — en/de is a short note on what makes the flag special.
export const FLAG_SPECIAL = [
  { iso: 'np', en: 'The only non-rectangular national flag \u2014 two stacked pennants.', de: 'Die einzige nicht-rechteckige Nationalflagge \u2014 zwei Wimpel.' },
  { iso: 'ch', en: 'One of only two square national flags.', de: 'Eine von nur zwei quadratischen Nationalflaggen.' },
  { iso: 'va', en: 'The other square flag \u2014 crossed keys and the papal tiara.', de: 'Die andere quadratische Flagge \u2014 gekreuzte Schl\u00FCssel und Tiara.' },
  { iso: 'bt', en: 'A white dragon (Druk) clutching jewels.', de: 'Ein wei\u00DFer Drache (Druk) mit Juwelen.' },
  { iso: 'lk', en: 'A golden lion holding a sword.', de: 'Ein goldener L\u00F6we mit einem Schwert.' },
  { iso: 'mx', en: 'An eagle devouring a snake atop a cactus.', de: 'Ein Adler, der eine Schlange auf einem Kaktus verschlingt.' },
  { iso: 'ke', en: 'A Maasai shield and two crossed spears.', de: 'Ein Massai-Schild und zwei gekreuzte Speere.' },
  { iso: 'al', en: 'A black double-headed eagle.', de: 'Ein schwarzer Doppeladler.' },
  { iso: 'cy', en: 'A map of the island itself.', de: 'Eine Karte der Insel selbst.' },
  { iso: 'xk', en: 'A map of the country with six stars.', de: 'Eine Landkarte mit sechs Sternen.' },
  { iso: 'lb', en: 'A green cedar tree.', de: 'Eine gr\u00FCne Zeder.' },
  { iso: 'ca', en: 'A single stylised maple leaf.', de: 'Ein stilisiertes Ahornblatt.' },
  { iso: 'kh', en: 'A building \u2014 the temple of Angkor Wat.', de: 'Ein Bauwerk \u2014 der Tempel Angkor Wat.' },
  { iso: 'mz', en: 'The only flag depicting a modern rifle (an AK-47).', de: 'Die einzige Flagge mit einem modernen Gewehr (AK-47).' },
  { iso: 'pt', en: 'An armillary sphere over the national shield.', de: 'Eine Armillarsph\u00E4re \u00FCber dem Wappen.' },
  { iso: 'gt', en: 'A quetzal bird and crossed rifles.', de: 'Ein Quetzal-Vogel und gekreuzte Gewehre.' },
  { iso: 'tm', en: 'Five carpet guls \u2014 the most detailed flag design.', de: 'F\u00FCnf Teppichmuster \u2014 das detailreichste Flaggendesign.' },
  { iso: 'kz', en: 'A soaring eagle beneath a sun.', de: 'Ein aufsteigender Adler unter einer Sonne.' },
  { iso: 'er', en: 'An olive wreath and branch on a red triangle.', de: 'Ein Olivenkranz und -zweig auf rotem Dreieck.' },
  { iso: 'me', en: 'A golden double-headed eagle with a lion.', de: 'Ein goldener Doppeladler mit L\u00F6we.' }
];
