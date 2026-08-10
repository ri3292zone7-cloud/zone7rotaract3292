import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './QuizPage.css?inline';

/* ---------------- DATA: built from the official reading materials ---------------- */

const CATS = {
  founder:   { name: 'Founder & Early Days',  icon: '🧭' },
  history:   { name: 'Rotary Through the Years', icon: '📜' },
  nepal:     { name: 'Nepal & District 3292', icon: '🇳🇵' },
  foundation:{ name: 'Foundation & Polio',    icon: '🛡️' },
  rotaract:  { name: 'Rotaract & Youth',      icon: '🤝' },
  rules:     { name: 'Meetings, Dues & Rules',icon: '🗓️' },
  general:   { name: 'General Knowledge',     icon: '🌍' }
};

const BANK = [
  /* ---------- founder ---------- */
  { c:'founder', q:'Who founded Rotary, and what was his full name?', o:['Paul Percival Harris','Paul Henry Harris','Percival Harris Smith','John Paul Harris'], a:0, why:'Paul Percival Harris, an attorney in Chicago, called three business friends to his first meeting in 1905.' },
  { c:'founder', q:'When and where did the very first Rotary club meeting take place?', o:['23 February 1905, Chicago','9 March 1905, Chicago','1 January 1905, New York','3 October 1905, Boston'], a:0, why:'Paul Harris met with Silvester Schiele, Gustavus Loehr and Hiram Shorey on 23 February 1905. The second meeting was held on 9 March 1905.' },
  { c:'founder', q:'Where was Paul Harris born?', o:['Racine, Wisconsin, USA','Chicago, Illinois, USA','Boston, Massachusetts, USA','London, England'], a:0, why:'He was born in Racine, Wisconsin, USA, in 1868.' },
  { c:'founder', q:'Who was the role model of Paul Harris?', o:['Howard Harris, his grandfather','George Harris, his father','His first law professor','Benjamin Franklin'], a:0, why:'Paul Harris looked up to his grandfather, Howard Harris, as his role model.' },
  { c:'founder', q:"What was Paul Harris' professional classification?", o:['Legal Affairs','Medicine','Journalism','Education'], a:0, why:"Rotary's founder was a lawyer, so his classification was Legal Affairs." },
  { c:'founder', q:'When did Paul Harris die?', o:['27 January 1947','23 February 1945','13 March 1947','1 July 1950'], a:0, why:'Paul Harris passed away on 27 January 1947.' },
  { c:'founder', q:'Where did the name "Rotary" come from?', o:["Meetings rotated between members' offices","It comes from the rotating wheel logo","It is an acronym","It was the founder's street name"], a:0, why:'The first members rotated their meeting places around their offices, and the name stuck.' },
  { c:'founder', q:'How many words are in the 4-Way Test?', o:['24','28','20','32'], a:0, why:'The test has 24 words. The Nepali version, translated by Rtn. Kamal Mani Dixit, runs to 28 words.' },
  { c:'founder', q:'Who created the 4-Way Test, and in which year?', o:['Herbert J. Taylor, 1932','Paul Harris, 1932','Chesley Perry, 1935','Oscar Bjorge, 1929'], a:0, why:'Herbert J. Taylor wrote it in 1932. He later served as RI President in 1954-55, Rotary\'s golden jubilee year.' },
  { c:'founder', q:'Who designed the Rotary wheel?', o:['Montague Bear','Oscar Bjorge','Herbert Taylor','Paul Harris'], a:0, why:'Montague Bear designed the original wheel. Oscar Bjorge later standardized it with 6 spokes, 24 cogs and a keyway.' },

  /* ---------- history ---------- */
  { c:'history', q:'Which was the first Rotary club outside North America?', o:['RC Dublin','RC London','RC Paris','RC Manila'], a:0, why:'Rotary Club of Dublin was the first club chartered outside North America.' },
  { c:'history', q:'In which year did Rotary membership reach one million?', o:['1985','1975','1990','1968'], a:0, why:'Rotary crossed the one million member mark in 1985.' },
  { c:'history', q:'Who was the first female President of Rotary International, and when?', o:['Jennifer Jones, 2022-23','Stephanie Urchick, 2024-25','Sylvia Whitlock, 1988','Carolyn E. Jones, 2010'], a:0, why:'Jennifer Jones served as the first woman RI President in 2022-23 under the theme Imagine Rotary.' },
  { c:'history', q:"Who was RI President in Rotary's golden jubilee year, 1954-55?", o:['Herbert J. Taylor','Frank L. Mulholland','Clifford A. Randall','Glenn E. Estess'], a:0, why:'Herbert J. Taylor led Rotary in 1954-55, exactly 50 years after the first club.' },
  { c:'history', q:'Which RI President promoted "Reach within to Embrace Humanity"?', o:['Kalyan Banerjee, 2011-12','Shekhar Mehta, 2021-22','R. Gordon McInally, 2023-24','Jennifer Jones, 2022-23'], a:0, why:'PRIP Kalyan Banerjee of India carried the theme Reach Within to Embrace Humanity in 2011-12.' },
  { c:'history', q:'Where will the RI Convention for 2027-28 be held?', o:['Manila, Philippines','Taipei, Taiwan','Honolulu, Hawaii','Singapore'], a:0, why:'Manila, Philippines hosts 2027-28. Taipei (2025-26) and Honolulu (2026-27) come before it.' },
  { c:'history', q:'When and where was the first RYLA held?', o:['July 1961, Brisbane, Australia','March 1968, Chicago','June 1955, New York','July 1970, London'], a:0, why:'The first Rotary Youth Leadership Awards was run by the Rotary Club of Brisbane, Australia in July 1961.' },
  { c:'history', q:'When and where was the first Interact club formed?', o:['5 November 1962, Melbourne High School','13 March 1968, North Carolina','1 July 1965, Chicago','5 November 1972, London'], a:0, why:'The Interact Club of Melbourne High School was formed on 5 November 1962. Interact Week runs in the week of that date.' },
  { c:'history', q:'How many clubs and delegates attended the first RI Convention in 1910?', o:['16 clubs, 60 delegates','25 clubs, 100 delegates','10 clubs, 40 delegates','50 clubs, 250 delegates'], a:0, why:'It was the smallest convention ever, with only 60 delegates from 16 clubs. The largest drew 43,381 to Osaka in 2004.' },
  { c:'history', q:'In which year did RI adopt the Club Leadership Plan (CLP)?', o:['2004','2010','1998','2013'], a:0, why:'The Club Leadership Plan was adopted in 2004 to strengthen clubs through five committees.' },

  /* ---------- nepal ---------- */
  { c:'nepal', q:'When was Rotary Club of Kathmandu, the first club in Nepal, chartered?', o:['13 April 1959','23 February 1955','1 July 1960','13 March 1962'], a:0, why:"Nepal's first Rotary club was chartered on 13 April 1959. Nepal was the 111th nation to join RI." },
  { c:'nepal', q:'Which club sponsored the first Rotary club of Nepal?', o:['RC Darbhanga','RC Calcutta','RC Jawalakhel','RC Patna'], a:0, why:'RC Kathmandu was sponsored by Rotary Club of Darbhanga.' },
  { c:'nepal', q:'Who was the first Paul Harris Fellow from Nepal?', o:['Hulas Chand Golchha','Kamal Mani Dixit','Gopal Raj Rajbhandari','Tirtha Man Shakya'], a:0, why:'Hulas Chand Golchha was the first Nepali Paul Harris Fellow.' },
  { c:'nepal', q:'When Nepal formed its own District 3292 in July 2008, how many clubs and Rotarians did it have?', o:['67 clubs, 1902 Rotarians','57 clubs, 1500 Rotarians','80 clubs, 2500 Rotarians','45 clubs, 1100 Rotarians'], a:0, why:'The new district started with 67 clubs and 1902 Rotarians in July 2008.' },
  { c:'nepal', q:'Who inaugurated Rotary International District 3292 on 1 July 2008?', o:['PM Girija Prasad Koirala','King Mahendra','President Ram Baran Yadav','PM Sher Bahadur Deuba'], a:0, why:'Late PM Girija Prasad Koirala inaugurated RID 3292. PRIP Rajendra K Saboo attended as guest.' },
  { c:'nepal', q:'Who was the first District Governor of RID 3292?', o:['Dr Tika Man Vaidya','Temas Manekshaw','Jaya Shah','Rajendra Man Sherchan'], a:0, why:'Dr Tika Man Vaidya, also Charter President of RC Patan West, became the first DG of 3292.' },
  { c:'nepal', q:'What was the first community service project by Rotary in Nepal?', o:['Eye Camp at Tundikhel','Bhaktapur Cancer Care Center','Polio immunization drive','Blood donation camp'], a:0, why:'A month-long mega eye camp at Tundikhel served more than 3000 patients right after RC Kathmandu was chartered.' },
  { c:'nepal', q:'Which club was the first admitted to RI after Nepal got District 3292?', o:['RC Baneswor','RC Jawalakhel Manjushree','RC Kathmandu','RC Patan West'], a:0, why:'Rotary Club of Baneswor was chartered on 30 July 2008, the first under the new district.' },
  { c:'nepal', q:'Which was the first Rotaract club of Nepal, and when was it chartered?', o:['RAC Birgunj, 13 March 1991','RAC Kathmandu, 1995','RAC Patan, 1992','RAC Chitwan, 1990'], a:0, why:'Rotaract Club of Birgunj was chartered on 13 March 1991, the very same date later celebrated as World Rotaract Day.' },
  { c:'nepal', q:'Who was the first District Rotaract Representative (DRR) of RID 3292?', o:['Rajan Piya','Bikram Chhetri','Roshan Karki','Dinesh Gaire'], a:0, why:'Rtr. Rajan Piya served as the first DRR in 2008-09 from Rotaract Club of Chitwan.' },
  { c:'nepal', q:'Which RI zone does RID 3292 fall under?', o:['Zone 6A','Zone 7A','Zone 5B','Zone 8C'], a:0, why:"Nepal's district sits in RI Zone 6A." },
  { c:'nepal', q:'How many Rotary clubs are under RID 3292, per my.rotary.org?', o:['162','173','144','127'], a:0, why:'The district runs 162 Rotary clubs, 173 Rotaract clubs, 144 Interact clubs and 127 RCCs.' },
  { c:'nepal', q:'How many Rotaract clubs are under RID 3292, per my.rotary.org?', o:['173','162','144','127'], a:0, why:'173 Rotaract clubs. Easy to mix up with the 162 Rotary clubs, so keep both in mind.' },
  { c:'nepal', q:'Who is the current DRR of RID 3292 for 2025-26?', o:['Rtr. Dinesh Gaire, RAC Tinau City','Rtr. Bikram Chhetri, RAC Tilottama','Rtr. Roshan Karki, RAC Manohara','Rtr. Rajan Piya, RAC Chitwan'], a:0, why:'Rtr. Dinesh Gaire of Rotaract Club of Tinau City leads Rotaract in 2025-26.' },

  /* ---------- foundation ---------- */
  { c:'foundation', q:'What makes someone a Paul Harris Fellow?', o:['Contributing $1,000 or more to The Rotary Foundation','Paying club dues for ten years','Founding a new club','Winning the 4-Way Test award'], a:0, why:'A PHF has contributed $1,000+ to the Annual Program Fund, PolioPlus Fund or Humanitarian Grants Program. The first PHF was Allison Brush.' },
  { c:'foundation', q:'Who was the first woman Paul Harris Fellow?', o:['Adan Vargas','Jennifer Jones','Carolyn E. Jones','Sylvia Whitlock'], a:0, why:'Adan Vargas became the first woman PHF for a gift made in 1953.' },
  { c:'foundation', q:'What qualifies someone as a Major Donor of TRF?', o:['$10,000 or more to the Permanent Fund','$25,000 or more','$5,000 or more','$100,000 or more'], a:0, why:'Major Donors give $10,000+ to the Permanent Fund. Benefactors give or pledge $1,000+ to it.' },
  { c:'foundation', q:'What is a Benefactor of The Rotary Foundation?', o:['Someone who has given or pledged $1,000+ to the Permanent Fund','Anyone who served as DG','Someone with a 20-year membership','A club that hosted a foundation seminar'], a:0, why:'Benefactor status comes from giving or pledging $1,000+ to the Permanent Fund. A Bequest Society member pledges $10,000+.' },
  { c:'foundation', q:'What is the motto of The Rotary Foundation?', o:['Doing Good in The World','Service Above Self','Serve to Change Lives','The Future of Rotary is in Your Hands'], a:0, why:'The Foundation\'s motto is Doing Good in The World, and its mission is advancing world understanding, peace, health, education and poverty relief.' },
  { c:'foundation', q:'When was the Global Polio Eradication Initiative (GPEI) established?', o:['1988','1979','1996','2005'], a:0, why:'GPEI was founded in 1988 as a public-private partnership led by national governments.' },
  { c:'foundation', q:'How much does it cost to immunize one child against polio?', o:['US$0.60','US$1.00','US$0.25','US$2.50'], a:0, why:'Around 60 US cents per child. That is why every small contribution adds up fast.' },
  { c:'foundation', q:'By what percentage have polio cases worldwide dropped since 1985?', o:['99%','90%','75%','95%'], a:0, why:'A 99% reduction. The last two endemic countries are Pakistan and Afghanistan.' },
  { c:'foundation', q:"Why is Rotary's polio effort called Polio Plus?", o:['Immunizations for other illnesses are included','The vaccine costs one dollar extra','It was the second phase of the campaign','Polio is named after a virus family'], a:0, why:'Polio Plus pairs polio vaccination with immunization against other diseases, hence the plus.' },
  { c:'foundation', q:'Which of these is NOT a partner of Rotary in the GPEI?', o:['Greenpeace','WHO','UNICEF','Bill & Melinda Gates Foundation'], a:0, why:'The partners are WHO, UNICEF, the US CDC and the Bill & Melinda Gates Foundation. Greenpeace is not one of them.' },
  { c:'foundation', q:'When was Nepal announced polio-free?', o:['7 May 2014','30 August 2010','1 January 2000','24 October 2015'], a:0, why:'Nepal was declared polio-free on 7 May 2014. Its last polio case was reported on 30 August 2010.' },
  { c:'foundation', q:'What was the first contribution ever made to The Rotary Foundation?', o:['US$26.50','US$100','US$1,000','US$10'], a:0, why:'The very first contribution to the Foundation was US$26.50.' },
  { c:'foundation', q:'Which project inspired the Polio Plus program in 1985?', o:['Mass polio vaccination of 6 million children in the Philippines, 1979','A polio drive in India in 1980','A Rotary club campaign in Brazil','The founding of GPEI'], a:0, why:'A 1979 Philippines project immunizing six million children against polio set the stage for Polio Plus.' },
  { c:'foundation', q:'When was the Permanent Fund of TRF established?', o:['1996','1988','2005','1979'], a:0, why:'The Permanent Fund was established in 1996 to secure a better tomorrow, while the Annual Programs Fund supports today.' },

  /* ---------- rotaract ---------- */
  { c:'rotaract', q:'In which year was Rotaract launched?', o:['1968','1962','1970','1958'], a:0, why:'Rotaract was launched in 1968 as a service program for young adults aged 18 to 30.' },
  { c:'rotaract', q:'What is the age range for Rotaract membership?', o:['18-30','12-18','15-25','21-35'], a:0, why:'Rotaract is open to young adults aged 18 to 30. Interact covers 12 to 18.' },
  { c:'rotaract', q:"When was the world's first Rotaract club chartered?", o:['13 March 1968, North Carolina, USA','5 November 1962, Florida','13 March 1991, Birgunj','1 July 1968, Chicago'], a:0, why:'The first club was chartered on 13 March 1968 in North Carolina, USA, and that date became World Rotaract Day.' },
  { c:'rotaract', q:'When is World Rotaract Day celebrated?', o:['13 March','23 February','5 November','1 July'], a:0, why:'World Rotaract Day is 13 March, the anniversary of the first Rotaract club in 1968.' },
  { c:'rotaract', q:'Since 2019, how does Rotary International describe Rotaract?', o:['An official partner of Rotary','A junior program supervised by Rotary','A fully independent organization','A district committee'], a:0, why:'In 2019 Rotary made Rotaract an official partner, equal in standing and run by its own members.' },
  { c:'rotaract', q:'What age group is the Interact program open to?', o:['12-18','15-19','18-30','8-14'], a:0, why:'Interact serves students aged 12 to 18 in school-based clubs.' },
  { c:'rotaract', q:'How much are RI dues per member for a community-based Rotaract club?', o:['US$8','US$5','US$2','US$10'], a:0, why:'Community-based Rotaract clubs pay US$8 per member to RI. University-based clubs pay US$5.' },
  { c:'rotaract', q:'How much are RI dues per member for a university-based Rotaract club?', o:['US$5','US$8','US$3','US$12'], a:0, why:'University-based clubs pay US$5 per member, while community-based clubs pay US$8.' },
  { c:'rotaract', q:'What age group is Rotary Youth Exchange open to?', o:['15-19','12-18','18-30','10-15'], a:0, why:'Rotary Youth Exchange is for students aged 15 to 19.' },
  { c:'rotaract', q:'What was the DRR theme of RID 3292 for 2023-24?', o:['Integrating Rotaract Upholding Fellowship','Rise Together Empowering Unity','Explore Rotaract','Inspire Empower Transform'], a:0, why:'Rtr. Roshan Karki carried Integrating Rotaract Upholding Fellowship in 2023-24.' },

  /* ---------- rules ---------- */
  { c:'rules', q:'How many mandatory meetings per month did the 2016 Council on Legislation require?', o:['Two','One','Three','Four'], a:0, why:'CoL 2016 made two meetings per month mandatory for Rotary clubs.' },
  { c:'rules', q:'What is the required quorum of a regular weekly Rotary meeting?', o:['One third','One half','One fourth','Two thirds'], a:0, why:'A regular weekly meeting needs a one third quorum.' },
  { c:'rules', q:'What minimum percentage of meetings are Rotarians encouraged to attend?', o:['50% of meetings each half year','60%','75%','80%'], a:0, why:'The encouragement is 50% of meetings in each half of the Rotary year.' },
  { c:'rules', q:'What attendance does the Bylaws of Rotary International actually require of club members?', o:['60%','50%','40%','75%'], a:0, why:"RI's bylaws require 60% attendance, while the encouragement level is 50% per half year." },
  { c:'rules', q:'When can a Rotarian "make up" a meeting by attending another Rotary event?', o:['Within the same Rotary year','Only in the next Rotary year','At any time','Only in their own club'], a:0, why:'Make-ups count within the same Rotary year, and can include other clubs, Rotaract and Interact partner meetings, service projects, district events and the RI Convention.' },
  { c:'rules', q:'What are the deadlines for sending semi-annual RI dues?', o:['31 October and 30 April','31 January and 31 July','1 July and 1 January','15 March and 15 September'], a:0, why:'Clubs send dues for the first half by 31 October and the second half by 30 April.' },
  { c:'rules', q:'When is a club terminated for non-payment of RI dues?', o:['Dues over US$250 and more than 120 days overdue','Over US$100 and 60 days overdue','Any amount over 30 days overdue','Over US$500 and 90 days overdue'], a:0, why:'Non-payment beyond US$250 for more than 120 days triggers termination. Reinstatement costs $30 per member plus all arrears.' },
  { c:'rules', q:'What is the Rule of 85 in Rotary?', o:['Attendance can be excused when membership years plus age total at least 85, with 20+ years of membership','Rotarians retire from office at 85','85% attendance is required','A club needs 85 members'], a:0, why:'A Rotarian with 20+ years of membership whose age plus membership years equals at least 85 can be excused from attendance.' },
  { c:'rules', q:'For how long can a member be granted a Leave of Absence?', o:['12 months','6 months','3 months','24 months'], a:0, why:'A leave of absence can last up to 12 months, per the Manual of Procedure.' },
  { c:'rules', q:'What is the goal behind "Every Rotarian Every Year" (EREY)?', o:['US$100 per capita contribution to the Annual Program Fund','US$50','US$250','US$1,000'], a:0, why:'EREY aims for a $100 per member yearly contribution to the Annual Program Fund.' },

  /* ---------- general ---------- */
  { c:'general', q:'Which planets rotate from west to east?', o:['Venus and Uranus','Venus and Mars','Jupiter and Saturn','Mercury and Venus'], a:0, why:'Venus and Uranus spin from west to east, opposite to most of the solar system.' },
  { c:'general', q:'Who was the first woman in space?', o:['Valentina Tereshkova','Sally Ride','Kalpana Chawla','Mae Jemison'], a:0, why:'Soviet cosmonaut Valentina Tereshkova orbited Earth in 1963.' },
  { c:'general', q:'What is the SI unit of pressure?', o:['Pascal','Newton','Joule','Bar'], a:0, why:'Pressure is measured in pascals. A bar is a non-SI unit sometimes used in weather.' },
  { c:'general', q:'Which is the deepest lake in the world?', o:['Lake Baikal','Caspian Sea','Lake Tanganyika','Lake Superior'], a:0, why:"Lake Baikal in Russia is the world's deepest lake." },
  { c:'general', q:'What is the largest island in the world?', o:['Greenland','Madagascar','Borneo','Australia'], a:0, why:'Greenland is the largest island. Australia counts as a continent, not an island.' },
  { c:'general', q:'Which country was formerly known as Holland?', o:['Netherlands','Belgium','Denmark','Luxembourg'], a:0, why:'The Netherlands is still commonly called Holland after its two best known provinces.' },
  { c:'general', q:'From which BS year was the SLC replaced by SEE in Nepal?', o:['2073 BS','2075 BS','2065 BS','2080 BS'], a:0, why:'The School Leaving Certificate became the Secondary Education Examination from 2073 BS.' },
  { c:'general', q:'How many years did Nelson Mandela spend in prison?', o:['27','25','30','18'], a:0, why:'Mandela spent 27 years in prison before his release in 1990.' },
  { c:'general', q:'Where will the FIFA World Cup 2034 be held?', o:['Saudi Arabia','United States','Qatar','Morocco'], a:0, why:'FIFA awarded the 2034 World Cup to Saudi Arabia.' },
  { c:'general', q:'Where was COP29, the 29th UN Climate Conference, held?', o:['Baku, Azerbaijan','Dubai, UAE','Sharm El-Sheikh, Egypt','Glasgow, Scotland'], a:0, why:'COP29 ran in Baku, Azerbaijan, in November 2024.' },
  { c:'general', q:'How many players from each team are on the field in kabaddi?', o:['7','5','9','11'], a:0, why:'Kabaddi sides field seven players each.' },
  { c:'general', q:'What is the national sport of Russia?', o:['Bandy','Ice hockey','Chess','Weightlifting'], a:0, why:"Russia's national sport is bandy, a form of ice hockey played on a football-sized rink." },
  { c:'general', q:"What is the full name of Rodri, winner of the 2024 men's Ballon d'Or?", o:['Rodrigo Hernández Cascante','Rodrigo de Paul','Rodrigo Fernández','Rodrigo Sánchez'], a:0, why:'Manchester City midfielder Rodri is Rodrigo Hernández Cascante.' },
  { c:'general', q:'What is the chemical symbol for tin?', o:['Sn','Ti','Tn','Si'], a:0, why:'Tin comes from the Latin stannum, hence Sn.' },
  { c:'general', q:'Which vitamins are found in rainwater?', o:['Vitamin B12','Vitamin C','Vitamin D','Vitamin K'], a:0, why:'Rainwater collects traces of vitamin B12 as it passes through the atmosphere.' },
  { c:'general', q:'Who is known as the "Snow Leopard" of Nepali mountaineering?', o:['Ang Rita Sherpa','Tenzing Norgay','Kami Rita Sherpa','Nirmal Purja'], a:0, why:'Ang Rita Sherpa earned the nickname Snow Leopard for his winter ascents of Everest.' }
];

const ACRO = [
  { ab:'TRF',  full:'The Rotary Foundation', o:['The Rotary Foundation','Total Rotary Fund','The Regional Fund','Trustees of Rotary Families'] },
  { ab:'PHF',  full:'Paul Harris Fellow', o:['Paul Harris Fellow','President of Honorary Fellows','Public Health Fund','Permanent Humanitarian Fund'] },
  { ab:'DDF',  full:'District Designated Fund', o:['District Designated Fund','District Development Fund','Direct Donation Facility','District Delegated Fund'] },
  { ab:'DGE',  full:'District Governor Elect', o:['District Governor Elect','District Grants Executive','Director General Elect','Deputy Governor Elect'] },
  { ab:'PETS', full:'Presidents Elect Training Seminar', o:['Presidents Elect Training Seminar','Program of Excellence for Team Spirit','Presidential Education and Training Session','Presidents Elect Trust Seminar'] },
  { ab:'GETS', full:'Governor Elect Training Seminar', o:['Governor Elect Training Seminar','Global Exchange and Training Session','Governors Excellence Team Seminar','General Education for Trusted Staff'] },
  { ab:'GSE',  full:'Group Study Exchange', o:['Group Study Exchange','Global Service Exchange','Graduate Student Exchange','Group Service Event'] },
  { ab:'RYLA', full:'Rotary Youth Leadership Awards', o:['Rotary Youth Leadership Awards','Rotary Youth Learning Academy','Rotarian Young Leaders Alliance','Rotary Youth Leadership Association'] },
  { ab:'ROTI', full:'Rotarians On The Internet', o:['Rotarians On The Internet','Rotaract On The Internet','Rotary Of The Islands','Rotarians Of The Year'] },
  { ab:'CATS', full:'Challenging All To Succeed', o:['Challenging All To Succeed','Club and Team Support','Community Action Team System','Charter and Training Seminar'] },
  { ab:'IPPC', full:'International Polio Plus Committee', o:['International Polio Plus Committee','International Public Policy Council','International Peace Promotion Council','Inter-provincial Polio Campaign'] },
  { ab:'YEO',  full:'Youth Exchange Officer', o:['Youth Exchange Officer','Young Entrepreneurs Organization','Youth Education Officer','Year-End Operations'] },
  { ab:'AG',   full:'Assistant Governor', o:['Assistant Governor','Area Governor','Association Governor','Annual Governor'] },
  { ab:'COL',  full:'Council On Legislation', o:['Council On Legislation','Council Of Leaders','Committee Of Legislation','Congress Of Law'] },
  { ab:'EREY', full:'Every Rotarian Every Year', o:['Every Rotarian Every Year','Every Region Every Year','Endowment for Rotarians Every Year','Equal Rotarian Youth'] },
  { ab:'MOP',  full:'Manual of Procedure', o:['Manual of Procedure','Master Operations Plan','Membership Operations Policy','Manual of Presidents'] },
  { ab:'PRIP', full:'Past Rotary International President', o:['Past Rotary International President','President Rotary International Programs','Permanent Rotary International Presence','Past Representative of International Presidents'] },
  { ab:'RCC',  full:'Rotary Community Corps', o:['Rotary Community Corps','Rotary Club Council','Regional Community Committee','Rotary Cultural Circle'] },
  { ab:'DTA',  full:'District Training Assembly', o:['District Training Assembly','District Technical Association','District Trustees Assembly','District Team Awards'] },
  { ab:'SAR',  full:'Semi Annual Report', o:['Semi Annual Report','Secretary Annual Review','Service Achievement Record','Strategic Action Review'] }
];

/* ---------------- helpers ---------------- */

const LETTERS = ['A', 'B', 'C', 'D'];
const QUIZ_CHIPS = ['all'].concat(Object.keys(CATS));
const STUDY_CHIPS = ['all'].concat(Object.keys(CATS)).concat(['acronyms']);
const CONFETTI_COLORS = ['#E11A6E', '#F2A900', '#1B1836', '#1c8a4d', '#A80F52'];

function catName(c) {
  return CATS[c] ? CATS[c].name : c;
}

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function pickQuestions(cat, n) {
  const pool = cat && cat !== 'all' ? BANK.filter((q) => q.c === cat) : BANK;
  return shuffle(pool).slice(0, n);
}

function verdictFor(pct) {
  if (pct === 1) return { t: 'Rotary Legend. 🏆', b: 'Flawless. You know the materials better than most club presidents. The district quiz has nothing on you.' };
  if (pct >= 0.8) return { t: 'District Ready. 🎓', b: 'Strong run. A quick pass through the study deck on your weak topics and you will be dangerous.' };
  if (pct >= 0.6) return { t: 'Solid Foundation. 🧱', b: 'You clearly understand the core. Review the misses below, then run it back.' };
  if (pct >= 0.4) return { t: 'Keep Training. 📈', b: 'The good news: every miss here is a fact you will never forget now. Study the deck and try again.' };
  return { t: 'Everyone Starts Here. 🌱', b: 'No shame at all. Flip through the study deck first, then come back and crush it.' };
}

const BREAK_HEAD = {
  fontSize: '.74rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: 'rgba(27,24,54,.4)',
  marginBottom: 8
};

/* ---------------- small components ---------------- */

function Confetti() {
  const [gone, setGone] = useState(false);
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        bg: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        dur: 1.4 + Math.random() * 1.6,
        delay: Math.random() * 0.5,
        rot: Math.random() * 360
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 3400);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;
  return (
    <div className="confetti-wrap">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: p.left + 'vw',
            background: p.bg,
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            transform: 'rotate(' + p.rot + 'deg)'
          }}
        />
      ))}
    </div>
  );
}

function Ring({ pct, score, label }) {
  const circ = 389.6;
  const off = circ - circ * Math.min(pct, 1);
  return (
    <div className="ring">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="62" fill="none" stroke="var(--line)" strokeWidth="12" />
        <circle cx="75" cy="75" r="62" fill="none" stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="389.6" strokeDashoffset={off} />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E11A6E" />
            <stop offset="100%" stopColor="#F2A900" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-val"><b>{score}</b><span>{label}</span></div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function QuizPage() {
  /* navigation */
  const [panel, setPanel] = useState(null);

  const showPanel = (name) => {
    setPanel(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* study deck */
  const [deckCat, setDeckCat] = useState('all');
  const [deckIdx, setDeckIdx] = useState(0);
  const [deckFlipped, setDeckFlipped] = useState(false);

  const deckCards = useMemo(
    () =>
      BANK.map((q) => ({ c: q.c, q: q.q, a: q.o[q.a], why: q.why }))
        .concat(
          ACRO.map((a) => ({
            c: 'acronyms',
            q: 'What does "' + a.ab + '" stand for?',
            a: a.full,
            why: "Acronyms are Rotary's shorthand. The reading materials list over 200 of them."
          }))
        ),
    []
  );
  const deckList = useMemo(() => deckCards.filter((c) => deckCat === 'all' || c.c === deckCat), [deckCat, deckCards]);
  const effIdx = deckList.length ? deckIdx % deckList.length : 0;
  const deckCard = deckList[effIdx];

  const deckNav = (d) => {
    const n = deckList.length;
    if (!n) return;
    setDeckIdx((deckIdx + d + n) % n);
    setDeckFlipped(false);
  };

  /* quiz challenge */
  const [quizCat, setQuizCat] = useState('all');
  const [quizStage, setQuizStage] = useState('setup'); /* setup | play | result */
  const [quizQ, setQuizQ] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPts, setQuizPts] = useState(0);
  const [quizHearts, setQuizHearts] = useState(3);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizMissed, setQuizMissed] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [quizFb, setQuizFb] = useState(null);
  const [qzPct, setQzPct] = useState(0);

  const quizStart = () => {
    let qs = pickQuestions(quizCat, 10);
    if (qs.length < 10) {
      const extra = shuffle(BANK.filter((q) => qs.indexOf(q) === -1));
      qs = qs.concat(extra.slice(0, 10 - qs.length));
    }
    setQuizQ(qs);
    setQuizIdx(0);
    setQuizScore(0);
    setQuizPts(0);
    setQuizHearts(3);
    setQuizStreak(0);
    setQuizMissed([]);
    setQuizAnswered(null);
    setQuizFb(null);
    setQuizStage('play');
  };

  const quizPick = (i) => {
    if (quizAnswered !== null) return;
    const q = quizQ[quizIdx];
    const right = i === q.a;
    if (right) {
      const streak = quizStreak + 1;
      setQuizStreak(streak);
      setQuizPts(quizPts + 100 + Math.min(quizStreak, 5) * 20);
      setQuizScore(quizScore + 1);
      setQuizFb({ good: true, b: streak > 1 ? 'Nice streak! 🔥' : 'Correct!', s: q.why });
    } else {
      setQuizStreak(0);
      setQuizHearts(quizHearts - 1);
      setQuizMissed(quizMissed.concat(q));
      setQuizFb({ good: false, b: 'The answer is ' + q.o[q.a] + '.', s: q.why });
    }
    setQuizAnswered(i);
  };

  const quizNext = () => {
    if (quizHearts <= 0 || quizIdx === quizQ.length - 1) {
      const pct = quizQ.length ? quizScore / quizQ.length : 0;
      setQzPct(pct);
      setQuizStage('result');
      if (pct >= 0.8) setConfettiId((n) => n + 1);
    } else {
      setQuizIdx(quizIdx + 1);
      setQuizAnswered(null);
      setQuizFb(null);
    }
  };

  const quizQBar = quizQ.length ? Math.round((quizIdx / quizQ.length) * 100) + '%' : '0%';
  const qzNextLabel = quizHearts <= 0 || quizIdx === quizQ.length - 1 ? 'See your score →' : 'Next →';

  const perCat = {};
  quizQ.forEach((q) => {
    if (!perCat[q.c]) perCat[q.c] = { ok: 0, tot: 0 };
    perCat[q.c].tot++;
  });
  quizMissed.forEach((q) => {
    if (perCat[q.c]) perCat[q.c].ok++;
  });
  const catNames = Object.keys(perCat);

  /* acronym sprint */
  const [spStage, setSpStage] = useState('setup'); /* setup | play | result */
  const [spQ, setSpQ] = useState([]);
  const [spIdx, setSpIdx] = useState(0);
  const [spPts, setSpPts] = useState(0);
  const [spStreak, setSpStreak] = useState(0);
  const [spMissed, setSpMissed] = useState([]);
  const [spOpts, setSpOpts] = useState([]);
  const [spAnswered, setSpAnswered] = useState(null);
  const [spFb, setSpFb] = useState(null);
  const [spLeft, setSpLeft] = useState(6);
  const [spPct, setSpPct] = useState(0);

  const [confettiId, setConfettiId] = useState(0);

  const spStart = () => {
    const qs = shuffle(ACRO).slice(0, 15);
    setSpQ(qs);
    setSpIdx(0);
    setSpPts(0);
    setSpStreak(0);
    setSpMissed([]);
    setSpOpts(shuffle(qs[0].o));
    setSpAnswered(null);
    setSpFb(null);
    setSpLeft(6);
    setSpStage('play');
  };

  const spAnswer = (v) => {
    if (spAnswered !== null) return;
    const a = spQ[spIdx];
    const right = v === a.full;
    if (right) {
      const streak = spStreak + 1;
      setSpStreak(streak);
      setSpPts(spPts + 100 + Math.min(spStreak, 5) * 20);
      setSpFb({ good: true, b: streak > 1 ? 'On fire! 🔥' : 'Fast and correct!', s: a.ab + ' stands for ' + a.full + '.' });
    } else {
      setSpStreak(0);
      setSpMissed(spMissed.concat(a));
      setSpFb({ good: false, b: v ? 'Not quite.' : "Time's up!", s: a.ab + ' stands for ' + a.full + '.' });
    }
    setSpAnswered(v);
  };

  const spNext = () => {
    if (spIdx === spQ.length - 1) {
      const ok = spQ.length - spMissed.length;
      const pct = spQ.length ? ok / spQ.length : 0;
      setSpPct(pct);
      setSpStage('result');
      if (pct >= 0.8) setConfettiId((n) => n + 1);
    } else {
      setSpIdx(spIdx + 1);
      setSpOpts(shuffle(spQ[spIdx + 1].o));
      setSpAnswered(null);
      setSpFb(null);
      setSpLeft(6);
    }
  };

  const spQBarPct = Math.max(0, (spLeft / 6) * 100);
  const spTimerBg =
    spQBarPct < 30
      ? '#C0392B'
      : spQBarPct < 55
        ? 'var(--gold)'
        : 'linear-gradient(90deg, #1c8a4d, var(--gold))';
  const spNextLabel = spIdx === spQ.length - 1 ? 'See your score →' : 'Next →';

  /* sprint countdown timer */
  const spAnswerRef = useRef(null);
  spAnswerRef.current = spAnswer;

  useEffect(() => {
    if (spStage !== 'play' || spAnswered !== null) return undefined;
    let left = 6;
    setSpLeft(6);
    const id = setInterval(() => {
      left = Math.max(0, left - 0.1);
      setSpLeft(left);
      if (left <= 0) {
        clearInterval(id);
        spAnswerRef.current(null);
      }
    }, 100);
    return () => clearInterval(id);
  }, [spStage, spIdx, spAnswered]);

  /* keyboard shortcuts */
  const keyHandlersRef = useRef(null);
  keyHandlersRef.current = { deckNav, deckFlip: () => setDeckFlipped((f) => !f), quizPick, quizNext, spAnswer, spNext };

  useEffect(() => {
    const onKey = (e) => {
      const h = keyHandlersRef.current;
      if (panel === 'study') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          h.deckNav(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          h.deckNav(1);
        } else if (e.code === 'Space') {
          e.preventDefault();
          h.deckFlip();
        }
      }
      if (panel === 'quiz' && quizStage === 'play') {
        if (quizAnswered === null) {
          const idx = ['1', '2', '3', '4'].indexOf(e.key);
          if (idx > -1) {
            e.preventDefault();
            h.quizPick(idx);
            return;
          }
        }
        if (e.key === 'Enter' && quizAnswered !== null) {
          e.preventDefault();
          h.quizNext();
        }
      }
      if (panel === 'sprint' && spStage === 'play') {
        if (spAnswered === null) {
          const idx = ['1', '2', '3', '4'].indexOf(e.key);
          if (idx > -1) {
            e.preventDefault();
            h.spAnswer(spOpts[idx]);
            return;
          }
        }
        if (e.key === 'Enter' && spAnswered !== null) {
          e.preventDefault();
          h.spNext();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panel, quizStage, quizAnswered, spStage, spAnswered, spOpts]);

  const spResPct = spQ.length ? (spQ.length - spMissed.length) / spQ.length : 0;
  const spBase = verdictFor(spResPct);
  const spVerdictTxt = spResPct === 1 ? 'Decoding Machine. 🏆' : spBase.t;
  const spVerdictBlurb = spResPct === 1 ? 'Every acronym, no hesitation. The quiz committee is calling you.' : spBase.b;

  return (
    <SiteShell
      current="quiz"
      cta="join"
      title="Rota Quiz Training Ground | Zone 7 Rotaract"
      css={pageCss}
    >
      <header className="hero">
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span>Rota Quiz 25-26 · Official Reading Materials</div>
          <h1>Train like the quiz is tomorrow.</h1>
          <p className="sub">District 3292 runs a real Rota Quiz every year, and these questions come straight from the official reading materials. Learn with flashcards, test yourself with a challenge that gives you hearts, streaks and instant explanations, then prove you know your acronyms.</p>
          <p className="note">Source documents: <a href="/guides/Rotary-Rotaract-Reading-Materials-Rota-Quiz-2025-26.pdf" target="_blank" rel="noopener noreferrer">Rotary-Rotaract Reading Materials 2025-26 (PDF)</a> and <a href="/guides/Reading%20materials%20for%20Rota%20Quiz%2025-26.pdf" target="_blank" rel="noopener noreferrer">Reading Materials for Rota Quiz 25-26 (PDF)</a>. Every fact here is pulled from those pages.</p>
        </div>
      </header>

      <div className="wrap">
        {confettiId > 0 && <Confetti key={confettiId} />}

        {panel === null && (
          <div className="modes">
            <button className="mode-card" onClick={() => showPanel('study')}>
              <div className="mode-ico">📚</div>
              <h3>Study Deck</h3>
              <p>Flip through every fact like flashcards. Filter by topic, shuffle the order, and let the answer sink in before you are ever tested on it.</p>
              <div className="mode-meta"><span className="meta-chip">{deckCards.length} cards</span><span className="meta-chip">Tap to flip</span></div>
            </button>
            <button className="mode-card" onClick={() => showPanel('quiz')}>
              <div className="mode-ico">🎯</div>
              <h3>Quiz Challenge</h3>
              <p>Ten questions, three hearts, streak bonuses. Miss an answer and you will learn why, right there, before moving on.</p>
              <div className="mode-meta"><span className="meta-chip hot">❤️ 3 lives</span><span className="meta-chip">🔥 Streaks</span></div>
            </button>
            <button className="mode-card" onClick={() => showPanel('sprint')}>
              <div className="mode-ico">⚡</div>
              <h3>Acronym Sprint</h3>
              <p>Rotary loves initials. Decode them fast, one after another, before the timer runs out. Pure speed round.</p>
              <div className="mode-meta"><span className="meta-chip hot">⏱ 6s each</span><span className="meta-chip">15 rounds</span></div>
            </button>
          </div>
        )}

        {/* study deck */}
        <div className={`panel ${panel === 'study' ? 'active' : ''}`} id="panelStudy">
          <div className="p-head">
            <button className="p-back" onClick={() => showPanel(null)}>← Back to modes</button>
            <div className="chip-row">
              {STUDY_CHIPS.map((c) => (
                <button
                  key={c}
                  className={`chip${c === deckCat ? ' active' : ''}`}
                  onClick={() => {
                    setDeckCat(c);
                    setDeckIdx(0);
                    setDeckFlipped(false);
                  }}
                >
                  {c === 'all' ? 'All topics' : catName(c)}
                </button>
              ))}
            </div>
          </div>
          <div className="stage">
            <div className="deck-tools">
              <span className="deck-count">Card {effIdx + 1} of {deckList.length}</span>
              <div className="chip-row">
                <button
                  className="chip"
                  onClick={() => setDeckIdx(deckList.length ? Math.floor(Math.random() * deckList.length) : 0)}
                >
                  🔀 Shuffle
                </button>
              </div>
            </div>
            <div className="deck-progress"><span style={{ width: deckList.length ? Math.round(((effIdx + 1) / deckList.length) * 100) + '%' : '0%' }}></span></div>
            {deckCard && (
              <div className="flash-card" onClick={() => setDeckFlipped((f) => !f)}>
                <span className="f-cat">{(CATS[deckCard.c] ? CATS[deckCard.c].icon + ' ' : '🔤 ') + catName(deckCard.c)}</span>
                <span className="f-flip">tap to flip · space</span>
                {deckFlipped ? (
                  <div id="fBack">
                    <div className="f-a">{deckCard.a}</div>
                    {deckCard.why ? <div className="f-why">{deckCard.why}</div> : null}
                  </div>
                ) : (
                  <div id="fFront" className="f-q">{deckCard.q}</div>
                )}
              </div>
            )}
            <div className="deck-nav">
              <button className="ghost" onClick={() => deckNav(-1)}>← Previous</button>
              <button onClick={() => deckNav(1)}>Next →</button>
            </div>
            <div className="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>space</kbd> flip</div>
          </div>
        </div>

        {/* quiz challenge */}
        <div className={`panel ${panel === 'quiz' ? 'active' : ''}`} id="panelQuiz">
          <div className="p-head">
            <button className="p-back" onClick={() => showPanel(null)}>← Back to modes</button>
            <div className="chip-row">
              {QUIZ_CHIPS.map((c) => (
                <button key={c} className={`chip${c === quizCat ? ' active' : ''}`} onClick={() => setQuizCat(c)}>
                  {c === 'all' ? 'Full mix' : CATS[c].name}
                </button>
              ))}
            </div>
          </div>
          <div className="stage">
            {quizStage === 'setup' && (
              <div id="qzSetup">
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Pick your battlefield.</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(27,24,54,.6)', marginBottom: 22, lineHeight: 1.6 }}>Choose one topic for a focused run, or take the full mix. Ten questions either way, drawn fresh from the bank.</p>
                <div className="chip-row" style={{ marginBottom: 24 }}>
                  {QUIZ_CHIPS.map((c) => (
                    <button key={c} className={`chip${c === quizCat ? ' active' : ''}`} onClick={() => setQuizCat(c)}>
                      {c === 'all' ? 'Full mix' : CATS[c].name}
                    </button>
                  ))}
                </div>
                <button className="btn gold" onClick={quizStart}>Start the Challenge →</button>
              </div>
            )}

            {quizStage === 'play' && quizQ[quizIdx] && (
              <div id="qzPlay">
                <div className="hud">
                  <div className="hud-item">Hearts <span className="hearts">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={i < quizHearts ? '' : 'lost'}>❤️</span>
                    ))}
                  </span></div>
                  <div className="hud-item streak" style={{ display: quizStreak > 0 ? 'inline-flex' : 'none' }}>🔥 ×<span>{quizStreak}</span></div>
                  <div className="hud-item points">💯 <span>{quizPts}</span></div>
                </div>
                <div className="q-progress">Question {quizIdx + 1} of {quizQ.length}</div>
                <div className="q-bar"><span style={{ width: quizQBar }}></span></div>
                <div id="qzQ">
                  <h3>{quizQ[quizIdx].q}</h3>
                  <div className="q-opts">
                    {quizQ[quizIdx].o.map((opt, i) => {
                      const cls =
                        quizAnswered === null
                          ? 'q-opt'
                          : i === quizQ[quizIdx].a
                            ? 'q-opt correct'
                            : i === quizAnswered
                              ? 'q-opt wrong'
                              : 'q-opt';
                      return (
                        <button key={i} className={cls} disabled={quizAnswered !== null} onClick={() => quizPick(i)}>
                          <span className="letter">{LETTERS[i]}</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {quizFb && (
                    <div className={`q-feedback show ${quizFb.good ? 'good' : 'bad'}`}>
                      <b>{quizFb.b}</b>
                      <span>{quizFb.s}</span>
                    </div>
                  )}
                  <button className={`q-next${quizAnswered !== null ? ' show' : ''}`} onClick={quizNext}>{qzNextLabel}</button>
                </div>
              </div>
            )}

            {quizStage === 'result' && (
              <div className="result show">
                <Ring pct={qzPct} score={`${quizScore}/${quizQ.length}`} label="correct" />
                <h3>{verdictFor(qzPct).t}</h3>
                <p className="blurb">{verdictFor(qzPct).b}</p>
                <p className="pt-line">{quizPts} points · best streak {Math.max(quizStreak, 1)}×</p>
                {catNames.length > 1 && (
                  <div className="cat-break">
                    <div style={BREAK_HEAD}>By topic</div>
                    {catNames.map((c) => {
                      const d = perCat[c];
                      const p = Math.round(((d.tot - d.ok) / d.tot) * 100);
                      return (
                        <div className="cb" key={c}>
                          <span>{catName(c)}</span>
                          <div className="cb-bar"><span style={{ width: (100 - p) + '%' }}></span></div>
                          <span className="cb-n">{d.tot - d.ok}/{d.tot}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {quizMissed.length > 0 && (
                  <div className="review">
                    <div style={BREAK_HEAD}>Review your misses</div>
                    {quizMissed.map((q, i) => (
                      <div className="rv" key={i}>
                        <b>{q.q}</b><br />
                        <span className="rv-a">{q.o[q.a]}</span> · {q.why}
                      </div>
                    ))}
                  </div>
                )}
                <div className="btns">
                  <button className="btn" onClick={quizStart}>Run it back →</button>
                  <button className="btn ghost" onClick={() => showPanel('study')}>Study the deck</button>
                  <button className="btn ghost" onClick={() => showPanel('sprint')}>Acronym sprint</button>
                  <Link className="btn ghost" to="/join">Join a club</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* acronym sprint */}
        <div className={`panel ${panel === 'sprint' ? 'active' : ''}`} id="panelSprint">
          <div className="p-head">
            <button className="p-back" onClick={() => showPanel(null)}>← Back to modes</button>
          </div>
          <div className="stage">
            {spStage === 'setup' && (
              <div id="spSetup">
                <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Acronym sprint.</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(27,24,54,.6)', marginBottom: 22, lineHeight: 1.6 }}>Fifteen initials, six seconds each. Answer fast, keep the streak alive, and finish with a score your club will hear about.</p>
                <button className="btn gold" onClick={spStart}>Start the Sprint →</button>
              </div>
            )}

            {spStage === 'play' && spQ[spIdx] && (
              <div id="spPlay">
                <div className="hud">
                  <div className="hud-item">Round <span>{spIdx + 1}/{spQ.length}</span></div>
                  <div className="hud-item streak" style={{ display: spStreak > 0 ? 'inline-flex' : 'none' }}>🔥 ×<span>{spStreak}</span></div>
                  <div className="hud-item sprint-score">{spPts} pts</div>
                </div>
                <div className="timer-bar"><span style={{ width: spQBarPct + '%', background: spTimerBg }}></span></div>
                <div id="spQ">
                  <h3 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', textAlign: 'center', letterSpacing: '0.04em', marginBottom: 24 }}>{spQ[spIdx].ab}</h3>
                  <div className="q-opts">
                    {spOpts.map((opt, i) => {
                      const cls =
                        spAnswered === null
                          ? 'q-opt'
                          : opt === spQ[spIdx].full
                            ? 'q-opt correct'
                            : opt === spAnswered
                              ? 'q-opt wrong'
                              : 'q-opt';
                      return (
                        <button key={i} className={cls} disabled={spAnswered !== null} onClick={() => spAnswer(opt)}>
                          <span className="letter">{LETTERS[i]}</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {spFb && (
                    <div className={`q-feedback show ${spFb.good ? 'good' : 'bad'}`}>
                      <b>{spFb.b}</b>
                      <span>{spFb.s}</span>
                    </div>
                  )}
                  <button className={`q-next${spAnswered !== null ? ' show' : ''}`} onClick={spNext}>{spNextLabel}</button>
                </div>
              </div>
            )}

            {spStage === 'result' && (
              <div className="result show">
                <Ring pct={spPct} score={`${spQ.length - spMissed.length}/${spQ.length}`} label="decoded" />
                <h3>{spVerdictTxt}</h3>
                <p className="blurb">{spVerdictBlurb}</p>
                {spMissed.length > 0 && (
                  <div className="review">
                    <div style={BREAK_HEAD}>Missed acronyms</div>
                    {spMissed.map((a, i) => (
                      <div className="rv" key={i}>
                        <b>{a.ab}</b> · <span className="rv-a">{a.full}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="btns">
                  <button className="btn" onClick={spStart}>Run it back →</button>
                  <button className="btn ghost" onClick={() => showPanel('study')}>Study the deck</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
