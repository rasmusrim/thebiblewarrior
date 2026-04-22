import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonProgressBar,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useBookList } from "../hooks/useBook";

export default function HomePage() {
  const { books, loading } = useBookList();
  const history = useHistory();

  const selectBook = (bookId: number) => {
    localStorage.setItem("selectedBook", String(bookId));
    history.push(`/book/${bookId}`);
  };

  const getProgress = (bookId: number, totalDays: number) => {
    const raw = localStorage.getItem(`book-${bookId}-completed`);
    if (!raw) return 0;
    const completed: number[] = JSON.parse(raw);
    return completed.length / totalDays;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>The Bible Warrior</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        ) : (
          books.map((book) => {
            const progress = getProgress(book.id, book.totalDays);
            return (
              <IonCard
                key={book.id}
                button
                onClick={() => selectBook(book.id)}
              >
                <img
                  src={`/books/${book.id}/cover.jpg`}
                  alt={book.title}
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
                />
                <IonCardHeader>
                  <IonCardTitle>{book.title}</IonCardTitle>
                </IonCardHeader>
                <div className="ion-padding-horizontal ion-padding-bottom">
                  <IonProgressBar value={progress} color="secondary" />
                  <p style={{ fontSize: "0.85em", marginTop: 4 }}>
                    {Math.round(progress * 100)}% fullført
                  </p>
                </div>
              </IonCard>
            );
          })
        )}
      </IonContent>
    </IonPage>
  );
}
