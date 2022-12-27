import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { concatMap, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';
@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  studentId: number = 1234;
  myCourses$: Observable<Course[]>;
  @ViewChild('myCoursesList') myCoursesListRef: ElementRef<HTMLElement>;

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.myCourses$ = this.coursesService.getStudentCourses(this.studentId)
    .pipe(
      concatMap(data => {
        return combineLatest(data.map(item => this.coursesService.getSingleCourse(item.CourseId)))
      }),
      tap(() => {
        if(this.myCoursesListRef?.nativeElement){
          setTimeout(() => {
            const elem = this.myCoursesListRef.nativeElement;
            elem.scrollTop= elem.getBoundingClientRect().height;
          })
        }
      })
    );
  }

}
