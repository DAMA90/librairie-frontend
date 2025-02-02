import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Books } from '../_models/books';
import { Category } from '../_models/category';
import { BooksService } from '../_service/books.service';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {

  book: Books = new Books();
  categories: Category[] = [];

  constructor(
    private booksService: BooksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.booksService.getCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    );
  }

  saveBook() {
    this.booksService.createBooks(this.book).subscribe(
      data => {
        this.goToBooksList();
      },
      error => console.log(error)
    );
  }

  goToBooksList() {
    this.router.navigate(['/books']);
  }

  onSubmit() {
    this.saveBook();
  }
}