import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { catchError, combineLatest, EMPTY, map, startWith, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/DeclarativeCategory.service';
import { DeclarativePostService } from 'src/app/services/DeclarativePost.service';
import { NotificationService } from 'src/app/services/Notification.service';
@@ -39,6 +39,10 @@ export class PostFormComponent implements OnInit {
          description: post?.description,
          categoryId: post?.categoryId,
        });
    }),
    catchError((error) => {
      this.notificationService.setErrorMessage(error);
      return EMPTY;
    })
  );
