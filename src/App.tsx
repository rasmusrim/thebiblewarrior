import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import DayPage from "./pages/DayPage";
import VideoPage from "./pages/VideoPage";

function RootRedirect() {
  const savedBook = localStorage.getItem("selectedBook");
  if (savedBook) {
    return <Redirect to={`/book/${savedBook}`} />;
  }
  return <Redirect to="/books" />;
}

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={RootRedirect} />
          <Route exact path="/books" component={HomePage} />
          <Route exact path="/book/:bookId" component={BookPage} />
          <Route exact path="/book/:bookId/day/:day" component={DayPage} />
          <Route exact path="/book/:bookId/video/:day" component={VideoPage} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
