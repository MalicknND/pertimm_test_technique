// 📁 pertimmScript.js
require("dotenv").config();
// const fetch = require("node-fetch");

const baseUrl = process.env.BASE_URL;
const headers = { "Content-Type": "application/json" };

const credentials = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  first_name: process.env.FIRST_NAME,
  last_name: process.env.LAST_NAME,
};

async function main() {
  console.log("🚀 Début du test Pertimm automatisé");
  const startTime = Date.now();
  let token = null;
  let pollUrl = null;

  try {
    // Étape 1 : Register
    console.log("🔑 Enregistrement...");
    let res = await fetch(`${baseUrl}/api/v1.1/auth/register/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: credentials.email,
        password1: credentials.password,
        password2: credentials.password,
      }),
    });
    let data = await res.json();
    if (!res.ok)
      throw new Error(`Register failed: ${res.status} ${JSON.stringify(data)}`);
    console.log("✅ Inscription réussie");

    // Étape 2 : Login
    console.log("🔐 Connexion...");
    res = await fetch(`${baseUrl}/api/v1.1/auth/login/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    data = await res.json();
    if (!res.ok)
      throw new Error(`Login failed: ${res.status} ${JSON.stringify(data)}`);

    if (!data.token) throw new Error("Token absent de la réponse de login");
    token = `Token ${data.token}`;
    console.log("✅ Connexion réussie, token obtenu:", token);

    // Étape 3 : Create application
    console.log("📝 Création de la candidature...");
    res = await fetch(`${baseUrl}/api/v1.1/job-application-request/`, {
      method: "POST",
      headers: { ...headers, Authorization: token },
      body: JSON.stringify({
        email: credentials.email,
        first_name: credentials.first_name,
        last_name: credentials.last_name,
      }),
    });
    data = await res.json();
    if (!res.ok)
      throw new Error(
        `Create application failed: ${res.status} ${JSON.stringify(data)}`
      );
    pollUrl = data.url;
    console.log("✅ Candidature créée, URL de suivi reçue");

    // Étape 4 : Polling
    console.log("⏳ Suivi du statut de la candidature...");
    let attempts = 0;
    let applicationData = { status: "INCOMPLETE" };

    while (applicationData.status !== "COMPLETED" && attempts < 30) {
      res = await fetch(pollUrl, {
        headers: { ...headers, Authorization: token },
      });
      applicationData = await res.json();
      console.log(
        `Tentative ${attempts + 1} : Status = ${applicationData.status}`
      );

      if (applicationData.status === "COMPLETED") break;

      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
    }

    if (
      applicationData.status !== "COMPLETED" ||
      !applicationData.confirmation_url
    ) {
      throw new Error("Polling timeout ou URL de confirmation absente");
    }

    // Étape 5 : Confirmation
    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > 30)
      throw new Error("Confirmation trop tardive, délai dépassé");

    console.log("✅ Envoi de la confirmation...");
    res = await fetch(applicationData.confirmation_url, {
      method: "PATCH",
      headers: { ...headers, Authorization: token },
      body: JSON.stringify({ confirmed: true }),
    });
    data = await res.json();
    if (!res.ok)
      throw new Error(
        `Confirmation failed: ${res.status} ${JSON.stringify(data)}`
      );

    console.log("🎉 Test terminé avec succès !");
  } catch (err) {
    console.error("❌ Erreur:", err.message);
  }
}

main();
