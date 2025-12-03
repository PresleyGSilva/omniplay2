const nodemailer = require("nodemailer");

// ===============================
// 📌 TEMPLATE DO E-MAIL
// ===============================
function gerarEmailAcesso({ nome, username, password, expires_at, dns, dns_host }) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
    
    <h2>🎉 Bem-vindo(a) ao suporte Mídias Brasil! 🇧🇷</h2>

    <p>Olá <strong>${nome}</strong>,</p>
    <p>Seu acesso foi criado com sucesso! Seguem abaixo seus dados.</p>

    <hr>

    <h3>🔐 Dados de Acesso</h3>
    <p><strong>Usuário:</strong> ${username}</p>
    <p><strong>Senha:</strong> ${password}</p>
    <p><strong>Vencimento:</strong> ${expires_at}</p>

    <hr>

    <h3>📱 Apps e Instalações</h3>
    <p>Android: https://go.aftvnews.com/1636387</p>
    <p>iPhone: https://apps.apple.com/app/id6471106231</p>

    <br>

   <h3>🟠 APP SMARTERS PLAYER LITE (iOS / Android / Smart TV)</h3>

<p>Baixe o app oficial:</p>
<p>
  👉 <a href="https://apps.apple.com/br/app/smarters-player-lite/id1628995509" 
  style="color:#007bff;">Smarters Player Lite – App Store (iPhone/iPad)</a>
</p>

<hr>

<h3>📺 Como configurar no Xtream Codes</h3>

<p>Siga esta ordem ao preencher dentro do app:</p>

<p><strong>1️⃣ Nome:</strong> Mídias Brasil</p>
<p><strong>2️⃣ Usuário:</strong> ${username}</p>
<p><strong>3️⃣ Senha:</strong> ${password}</p>

<p><strong>4️⃣ URL do Servidor (DNS):</strong><br>
<span style="color:#ff4d4d; font-size: 17px;">
http:/minhatv.hub2.top
</span><br>
⚠️ Use exatamente assim: <b>apenas 1 barra depois de “http:”</b>
</p>

<hr>

<p>⚠️ Se o app pedir PORTA, coloque: <strong>80</strong></p>

    <hr>

    <h3>🔸 DNS</h3>
    <p><strong>XCIPTV:</strong> ${dns}</p>

    <h3>🔗 Listas M3U e HLS</h3>
    <p>${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=mpegts</p>

    <hr>

    <p><strong>SSIPTV:</strong> http://e.${dns_host}/p/${username}/${password}/ssiptv</p>

    <br>
    <p>📞 Suporte: https://www.omniplay.me/suporte/</p>

  </div>
  `;
}

// ===============================
// 📬 ENVIO — SOMENTE BREVO SMTP
// ===============================
async function enviarEmailAcesso({ email, nome, username, password, expires_at }) {
  try {
    const dns = "http://minhatv.hub2.top";
    const dns_host = "minhatv.hub2.top";

    const html = gerarEmailAcesso({
      nome,
      username,
      password,
      expires_at,
      dns,
      dns_host,
    });

    // CONFIG SMTP DO BREVO
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "9c857e001@smtp-brevo.com",
        pass: "a2J4UgCRHc5vOhwP",
      },
    });

    const mailOptions = {
      from: "Mídias Brasil <omniplayoficial@omniplay.sbs>",  // CORRETO
      to: email,
      subject: "Seus dados de acesso – Mídias Brasil",
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log("✔ Email enviado com sucesso via Brevo SMTP!");
    return true;

  } catch (err) {
    console.log("❌ Erro ao enviar com Brevo SMTP:", err.message);
    return false;
  }
}

module.exports = { enviarEmailAcesso };
