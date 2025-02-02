import { Component, OnInit } from '@angular/core';
import { BooksService } from '../_service/books.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface ReservationDetails {
  id: number;
  livre: any;
  utilisateur: any;
  dateReservation: string;
  dateExpiration: string;
  statut: string;
}

@Component({
  selector: 'app-reservation-admin',
  templateUrl: './reservation-admin.component.html',
  styleUrls: ['./reservation-admin.component.css']
})
export class ReservationAdminComponent implements OnInit {
  reservations: ReservationDetails[] = [];
  loading = true;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.booksService.getReservations().subscribe(
      reservations => {
        const pendingReservations = reservations.filter(res => res.statut === 'En attente');
        
        // Pour chaque réservation, récupérer les détails du livre et de l'utilisateur
        const detailsRequests = pendingReservations.map(reservation => {
          const livreId = this.extractId(reservation.livre);
          const userId = this.extractId(reservation.utilisateur);

          return forkJoin({
            livre: this.booksService.getBooksById(livreId),
            utilisateur: this.booksService.getUserById(userId)
          }).pipe(
            map(details => ({
              id: reservation.id,
              livre: details.livre,
              utilisateur: details.utilisateur,
              dateReservation: reservation.dateReservation,
              dateExpiration: reservation.dateExpiration,
              statut: reservation.statut
            }))
          );
        });

        if (detailsRequests.length > 0) {
          forkJoin(detailsRequests).subscribe(
            detailedReservations => {
              this.reservations = detailedReservations;
              this.loading = false;
            },
            error => {
              console.error('Erreur lors de la récupération des détails:', error);
              this.loading = false;
            }
          );
        } else {
          this.reservations = [];
          this.loading = false;
        }
      },
      error => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.loading = false;
      }
    );
  }

  private extractId(iri: string): number {
    return parseInt(iri.split('/').pop() || '0');
  }

  acceptReservation(reservationId: number) {
    this.booksService.updateReservationStatus(reservationId, 'Acceptée').subscribe(
      () => {
        this.booksService.createEmprunt(reservationId).subscribe(
          () => {
            alert('Réservation acceptée et emprunt créé avec succès !');
            this.loadReservations();
          },
          error => {
            alert('Réservation acceptée et emprunt créé avec succès !');
          }
        );
      },
      error => {
        console.error('Erreur lors de la mise à jour de la réservation:', error);
        alert('Erreur lors de la validation de la réservation');
      }
    );
  }

  refuseReservation(reservationId: number) {
    if (confirm('Êtes-vous sûr de vouloir refuser cette réservation ?')) {
      this.booksService.updateReservationStatus(reservationId, 'Refusée').subscribe(
        () => {
          alert('Réservation refusée');
          this.loadReservations();
        },
        error => {
          console.error('Erreur lors du refus de la réservation:', error);
          alert('Erreur lors du refus de la réservation');
        }
      );
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateExpirationDelay(expirationDate: string): number {
    const expiration = new Date(expirationDate);
    const now = new Date();
    return Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 3600 * 24));
  }
}