import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Books } from '../_models/books';
import { Category } from '../_models/category';
import { BooksService } from '../_service/books.service';

@Component({
  selector: 'app-update-book',
  templateUrl: './update-book.component.html',
  styleUrls: ['./update-book.component.css']
})
export class UpdateBookComponent implements OnInit {

  id!: number;
  book: Books = new Books();
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private booksService: BooksService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    
    // Charger d'abord les catégories
    this.loadCategories();

    // Puis charger le livre
    this.booksService.getBooksById(this.id).subscribe(
      data => {
        this.book = data;
        // Extraire l'ID de la catégorie de l'IRI
        if (typeof this.book.categorie === 'string' && this.book.categorie.includes('/api/categories/')) {
          const categoryId = parseInt(this.book.categorie.split('/').pop() || '');
          if (!isNaN(categoryId)) {
            this.selectedCategoryId = categoryId;
          }
        }
      },
      error => console.log(error)
    );
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

  onSubmit() {
    // S'assurer que la catégorie est au bon format avant l'envoi
    if (this.selectedCategoryId) {
      this.book.categorie = `/api/categories/${this.selectedCategoryId}`;
    }
    
    this.booksService.updateBooks(this.id, this.book).subscribe(
      data => {
        this.goToBooksList();
      },
      error => console.log(error)
    );
  }

  goToBooksList() {
    this.router.navigate(['/books']);
  }
}