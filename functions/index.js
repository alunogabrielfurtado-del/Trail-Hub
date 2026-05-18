// functions/index.js
//
// FUNÇÃO: Sincroniza o campo "role" do Firestore como Custom Claim no token JWT.
// Isso elimina a necessidade de fazer get() nas firestore.rules para verificar
// se o usuário é admin — a role fica embutida no próprio token.
//
// DEPLOY: firebase deploy --only functions
// APÓS DEPLOY: o admin deve fazer logout e login uma vez para o token ser atualizado.

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp }     = require("firebase-admin/app");
const { getAuth }           = require("firebase-admin/auth");

initializeApp();

exports.syncRoleClaim = onDocumentWritten("users/{uid}", async (event) => {
  const uid  = event.params.uid;
  const data = event.data?.after?.data();

  // Documento deletado — sem ação necessária
  if (!data) return;

  const role = data.role ?? "user";

  try {
    await getAuth().setCustomUserClaims(uid, { role });
    console.log(`Custom Claim definido: uid=${uid} role=${role}`);
  } catch (error) {
    console.error(`Erro ao definir Custom Claim para uid=${uid}:`, error);
  }
});