import { Component, OnInit } from '@angular/core';
import { barChartSingle, pieChart, multiData, single } from '../../../services/chart/ngx-chart';
import * as graphoptions from '../../../services/chart/config';

@Component({
  selector: 'app-ba-report-ngx',
  templateUrl: './ba-report-ngx.page.html',
  styleUrls: ['./ba-report-ngx.page.scss'],
})
export class BaReportNgxPage implements OnInit {
  public barChartsingle = barChartSingle;
  public pieChart = pieChart;
  public multiData = multiData;
  public single = single

  constructor() { }

  ngOnInit() {
    Object.assign(this, { multiData, barChartSingle, pieChart, single })
  }

  // Bar-chart options
  public barChartShowYAxis = graphoptions.barChartShowYAxis;
  public barChartShowXAxis = graphoptions.barChartShowXAxis;
  public barChartGradient = graphoptions.barChartGradient;
  public barChartShowLegend = graphoptions.barChartShowLegend;
  public barChartShowXAxisLabel = graphoptions.barChartShowXAxisLabel;
  public barChartXAxisLabel = graphoptions.barChartXAxisLabel;
  public barChartShowYAxisLabel = graphoptions.barChartShowYAxisLabel;
  public barChartYAxisLabel = graphoptions.barChartYAxisLabel;
  public barChartColorScheme = graphoptions.barChartColorScheme;
  public barChartshowGridLines = graphoptions.barChartshowGridLines;

  // pie-chart options
  public pieChartColorScheme = graphoptions.pieChartcolorScheme;
  public pieChartShowLabels = graphoptions.pieChartShowLabels;
  public pieChartGradient = graphoptions.pieChartGradient;
  public chartOptions = graphoptions.chartOptions;

  //Area-chart options
  public areaChartshowXAxis = graphoptions.areaChartshowXAxis;
  public areaChartshowYAxis = graphoptions.areaChartshowYAxis;
  public areaChartgradient = graphoptions.areaChartgradient;
  public areaChartshowXAxisLabel = graphoptions.areaChartshowXAxisLabel;
  public areaChartxAxisLabel = graphoptions.areaChartxAxisLabel
  public areaChartshowYAxisLabel = graphoptions.areaChartshowYAxisLabel;
  public areaChartcolorScheme = graphoptions.areaChartcolorScheme;
  public lineChartcurve = graphoptions.lineChartcurve;
  public lineChartcurve1 = graphoptions.lineChartcurve1

  public onSelect(e) { }

}
