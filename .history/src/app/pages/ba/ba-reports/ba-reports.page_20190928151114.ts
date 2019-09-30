import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {
  // public columnChart1: GoogleChartInterface;
  // public columnChart2: GoogleChartInterface;
  public barChart: GoogleChartInterface;

    // Pie Chart
    public pieChart1 = chartData.pieChart1;
    public pieChart2 = chartData.pieChart2;
    public pieChart3 = chartData.pieChart3;
    public pieChart4 = chartData.pieChart4;
    // Area Chart
    public areaChart1 = chartData.areaChart1;
    public areaChart2 = chartData.areaChart2;
    // Column Chart
    public columnChart1 = chartData.columnChart1;
    public columnChart2 = chartData.columnChart2;
    // Bar Chart
    public barChart1 = chartData.barChart1;
    public barChart2 = chartData.barChart2;
    // Line Chart
    public lineChart = chartData.lineChart;
    // Combo Chart
    public comboChart = chartData.comboChart;
    public geoChartData = {
      chartType: 'GeoChart',
      dataTable: [
        ['City', 'Population'],
        ['Melbourne', 456789]
      ],
      options: {
        'region': 'IT',
        'displayMode': 'markers',
        colors: ["#4466f2", "#1ea6ec", "#22af47", "#007bff", "#FF5370"]
      }
    };

  constructor() { 


  }

  ngOnInit() {
    this.loadColumnChart();

  }

  loadColumnChart() {
    this.columnChart1 = {
      chartType: 'ColumnChart',
      dataTable: [
        ['City', '2010 Population'],
        ['New York City, NY', 8175000],
        ['Los Angeles, CA', 3792000],
        ['Chicago, IL', 2695000],
        ['Houston, TX', 2099000],
        ['Philadelphia, PA', 1526000]
      ],
      //opt_firstRowIsData: true,
      options: {
        title: 'Population of Largest U.S. Cities',
        height: 600,
        chartArea: { height: '400' },
        hAxis: {
          title: 'Total Population',
          minValue: 0
        },
        vAxis: {
          title: 'City'
        }
      },
    };
  }

}
