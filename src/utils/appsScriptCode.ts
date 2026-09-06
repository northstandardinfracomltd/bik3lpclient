export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * BIKELP ASSURANCE VÉLO - GOOGLE APPS SCRIPT WEB APP
 * ==============================================================================
 * 
 * INSTRUCTIONS D'INSTALLATION :
 * 1. Ouvrez votre Google Spreadsheet contenant la feuille avec vos assurés.
 * 2. Assurez-vous que la première ligne (Ligne 1) contient exactement ces en-têtes :
 *    language_account,email_account,password_account,phone_account,firstname_account,
 *    familyname_account,dateofbirth_account,birthcity_account,birthcountry_account,
 *    streetandnumber_account,postalcode_account,startdate_contract1,reference_contract1,
 *    status_contract1,bikemodel_contract1,bikevalue_contract1,note_contract1,
 *    subscriptionamount_contract1,subscriptionrecurringtype_contract1,paymentlink_contract1,
 *    documentlink_contract1,gearsextended_contract1,valuegearsextended_contract1
 * 
 * 3. Cliquez sur "Extensions" > "Apps Script".
 * 4. Supprimez tout code existant et collez l'intégralité de ce script.
 * 5. Cliquez sur "Déployer" (bouton bleu en haut à droite) > "Nouveau déploiement".
 * 6. Sélectionnez le type : "Application Web".
 * 7. Description : "Bikelp API Espace Assuré".
 * 8. Exécuter en tant que : "Moi" (votre compte Google).
 * 9. Qui a accès : "Tout le monde" (Anyone).
 * 10. Cliquez sur "Déployer", autorisez les accès, puis copiez l'URL de l'application Web.
 * 11. Collez cette URL dans l'onglet "Préférences" ou à la connexion de votre portail Bikelp !
 * ==============================================================================
 */

// Nom de la feuille de calcul principale (par défaut la première feuille active)
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0];
}

// Récupère ou crée la feuille dédiée aux déclarations de sinistres
function getClaimsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sinistres");
  if (!sheet) {
    sheet = ss.insertSheet("Sinistres");
    sheet.appendRow([
      "id", "timestamp", "user_email", "contract_ref", "bike_model", 
      "type", "date_incident", "location", "police_report", "description", "status"
    ]);
    sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#F3F4F6");
  }
  return sheet;
}

// Fonction de réponse JSON standardisée
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Traitement des requêtes GET (Login, Récupération profil, Ping de test)
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "ping";
    var sheet = getSheet();
    var values = sheet.getDataRange().getValues();
    
    if (values.length < 1) {
      return jsonResponse({ success: false, error: "La feuille est vide." });
    }
    
    var headers = values[0].map(function(h) { return String(h).trim(); });
    
    // Action: Test de connexion
    if (action === "ping") {
      return jsonResponse({
        success: true,
        message: "Connexion Google Apps Script Bikelp réussie",
        sheetName: sheet.getName(),
        totalUsers: Math.max(0, values.length - 1)
      });
    }
    
    // Action: Connexion / Login
    if (action === "login") {
      var email = (params.email || "").trim().toLowerCase();
      var password = (params.password || "").trim();
      
      var emailCol = headers.indexOf("email_account");
      var passCol = headers.indexOf("password_account");
      
      if (emailCol === -1 || passCol === -1) {
        return jsonResponse({
          success: false, 
          error: "Colonnes 'email_account' ou 'password_account' introuvables."
        });
      }
      
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var rowEmail = String(row[emailCol] || "").trim().toLowerCase();
        var rowPass = String(row[passCol] || "").trim();
        
        if (rowEmail === email && rowPass === password) {
          var userData = rowToObject(headers, row);
          return jsonResponse({ success: true, user: userData });
        }
      }
      
      return jsonResponse({ success: false, error: "Identifiants invalides." });
    }
    
    // Action: Récupérer un compte par email
    if (action === "get_account") {
      var searchEmail = (params.email || "").trim().toLowerCase();
      var emailIndex = headers.indexOf("email_account");
      
      for (var j = 1; j < values.length; j++) {
        var r = values[j];
        if (String(r[emailIndex] || "").trim().toLowerCase() === searchEmail) {
          return jsonResponse({ success: true, user: rowToObject(headers, r) });
        }
      }
      return jsonResponse({ success: false, error: "Assuré introuvable." });
    }
    
    return jsonResponse({ success: false, error: "Action inconnue." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Traitement des requêtes POST (Mise à jour profil, Changement email/mdp, Sinistres)
 */
function doPost(e) {
  try {
    var payload;
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    var action = payload.action || "update_profile";
    
    // Action: Déclarer un sinistre
    if (action === "submit_claim") {
      var claimsSheet = getClaimsSheet();
      var claimId = "SIN-" + Utilities.formatDate(new Date(), "GMT+1", "yyyyMMdd") + "-" + Math.floor(1000 + Math.random() * 9000);
      
      claimsSheet.appendRow([
        claimId,
        new Date().toISOString(),
        payload.email_account || "",
        payload.contract_ref || "",
        payload.bike_model || "",
        payload.type || "autre",
        payload.date || "",
        payload.location || "",
        payload.police_report || "",
        payload.description || "",
        "En cours d'instruction"
      ]);
      
      return jsonResponse({
        success: true,
        message: "Sinistre enregistré avec succès",
        claimId: claimId
      });
    }
    
    // Action: Mise à jour du profil de l'assuré
    if (action === "update_profile") {
      var sheet = getSheet();
      var values = sheet.getDataRange().getValues();
      var headers = values[0].map(function(h) { return String(h).trim(); });
      
      var searchEmail = (payload.original_email || payload.email_account || "").trim().toLowerCase();
      var emailCol = headers.indexOf("email_account");
      
      if (emailCol === -1) {
        return jsonResponse({ success: false, error: "Colonne 'email_account' introuvable." });
      }
      
      var targetRowIndex = -1;
      for (var k = 1; k < values.length; k++) {
        if (String(values[k][emailCol] || "").trim().toLowerCase() === searchEmail) {
          targetRowIndex = k + 1; // 1-indexed for Sheet range
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return jsonResponse({ success: false, error: "Assuré non trouvé dans le tableur." });
      }
      
      // Mise à jour cellule par cellule selon les clés fournies dans payload
      for (var key in payload) {
        if (key !== "action" && key !== "original_email") {
          var colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            sheet.getRange(targetRowIndex, colIndex + 1).setValue(payload[key]);
          }
        }
      }
      
      // Récupération de la ligne mise à jour pour renvoi direct
      SpreadsheetApp.flush();
      var updatedRow = sheet.getRange(targetRowIndex, 1, 1, headers.length).getValues()[0];
      var updatedUser = rowToObject(headers, updatedRow);
      
      return jsonResponse({
        success: true,
        message: "Profil mis à jour avec succès dans le Google Sheet",
        user: updatedUser
      });
    }
    
    return jsonResponse({ success: false, error: "Action POST inconnue." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// Utilitaire: Transforme une ligne du tableur en objet JS
function rowToObject(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var val = row[i];
    // Formater les dates proprement si besoin
    if (val instanceof Date) {
      val = Utilities.formatDate(val, "GMT+1", "yyyy-MM-dd");
    }
    obj[key] = val !== undefined && val !== null ? String(val) : "";
  }
  return obj;
}
`;
