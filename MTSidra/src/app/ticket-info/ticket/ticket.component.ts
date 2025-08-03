import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { BranchEntity } from '../../entities/branch.entity';
import { ServiceEntity } from '../../entities/service.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { Util } from './../../util/util'

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../shared/css/common-styles.css']
})
export class TicketComponent implements OnInit {
  public iHight = 0;
  public branchEntity: BranchEntity;
  public serviceEntity: ServiceEntity;
  public ticketEntity: TicketEntity;
  public serviceName: string;
  public serviceNameTmp: string;
  public isTicketNumberHidden: boolean = false;
  public isServiceTextSmall: boolean = false;
  public isServiceTextLarge: boolean = true;
  @Input() isTicketEndedOrDeleted: boolean;
  @Input() isAfterCalled: boolean;
  @Input() isCalled: boolean;
  private flashInterval;
  private flashCount: number = 0;
  private isIOS;

  constructor(
    private location: LocationStrategy
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  ngOnInit() {
    // if(localStorage.getItem("visit")){
      let userAgent;
      let util = new Util();
      if (typeof navigator !== 'undefined' && navigator) {
        userAgent = navigator.userAgent;
      }
      this.isIOS = util.isBrowseriOS(userAgent)
      this.ticketEntity = new TicketEntity();
      this.getSelectedBranch();
      this.getTicketInfo();
    // }
    // else{
    //   localStorage.setItem("route","/landing");
    // }
  }

  //MOVE ALL MobileTicketAPI calls to service class otherwise using things this way
  //makes unit test writing impossible

  public getSelectedBranch() {
    if (MobileTicketAPI.getSelectedBranch() !== null) {
      this.branchEntity = MobileTicketAPI.getSelectedBranch();
    }
  }

  public onServiceNameUpdate(serviceName: string) {
    /**
     * Related to the issue: service text not display correctly if it has <br>
     * in iOS rtl mode.
     * Ex: XXXXX <br> YYYY
     * YYYY will not be displayed until UI is updated.
     * fix: programatically update UI with dummy style once service name is loaded
     * -prasad
     */
    if (this.isIOS && document.dir === 'rtl') {
      this.serviceNameTmp = serviceName;
      this.iHight++;
    }
    else {
      this.serviceName = serviceName;
    }
    if (serviceName.length> 15) {
      console.log(serviceName.length)
      this.isServiceTextSmall = true;
      this.isServiceTextLarge = false;
    }
  }

  public setLate(): boolean {
    if (this.iHight > 1 && this.serviceNameTmp) {
      this.serviceName = this.serviceNameTmp;
    }
    return this.iHight > 1;
  }

  // public trimServiceString(str: string) {
  //   let isDash = str.includes('-');
  //   let boolNoBreak: boolean = false;
  //   let row1: string = '';
  //   let row2: string = '';
  //   let dashAry: number[] = [];
  //   let output: string = '';

  //   if (isDash) {
  //     let index = 0;
  //     while ((index = str.indexOf('-', index + 1)) > 0) {
  //       dashAry.push(index);
  //     }
  //     str = str.split('-').join(' ');
  //   }
  //   let isSpace = str.includes(' ');
  //   if (isSpace) {
  //     let spaceAry: string[] = str.split(' ');
  //     for (let i = 0; i < spaceAry.length; i++) {
  //       if (str.length <= 22) {
  //         if (i === 0) {
  //           row1 += spaceAry[i];
  //           if (this.isAllUpperCase(row1)) {
  //             this.isServiceTextSmall = true;
  //             this.isServiceTextLarge = false;
  //           }
  //           else if (row1.length > 15) {
  //             boolNoBreak = true;
  //           }
  //         }
  //         else if (row2.length === 0 && row1.length + spaceAry[i].length <= 11) {
  //           row1 += ' ' + spaceAry[i];
  //         }
  //         else if (row2.length + spaceAry[i].length <= 11) {
  //           if (row2.length === 0 && !boolNoBreak) {
  //             row2 = spaceAry[i];
  //           }
  //           else {
  //             row2 += ' ' + spaceAry[i];
  //           }
  //         }
  //         else if (row1.length + row2.length < str.length) {
  //           boolNoBreak = true;
  //           row2 += ' ' + spaceAry[i];
  //         }
  //       }
  //       else if (str.length > 22 && str.length <= 28) {
  //         this.isServiceTextSmall = true;
  //         this.isServiceTextLarge = false;
  //         if (i === 0) {
  //           row1 += spaceAry[i];
  //           if (this.isAllUpperCase(row1)) {
  //             if (row1.length > 11) {
  //               boolNoBreak = true;
  //             }
  //           }
  //           else if (row1.length > 15) {
  //             boolNoBreak = true;
  //           }
  //         }
  //         else if (row2.length === 0 && row1.length + spaceAry[i].length <= 14) {
  //           row1 += ' ' + spaceAry[i];
  //         }
  //         else if (row2.length + spaceAry[i].length <= 14) {
  //           if (row2.length === 0 && !boolNoBreak) {
  //             row2 = spaceAry[i];
  //           }
  //           else {
  //             row2 += ' ' + spaceAry[i];
  //           }
  //         }
  //         else if (row1.length + row2.length < str.length) {
  //           boolNoBreak = true;
  //           row2 += ' ' + spaceAry[i];
  //         }
  //       }
  //       else if (str.length > 28) {
  //         this.isServiceTextSmall = true;
  //         this.isServiceTextLarge = false;
  //         if (i === 0) {
  //           row1 += spaceAry[i];
  //           if (row1.length > 14) {
  //             boolNoBreak = true;
  //           }
  //         }
  //         else if (row2.length === 0 && row1.length + spaceAry[i].length <= 14) {
  //           row1 += ' ' + spaceAry[i];
  //         }
  //         else if (row2.length + spaceAry[i].length <= 14) {
  //           if (row2.length === 0 && !boolNoBreak) {
  //             row2 = spaceAry[i];
  //           }
  //           else {
  //             row2 += ' ' + spaceAry[i];
  //           }
  //         }
  //         else if (row2.length + spaceAry[i].length > 14) {
  //           row2 += spaceAry[i];
  //           row2 = row2.slice(0, 11) + '...';
  //           break;
  //         }

  //       }
  //     }
  //   }
  //   else {
  //     if (str.length <= 22) {
  //       output = str;
  //       return output;
  //     }
  //     else if (str.length > 22 && str.length <= 28) {
  //       this.isServiceTextSmall = true;
  //       this.isServiceTextLarge = false;
  //       output = str;
  //       return output;
  //     }
  //     else if (str.length > 28) {
  //       this.isServiceTextSmall = true;
  //       this.isServiceTextLarge = false;
  //       output = str.slice(0, 25) + '...';
  //       return output;
  //     }
  //   }
  //   if (boolNoBreak) {
  //     if (row1.length + row2.length > 28) {
  //       row1 = row1 + row2;
  //       row1 = row1.slice(0, 25) + '...';
  //       output = this.processDash(isDash, row1, '', dashAry, boolNoBreak);
  //       return output;
  //     }
  //     output = this.processDash(isDash, row1, row2, dashAry, boolNoBreak);
  //     return output;
  //   }
  //   return this.processDash(isDash, row1, row2, dashAry, boolNoBreak);
  // }

  // public isAllUpperCase(txt) {
  //   let uCntr = 0;
  //   for (let i = 0; i <= txt.length; i++) {
  //     let character = txt.charAt(i);
  //     if (!isNaN(character * 1)) {
  //     } else {
  //       if (character === character.toUpperCase()) {
  //         uCntr++;
  //       }
  //     }
  //   }
  //   if (uCntr > 6) {
  //     return true;
  //   }
  //   return false;
  // }

  // public processDash(isDash, row1, row2, dashAry, boolNoBreak) {
  //   let output: string = '';
  //   let linebrakIndex: number = 0;

  //   if (!boolNoBreak) {
  //     output = row1 + '|' + row2;
  //   }
  //   else {
  //     output = row1 +  ' ' + row2;
  //   }

  //   if (isDash) {
  //     for (let j = 0; j < output.length; j++) {
  //       if (output[j] === '|') {
  //         linebrakIndex = j;
  //       }
  //       for (let k = 0; k < dashAry.length; k++) {
  //         if (dashAry[k] === j) {

  //           if (output[j] === ' ') {
  //             output = this.replaceAt(output, j, '-');
  //           }
  //           else if (linebrakIndex < j) {
  //             if (output[j + 1] === ' ') {
  //               output = this.replaceAt(output, j + 1, '-');
  //             }
  //             else {
  //               output = [output.slice(0, j), '-', output.slice(j)].join('');
  //             }
  //           }
  //           else {
  //             output = [output.slice(0, j), '-', output.slice(j)].join('');
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (!boolNoBreak) {
  //     output = output.replace('|', '<br>');
  //   }
  //   return output;
  // }

  // public replaceAt(s, n, t) {
  //   return s.substring(0, n) + t + s.substring(n + 1);
  // }

  public getTicketInfo() {
    if (MobileTicketAPI.getCurrentVisit() !== null) {
      this.ticketEntity = MobileTicketAPI.getCurrentVisit();
      console.log(this.ticketEntity)
    }
  }

  public onTicketIdChange() {
    if (MobileTicketAPI.getCurrentVisitStatus().ticketId != null) {
      this.ticketEntity.ticketNumber = MobileTicketAPI.getCurrentVisitStatus().ticketId;
    } else {
      this.ticketEntity.ticketNumber = '';
    }
  }

  startFlashing() {
    // Clear if any previous interval this runing
    clearInterval(this.flashInterval);
    this.flashCount = 0;
    var context = this;

    // Start new interval
    this.flashInterval = setInterval(function () {
      context.flashCount++;
      context.isTicketNumberHidden = !!!context.isTicketNumberHidden;
      console.log("flash count - " + context.flashCount);

      if (context.flashCount === 6) {
        // Stop interval after 3 seconds
        clearInterval(context.flashInterval);
      }
    }, 500);
  }

  getTicketNumberLength() {
    return this.ticketEntity.ticketNumber.length;
  }

}
