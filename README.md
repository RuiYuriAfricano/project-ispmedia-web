# ISPMEDIA

# Sumário

- Introdução
- Funcionalidades
- Tecnologias Utilizadas
- Estrutura do Projeto
- Instalação e Execução
- Capturas de Tela
- Contribuindo

# Introdução

O ISPMEDIA é uma plataforma digital de gestão e partilha de conteúdos multimídia, destinada a estudantes do ISPTEC. A plataforma permite a gestão, partilha e consulta de músicas, vídeos e outros conteúdos multimídia, com funcionalidades semelhantes ao YouTube, Spotify, AllMusic, Dropbox, Google Drive e OneDrive.

# Funcionalidades

-	Gestão de Conteúdos Multimídia: Criação, edição e partilha de músicas, vídeos e outros conteúdos.
-	Informações Detalhadas: Exibição de informações sobre autores, álbuns, grupos musicais, compositores, letras, concertos, e outros.
-	Críticas e Avaliações: Possibilidade de escrever e consultar críticas sobre os conteúdos partilhados.
-	Partilha de Ficheiros: Transferência e partilha de ficheiros (MP3, FLAC, MP4, WMV, etc.) entre utilizadores.
-	Conta de Utilizador: Acesso restrito a estudantes do ISPTEC.

# Tecnologias Utilizadas
-	Front-End:

o	React.js

o	React Native

-	Back-End:

o	NestJS

o	Prisma ORM

-	Armazenamento:
MySQL

# Estrutura do Projeto

-	ISPMEDIA/
-	├── web/               # Código do front-end (React.js)
-	├── mobile/            # Código do mobile (React Native)
-	├── proxy-server/      # Código do servidor proxy para intermediar a ligação entre o cliente e servidor(NestJS)
-	├── server/            # Código do back-end (NestJS)
-	├── prisma/            # Configuração do Prisma ORM
-	└── README.md

# Instalação e Execução

1. Pré-requisitos

-	Node.js
-	NPM
-	MySQL (ou outro SGBD)
-	FFMPEG
-	CERTIFICADO SSL

2. Instalação

1.	Clone o repositório:
- https://github.com/RuiYuriAfricano/project-ispmedia-api
- https://github.com/RuiYuriAfricano/project-ispmedia-web
- https://github.com/josedomingos919/ispmedia-mobile-app/
- https://github.com/RuiYuriAfricano/ispmedia-proxy-server.git
2.	Navegue até o diretório do projeto:
bash

Copiar código

cd ISPMEDIA

3.	Instale as dependências do servidor:
bash

Copiar código

cd server

npm install

4.	Instale as dependências do cliente:

bash

Copiar código

cd ../client

npm install

5.	Instale as dependências do mobile:

bash

Copiar código

cd ../mobile

npm install

6.	Passos para Instalar um Certificado SSL nos Certificados Fidedignos no Windows

	Abrir o Gerenciador de Certificados:

	Pressione Win + R para abrir a caixa de diálogo Executar.

	Digite certmgr.msc e pressione Enter. Isso abrirá o Gerenciador de Certificados do Windows.

	Selecionar o Repositório de Certificados Fidedignos:

	No painel esquerdo, expanda "Certificados - Usuário Atual".

	Expanda "Autoridades de Certificação Raiz Confiáveis" (ou "Trusted Root Certification Authorities").

	Clique com o botão direito na pasta "Certificados" e selecione "Todas as Tarefas" -> "Importar...".

	Assistente para Importação de Certificados:

	Isso abrirá o Assistente para Importação de Certificados. Clique em "Avançar" na primeira tela.

	Clique em "Procurar..." para localizar o arquivo do certificado SSL que você deseja importar (geralmente com extensão .cer, .crt, .pem).

	Selecione o arquivo do certificado e clique em "Abrir".

	Clique em "Avançar".

	Escolher o Repositório de Certificados:

	Na tela "Localização do Certificado", escolha "Colocar todos os certificados no repositório a seguir".

	Certifique-se de que "Autoridades de Certificação Raiz Confiáveis" (ou "Trusted Root Certification Authorities") está selecionado.

	Clique em "Avançar".

	Completar a Importação:

	Revise as informações na tela de resumo.

	Clique em "Concluir" para finalizar o processo de importação.

	Confirmação de Sucesso:

	Uma mensagem deve aparecer informando que a importação foi bem-sucedida.

	Clique em "OK".

7.	Baixe e Instale o FFMPEG:
Para instalar o FFmpeg, um popular conjunto de ferramentas para manipulação de arquivos de áudio e vídeo, os pré-requisitos variam dependendo do sistema operacional que você está usando. Aqui estão os passos gerais para os principais sistemas operacionais:
Windows

Pré-requisitos

-	Sistema Operacional: Windows 7 ou superior

Passos para Instalação

1.	Baixe o FFmpeg:

o	Vá para o site oficial do FFmpeg: FFmpeg Downloads.
o	Clique em "Windows" e escolha um dos builds disponíveis (por exemplo, builds de terceiros como ffmpeg.zeranoe.com ou gyan.dev).


2.	Extraia os Arquivos:

o	Extraia o conteúdo do arquivo ZIP baixado para uma pasta de sua escolha.

3.	Adicione FFmpeg ao PATH:

-	Abra as "Configurações do Sistema" e vá para "Sistema" -> "Informações do Sistema" -> "Configurações avançadas do sistema".
-	Clique em "Variáveis de Ambiente" e encontre a variável "Path" na seção "Variáveis do Sistema".
-	Edite a variável "Path" e adicione o caminho para a pasta onde você extraiu os arquivos do FFmpeg (por exemplo, C:\ffmpeg\bin).

4.	Verifique a Instalação:
o	Abra o Prompt de Comando e digite ffmpeg -version para verificar se o FFmpeg está corretamente instalado.
macOS

Pré-requisitos

-	Sistema Operacional: macOS 10.6 ou superior
-	Homebrew: Gerenciador de pacotes para macOS

Passos para Instalação

1.	Instale o Homebrew (se ainda não estiver instalado):
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

2.	Instale o FFmpeg via Homebrew:
•	No Terminal, execute o seguinte comando
•	brew install ffmpeg

Verifique a Instalação:
-	No Terminal, digite ffmpeg -version para verificar se o FFmpeg está corretamente instalado.
Linux
Pré-requisitos
-	Sistema Operacional: Distribuição Linux com gerenciador de pacotes (apt, yum, dnf, etc.)
Passos para Instalação
Debian/Ubuntu
1.	Atualize os Repositórios:
sudo apt update


2.	Instale o FFmpeg:
-	Execute o seguinte comando:
sudo apt install ffmpeg

3.	Verifique a Instalação:
-	No Terminal, digite ffmpeg -version para verificar se o FFmpeg está corretamente instalado.
Execução
1.	Inicie o servidor:
bash
Copiar código
cd server
npm run start
2.	Inicie o cliente web:
bash
Copiar código
cd ../client
npm start
3.	Inicie o aplicativo mobile:
bash
Copiar código
cd ../mobile
npm start
4.	Inicie o servidor-proxy (se necessário):
bash
Copiar código
cd server
yarn start:dev

# Capturas de Tela

Página de Login
![image](https://github.com/user-attachments/assets/e6be31ee-6f35-4e92-a177-f2f3ff585197)

Página Inicial

![image](https://github.com/user-attachments/assets/170106bd-7bec-48c5-8ad4-5e6c69feb3ff)

 
Detalhes do Conteúdo

![Captura de Ecrã (756)](https://github.com/user-attachments/assets/34099334-ea95-4aed-b1fe-c2f3bba0c91f)



