import { Component, OnInit } from '@angular/core';
import { Util } from './../../util/util';
import { TranslateService } from '@ngx-translate/core';
import { Config } from 'app/config/config';
import {LangService} from '../lang.service';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'app/branch/branch.service';
declare var MobileTicketAPI:any;
@Component({
  selector: 'qm-frame-layout',
  templateUrl: './frame-layout.component.html',
  styleUrls: ['./frame-layout.component.css']
})

export class FrameLayoutComponent implements OnInit {
  public onBrowserNotSupport: string;
  private _isBrowserSupport = false;
  private thisBrowser;
  public isApplePlatform = false;
  public isLogoFooterEnabled =  false; 
  public isCustomFooterEnabled =  false;
  public customText;
  public defautlDir: boolean;
  public lang=localStorage.getItem('lang')??'en';
  public currentRoute='/landing';
  public invalidID=false;
  public idleTime=0
  public passportInput=false;
  public errorfound1=false;
  
  public toggle_lang = function () {
		if (this.lang == 'ar')
			this.lang = 'en';
		else {
			this.lang = 'ar';
		}
    this.langService.setLang(this.lang);
	};

  constructor(private translate: TranslateService, private config: Config, private langService:LangService,private route:ActivatedRoute, private branchService:BranchService) {
    
  }

  ngOnInit() {
    this.loadTranslations();
    this.doesBrowserSupport();
    debugger;
    
    
	debugger;
	 this.langService.setProperty("backtxt",this.config.getConfig('backtxt'));
	 this.langService.setProperty("regis", this.config.getConfig('regis'));
	 this.langService.setProperty("proceedButton", this.config.getConfig('proceedButton'));
	 this.langService.setProperty("pageMobileEntryLine1", this.config.getConfig('pageMobileEntryLine1'));
	 this.langService.setProperty("enterpassportNum", this.config.getConfig('enterpassportNum'));
	 this.langService.setProperty("yourTicketNumber", this.config.getConfig('yourTicketNumber'));
	 this.langService.setProperty("confirmMobileNumber", this.config.getConfig('confirmMobileNumber'));
	 this.langService.setProperty("waitInWaitingArea", this.config.getConfig('waitInWaitingArea'));
	 this.langService.setProperty("nongccticketmsg", this.config.getConfig('nongccticketmsg'));
	 this.langService.setProperty("closebtntxt", this.config.getConfig('closebtntxt'));
	 this.langService.setProperty("withoutTicket", this.config.getConfig('withoutTicket'));
	 this.langService.setProperty("checkAppt", this.config.getConfig('checkAppt'));
	 this.langService.setProperty("langTxt", this.config.getConfig('langTxt'));
	 this.langService.setProperty("AppTime", this.config.getConfig('AppTime'));
	 this.langService.setProperty("doctorsname", this.config.getConfig('doctorsname'));
	 this.langService.setProperty("AppDate", this.config.getConfig('AppDate'));
	 this.langService.setProperty("novalidAppointment", this.config.getConfig('novalidAppointment'));
	 this.langService.setProperty("pleasetake", this.config.getConfig('pleasetake'));
	 this.langService.setProperty("invalidMsg", this.config.getConfig('invalidMsg'));
	 this.langService.setProperty("selectAnOption", this.config.getConfig('selectAnOption'));
	 this.langService.setProperty("gccOption", this.config.getConfig('gccOption'));
	 this.langService.setProperty("nonGCCOption", this.config.getConfig('nonGCCOption'));
	 this.langService.setProperty("patientName", this.config.getConfig('patientName'));
   this.langService.setProperty("page0", this.config.getConfig('page0'));
	 this.langService.setProperty("pageServMsg", this.config.getConfig('pageServMsg'));
	 this.langService.setProperty("page1", this.config.getConfig('page1'));
  

    if (this.config.getConfig('footer').logo.value.trim() === 'enable') {
      this.isLogoFooterEnabled = true; 
    } else {
      this.isLogoFooterEnabled = false;
      if (this.config.getConfig('footer').custom_text.value.trim().length > 0) {
        this.isCustomFooterEnabled = true;
        this.customText = this.config.getConfig('footer').custom_text.value.trim();
      } else {
        this.isCustomFooterEnabled = false;
      }
    }
    this.defautlDir = (document.dir == 'rtl') ? false : true;    
    var branchList = this.branchService.validateLocation((validateBranchDataReceived)=>{
      debugger;
       if (validateBranchDataReceived && validateBranchDataReceived.length > 0) {
          this.route.queryParams.subscribe(params=>{
            //debugger;
            if(params["branch"]!=undefined && params["branch"]!=""){
              localStorage.setItem("route","landing");
              
              this.currentRoute ="landing";
              this.langService.setBranch(params["branch"]);
              localStorage.setItem("branchId",""+params["branch"]);
              MobileTicketAPI.getBranchInfoById(params["branch"],(branchInf)=>{
                //debugger;
                MobileTicketAPI.setBranchSelection(branchInf);
                //MobileTicketAPI.saveToLocalStorage();
                localStorage.setItem('branch',JSON.stringify(branchInf));
                this.langService.addToLocalStorage('branch', JSON.stringify(branchInf), 0.005);
                console.log(MobileTicketAPI.getSelectedBranch());
              },(xhr,status,errorMessage)=>{
                //debugger;
                console.log(errorMessage);
              })
              
              
              this.errorfound1=false;
            }
            else if(localStorage.getItem('branchId')!=undefined){
              this.langService.setBranch(Number(localStorage.getItem('branchId')));
            }

            if(params["branch"]==undefined || params["branch"]==""){
              this.currentRoute =localStorage.getItem('route')??"landing";
            }
            
            if(localStorage.getItem("route")=="ticket" && !localStorage.getItem("visit")){
              localStorage.setItem("route", "landing");
            }

            // if(!localStorage.getItem("visit")){
            //   localStorage.setItem("route","/landing");
            // }

            if(params["location"]!=undefined && params["location"]!=""){
              this.langService.setLocation(params["location"]);
              localStorage.setItem("location",""+params["location"]);
            }
            else if(localStorage.getItem('location')!=undefined){
              this.langService.setLocation(Number(localStorage.getItem('location')));
            }
            
          });
          setTimeout(()=>{
            this.langService.jumpto(this.currentRoute);
          },300);
       }
       else{
        this.errorfound1 = true;
        this.langService.jumpto('no_branch');
       }
    });
    
  }

  loadTranslations() {
    this.translate.get('support.this_browser').subscribe((res: string) => {
      this.thisBrowser = res;
    });
  }

  

  get isBrowserSupport(): boolean {
    return this._isBrowserSupport;
  }

  public doesBrowserSupport() {
    let util = new Util()
    var agent
    if (typeof navigator !== 'undefined' && navigator) {
      agent = navigator.userAgent;
    }
    this.isApplePlatform = util.isApplePlatform();
    try {
      let browser = util.getDetectBrowser(agent)
      // this.isBrowserSupport = true;

      if (browser.name === 'chrome' || browser.name === 'safari' || browser.name === 'ios'
          || browser.name === 'opera' || browser.name === 'crios' || browser.name === 'firefox'
          || browser.name === 'fxios' || browser.name === 'edge' || browser.name === 'edgios') {
        this._isBrowserSupport = true;
      } else if (browser.name !== '' && browser.name) {
        this.onBrowserNotSupport = browser.name;
      } else {
        this.onBrowserNotSupport = this.thisBrowser;
      }
    } catch (e) {
      this.onBrowserNotSupport = this.thisBrowser;
    }
  }
}
