/* eslint-disable */
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { api } from "../../api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (username) => {
    try {
      await api.delete(`/api/users/${username}`);
      fetchUsers(); // refresh
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <MDTypography variant="h6">Chargement des utilisateurs...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" mb={3}>
          🔹 Utilisateurs suivis
        </MDTypography>
        <Grid container spacing={2}>
          {users.map((u) => (
            <Grid item xs={12} md={6} lg={4} key={u.id}>
              <MDBox
                p={2}
                border={1}
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="body1">@{u.username}</MDTypography>
                <MDTypography
                  variant="button"
                  color="error"
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDelete(u.username)}
                >
                  Supprimer
                </MDTypography>
              </MDBox>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
