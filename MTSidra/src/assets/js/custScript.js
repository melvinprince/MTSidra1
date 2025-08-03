var idleTime = 0;
var wwClient = qmatic.webwidget.client;
var unitId = "SWH:WebReception";//wwClient.getUnitId();
var ticketTimeout = 10000;

//SMS Message
var Waitingmsg1 = "Your ticket number is XXXX. There are x customer(s) waiting. Please stay at branch  you will be served soon.";
var Waitingmsg2 = "Your ticket number is XXXX. There are x customer(s) waiting. Please be near to the branch, you will be advised to enter the branch soon.";

if (window.location.protocol == "http:") {
	var proxyBaseURL = "http://"+window.location.hostname+":9000/SendSMS/";

}
else {
	var proxyBaseURL = "https://"+window.location.hostname+":9001/SendSMS/";
}




var App = angular.module('touchScreenApp', []);

App.controller('page1Control', function ($scope, $http, $window, $timeout) {

	$scope.backtxt = { 
		ar: "العودة",
		en: "Back" };
	$scope.regis = { 
		ar: 'التسجیل', 
		en: "Registration" }
	$scope.proceedButton = { 
		ar: "متابعة", 
		en: "Proceed" };
	$scope.pageMobileEntryLine1 = { 
		ar: "يرجى إدخال / مسح البطاقة الشخصية أو رقم الهاتف", 
		en: "Please Enter / Scan QID or Phone Number" };
	$scope.enterpassportNum = { 
		ar: "يرجى إدخال رقم جواز السفر", 
		en: "Please Enter Passport Number" };
	$scope.yourTicketNumber = { 
		ar: "رقمك في قائمة الانتظار", 
		en: "Your Ticket number is" };
	$scope.confirmMobileNumber = {
		ar: "يرجى تأكيد رقم الهاتف المحمول لاستلام الرسائل النصية", 
		en: "Please Confirm Mobile Number to Receive SMS" };
	$scope.waitInWaitingArea = { 
		ar: "يرجى الجلوس في منطقة الانتظار", 
		en: "Please wait in the waiting area" };
	$scope.nongccticketmsg = { 
		ar: "لن يتم إرسال رسائل نصية إلى الدول غير الخليجية، يرجى ملاحظة رقم تذكرتك.", 
		en: "NO SMS will be sent to NON-GCC Countries , kindly make a note of  your ticket number" };
	$scope.closebtntxt = { 
		ar: "إغلاق", 
		en: "Close" };
	$scope.withoutTicket = { 
		ar: "استلام رسالة نصیة", 
		en: "Get SMS" };
	$scope.checkAppt = { 
		ar: "استعلم عن الموعد", 
		en: "Check Appointment" };
	$scope.langTxt = { 
		ar: "English", 
		en: "عربي" };
	$scope.AppTime = { 
		ar: "الوقت", 
		en: "Time" };
	$scope.doctorsname = { 
		ar: "اسم الطبیب", 
		en: "Doctor’s Name" };
	$scope.AppDate = { 
		ar: "التاريخ", 
		en: "Date" };
	$scope.novalidAppointment = { 
		ar: "لا يوجد موعد مسجل للمريض لهذا اليوم", 
		en: "No Valid Appointment for today" };
	$scope.pleasetake = { 
		ar: "يرجى أخذ رقم للتسجیل", 
		en: "Please take a token for registration" };
	$scope.invalidMsg = { 
		ar: "رقم الهاتف المحمول / بطاقة الهوية القطرية / جواز السفر غير صالح.", 
		en: "Mobile/QID/Passport is Invalid" };
	$scope.selectAnOption = { 
		ar: "يرجى اختيار الخدمة المطلوبة", 
		en: "Please Select the Service" };
	$scope.gccOption = { 
		ar: "مجلس التعاون الخليجي", 
		en: "GCC" };
	$scope.nonGCCOption = { 
		ar: "غير دول مجلس التعاون الخليجي", 
		en: "NON-GCC" };
	$scope.patientName = {
		ar: "اسم المريض",
		en: "Patient Name"};
	$scope.customerMobileNumber = '';
	$scope.mobileToSendSMS = '';
	$scope.MoborQID = '';
	$scope.selectedServiceID = '';
	$scope.appointmentQueueID = 0;
	$scope.finservices = true;
	$scope.cardNo = '';
	$scope.phoneNumber = '';
	$scope.serviceId = 0;
	$scope.appointmentSt = 0;
	$scope.invalidStaffID = false;
	$scope.printTicketSt = 0;
	$scope.upperCase = true;
	$scope.showAlphabet = false;
	$scope.selectedStaff = '';
	$scope.selectedAppointment = null;
	
	$scope.appointmentInfoRes = [];
	$scope.countryCode = '+974';


	var branchId = qmatic.webwidget.client.getBranchId();

	if (branchId == "3" || branchId == "13") {
		$scope.btnsafeBox = true;
	}
	$scope.unitId = unitId;

	$scope.arBgImg = "startArPagecss";
	$scope.enBgImg = "startEnPagecss";

	$scope.getCheckAppointment = function (id) {

		idleTime = 0;
		console.log("MoborQID", $scope.MoborQID.length, id);

		if ($scope.MoborQID.length == 8) {
			$scope.mobileToSendSMS = $scope.MoborQID;
		}
		if (!$scope.passportInput && $scope.MoborQID.length != 8 && $scope.MoborQID.length != 11) {
			$scope.invalidID = true;
			$timeout(function () {
				$scope.$apply(function () {
					$scope.invalidID = false;
				});
			}, 1500);

		}
		else if ($scope.passportInput && $scope.MoborQID.length == 0) {
			$scope.invalidID = true;
			$timeout(function () {
				$scope.$apply(function () {
					$scope.invalidID = false;
				});
			}, 1500);
		}
		else {
			var url_ = 'getAppt';

			var qidRequest = {
				qid: $scope.MoborQID,
				passport: "",
				branch: branchId
			};

			if ($scope.passportInput) {
				qidRequest = {
					qid: "",
					passport: $scope.MoborQID,
					branch: branchId
				};
			}

			$.ajax({
				type: 'POST',
				url: proxyBaseURL + url_,
				async: false,
				contentType: "application/json",
				data: JSON.stringify(qidRequest),

				success: function (data, status, headers, config) {
					//debugger;
					var res = JSON.parse(data.data);

					console.log(res.Table[0])
					if (res.Table.length == 0) {
						$scope.jumpto('moAppointmentMenu');
					} else {
						$scope.appointmentInfoRes = [res.Table[0]];
						$scope.selectedAppointment = res.Table[0];
						$scope.jumpto('Page02');
					}
				},
				error: function (error) {
					//debugger;
				}
			});



		}

	}

	$scope.idleInterval;
	$(document).ready(function () {
		//debugger;
		$scope.idleInterval = setInterval(timerIncrement, 1000);
		$(this).mousemove(function (e) {
			idleTime = 0;
		});
		$(this).keypress(function (e) {
			idleTime = 0;
		});
	});

	function timerIncrement() {

		idleTime = idleTime + 1;
		//console.log(idleTime);
		if (idleTime > 30) { // 30 sec

			$scope.$apply(function () {
				$scope.lang = 'en';
				$scope.txthcnumber = "";
				$scope.customerMobileNumber = "";
				$scope.MoborQID = ""
				$scope.invalidStaffID = ""
				$scope.selectedServiceID = "";
				$scope.bgImagetoLoad = "";
				$scope.jumpto('serviceMenu');
				idleTime = 0;
			});

		}
		if ($scope.curPageToShow == "serviceMenu") {
			var MoborQIDTb = document.getElementById("MoborQID");
			if (document.activeElement !== MoborQIDTb) {
				MoborQIDTb.focus();
				MoborQIDTb.setSelectionRange(MoborQIDTb.value.length, MoborQIDTb.value.length);
			}

		}
	}
	$scope.lang = 'en';
	$scope.curPageToShow = "serviceMenu";
	$scope.qatar_id = "";
	$scope.customer_id = "";
	$scope.card_number = "";
	$scope.MaxLateHrs = 500;
	$scope.MaxEarlyHrs = 500;
	$scope.keypadItems = [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }, { text: '6' }, { text: '7' }, { text: '8' },
	{ text: 'HADAF' }, { text: '9' }, { text: '0' }, { text: 'BS' }];

	$scope.getbgImage = function (page) {
		if (page == 'StartPage')
			return "startArPagecss";
	};


	$scope.page0 = {
		cardmsg: { en: '', ar: '' },
		//menumsg: { en: 'Select the Ministry', ar: 'اختر الوزارة' },
		menumsg: { en: 'Please Enter the Staff ID', ar: 'اختر الوزارة' },
		ormsg: { en: 'Or', ar: 'أو' }
	};
	$scope.pageServMsg = {
		cardmsg: { en: '', ar: '' },
		menumsg: { en: 'Appointment Information', ar: "معلومات الموعد" },
		ormsg: { en: 'Or', ar: 'أو' }
	};
	$scope.page1 = {
		cardmsg: { en: '', ar: '' },
		menumsg: { en: 'Appointment Information', ar: "معلومات الموعد" },
		ormsg: { en: 'Or', ar: 'أو' }
	};

	$scope.page0items = [
		{ text: { en: 'Immigration Service', ar: 'فتح حساب' }, serviceNum: '44' },
		{ text: { en: 'Personal Info Update', ar: 'شهادة لمن يهمه الامر' }, serviceNum: '61' }
	];
	$scope.page0items2 = [
		{ text: { en: 'Leave', ar: 'فتح حساب' }, serviceNum: '60' },
		{ text: { en: 'Ticket Endorsement', ar: 'شهادة لمن يهمه الامر' }, serviceNum: '63' }
	];

	

	//debugger;
	$scope.branchser = getBranchServiceIds();
	//debugger;
	$scope.serviceList = [];
	$scope.branchser.forEach(serid => {
		// $scope.serviceList1.forEach(serv=>{
		// 	if(serid==Number(serv.serviceNum)){
		// 		$scope.serviceList.push(serv);
		// 	}
		// });
	});
	//console.log($scope.serviceList);
	//debugger;

	$scope.cstranslate = function (lang) {
		var retText = lang == 'en' ? "Customer Service" : "خدمة العملاء";
		var rmManagers = ['1']

		if (!angular.isUndefined($scope.customerData)) {
			if (rmManagers.indexOf(branchId) > -1) {

				if ($scope.customerData.segment == 'A') {
					if (lang == 'en')
						retText = 'Relationship Manager'
					else
						retText = 'مدير علاقات العملاء'
				}
			}
		}
		return retText;
	}

	$scope.translate = {
		Appointment: { en: 'Appointment', ar: 'مواعيد' },
		WalkIn: { en: 'Walk In', ar: 'لا يوجد موعد' },
		AppointmentDate: { en: 'Appointment Date :', ar: ': مواعيد' },
		AppointmentTime: { en: 'Appointment Time :', ar: ': مواعيد' },
		ServiceName: { en: 'Service Name :', ar: ': مواعيد' }
	};

	$scope.toggle_lang = function () {
		//debugger;

		if ($scope.lang == 'ar')
			$scope.lang = 'en';
		else {
			$scope.lang = 'ar';
		}
	};



	$scope.jumpto = function (page, serviceId) { //console.log('came to jump');
		//debugger;
		idleTime = 0;
		if (serviceId)
			$scope.staffID = serviceId;
		if (page == 'Page1')
			$scope.customerfrom = 'Existing Customer';
		else if (page == 'PageWelcomeNewCustomer')
			$scope.customerfrom = 'New Customer';
		else if (page == 'PageCorporateServices')
			$scope.customerfrom = 'Corporate Customer';
		else if (page == 'PageSpecial')
			$scope.customerfrom = 'Special Assistance';
		if (page == 'serviceMenu') {
			$scope.isValidAppointment = false;
			$scope.customerMobileNumber = "";
			$scope.appointmentInfoRes = [];
			$scope.mobileToSendSMS = "";
			$scope.MoborQID = "";
			$scope.invalidStaffID = ""
			$scope.error = "";
			$scope.cardNo = '';
			$scope.levelofCustomer = '';
			$scope.txthcnumber = '';
			$scope.txthcnumber = "";
			$scope.bgImagetoLoad = "";
			$scope.qatar_id = "";
			$scope.customer_id = "";
			$scope.card_number = "";
			$scope.bgImagetoLoad = "";
			$scope.customerData = {};
			$scope.customerData.name = '';
			$scope.selectedServiceID = "";
			$scope.lang = 'en';
			$scope.countryCode = '+974';
			$scope.passportInput = false;
			$scope.gccNation = true;
			$scope.showAlphabet = false;
			ticketTimeout = 10000;
			$('#container-ticketnum').fadeOut();

		} else if (page == 'PageCustomerServices') {
			$scope.curPageToShow = "PageCustomerServices";
			return;
		} else if (page == 'PageSpecial') {
			$scope.customerData = {};
			$scope.customerData.name = 'Special Care';
			$scope.levelofCustomer = "VIP Level 1"
		} else if (page == 'PageCorporateServices') {
			if ($scope.unitId == "GHS:Intro") {
				$scope.curPageToShow = "PageNextBuilding";
				return;
			}
			$scope.customerData = {};
			$scope.customerData.name = '';
			$scope.levelofCustomer = "VIP Level 5"
		} 
		$scope.curPageToShow = page;
		//process();
	};
	$scope.removeModal = function () {
		var modal = document.getElementById('myModal');
		modal.style.display = "none";
	}
	//To show and hide different pages.
	$scope.showPage = function (pageName) {
		//console.log('salwa unit '+$scope.unitId);
		if ($scope.unitId == "SAL:Intro") {
			$scope.finservices = false;

		}
		if (pageName == $scope.curPageToShow) {
			// clearInterval($scope.idleInterval);
			// $scope.idleInterval = setInterval(timerIncrement, 1000);
			return true;
		}
		else
			return false;
	}
	$scope.validateAppointment = function () {
		//debugger;
		$("#hiddenServiceId").val('');
		$("#hiddenAppointId").val('');
		$("#hiddenGender").val('');
		var appointmentNumber = $scope.txthcnumber;
		if (appointmentNumber.length > 0) {
			var hcNumber = appointmentNumber;
			var appointInfo = qmatic.connector.client.getAppointmentByExternalId(hcNumber);
			console.log(appointInfo);
			if (appointInfo != null && appointInfo != '') {

				//debugger;
				var appointDateValidate = new Date(appointInfo.startTime);
				var today = new Date();
				//console.log(today.getMonth());
				console.log(appointDateValidate.getMonth());
				if (appointDateValidate.getDate() == today.getDate() && appointDateValidate.getMonth() == today.getMonth() && appointInfo.status == "CREATED") {
					$scope.appointmentInfo = appointInfo;
					$scope.customerMobileNumber = appointInfo.customers[0].properties.phoneNumber;
					$scope.serviceId = appointInfo.services[0].id;
					$scope.appointmentSt = 1;
					$scope.jumpto('AppointmentInfo');

				} else {
					$scope.error = "Appointment number is not valid";
				}

			} else {
				$scope.error = "Appointment information not found";
			}
		} else {
			$scope.error = "Appointment number is not valid";
		}
	};
	$scope.confirmAppointment = function () {
		$scope.isValidAppointment = true;
		var serviceId = $("#hiddenServiceId").val();
		var appointId = $("#hiddenAppointId").val();
		var genderInfo = $("#hiddenGender").val();
		$scope.appointId = appointId;
		$scope.gender = genderInfo;
		$scope.showMobileEntry(serviceId);
	};

	$scope.showAppointmentMobileEntry = function (queueID) {
		//debugger;
		$scope.appointmentQueueID = queueID;
		$scope.jumpto('PageMobileEntry');
	}

	$scope.addToSelSer = function (serviceId) {
		//debugger;
		var serId = "" + serviceId;
		if ($scope.selectedServiceID.includes(serId)) {
			if ($scope.selectedServiceID.includes("," + serId))
				$scope.selectedServiceID = $scope.selectedServiceID.replace("," + serId, "");
			else if ($scope.selectedServiceID.includes(serId + ","))
				$scope.selectedServiceID = $scope.selectedServiceID.replace(serId + ",", "");
			else
				$scope.selectedServiceID = $scope.selectedServiceID.replace(serId, "");
		}
		else {
			if ($scope.selectedServiceID == "") {
				$scope.selectedServiceID = serId;
			}
			else {
				$scope.selectedServiceID = $scope.selectedServiceID + "," + serId;
			}
		}

	}
	$scope.dummyFunction = function () { }

	$scope.showMobileEntry = function () {
		//debugger;


		if ($scope.levelofCustomer == 'VIP Level 1') {
			// $scope.printTicket(serviceId);
			$scope.jumpto('PageMobileEntry');
			$scope.customerMobileNumber = ''
		}
		else {
			$scope.jumpto('PageMobileEntry');
		}
	}
	$scope.servMin = [];
	
	$scope.passportInput = false;
	$scope.switchInputType = function () {
		idleTime = 0;
		$scope.passportInput = !$scope.passportInput;
		if ($scope.passportInput) {
			$scope.jumpto('passportPage');
			$scope.showAlphabet = true;
		}
		else {
			$scope.curPageToShow = "serviceMenu";
			$scope.showAlphabet = false;
		}
	}
	$scope.gccNation = true;
	$scope.gccselection = function (isGcc) {
		idleTime = 0;
		if (isGcc) {
			$scope.gccNation = true;
		}
		else {
			$scope.gccNation = false;
		}

		$scope.curPageToShow = "serviceMenu";

	}
	$scope.regTicket = function () {
		idleTime = 0;
		if ($scope.gccNation) {
			$scope.jumpto('mobileMenu');
		}
		else {
			$scope.sendSMS(0);
		}
	}

	$scope.getAppointmentLevel = function (selApp) {
		//debugger;
		var time = selApp?.APPT_TIME;
		if (!time) return null;
		var currentTime = new Date();


		var [hours, minutes, seconds] = time.split(':').map(Number);
		var appointmentTime = new Date();
		appointmentTime.setHours(hours, minutes, seconds, 0);

		var onTimeStart = new Date(currentTime);
		onTimeStart.setMinutes(currentTime.getMinutes() - 15);

		var onTimeEnd = new Date(currentTime);
		onTimeEnd.setMinutes(currentTime.getMinutes() + 30);

		// Determine the level
		if (appointmentTime >= onTimeStart && appointmentTime <= onTimeEnd) {
			return "VIP Level 2";
		}
		else if (appointmentTime < onTimeStart) {
			return "VIP Level 3";
		}
		else if (appointmentTime > onTimeEnd) {
			return "VIP Level 4";
		}
		else {
			return "VIP Level 1";
		}
	};
	$scope.getLateEarly = function (selApp) {
		//debugger;
		var time = selApp?.APPT_TIME;
		if (!time) return null;
		var currentTime = new Date();


		var [hours, minutes, seconds] = time.split(':').map(Number);
		var appointmentTime = new Date();
		appointmentTime.setHours(hours, minutes, seconds, 0);

		var onTimeStart = new Date(currentTime);
		onTimeStart.setMinutes(currentTime.getMinutes() - 15);

		var onTimeEnd = new Date(currentTime);
		onTimeEnd.setMinutes(currentTime.getMinutes() + 30);

		// Determine the level
		if (appointmentTime >= onTimeStart && appointmentTime <= onTimeEnd) {
			return "In Time Appointment";
		} else if (appointmentTime < onTimeStart) {
			return "Late Appointment";
		} else {
			return "Early Appointment";
		}
	};



	$scope.sendSMS = function (ticket) {
		//debugger;
		idleTime = 0;
		var mobileNumber = $scope.mobileToSendSMS ? $scope.mobileToSendSMS : '';
		var mobileToVal=$scope.countryCode + '' + $scope.mobileToSendSMS;
		if (ticket != 0) {
			if (mobileToVal < 7) {
				ShowMessage('Please fill the mobile number to continue.');
			}
			else {
				$scope.printTicketSt = ticket;
				$scope.printTicket($scope.selectedServiceID);
			}
		}
		else {
			$scope.printTicketSt = ticket;
			$scope.printTicket($scope.selectedServiceID);
		}
	}

	$scope.serviceMap = [
		[]
	]
	var radLab = ["Lab General", "Ultrasound", "US OB", "US GYN", "PAT New"];

	$scope.forLabRad = function (appt_Type) {
		var labst = radLab.findIndex(function (item) {
			return item === appt_Type
		}) >= 0;
		return labst;
	}

	$scope.dispDoc = function (pract) {
		//debugger;
		var pract1 = pract.replace(/ /g, "");
		return pract1 != "" && pract1 != null;
	}

	var radOnly = ["US OB"];//,"US GYN" is for side a and us ob is for side b
	$scope.forRad = function (appt_Type) {
		var labst = radOnly.findIndex(function (item) {
			return item === appt_Type
		}) >= 0;
		return labst;
	}

	//Getting Control No & Room No
	$scope.printTicket = function (serviceId, entryPoint) {
		console.log("selectedAppointment", $scope.selectedAppointment)
		// var queueId = 8;
		//var serviceId=8;
		var seqSer = [
			[540, 36, 54, 3, 4, 5],
			[4, 6, 8, 9, 10, 6],
			[5, 14, 15, 16, 17]
		];
		var labser = radLab.findIndex(function (item) {
			return item === $scope.selectedAppointment?.APPT_TYPE
		}) >= 0;




		var serv = seqSer[1][seqSer[0].findIndex(function (item) {
			return item === $scope.selectedAppointment?.SEQUENCE;
		})];
		var assessment = seqSer[2][seqSer[0].findIndex(function (item) {
			return item === $scope.selectedAppointment?.SEQUENCE;
		})];
		var docService;
		if ($scope.appointmentInfoRes.length > 0) {
			docService = $scope.selectedAppointment.SEQUENCE <= 20 && $scope.selectedAppointment?.SEQUENCE > 0 ? "9" :
				$scope.selectedAppointment.SEQUENCE <= 40 && $scope.selectedAppointment?.SEQUENCE > 20 ? "10" :
					$scope.selectedAppointment.SEQUENCE <= 60 && $scope.selectedAppointment?.SEQUENCE > 40 ? "11" :
						$scope.selectedAppointment.SEQUENCE <= 80 && $scope.selectedAppointment?.SEQUENCE > 60 ? "12" : "13"
		}
		var assessmentService;
		if ($scope.appointmentInfoRes.length > 0) {
			assessmentService = $scope.selectedAppointment.SEQUENCE <= 20 && $scope.selectedAppointment?.SEQUENCE > 0 ? "5" :
				$scope.selectedAppointment.SEQUENCE <= 40 && $scope.selectedAppointment?.SEQUENCE > 20 ? "14" :
					$scope.selectedAppointment.SEQUENCE <= 60 && $scope.selectedAppointment?.SEQUENCE > 40 ? "15" :
						$scope.selectedAppointment.SEQUENCE <= 80 && $scope.selectedAppointment?.SEQUENCE > 60 ? "16" : "17"
		}

		//var queid=seqSer[2][seqSer[0].findIndex($scope.selectedAppointment.SEQUENCE)];
		//var level = $scope.selectedAppointment.APPT_TIME 
		var level = $scope.getAppointmentLevel($scope.selectedAppointment);
		//debugger;
		if ($scope.forRad($scope.selectedAppointment?.APPT_TYPE)) {
			var queid = level == 'VIP Level 2' ? 51 : level == 'VIP Level 3' ? 52 : level == 'VIP Level 4' ? 53 : 50;
		}
		else {
			var queid = level == 'VIP Level 2' ? 5 : level == 'VIP Level 3' ? 14 : level == 'VIP Level 4' ? 25 : 4;
		}


		var queueInfo = qmatic.connector.client.getQueue(branchId, queid);
		// var cntryCode = document.getElementById("countryCode").value;
		console.log("queueInfo", queueInfo)
		console.log("assessment", assessment)
		var totalWaitingCustomers = queueInfo?.customersWaiting;
		if (totalWaitingCustomers < 3) {
			action = 'VisitCreate';
		}
		else if (totalWaitingCustomers == 3) {
			action = 'Position';
		}
		else {
			action = 'VisitCreate';
		}

		console.log("level", level)
		var registration = $scope.forRad($scope.selectedAppointment?.APPT_TYPE) ? "25" : "4";

		//var countryCode=document.getElementById('countryCode').value;
		var sequence = +$scope.selectedAppointment?.SEQUENCE < 10 ? "0" + $scope.selectedAppointment?.SEQUENCE : $scope.selectedAppointment?.SEQUENCE;
		var token = +$scope.selectedAppointment?.TOKEN_NUMBER < 10 ? "0" + $scope.selectedAppointment?.TOKEN_NUMBER : $scope.selectedAppointment?.TOKEN_NUMBER;
		var tokenNum = sequence + "" + token;
		// var serviceL=!$scope.appointmentInfoRes?[registration]:labser?[registration,serv]:[registration,assessment,serv];
		// latest var serviceL=$scope.appointmentInfoRes.length<=0?[registration]:labser?[registration,docService]:[registration,assessmentService,docService];
		var serviceL = [registration];
		var mobToSendSMS = $scope.printTicketSt == 1 ? $scope.mobileToSendSMS : $scope.countryCode + $scope.mobileToSendSMS
		var params = {
			services: serviceL,
			parameters: {
				phoneNumber: mobToSendSMS,
				customersWaiting: totalWaitingCustomers,
				lang: $scope.lang,
				action: action

			}
		};


		if ($scope.appointmentInfoRes.length > 0) {
			params.parameters.level = level;
			//params.parameters.ticket=tokenNum;
			params.parameters.custom1 = $scope.selectedAppointment?.QID ?? "";
			params.parameters.custom2 = $scope.selectedAppointment?.FIRST_NAME + "|" + $scope.selectedAppointment?.LAST_NAME + "|" + $scope.selectedAppointment?.NATIONALITY + "|" + $scope.selectedAppointment?.GENDER + "|" + $scope.selectedAppointment?.SPECIAL_NEEDS + "|" + $scope.selectedAppointment?.DOB + "|" + $scope.selectedAppointment?.MRN_NUMBER + "|" + $scope.selectedAppointment?.VIP + "|" + $scope.selectedAppointment?.PHONE_MOBILE;
			params.parameters.custom3 = $scope.selectedAppointment?.CLINIC_NAME + "|" + $scope.selectedAppointment?.PRACTITIONER_ID + "|" + $scope.selectedAppointment?.PRACTITIONER_NAME;
			params.parameters.custom4 = $scope.selectedAppointment?.APPT_TIME ?? "";
			params.parameters.custom5 = $scope.selectedAppointment?.APPT_TYPE ?? "";
			params.parameters.sidapptId = $scope.selectedAppointment?.APPT_ID ?? "";
		}



		var visit = qmatic.connector.client.createVisitByUnitId($scope.unitId, params);
		$scope.printTicketSt = 0;
		$scope.isValidAppointment = false;
		$scope.gender = '';
		$scope.appointId = '';
		console.log("visit", visit);
		////debugger;
		if (visit) {
			$scope.selectedAppointment = null;


			//sendSMSNew($scope.customerMobileNumber, totalWaitingCustomers, visit.ticketId, branchId, $scope.lang);
			ticketTimeout = $scope.gccNation ? 8000 : 10000;
			ShowTicketNumber(visit.ticketId);

			$timeout(function () {
				// Manually trigger the digest cycle
				$scope.$apply(function () {
					$scope.jumpto('serviceMenu');
				});
			}, ticketTimeout);


			////debugger;
		} else {
			$scope.selectedAppointment = null;
			var msg = $scope.lang == "en" ? "Unable to Process your request" : "لا نستطيع معالجة طلبك";
			ShowMessage(msg);
			$scope.jumpto('serviceMenu');

		}
		// if ($scope.levelofCustomer == 'VIP Level 1') {
		// 	$scope.jumpto('PageSpecial2');
		// 	$timeout(function () { $scope.lang = "en"; $scope.jumpto('serviceMenu'); }, 30000);
		// }
		//  else if ((custType == 'Wajaha' || custType == 'Segment P') && serviceId != 1 && rmManagers.indexOf(branchId) > -1) {
		// 	//$window.location.reload();
		// 	$scope.jumpto('MezzeFloor');
		// 	$timeout(function () { $scope.lang = "en"; $scope.jumpto('serviceMenu'); }, 30000);
		// 	// $timeout(function(){$scope.lang="ar";$scope.jumpto('Page0');},3000);
		// 	//$scope.jumpto('Page0');
		// } else {
		// 	$scope.lang = "en";
		// 	$scope.jumpto('serviceMenu');
		// }
		$scope.customerData = {};
		$scope.customerData.segment = "C";
		$scope.levelofCustomer = "";
	}

	$scope.showMobileView = function () {
		idleTime = 0;
		if (!$scope.selectedAppointment) {

		}
		else {
			if ($scope.gccNation) {
				$scope.jumpto('mobileMenu');
			}
			else {
				$scope.sendSMS(0);
			}
		}
	}
	//Add Characters
	$scope.addCharStaff1 = function (whatbox, character) {
		idleTime = 0;
		//debugger;
		// clearInterval($scope.idleInterval);
		// $scope.idleInterval = setInterval(timerIncrement, 1000);

		var txthcnumber = '';
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			if ($scope.mobileToSendSMS != undefined) {
				//txthcnumber = $scope.MoborQID;
				txthcnumber = $scope.mobileToSendSMS;
			}
		}

		if (!angular.isUndefined(txthcnumber)) {
			if (whatbox == 'display') {
				if (txthcnumber.length < 8) {
					if (txthcnumber == null) {
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}
			else {
				if (txthcnumber.length < 15) {
					//debugger;
					if (txthcnumber == null) {
						//debugger;
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}

		} else {
			txthcnumber = character;
		}

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			//$scope.MoborQID = txthcnumber;
			$scope.mobileToSendSMS = txthcnumber
		}
	}

	$scope.addCharStaff = function (whatbox, character) {
		idleTime = 0;
		//debugger;
		// clearInterval($scope.idleInterval);
		// $scope.idleInterval = setInterval(timerIncrement, 1000);

		var txthcnumber = '';
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			if ($scope.MoborQID != undefined) {
				txthcnumber = $scope.MoborQID;
				//$scope.mobileToSendSMS =  txthcnumber
			}
		}

		if (!angular.isUndefined(txthcnumber)) {
			$scope.invalidID = false;
			if (whatbox == 'display') {
				if (txthcnumber.length < 11) {
					if (txthcnumber == null) {
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}
			else {
				if (txthcnumber.length < 11) {
					//debugger;
					if (txthcnumber == null) {
						//debugger;
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}

		} else {
			txthcnumber = character;
		}

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			$scope.MoborQID = txthcnumber;
			//$scope.mobileToSendSMS =  txthcnumber
		}
	}

	$scope.addCharAlphabets = function (character) {

		$scope.customerMobileNumber = character;
	}
	$scope.addChar = function (whatbox, character) {
		idleTime = 0;
		//debugger;
		// clearInterval($scope.idleInterval);
		// $scope.idleInterval = setInterval(timerIncrement, 1000);

		var txthcnumber = '';
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			if ($scope.customerMobileNumber != undefined) {
				txthcnumber = $scope.customerMobileNumber;
			}
		}

		if (!angular.isUndefined(txthcnumber)) {
			if (whatbox == 'display') {
				if (txthcnumber.length < 8) {
					if (txthcnumber == null) {
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}
			else {
				if (txthcnumber.length < 8) {
					//debugger;
					if (txthcnumber == null) {
						//debugger;
						txthcnumber = character;
					}
					else {
						if (txthcnumber == '') {
							txthcnumber += character;
						}
						else {
							txthcnumber += character;
						}
					}
				}
			}

		} else {
			txthcnumber = character;
		}

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			$scope.customerMobileNumber = txthcnumber;
		}
	}

	$scope.selectRadio = function (appointment) {
		idleTime = 0;
		$scope.selectedAppointment = appointment;
		console.log("$scope.selectedAppointment", $scope.selectedAppointment);
		$scope.mobileToSendSMS = $scope.selectedAppointment.PHONE_MOBILE;
	};
	$scope.deleteChar1 = function (whatbox) {
		var txthcnumber;
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			//txthcnumber = $scope.MoborQID;
			txthcnumber = $scope.mobileToSendSMS;
		}

		txthcnumber = txthcnumber.substring(0, txthcnumber.length - 1);

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			//$scope.MoborQID = txthcnumber;
			$scope.mobileToSendSMS = txthcnumber;
		}
	}
	$scope.deleteChar = function (whatbox) {
		var txthcnumber;
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			txthcnumber = $scope.MoborQID;
			//txthcnumber = $scope.mobileToSendSMS;
		}

		txthcnumber = txthcnumber.substring(0, txthcnumber.length - 1);

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			$scope.MoborQID = txthcnumber;
			//$scope.mobileToSendSMS = txthcnumber;
		}
	}
	$scope.deleteCharNumber = function (whatbox) {
		var txthcnumber;
		if (whatbox == 'display') {
			txthcnumber = $scope.txthcnumber;
		}
		else {
			txthcnumber = $scope.customerMobileNumber;
		}

		txthcnumber = txthcnumber.substring(0, txthcnumber.length - 1);

		if (whatbox == 'display') {
			$scope.txthcnumber = txthcnumber;
		}
		else {
			$scope.customerMobileNumber = txthcnumber;
		}
	}
	$scope.clearChar = function (whatbox) {
		if (whatbox == 'display') {
			$scope.txthcnumber = '';
		}
		else {
			$scope.customerMobileNumber = '';
			$scope.MoborQID = "";
			$scope.invalidStaffID = ""
			$scope.mobileToSendSMS = "";
		}
	}



	// function showCode(){
	// 	var CntyCode = document.getElementById('countryCode');
	// 	$scope.txthcnumber=CntyCode+$scope.txthcnumber
	// 	$scope.contryCode = CntyCode

	// }

	$scope.serFilter = function (item) {
		var patNationality = $scope.patientNationality == 'Qatari' ? 'Qatari' : 'NQatari';
		var gender = $scope.gender == "M" ? "Male" : "Female";
		var othersMaleNationality = 'Others' + gender + patNationality;
		var otherMale = 'Others' + gender;

		if (item.internalDescription == othersMaleNationality || item.internalDescription == otherMale || item.internalDescription == 'Others')
			return item
	}

	$scope.sendSMSClick=function(){
		var mobileToVal=$scope.countryCode + '' + $scope.mobileToSendSMS;
		var retVAl=mobileToVal.length >= 5 && mobileToVal.length <= 15;
		if(!retVAl)
			ShowMessage('Please fill the mobile number to continue.');
		return retVAl;
	}

	var controller1 = (function ($) {
		// Public contents of controller to access from the outside.
		return {
			/**
			 * Called when widget client has finished loading. This is where you initialize your widget. See index.html
			 */
			onLoaded: function (configuration) {

				wwClient.subscribe('com.qmatic.qp.topic.event.CUSTOMER_IDENTIFIED', process);
				wwClient.subscribe('com.qmatic.qp.topic.event.CUSTOMER_NOT_FOUND', process);


			},

			/**
			 * Called if any error occurs during widget initialization
			 */
			onLoadError: function (message) {
				$('body').append('<p>Widget load error: ' + message + '</p>');
			}
		};
	})(jQuery);

});


function getBranchServiceIds(branchId) {
	//debugger;
	var branch_Id = qmatic.webwidget.client.getBranchId();
	var _serviceList;
	var url_ = '/rest/entrypoint/branches/' + branch_Id + '/services/'
	$.ajax({
		type: 'GET',
		url: url_,
		async: false,
		cache: false,
		username: "restuser",
		password: "restpass",
		success: function (data, status, headers, config) {
			//debugger;
			_serviceList = data;
		},
		error: function (error) {
			//debugger;

		}
	});
	var serv = [];
	_serviceList.forEach(element => {
		serv.push(element.id);
	});
	return serv;
}

function getBranchNameAR() {
	//debugger;
	var branch_Id = qmatic.webwidget.client.getBranchId();
	var _branchList = [];
	var url_ = '/calendar-backend/api/v1/branches/'
	$.ajax({
		type: 'GET',
		url: url_,
		async: false,
		username: "restuser",
		password: "restpass",
		success: function (data, status, headers, config) {
			//debugger;
			_branchList = data.branchList;
		},
		error: function (error) {
			//debugger;

		}
	});
	var branchNAr = [];
	console.log(_branchList);
	_branchList.forEach(element => {
		//debugger;
		if (branch_Id == element.qpId) {
			//debugger;
			if (element.custom != null) {
				var name_1 = JSON.parse(element.custom);
				branchNAr = [name_1.names.ar, name_1.names.en];
			}
		}
	});
	return branchNAr;
}

function getEntryPointId() {
	// This is really bad - got to find a better way!!!
	var i = 1;
	var entryPoint = qmatic.connector.client.getEntryPoint(qmatic.webwidget.client.getBranchId(), i);
	//var entryPoint = qmatic.connector.client.getEntryPoint(2, i);

	while (entryPoint != null) {
		if (entryPoint.unitId == qmatic.webwidget.client.getUnitId())
			return entryPoint.id;

		i++;
		//entryPoint = qmatic.connector.client.getEntryPoint(qmatic.webwidget.client.getBranchId(), i);
		entryPoint = qmatic.connector.client.getEntryPoint(qmatic.webwidget.client.getBranchId(), i);
	}

	// Hopefully we do not find ourselves here...
	return -1;
}
function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

function ShowTicketNumber(ticket) {
	$('#blkTicketNum').html(ticket);
	$('#container-ticketnum').fadeIn();
	setTimeout(function () {
		$('#container-ticketnum').fadeOut();
	}, ticketTimeout);
}

function ShowMessage(message) {
	//debugger;
	$('#blkMessage').html(message);
	$('#container-message').fadeIn();
	setTimeout(function () {
		$('#container-message').fadeOut();
	}, 3000);
}

// var intervalCenter;
// $(function () {
// 	intervalCenter = setInterval(function () {
// 		if (!$('#centerMessage').html()) {
// 			$('#centerMessage').html('<p id="blkMessage" style="font-size: 30px; line-height: 30px;></p>');
// 		}
// 		else {
// 			clearInterval(intervalCenter);
// 		}
// 	}, 500);
// });

