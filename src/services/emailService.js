const nodemailer = require("nodemailer");

// ==============================
// 📨 TEMPLATE DO E-MAIL
// ==============================
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

    <h3>📱 Download no Android / IOS / TV Box</h3>

    <p><strong>Android (Celular e TV):</strong><br>
    <a href="https://go.aftvnews.com/1636387">Clique aqui para instalar</a></p>

    <p><strong>TV Box – via Downloader:</strong><br>
    Abra o app Downloader e digite <strong>1636387</strong></p>

    <p><strong>iPhone – XCloud:</strong><br>
    <a href="https://apps.apple.com/app/id6471106231">Baixar na App Store</a></p>

    <hr>

    <h3>🟣 Assist Plus (Roku, LG, Samsung, Android)</h3>
    <p><strong>Código:</strong> 1011<br>
    <strong>Usuário:</strong> ${username}<br>
    <strong>Senha:</strong> ${password}</p>

    <hr>

    <h3>🟠 XCloud (Roku, LG, Samsung)</h3>
    <p><strong>Provedor:</strong> 11aa ou 11aa1<br>
    <strong>Usuário:</strong> ${username}<br>
    <strong>Senha:</strong> ${password}</p>

    <hr>

    <h3>🔸 DNS para XCIPTV / IPTV Smarters</h3>
    <p><strong>DNS XCIPTV:</strong><br>${dns}</p>
    <p><strong>DNS IPTV Smarters:</strong><br>${dns.replace("http://", "http:/")}</p>
    <p style="color:red;">⚠️ Use exatamente como está (apenas 1 “/”).</p>

    <hr>

    <h3>🔗 Listas M3U, HLS e SSIPTV</h3>
    <p><strong>M3U:</strong><br> ${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=mpegts</p>
    <p><strong>HLS:</strong><br> ${dns}/get.php?username=${username}&password=${password}&type=m3u_plus&output=hls</p>
    <p><strong>SSIPTV:</strong><br> http://e.${dns_host}/p/${username}/${password}/ssiptv</p>

    <hr>

    <h3>🎛️ TVs Samsung Antigas (DNS STB / SmartUp)</h3>
    <p>135.148.144.87</p>

    <hr>

    <h3>📞 Suporte Oficial</h3>
    <p><a href="https://www.omniplay.me/suporte/">Clique aqui para acessar o suporte</a></p>

  </div>
  `;
}

// ==============================
// 📬 FUNÇÃO PARA ENVIAR E-MAIL
// ==============================
async function enviarEmailAcesso({ email, nome, username, password, expires_at }) {
  const dns = "http://minhatv.hub2.top";
  const dns_host = "minhatv.hub2.top";

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `Mídias Brasil <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Seus dados de acesso – Mídias Brasil",
    html: gerarEmailAcesso({
      nome,
      username,
      password,
      expires_at,
      dns,
      dns_host
    }),
  });

  return true;
}

module.exports = {
  enviarEmailAcesso,
  gerarEmailAcesso
};