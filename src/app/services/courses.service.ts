import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum Paths {
  allCourses = "all-courses",
  singleCourse = "single-course",
  studentCourses = "student-courses",
  addCourse = "add-course",
  editCourseSeats = "edit-course-seats"
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private addedCourses: number[] = [];
  private baseUrl = "";

  constructor(private httpClient: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.getUrl(Paths.allCourses));
  }
  getSingleCourse(courseId: number): Observable<Course> {
    return this.httpClient.get<Course>(this.getUrl(Paths.singleCourse, courseId));
  }
  getStudentCourses(studentId: number): Observable<{CourseId: number, Members: number}[]>{
    return this.httpClient.get<any[]>(this.getUrl(Paths.studentCourses, studentId));
  }
  addCourse(course: Course): Observable<any> {
    return this.httpClient.post(this.getUrl(Paths.addCourse), course).pipe(
      tap(() => this.addedCourses.push(course.CourseId))
    );
  }
  editCourseSeats(courseId, availableSeats): Observable<any>{
    return this.httpClient.put(this.getUrl(this.getUrl(Paths.editCourseSeats, courseId)), {AvailableSeats: availableSeats});
  }

  isAddedCourse(courseId: number): boolean{
    return this.addedCourses.includes(courseId);
  }

  private getUrl(path: string, extra: number = null): string {
    return `${this.baseUrl}/${path}${extra != null ? "/" + extra : ""}`;
  }
}
