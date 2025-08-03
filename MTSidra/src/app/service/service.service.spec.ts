/* tslint:disable:no-unused-variable */
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { ServiceService } from './service.service';
import { ServiceEntity } from '../entities/service.entity';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('ServiceService', () => {
  let injector: Injector;
  let backend: any;
  let translate: TranslateService;
  let connection: MockConnection;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule,TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
            deps: [Http]
        })],
      declarations: [
        
      ],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
         { provide: TranslateService}
        
      ]
    })
      .compileComponents();
      injector = getTestBed();
      backend = injector.get(XHRBackend);
      translate = injector.get(TranslateService);
      // sets the connection when someone tries to access the backend with an xhr request
      backend.connections.subscribe((c: MockConnection) => connection = c);
      translate.use('en');
  }));

  let serviceListService

  beforeEach(() => {
    serviceListService = new ServiceService(null, translate, null);
  });

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
    });


 it('Should return a list of ServiceEntities', async(() => {
    let serviceList = [
      {
        "waitingTimeInDefaultQueue":0,
        "customersWaitingInDefaultQueue": 0,
        "serviceId": 2,
        "serviceName": "Service 2"        
      },
      {
        "waitingTimeInDefaultQueue":0,
        "customersWaitingInDefaultQueue": 0,
        "serviceId": 1,
        "serviceName": "Service 1"
      }
    ];
    
    let serviceEntities = serviceListService.convertToServiceEntities(serviceList);
    expect(serviceEntities.length).toBeGreaterThan(1);
  }));

});

