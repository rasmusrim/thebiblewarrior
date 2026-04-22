import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  bookOutline,
  videocamOutline,
  checkmarkCircle,
  ellipseOutline,
  libraryOutline,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import { useState } from "react";

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const id = parseInt(bookId);
  const { book, loading } = useBook(id);
  const [completed, setCompleted] = useState<number[]>([]);

  useIonViewWillEnter(() => {
    const raw = localStorage.getItem(`book-${id}-completed`);
    setCompleted(raw ? JSON.parse(raw) : []);
  }, [id]);

  const toggleDay = (dayNum: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = completed.includes(dayNum)
      ? completed.filter((d) => d !== dayNum)
      : [...completed, dayNum];
    setCompleted(next);
    localStorage.setItem(`book-${id}-completed`, JSON.stringify(next));
  };

  if (loading || !book) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{book.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/books">
              <IonIcon icon={libraryOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {book.days.map((day) => {
            const isVideo = day.type === "video";
            const isDone = completed.includes(day.day);
            const link = isVideo
              ? `/book/${id}/video/${day.day}`
              : `/book/${id}/day/${day.day}`;
            const label =
              day.type === "reading" ? day.bibleRef : day.videoTitle;

            return (
              <IonItem key={day.day} routerLink={link} detail>
                <IonIcon
                  icon={isVideo ? videocamOutline : bookOutline}
                  slot="start"
                  color={isVideo ? "secondary" : "primary"}
                />
                <IonLabel>
                  <h2>Dag {day.day}</h2>
                  <p>{label}</p>
                </IonLabel>
                <IonIcon
                  icon={isDone ? checkmarkCircle : ellipseOutline}
                  slot="end"
                  color={isDone ? "success" : "medium"}
                  onClick={(e) => toggleDay(day.day, e as any)}
                  style={{ cursor: "pointer" }}
                />
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
