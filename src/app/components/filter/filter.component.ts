import { Component, OnInit } from '@angular/core';
import { Filter, FilterConfig, FilterOperator } from 'src/app/models/filter.model';
import { FilterService } from 'src/app/services/filter.service';

interface FilterItem {
  text: string,
  filter: Filter
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  currentFilter: Filter[] = [];

  filterByDuration: FilterItem[] = [
    {
      text: "Less than 2 hours", filter: [new FilterConfig('CourseDuration', 2, FilterOperator.lessThan)]
    },
    {
      text: "From 2 to 10 hours", filter: [
        new FilterConfig('CourseDuration', 2, FilterOperator.greaterThanOrEqual),
        new FilterConfig("CourseDuration", 10, FilterOperator.lessThanOrEqual)
      ]
    },
    {
      text: "more than 10 hours", filter: [new FilterConfig('CourseDuration', 10, FilterOperator.greaterThan)]
    }
  ];

  filterByCat: FilterItem[] = [
    {
      text: "Development",
      filter: [new FilterConfig('CourseCategory', 'Development', FilterOperator.equal)]
    },
    {
      text: "Finance & Accounting",
      filter: [new FilterConfig('CourseCategory', 'Finance & Accounting', FilterOperator.equal)]
    },
    {
      text: "IT & Software",
      filter: [new FilterConfig('CourseCategory', 'IT & Software', FilterOperator.equal)]
    },
    {
      text: "Others",
      filter: [new FilterConfig('CourseCategory', 'Others', FilterOperator.equal)]
    }
  ];

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
  }

  updateFilter(isChecked: boolean, filterItem: FilterItem){
    if(isChecked) this.currentFilter.push(filterItem.filter);
    else this.currentFilter = this.currentFilter.filter(item => item !== filterItem.filter);
    this.filterService.filter$.next(this.currentFilter);
  }

}
