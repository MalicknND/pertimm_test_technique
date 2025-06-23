require("dotenv").config();

const baseUrl = process.env.BASE_URL;
const headers = { "Content-Type": "application/json" };

const credentials = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  first_name: process.env.FIRST_NAME,
  last_name: process.env.LAST_NAME,
};

// Fonction helper pour parser le JSON en sécurité (pour les logs)
async function safeJsonParse(response) {
  const text = await response.text();
  console.log(`📋 Réponse brute (${response.status}):`, text);

  if (!text.trim()) {
    console.log("⚠️ Corps de réponse vide");
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("⚠️ Échec du parsing JSON:", err.message);
    return { error: "Réponse JSON invalide", rawText: text };
  }
}

async function main() {
  console.log("🚀 Début du test Pertimm automatisé");
  console.log("🔧 Configuration:");
  console.log("   BASE_URL:", baseUrl);
  console.log("   EMAIL:", credentials.email);
  console.log("   FIRST_NAME:", credentials.first_name);
  console.log("   LAST_NAME:", credentials.last_name);
  console.log("   Mot de passe défini:", !!credentials.password);

  const startTime = Date.now();
  let token = null; // Token pour les requêtes authentifiées
  let pollUrl = null; // URL de polling pour suivre le statut de la candidature

  try {
    // Étape 1 : Register
    console.log("\n🔑 Enregistrement...");
    const registerPayload = {
      email: credentials.email,
      password1: credentials.password,
      password2: credentials.password,
    };
    console.log(
      "📤 Payload d'enregistrement:",
      JSON.stringify(registerPayload, null, 2)
    );

    let res = await fetch(`${baseUrl}/api/v1.1/auth/register/`, {
      method: "POST",
      headers,
      body: JSON.stringify(registerPayload),
    });

    console.log("📥 Statut de réponse:", res.status);
    console.log(
      "📥 En-têtes de réponse:",
      Object.fromEntries(res.headers.entries())
    );

    let data = await safeJsonParse(res);

    if (!res.ok) {
      throw new Error(
        `Échec de l'enregistrement: ${res.status} - ${JSON.stringify(data)}`
      );
    }
    console.log("✅ Inscription réussie");

    // Étape 2 : Login
    console.log("\n🔐 Connexion...");
    const loginPayload = {
      email: credentials.email,
      password: credentials.password,
    };
    console.log(
      "📤 Payload de connexion:",
      JSON.stringify(loginPayload, null, 2)
    );

    res = await fetch(`${baseUrl}/api/v1.1/auth/login/`, {
      method: "POST",
      headers,
      body: JSON.stringify(loginPayload),
    });

    console.log("📥 Statut de réponse:", res.status);
    data = await safeJsonParse(res);

    if (!res.ok) {
      throw new Error(
        `Échec de la connexion: ${res.status} - ${JSON.stringify(data)}`
      );
    }

    if (!data?.token) {
      throw new Error("Token absent de la réponse de login");
    }
    token = `Token ${data.token}`;
    console.log("✅ Connexion réussie, token obtenu");

    // Étape 3 : Create application
    console.log("\n📝 Création de la candidature...");
    const applicationPayload = {
      email: credentials.email,
      first_name: credentials.first_name,
      last_name: credentials.last_name,
    };
    console.log(
      "📤 Payload de candidature:",
      JSON.stringify(applicationPayload, null, 2)
    );

    res = await fetch(`${baseUrl}/api/v1.1/job-application-request/`, {
      method: "POST",
      headers: { ...headers, Authorization: token },
      body: JSON.stringify(applicationPayload),
    });

    console.log("📥 Statut de réponse:", res.status);
    data = await safeJsonParse(res);

    if (!res.ok) {
      throw new Error(
        `Échec de création de candidature: ${res.status} - ${JSON.stringify(
          data
        )}`
      );
    }

    pollUrl = data.url;
    console.log("✅ Candidature créée, URL de suivi reçue:", pollUrl);

    // Étape 4 : Polling
    console.log("\n⏳ Suivi du statut de la candidature...");
    let attempts = 0;
    let applicationData = { status: "INCOMPLETE" };

    while (applicationData.status !== "COMPLETED" && attempts < 30) {
      res = await fetch(pollUrl, {
        headers: { ...headers, Authorization: token },
      });

      applicationData = await safeJsonParse(res);
      console.log(
        `Tentative ${attempts + 1} : Statut = ${
          applicationData?.status || "ERREUR"
        }`
      );

      if (applicationData?.status === "COMPLETED") break;

      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }

    if (
      applicationData?.status !== "COMPLETED" ||
      !applicationData?.confirmation_url
    ) {
      throw new Error("Timeout du polling ou URL de confirmation absente");
    }

    // Étape 5 : Confirmation
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 30) {
      throw new Error("Confirmation trop tardive, délai dépassé");
    }

    console.log("\n✅ Envoi de la confirmation...");
    res = await fetch(applicationData.confirmation_url, {
      method: "PATCH",
      headers: { ...headers, Authorization: token },
      body: JSON.stringify({ confirmed: true }),
    });

    console.log("📥 Statut de réponse:", res.status);
    data = await safeJsonParse(res);

    if (!res.ok) {
      throw new Error(
        `Échec de la confirmation: ${res.status} - ${JSON.stringify(data)}`
      );
    }

    console.log("🎉 Test terminé avec succès !");
    console.log(
      `⏱️ Temps total: ${((Date.now() - startTime) / 1000).toFixed(2)}s`
    );
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    process.exit(1);
  }
}

main();
