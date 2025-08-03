import { Component, OnInit } from '@angular/core';

declare var MobileTicketAPI:any;

@Component({
  selector: 'app-ticket-sidra',
  templateUrl: './ticket-sidra.component.html',
  styleUrls: ['./ticket-sidra.component.css']
})
export class TicketSidraComponent implements OnInit {

  constructor() { 

    

  }

  
  ngOnInit(): void {
    //http://localhost:4200/MobileTicket/MyVisit/CurrentStatus/branches/1/visits/28?checksum=1888106242

    //http://MobileTicket/MyVisit/CurrentStatus?branch=1&visit=14&checksum=2033434068
  }

}
