import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { UsersService } from "./_service/users.service";
import { BooksService } from "./_service/books.service";
import { AuthInterceptor } from "./_auth/auth.interceptor";
import { AuthGuard } from "./_auth/auth.guard";
import { LoginComponent } from "./login/login.component";
import { BooksListComponent } from "./books/books-list.component";
import { CreateBookComponent } from "./create-book/create-book.component";
import { UpdateBookComponent } from "./update-book/update-book.component";
import { UserListComponent } from "./users-list/users-list.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { CategoryFormComponent } from "./category-form/category-form.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { BorrowBookComponent } from "./borrow-book/borrow-book.component";
import { ReturnBookComponent } from "./return-book/return-book.component";
import { ReservationAdminComponent } from "./reservation-admin/reservation-admin.component";
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { BookCommentsComponent } from "./book-comments/book-comments.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BooksListComponent,
    CreateBookComponent,
    UpdateBookComponent,
    UserListComponent,
    UserFormComponent,
    CategoryFormComponent,
    CategoryListComponent,
    BorrowBookComponent,
    ReturnBookComponent,
    ReservationAdminComponent,
    CommentDialogComponent,
    BookCommentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    UsersService,
    BooksService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
