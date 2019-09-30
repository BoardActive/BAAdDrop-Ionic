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

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {
  public plan: string;  
  public users: number;
  public users_used: number;
  public users_avail: number;
  public places: number;
  public places_used: number;
  public places_avail: number;
  public messages: number;
  public messages_used: number;
  public messages_avail: number;
  
  // public columnChart1: GoogleChartInterface;
  // public columnChart2: GoogleChartInterface;
  // public barChart: GoogleChartInterface;

    // Pie Chart
    public pieChartUsers;
    public pieChartPlaces = chartData.pieChartPlaces;
    public pieChartMessages = chartData.pieChartMessages;
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
    this.plan = 'Day-Hike Plan';
    this.users_used = 1; // 5 User Seats
    this.users_avail = 5; // 5 User Seats
    this.users = this.users_used / this.users_avail; // 5 User Seats
    this.places_used = 8; // 1,000 Messages
    this.places_avail = 20; // 1,000 Messages
    this.places = this.places_used / this.places_avail; // 1,000 Messages
    this.messages_used = 325; // 20 Places
    this.messages_avail = 1000; // 20 Places
    this.messages = this.messages_used / this.messages_avail; // 20 Places

  }

  ngOnInit() {
    this.baService.getMe().subscribe(response => {
      console.log(`${JSON.stringify(response, null, 2)}`);
    });
    this.baService.getBilling().subscribe(response => {
      console.log(`${JSON.stringify(response, null, 2)}`);
    });

    this.buildPieChartUsers();
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

  buildPieChartUsers() {
    this.pieChartUsers = {
      chartType: 'PieChart',
      dataTable: [
        ['Users', 'Plan'],
        ['Used', this.users_used],
        ['Available', this.users_avail - this.users_used]
      ],
      options: {
        width: '100%',
        height: 400,
        colors: ["#4466f2", "#1ea6ec", "#22af47", "#007bff", "#FF5370"],
        backgroundColor: 'transparent',
        legend: 'none'
      }
    };

  }

}
