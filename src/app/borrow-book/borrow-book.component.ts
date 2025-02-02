import { Component, OnInit } from '@angular/core';
import { Books } from '../_models/books';
import { Category } from '../_models/category';
import { BooksService } from '../_service/books.service';
import { UserAuthService } from '../_service/user-auth.service';

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book.component.html',
  styleUrls: ['./borrow-book.component.css']
})
export class BorrowBookComponent implements OnInit {
  books: Books[] = [];
  categories: Map<number, Category> = new Map();
  userReservations: any[] = [];
  loadingBooks = true;
  loadingReservations = true;

  constructor(
    private booksService: BooksService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadUserReservations();
  }

  private loadCategories() {
    this.booksService.getCategories().subscribe(
      (categories: Category[]) => {
        categories.forEach(cat => {
          this.categories.set(cat.id, cat);
        });
        this.loadBooks();
      },
      error => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.loadBooks();
      }
    );
  }

  private loadBooks() {
    this.loadingBooks = true;
    this.booksService.getBooksList().subscribe(
      (books: Books[]) => {
        this.books = books.map(book => {
          if (typeof book.categorie === 'string' && book.categorie.includes('/api/categories/')) {
            const categoryId = parseInt(book.categorie.split('/').pop() || '');
            if (!isNaN(categoryId)) {
              const category = this.categories.get(categoryId);
              if (category) {
                book.categorie = category.description;
              }
            }
          }
          return book;
        });
        this.loadingBooks = false;
      },
      error => {
        console.error('Erreur lors du chargement des livres:', error);
        this.loadingBooks = false;
      }
    );
  }

  private loadUserReservations() {
    this.loadingReservations = true;
    const userId = this.userAuthService.getUserId();
    this.booksService.getUserReservations(userId).subscribe(
      reservations => {
        this.userReservations = reservations;
        this.loadingReservations = false;
      },
      error => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.loadingReservations = false;
      }
    );
  }

  isBookAvailable(bookId: number ): boolean {
    // Vérifie si le livre n'est pas déjà réservé par l'utilisateur
    const existingReservation = this.userReservations.find(
      res => res.livre === `/api/livres/${bookId}` && 
      (res.statut === 'En attente' || res.statut === 'Acceptée')
    );
    return !existingReservation;
  }

  reserveBook(bookId: number) {
    const userId = this.userAuthService.getUserId();
    this.booksService.createReservation(bookId, userId).subscribe(
      response => {
        this.loadUserReservations();
        alert('Livre réservé avec succès! Vous pouvez maintenant l\'emprunter.');
      },
      error => {
        console.error('Erreur lors de la réservation:', error);
        alert('Erreur lors de la réservation du livre');
      }
    );
  }

  borrowBook(reservationId: number) {
    this.booksService.createEmprunt(reservationId).subscribe(
      response => {
        this.loadUserReservations();
        alert('Livre emprunté avec succès!');
      },
      error => {
        console.error('Erreur lors de l\'emprunt:', error);
        alert('Erreur lors de l\'emprunt du livre');
      }
    );
  }

  getCategoryDescription(book: any): string {
    if (book.categorie) {
        return book.categorie;
      }
    return 'Non catégorisé';
  }

  getReservationForBook(bookId: number) {
    return this.userReservations.find(
      res => res.livre === `/api/livres/${bookId}` && 
      (res.statut === 'En attente' || res.statut === 'Acceptée')
    );
  }
}