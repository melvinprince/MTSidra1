import { Component, OnInit } from '@angular/core';
import { ApptEntity } from 'app/entities/appt.entity';
import { LangService } from 'app/shared/lang.service';

@Component({
  selector: 'app-appt-list',
  templateUrl: './appt-list.component.html',
  styleUrls: ['./appt-list.component.css']
})
export class ApptListComponent implements OnInit {

  public AppointmentsList:ApptEntity[];
  public langService=new Object();
  constructor(private sharedSErvice:LangService) { 
    this.langService=sharedSErvice;
    this.AppointmentsList=this.langService['appointment'];
    //debugger;
   }

   ngAfterViewInit(){
      
   }
   showMobileView= function(){
	
	//debugger;
		if (!this.langService.selectedAppointment) {

		}
		else {
			if (this.langService.gccNation) {
				this.langService.jumpto('mobileentry');
			}
			else {
				this.langService.createVisit();
			}
		}
   }
   getLateEarly = function (selApp) {
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
  dispDoc = function (pract) {
		//debugger;
		var pract1 = pract.replace(/ /g, "");
		return pract1 != "" && pract1 != null;
	}

	selectRadio = function (appointment) {
		this.langService.selectedAppointment = appointment;
		this.langService.mobileToSendSMS = this.langService.selectedAppointment.PHONE_MOBILE;
	};

  ngOnInit(): void {
  }

  

}
