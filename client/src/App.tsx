import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TheArtist from "./pages/TheArtist";
import Music from "./pages/Music";
import Judas from "./pages/Judas";
import Portal from "./pages/Portal";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Skills from "@/pages/Skills";
import Studio from "@/pages/Studio";
import LoreExplorer from "@/pages/LoreExplorer";
import SyntheticQaView from "@/pages/SyntheticQaView";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/artist"} component={TheArtist} />
      <Route path={"/music"} component={Music} />
      <Route path={"/judas"} component={Judas} />
      <Route path={"/portal"} component={Portal} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/skills"} component={Skills} />
      <Route path={"/studio"} component={Studio} />
      <Route path={"/lore"} component={LoreExplorer} />
      <Route path={"/qa-panel"} component={SyntheticQaView} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
