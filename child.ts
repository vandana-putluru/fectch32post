showLoader$ = this.loaderService.loadingAction$;
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 503);
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessages();
        }, 506);
      }
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(
    tap((message) => {
      if (message) {
      setTimeout(() => {
        this.notificationService.clearAllMessages();
      }, 503);
    }
    })
  );