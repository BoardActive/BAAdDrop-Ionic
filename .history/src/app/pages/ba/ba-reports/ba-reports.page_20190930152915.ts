import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import * as chartData from '../../../services/chart/google-chart';
// import { 
//   pieChart1, 
//   pieChart2, 
//   pieChart3, 
//   pieChart4, 
//   areaChart1, 
//   areaChart2, 
//   columnChart1, 
//   columnChart2, 
//   barChart1, 
//   barChart2, 
//   lineChart, 
//   comboChart 
// } from '../../../services/chart/google-chart';
import { UtilService } from '../../../services/util/util.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { BAService } from '../.././../services/ba/ba.service';
import { MeDto } from 'src/app/models/me.model';

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {
  public me: MeDto;
  public dateTrialExpires: string;
  public appName: string;
  public appId: number;
  public appSubscription: string;
  public plan: string;  
  public users_quota: number = 5;
  public users_used: number;
  public places_quota: number = 0;
  public places_used: number;
  public messages_quota: number = 0 ;
  public messages_used: number;
  
  // public columnChart1: GoogleChartInterface;
  // public columnChart2: GoogleChartInterface;
  // public barChart: GoogleChartInterface;

    // Pie Chart
    public pieChartUsers;
    public pieChartPlaces;
    public pieChartMessages;
    public pieChart4 = chartData.pieChart4;
    // Area Chart
    public areaChart1 = chartData.areaChart1;
    public areaChart2 = chartData.areaChart2;
    // Column Chart
    public columnChartPlaces = chartData.columnChartPlaces;
    public columnChartMessages = chartData.columnChartMessages;
    public columnChartUsers = chartData.columnChartUsers;
    public columnChart3 = chartData.columnChart3;
    // Bar Chart
    public barChart1 = chartData.barChart1;
    public barChart2 = chartData.barChart2;
    // Line Chart
    public lineChart = chartData.lineChart;

    // Guage Chart
    public guageChart = chartData.guageChart;

    // Combo Chart
    public comboChart = chartData.comboChart;

    public geoChartData = {
      chartType: 'GeoChart',
      dataTable: [
        ['Country', 'Popularity'],
        ['Germany', 200],
        ['United States', 300],
        ['Brazil', 400],
        ['Canada', 500],
        ['France', 600],
        ['RU', 700]
      ],
      options: {
        'region': 'IT',
        'displayMode': 'markers',
        colors: ["#4466f2", "#1ea6ec", "#22af47", "#007bff", "#FF5370"]
      }
    };

  constructor(
    private menuCtrl: MenuController,
    private localStorageService: LocalStorageService,
    private utilService: UtilService,
    private baService: BAService
  ) { 
    this.users_used = 1;
    this.users_quota = 5;
    this.places_used = 8;
    this.places_quota = 20;
    this.messages_used = 325;
    this.messages_quota = 1000;
  }

  ngOnInit() {
    this.baService.getMe().subscribe(response => {
      // console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.localStorageService.getItem('me').subscribe(meData => {
      this.me = meData;
    });

    this.localStorageService.getItem('appId').subscribe(appId => {
      this.appId = appId;
      this.baService.getApp(this.appId).subscribe(appData => {    
        this.appName = appData.name;
        if (appData.dateTrialExpires) {
          this.dateTrialExpires = appData.dateTrialExpires;
          this.appSubscription = 'Trial';
          this.users_quota = 5;
          this.places_quota = 20;
          this.messages_quota = 1000;
        } 

        if (appData.subscription) {
          this.dateTrialExpires = null;
          this.appSubscription = appData.subscription.billingPlan.name;
          this.users_quota = 5;
          console.log(`users_quota: ${this.users_quota}`)
          this.places_quota = appData.subscription.quotas.numberOfPlaces;
          console.log(`places_quota: ${this.places_quota}`)
          this.messages_quota = appData.subscription.quotas.liveMessages;
          console.log(`messages_quota: ${this.messages_quota}`)
        }

        console.log(`[BA APP SUBSCRIPTION]: ${JSON.stringify(appData.subscription, null, 2)}`);
      });
    });

    this.baService.getMe().subscribe(response => {
      // console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.baService.getBilling().subscribe(response => {
      // console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.baService.getPlaces().subscribe(response => {
      // console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.baService.getMessages().subscribe(response => {
      // console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.buildPieCharts();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }


  signOut() {
    this.localStorageService.removeItem('auth');
    this.localStorageService.removeItem('apps');
    this.localStorageService.removeItem('appId');
    this.utilService.navigate('/login', false);
  }

  switchApp() {
    this.utilService.navigate('/ba-apps', false);
  }

  buildPieCharts() {
    this.pieChartUsers = {
      chartType: 'PieChart',
      dataTable: [
        ['Users', 'Plan'],
        ['Used', this.users_used],
        ['Available', this.users_quota - this.users_used]
      ],
      options: {
        width: '100%',
        height: 400,
        colors: ['#4466f2', '#1ea6ec', '#22af47', '#007bff', '#FF5370'],
        backgroundColor: 'transparent',
        legend: 'none'
      }
    };

    this.pieChartPlaces = {
      chartType: 'PieChart',
      dataTable: [
        ['Users', 'Plan'],
        ['Used', this.places_used],
        ['Available', this.places_quota - this.places_used]
      ],
      options: {
        width: '100%',
        height: 400,
        colors: ['#4466f2', '#1ea6ec', '#22af47', '#007bff', '#FF5370'],
        backgroundColor: 'transparent',
        legend: 'none'
      }
    };

    this.pieChartMessages = {
      chartType: 'PieChart',
      dataTable: [
        ['Users', 'Plan'],
        ['Used', this.messages_used],
        ['Available', this.messages_quota - this.messages_used]
      ],
      options: {
        width: '100%',
        height: 400,
        colors: ['#4466f2', '#1ea6ec', '#22af47', '#007bff', '#FF5370'],
        backgroundColor: 'transparent',
        legend: 'none'
      }
    };

  }

}
