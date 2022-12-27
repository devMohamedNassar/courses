import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { CoursesService } from 'src/app/services/courses.service';
import { Observable } from "rxjs";
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService, private filterService: FilterService) { }

  ngOnInit(): void {
    this.courses$ = this.filterService.getFilteredCourses(this.coursesService.getCourses());
  }
}
