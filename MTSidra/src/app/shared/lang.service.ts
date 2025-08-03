import { AfterViewInit, Injectable, OnInit } from '@angular/core';
import {ApptEntity } from '../entities/appt.entity';
import { Router } from '@angular/router';
import { Config } from 'app/config/config';
import { Util } from 'app/util/util';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialogService } from './alert-dialog/alert-dialog.service';
import { RetryService } from './retry.service';

declare var MobileTicketAPI:any;

declare var ga: Function;

@Injectable({
  providedIn: 'root'
})
export class LangService implements AfterViewInit {
	public lang=localStorage.getItem('lang')??'en';	
	private _showNetWorkError = false;
	private retryService: RetryService;
	branch=localStorage.getItem('branchId')??'0';	
   backtxt = this.config.getConfig('backtxt');
	 regis = this.config.getConfig('regis');
	 proceedButton :any;
	 pageMobileEntryLine1 :any;
	 enterpassportNum :any;
	 yourTicketNumber :any;
	 confirmMobileNumber:any;
	 waitInWaitingArea :any;
	 nongccticketmsg :any;
	 closebtntxt :any;
	 withoutTicket :any;
	 checkAppt :any;
	 langTxt :any;
	 AppTime :any;
	 doctorsname :any;
	 AppDate :any;
	 novalidAppointment :any;
	 pleasetake :any;
	 invalidMsg :any;
	 selectAnOption :any;
	 gccOption :any;
	 nonGCCOption :any;
	 patientName :any;
   page0 :any;
	 pageServMsg :any;
	 page1 :any;

	
	 
	setpassportInput=function(inp){
		this.passportInput=inp;
	}
	
	public mobileToSendSMS='';
  setLang=function(lang_){
    this.lang=lang_;
	localStorage.setItem('lang',this.lang)
  };
  getLang=function(){
    return this.lang;
  };
  setBranch=function(branch_){
    this.branch=branch_;
  };
  setLocation=function(location_){
    this.location=location_;
  }

  setProperty=function(property,value){
	this[property]=value;
  }  

  jumpto=function(route_1){
	//debugger;
	localStorage.setItem('route',route_1);
	this.router.navigate([route_1]);	
  } 
  
  private isTakeTicketClickedOnce: boolean;  
  public showLoader = false;

   createVisit() {
	  if (!this.isTakeTicketClickedOnce) {
		this.isTakeTicketClickedOnce = true;
		let visitInfo = MobileTicketAPI.getCurrentVisit();
		if (visitInfo && visitInfo !== null && visitInfo.visitStatus !== 'DELETE') {
		  this.router.navigate(['ticket']);
		} else {
		  let isDeviceBounded = this.config.getConfig('block_other_browsers');
		  if (isDeviceBounded === 'enable') {
			import('fingerprintjs2').then(Fingerprint2 => {
			  let that = this;
			  Fingerprint2.getPromise({
				excludes: {
				  availableScreenResolution: true,
				  adBlock: true,
				  enumerateDevices: true
				}
			  }).then(function (components) {
				let values = components.map(function (component) { return component.value });
				let murmur = Fingerprint2.x64hash128(values.join(''), 31);
				MobileTicketAPI.setFingerprint(murmur);
				that.createTicket();
			  })
			});
		  } else {
			this.createTicket();
		  }
		}
	  }
	}

	

	forLabRad = function (appt_Type) {
		let radLab = ["Lab General", "Ultrasound", "US OB", "US GYN", "PAT New"];
		var labst = this.radLab.findIndex(function (item) {
			return item === appt_Type
		}) >= 0;
		return labst;
	}

	dispDoc = function (pract) {
		//debugger;
		var pract1 = pract.replace(/ /g, "");
		return pract1 != "" && pract1 != null;
	}

	
	getServiceIdForApptType = function (appt_Type,branchConf) {

		let radOnly = ["US OB"];//,"US GYN" is for side a and us ob is for side b
		let apptLocation='';
		branchConf['location'].forEach(element => {
			var availableForLocation= branchConf['apptType'+element].findIndex((item)=>{
				return item === appt_Type
			})>=0;
			if(availableForLocation){
				apptLocation=element;
			}
		});
		return branchConf['defaultApptService'+apptLocation];		
	}
	getQueueIdForApptType = function (appt_Type,branchConf) {
debugger;
		let radOnly = ["US OB"];//,"US GYN" is for side a and us ob is for side b
		let apptLocation=appt_Type;
		// branchConf['location'].forEach(element => {
		// 	var availableForLocation= branchConf['apptType'+element].findIndex((item)=>{
		// 		return item === appt_Type
		// 	})>=0;
		// 	if(availableForLocation){
		// 		apptLocation=element;
		// 	}
		// });
		// if appt type is for side b then check for apptTypeSideB else return the queue for the location
		var availableForLocation= branchConf['apptTypeSideB'].findIndex((item)=>{
				return item === appt_Type
			})>=0;
			if(availableForLocation){
				return branchConf['queueSideB'];
			}
			else{
				return branchConf['queue'+apptLocation];

			}

		// return branchConf['queue'+apptLocation];		
	}

	getAppointmentLevel = function (selApp) {
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

	public prepareValues=function(){
	debugger;

	let branchConf = this.config.getConfig('branchConf').find(br=>br.branch==this.branch);
	localStorage.setItem('apptInfo',JSON.stringify(this.selectedAppointment));
	console.log(branchConf);
		// console.log("selectedAppointment", this.selectedAppointment)
		
		var docService;
		if(this.appointment){
			if (this.appointment.length > 0) {
				docService = this.selectedAppointment.SEQUENCE <= 20 && this.selectedAppointment?.SEQUENCE > 0 ? "9" :
				this.selectedAppointment.SEQUENCE <= 40 && this.selectedAppointment?.SEQUENCE > 20 ? "10" :
						this.selectedAppointment.SEQUENCE <= 60 && this.selectedAppointment?.SEQUENCE > 40 ? "11" :
							this.selectedAppointment.SEQUENCE <= 80 && this.selectedAppointment?.SEQUENCE > 60 ? "12" : "13"
			}
			var assessmentService;
			if (this.appointment.length > 0) {
				assessmentService = this.selectedAppointment.SEQUENCE <= 20 && this.selectedAppointment?.SEQUENCE > 0 ? "5" :
					this.selectedAppointment.SEQUENCE <= 40 && this.selectedAppointment?.SEQUENCE > 20 ? "14" :
						this.selectedAppointment.SEQUENCE <= 60 && this.selectedAppointment?.SEQUENCE > 40 ? "15" :
							this.selectedAppointment.SEQUENCE <= 80 && this.selectedAppointment?.SEQUENCE > 60 ? "16" : "17"
			}
		}

		//var queid=seqSer[2][seqSer[0].findIndex(this.selectedAppointment.SEQUENCE)];
		//var level = this.selectedAppointment.APPT_TIME 
		var level = this.selectedAppointment?this.getAppointmentLevel(this.selectedAppointment):"";
		//debugger;
		var location_1=localStorage.getItem('location');
		var registration =this.selectedAppointment? this.getServiceIdForApptType(this.selectedAppointment?.APPT_TYPE,branchConf):branchConf["defaultApptService"+location_1];
		var apptQueues=this.selectedAppointment? this.getQueueIdForApptType(this.selectedAppointment?.APPT_TYPE,branchConf):branchConf["queue"+location_1];
		// if (this.getQueueIdForApptType(this.selectedAppointment?.APPT_TYPE,branchConf)) {
		var vipLevel=level.toLowerCase().replace(/ /g,'');
		var queid=vipLevel==""?branchConf['defaultQueue'+location_1]:apptQueues[vipLevel];
			//var queid = level == 'VIP Level 2' ? 51 : level == 'VIP Level 3' ? 52 : level == 'VIP Level 4' ? 53 : 50;
		// }
		// else {
		// 	var queid = level == 'VIP Level 2' ? 5 : level == 'VIP Level 3' ? 14 : level == 'VIP Level 4' ? 25 : 4;
		// }


		var allServiceWaiting;
		if(this.appointment){
		if(this.appointment.length>0){
			MobileTicketAPI.getServices((serviceList)=>{
				var curServiceiInf=serviceList.find((ser)=>ser.serviceId==registration);
				this.processAfterWaiting(curServiceiInf.customersWaitingInDefaultQueue,registration,level,branchConf);

			},(xhr,status,errorMessage)=>{
				console.log(errorMessage);
				this.processAfterWaiting(0,registration,level,branchConf);
			});
		}
		else{
			MobileTicketAPI.getQueueInfo(queid,(queueInf)=>{
				this.processAfterWaiting(queueInf.customersWaiting,registration,level,branchConf);

			},(xhr,status,errorMessage)=>{
				console.log(errorMessage);
				this.processAfterWaiting(0,registration,level,branchConf);
			});
		}
	}
	else{
		MobileTicketAPI.getQueueInfo(queid,(queueInf)=>{
			this.processAfterWaiting(queueInf.customersWaiting,registration,level,branchConf);

		},(xhr,status,errorMessage)=>{
			console.log(errorMessage);
			this.processAfterWaiting(0,registration,level,branchConf);
		});
	}
		
		
	}
	countryCode='+974';
	processAfterWaiting(waiting,registration,level,branchConf){
		
			// var cntryCode = document.getElementById("countryCode").value;
		var action='';
		var totalWaitingCustomers = waiting;
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
		

		//var countryCode=document.getElementById('countryCode').value;
		// var sequence = +this.selectedAppointment?.SEQUENCE < 10 ? "0" + this.selectedAppointment?.SEQUENCE : this.selectedAppointment?.SEQUENCE;
		// var token = +this.selectedAppointment?.TOKEN_NUMBER < 10 ? "0" + this.selectedAppointment?.TOKEN_NUMBER : this.selectedAppointment?.TOKEN_NUMBER;
		// var tokenNum = sequence + "" + token;
		// var serviceL=!this.appointment?[registration]:labser?[registration,serv]:[registration,assessment,serv];
		// latest var serviceL=this.appointment.length<=0?[registration]:labser?[registration,docService]:[registration,assessmentService,docService];
		var serviceL = [registration];
		var mobToSendSMS = this.countryCode + this.mobileToSendSMS
		var params = {
			services: serviceL,
			parameters: {
				phoneNumber: mobToSendSMS,
				customersWaiting: totalWaitingCustomers,
				lang: this.lang,
				action: action

			}
		};

		if(this.appointment){
		if (this.appointment.length > 0) {
			params.parameters['level'] = level;
			//params.parameters.ticket=tokenNum;
			params.parameters['custom1'] = this.selectedAppointment?.QID ?? "";
			params.parameters['custom2'] = this.selectedAppointment?.FIRST_NAME + "|" + this.selectedAppointment?.LAST_NAME + "|" + this.selectedAppointment?.NATIONALITY + "|" + this.selectedAppointment?.GENDER + "|" + this.selectedAppointment?.SPECIAL_NEEDS + "|" + this.selectedAppointment?.DOB + "|" + this.selectedAppointment?.MRN_NUMBER + "|" + this.selectedAppointment?.VIP + "|" + this.selectedAppointment?.PHONE_MOBILE;
			params.parameters['custom3'] = this.selectedAppointment?.CLINIC_NAME + "|" + this.selectedAppointment?.PRACTITIONER_ID + "|" + this.selectedAppointment?.PRACTITIONER_NAME;
			params.parameters['custom4'] = this.selectedAppointment?.APPT_TIME ?? "";
			params.parameters['custom5'] = this.selectedAppointment?.APPT_TYPE ?? "";
			params.parameters['sidapptId'] = this.selectedAppointment?.APPT_ID ?? "";

		
		
          
		MobileTicketAPI.setlevel(params.parameters['level']);
		MobileTicketAPI.setCustom1(params.parameters['custom1']);
		MobileTicketAPI.setCustom2(params.parameters['custom2']);
		MobileTicketAPI.setCustom3(params.parameters['custom3']);
		MobileTicketAPI.setCustom4(params.parameters['custom4']);
		MobileTicketAPI.setCustom5(params.parameters['custom5']);
		MobileTicketAPI.setsidapptId(params.parameters['sidapptId']);

		}
	}
		
		MobileTicketAPI.getServiceInfo(registration,(serviceInf)=>{
			MobileTicketAPI.setServiceSelection(serviceInf);
			localStorage.setItem('service',JSON.stringify(serviceInf));
			this.addToLocalStorage('service', JSON.stringify(serviceInf), 0.005);
		},(xhr,status,errorMessage)=>{
			console.log(errorMessage);
		});

		localStorage.setItem('visitParamToCreate', JSON.stringify(params));
		

		// if(this.gccNation){
		// 	this.jumpto('/mobileentry');
		// }
		// else{
		// 	MobileTicketAPI.createVisit((data)=>{
		// 		this.router.navigate(['/ticket']);
		// 	},(xhr,status,errorMessage)=>{
		// 		console.log(errorMessage);
		// 	});
		// }

		

		// MobileTicketAPI.createVisit((data)=>{
		// 	this.router.navigate(['/ticket']);
		// },(xhr,status,errorMessage)=>{
		// 	console.log(errorMessage);
		// });
		//debugger;
	}


	public  addToLocalStorage=function(name, value, days) {
		var enc = window.btoa(unescape(encodeURIComponent(JSON.stringify({"data" : value, "created": date}))));
		if (days) {
		  var date = new Date();;
		}
		else var expires = "";
		localStorage.setItem(name,enc);
	}
  
	public createTicket =function() {
		//debugger;
		// if(this.gccNation){
		// 	this.jumpto('/mobileentry');
		// }
		// else{
			var params=JSON.parse(localStorage.getItem("visitParamToCreate"));
			MobileTicketAPI.customCreateVisit(params,(data)=>{
				this.jumpto('/ticket');
			},(xhr,status,errorMessage)=>{
				console.log(errorMessage);
			});
		// }
	}
	showHideNetworkError(value: boolean) {
		this._showNetWorkError = value;
	  }
  public appointment:ApptEntity[];
  public selectedAppointment:ApptEntity;
  public gccNation:boolean=true;
  public passportInput=(localStorage.getItem('passportInput')??'false')=='true';
  gccSelection=function(selection){
	this.gccNation=selection;
  }

  constructor(private router:Router, private config: Config, private translate: TranslateService,private alertDialogService: AlertDialogService) { }  
	ngAfterViewInit(): void {
		debugger;
		this.backtxt = this.config.getConfig('backtxt');
	 this.regis = this.config.getConfig('regis');
	 this.proceedButton = this.config.getConfig('proceedButton');
	 this.pageMobileEntryLine1 = this.config.getConfig('pageMobileEntryLine1');
	 this.enterpassportNum = this.config.getConfig('enterpassportNum');
	 this.yourTicketNumber = this.config.getConfig('yourTicketNumber');
	 this.confirmMobileNumber = this.config.getConfig('confirmMobileNumber');
	 this.waitInWaitingArea = this.config.getConfig('waitInWaitingArea');
	 this.nongccticketmsg = this.config.getConfig('nongccticketmsg');
	 this.closebtntxt = this.config.getConfig('closebtntxt');
	 this.withoutTicket = this.config.getConfig('withoutTicket');
	 this.checkAppt = this.config.getConfig('checkAppt');
	 this.langTxt = this.config.getConfig('langTxt');
	 this.AppTime = this.config.getConfig('AppTime');
	 this.doctorsname = this.config.getConfig('doctorsname');
	 this.AppDate = this.config.getConfig('AppDate');
	 this.novalidAppointment = this.config.getConfig('novalidAppointment');
	 this.pleasetake = this.config.getConfig('pleasetake');
	 this.invalidMsg = this.config.getConfig('invalidMsg');
	 this.selectAnOption = this.config.getConfig('selectAnOption');
	 this.gccOption = this.config.getConfig('gccOption');
	 this.nonGCCOption = this.config.getConfig('nonGCCOption');
	 this.patientName = this.config.getConfig('patientName');
   	 this.page0 = this.config.getConfig('page0');
	 this.pageServMsg = this.config.getConfig('pageServMsg');
	 this.page1 = this.config.getConfig('page1');
	}
    gender;
    customerType;
    location='';  
	
	// public passportInput=(localStorage.getItem('passportInput')??'false')=='true';
}
