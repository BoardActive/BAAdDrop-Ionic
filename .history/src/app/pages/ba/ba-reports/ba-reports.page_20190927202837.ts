import { Component, OnInit } from '@angular/core';
import { barChartSingle, pieChart, multiData, single } from '../../../services/chart/ngx-chart';
import * as graphoptions from '../../../services/chart/config';

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
