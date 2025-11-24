require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const { identificarPlano } = require('./services/planoService');
const { criarUsuarioSigma } = require('./services/qpanelService');
const { enviarEmailAcesso } = require('./services/emailService');
const { enviarAcessoTelegram } = require('./services/telegramService');

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

/* --------------------------------------------
 📥 MAPEAR VENDA DO ÁTOMO PAY
--------------------------------------------- */
function mapearVenda(body) {
  const precoCentavos = Number(body?.transaction?.amount || 0);
  const precoReais = precoCentavos / 100;

  return {
    nome: body?.customer?.name || null,
    email: body?.customer?.email || null,
    telefone: body?.customer?.phone_number || body?.customer?.phone || null,
    produto: body?.offer?.title || "Indefinido",
    preco: precoReais,
    status: body?.transaction?.status === "paid" ? "PAID" : "PENDING",
  };
}

/* --------------------------------------------
 🚀 ROTA DO WEBHOOK
--------------------------------------------- */
app.post('/webhook/omniplay', async (req, res) => {
  console.log("📥 WEBHOOK RECEBIDO:", req.body);

  try {
    const venda = mapearVenda(req.body);

    if (!venda.nome || !venda.email) {
      return res.status(400).json({ message: "Nome ou email ausentes" });
    }

    // 1. Identificar plano pelo valor
    const plano = identificarPlano(venda.preco);
    if (!plano) {
      console.error("❌ Plano não encontrado para valor:", venda.preco);
      return res.status(400).json({ message: "Plano não encontrado pelo valor" });
    }

    // 2. Salvar venda no banco
    const vendaDB = await prisma.venda.create({
      data: {
        nome: venda.nome,
        email: venda.email,
        telefone: venda.telefone,
        plano: plano.nome,
        valor: venda.preco,
        status: venda.status
      }
    });

    // Se não tiver pago, não cria usuário ainda
    if (venda.status !== "PAID") {
      console.log("🟡 Venda não paga, apenas registrada.");
      return res.json({ message: "Venda registrada, aguardando pagamento." });
    }

    console.log("🤖 Criando usuário no painel...");

    // 3. Criar usuário no QPanel / Sigma
    const acesso = await criarUsuarioSigma({
      nome: venda.nome,
      email: venda.email,
      whatsapp: venda.telefone,
      plano
    });

    // 4. Salvar usuário no banco
    const usuarioDB = await prisma.usuario.create({
      data: {
        username: acesso.usuario,
        password: acesso.senha,
        nome: venda.nome,
        email: venda.email,
        telefone: venda.telefone,
        plano: plano.nome,
        validade: acesso.expiracao ? new Date(acesso.expiracao) : null,

        // flags começam como false
        enviadoEmail: false,
        enviadoTelegram: false,

        // vinculo reverso: venda será ligada depois via update
      }
    });

    // 5. Vincular venda → usuário
    await prisma.venda.update({
      where: { id: vendaDB.id },
      data: { usuarioId: usuarioDB.id }
    });

    // 6. Enviar email
    await enviarEmailAcesso({
      nome: usuarioDB.nome,
      email: usuarioDB.email,
      username: usuarioDB.username,
      password: usuarioDB.password,
      plano: usuarioDB.plano,
      validade: usuarioDB.validade
    });

    await prisma.usuario.update({
      where: { id: usuarioDB.id },
      data: { enviadoEmail: true }
    });

    // 7. Enviar no Telegram (aqui só loga, mas flag já fica pronta)
    await enviarAcessoTelegram({
      nome: usuarioDB.nome,
      username: usuarioDB.username,
      password: usuarioDB.password,
      plano: usuarioDB.plano,
      validade: usuarioDB.validade,
      telefone: usuarioDB.telefone
    });

    await prisma.usuario.update({
      where: { id: usuarioDB.id },
      data: { enviadoTelegram: true }
    });

    console.log("✅ Fluxo concluído com sucesso para:", venda.email);

    res.json({
      message: "Usuário criado, vinculado à venda e acessos enviados!"
    });

  } catch (err) {
    console.error("❌ ERRO NO WEBHOOK:", err);
    res.status(500).json({ message: "Erro interno ao processar venda." });
  }
});

/* --------------------------------------------
 🚀 INICIAR SERVIDOR
--------------------------------------------- */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 OmniPlay rodando na porta ${PORT}`));
