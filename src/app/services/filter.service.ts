import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { Filter, FilterConfig, FilterOperator } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filter$ = new BehaviorSubject<Filter[]>([]);

  constructor() { 

  }

  getFilteredCourses(courses$: Observable<Course[]>): Observable<Course[]>{
    return combineLatest([courses$, this.filter$]).pipe(
      map(([courses, filter]) => this.getFilteredData(courses, filter))
    )
  }

  private getFilteredData(courses: Course[], filter: Filter[]): Course[]{
    if(!filter.length) return courses;
    const result: Course[] = [];
    filter.forEach(item => {
      let filteredData: Course[] = [];
      item.forEach((config, index) => {
        filteredData = this.applyFilter(config, index == 0 ? courses : filteredData);
      });
      result.push(...filteredData);
    })
    return this.removeRepeatedItems(result);
  }

  private removeRepeatedItems(courses: Course[]): Course[]{
    const count = {};
    return courses.filter((item) => {
      count[item.CourseId] = count[item.CourseId] == undefined ? 1 : count[item.CourseId] + 1;
      if(count[item.CourseId] == 1) return true;
      else return false; 
    })
  }

  private applyFilter(filterConfig: FilterConfig, courses: Course[]): Course[]{
    
    return courses.filter(course => {
      switch(filterConfig.operator){
        case FilterOperator.equal:
          if(course[filterConfig.filterBy] != filterConfig.filterValue) return false;
          break;
        case FilterOperator.greaterThan:
          if(!(course[filterConfig.filterBy] > filterConfig.filterValue)) return false;
          break;
        case FilterOperator.greaterThanOrEqual:
          if(!(course[filterConfig.filterBy] >= filterConfig.filterValue)) return false;
          break;
        case FilterOperator.lessThan: 
          if(!(course[filterConfig.filterBy] < filterConfig.filterValue)) return false;  
          break;
       case FilterOperator.lessThanOrEqual:
        if(!(course[filterConfig.filterBy] <= filterConfig.filterValue)) return false;
        break; 
      }
      return true;
    })
  }

}
