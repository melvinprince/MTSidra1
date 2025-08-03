import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ServiceEntity } from '../../entities/service.entity';
import { TicketEntity } from '../../entities/ticket.entity';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-service',
  templateUrl: './service-tmpl.html',
  styleUrls: ['./service.scss', './service-rtl.css']

})
export class ServiceComponent implements OnInit {
  @Input() name: string
  @Input() serviceGroup: boolean
  @Input() entity: ServiceEntity
  @Input() selected: boolean
  @Input() customersWaiting: string
  @Output() onSelection = new EventEmitter();
  public isRtl: boolean;

  constructor() {
   }

  ngOnInit() {
    this.setRtlStyles();
  }

  onSelectService(service) {
    service.selected = !service.selected;
    if (service.selected) {
      this.onSelection.emit(service);
      MobileTicketAPI.setServiceSelection(service);
    } else {
      this.onSelection.emit(undefined);
      MobileTicketAPI.setServiceSelection(undefined);
    }
  }

  setRtlStyles(){
    if(document.dir == "rtl"){
      this.isRtl = true;
    }else{
      this.isRtl = false;
    }
  }

  getVisibilityOfTick(){
    if(this.selected){
      return "visible";
    }else{
      return "hidden";
    }
  }
}
