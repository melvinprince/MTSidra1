import { Component, OnInit } from '@angular/core';
import { LangService } from 'app/shared/lang.service';

@Component({
  selector: 'app-mobile-entry',
  templateUrl: './mobile-entry.component.html',
  styleUrls: ['./mobile-entry.component.css']
})
export class MobileEntryComponent implements OnInit {

 public lang=localStorage.getItem('lang')??'en';
   public langService=new Object();
   public invalidID=false;
   public upperCase=true;
   public passportInput= (localStorage.getItem('passportInput')??'false')=='true'?true:false;
   public mobileNo='';
   constructor(private sharedDataService:LangService) {  
     this.langService=this.sharedDataService;
     this.lang=this.sharedDataService.lang;
     this.mobileNo=this.langService['mobileToSendSMS'];
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

   createVisit=function(){
    this.langService.mobileToSendSMS=this.mobileNo;
    this.selectedAppointment=JSON.parse(localStorage.getItem('apptInfo'));
    this.langService.prepareValues();
    setTimeout(()=> {
      this.langService.createTicket();
    },1500);
  }


   addCharStaff=function(input,val){
 
   };
   public branch;
   ngOnInit(): void {
     this.branch=this.sharedDataService['branch'];
     
   }

}
