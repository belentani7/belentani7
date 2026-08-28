import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, List, Download, Play, Loader2 } from "lucide-react";

interface Mission {
  id: string;
  objective: string;
  status: string;
  created_at: string;
  urls_count: number;
  pages_scraped: number;
}

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState("");
  const [urls, setUrls] = useState("");
  const [maxPages, setMaxPages] = useState(3);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/missions");
      const data = await res.json();
      setMissions(data.missions || []);
    } catch (error) {
      console.error("Failed to fetch missions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const createMission = async () => {
    if (!objective.trim()) return;
    
    setLoading(true);
    try {
      const urlArray = urls.split("\n").filter(u => u.trim()).map(u => u.trim());
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective,
          urls: urlArray,
          max_pages: maxPages
        })
      });
      const result = await res.json();
      console.log("Mission created:", result);
      setObjective("");
      setUrls("");
      fetchMissions();
    } catch (error) {
      console.error("Failed to create mission:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportMission = async (id: string, format: "csv" | "json") => {
    window.open(`/api/missions/${id}/export/${format}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mission Engine</h1>
        <p className="text-muted-foreground">
          Web research automation powered by Belentani Engine
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">
            <Rocket className="w-4 h-4 mr-2" />
            Create Mission
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            Mission History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Research Mission</CardTitle>
              <CardDescription>
                Define your research objective and target URLs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Objective</label>
                <Textarea
                  placeholder="What do you want to research? (e.g., 'Analyze AI startups in Barcelona')"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Target URLs (one per line, optional)
                </label>
                <Textarea
                  placeholder="https://example.com&#10;https://another-site.com"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Pages per Domain: {maxPages}
                </label>
                <Input
                  type="range"
                  min={1}
                  max={20}
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                />
              </div>

              <Button onClick={createMission} disabled={loading || !objective.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Mission...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Launch Mission
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mission History</CardTitle>
                  <CardDescription>{missions.length} missions completed</CardDescription>
                </div>
                <Button onClick={fetchMissions} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : missions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No missions yet. Create your first mission above.
                </p>
              ) : (
                <div className="space-y-4">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{mission.objective}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ID: {mission.id.substring(0, 8)}...</span>
                            <Badge variant="outline">{mission.status}</Badge>
                            <span>{mission.pages_scraped} pages</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportMission(mission.id, "json")}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            JSON
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportMission(mission.id, "csv")}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            CSV
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(mission.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
