import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Books } from "../_models/books";
import { Category } from "../_models/category";
import { BooksService } from "../_service/books.service";

@Component({
  selector: "app-books-list",
  templateUrl: "./books-list.component.html",
  styleUrls: ["./books-list.component.css"],
})
export class BooksListComponent implements OnInit {
  books: Books[] = [];
  categories: Map<number, Category> = new Map();

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnInit(): void {
    // Charger d'abord les catégories puis les livres
    this.loadCategories();
  }

  private loadCategories() {
    this.booksService.getCategories().subscribe(
      (categories: Category[]) => {
        // Stocker les catégories dans un Map pour un accès facile
        categories.forEach(cat => {
          this.categories.set(cat.id, cat);
        });
        // Une fois les catégories chargées, charger les livres
        this.getBooks();
      },
      error => {
        console.error('Erreur lors du chargement des catégories:', error);
        // Charger quand même les livres en cas d'erreur
        this.getBooks();
      }
    );
  }

  private getBooks() {
    this.booksService.getBooksList().subscribe((data: any) => {
      this.books = data.map((book: any) => {
        // Si la catégorie est au format IRI, extraire l'ID
        if (typeof book.categorie === 'string' && book.categorie.includes('/api/categories/')) {
          const categoryId = parseInt(book.categorie.split('/').pop() || '');
          if (!isNaN(categoryId)) {
            // Récupérer la catégorie correspondante depuis le Map
            const category = this.categories.get(categoryId);
            if (category) {
              book.categorieObj = category;
            }
          }
        }
        return book;
      });
    });
  }

  getCategoryDescription(book: any): string {
    if (book.categorieObj) {
      return book.categorieObj.description;
    }
    return 'Non catégorisé';
  }

  updateBook(bookId: number | undefined) {
    this.router.navigate(["update-book", bookId]);
  }

  deleteBook(bookId: number | undefined) {
    this.booksService.deleteBooks(bookId).subscribe((data) => {
      this.getBooks();
    });
  }

  bookDetails(bookId: number | undefined) {
    this.router.navigate(["book-details", bookId]);
  }
}