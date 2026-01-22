/* eslint-disable */
/* prettier-ignore */
import { useState } from "react";
import PropTypes from "prop-types"; // pour vérifier les props
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { api } from "../../api"; // <-- assure-toi que le path est correct

function AddUsername({ onAdd }) {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    if (!username) return;

    try {
      // POST au backend pour ajouter le username et générer les tweets
await api.post("/api/dashboard/add_username", { username });

      // Met à jour le dashboard localement
      onAdd(username);

      // Réinitialise le champ
      setUsername("");
    } catch (err) {
      console.error("Erreur ajout username:", err);
    }
  };

  return (
    <MDBox display="flex" gap={2} mb={3}>
      <MDInput
        label="Ajouter un username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <MDButton variant="gradient" color="info" onClick={handleSubmit}>
        Ajouter
      </MDButton>
    </MDBox>
  );
}

// Déclaration des types pour les props
AddUsername.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddUsername;
