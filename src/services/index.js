import { auth } from "./auth";
import { grupoMusical } from "./grupomusical";
import { artista } from "./artista";
import { album } from "./album";
import { musica } from "./musica";
import { video } from "./video";
import { participacaoMusica } from "./participacaoMusica";
import { participacaoVideo } from "./participacaoVideo";
import { playlist } from "./playlist";
import { musicasDaPlaylist } from "./musicasDaPlaylist";
import { videosDaPlaylist } from "./videosDaPlaylist"
import { grupoDeAmigos } from "./grupoDeAmigos";
import { membrosDosGrupos } from "./membrosDosGrupos";
import { conteudoDosGrupos } from "./conteudoDosGrupos";
import { criticas } from "./criticas";
import { notificacao } from "./notificacao";

export const service = {
  auth, grupoMusical, artista, album, musica, video, participacaoMusica, participacaoVideo,
  playlist, musicasDaPlaylist, videosDaPlaylist, grupoDeAmigos, membrosDosGrupos, conteudoDosGrupos,
  criticas, notificacao
};
