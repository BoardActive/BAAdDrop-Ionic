import { Component, OnInit } from '@angular/core';
import { barChartSingle, pieChart, multiData, single } from '../../../services/chart/ngx-chart';
import * as graphoptions from '../../../services/chart/config';

@Component({
  selector: 'app-ba-reports',
  templateUrl: './ba-reports.page.html',
  styleUrls: ['./ba-reports.page.scss'],
})
export class BaReportsPage implements OnInit {
  public barChartsingle: any;
  public multiData: any;
  public pieChart = pieChart;
  public single = single

  constructor() { 

    Object.assign(this, { multiData, barChartSingle, pieChart, single });

    this.barChartsingle = [];    

  }

  ngOnInit() {
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
  
    public onSelect(e) {  }

}
