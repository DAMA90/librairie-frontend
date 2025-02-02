// book-comments.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { BooksService } from '../_service/books.service';
import { UserAuthService } from '../_service/user-auth.service';

@Component({
  selector: 'app-book-comments',
  template: `
    <div class="comments-section p-4">
      <h3 class="mb-4">Commentaires</h3>
      
      <!-- Formulaire d'ajout de commentaire -->
      <div class="comment-form mb-4" *ngIf="isLoggedIn">
        <div class="input-group">
          <textarea 
            class="form-control" 
            [(ngModel)]="newCommentText" 
            placeholder="Ajouter un commentaire..."
            rows="2"
          ></textarea>
          <button 
            class="btn btn-primary" 
            (click)="addComment()"
            [disabled]="!newCommentText.trim()"
          >
            Publier
          </button>
        </div>
      </div>

      <!-- Liste des commentaires -->
      <div class="comments-list">
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <div *ngIf="!loading && comments.length === 0" class="alert alert-info">
          Aucun commentaire pour le moment.
        </div>

        <div *ngFor="let comment of comments" class="comment-item mb-3 p-3 border rounded">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong>{{ comment.utilisateur.nom }}</strong>
              <small class="text-muted ms-2">
                {{ comment.date | date:'dd/MM/yyyy HH:mm' }}
              </small>
            </div>
            <button 
              *ngIf="canDeleteComment(comment)"
              class="btn btn-danger btn-sm"
              (click)="deleteComment(comment.id)"
            >
              Supprimer
            </button>
          </div>
          <p class="mt-2 mb-0">{{ comment.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comment-item:hover {
      background-color: #f8f9fa;
    }
    .comment-form textarea {
      resize: none;
    }
  `]
})
export class BookCommentsComponent implements OnInit {
  @Input() bookId!: number;
  comments: any[] = [];
  newCommentText: string = '';
  loading: boolean = true;
  isLoggedIn: boolean = false;
  currentUserId: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private booksService: BooksService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.checkUserAuth();
    this.loadComments();
  }

  private checkUserAuth() {
    this.isLoggedIn = this.userAuthService.isLoggedIn().toString() === "true";
    if (this.isLoggedIn) {
      this.currentUserId = this.userAuthService.getUserId();
      const roles: string[] = this.userAuthService.getRoles();
      this.isAdmin = roles.includes("ROLE_ADMIN");
    }
  }

  loadComments() {
    this.loading = true;
    this.booksService.getCommentsByBookId(this.bookId).subscribe(
      comments => {
        comments.forEach(commentObs => {
          commentObs.subscribe((comment: any) => {
            this.comments.push(comment);
          });
        });
        this.loading = false;
      },
      error => {
        console.error('Erreur lors du chargement des commentaires:', error);
        this.loading = false;
      }
    );
  }

  addComment() {
    if (!this.newCommentText.trim() || !this.currentUserId) return;

    const commentData = {
      description: this.newCommentText.trim(),
      utilisateurId: this.currentUserId,
      livreId: this.bookId
    };

    this.booksService.createComment(commentData).subscribe(
      () => {
        this.newCommentText = '';
        this.comments = []; // Réinitialiser les commentaires
        this.loadComments(); // Recharger les commentaires
      },
      error => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        alert('Une erreur est survenue lors de l\'ajout du commentaire');
      }
    );
  }

  deleteComment(commentId: number) {
    // Implémenter la suppression si nécessaire
    console.log('Suppression du commentaire:', commentId);
  }

  canDeleteComment(comment: any): boolean {
    return this.isAdmin || (this.currentUserId === comment.utilisateur.id);
  }
}