import { Component, OnInit } from '@angular/core';
import { LangService } from 'app/shared/lang.service';

@Component({
  selector: 'app-walkin',
  templateUrl: './walkin.component.html',
  styleUrls: ['./walkin.component.css']
})
export class WalkinComponent implements OnInit {

  public lang=localStorage.getItem('lang')??'en';
      public langService=new Object();
      public upperCase=true;
      public passportInput= (localStorage.getItem('passportInput')??'false')=='true'?true:false;
      public MoborQID='';
      constructor(private sharedDataService:LangService) {  
        this.langService=this.sharedDataService;
        this.lang=this.sharedDataService.lang;
       }
    
       public switchInputType = function () {
        this.idleTime = 0;
        this.passportInput = !this.passportInput;
        localStorage.setItem('passportInput',this.passportInput?'true':'false');
        this.langService.setpassportInput(this.passportInput);
        if (this.passportInput) {
          this.langService.jumpto('passport');
          // this.showAlphabet = true;
        }
        else {
          this.langService.jumpto("landing");
          // this.showAlphabet = false;
        }
      }
  
      gccSelection=function(gcc){
        this.langService.gccSelection(gcc);
        this.langService.jumpto('landing');
      }

      

      regTicket=function(){
        //debugger;
        this.langService.prepareValues();
        setTimeout(()=>{
          //debugger;
          this.langService.createTicket();
        },500);
        
      }
  
      ngOnInit(): void {
      }

}
