# CONTEXTO DO PROJETO — ORMED (Ordem dos Médicos de Angola)

> **Para o assistente (Claude):** lê este ficheiro primeiro. Resume o estado do projeto, a
> arquitetura, as decisões tomadas e o que está pendente. Foi escrito para que um chat novo,
> noutro dispositivo, recupere o contexto sem depender de memória local. Mantém-no atualizado
> ao fim de cada bloco de trabalho.
>
> **Última atualização:** 2026-06-30

---

## 1. O que é o projeto

Plataforma da **Ordem dos Médicos de Angola (ORMED)**: site público institucional + painel
de administração (gestão) + **portal do médico** (Área do Membro). Inclui serviços online
(inscrição, carteira profissional, renovação, declarações, cotas), banco de médicos, colégios
de especialidade, internatos/notas, instituições de ensino (Universidades/IES/INAAREES),
prescrição eletrónica e verificação pública por QR.

## 2. Dois repositórios (dois deploys)

| Repo | Pasta local | Stack | Deploy | Git remoto |
|------|-------------|-------|--------|------------|
| **Frontend** | `ordem-dos-medicos-angola` | Next.js 16 (App Router), React 19, Tailwind, framer-motion, lucide-react, recharts, Radix UI, next-themes, TypeScript | **Vercel** (auto no push para `main`) | `https://github.com/Inheal-ao/ormed.git` |
| **Backend** | `ormed-backend` | NestJS 10, Mongoose 8 (MongoDB), bcrypt, class-validator, JWT, Cloudinary, Helmet, Throttler | **Render** (auto no push, ~50s spin-up) | `https://github.com/Inheal-ao/ormed-backend.git` |

- As duas pastas estão lado a lado dentro de `…/ordem-dos-medicos-angola-COM-IMAGENS-FINAL/`.
- Vercel (exemplo de URL visto): `ormed-qx3s.vercel.app`.
- Node ≥ 20 (usa `fetch` global e `AbortSignal.timeout`).
- Frontend usa `trailingSlash` — **as rotas terminam em `/`** (ex.: `/area-membro/`).

### Padrão do backend (importante)
Cada módulo é um **único ficheiro compacto** com schema + DTOs + service + controller + module
juntos: `src/modules/<nome>/<nome>.module.ts`. Seguir este estilo ao criar/editar módulos.

## 3. Regras invioláveis (segurança)

- **Nunca commitar segredos.** Chaves (Turnstile, Gemini, Cloudinary, MongoDB, JWT, SMTP…)
  vivem **só** em variáveis de ambiente (Render/Vercel), nunca no código.
- Tratar chaves coladas pelo utilizador como confidenciais; verificar que nada sensível fica
  em staging antes de commitar.
- Ficheiros de documentação/credenciais gerados localmente estão **gitignored**.
- Mensagens de commit terminam com:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 4. Papéis e autenticação (RBAC)

`UserRole` (backend): `super_admin`, `admin` (legado), `editor` (legado), `bastonaria`,
`funcionario`, `universidade`, `colegio`.

- **RolesGuard:** `super_admin` e `bastonaria` passam **todas** as verificações `@Roles`.
  `funcionario` passa onde `@Roles` inclui `EDITOR` (e depois o **PermissionsGuard** restringe-o
  às secções das suas `permissions`). Para uma ação **exclusiva da Bastonária**, usar
  `@Roles(UserRole.BASTONARIA)` (só bastonária + super_admin passam).
- **Login admin:** JWT (email + password). Página `/admin/login`.
- **Portal do médico (Área do Membro):** **email + senha + código de 6 dígitos**. O médico
  gera/baixa/imprime os códigos em *Segurança*. Recuperar senha = email + um dos códigos.
  Backend `Member`: `passwordHash` + `recoveryCodesHash`; helper `memberCodeMatches` aceita o
  código legado (accessCode) OU de recuperação. Endpoints: `/members/portal/{login,set-password,
  recovery-codes,recover,has-password}`. Login legado (5 credenciais, "Primeiro acesso") mantido
  como bootstrap.
- `ConditionalChrome` esconde o header/footer do site nas rotas `/admin` e `/area-membro`
  (cada uma tem o seu próprio "shell").
- **Código de teste** dos médicos simulados: `123456` (não é segredo real).

## 5. Estado atual — o que já está feito

### Reestruturação Colégios/Médicos (6 fases — TODAS concluídas)
- 39 especialidades oficiais (upsert); colégios puxam especialidade da BD.
- `Member` estendido: situação (vigor/suspensa/cancelada) + motivo, `categorias[]`
  (clinico_geral/interno/especialista/orientador), `collegeId`, `simulado`, `photo`, `pais`.
  Acesso ao portal exige `vigor`.
- Internos ligados a `memberId` (sem digitar nomes); `MemberPicker` pesquisa o banco.
- `CategoryRequest` (atribuir interno/especialista/orientador) carece de aprovação da Bastonária
  (página Gestão → Aprovações). Regra: orientador só especialista.
- Notas de rotação = **Mapa de Registo de Habilidades** (competências, não 0-20); com estado
  rascunho/final + documento assinado; avaliador tem de ser orientador.
- Vista do **Médico Interno** no portal; perfis **IES/INAAREES** iguais ao da Universidade
  (`institutionType`).
- **Cotas** (módulo `quotas`): valores definidos só pela Bastonária; dívida = meses × (cota+multa);
  pagamento + recibo. Portal "As minhas cotas".
- **Prescrição eletrónica** (módulo `prescriptions`): médico emite receitas (verificado por
  código + situação vigor); lista local PT + augmentação RxNav/NLM gratuita; verificação pública
  `/receita/[code]`; caixa para farmácias em `/prescricao`.
- **QR do médico:** `GET /members/public/:numeroOrdem`; página pública `/medico/[numeroOrdem]`.
- Documentos oficiais impressos usam o SVG `/images/logo.svg`.
- **Médicos NÃO são criados manualmente** — só via aprovação de inscrição (risco legal).

### Site público / UI (jun 2026)
- **Páginas de serviço** (renovação, carteira, pagar-cotas, declaração) são **informativas**
  (componente `components/service-info.tsx`) e remetem para a Área do Membro. `/inscricao` e
  `/validacao` mantêm formulário (médicos novos/externos).
- **Header** redesenhado (`components/header.tsx`): pesquisa em destaque ao centro + menu de
  acesso (avatar → Área do Membro / Painel / Consultar). `searchBar()`/`accessMenu()` são
  funções chamadas inline (não `<Componente/>`) para o input não perder o foco.
- **Hero** (`components/hero.tsx`): fundo em 2 camadas — cópia **desfocada** (`bg-cover blur`)
  + **imagem inteira** (`bg-contain`) que **nunca corta** o sujeito, em qualquer ecrã. Conteúdo
  **ancorado ao topo** (reserva o header de 3 faixas), título `text-6xl`. Imagens 16:9 geradas
  com sharp em `public/images/*-wide.jpg` (script: encaixa a foto + fundo desfocado).
- **Painel admin** (`components/admin/admin-shell.tsx`): pesquisa em destaque no topo que salta
  para a secção; usa `useSearchParams` (layout envolto em `<Suspense>`) para distinguir
  Universidades/IES/INAAREES (mesmo caminho, `?tipo=`).
- **Consulta de médicos** (`/consulta-medicos`, dados mock): NÃO mostra o Nº de Ordem
  (privacidade); pesquisa só por nome.
- **+75 médicos simulados** (seed idempotente em `members`, insere só `numeroUtente` em falta).

### Fluxo Inscrição → 1ª Carteira + pedidos de documentos (jun 2026 — recém-feito)
Módulo `service-requests` (backend) + consola `components/admin/service-requests-console.tsx`.

**Máquina de estados:**
`recebido → em-analise → validado → aguarda-pagamento → pagamento-em-analise → pago →
enviado-bastonaria → aprovado-impressao → concluido`

- **Funcionário** (perm 'solicitacoes'): avalia, define pagamento, confirma pago,
  `PATCH /service-requests/:id/send-to-bastonaria` (só inscrição, só após pago),
  e `PATCH /service-requests/:id/emitida` (marca concluído + `credentialsIssued`; exige
  `aprovado-impressao`).
- **Bastonária** (exclusivo, `@Roles(BASTONARIA)`): `PATCH /service-requests/:id/bastonaria`
  `{decision: "aprovar"|"devolver"}`.
- A **emissão da carteira** = `RegistarMedicoModal` (cria o membro via `POST /members`, atribui
  nº de ordem) que só aparece em `aprovado-impressao`; ao concluir chama `/emitida`.
- Campos novos no schema: `memberNumeroOrdem`, `credentialsIssued`.
- `lib/service-requests.ts`: `FLOW_INSCRICAO` + `computeSteps(isPaid, status, isInscricao)`;
  `STATUS_META` ganhou `enviado-bastonaria` e `aprovado-impressao`.
- **Pedidos do médico:** `create()` só exige anexos em `inscricao`/`validacao-documentos`. A
  **Área do Membro → Serviços** submete pedidos reais (declaração, 2ª via carteira, renovação)
  e devolve um código. `/consultar?code=` auto-preenche e mostra estado/comprovativo/recibo.
- Enquanto não recebe credenciais, o candidato usa **/consultar** (nº/código do serviço).

## 6. Pendências / próximos passos

1. **Envio de email das credenciais (PENDENTE — falta SMTP).** Não há infra de email no backend.
   Hoje, no passo final, as **credenciais são geradas e mostradas à equipa** para entrega manual
   (o email do candidato aparece no modal). Falta criar um módulo de email (ex.: Brevo/Resend/
   SMTP) e ligar `SMTP_*` / `MAIL_*` nas env vars do **Render** (nunca no código) para envio
   automático: (a) credenciais ao concluir a inscrição; (b) notificações de mudança de estado.
2. **Fase 3 (Cloudinary)** — confirmar credenciais Cloudinary se ainda faltarem (uploads).
3. Possível: expandir a lista local de medicamentos da prescrição (~300).
4. Possível: "Os meus pedidos" no portal do médico (listar service-requests do próprio).

## 7. Comandos úteis

```bash
# Frontend
cd ordem-dos-medicos-angola
npm install
npm run dev            # desenvolvimento
npx tsc --noEmit       # typecheck
npm run build          # build de produção (validar antes de commitar)

# Backend
cd ormed-backend
npm install
npx tsc --noEmit       # typecheck
npm run start:dev      # desenvolvimento

# Deploy = git push origin main (Vercel/Render fazem auto-deploy)
```

## 8. Convenções de trabalho com o assistente

- Responder/escrever **em português (Angola)**.
- **Validar com build/typecheck** antes de commitar; commitar **e fazer push** dos dois repos
  quando aplicável (é o fluxo de deploy).
- Não criar médicos manualmente no painel (só por aprovação de inscrição).
- Nada que envolva médicos/especialidades/províncias é texto livre — puxa sempre do banco/listas.
- Há **memórias locais** do assistente (não estão no git) que detalham o histórico; este ficheiro
  é a fonte de verdade partilhável. Ao concluir trabalho relevante, **atualizar este ficheiro**.
