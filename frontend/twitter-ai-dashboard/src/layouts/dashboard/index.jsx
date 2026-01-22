/* eslint-disable */
/* prettier-ignore */

// React hooks pour état et effets
import { useState, useEffect } from "react";

// Composants Material UI pour layout
import Grid from "@mui/material/Grid";

// Composants de ton template (MDBox = box, MDTypography = texte stylé)
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout général et Navbar
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Charts & Cards
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Instance axios configurée pour communiquer avec le backend
import { api } from "../../api";

// Composant pour ajouter un username et créer des leads
import AddUsername from "./AddUsername";

function Dashboard() {
  // ---------------------------
  // 1️⃣ État des statistiques principales
  // ---------------------------
  const [stats, setStats] = useState({
    leadsContacted: 0,    // Nombre total de leads contactés
    repliesReceived: 0,   // Nombre total de réponses reçues
    clickThroughRate: 0,  // CTR = taux de clic sur les liens (%)
    conversions: 0,       // Nombre total de conversions (clients obtenus)
  });

  // ---------------------------
  // 2️⃣ État des données pour les graphiques
  // ---------------------------
  const [leadsChart, setLeadsChart] = useState(null); // Graphique bar chart pour leads
  const [topTweets, setTopTweets] = useState([]);     // Liste des meilleurs tweets
  const [engagement, setEngagement] = useState([]);   // Engagement par tweet
  const [loading, setLoading] = useState(true);       // État de chargement

  // ---------------------------
  // 3️⃣ Fonction pour fetch toutes les données du dashboard
  // ---------------------------
  const fetchDashboard = async () => {
    try {
      setLoading(true); // afficher message "Chargement"

      // On fait 4 requêtes en parallèle au backend
      const [statsRes, chartRes, tweetsRes, engagementRes] = await Promise.all([
        api.get("/api/dashboard/stats"),        // statistiques principales
        api.get("/api/dashboard/leads_chart"),  // données pour le bar chart
        api.get("/api/dashboard/top_tweets"),   // top tweets
        api.get("/api/dashboard/engagement"),   // engagement par tweet
      ]);

      // Stockage des données récupérées dans les états
      setStats(statsRes.data || {});                                 // stats globales
      setLeadsChart(chartRes.data || null);                           // bar chart leads
      setTopTweets(Array.isArray(tweetsRes.data) ? tweetsRes.data : []);  // top tweets
      setEngagement(Array.isArray(engagementRes.data) ? engagementRes.data : []); // engagement
    } catch (err) {
      console.error("Erreur fetch dashboard:", err); // si backend KO
    } finally {
      setLoading(false); // fin du chargement
    }
  };

  // ---------------------------
  // 4️⃣ Fonction pour ajouter un username (nouveau compte à scrapper)
  // ---------------------------
  const handleAddUsername = async (username) => {
    if (!username) return; // pas de username → exit
    try {
      // POST → backend crée les tweets et enregistre dans la BDD
      await api.post("/api/dashboard/add_username", { username });

      // On re-fetch toutes les données pour mettre à jour le dashboard
      await fetchDashboard();
    } catch (err) {
      console.error("Erreur ajout username:", err);
    }
  };

  // ---------------------------
  // 5️⃣ useEffect pour fetch initial quand la page se charge
  // ---------------------------
  useEffect(() => {
    fetchDashboard();
  }, []);

  // ---------------------------
  // 6️⃣ Données line chart pour engagement
  // ---------------------------
  const lineChartData = {
    labels:
      engagement.length > 0
        ? engagement.map((e, idx) => e.tweet || `Jour ${idx + 1}`) // titre par tweet
        : ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],         // fallback semaine

    datasets: [
      {
        label: "Replies", // courbe des réponses
        data:
          engagement.length > 0
            ? engagement.map((e) => e.replies || 0)
            : [5, 3, 8, 2, 7, 4, 6],
        borderColor: "#1E90FF",
        tension: 0.4,
      },
      {
        label: "Conversions", // courbe des conversions
        data:
          engagement.length > 0
            ? engagement.map((e) => e.conversions || 0)
            : [2, 1, 3, 1, 2, 2, 3],
        borderColor: "#32CD32",
        tension: 0.4,
      },
    ],
  };

  // ---------------------------
  // 7️⃣ Affichage loading
  // ---------------------------
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <MDTypography variant="h6">Chargement des données...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  // ---------------------------
  // 8️⃣ Rendu principal du dashboard
  // ---------------------------
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* ---------------------------
            Statistiques principales en haut du dashboard
        --------------------------- */}
        <Grid container spacing={3}>
          {[
            {
              color: "dark",
              icon: "send",
              title: "Leads Contacted", // nombre total leads
              count: stats.leadsContacted || 0,
              desc: "Nombre de leads contactés",
            },
            {
              color: "success",
              icon: "reply",
              title: "Replies Received", // nombre réponses
              count: stats.repliesReceived || 0,
              desc: "Nombre de réponses reçues",
            },
            {
              color: "info",
              icon: "trending_up",
              title: "Click-through Rate", // taux de clic
              count: `${stats.clickThroughRate || 0}%`,
              desc: "Taux de clic sur les liens",
            },
            {
              color: "primary",
              icon: "emoji_events",
              title: "Conversions", // nombre conversions
              count: stats.conversions || 0,
              desc: "Nombre de conversions",
            },
          ].map((stat, idx) => (
            <Grid item xs={12} md={6} lg={3} key={idx}>
              <MDBox mb={1.5}>
                {/* Carte statistique individuelle */}
                <ComplexStatisticsCard
                  color={stat.color}
                  icon={stat.icon}
                  title={stat.title}
                  count={stat.count}
                >
                  <MDTypography variant="caption" color="text">
                    {stat.desc}
                  </MDTypography>
                </ComplexStatisticsCard>
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {/* ---------------------------
            Graphiques
        --------------------------- */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* Bar chart → Leads par source (username) */}
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Leads par source"
                  description="Distribution des leads par compte Twitter"
                  date="Aujourd'hui"
                  chart={leadsChart || { labels: [], datasets: [] }} // fallback vide si pas de données
                />
              </MDBox>
            </Grid>

            {/* Line chart → Engagement */}
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Engagement over time"
                  description="Réponses et conversions par tweet"
                  date="Cette semaine"
                  chart={lineChartData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* ---------------------------
            Ajouter un username
        --------------------------- */}
        <MDBox mt={4}>
          <AddUsername onAdd={handleAddUsername} />
        </MDBox>



        {/* ---------------------------
            Top Tweets
        --------------------------- */}
        <MDBox mt={4}>
          <MDTypography variant="h5" mb={3}>
            🔥 Top Tweets
          </MDTypography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {topTweets.length === 0 ? (
                <MDBox
                  p={3}
                  textAlign="center"
                  border={1}
                  borderColor="grey.300"
                  borderRadius="lg"
                >
                  <MDTypography variant="body1" color="text">
                    Aucun tweet disponible pour le moment
                  </MDTypography>
                </MDBox>
              ) : (
                // Affichage des top tweets
                topTweets.map((t, idx) => (
                  <MDBox
                    key={idx}
                    p={3}
                    borderRadius="lg"
                    border={1}
                    borderColor="grey.300"
                    mb={2}
                    sx={{
                      backgroundColor:
                        idx < 3 ? "rgba(255, 215, 0, 0.1)" : "transparent", // top 3 highlight
                    }}
                  >
                    <MDTypography variant="h6" mb={1}>
                      <strong>@{t.username || "utilisateur"}</strong>
                      <MDTypography
                        component="span"
                        variant="caption"
                        color="text"
                        ml={2}
                      >
                        Score: {t.score || 0} {/* score calculé dans backend */}
                      </MDTypography>
                    </MDTypography>
                    <MDTypography variant="body1" paragraph>
                      {t.tweet || "Aucun contenu"}
                    </MDTypography>

                    {/* Stats par tweet */}
                    <MDBox display="flex" gap={3} mt={1}>
                      <MDTypography variant="caption" color="text">
                        ❤️ {t.likes || 0} likes
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        🔄 {t.retweets || 0} retweets
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        💬 {t.replies || 0} réponses
                      </MDTypography>
                      <MDTypography variant="caption" color="text">
                        ✅ {t.converted || 0} conversions
                      </MDTypography>
                      <MDTypography
                        variant="caption"
                        color="primary"
                        fontWeight="bold"
                      >
                        Engagement total: {t.engagement || 0} {/* likes + retweets + replies + conversions */}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                ))
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
