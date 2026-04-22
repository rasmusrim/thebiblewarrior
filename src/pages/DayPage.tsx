import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSpinner,
  IonRange,
  useIonViewWillLeave,
} from "@ionic/react";
import { playCircle, pauseCircle } from "ionicons/icons";
import { useParams, useHistory } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useState, useEffect, useCallback } from "react";
import { ReadingDay } from "../types/book";

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function DayPage() {
  const { bookId, day: dayStr } = useParams<{ bookId: string; day: string }>();
  const id = parseInt(bookId);
  const dayNum = parseInt(dayStr);
  const { book, loading } = useBook(id);
  const history = useHistory();
  const audio = useAudioPlayer();

  const dayData = book?.days.find((d) => d.day === dayNum);
  const reading = dayData?.type === "reading" ? (dayData as ReadingDay) : null;

  useEffect(() => {
    if (reading) {
      audio.load(`/books/${id}/audio/${reading.audioFile}`);
    }
  }, [reading?.audioFile, id]);

  useIonViewWillLeave(() => {
    audio.pause();
  });

  const [completed, setCompleted] = useState(false);

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

  if (loading || !reading) {
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
        <h2 style={{ textAlign: "center", margin: "8px 0" }}>{reading.bibleRef}</h2>

        {/* Prayer prompt */}
        <IonCard color="light">
          <IonCardContent>
            <p style={{ fontStyle: "italic" }}>{reading.prayerPrompt}</p>
          </IonCardContent>
        </IonCard>

        {/* Audio player */}
        <IonCard>
          <IonCardContent>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <IonButton fill="clear" onClick={audio.togglePlay} size="large">
                <IonIcon
                  icon={audio.isPlaying ? pauseCircle : playCircle}
                  style={{ fontSize: 48 }}
                  color="primary"
                />
              </IonButton>
              <div style={{ flex: 1 }}>
                <IonRange
                  min={0}
                  max={audio.duration || 1}
                  value={audio.currentTime}
                  onIonChange={(e) => audio.seek(e.detail.value as number)}
                  style={{ padding: 0 }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8em",
                    color: "var(--ion-color-medium)",
                  }}
                >
                  <span>{formatTime(audio.currentTime)}</span>
                  <span>{formatTime(audio.duration)}</span>
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Completion checkbox */}
        <div style={{ padding: "16px 0", textAlign: "center" }}>
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
