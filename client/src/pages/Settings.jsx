import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, ExternalLink, Info } from "lucide-react";
import { getSettings, saveSettings } from "@/lib/storage";

const Settings = () => {
  const [apiBase, setApiBase] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const settings = getSettings();
    setApiBase(settings.apiBase);
    setBearerToken(settings.bearerToken);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      saveSettings({ apiBase, bearerToken });
      toast({
        title: "Settings saved successfully!",
        description: "Your API configuration has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openApiDocs = () => {
    const baseUrl = apiBase || "http://localhost:5000";
    window.open(`${baseUrl}/api/v1/docs`, "_blank");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">API Configuration</h2>
        <p className="text-muted-foreground">Configure your API settings to connect to the Loan Support backend</p>
      </div>

      {/* Configuration Card */}
      <Card className="rounded-2xl shadow-lg card-hover">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
            Connection Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-base" className="block text-sm font-medium text-foreground mb-2">
                API Base URL
              </Label>
              <Input
                id="api-base"
                type="url"
                value={apiBase}
                onChange={(e) => setApiBase(e.target.value)}
                placeholder="http://localhost:5000"
                className="input-focus"
                data-testid="input-api-base"
              />
            </div>
            
            <div>
              <Label htmlFor="bearer-token" className="block text-sm font-medium text-foreground mb-2">
                Bearer Token
              </Label>
              <Input
                id="bearer-token"
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                placeholder="Enter your authentication token"
                className="input-focus"
                data-testid="input-bearer-token"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="button-primary flex-1"
              data-testid="button-save-settings"
            >
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
            <Button
              variant="secondary"
              onClick={openApiDocs}
              className="flex items-center justify-center"
              data-testid="button-open-docs"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open API Docs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Index Info */}
      <Card className="rounded-2xl shadow-lg card-hover">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-primary" />
            Index Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Current Index Name</div>
              <div className="text-base font-medium text-foreground">loan-support-index</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Namespace</div>
              <div className="text-base font-medium text-foreground">default</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
