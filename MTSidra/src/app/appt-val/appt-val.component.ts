import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameLayoutComponent } from 'app/shared/frame-layout/frame-layout.component';
import { LangService } from 'app/shared/lang.service';
import { setTimeout } from 'node:timers';
declare var MobileTicketAPI :any;
@Component({
  selector: 'app-appt-val',
  templateUrl: './appt-val.component.html',
  styleUrls: ['./appt-val.component.css']
})
export class ApptValComponent implements OnInit {
  public lang=localStorage.getItem('lang')??'en';
  public langService=new Object();
  public invalidID=false;
  public upperCase=true;
  public passportInput= (localStorage.getItem('passportInput')??'false')=='true'?true:false;
  public MoborQID='';
  constructor(private sharedDataService:LangService,private route:ActivatedRoute, private router:Router) {  
    this.langService=this.sharedDataService;
    this.lang=this.sharedDataService.lang;
   }

   public switchInputType = function () {
		this.idleTime = 0;
		this.passportInput = !this.passportInput;
    localStorage.setItem('passportInput',this.passportInput?'true':'false');
		if (this.passportInput) {
			this.langService.jumpto('passport');
			// this.showAlphabet = true;
		}
		else {
			this.langService.jumpto("landing");
			// this.showAlphabet = false;
		}
	}

  public errorfound1=false;  

  getCheckAppointment=function(){
   //debugger;
   this.passportInput=(localStorage.getItem('passportInput')??'false')=='true';  
    if (this.MoborQID.length == 8) {
			this.langService.mobileToSendSMS = this.MoborQID;
		}
		if (!this.passportInput && this.MoborQID.length != 8 && this.MoborQID.length != 11) {
			this.invalidID = true;
			// setTimeout(function () {
			// 		this.invalidID = false;
			// }, 1500);

		}
		else if (this.passportInput && this.MoborQID.length == 0) {
			this.invalidID = true;
			// setTimeout(function () {
			// 		this.invalidID = false;
			// }, 1500);
		}
		else {
			var url_ = 'getAppt';
			var postBody={
        qid:this.MoborQID,
        passport:"",
        branch:this.branch
      };

			if (this.passportInput) {
				postBody = {
					qid: "",
					passport: this.MoborQID,
					branch: this.branch
				};
			}
      else{

      }
  

    MobileTicketAPI.getAppt(postBody,(res)=>{
      //debugger;
      console.log(res);
      var rec=false;
      if(res){
        if(res.data){
          var appts=JSON.parse(res.data);
          if(appts.Table.length>0){rec=true}
        }
      }
      if(rec){
        this.langService.appointment=[appts.Table[0]];
        this.langService.selectedAppointment=appts.Table[0];
        this.langService.mobileToSendSMS=appts.Table[0]['PHONE_MOBILE']??'';
        this.router.navigate(['apptList']);
      }
      else{
        this.router.navigate(['walkin'])
      }
    },(error)=>{});
  }
  }

  addCharStaff=function(input,val){

  };
  public branch;
  ngOnInit(): void {
    this.branch=this.sharedDataService['branch'];
    localStorage.removeItem('visit');
    localStorage.removeItem('service');
  }

}
