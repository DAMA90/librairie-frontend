import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { BooksListComponent } from "./books/books-list.component";
import { CreateBookComponent } from "./create-book/create-book.component";
import { UpdateBookComponent } from "./update-book/update-book.component";
import { UserListComponent } from "./users-list/users-list.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { CategoryFormComponent } from "./category-form/category-form.component";
import { BorrowBookComponent } from "./borrow-book/borrow-book.component";
import { ReturnBookComponent } from "./return-book/return-book.component";
import { ReservationAdminComponent } from "./reservation-admin/reservation-admin.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "books", component: BooksListComponent },
  { path: "create-book", component: CreateBookComponent },
  { path: "update-book/:id", component: UpdateBookComponent },
  { path: "users", component: UserListComponent },
  { path: "create-user", component: UserFormComponent },
  { path: "update-user/:id", component: UserFormComponent },
  { path: "categories", component: CategoryListComponent },
  { path: "create-category", component: CategoryFormComponent },
  { path: "update-category/:id", component: CategoryFormComponent },
  {
    path: "borrow-book",
    component: BorrowBookComponent,
  },
  {
    path: "return-book",
    component: ReturnBookComponent,
  },
  {
    path: 'admin/reservations',
    component: ReservationAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
