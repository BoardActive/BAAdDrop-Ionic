import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {
  public columnChart1: GoogleChartInterface;
  public columnChart2: GoogleChartInterface;
  public barChart: GoogleChartInterface;

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
