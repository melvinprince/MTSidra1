import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BranchService } from '../branch.service';
import { BranchEntity } from '../../entities/branch.entity';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RetryService } from '../../shared/retry.service';
import { SortPipe } from '../../util/sort.pipe';
import { PlatformLocation } from '@angular/common'
import { ActivatedRoute } from '@angular/router';
import { Util } from './../../util/util';
import { BranchOpenHoursValidator } from '../../util/branch-open-hours-validator';
import { Config } from '../../config/config'

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-branches',
  templateUrl: './branches-tmpl.html',
  styleUrls: ['./branches.css']
})
export class BranchesComponent implements AfterViewInit {
  public branches: Array<BranchEntity>;
  public showBranchList: boolean = true;
  public showLoader: boolean = true;
  public networkError = false;
  public loadingText: string = "Loading...";
  private nmbrOfEnabledBranches: number;
  public loaderResource: string = "app/resources/loader.svg";
  private isRedirectedFromServices: boolean = false;

  @Output() startLoading = new EventEmitter<boolean>();
  @Output() onShowHideRequest = new EventEmitter<boolean>();
  @Output() isBranchOpen = new EventEmitter<boolean>();

  constructor(private branchService: BranchService, private retryService: RetryService, private route: ActivatedRoute,
    public router: Router, private translate: TranslateService,
    private sort: SortPipe, location: PlatformLocation, private config: Config, private openHourValidator: BranchOpenHoursValidator) {
    this.translate.get('branch.defaultTitle').subscribe((res: string) => {
      document.title = res;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['redirect'] != undefined) {
        this.isRedirectedFromServices = true;
      }
    });
  }

  ngAfterViewInit() {
    if (this.branchOpenCheck()) {
      this.loadData(this.branchService, this.retryService);
      this.isBranchOpen.emit(true);
    } else {
      this.router.navigate(['open_hours']);
    }
  }

  ngAfterViewChecked() {

  }

  public branchOpenCheck() {
    return this.openHourValidator.openHoursValid();
  }

  public loadData(branchService: BranchService, retryService: RetryService) {
    this.networkError = false;
    this.onShowHideRequest.emit(false);
    this.showLoader = true;
    this.showBranchList = true;
    // this.startLoading.emit(true);
    branchService.getBranches((branchList: Array<BranchEntity>, error: boolean, isFullList: boolean) => {
      if (error) {
        this.networkError = true;
        this.onShowHideRequest.emit(true);
        this.showLoader = false;
        this.retryService.retry(() => {
          this.branchService.getBranches((branchList: Array<BranchEntity>, error: boolean, isFullList: boolean) => {
            if (!error) {
              this.onBranchFetchSuccess(branchList, branchService, isFullList);
              this.retryService.abortRetry();
            }
          });
        });
      } else {
        this.onBranchFetchSuccess(branchList, branchService, isFullList);
      }
    });
  }

  private onBranchFetchSuccess(branchList, branchService, isFullList): void {
    this.networkError = false;
    this.onShowHideRequest.emit(false);
    if (isFullList == true) {
      this.sort.transform(branchList, "name");
    }
    this.branches = branchList;
    let branchListCntr = 0;
    if (branchList.length > 0) {
      this.showBranchList = true;
      if (branchList.length == 1) {
        MobileTicketAPI.setBranchSelection(branchList[0]);
        // if (!this.isRedirectedFromServices){
        this.router.navigate(['services']);
        // }
      }
    }
    else {
      this.showBranchList = false;
      this.showLoader = false;
    }
    // If there is distance in branch, then stort by distance
    if (this.branches[0]) {
      if (!this.branches[0].distance) {
        new Util().sortArrayCaseInsensitive(branchList, "name", "asc");
      } else {
        new Util().sortArrayCaseInsensitive(branchList, "rawDistance", "asc", 1000);
      }
      this.showLoader = false;
      this.startLoading.emit(false);
    }

  }

  public reloadData() {
    this.loadData(this.branchService, this.retryService);
  }

}
