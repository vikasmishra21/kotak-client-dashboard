import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface IPageData {
  name: string,
  urlPath?: string,
  children?: IPageData[],
  variable?: string,
  icon?: string,
  borderTop?: string
}

const PAGE_DATA: IPageData[] = [
  { name: 'NPS OVERVIEW', urlPath: '/dashboard/npsoverview', icon: 'fa-tachometer-alt', borderTop: 'border-bottom' },
  { name: 'DRIVERS', urlPath: '/dashboard/overall-drivers', icon: 'fa-cog', borderTop: 'border-bottom' },
  {
    name: 'FUNCTIONAL DRIVERS',
    children: [
      { name: 'Installation', urlPath: '/dashboard/drivers/installation', variable: 'v22', icon: 'fa-cog' },
      { name: 'Explanation', urlPath: '/dashboard/drivers/explanation', icon: 'fa-info-circle' },
      { name: 'Resolution', urlPath: '/dashboard/drivers/resolution', icon: 'fa-user-cog' },
      { name: 'Ease of Documentation', urlPath: '/dashboard/drivers/easeofdocumentation', icon: 'fa-file-alt' },
      { name: 'Pricing and Charges', urlPath: '/dashboard/drivers/pricingandcharges', icon: 'fa-dollar-sign' },
      { name: 'Response at Call Center', urlPath: '/dashboard/drivers/callcenterresponse', icon: 'fa-reply-all' }
    ]
  },
  { name: 'QUERY RESOLUTION', urlPath: '/dashboard/queryResolution', icon: 'fa-question-circle', borderTop: 'border-bottom' },
  {
    name: 'FUNCTIONAL QUERY',
    children: [
      { name: 'Installation', urlPath: '/dashboard/query-resolution/installation', icon: 'fa-cogs' },
      { name: 'Documentation', urlPath: '/dashboard/query-resolution/documentation', icon: 'fa-file' },
      { name: 'Servicing', urlPath: '/dashboard/query-resolution/servicing', icon: 'fa-cog' }
    ]
  },
  { name: 'DETRACTORS', urlPath: '/dashboard/hot-alerts', icon: 'fa-fire', borderTop: 'border-bottom' },
  { name: 'COMMENTS', urlPath: '/dashboard/comments', icon: 'fa-comment-dots', borderTop: 'border-bottom' },
  { name: 'RESPONSE RATE', urlPath: '/dashboard/response-rate', icon: 'fa-reply', borderTop: 'border-bottom' }

];

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.sass']
})
export class PageListComponent implements OnInit, AfterViewInit {
  public treeControl = new NestedTreeControl<IPageData>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<IPageData>();
  public currentUrl: string;

  @Output() menuItemClick = new EventEmitter<void>();

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.dataSource.data = PAGE_DATA;
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
  }

  ngAfterViewInit() {
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.expandAll();
  }

  public hasChild(_: number, node: IPageData) {
    return !!node.children && node.children.length > 0;
  }

  public navigate(url, variable): void {
    this.currentUrl = url;
    this.menuItemClick.emit();
    this.router.navigate([url], { state: { variable } });
  }

  public logNode(node) {

  }

}
