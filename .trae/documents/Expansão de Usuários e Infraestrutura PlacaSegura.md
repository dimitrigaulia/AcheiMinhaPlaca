# Expansão do Sistema PlacaSegura: Usuários, Admin, Postgres e Login Social

Implementarei a expansão do sistema seguindo os novos requisitos de cadastro completo, suporte a assinaturas, banco de dados local e login social.

## 1. Banco de Dados (PostgreSQL Local)
- **Reversão para Npgsql**: Alterar [DependencyInjection.cs](file:///c:/Users/User/Documents/trae_projects/AcheiMinhaPlaca/backend/PlacaSegura.Infrastructure/DependencyInjection.cs) para usar `UseNpgsql` em vez de `UseInMemoryDatabase`.
- **Configuração Local**: Ajustar o [appsettings.json](file:///c:/Users/User/Documents/trae_projects/AcheiMinhaPlaca/backend/PlacaSegura.Api/appsettings.json) para garantir que a ConnectionString aponte para o seu Postgres local.
- **Migrações**: Executar as migrações iniciais para criar a estrutura no banco físico.

## 2. Modelo de Dados e Assinaturas
- **Extensão da Entidade User**: Adicionar campos `FullName`, `ExternalProvider`, `ExternalId`, `SubscriptionType` e `SubscriptionExpiresAt` em [Entities.cs](file:///c:/Users/User/Documents/trae_projects/AcheiMinhaPlaca/backend/PlacaSegura.Domain/Entities/Entities.cs).
- **Enums**: Criar `SubscriptionType` (Free, Premium, etc.) em [Enums.cs](file:///c:/Users/User/Documents/trae_projects/AcheiMinhaPlaca/backend/PlacaSegura.Domain/Enums/Enums.cs).

## 3. Autenticação e Registro
- **Novo Fluxo de Registro**: Criar endpoint `POST /auth/register` para cadastro manual com campos adicionais.
- **Login Social (Google)**: Implementar endpoint `POST /auth/google` que valida o token do Google e cria/loga o usuário.
- **Cadastro de Admins**: Criar endpoint protegido (ou via flag de setup inicial) para registrar administradores para o backoffice.

## 4. Frontend (Angular)
- **Tela de Registro**: Nova página `/register` com formulário completo.
- **Integração Google**: Adicionar o botão "Entrar com Google" usando uma biblioteca padrão (como `@abacritt/angularx-social-login`).
- **Backoffice**: Estruturar a área administrativa `/app/admin` para gerenciamento de denúncias e usuários.

## 5. Monetização (Preparação)
- **Lógica de Freetier**: Implementar verificações no backend para limitar o número de anúncios/buscas para usuários do plano Free.

Deseja que eu proceda com essa implementação?
