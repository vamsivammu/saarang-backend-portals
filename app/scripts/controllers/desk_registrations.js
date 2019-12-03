'use strict';

angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('desk_registrations', {
        url: '/desk_registrations',
        templateUrl: 'views/desk_registrations.html',
        controller: 'DeskRegistrationsCtrl',
        authenticate: true,
        department: "Hospitality"
      });
  })
 .controller('DeskRegistrationsCtrl',['$scope', '$mdDialog','$rootScope', '$http', '$window','$localStorage','$state', function ($scope, $mdDialog,$rootScope, $http, $window,$localStorage,$state) {
  $scope.sortType = 'saarang_id';       /*table variables*/
 	$scope.sortReverse = false;
 	$scope.searchTag = '';
  $scope.currentPage = 1;
  $scope.searchFilter='mobile';

  $scope.GetData = function(pagenumber) {
    $scope.allusers = [];
    var x = {};
    var ilike = '%';
    $scope.change =function(){
   $scope.searchTag="";
   $scope.GetData(1);
  }
    if($scope.searchTag) ilike = '%' + $scope.searchTag + '%';
    x[$scope.searchFilter] = {"$ilike": ilike};
    $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "users_2019", "where": x}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, "X-Hasura-Role" : "core"}})
      .then(function(response) {
        response = response.data;
        $scope.total_entries = response.count;
      });
    var offset = (pagenumber-1)*20;
    var order_by = "";
    if (!$scope.sortReverse) order_by = $scope.sortType;
    else order_by = "-" + $scope.sortType;
    $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "users_2019", "columns": ["*"], "where": x, "order_by": order_by, "limit": 20, "offset": offset}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, "X-Hasura-Role" : "core"}})
      .then(function(response) {
        $scope.allusers = response.data;
      });

    $scope.collegelist = [{"a":"A.C.Patil College of Engineering"},{"a":"A.D. Patel Inst. Of Tech"},{"a":"A.J. Institute of Medical Sciences & Research Centre"},{"a":"A.J.K Mass Communication Research Centre"},{"a":"A.S.L. Pauls College of Engineering and Technology"},{"a":"A.V.Parekh Technical Institute"},{"a":"Aayojan school of Architecture - Jaipur"},{"a":"Abasaheb Garware College"},{"a":"Acharya Institute of Technology"},{"a":"Acharya Narendra Dev College No.3"},{"a":"Acharya Pathashala Rural College of Engineering"},{"a":"Adhitya Institute of Technology"},{"a":"Adichunchanagiri Institute of Technology"},{"a":"Aditi Mahavidyalaya"},{"a":"AGNI"},{"a":"Ahmedabad Instiute of Technology\n Nr. Vasantnagar Township"},{"a":"AISAT"},{"a":"AITA HOTEL MANAGEMENTMR"},{"a":"Ajmer Institute of Technology, Ajmer"},{"a":"Akshaya College of Engineering & Technology"},{"a":"ALAGAPPA"},{"a":"All India Institute of Medical Sciences (AIIMS) Jodhpur"},{"a":"All India Shri Shivaji Memorial Society's\n College of Engineering"},{"a":"Alpha College of Engineering"},{"a":"Amal Jyothi College of Engineering"},{"a":"Ambiga College of Arts and Science"},{"a":"AMC Engineering College"},{"a":"AMET"},{"a":"Amity university sector 125"},{"a":"Amrita Institute of Technology & Science"},{"a":"Amrita University"},{"a":"Amrita Vishwa Vidyapeetham"},{"a":"Andhra university (engineering)"},{"a":"Andhra university engineering campus for women"},{"a":"Angappa College of Arts and Science"},{"a":"ANITS"},{"a":"Anjuman Engineering College"},{"a":"ANNA ADARSH"},{"a":"ANNA CEG"},{"a":"Annai Fathima College of Arts and Science"},{"a":"Ansal University"},{"a":"Anuradha College Of Pharmacy"},{"a":"Apeejay Stya University"},{"a":"APEX Institute of Management And Science - Jaipur"},{"a":"Appolo Institute of Medical Science and Research"},{"a":"ARCH Academy of Fashion, Arts And Design - Jaipur"},{"a":"Arignar Anna Government Arts College"},{"a":"Arjun College of Technology"},{"a":"Armed Forces Medical College"},{"a":"Arul Anandar College"},{"a":"Arya College of Engineering And Information Technology - Jaipur"},{"a":"Arya Vidyapith College"},{"a":"Aryabatta college"},{"a":"Asian College of Engineering and Technology"},{"a":"Assam Engineering College"},{"a":"Assam Science And Technology University"},{"a":"Atma Ram Sanatan Dharma College"},{"a":"Atmiya Institute of Technology & Science"},{"a":"Atria Institute of Technology"},{"a":"Avanthi engineering and pharmaceutical college"},{"a":"Avinashilingam University for Women"},{"a":"B Bharatiya Vidya Bhavan's Sardar Patel College"},{"a":"B.M.S College of Engineering"},{"a":"B.M.S. Institute of Technology"},{"a":"B.N.M. Institute of Technology"},{"a":"B.V.Bhoomraddi College of Engineering and Technology"},{"a":"Baba institute of technology"},{"a":"Babaria Instiute of Technology"},{"a":"Bahubali College of Engineering"},{"a":"Banasthali University, Banasthali"},{"a":"Bangalore College of Engineering"},{"a":"Bangalore College of Engineering and Technology"},{"a":"Bangalore Institute of Technology"},{"a":"Bangalore Technical Foundation Trust"},{"a":"Bapuji institute of Engineering"},{"a":"Bapurao Deshmukh College of Engineering"},{"a":"Basavakalyan Engineering College"},{"a":"Basaveshwara Engineering College"},{"a":"Bellary Rural Engineering College"},{"a":"Bellary Veerashaiva Vidyavardhaka Sangha's Proudadevaraya Institute of Technology"},{"a":"Beltola College,"},{"a":"Bhadruka College"},{"a":"Bhagini Niveditha College"},{"a":"Bharata Matha College"},{"a":"BHARATH"},{"a":"Bharathi College"},{"a":"Bharathi women's college"},{"a":"Bharati Vidyapeeth's College of Architecture"},{"a":"Bharti Vidyapeeth's College of Engineering"},{"a":"Bhavans Vivekanada College"},{"a":"Bhim Rao Ambedkar College"},{"a":"Birla Institute of Technology - Jaipur"},{"a":"Birla Vishvakarma Mahavidhyalaya"},{"a":"Bishop Ambrose College"},{"a":"Bishop Heber College"},{"a":"BITS PILANI HYD CAMPUS"},{"a":"BTL Institute of Technology & Management"},{"a":"C M S College of Engineering and Technology"},{"a":"C.A.R.E Group of Institutions"},{"a":"C.A.R.E School of Architecture"},{"a":"C.B.M College"},{"a":"C.K. Pithwala College of Engg & Technology Dumas Road"},{"a":"C.M.S. College of Science and Commerce"},{"a":"C.R. Engineering College"},{"a":"C.S.I. Bishop Appasamy College of Arts and Science"},{"a":"C.S.I. Darling Selvabai Thavaraj David College of Arts and Science for Women"},{"a":"C.U.shah college of engg &technology"},{"a":"Calicut University Institute of Engineering and Technology"},{"a":"Canara College"},{"a":"Capital College of Architecture"},{"a":"Cauvery College for Women"},{"a":"Cauvery College of Engineering and Technology"},{"a":"Central Electrochemical Research Institute"},{"a":"CENTRAL POLYTECHNIC"},{"a":"Centurion Institute of Professional Studies - Jaipur"},{"a":"Ch. Charan Singh National Institute of Agricultural Marketing - Jaipur"},{"a":"Chaitanya Bharathi Institute of Technology.(CBIT)"},{"a":"Chaitanya college"},{"a":"Charotar Institute of Technology"},{"a":"Cherran College for Women"},{"a":"Chettinad College of Arts and Science"},{"a":"Chidambaram Pillai College of Women"},{"a":"Chikkanna Government Arts College"},{"a":"Christ the King Engineering College"},{"a":"Christ University, Bangalore"},{"a":"Christhu Raj College"},{"a":"CIT"},{"a":"CMR Institute of Technology"},{"a":"CMS College"},{"a":"Cochin University College of Engineering Kuttanad"},{"a":"Coimbatore Institute of Engineering and Technology"},{"a":"Coimbatore Institute of Tehnology"},{"a":"Coimbatore Medical College"},{"a":"College of Architecture"},{"a":"College Of Architecture"},{"a":"College of Arts"},{"a":"College of Engineering"},{"a":"College of Engineering Attingal"},{"a":"College of Engineering Chengannur"},{"a":"College of Engineering Kalloopara"},{"a":"College of Engineering, Adoor"},{"a":"College of Engineering, Cherthala"},{"a":"College of Engineering, Kannanur"},{"a":"College of Engineering, Karunagapally"},{"a":"College of Engineering, Kottarakkara"},{"a":"College of Engineering, Poonjar"},{"a":"College of Engineering, Pune"},{"a":"College of Fisheries"},{"a":"College of Hospitality Administration - Jaipur"},{"a":"College of Military Engineering"},{"a":"Compucom Institute of Information Technology And Management - Jaipur"},{"a":"Coorg Institute of Technology"},{"a":"Cotton College State University,"},{"a":"CRESCENT"},{"a":"CUSAT"},{"a":"CUSROW WADIA INSTITUTE OF TECHNOLOGY"},{"a":"CVR"},{"a":"CVR College of engineering"},{"a":"CVSR College of engineering"},{"a":"D.N.Patel College of Engineering"},{"a":"D.Y.Patil College of Engineering and Technology"},{"a":"Daulat Ram College"},{"a":"Dayanand Sagar College of Engineering\n Shavige Maleshwara Hills"},{"a":"Deen Dayal Upadhyaya College"},{"a":"Deepshikha College of Technical Education - Jaipur"},{"a":"Delhi College of Arts and Commerce\n Netaji Nagar"},{"a":"Delhi Technological University"},{"a":"Department of Chemical Technology, Matunga road"},{"a":"Deshbandhu college"},{"a":"Designed Environment Academy and Research Institute"},{"a":"DG VAISHNAV"},{"a":"DHAANISH"},{"a":"Dhaanish Ahmed Institute of Technology"},{"a":"Dhanalakshmi Srinivasan College of Engineering"},{"a":"Dhanalakshmi Srinivasan Institute of Technology"},{"a":"Dharmsinh Desai University College Road"},{"a":"Dhirubhai Ambani Institute of Information and Communication TechnologyNear Indroda Circle"},{"a":"Dhruva College of Management"},{"a":"Don Bosco Institute of Technology"},{"a":"Don Bosco University"},{"a":"Down Town University,"},{"a":"Dr DY Patil Institute of Engineering and Technology Sector -29"},{"a":"Dr. Ambedkar Institute of Technology"},{"a":"Dr. B. Lal Institute of Biotechnology - Jaipur"},{"a":"Dr. Bhanuben Nanavati College of Architecture for Women"},{"a":"Dr. GR Damadaran College of Science"},{"a":"Dr. Lankinapalli Bullayya college"},{"a":"Dr. Mahalingam College of Engineering and Technology"},{"a":"Dr. N G P Institute of Technology"},{"a":"Dr. NGP Arts and Science College"},{"a":"Dr. RV Arts and Science College"},{"a":"Dr. SNS Rajalakshmi College of Arts and Science"},{"a":"Dr.T.Thimmaiah Institute of Technology"},{"a":"Dwarkadas J. Sanghvi College of Engineering"},{"a":"E.M.G. Yadava Women's College"},{"a":"Easa College of Engineering and Technology"},{"a":"EASHWARI"},{"a":"East Point College of Engineering &Technology"},{"a":"East West Institute of Technology"},{"a":"EMPEE HOTEL MANAGEMENT"},{"a":"ETHIRAJ"},{"a":"Faculty of Engineering and Technology"},{"a":"Farook College"},{"a":"Father Muller Medical College"},{"a":"Fatima College"},{"a":"Fatima Michael College of Engineering and Technology"},{"a":"Federal Institute of Science and Tech."},{"a":"Fergusson College"},{"a":"Fr. Conceicao Rodrigues"},{"a":"G. Narayanamma Institute of Technologynology and Science"},{"a":"G.H. Patel College of Engg. & Technology"},{"a":"Galgotias University"},{"a":"Gargi College"},{"a":"Gauhati University,"},{"a":"Gayatri vidya parishad"},{"a":"Gayatri vidya parishad (R)"},{"a":"Gayatri vidya parishad degree"},{"a":"GEC Barton Hill"},{"a":"Geethanjali College of Engineering and Technologynology."},{"a":"Ghousia College of engineering"},{"a":"Girijananda Chowdhury Institute Of Management And Tech,"},{"a":"Gitam University"},{"a":"Global Academy of Technology"},{"a":"Global Institute of Technology - Jaipur"},{"a":"Gokaraju Rangaraju College of pharmacy"},{"a":"Gokaraju Rangaraju Institute of Engineering Technologynology(GRIET)"},{"a":"Golden valley Institute ofnTechnology"},{"a":"Government Arts College"},{"a":"Government College of Engineering"},{"a":"Government College of Engineering - Dharmapuri"},{"a":"Government College of Engineering - Srirangam"},{"a":"Government College of Engineering and Technology, Bikaner"},{"a":"Government College of Engineering, Bodiyanayakkanur"},{"a":"Government college of Technology"},{"a":"Government Engineering College"},{"a":"Government engineering college\n GEB cross road"},{"a":"Government Engineering College Modasa"},{"a":"Government Engineering Colleged"},{"a":"Government Law College"},{"a":"Government Sivagangai Medical College and Hospital"},{"a":"Government Theni Medical College"},{"a":"Government Thiruvarur Medical College"},{"a":"Government Tiruvanamalai Medical College and Hospital"},{"a":"Government Vellore Medical College"},{"a":"Government Villupuram Medical College"},{"a":"Govindadasa College"},{"a":"Govt. Engineering College"},{"a":"Govt. Engineering College Kannur"},{"a":"Govt. Engineering College Kozhikode"},{"a":"Govt. Engineering College Thrissur"},{"a":"Govt. Engineering College, Bhuj"},{"a":"Govt. Model Engineering College"},{"a":"GURU NANAK"},{"a":"Gurunanak College of Engineering"},{"a":"Gurunanak Dev Engineering College"},{"a":"Guwahati Medical College,"},{"a":"Gyan Vihar School of Engineering And Technology - Jaipur"},{"a":"H.M.S. Institute of Technology"},{"a":"Hans Raj College"},{"a":"Harish Chandra Mathur Rajasthan State Institute of Public Administration"},{"a":"Hazrat Khwaja Khuthubuddin Bakthiar Kaki College of Engg."},{"a":"Heera College of Engineering and Technology"},{"a":"Hindu College"},{"a":"HINDUSTAN"},{"a":"Hindustan College of Engineering and Technology"},{"a":"Hindustan Electronics Academy"},{"a":"Hindusthan College of Arts and Science"},{"a":"Hindusthan Institute of Technology"},{"a":"HKBK College of Engineering"},{"a":"Holy Cross College"},{"a":"I E S College of Engineering"},{"a":"IBS"},{"a":"IFHE University of law"},{"a":"IHM CHENNAI"},{"a":"IHM Sri Shakthi"},{"a":"IIIT Hyderabad"},{"a":"IIIT, Pune"},{"a":"IISER"},{"a":"IIST"},{"a":"IIT Madras"},{"a":"IIT Hyderabad"},{"a":"IIT Kharagpur"},{"a":"IITDM"},{"a":"Indian Institute Of Information Technology, Guwahati"},{"a":"Indian Institute of Management (IIM), Kozhikode"},{"a":"Indian Institute of Management Udaipur"},{"a":"Indian Institute of Management, Bangalore"},{"a":"Indian Institute of Science"},{"a":"Indian Institute of Science Education and Research"},{"a":"Indian Institute of Technology (IIT), Palakkad"},{"a":"Indian Institute of Technology Bombay"},{"a":"Indian Institute of Technology Delhi"},{"a":"Indian Institute Of Technology, Guwahati"},{"a":"Indian Institute of Technology, Jodhpur"},{"a":"INDIAN MARITIME UNIVERSITY"},{"a":"Indira Gandhi Medical College & Research Institute"},{"a":"Indra Ganesan College of Engineering"},{"a":"Indraprastha College for Women"},{"a":"Indraprastha Institute Of Information Technology"},{"a":"Indus College of Engineering"},{"a":"Info Institute of Engineering"},{"a":"Institute of Home Economics"},{"a":"International College for Girls - Jaipur"},{"a":"IRT Perundurai Medical College"},{"a":"Islamia Institute of Technology"},{"a":"J C T College of Engineering and Technology"},{"a":"J.J. College of Engineering and Technology"},{"a":"Jai hind college"},{"a":"Jaipur Engineering College - Jaipur"},{"a":"Jaipur Engineering College and Research Centre, Jaipur"},{"a":"Jamia Millia Islamia"},{"a":"Jamia Millia Islamia University"},{"a":"Janatha Education Trust's\n Vivekananda Institute of Technology"},{"a":"Janki Devi Memorial College"},{"a":"Jansons Institute of Technology"},{"a":"Jawaharlal Nehru Engineering College"},{"a":"Jawaharlal Nehru National College of Engineering"},{"a":"Jawaharlal Nehru Technologynological University"},{"a":"Jayaram College of Engineering and Technology"},{"a":"Jaypee Institute of Information Technology"},{"a":"Jesus & Mary College"},{"a":"JIPMER"},{"a":"JSS Academy of Technical Education"},{"a":"K K Wagh Institute of Ehgineering Education and Reasearch, Hirabai Haridas"},{"a":"K P R Institute of Engineering and Technology"},{"a":"K S Hegde Medical Academy"},{"a":"K.A.P. Viswanathan Government Medical College"},{"a":"K.G. College of Arts and Science"},{"a":"K.J. Somaiya College of Engineering"},{"a":"K.L.E.Society’s College of Engineering and Technology"},{"a":"K.Ramakrishnan College of Engineering"},{"a":"K.Ramakrishnan College of Technology"},{"a":"K.S. Institute of Technology"},{"a":"K.S.G College of Arts and Science"},{"a":"K.Venkataramana Gowda College of Engineering"},{"a":"Kairali Arts"},{"a":"Kalaignar Karunanidhi Institute of Technology"},{"a":"Kalaivani College of Technology"},{"a":"Kalindi College"},{"a":"Kalpataru Institute of Technology"},{"a":"Kamala Nehru College"},{"a":"Kamineni institute of medical sciences"},{"a":"Kanya Mahavidyalaya,"},{"a":"Kanyakumari Government Medical College"},{"a":"Karmavir Dadasaheb Kannamwar College of Engineering"},{"a":"Karnataka Law Society Gogte Institute of Technology"},{"a":"Karpagam College of Engineering"},{"a":"Karpagam Institute of Technology"},{"a":"Karpagam University"},{"a":"Kasi Nadar COLLEGE OF ARTS AND SCIENCE"},{"a":"Kasturba Medical College"},{"a":"Kathir College of Engineering"},{"a":"KCG"},{"a":"Keshav Memorial Institute of Commerce and Science"},{"a":"Keshav Memorial Institute of Technologynology"},{"a":"KGDM College"},{"a":"KGISL Institute of Technology"},{"a":"Khwaja Banda Nawaz College of Engineering"},{"a":"Kirori Mal College"},{"a":"kishinchand chellaram college"},{"a":"KMC"},{"a":"KMCT College of Engineering"},{"a":"KMEA College of Engineering"},{"a":"Kolhapur Institute of Technology's college of Engineering"},{"a":"Kongunadu Arts and Science College"},{"a":"Kongunadu College of Engineering and Technology"},{"a":"Kovai Kalaimagal College of Arts and Science"},{"a":"Krishna Kanta Handique State Open University"},{"a":"Krishna Kanta Handique State Open University,"},{"a":"KTVR Knowledge Park for Engineering and Technology"},{"a":"KUMARA RANI MUTHIAH"},{"a":"Kumaraguru College of Engineering"},{"a":"Kurinji Arts and Science College"},{"a":"Kurinji College of Engineering and Technology"},{"a":"L. D. College of Engineering Ahmedabad 380 015"},{"a":"L.C. Institute of Technology Bhandu"},{"a":"L.R.G Government Arts College for Women"},{"a":"Lady Doak College"},{"a":"Lady Irwin College"},{"a":"lakshmi Bai College"},{"a":"Lakshmi Narayanan Visalakshi College of Arts and Science"},{"a":"Lalit Chandra Bharali College"},{"a":"Latha Mathavan Engineering College"},{"a":"Laxminarayan Institute of Technology"},{"a":"LOYOLA"},{"a":"Lukhdhirji College of Engg Morbi-363641"},{"a":"M A M S School of Architecture"},{"a":"M J College of Engineering. & Technology."},{"a":"M V Jayaraman College of Engineering"},{"a":"M.A.M College of Engineering"},{"a":"M.A.M College of Engineering and Technology"},{"a":"M.A.M School of Engineering"},{"a":"M.A.V.M.M Ayira Vysiar College"},{"a":"M.G.R"},{"a":"M.H.Saboo Siddik College of Engineering"},{"a":"M.I.E.T Engineering College"},{"a":"M.I.E.T. College of Arts and Science"},{"a":"M.K. University College"},{"a":"M.S.S. Waakf Board College"},{"a":"M.S.Univ of Baroda"},{"a":"MADHA"},{"a":"Madura College"},{"a":"Madurai Institute of Social Sciences"},{"a":"Madurai Kamaraj University Evening College"},{"a":"Madurai Medical College"},{"a":"Mahalakshmi Engineering College"},{"a":"Maharaja Agrasen College"},{"a":"Maharaja Agrasen Institute of Technology"},{"a":"Maharaja Arts and Science College"},{"a":"Maharaja Engineering College"},{"a":"Maharaja Institute of Technology"},{"a":"Maharaja Prithvi Engineering College"},{"a":"Maharaja's College"},{"a":"Maharashtra Institute of Technology"},{"a":"Mahatma Gandhi College"},{"a":"Mahatma Gandhi Institute of Tech Edu.& Res."},{"a":"Mahatma Gandhi Institute of Technologynology"},{"a":"Mahatma Gandhi Medical College"},{"a":"Mahindra Ecole Centrale"},{"a":"Maitreyi College"},{"a":"Malik Sandal Institute of Art & Architecture"},{"a":"Malla Reddy Engineering college-Autonomous"},{"a":"Malla Reddy Institute of Engineering and Technology"},{"a":"Malnad College of Engineering"},{"a":"malviya national institute of techonology"},{"a":"Manakula Vinayakar Engineering College"},{"a":"Manav Rachna International University"},{"a":"Mangayarkarasi Arts and Science College for Women"},{"a":"Mangayarkarasi College of Engineering"},{"a":"Manipal Academy of Higher Education"},{"a":"Manipal College of Dental Sciences, Mangalore"},{"a":"Manipal Institute of Management"},{"a":"Manipal Institute of Technology"},{"a":"Mannar Tirumalai Naicker College"},{"a":"Mar Athanius College of Engineering"},{"a":"Mar Baselious College"},{"a":"Mar Baselious Institute"},{"a":"Mar Ivanious College"},{"a":"Maratha Mandal's Engineering College"},{"a":"Marathwada Mitra Mandal College of Commerce"},{"a":"Marian Engineering College"},{"a":"Matrusri college of Engineering"},{"a":"MBM Engineering College, Jodhpur"},{"a":"MCC"},{"a":"MEASI"},{"a":"MEENAKSHI"},{"a":"MES Ernakulam"},{"a":"MES Kuttipuram"},{"a":"MGR ENGINEERING COLLEGE"},{"a":"Michael Job College of Arts and Science for Women"},{"a":"Miranda House"},{"a":"MIT"},{"a":"MITE"},{"a":"mithibai college"},{"a":"MLRInstitution of Technologynology"},{"a":"MMC"},{"a":"MOHAMED SATHAK"},{"a":"Mohan Kumaramangalam Medical College"},{"a":"Mohandas College of Engg. and Tech."},{"a":"Moodlakatte Institute of Technology"},{"a":"MOP VAISHNAV"},{"a":"Motilal Nehru College"},{"a":"Mount Zion College of Engineering"},{"a":"Mount Carmel College"},{"a":"Mrs AVN (degree college"},{"a":"MS Ramaiah Institute of Technology"},{"a":"MVSR College of engineering."},{"a":"N.D.M.V.P.Samaj's College of Architecture Shivajinagar"},{"a":"N.M.A.M. Institute of Technology"},{"a":"N.M.S Sermathai Vasan College for Women"},{"a":"N.M.S.S. Vellachami Nadar College"},{"a":"N.R. School of Arctitecture"},{"a":"Nallamuthu Gounder Mahalingam College"},{"a":"Nalsar university"},{"a":"National College"},{"a":"National Institute of Fashion Technology"},{"a":"National Institute of Fashion Technology, New Delhi"},{"a":"National Institute of Technology (NIT), Calicut"},{"a":"National Institute of Technology, Trichy"},{"a":"National Law University And Judicial Academy"},{"a":"NBT Law college"},{"a":"Nehru Arts and Science College"},{"a":"Nehru College of Arts and Science"},{"a":"Nehru College of Engineering and Science Research"},{"a":"Nehru Institute of Engineering and Technology"},{"a":"Nehru Institute of Technology"},{"a":"Nehru Memorial College"},{"a":"Netaji Subhas Institute of Technology"},{"a":"New Horizon College of Engineering"},{"a":"NIFT"},{"a":"NIFT CHENNAI"},{"a":"Nightingale Institute of Technology"},{"a":"NIIMS"},{"a":"NIIT University, Neemrana"},{"a":"Nirma University Sarkhej-Gandhinagar Highway"},{"a":"Nirmala College for Women"},{"a":"NIT Surathkal"},{"a":"NIT Warangal"},{"a":"Nitte Institute of Technology"},{"a":"Nitte Mahalinga Adyanthaya Memorial Institute of Technology"},{"a":"North Eastern Regional Institute Of Management"},{"a":"North Gauhati College"},{"a":"NSRIT"},{"a":"NSS College"},{"a":"OAS Institute of Technology and Management"},{"a":"Osmania Arts"},{"a":"Osmania Commerce and Management\n Osmania University"},{"a":"OSMANIA UNIVERSITY"},{"a":"Oxford College of Engineering"},{"a":"Oxford Engineering College"},{"a":"P A College of Engineering and Technology"},{"a":"P.A. College of Engineering,"},{"a":"P.E.S School of Engineering"},{"a":"P.E.S. Institute of Technology"},{"a":"P.K.N. Arts and Science College"},{"a":"P.S.G College of Arts and Science"},{"a":"P.S.G College of Technology"},{"a":"P.S.G.R. Krishnamal College for Women"},{"a":"P.T.R. College of Engineering and Technology"},{"a":"Pachaiyappa's college"},{"a":"Pandu College,"},{"a":"PANIMALAR"},{"a":"PanineeyaInstitution Of Technology and Sciences"},{"a":"Park College of Engineering and Technology"},{"a":"Park College of Technology"},{"a":"Park Institute of Architecture"},{"a":"Park's College"},{"a":"Parul Institute of Engg & Technology At & P.O. Limda"},{"a":"Pasumpon Muthuramalinga Thevar College"},{"a":"Pavendar Bharadhidasan Arts and Science College"},{"a":"Pavendar Bharathidasan College of Engineering and Technology"},{"a":"Pavendar Bharathidasan Institute of Information Technology"},{"a":"People’s Education Society (PES) College of Engineering"},{"a":"People’s Education Society Institute of Technology"},{"a":"PERI"},{"a":"Periyar E.V.R. College"},{"a":"Pioneer College of Arts and Science"},{"a":"Pollachi Institute of Engineering and Technology"},{"a":"Pondicherry Engineering College"},{"a":"Pondicherry Institute of Medical Sciences"},{"a":"Poojya Doddappa Appa College of Engineering"},{"a":"Poornima College Of Engineering"},{"a":"Pragajyotish College"},{"a":"Prahar School of Architecture"},{"a":"Presidency College"},{"a":"Prism degree college"},{"a":"PSG Institute of Medical Sciences and Research"},{"a":"PSG Institute of Technology and Applied Research"},{"a":"Pune Institute of Computer Technology"},{"a":"Pune Vidhyarthi Griha's College of Engineering and Technology"},{"a":"Pydah degree college"},{"a":"Queen's Mary college"},{"a":"R N S Institute Of Technology"},{"a":"R V S College of Engineering and Technology"},{"a":"R.V.S College of Arts and Science"},{"a":"R.V.S School of Architecture"},{"a":"Raghu college of engineering"},{"a":"Rahdagovinda BaruahCollege"},{"a":"Raja College of Engineering and Technology"},{"a":"Raja Garden"},{"a":"Rajagiri School Of Engineering"},{"a":"Rajasthan Technical University, Kota"},{"a":"Rajdhani College"},{"a":"Rajiv Gandhi Institute of Technology"},{"a":"RAMAKRISHNA ENGINEERING COLLEGE"},{"a":"Ramnarayan Ruia college"},{"a":"Ranganathan Architecture College"},{"a":"Ranganathan Engineering College"},{"a":"Rashtreeya Vidyalaya College of Engineering"},{"a":"Rathinam College of Arts and Science"},{"a":"Rathinam Technical Campus"},{"a":"REC THAANDALAM"},{"a":"Regional College For Education Research And Technology - Jaipur"},{"a":"Regional Dental College,"},{"a":"RIT"},{"a":"Rizvi College of Architecture"},{"a":"RMK"},{"a":"RTE Rural Engineering College"},{"a":"Ruparel College"},{"a":"Rural Engineering College"},{"a":"RV College of Engineering"},{"a":"RVS KVK school of Architecture"},{"a":"RVS Technical Campus - Coimbatore"},{"a":"RYK Engg College"},{"a":"S N S College of Engineering"},{"a":"S V S College of Engineering"},{"a":"S V S School of Architecture"},{"a":"S.J.C.S. Institute of Technology"},{"a":"S.M.S. College of Arts and Science"},{"a":"S.M.S. Medical College - Jaipur"},{"a":"S.N.M. College"},{"a":"S.N.R Sons College"},{"a":"S.P. College of Science and Arts"},{"a":"S.P.Jain Institute of Management & Research"},{"a":"S.V.National Institute of Technology Dist Surat 395007"},{"a":"S.V.P. Mandal's College of Engineering"},{"a":"SA ENGINEERING"},{"a":"Sacred Heart College"},{"a":"SACS M.A.V.M.M. Engineering College"},{"a":"Sahyadri college of Engineering and Management"},{"a":"Sai ganapathi college"},{"a":"SAI RAM"},{"a":"Sai Vidya Institute of TechnologyRajanukunte"},{"a":"sandip foundation engineering college"},{"a":"Sanghavi College of Engineering"},{"a":"Sankalchand Patel College of Engg Gandhinagar-Ambaji Link Rd."},{"a":"Sankara College of Science and Commerce"},{"a":"Sanketika vidya parishad (J.N.T.U. affiliated"},{"a":"Sapthagiri College of Engineering"},{"a":"Sarabhai institute of Science and Technology"},{"a":"Saranathan College of Engineering"},{"a":"Saraswathy Narayanan College"},{"a":"Sardar Vallabhbhai Patel Institute of Technology"},{"a":"Sarvajanik College of Engg. & Technology Dr. R.K. Desai Marg"},{"a":"Sasi Creative School of Architecture"},{"a":"SASTHA"},{"a":"SASTRA University"},{"a":"Sasurie Academy of Engineering"},{"a":"SATHYABHAMA"},{"a":"Satyawati College"},{"a":"SAVEETHA"},{"a":"School of Architecture Coimbatore Institute of Engineering and Technology"},{"a":"SCHOOL OF EXCELLENCE (Law)"},{"a":"SCMS School of Engg. and Technology"},{"a":"SDM Law College"},{"a":"Seethalakshmi Ramaswamy College"},{"a":"Senthamail College"},{"a":"Seshadripuram Engineering College"},{"a":"Shadan College of Engineering. & Technology."},{"a":"Shah & Anchor Kutchhi Engineering College"},{"a":"Shaheed Bhagat Singh College"},{"a":"Shaheed Sukhdev College of Business Studies"},{"a":"Shantilal Shah Engg College Bhavnagar Univ Campus"},{"a":"Sharda University\n Plot No. 32-34"},{"a":"Shirdi Sai Engineering College"},{"a":"Shiv Nadar University"},{"a":"Shivani Collmcege of Engineering and Technology"},{"a":"Shivani Engineering College"},{"a":"Shri Angalamman College of Engineering and Technology"},{"a":"Shri Guru Gobind Singh Engineering College"},{"a":"Shri Guru Gobind Singhji Institute of Engineering and Technology"},{"a":"Shri Kumaran College of Arts and Science"},{"a":"Shri Nehru Maha Vidyalaya College of Arts and Science"},{"a":"Shri Ram College of Commerce"},{"a":"Shri S'ad Vidya Mandal's Institute of Technology Shri S'ad Vidya Mandal's Campus Old H.No. 8"},{"a":"Shri V.P. Kelvani Mandal's\n College of Engineering"},{"a":"Shrimathi Indira Gandhi College"},{"a":"Sri Guru Tech Bahadur Khalsa College"},{"a":"Shyam Lal College"},{"a":"Shyama Prasad Mukherji College"},{"a":"Siddaganga Institute of Technology"},{"a":"SIET"},{"a":"Sinhgad College of Engineering"},{"a":"Sir Bhavsinghji Govt. Engg College Sir Bhavsinghji Polytechnic Campus Vidyanagar Bhavnagar"},{"a":"Sir M Vishweshwariah Institute of Technology"},{"a":"Sir Parshurambhau College"},{"a":"SJPN Trust's Rural Engineering College"},{"a":"SLBS Engineering College, Jodhpur"},{"a":"Smt. Indira Gandhi College of Engineering\n Cidco"},{"a":"Smt. Sarojini Leeladharan Nair College of Engineering"},{"a":"SNS College of Technology"},{"a":"Sophia College"},{"a":"Sourashtra College"},{"a":"Sree Buddha College of Engineering"},{"a":"Sree Chitra Tirunnal College of Engg."},{"a":"Sree Narayana Guru College"},{"a":"Sree Narayana Gurukolam"},{"a":"Sree Ramu College of Arts and Science"},{"a":"Sree Sakthi Engineering College"},{"a":"Sree Sankara College"},{"a":"Sree Saraswathy Thyagaraja College"},{"a":"Sreenidhi Institute of Science and Technologynology"},{"a":"Sreyas Institute of Engineering and Technology"},{"a":"Sri Aurobindo College"},{"a":"Sri Belimatha Mahasamsthana Institute of Technology"},{"a":"Sri Bhagawan Mahaveer Jain College of Engineering"},{"a":"Sri Dharmasthala Manjunatheshwara College of Engineering and\n Technology"},{"a":"Sri Dharmasthala Manjunatheshwara College of Engineering and Technology"},{"a":"Sri Eshwar College of Engineering"},{"a":"Sri G.V.G Visalakshi College for Women"},{"a":"Sri Gee College of Arts & Science"},{"a":"Sri Guru Gobind Singh College of Commerce"},{"a":"Sri Guru Nanak Dev Khalsa College"},{"a":"Sri Guru Tegh Bahadur Khalsa College"},{"a":"Sri Jayachamarajendra College of Engineering"},{"a":"Sri Jayacharmarajendra College of Engineering"},{"a":"Sri Jayendra Sarawathy Maha Vidyalaya College of Arts and Science"},{"a":"Sri Krishna Arts and Science College"},{"a":"Sri Krishna College of Engineering and Technology"},{"a":"Sri Krishna College of Technology"},{"a":"Sri Krishna Rajendra Silver Jubilee Technology institute"},{"a":"Sri Meenakshi Government College for Women"},{"a":"SRI MUTHUKUMARAN MEDICAL COLLEGE"},{"a":"Sri Nagalakshmi Ammal Arts and Science College"},{"a":"Sri Ramakrishna College of Arts and Science for Women"},{"a":"Sri Ramakrishna Engineering College"},{"a":"Sri Ramakrishna Institute of Technology"},{"a":"Sri Ramakrishna Mission Vidyala College of Arts and Science"},{"a":"Sri Ramalinga Sowdambigai College of Science and Commerce"},{"a":"Sri Ranganathar Institute of Engineering & Technology"},{"a":"Sri Revana Siddeshwara Institute of Technology"},{"a":"Sri Siddhartha Institute of Technology"},{"a":"Sri Taralabalu Jagadguru Institute of Technology"},{"a":"Sri Venkateshwara College of Engineering and Technology"},{"a":"Sri Venkateswara College"},{"a":"Sriguru Institute of Technology"},{"a":"Srimad Andavan Arts and Science College"},{"a":"Srinivas Institute of Management Studies"},{"a":"Srinivas School of Engineering"},{"a":"SRM"},{"a":"SRM RAMAPURAM"},{"a":"SRM VADAPALANI"},{"a":"SRMC"},{"a":"SRR"},{"a":"SSN"},{"a":"ST JOSEPH"},{"a":"st xavier's college mumbai\n No. 5"},{"a":"St. Albert's College"},{"a":"St. Aloysius College,"},{"a":"St. George's Jayaraj Chelladurai College for Women"},{"a":"St. Joseph Engineering College,"},{"a":"St. Joseph's College for Women"},{"a":"St. Peters College"},{"a":"St. Stephen's College"},{"a":"St.Francis Degree College for Women"},{"a":"St.Joseph College of Engineering"},{"a":"St.Joseph's College"},{"a":"St.Martin's College of Engineering"},{"a":"Stanley Medical College"},{"a":"STELLA MARIS"},{"a":"Subbalakshmi Lakshmipathi College of Science"},{"a":"Suguna College of Engineering"},{"a":"Sureya College of Engineering"},{"a":"SVCE"},{"a":"SVKM's NMIMS University"},{"a":"Swahid Jadav Nath Govt Homoeopathic Medical College"},{"a":"swami keshvanand institute of technology"},{"a":"Swami Shraddhanand College"},{"a":"Swami Vivekanand Subharti University"},{"a":"Symbiosis Institute of Business Management"},{"a":"Symboisis College Of Arts & Commerce"},{"a":"T.B.M.L. College"},{"a":"Tagore College"},{"a":"Tamilnadu College of Engineering"},{"a":"Tamilnadu School of Architecture"},{"a":"Tammannagari Ramakrishna Reddy College of Engineering"},{"a":"TBLDEA's College of Engineering and Technology"},{"a":"Tejaa Shakthi Institute of Technology for Women"},{"a":"TERF's Academy College of Ats and Science"},{"a":"Texcity Arts and Science College"},{"a":"THAI MOOGAMBIGAI POLYTECHNIC"},{"a":"Thanjavur Medical College"},{"a":"The American College"},{"a":"The Cochin College"},{"a":"The LNM Institute of Information Technology, Jaipur"},{"a":"The Maharaja Syajirao University Of Baroda P.O. Box No. 51"},{"a":"The National Institute of Engineering\n Manadavadi Road"},{"a":"Thiagarajar College"},{"a":"Thigarajar College of Engineering"},{"a":"Thoothukudi Government Medical College"},{"a":"Tirunelveli Medical College"},{"a":"Tiruppur Kumaran College for Women"},{"a":"TKM College of Engineering"},{"a":"TocH Institute of Science and Technology"},{"a":"Tolani Foundations Gandhidham Polytechnic Collegiate Board"},{"a":"Tontadarya College of Engineering"},{"a":"Travancore Engineering College"},{"a":"Trichy Engineering College"},{"a":"TRP Engineering College"},{"a":"U.V.Patel Engg.College Ganpat Vidyanagar"},{"a":"Ultra College of Engineering and Technology for Women"},{"a":"United Institute of Technology"},{"a":"University B.D.T. College of Engineering"},{"a":"University College"},{"a":"University College of Engineering"},{"a":"University College of Engineering, Arni"},{"a":"University College of Engineering, Dindigul"},{"a":"University College of Engineering, Kanchipuram"},{"a":"University College of Engineering, Nagarkoil"},{"a":"University College of Engineering, Panruti"},{"a":"University College of Engineering, Pattukottai"},{"a":"University College of Engineering, Ramanathapuram"},{"a":"University College of Engineering, Thirukkuvalai"},{"a":"University College of Engineering, Tindivanam"},{"a":"University College of Engineering, Vilupuram"},{"a":"University of Hyderabad"},{"a":"UNIVERSITY OF MADRAS"},{"a":"University School of Architecture & Planning"},{"a":"University School of Basic & Applied Sciences\n Sector-16C"},{"a":"University School of Information and Communication Technology"},{"a":"University School of Management Studies (MBA)"},{"a":"University School of Mass Communication"},{"a":"University Visvesvaraya College of Engineering"},{"a":"University VOC College of Engineering, Thoothukudi"},{"a":"Urumu Dhanalakshmi College"},{"a":"Usha Mittal Institute of Technology"},{"a":"V.L.B Janakiammal College of Arts and Sciences"},{"a":"V.N. Krishnasamy Naidu College of Arts and Science for Women"},{"a":"V.S.B College of Engineering Technical Campus"},{"a":"Vaigai College of Engineering"},{"a":"Vainateya Junior College"},{"a":"Valia Institute of Technology P.O. Valia"},{"a":"Vardhaman College of engineering"},{"a":"Vasavi college of engineering"},{"a":"Veermata Jijabai Technological Institute (VJTI)"},{"a":"VEL TECH"},{"a":"VELAMMAL"},{"a":"Velammal College of Engineering and Technology"},{"a":"Vemana Institute of Technology"},{"a":"Vetri Vina yaha Collmbege of Engineering and Technology"},{"a":"Vickram College of Engineering"},{"a":"Victoria Jubilee Technical Institute"},{"a":"Vidhya College of Engineering"},{"a":"Vidya Jyothi Institute of Technologynology"},{"a":"Vidya Soudha"},{"a":"Vidya Vardhaka College of Engineering"},{"a":"Vidya Vikas Institute of Engineering & Technology"},{"a":"Vidya Vikas Institute of Engineering and Technology"},{"a":"Vidyasagar College of Arts and Science"},{"a":"Vignana Bharathi Institute Of Technologynology"},{"a":"Vijayanagar Engineering College"},{"a":"Vishnu Lakshmi College of Engineering and technology"},{"a":"Vishwajyothi College of Engg and Technology"},{"a":"Vishwakarma Institute of Technology"},{"a":"Vishweshwariah National Institute of\n Technology"},{"a":"VIT C"},{"a":"Vellore Institute of Technology"},{"a":"VITAM"},{"a":"VIVEKANANDA"},{"a":"Vivekananda College"},{"a":"Vivekananda Institute of Technology"},{"a":"VNRVJIT"},{"a":"Vyavsaik Vidya Prathisthan's Sanch. College of Engg Vajdi"},{"a":"Walchand College of Engineering"},{"a":"Walchand Institute of Technology"},{"a":"WCC"},{"a":"Yadava College"},{"a":"Yenepoya Institute of Technology"},{"a":"Zakir Husain Delhi College"},{"a":"No College"}]
  }
  
 	
  $scope.GetData(1);
  // $(document).ready(function($){
  //   $(function () { $('#edit_dateofbirth').datetimepicker({
  //    viewMode: 'years',
  //    format: 'DD/MM/YYYY'
  //   }); });
  //   $(function () {
  //     $('#edit_dateofbirth').on("dp.change", function (e) {
  //         $scope.user.dob = e.date._d;
  //         console.log($scope.user.dob);
  //     });
  //   });
  // });

    $scope.edit_form = false;
    $scope.show_user_modal = function (user) {
      console.log("yo")
      document.getElementById('user_modal').style.display = "block";
      $scope.user = user;
    }

    $scope.hide_user_modal = function () {
      console.log("yoyo")
      document.getElementById('user_modal').style.display = "none";
    }

  // $scope.user_modal = function(registered_by) {
  //     $mdDialog.show(
  //       $mdDialog.alert()
  //         .clickOutsideToClose(true)
  //         .title('Status Update By')
  //         .textContent(registered_by.username - registered_by.mobile - registered_by.department - registered_by.role)
  //         .ok('Close')
  //     );
  //   };

  $scope.show_signup_modal = function(){
      document.getElementById('signup_modal').style.display = "block";
  }
  $scope.hide_signup_modal = function(){
      document.getElementById('signup_modal').style.display = "none";
  }
// SIGNUP
  $scope.new_user = {
        "name" : "",
        "email" : "",
        "password" : "",
        "confirm_password" : "",
        "mobile" : "",
        "city":"",
        "gender" : "Male",
        "college" : "",
        "college_id" : ""
      };

  $scope.register = function(form) {
    $scope.submitted = true;
    console.log("insignup");
    console.log($scope.new_user);
    if(form.$valid){
      console.log("form valid");
      $http.post(
        'https://auth.saarang.org/v1/signup',
        {
          "provider" : "username",
          "data" : {
             "username": $scope.new_user.email,
             "password": $scope.new_user.password
          }
        }
        ).then(function(res) {
          res = res.data;
          console.log("signup success");
          console.log(res);
          // Inserting new user into user table 
          var config = {
            headers :{
              "Authorization" : "Bearer " + res.auth_token
            }
          };
          // console.log(res.hasura_id);
          if(((res.hasura_id)>0)&&((res.hasura_id<10))){
              $scope.saarang_id = "SA19U0000"+res.hasura_id;
          }
          if(((res.hasura_id)>=10)&&((res.hasura_id<100))){
              $scope.saarang_id = "SA19U000" + res.hasura_id;
          }
          if(((res.hasura_id)>=100)&&((res.hasura_id<1000))){
              $scope.saarang_id = "SA19U00" + res.hasura_id;
          }
          if(((res.hasura_id)>=1000)&&((res.hasura_id<10000))){
              $scope.saarang_id = "SA19U0" + res.hasura_id;
          }
          if(((res.hasura_id)>=10000)&&((res.hasura_id<100000))){
              $scope.saarang_id = "SA19U" + res.hasura_id;
          }
          // console.log($scope.saarang_id);
          var data = {
              "type" : "insert",  
              "args" : {
                "table" : "users_2019",
                "returning": ["id"],
                "objects": [
                  { 
                    'id':res.hasura_id,
                    'name':$scope.new_user.name,
                    'mobile':$scope.new_user.mobile,
                    'email':$scope.new_user.email,
                    'city':$scope.new_user.city,
                    // 'dob' : $scope.new_user.dob,
                    'gender' : $scope.new_user.gender,
                    'saarang_id': $scope.saarang_id,
                    'college' : $scope.new_user.college.a,
                    'college_id' : $scope.new_user.college_id,
                    'desk_registration' : true 
                  }
                ]
            }
          };
          $http.post('https://data.saarang.org/v1/query',data,config)
          .then(function(response) {
            console.log("insertion success");
            alert("Successfully added");
            $scope.new_user = {
              "name" : "",
              "email" : "",
              "password" : "",
              "confirm_password" : "",
              "mobile" : "",
              "city":"",
              "gender" : "Male",
              "college" : "",
              "college_id" : ""
            };
          }).catch(function(err){console.log(err.data);});
        // finsihed inserting into user table
        }).catch(function(err) {
            err = err.data;
          console.log(err);
          $scope.signup_error = true;
          $scope.signup_error_message = err.message;
        });
    }
  };


// TOGGLE DESK REGISTRATION
 	  $scope.toggle_registration = function(user){
      if(confirm("Are you sure you want to update the Desk Registration for "+user.name) == true){
        if(user.desk_registration === false){
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"update",
                      "args":{
                              "table":"users_2019",
                              "$set":
                              {
                                "desk_registration": true,
                                "registered_by":$localStorage.member
                              },
                              "where":{"id":user.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, "X-Hasura-Role" : "core"
                    }
              }).then(function(res){
                $state.reload();
            }).catch(function(err){
              console.log(err.data);
              $window.alert("error occurred please try again");
            });
        }
        else{
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"update",
                      "args":{
                              "table":"users_2019",
                              "$set":
                              {
                                "desk_registration": false,
                                "registered_by":$localStorage.member
                              },
                              "where":{"id":user.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, "X-Hasura-Role" : "core"
                    }
              }).then(function(res){
                $state.reload();
            }).catch(function(err){
              console.log(err.data);
              $window.alert("error occurred please try again");
            });
        }
      }
    };
    $scope.edit = function(user){
      document.getElementById('edit_modal').style.display = "block";
      $scope.user = user;
    }
    $scope.hide_edit_modal = function(){
        document.getElementById('edit_modal').style.display = "none";
    }
    $scope.update = function(form) {
        $scope.submitted = true;
        console.log($scope.user);
        if(form.$valid){
          console.log("form valid");
           $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"update",
                      "args":{
                              "table":"users_2019",
                              "$set":
                              {
                                "name":$scope.user.name,
                                "mobile":$scope.user.mobile,
                                "city":$scope.user.city,
                                "gender" : $scope.user.gender,
                                "college" : $scope.user.college,
                                "college_id" : $scope.user.college_id,
                                "desk_registration": false,
                                "registered_by":$localStorage.member
                              },
                              "where":{"id":$scope.user.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, "X-Hasura-Role" : "core"
                    }
              }).then(function(res){  
                console.log("success");
                $scope.hide_edit_modal();
                $state.reload();
            }).catch(function(err){
              console.log(errs);
              $window.alert("error occurred please try again");
            });   
        }
      };

 }]);