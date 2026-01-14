// Inicialização dos elementos e eventos principais da interface
document.addEventListener('DOMContentLoaded', function() {
    // Botão para iniciar o jogo
    const iniciarBtn = document.querySelector('.iniciarJogo button');
    const selecaoClasse = document.querySelector('.selecaoClasse');
    const classes = document.querySelectorAll('.classe');
    const confirmarBtn = document.getElementById('confirmarClasse');
    let classeSelecionada = null;

    // Exibe a tela de seleção de classe ao clicar em iniciar
    iniciarBtn.addEventListener('click', function() {
        document.querySelector('.iniciarJogo').style.display = 'none';
        selecaoClasse.style.display = 'flex';
    });

    // Seleção de classe do herói
    classes.forEach(classe => {
        // Seleciona a classe ao clicar no card, nome ou imagem
        classe.addEventListener('click', function() {
            classes.forEach(c => c.classList.remove('selected'));
            classe.classList.add('selected');
            classeSelecionada = classe.getAttribute('data-classe');
            confirmarBtn.disabled = false;

            // Toca o áudio de seleção de personagem
            const audio = document.getElementById('audio-selecionar-personagem');
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }
        });

        // Permite selecionar clicando no nome
        const nome = classe.querySelector('p');
        nome.addEventListener('click', function(e) {
            e.stopPropagation();
            classe.click();
        });

        // Permite selecionar clicando na imagem
        const imagem = classe.querySelector('img');
        imagem.addEventListener('click', function(e) {
            e.stopPropagation();
            classe.click();
        });
    });

    // Confirmação da classe escolhida e início do jogo
    confirmarBtn.addEventListener('click', function() {
        if (classeSelecionada) {
            // Toca o áudio de confirmação de personagem
            const audioConfirmar = document.getElementById('audio-confirmar-personagem');
            if (audioConfirmar) {
                audioConfirmar.currentTime = 0;
                audioConfirmar.play();
            }

            // Inicia o áudio de batalha em loop
            const audioBatalha = document.getElementById('audio-batalha');
            if (audioBatalha) {
                audioBatalha.currentTime = 0;
                audioBatalha.play();
            }

            selecaoClasse.style.display = 'none';
            iniciarJogo(classeSelecionada);
        }
    });

    // Controle do áudio de fundo (tema principal)
    const audio = document.getElementById('musica-fundo');
    audio.muted = false;
    audio.volume = 0.5;
    audio.play().catch(() => {});

    const btnAudio = document.getElementById('toggle-audio');
    let audioAtivo = true;

    btnAudio.onclick = function() {
        if (audio.paused) {
            audio.play();
            btnAudio.textContent = "🔊";
            audioAtivo = true;
        } else {
            audio.pause();
            btnAudio.textContent = "🔇";
            audioAtivo = false;
        }
    };

    // Atualiza o ícone do botão de áudio conforme o estado
    audio.onplay = () => btnAudio.textContent = "🔊";
    audio.onpause = () => btnAudio.textContent = "🔇";
});

// Classe base para personagens do jogo
class Personagem {
    constructor(nome, vida, ataque, defesa) {
        this.nome = nome;
        this.vida = vida;
        this.ataque = ataque;
        this.defesa = defesa;
    }

    // Aplica dano ao personagem, considerando a defesa
    receberDano(dano) {
        const danoFinal = Math.max(dano - this.defesa, 0);
        this.vida = Math.max(this.vida - danoFinal, 0);
        console.log(`${this.nome} recebeu ${danoFinal} de dano!\nVida restante: ${this.vida}\n`);
    }

    // Verifica se o personagem ainda está vivo
    estaVivo() {
        return this.vida > 0;
    }
}

// Herói do jogador (classe base para Guerreiro, Mago e Arqueiro)
class Heroi extends Personagem {
    constructor(nome, vida, ataque, defesa, mana) {
        super(nome, vida, ataque, defesa);
        this.mana = mana;
    }
}

// Classe Guerreiro (herói)
class Guerreiro extends Heroi {
    constructor() {
        super("Arthur, o Guerreiro", 100, 20, 10, 30);
        this.maxVida = 100;
        this.maxMana = 30;
    }

    // Ataque normal do Guerreiro
    atacar() {
        const msg = `${this.nome} ataca com sua espada!`;
        return { dano: this.ataque, msg };
    }

    // Ataque especial do Guerreiro
    ataqueEspecial() {
        if (this.mana >= 10) {
            this.mana -= 10;
            const msg = `${this.nome} usa um ataque especial com a espada!`;
            return { dano: this.ataque * 2, msg };
        } else {
            const msg = `Mana insuficiente, ${this.nome} usa um ataque normal!`;
            return { dano: this.ataque, msg };
        }
    }
}

// Classe Mago (herói)
class Mago extends Heroi {
    constructor() {
        super("Merlin, o Mago", 60, 25, 5, 100);
        this.maxVida = 60;
        this.maxMana = 100;
    }

    // Ataque normal do Mago
    atacar() {
        const msg = `${this.nome} lança uma bola de fogo!`;
        return { dano: this.ataque, msg };
    }

    // Ataque especial do Mago
    ataqueEspecial() {
        if (this.mana >= 20) {
            this.mana -= 20;
            const msg = `${this.nome} invoca uma tempestade de raios!`;
            return { dano: this.ataque * 2.5, msg };
        } else {
            const msg = `Mana insuficiente, ${this.nome} lança uma bola de fogo!`;
            return { dano: this.ataque, msg };
        }
    }
}

// Classe Arqueiro (herói)
class Arqueiro extends Heroi {
    constructor() {
        super("Robin, o Arqueiro", 75, 15, 7, 60);
        this.maxVida = 75;
        this.maxMana = 60;
    }

    // Ataque normal do Arqueiro
    atacar() {
        const msg = `${this.nome} atira com sua flecha!`;
        return { dano: this.ataque, msg };
    }

    // Ataque especial do Arqueiro
    ataqueEspecial() {
        if (this.mana >= 15) {
            this.mana -= 15;
            const msg = `${this.nome} lança uma saraivada de flechas!`;
            return { dano: this.ataque * 3, msg };
        } else {
            const msg = `Mana insuficiente, ${this.nome} atira uma flecha!`;
            return { dano: this.ataque, msg };
        }
    }
}

// Classe base para inimigos
class Inimigo extends Personagem {
    constructor(nome, vida, ataque, defesa) {
        super(nome, vida, ataque, defesa);
    }
}

// Classe Goblin (inimigo)
class Goblin extends Inimigo {
    constructor() {
        super("Goblin", 15, 10, 0);
        this.maxVida = 15;
    }
    atacar() {
        const msg = `${this.nome} te apunhala!`;
        return { dano: this.ataque, msg };
    }
}

// Classe Orc (inimigo)
class Orc extends Inimigo {
    constructor() {
        super("Orc", 30, 20, 5);
        this.maxVida = 30;
    }
    atacar() {
        const msg = `${this.nome} avança ferozmente!`;
        return { dano: this.ataque, msg };
    }
}

// Classe Dragão (inimigo)
class Dragao extends Inimigo {
    constructor() {
        super("Dragão", 100, 30, 10);
        this.maxVida = 100;
    }
    atacar() {
        const msg = `${this.nome} lança uma baforada de fogo!`;
        return { dano: this.ataque, msg };
    }
}

// Classe responsável pelo fluxo do combate
class Combate {
    async iniciarCombate(heroi, inimigo) {
        atualizarInterface(heroi, inimigo);

        const btnAtaque = document.getElementById('btn-ataque');
        const btnEspecial = document.getElementById('btn-especial');

        // Remove eventos antigos dos botões
        btnAtaque.onclick = null;
        btnEspecial.onclick = null;

        btnAtaque.disabled = false;
        btnEspecial.disabled = false;

        // Mostra feedback visual do surgimento do inimigo
        feedbackInimigoAparece(inimigo);
        await new Promise(res => setTimeout(res, 1000)); // Aguarda 1 segundo para leitura

        return new Promise(resolve => {
            let turnoJogador = true;

            function proximoTurno() {
                atualizarInterface(heroi, inimigo);
                atualizarTurnoIndicador(turnoJogador, heroi.nome);

                // Verifica fim do combate
                if (!heroi.estaVivo() || !inimigo.estaVivo()) {
                    btnAtaque.disabled = true;
                    btnEspecial.disabled = true;
                    return setTimeout(() => resolve(), 1000);
                }

                if (turnoJogador) {
                    btnAtaque.disabled = false;
                    btnEspecial.disabled = false;
                } else {
                    btnAtaque.disabled = true;
                    btnEspecial.disabled = true;
                    setTimeout(() => {
                        if (inimigo.estaVivo()) {
                            const resultado = inimigo.atacar();
                            const vidaAntes = heroi.vida;
                            heroi.receberDano(resultado.dano);
                            const danoReal = Math.max(0, vidaAntes - heroi.vida);

                            // Toca o som do ataque do inimigo
                            tocarSomAtaqueInimigo(inimigo);

                            logBatalha(`${resultado.msg} Causou ${danoReal} de dano!`);
                            atualizarInterface(heroi, inimigo);
                            setTimeout(() => {
                                turnoJogador = true;
                                proximoTurno();
                            }, 1000); // Aguarda 1 segundo para leitura
                        } else {
                            turnoJogador = true;
                            proximoTurno();
                        }
                    }, 1000);
                }
            }

            // Evento do botão de ataque normal
            btnAtaque.onclick = () => {
                if (!turnoJogador) return;
                const resultado = heroi.atacar();
                const vidaAntes = inimigo.vida;
                inimigo.receberDano(resultado.dano);
                const danoReal = Math.max(0, vidaAntes - inimigo.vida);

                // Toca o som do ataque do herói
                tocarSomAtaque(heroi);

                logBatalha(`${resultado.msg} Causou ${danoReal} de dano!`);
                turnoJogador = false;
                setTimeout(proximoTurno, 1000);
            };

            // Evento do botão de ataque especial
            btnEspecial.onclick = () => {
                if (!turnoJogador) return;
                const resultado = heroi.ataqueEspecial();
                const vidaAntes = inimigo.vida;
                inimigo.receberDano(resultado.dano);
                const danoReal = Math.max(0, vidaAntes - inimigo.vida);

                // Toca o som do ataque do herói
                tocarSomAtaque(heroi);

                logBatalha(`${resultado.msg} Causou ${danoReal} de dano!`);
                turnoJogador = false;
                setTimeout(proximoTurno, 1000);
            };

            proximoTurno();
        });
    }
}

// Função principal para iniciar o jogo e o fluxo de batalhas
async function iniciarJogo(classe) {
    document.querySelector('.batalha').style.display = 'flex';

    let jogador;
    switch (classe) {
        case "guerreiro":
            jogador = new Guerreiro();
            break;
        case "mago":
            jogador = new Mago();
            break;
        case "arqueiro":
            jogador = new Arqueiro();
            break;
        default:
            return;
    }

    const combate = new Combate();

    // Sequência de batalhas contra Goblin, Orc e Dragão
    await combate.iniciarCombate(jogador, new Goblin());
    await combate.iniciarCombate(jogador, new Orc());
    await combate.iniciarCombate(jogador, new Dragao());

    // Exibe modal de vitória ou derrota e pausa o áudio de batalha
    if (jogador.estaVivo()) {
        document.querySelector('.batalha').style.display = 'none';
        document.getElementById('modal-vitoria').style.display = 'flex';
        const audioBatalha = document.getElementById('audio-batalha');
        if (audioBatalha) audioBatalha.pause();
        document.getElementById('btn-voltar-inicio').onclick = () => {
            document.getElementById('modal-vitoria').style.display = 'none';
            document.querySelector('.iniciarJogo').style.display = 'flex';
            window.location.reload();
        };
    } else {
        document.querySelector('.batalha').style.display = 'none';
        document.getElementById('modal-derrota').style.display = 'flex';
        const audioBatalha = document.getElementById('audio-batalha');
        if (audioBatalha) audioBatalha.pause();
        document.getElementById('btn-voltar-inicio-derrota').onclick = () => {
            document.getElementById('modal-derrota').style.display = 'none';
            document.querySelector('.iniciarJogo').style.display = 'flex';
            window.location.reload();
        };
    }
}

// Atualiza a interface de batalha com status do jogador e inimigo
function atualizarInterface(jogador, inimigo) {
    // Atualiza nome e barras do jogador
    document.getElementById('player-nome').textContent = jogador.nome;
    const hpAtual = jogador.vida;
    const hpMax = jogador.maxVida || jogador.vidaMaxima || jogador.vida_inicial || jogador.constructor.prototype.vida || 100;
    document.getElementById('player-hp-bar').style.width = `${Math.max(0, (hpAtual / hpMax) * 100)}%`;
    document.getElementById('player-vida-text').textContent = `${hpAtual} / ${hpMax}`;
    const manaAtual = jogador.mana !== undefined ? jogador.mana : 0;
    const manaMax = jogador.maxMana || jogador.manaMaxima || jogador.mana_inicial || 100;
    document.getElementById('player-mana-bar').style.width = `${Math.max(0, (manaAtual / manaMax) * 100)}%`;
    document.getElementById('player-mana-text').textContent = `${manaAtual} / ${manaMax}`;
    document.querySelector('.battle-player .battle-img').innerHTML =
        `<img src="${obterImagemPersonagem(jogador)}" alt="${jogador.nome}" style="width:100%;height:100%;object-fit:contain;">`;

    // Atualiza nome e barra do inimigo
    document.getElementById('enemy-nome').textContent = inimigo.nome;
    const enemyHpAtual = inimigo.vida;
    const enemyHpMax = inimigo.maxVida || inimigo.vidaMaxima || inimigo.vida_inicial || inimigo.constructor.prototype.vida || 100;
    document.getElementById('enemy-hp-bar').style.width = `${Math.max(0, (enemyHpAtual / enemyHpMax) * 100)}%`;
    document.getElementById('enemy-vida-text').textContent = `${enemyHpAtual} / ${enemyHpMax}`;
    document.querySelector('.battle-enemy .battle-img').innerHTML =
        `<img src="${obterImagemPersonagem(inimigo)}" alt="${inimigo.nome}" style="width:100%;height:100%;object-fit:contain;">`;
}

// Retorna o caminho da imagem do personagem ou inimigo
function obterImagemPersonagem(personagem) {
    if (personagem instanceof Guerreiro) return 'img/cavaleiro.png';
    if (personagem instanceof Mago) return 'img/mago.png';
    if (personagem instanceof Arqueiro) return 'img/arqueiro.png';
    if (personagem instanceof Goblin) return 'img/goblin.png';
    if (personagem instanceof Orc) return 'img/orc.png';
    if (personagem instanceof Dragao) return 'img/dragao.png';
    return '';
}

// Atualiza o log de batalha visual
function logBatalha(msg) {
    document.getElementById('battle-log').textContent = msg;
}

// Mostra mensagem visual quando um inimigo aparece
function feedbackInimigoAparece(inimigo) {
    let msg = "";
    if (inimigo instanceof Goblin) msg = "Um Goblin aparece das sombras!";
    else if (inimigo instanceof Orc) msg = "Um Orc horrendo surge diante de você!";
    else if (inimigo instanceof Dragao) msg = "Um Dragão rasga os céus e pousa à sua frente!";
    else msg = `Um ${inimigo.nome} apareceu!`;
    logBatalha(msg);
}

// Atualiza o indicador visual de turno
function atualizarTurnoIndicador(ehTurnoHeroi, nomeHeroi) {
    const el = document.getElementById('turno-indicador');
    if (ehTurnoHeroi) {
        el.textContent = `Turno atual: ${nomeHeroi}`;
        el.style.color = "#ffe066";
    } else {
        el.textContent = "Turno atual: Inimigo";
        el.style.color = "#ff6666";
    }
}

// Toca o efeito sonoro do ataque do herói, conforme a classe
function tocarSomAtaque(heroi) {
    let audio;
    if (heroi instanceof Guerreiro) {
        audio = document.getElementById('audio-knight');
    } else if (heroi instanceof Mago) {
        audio = document.getElementById('audio-mage');
    } else if (heroi instanceof Arqueiro) {
        audio = document.getElementById('audio-archer');
    }
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

// Toca o efeito sonoro do ataque do inimigo, conforme o tipo
function tocarSomAtaqueInimigo(inimigo) {
    let audio;
    if (inimigo instanceof Goblin) {
        audio = document.getElementById('audio-goblin');
    } else if (inimigo instanceof Orc) {
        audio = document.getElementById('audio-orc');
    } else if (inimigo instanceof Dragao) {
        audio = document.getElementById('audio-dragao');
    }
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

// Toca o áudio de início do jogo ao clicar no botão inicial
const btnIniciar = document.querySelector('.iniciarJogo button');
btnIniciar.onclick = function() {
    const audio = document.getElementById('audio-comecar-jogo');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
};

// Função para verificar orientação e ajustar interface
function verificarOrientacao() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const warning = document.getElementById('portrait-warning');
    const iniciarJogo = document.querySelector('.iniciarJogo');
    const gameElements = document.querySelectorAll('.selecaoClasse, .batalha, .modal-vitoria, .modal-derrota');
    const buttons = document.querySelectorAll('button:not(#toggle-audio)'); // Exclude audio toggle

    if (isPortrait) {
        // Mostrar aviso e esconder jogo
        warning.style.display = 'flex';
        iniciarJogo.style.display = 'none';
        gameElements.forEach(el => el.style.display = 'none');
        // Desabilitar botões do jogo
        buttons.forEach(btn => btn.disabled = true);
    } else {
        // Esconder aviso e restaurar tela inicial
        warning.style.display = 'none';
        iniciarJogo.style.display = 'flex'; // Restaurar tela inicial
        // Outros elementos permanecem ocultos até ativados pela lógica do jogo
        // Reabilitar botões (lógica existente cuidará do estado)
        buttons.forEach(btn => btn.disabled = false);
    }
}

// Adicionar listeners para mudança de orientação
window.addEventListener('orientationchange', verificarOrientacao);
window.addEventListener('resize', verificarOrientacao); // Fallback para resize

// Verificar orientação inicial
document.addEventListener('DOMContentLoaded', function() {
    verificarOrientacao(); // Adicionar chamada inicial
});
