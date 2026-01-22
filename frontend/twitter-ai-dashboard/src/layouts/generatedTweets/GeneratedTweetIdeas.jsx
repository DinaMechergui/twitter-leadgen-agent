/* eslint-disable */
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { api } from "../../api";

export default function GeneratedTweetIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("elonmusk");
  const [copiedId, setCopiedId] = useState(null);

  // Récupérer les idées existantes
  const fetchIdeas = async () => {
    try {
      const res = await api.get("/api/dashboard/tweet_ideas", {
        timeout: 30000,
      });
      setIdeas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Générer des idées pour le username entré
  const generateTweets = async () => {
    if (!username.trim()) return;
    try {
      setLoading(true);
      const res = await api.post(
        "/api/dashboard/generate_tweets",
        { username },
        { timeout: 30000 }
      );
      console.log("Génération démarrée:", res.data);
      setTimeout(fetchIdeas, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Copier le texte dans le clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Supprimer une idée
  const deleteIdea = (index) => {
    const newIdeas = [...ideas];
    newIdeas.splice(index, 1);
    setIdeas(newIdeas);
  };

  // Rafraîchir toutes les idées
  const refreshIdeas = () => {
    fetchIdeas();
  };

  return (
    <MDBox
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      minHeight="100vh"
      bgcolor="grey.50"
    >
      {/* Header avec titre et actions */}
      <MDBox width="100%" maxWidth={1200} mb={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <MDTypography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
               Tweet Ideas Generator
            </MDTypography>
            <MDTypography variant="body2" color="text.secondary">
              Generate engaging tweets based on user content
            </MDTypography>
          </Grid>
          <Grid item>
            <IconButton 
              onClick={refreshIdeas} 
              sx={{ 
                color: "grey.700",
                bgcolor: "white",
                boxShadow: 1,
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "rotate(30deg)",
                  transition: "transform 0.3s ease"
                }
              }}
              title="Refresh ideas"
            >
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
      </MDBox>

      {/* Zone de génération */}
      <Card sx={{ 
        width: "100%", 
        maxWidth: 800, 
        mb: 4, 
        p: 3, 
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <MDBox display="flex" alignItems="center" mb={3}>
          <AutoAwesomeIcon sx={{ color: "#6366F1", mr: 1 }} />
          <MDTypography variant="h6" color="text.primary">
            Enter Twitter Username
          </MDTypography>
        </MDBox>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Twitter username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover fieldset": {
                    borderColor: "#6366F1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366F1",
                    borderWidth: 2
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary"
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={generateTweets}
              disabled={loading || !username.trim()}
              sx={{
                height: 56,
                borderRadius: 1.5,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
                bgcolor: loading ? "#A5B4FC" : "#6366F1",
                color: "white",
                boxShadow: "0 2px 10px rgba(99, 102, 241, 0.3)",
                "&:hover": {
                  bgcolor: "#4F46E5",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease"
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 5px rgba(99, 102, 241, 0.3)"
                },
                "&.Mui-disabled": {
                  bgcolor: "#E0E7FF",
                  color: "#9CA3AF"
                }
              }}
            >
              {loading ? (
                <>⏳ Generating...</>
              ) : (
                <>✨ Generate for @{username}</>
              )}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Section d'idées générées */}
      <MDBox width="100%" maxWidth={1200}>
        <MDTypography variant="h5" mb={3} color="text.primary" fontWeight={600}>
           Generated Ideas ({ideas.length})
        </MDTypography>

        {ideas.length === 0 ? (
          <Card sx={{ 
            p: 4, 
            textAlign: "center", 
            borderRadius: 2,
            bgcolor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            <MDTypography variant="body1" color="text.secondary">
              No tweets generated yet. Enter a username and click "Generate" to start.
            </MDTypography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {ideas.map((idea, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{
                  height: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "white",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)"
                  },
                  border: "1px solid",
                  borderColor: "grey.200"
                }}>
                  <MDBox p={2.5}>
                    {/* En-tête avec numéro et score */}
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDBox
                          sx={{
                            bgcolor: "#F3F4F6",
                            color: "text.primary",
                            width: 28,
                            height: 28,
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            border: "1px solid",
                            borderColor: "grey.300"
                          }}
                        >
                          {index + 1}
                        </MDBox>
                        {idea.score && (
                          <MDBox display="flex" alignItems="center" gap={0.5}>
                            <TrendingUpIcon fontSize="small" sx={{ color: "#10B981" }} />
                            <MDTypography variant="caption" color="#10B981" fontWeight={600}>
                              {idea.score}
                            </MDTypography>
                          </MDBox>
                        )}
                      </MDBox>
                      
                      {/* Actions */}
                      <MDBox display="flex" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(idea.text, index)}
                          sx={{
                            color: copiedId === index ? "#10B981" : "grey.600",
                            bgcolor: "grey.50",
                            "&:hover": {
                              bgcolor: copiedId === index ? "#D1FAE5" : "grey.100"
                            }
                          }}
                          title="Copy tweet"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteIdea(index)}
                          sx={{
                            color: "grey.600",
                            bgcolor: "grey.50",
                            "&:hover": {
                              bgcolor: "#FEE2E2",
                              color: "#EF4444"
                            }
                          }}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </MDBox>
                    </MDBox>

                    {/* Contenu du tweet */}
                    <MDBox
                      sx={{
                        bgcolor: "#F9FAFB",
                        p: 2,
                        borderRadius: 1.5,
                        mb: 2,
                        minHeight: 120,
                        border: "1px solid",
                        borderColor: "grey.200"
                      }}
                    >
                      <MDTypography variant="body1" color="text.primary" lineHeight={1.6}>
                        {idea.text || "Generate 5 engaging tweets, each on a new line."}
                      </MDTypography>
                    </MDBox>

                    {/* Footer avec source */}
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      pt={1.5}
                      borderTop={1}
                      borderColor="grey.200"
                    >
                      <MDTypography variant="caption" color="text.secondary">
                        Source: <strong style={{ color: "#4F46E5" }}>{idea.source || username}</strong>
                      </MDTypography>
                      <MDTypography variant="caption" color="text.secondary">
                        {idea.length ? `${idea.length} chars` : "—"}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MDBox>

      {/* Footer léger */}
      <MDBox mt={6} pt={3} width="100%" maxWidth={1200} borderTop={1} borderColor="grey.200">
        <MDTypography variant="body2" color="text.secondary" textAlign="center">
          Material Dashboard 2 • Tweet Ideas Generator • {new Date().getFullYear()}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}