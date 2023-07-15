import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  combineLatest,
  forkJoin,
  Observable,
  Subject,
  catchError,
  throwError,
  shareReplay,
  share,
  delay,
  scan,
  tap,
  BehaviorSubject,
  merge,
  concatMap,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { CRUDAction, IPost } from '../models/IPost';
import { DeclarativeCategoryService } from './DeclarativeCategory.service';
import { NotificationService } from './Notification.service';
@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http
    .get<{ [id: string]: IPost }>(
      `https://rxjs-posts-default-rtdb.firebaseio.com/posts.json`
    )
    .pipe(
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      catchError(this.handleError),
      shareReplay(1)
    );
  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    }),
    shareReplay(1),
    catchError(this.handleError)
  );
  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();
  private postCRUDCompleteSubject = new Subject<boolean>();
  postCRUDCompleteAction$ = this.postCRUDCompleteSubject.asObservable();
  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPosts(posts, value);
    }, [] as IPost[]),
    shareReplay(1)
    shareReplay(1),
    catchError(this.handleError)
  );

  modifyPosts(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
@@ -109,10 +110,10 @@ export class DeclarativePostService {
    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data).pipe(
        tap((post) => {

          this.notificationService.setSuccessMessage('Post Added Successfully');
          this.postCRUDCompleteSubject.next(true);
        })
        }),
        catchError(this.handleError)
      );
    }

@@ -123,7 +124,8 @@ export class DeclarativePostService {
            'Post Updated Successfully'
          );
          this.postCRUDCompleteSubject.next(true);
        })
        }),
        catchError(this.handleError)
      );
    }

@@ -135,7 +137,8 @@ export class DeclarativePostService {
          );
          this.postCRUDCompleteSubject.next(true);
        }),
        map((post) => postAction.data)
        map((post) => postAction.data),
        catchError(this.handleError)
      );
    }