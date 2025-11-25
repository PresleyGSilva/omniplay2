const nodemailer = require("nodemailer");

// ==========================================
// 🔥 LISTA DE SMTPs ROTATIVOS (ANTI-BLOQUEIO)
// → Adicione quantos quiser!
// ==========================================
const smtpList = [
  // 1) OMNIPLAY
  {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 10,
    rateLimit: 5,
    auth: {
      user: "omniplayoficial@omniplay.sbs",
      pass: "130829Be@16"
    }
  },

  // 2) IRONPLAY (NOVO QUE VOCÊ PEDIU)
  {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 10,
    rateLimit: 5,
    auth: {
      user: "suporte@ironplayoficial.com.br",
      pass: "130829Be@16"
    }
  },

  // 3) FIREPLAY
  {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 10,
    rateLimit: 5,
    auth: {
      user: "contato@fireplaytv.com",
      pass: "1Nmn|0X3C1^u"
    }
  },

  // 4) VISIONPLAY
  {
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 10,
    rateLimit: 5,
    auth: {
      user: "visionplayoficial@visionplay.lat",
      pass: "130829Be@16"
    }
  }
];

let smtpIndex = 0;

// ==========================================
// 🔄 Função para alternar automaticamente SMTP
// ==========================================
function getNextSMTP() {
  const smtp = smtpList[smtpIndex];
  smtpIndex = (smtpIndex + 1) % smtpList.length;
  return smtp;
}

// ==========================================
// 📨 TEMPLATE DO E-MAIL
// ==========================================
function gerarEmailAcesso({ nome, username, password, expires_at, dns, dns_host }) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
    
    <h2>🎉 Bem-vindo(a) ao suporte Mídias Brasil! 🇧🇷</h2>

    <p>Olá <strong>${nome}</strong>,</p>
    <p>A partir de agora você conta com uma plataforma moderna, estável e com suporte dedicado para garantir a melhor experiência!</p>

    <hr>
    
    <h3>📞 Suporte Oficial</h3>
    <p><a href="https://www.omniplay.me/suporte/">Clique aqui para acessar o suporte</a></p>

    <h3>🔐 Dados de Acesso</h3>
    <p><strong>Usuário:</strong> ${username}</p>
    <p><strong>Senha:</strong> ${password}</p>
    <p><strong>Vencimento:</strong> ${expires_at}</p>

    <hr>

    <h3>📱 Apps e Instalações</h3>
    <p><a href="https://go.aftvnews.com/1636387">Baixar Android (App)</a></p>
    <p><strong>Downloader Android/TV:</strong> 1636387</p>
    <p><a href="https://apps.apple.com/app/id6471106231">Baixar no iPhone</a></p>

    <hr>

    <h3>🔸 DNS</h3>
    <p><strong>XCIPTV:</strong> ${dns}</p>
    <p><strong>Smarters:</strong> ${dns.replace("http://", "http:/")}</p>

    <hr>

    <h3>🔗 Listas M3U e HLS</h3>
    <p><strong>M3U:</strong> ${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=mpegts</p>
    <p><strong>HLS:</strong> ${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=hls</p>

    <hr>

    <p><strong>SSIPTV:</strong> http://e.${dns_host}/p/${username}/${password}/ssiptv</p>

    <hr>

    <h3>📞 Suporte Oficial</h3>
    <p><a href="https://www.omniplay.me/suporte/">Clique aqui para acessar o suporte</a></p>

  </div>
  `;
}

// ==========================================
// 📬 FUNÇÃO DE ENVIO COM FALLBACK
// ==========================================
async function enviarEmailAcesso({ email, nome, username, password, expires_at }) {
  const dns = "http://minhatv.hub2.top";
  const dns_host = "minhatv.hub2.top";

  const html = gerarEmailAcesso({
    nome,
    username,
    password,
    expires_at,
    dns,
    dns_host
  });

  // Tenta enviar com cada SMTP da lista
  for (let i = 0; i < smtpList.length; i++) {
    const smtp = getNextSMTP();

    const transporter = nodemailer.createTransport({
      ...smtp,
      tls: { rejectUnauthorized: false }
    });

    try {
      const info = await transporter.sendMail({
        from: `Mídias Brasil <${smtp.auth.user}>`,
        to: email,
        subject: "Seus dados de acesso – Mídias Brasil",
        html
      });

      console.log("✔ Email enviado por:", smtp.auth.user);
      return true;

    } catch (error) {
      console.error("❌ Erro com SMTP:", smtp.auth.user);
      console.error(error.response || error.message);

      // SE FOR BLOQUEIO DO HPAINEL (HOSTINGER)
      if (
        error.responseCode === 554 ||
        error.message.includes("Disabled by user") ||
        error.message.includes("4.7.1") ||
        error.message.includes("5.7.1")
      ) {
        console.log("⚠ SMTP bloqueado. Pulando para o próximo...");
        continue;
      }

      // Outros erros → aborta
      throw error;
    }
  }

  throw new Error("🚨 Nenhum SMTP disponível para envio.");
}

module.exports = {
  enviarEmailAcesso,
  gerarEmailAcesso
};
