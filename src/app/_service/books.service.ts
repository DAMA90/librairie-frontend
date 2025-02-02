import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Books } from "../_models/books";
import { Category } from "../_models/category";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
    });
  }

  private getHeadersPatch(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/merge-patch+json",
    });
  }

  private getHeaderWithToken(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
  }

  // Méthodes pour les livres
  getBooksList(): Observable<Books[]> {
    return this.http.get<any>(`${this.baseURL}/livres`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.baseURL}/categories`);
  }

  createBooks(books: Books): Observable<Object> {
    books.categorie = `/api/categories/${books.categorie}`;
    books.date = new Date().toISOString();
    return this.http.post(`${this.baseURL}/livres`, books, {
      headers: this.getHeaders(),
    });
  }

  getBooksById(id: number): Observable<Books> {
    return this.http.get<Books>(`${this.baseURL}/livres/${id}`);
  }

  updateBooks(id: number, books: Books): Observable<Object> {
    return this.http.patch(`${this.baseURL}/livres/${id}`, books, {
      headers: this.getHeadersPatch(),
    });
  }

  deleteBooks(id: number | undefined): Observable<Object> {
    return this.http.delete(`${this.baseURL}/livres/${id}`);
  }

  // Méthodes pour les réservations
  getReservations(): Observable<any[]> {
    return this.http.get<any>(`${this.baseURL}/reservations`);
  }

  getUserReservations(userId: number): Observable<any[]> {
    return this.getReservations().pipe(
      map((reservations) =>
        reservations.filter(
          (res) => res.utilisateur === `/api/utilisateurs/${userId}`
        )
      )
    );
  }

  createReservation(bookId: number, userId: number): Observable<any> {
    const reservation = {
      livre: `/api/livres/${bookId}`,
      utilisateur: `/api/utilisateurs/${userId}`,
      dateReservation: new Date().toISOString(),
      dateExpiration: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(), // 2 jours
      statut: "En attente",
    };
    return this.http.post(`${this.baseURL}/reservations`, reservation, {
      headers: this.getHeaders(),
    });
  }

  updateReservationStatus(
    reservationId: number,
    status: string
  ): Observable<any> {
    return this.http.patch(
      `${this.baseURL}/reservations/${reservationId}`,
      { statut: status },
      { headers: this.getHeadersPatch() }
    );
  }

  // Méthodes pour les emprunts
  getEmprunts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/emprunts`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getUserEmprunts(userId: number): Observable<any[]> {
    return this.getEmprunts();
  }

  createEmprunt(reservationId: number): Observable<any> {
    const emprunt = {
      reservation: `/api/reservations/${reservationId}`,
      dateEmprunt: new Date().toISOString(),
      dateRetourPrevue: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(), // 14 jours
    };
    return this.http.post(`${this.baseURL}/emprunts`, emprunt, {
      headers: this.getHeaders(),
    });
  }

  returnEmprunt(empruntId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/emprunts/${empruntId}`);
  }

  deleteReservation(reservationId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/reservations/${reservationId}`);
  }

  // Méthode utilitaire pour vérifier la disponibilité d'un livre
  checkBookAvailability(bookId: number): Observable<boolean> {
    return this.getEmprunts().pipe(
      map((emprunts) => {
        const activeEmprunt = emprunts.find(
          (emprunt) =>
            emprunt.reservation.livre === `/api/livres/${bookId}` &&
            !emprunt.dateRetourReelle
        );
        return !activeEmprunt;
      })
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/utilisateurs/${id}`);
  }

  createComment(commentData: any): Observable<any> {
    commentData.utilisateur = `/api/utilisateurs/${commentData.utilisateurId}`;
    commentData.livre = `/api/livres/${commentData.livreId}`;
    commentData.date = new Date().toISOString();
    return this.http.post(`${this.baseURL}/commentaires`, commentData, {
      headers: this.getHeaders(),
    });
  }

  getBookComments(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/commentaires`);
  }

  getCommentById(commentId: number): Observable<any> {
    return this.http.get(`${this.baseURL}/commentaires/${commentId}`);
  }

  getCommentsByBookId(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/commentaires`).pipe(
      map((comments) =>
        comments.filter((comment) => comment?.livre === `/api/livres/${bookId}`)
      ),
      map((filteredComments) => {
        console.log(filteredComments);
        const userRequests = filteredComments.map((comment) => {
          const userId = parseInt(comment.utilisateur.split("/").pop() || "0");
          return this.http
            .get<any>(`${this.baseURL}/utilisateurs/${userId}`)
            .pipe(
              map((user) => ({
                id: comment.id,
                description: comment.description,
                date: comment.date,
                utilisateur: {
                  id: user.id,
                  nom: user.nom,
                  email: user.email,
                },
              }))
            );
        });
        return userRequests;
      })
    );
  }
}
