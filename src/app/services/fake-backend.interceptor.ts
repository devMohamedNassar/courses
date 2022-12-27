import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paths } from './courses.service';
import { Course } from '../models/course.model';

interface CourseRequest {
  Members: number,
  CourseId: number
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  private addedToCartCourses$ = new BehaviorSubject<CourseRequest[]>([]);

  constructor(private http: HttpClient) {}

  private getAllCourses(){
      return this.http.get('assets/data/courses.json')
      .pipe(map(data => new HttpResponse({body: data})))    
  }
  private getSingleCourse(courseId: number){
    return this.http.get<any[]>('assets/data/courses.json')
    .pipe(map(data => {
      return new HttpResponse({body: data.find(item => item.CourseId == courseId)});
    })) 
    
  }
  private getStudentCourses(studentId: number){
      return combineLatest([
        this.http.get<any[]>('assets/data/requests.json'),
        this.addedToCartCourses$
      ])
      .pipe(map(([requests, addedCourses]) => {
        const requestedCourses: CourseRequest[] = requests.find(item => item.StudentId === studentId)?.Courses;
        return new HttpResponse({body: [...requestedCourses, ...addedCourses]})
      }))    
  }
  private addCourseToCart(course: Course){
    const addedCourse = {CourseId: course.CourseId, Members: null};
    this.addedToCartCourses$.next([...this.addedToCartCourses$.value, addedCourse]);
    return of(new HttpResponse({body: true}));
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.endsWith(Paths.allCourses)) return this.getAllCourses();
    else if(request.url.includes(Paths.studentCourses)) return this.getStudentCourses(this.getIdFromUrl(request.url));
    else if(request.url.includes(Paths.singleCourse)) return this.getSingleCourse(this.getIdFromUrl(request.url));
    else if(request.url.includes(Paths.addCourse)) return this.addCourseToCart(request.body as Course);
    return next.handle(request);
  }

  private getIdFromUrl(url: string): number {
    const arr = url.split('/');
    return +arr[arr.length - 1];
  }
}
