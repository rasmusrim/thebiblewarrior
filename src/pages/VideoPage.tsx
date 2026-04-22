import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonSpinner,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import { useState, useEffect, useCallback } from "react";
import { VideoDay } from "../types/book";

export default function VideoPage() {
  const { bookId, day: dayStr } = useParams<{ bookId: string; day: string }>();
  const id = parseInt(bookId);
  const dayNum = parseInt(dayStr);
  const { book, loading } = useBook(id);

  const history = useHistory();
  const dayData = book?.days.find((d) => d.day === dayNum);
  const video = dayData?.type === "video" ? (dayData as VideoDay) : null;

  const [completed, setCompleted] = useState(false);
  const [viewActive, setViewActive] = useState(true);

  useIonViewWillEnter(() => setViewActive(true));
  useIonViewWillLeave(() => setViewActive(false));

  useEffect(() => {
    const raw = localStorage.getItem(`book-${id}-completed`);
    if (raw) {
      const arr: number[] = JSON.parse(raw);
      setCompleted(arr.includes(dayNum));
    }
  }, [id, dayNum]);

  const markCompleted = useCallback(() => {
    const raw = localStorage.getItem(`book-${id}-completed`);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    if (!arr.includes(dayNum)) {
      localStorage.setItem(`book-${id}-completed`, JSON.stringify([...arr, dayNum]));
    }
    history.push(`/book/${id}`);
  }, [id, dayNum, history]);

  if (loading || !video) {
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
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/book/${id}`} text="Tilbake" />
          </IonButtons>
          <IonTitle>Dag {dayNum}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 style={{ textAlign: "center", margin: "8px 0 16px" }}>
          {video.videoTitle}
        </h2>

        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          {viewActive && <iframe
            src={video.youtubeEmbed}
            title={video.videoTitle}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />}
        </div>

        <div style={{ padding: "24px 0", textAlign: "center" }}>
          <IonButton
            expand="block"
            color="success"
            onClick={markCompleted}
            disabled={completed}
          >
            {completed ? "Fullført" : "Oppdrag utført!"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
