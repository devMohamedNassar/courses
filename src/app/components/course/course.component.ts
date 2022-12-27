import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/models/course.model';
import { CoursesService } from 'src/app/services/courses.service';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  @Input() course: Course;
  addedToCart = false;
  private subscription = new Subscription();

  constructor(private coursesService: CoursesService) { }

  ngOnInit(): void {
    this.addedToCart = this.coursesService.isAddedCourse(this.course.CourseId);
  }

  addToCart(){
    this.subscription.add(
      this.coursesService.addCourse(this.course).subscribe(() => this.addedToCart = true)
    );
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

}
