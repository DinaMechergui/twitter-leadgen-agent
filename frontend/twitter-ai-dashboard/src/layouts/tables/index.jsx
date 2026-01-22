/* eslint-disable */
/* prettier-ignore */

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Icon from "@mui/material/Icon";
import { TrendingUp, TrendingDown, Equalizer, Assessment, Analytics } from "@mui/icons-material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { api } from "../../api";

function Tables() {
  const [engagement, setEngagement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReplies: 0,
    totalConversions: 0,
    avgReplyRate: 0,
    avgConversionRate: 0,
    bestPerformance: { tweet: "", replies: 0, conversions: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/dashboard/engagement");
        const data = Array.isArray(res.data) ? res.data : [];
        setEngagement(data);

        // Calculer les statistiques
        if (data.length > 0) {
          const totalReplies = data.reduce((sum, e) => sum + (e.replies || 0), 0);
          const totalConversions = data.reduce((sum, e) => sum + (e.conversions || 0), 0);
          const avgReplyRate = totalReplies / data.length;
          const avgConversionRate = totalConversions / data.length;
          
          // Trouver le meilleur performer
          const bestPerformance = data.reduce((best, current) => {
            const currentScore = (current.replies || 0) * 2 + (current.conversions || 0) * 5;
            const bestScore = (best.replies || 0) * 2 + (best.conversions || 0) * 5;
            return currentScore > bestScore ? current : best;
          }, data[0] || { tweet: "", replies: 0, conversions: 0 });

          setStats({
            totalReplies,
            totalConversions,
            avgReplyRate: avgReplyRate.toFixed(1),
            avgConversionRate: avgConversionRate.toFixed(1),
            bestPerformance
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction pour déterminer la couleur en fonction du score
  const getScoreColor = (replies, conversions) => {
    const score = (replies || 0) * 2 + (conversions || 0) * 5;
    if (score >= 80) return "#4CAF50"; // Vert
    if (score >= 50) return "#2196F3"; // Bleu
    if (score >= 30) return "#FF9800"; // Orange
    return "#F44336"; // Rouge
  };

  // Fonction pour déterminer l'icône de tendance
  const getTrendIcon = (replies, avgReplies) => {
    if (replies > avgReplies) return <TrendingUp sx={{ color: "#4CAF50", fontSize: 16 }} />;
    if (replies < avgReplies) return <TrendingDown sx={{ color: "#F44336", fontSize: 16 }} />;
    return <Equalizer sx={{ color: "#FF9800", fontSize: 16 }} />;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* En-tête de la page */}
        <MDBox mb={3}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <MDBox
                width={60}
                height={60}
                borderRadius="15px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="primary.main"
                color="white"
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
                }}
              >
                <Assessment sx={{ fontSize: 32 }} />
              </MDBox>
            </Grid>
            <Grid item xs>
              <MDTypography variant="h4" fontWeight="bold">
                Analytics Dashboard
              </MDTypography>
              <MDTypography variant="body2" color="text.secondary">
                Analyse détaillée des performances d'engagement
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>

        {/* Cartes de statistiques */}
        <MDBox mb={4}>
          <Grid container spacing={3}>
            {/* Carte 1 - Total Replies */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", borderRadius: "12px", boxShadow: 3 }}>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDBox
                      width={40}
                      height={40}
                      borderRadius="10px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(33, 150, 243, 0.1)"
                      color="#2196F3"
                      mr={2}
                    >
                      <Icon>chat_bubble</Icon>
                    </MDBox>
                    <div>
                      <MDTypography variant="body2" color="text.secondary">
                        Total Replies
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="bold">
                        {stats.totalReplies}
                      </MDTypography>
                    </div>
                  </MDBox>
                  <MDBox display="flex" alignItems="center">
                    <TrendingUp sx={{ color: "#4CAF50", mr: 1 }} />
                    <MDTypography variant="caption" color="text.secondary">
                      Moyenne: {stats.avgReplyRate} par engagement
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>

            {/* Carte 2 - Total Conversions */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", borderRadius: "12px", boxShadow: 3 }}>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDBox
                      width={40}
                      height={40}
                      borderRadius="10px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(76, 175, 80, 0.1)"
                      color="#4CAF50"
                      mr={2}
                    >
                      <Icon>check_circle</Icon>
                    </MDBox>
                    <div>
                      <MDTypography variant="body2" color="text.secondary">
                        Total Conversions
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="bold">
                        {stats.totalConversions}
                      </MDTypography>
                    </div>
                  </MDBox>
                  <MDBox display="flex" alignItems="center">
                    <TrendingUp sx={{ color: "#4CAF50", mr: 1 }} />
                    <MDTypography variant="caption" color="text.secondary">
                      Moyenne: {stats.avgConversionRate} par engagement
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>

            {/* Carte 3 - Taux de conversion */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", borderRadius: "12px", boxShadow: 3 }}>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDBox
                      width={40}
                      height={40}
                      borderRadius="10px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(255, 152, 0, 0.1)"
                      color="#FF9800"
                      mr={2}
                    >
                      <Icon>trending_up</Icon>
                    </MDBox>
                    <div>
                      <MDTypography variant="body2" color="text.secondary">
                        Taux de conversion
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="bold">
                        {stats.totalReplies > 0 
                          ? ((stats.totalConversions / stats.totalReplies) * 100).toFixed(1) + "%" 
                          : "0%"}
                      </MDTypography>
                    </div>
                  </MDBox>
                  <MDTypography variant="caption" color="text.secondary">
                    Basé sur {engagement.length} engagements
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>

            {/* Carte 4 - Meilleure performance */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: "100%", borderRadius: "12px", boxShadow: 3 }}>
                <MDBox p={3}>
                  <MDBox display="flex" alignItems="center" mb={2}>
                    <MDBox
                      width={40}
                      height={40}
                      borderRadius="10px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="rgba(156, 39, 176, 0.1)"
                      color="#9C27B0"
                      mr={2}
                    >
                      <Icon>emoji_events</Icon>
                    </MDBox>
                    <div>
                      <MDTypography variant="body2" color="text.secondary">
                        Meilleure performance
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="bold">
                        {(stats.bestPerformance.replies * 2 + stats.bestPerformance.conversions * 5) || 0}
                      </MDTypography>
                    </div>
                  </MDBox>
                  <MDTypography variant="caption" color="text.secondary">
                    Score total
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Tableau des engagements */}
        <Card sx={{ borderRadius: "12px", boxShadow: 3, overflow: "hidden" }}>
          <MDBox p={3} bgcolor="primary.main" color="white">
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <MDTypography variant="h5" fontWeight="bold">
                  Détail des Engagements
                </MDTypography>
                <MDTypography variant="body2" color="rgba(255, 255, 255, 0.8)">
                  Analyse individuelle de chaque interaction
                </MDTypography>
              </Grid>
              <Grid item xs={4} textAlign="right">
                <MDBox display="flex" alignItems="center" justifyContent="flex-end">
                  <Analytics sx={{ mr: 1 }} />
                  <MDTypography variant="caption">
                    {engagement.length} engagement{engagement.length !== 1 ? 's' : ''}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox p={3}>
            {loading ? (
              <MDBox textAlign="center" py={6}>
                <Icon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}>
                  autorenew
                </Icon>
                <MDTypography variant="body1" color="text.secondary">
                  Chargement des données...
                </MDTypography>
              </MDBox>
            ) : engagement.length === 0 ? (
              <MDBox 
                textAlign="center" 
                py={6}
                sx={{ 
                  border: "2px dashed #e0e0e0",
                  borderRadius: "8px",
                  background: "#fafafa"
                }}
              >
                <Icon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}>
                  sentiment_dissatisfied
                </Icon>
                <MDTypography variant="h6" color="text.secondary" mb={1}>
                  Aucune donnée disponible
                </MDTypography>
                <MDTypography variant="body2" color="text.secondary">
                  Les données d'engagement apparaîtront ici une fois disponibles
                </MDTypography>
              </MDBox>
            ) : (
              <Grid container spacing={2}>
                {engagement.map((e, idx) => {
                  const scoreColor = getScoreColor(e.replies, e.conversions);
                  const conversionRate = e.replies > 0 
                    ? ((e.conversions || 0) / (e.replies || 1) * 100).toFixed(1) 
                    : "0.0";
                  
                  return (
                    <Grid item xs={12} key={idx}>
                      <Card 
                        sx={{ 
                          borderRadius: "10px",
                          border: "1px solid #f0f0f0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                            borderColor: "#e0e0e0"
                          }
                        }}
                      >
                        <MDBox p={2.5}>
                          {/* En-tête avec numéro et score */}
                          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <MDBox display="flex" alignItems="center">
                              <MDBox
                                width={32}
                                height={32}
                                borderRadius="8px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                bgcolor={`${scoreColor}15`}
                                color={scoreColor}
                                fontWeight="bold"
                                fontSize="14px"
                                mr={2}
                              >
                                #{idx + 1}
                              </MDBox>
                              <div>
                                <MDTypography variant="caption" color="text.secondary">
                                  Engagement {idx + 1}
                                </MDTypography>
                                <MDBox display="flex" alignItems="center">
                                  {getTrendIcon(e.replies, stats.avgReplyRate)}
                                  <MDTypography variant="caption" color="text.secondary" ml={0.5}>
                                    {e.replies > stats.avgReplyRate ? "Au-dessus" : e.replies < stats.avgReplyRate ? "En dessous" : "Égal"} de la moyenne
                                  </MDTypography>
                                </MDBox>
                              </div>
                            </MDBox>
                            
                            <MDBox 
                              px={2} 
                              py={1} 
                              borderRadius="20px"
                              sx={{ 
                                background: `linear-gradient(135deg, ${scoreColor}20, ${scoreColor}10)`,
                                border: `1px solid ${scoreColor}30`
                              }}
                            >
                              <MDTypography variant="button" color={scoreColor} fontWeight="bold">
                                Score: {(e.replies || 0) * 2 + (e.conversions || 0) * 5}
                              </MDTypography>
                            </MDBox>
                          </MDBox>

                          {/* Contenu du tweet */}
                        {/* Contenu du tweet */}
<MDBox mb={2.5}>
  <MDTypography 
    variant="body2" 
    color="text.primary"
    sx={{
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: 1.6,
      mb: 1
    }}
  >
    <strong>@{e.username || "utilisateur"}</strong>: {e.tweet || "Aucun contenu disponible"}
  </MDTypography>
</MDBox>


                          {/* Métriques */}
                          <MDBox 
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            pt={2}
                            sx={{ 
                              borderTop: "1px solid #f0f0f0" 
                            }}
                          >
                            <MDBox display="flex" gap={3}>
                              <MDBox display="flex" alignItems="center">
                                <MDBox
                                  width={8}
                                  height={8}
                                  borderRadius="50%"
                                  bgcolor="#2196F3"
                                  mr={1}
                                />
                                <div>
                                  <MDTypography variant="caption" color="text.secondary">
                                    Replies
                                  </MDTypography>
                                  <MDTypography variant="body1" fontWeight="bold" color="#2196F3">
                                    {e.replies || 0}
                                  </MDTypography>
                                </div>
                              </MDBox>
                              
                              <MDBox display="flex" alignItems="center">
                                <MDBox
                                  width={8}
                                  height={8}
                                  borderRadius="50%"
                                  bgcolor="#4CAF50"
                                  mr={1}
                                />
                                <div>
                                  <MDTypography variant="caption" color="text.secondary">
                                    Conversions
                                  </MDTypography>
                                  <MDTypography variant="body1" fontWeight="bold" color="#4CAF50">
                                    {e.conversions || 0}
                                  </MDTypography>
                                </div>
                              </MDBox>
                              
                              <MDBox display="flex" alignItems="center">
                                <MDBox
                                  width={8}
                                  height={8}
                                  borderRadius="50%"
                                  bgcolor="#FF9800"
                                  mr={1}
                                />
                                <div>
                                  <MDTypography variant="caption" color="text.secondary">
                                    Taux
                                  </MDTypography>
                                  <MDTypography variant="body1" fontWeight="bold" color="#FF9800">
                                    {conversionRate}%
                                  </MDTypography>
                                </div>
                              </MDBox>
                            </MDBox>

                            <MDBox display="flex" alignItems="center">
                              <Icon sx={{ color: "text.secondary", mr: 0.5, fontSize: 16 }}>
                                schedule
                              </Icon>
                              <MDTypography variant="caption" color="text.secondary">
                                Dernière mise à jour
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                        </MDBox>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

Tables.propTypes = {
  data: PropTypes.array,
};

Tables.defaultProps = {
  data: [],
};

export default Tables;